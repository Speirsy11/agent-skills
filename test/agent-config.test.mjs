import assert from "node:assert/strict";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { loadCatalog, packageRoot } from "../src/catalog.mjs";
import { executeInstall } from "../src/install.mjs";

async function project() {
  return fs.mkdtemp(path.join(os.tmpdir(), "agent-config-test-"));
}

test("catalog exposes only the chosen skill categories", async () => {
  const catalog = await loadCatalog(packageRoot);
  assert.deepEqual([...new Set(catalog.skills.map((skill) => skill.category))], ["development", "homelab", "misc"]);
  assert.equal(catalog.skills.length, 42);
  assert.ok(catalog.instructions.some((instruction) => instruction.id === "typescript-safety"));
  assert.ok(!catalog.skills.find((skill) => skill.id === "rendercv").description.startsWith(">"));
});

test("repository Claude instructions delegate to the canonical AGENTS.md", async () => {
  assert.equal(await fs.readFile(path.join(packageRoot, "CLAUDE.md"), "utf8"), "@AGENTS.md\n");
});

test("installs selected instructions and skills without replacing handwritten guidance", async (t) => {
  const target = await project();
  t.after(() => fs.rm(target, { recursive: true, force: true }));
  await fs.writeFile(path.join(target, "AGENTS.md"), "# Project\n\nKeep this project note.\n");
  await fs.writeFile(path.join(target, "CLAUDE.md"), "# Claude-only note\n");
  const catalog = await loadCatalog(packageRoot);
  const instruction = catalog.instructions.find((item) => item.id === "typescript-safety");
  const skill = catalog.skills.find((item) => item.id === "tdd");

  await executeInstall({ target, instructions: [instruction], skills: [skill], agents: ["codex", "claude"] });

  const agents = await fs.readFile(path.join(target, "AGENTS.md"), "utf8");
  const claude = await fs.readFile(path.join(target, "CLAUDE.md"), "utf8");
  assert.match(agents, /Keep this project note/);
  assert.match(agents, /Never use `as any`/);
  assert.equal((agents.match(/<!-- agent-config:start -->/g) || []).length, 1);
  assert.match(claude, /# Claude-only note/);
  assert.match(claude, /^@AGENTS\.md$/m);
  await fs.access(path.join(target, ".agents", "skills", "tdd", "SKILL.md"));
  await fs.access(path.join(target, ".claude", "skills", "tdd", "SKILL.md"));

  await executeInstall({ target, instructions: [instruction], skills: [skill], agents: ["codex", "claude"] });
  const secondAgents = await fs.readFile(path.join(target, "AGENTS.md"), "utf8");
  const secondClaude = await fs.readFile(path.join(target, "CLAUDE.md"), "utf8");
  assert.equal((secondAgents.match(/<!-- agent-config:start -->/g) || []).length, 1);
  assert.equal((secondClaude.match(/^@AGENTS\.md$/gm) || []).length, 1);
});

test("detects changed skill directories before writing anything", async (t) => {
  const target = await project();
  t.after(() => fs.rm(target, { recursive: true, force: true }));
  const conflict = path.join(target, ".agents", "skills", "tdd");
  await fs.mkdir(conflict, { recursive: true });
  await fs.writeFile(path.join(conflict, "SKILL.md"), "locally changed\n");
  const catalog = await loadCatalog(packageRoot);
  const instruction = catalog.instructions.find((item) => item.id === "typescript-safety");
  const skill = catalog.skills.find((item) => item.id === "tdd");

  await assert.rejects(
    executeInstall({ target, instructions: [instruction], skills: [skill], agents: ["codex"] }),
    (error) => error.code === "SKILL_CONFLICT"
  );
  await assert.rejects(fs.access(path.join(target, "AGENTS.md")));
});

test("refuses to append beside a malformed managed instruction block", async (t) => {
  const target = await project();
  t.after(() => fs.rm(target, { recursive: true, force: true }));
  await fs.writeFile(path.join(target, "AGENTS.md"), "<!-- agent-config:start -->\nunfinished\n");
  const catalog = await loadCatalog(packageRoot);
  const instruction = catalog.instructions.find((item) => item.id === "typescript-safety");

  await assert.rejects(
    executeInstall({ target, instructions: [instruction], skills: [], agents: ["codex"] }),
    /malformed agent-config managed block/
  );
});

test("keeps a CLAUDE.md symlink to AGENTS.md and rejects other symlinks", async (t) => {
  const target = await project();
  t.after(() => fs.rm(target, { recursive: true, force: true }));
  await fs.writeFile(path.join(target, "AGENTS.md"), "# Existing\n");
  await fs.symlink("AGENTS.md", path.join(target, "CLAUDE.md"));
  const catalog = await loadCatalog(packageRoot);
  const instruction = catalog.instructions.find((item) => item.id === "typescript-safety");

  await executeInstall({ target, instructions: [instruction], skills: [], agents: ["claude"] });
  assert.equal(await fs.readlink(path.join(target, "CLAUDE.md")), "AGENTS.md");

  await fs.rm(path.join(target, "CLAUDE.md"));
  await fs.writeFile(path.join(target, "elsewhere.md"), "# Elsewhere\n");
  await fs.symlink("elsewhere.md", path.join(target, "CLAUDE.md"));
  await assert.rejects(
    executeInstall({ target, instructions: [instruction], skills: [], agents: ["claude"] }),
    /does not point to AGENTS\.md/
  );
});

test("refuses skill writes through a symlinked parent directory", async (t) => {
  const target = await project();
  const outside = await project();
  t.after(() => Promise.all([
    fs.rm(target, { recursive: true, force: true }),
    fs.rm(outside, { recursive: true, force: true }),
  ]));
  await fs.mkdir(path.join(target, ".agents"));
  await fs.symlink(outside, path.join(target, ".agents", "skills"));
  const catalog = await loadCatalog(packageRoot);
  const skill = catalog.skills.find((item) => item.id === "tdd");

  await assert.rejects(
    executeInstall({ target, instructions: [], skills: [skill], agents: ["codex"] }),
    /symlinked parent directory/
  );
  await assert.rejects(fs.access(path.join(outside, "tdd")));
});

test("preflights every destination before applying a mixed install", async (t) => {
  const target = await project();
  t.after(() => fs.rm(target, { recursive: true, force: true }));
  await fs.writeFile(path.join(target, ".claude"), "not a directory\n");
  const catalog = await loadCatalog(packageRoot);
  const instruction = catalog.instructions.find((item) => item.id === "typescript-safety");
  const skill = catalog.skills.find((item) => item.id === "tdd");

  await assert.rejects(
    executeInstall({ target, instructions: [instruction], skills: [skill], agents: ["codex", "claude"] }),
    /ENOTDIR|not a directory/
  );
  await assert.rejects(fs.access(path.join(target, "AGENTS.md")));
  await assert.rejects(fs.access(path.join(target, ".agents")));
});

test("a staging failure leaves the project untouched", async (t) => {
  const target = await project();
  t.after(() => fs.rm(target, { recursive: true, force: true }));
  const catalog = await loadCatalog(packageRoot);
  const instruction = catalog.instructions.find((item) => item.id === "typescript-safety");
  const missingSkill = { id: "missing-skill", source: path.join(target, "does-not-exist") };

  await assert.rejects(
    executeInstall({ target, instructions: [instruction], skills: [missingSkill], agents: ["codex"] }),
    /ENOENT/
  );
  await assert.rejects(fs.access(path.join(target, "AGENTS.md")));
  await assert.rejects(fs.access(path.join(target, ".agents")));
  assert.deepEqual((await fs.readdir(target)).filter((name) => name.startsWith(".agent-config-stage-")), []);
});
