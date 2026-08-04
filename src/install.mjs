import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const START = "<!-- agent-config:start -->";
const END = "<!-- agent-config:end -->";

async function pathInfo(filePath) {
  try {
    return await fs.lstat(filePath);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function listFiles(directory, relative = "") {
  const entries = await fs.readdir(path.join(directory, relative), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryRelative = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(directory, entryRelative));
    else files.push(entryRelative);
  }
  return files.sort();
}

async function directoryDigest(directory) {
  const root = await pathInfo(directory);
  if (!root || (!root.isDirectory() && !root.isSymbolicLink())) {
    throw new Error(`Not a skill directory: ${directory}`);
  }
  const hash = createHash("sha256");
  for (const relative of await listFiles(directory)) {
    hash.update(relative);
    const absolute = path.join(directory, relative);
    const stat = await fs.lstat(absolute);
    hash.update(stat.isSymbolicLink() ? await fs.readlink(absolute) : await fs.readFile(absolute));
  }
  return hash.digest("hex");
}

function renderManagedInstructions(instructions) {
  const sections = instructions.map((instruction) =>
    `## ${instruction.title}\n\n${instruction.body.trim()}`
  );
  return `${START}\n# Shared agent instructions\n\n${sections.join("\n\n")}\n${END}`;
}

function mergeManagedBlock(existing, block) {
  const start = existing.indexOf(START);
  const end = existing.indexOf(END);
  if ((start >= 0) !== (end >= 0) || (end >= 0 && end < start)) {
    throw new Error("AGENTS.md has a malformed agent-config managed block; repair its markers before continuing");
  }
  if (start >= 0 && end > start) {
    return `${existing.slice(0, start)}${block}${existing.slice(end + END.length)}`;
  }
  if (!existing.trim()) return `${block}\n`;
  return `${existing.trimEnd()}\n\n${block}\n`;
}

async function validateClaudeShim(target) {
  const file = path.join(target, "CLAUDE.md");
  const info = await pathInfo(file);
  if (info?.isSymbolicLink()) {
    const link = await fs.readlink(file);
    const resolved = path.resolve(path.dirname(file), link);
    if (resolved === path.join(target, "AGENTS.md")) return;
    throw new Error(`Refusing to update CLAUDE.md symlink that does not point to AGENTS.md: ${file}`);
  }
  if (info && !info.isFile()) throw new Error(`Refusing to replace non-file CLAUDE.md: ${file}`);
}

async function planClaudeShim(target) {
  const file = path.join(target, "CLAUDE.md");
  const info = await pathInfo(file);
  if (info?.isSymbolicLink()) return { event: { action: "unchanged", path: file } };
  const current = info ? await fs.readFile(file, "utf8") : "";
  if (/^\s*@AGENTS\.md\s*$/m.test(current)) return { event: { action: "unchanged", path: file } };

  const content = current.trim()
    ? `${current.trimEnd()}\n\n<!-- agent-config: shared instructions -->\n@AGENTS.md\n`
    : "@AGENTS.md\n";
  return { operation: { type: "file", path: file, content }, event: { action: "write", path: file } };
}

function destinationsFor(target, agents, skill) {
  const destinations = [];
  if (agents.includes("codex")) destinations.push(path.join(target, ".agents", "skills", skill.id));
  if (agents.includes("claude")) destinations.push(path.join(target, ".claude", "skills", skill.id));
  return destinations;
}

async function validateDestinationParents(target, destination) {
  const relative = path.relative(target, destination);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Install destination escapes the target project: ${destination}`);
  }

  const parts = relative.split(path.sep);
  let cursor = target;
  for (const part of parts.slice(0, -1)) {
    cursor = path.join(cursor, part);
    const info = await pathInfo(cursor);
    if (!info) continue;
    if (info.isSymbolicLink()) {
      throw new Error(`Refusing to write through symlinked parent directory: ${cursor}`);
    }
    if (!info.isDirectory()) {
      throw new Error(`Install parent is not a directory: ${cursor}`);
    }
  }
}

async function stageOperations(target, operations) {
  const staging = await fs.mkdtemp(path.join(target, ".agent-config-stage-"));
  try {
    for (const [index, operation] of operations.entries()) {
      operation.staged = path.join(staging, "next", String(index));
      await fs.mkdir(path.dirname(operation.staged), { recursive: true });
      if (operation.type === "file") await fs.writeFile(operation.staged, operation.content);
      else await fs.cp(operation.source, operation.staged, { recursive: true, dereference: false });
    }
    return staging;
  } catch (error) {
    await fs.rm(staging, { recursive: true, force: true });
    throw error;
  }
}

async function applyTransaction(target, operations) {
  if (!operations.length) return;
  const staging = await stageOperations(target, operations);
  const records = [];

  try {
    for (const [index, operation] of operations.entries()) {
      const existing = await pathInfo(operation.path);
      const record = { destination: operation.path, backup: null };
      records.push(record);

      if (existing) {
        record.backup = path.join(staging, "backup", String(index));
        await fs.mkdir(path.dirname(record.backup), { recursive: true });
        await fs.rename(operation.path, record.backup);
      }

      await fs.mkdir(path.dirname(operation.path), { recursive: true });
      await fs.rename(operation.staged, operation.path);
    }
  } catch (error) {
    for (const record of records.reverse()) {
      if (await pathInfo(record.destination)) {
        await fs.rm(record.destination, { recursive: true, force: true });
      }
      if (record.backup && await pathInfo(record.backup)) {
        await fs.mkdir(path.dirname(record.destination), { recursive: true });
        await fs.rename(record.backup, record.destination);
      }
    }
    throw error;
  } finally {
    await fs.rm(staging, { recursive: true, force: true });
  }
}

async function resolveTarget(target, dryRun) {
  const resolved = path.resolve(target);
  const info = await pathInfo(resolved);
  if (info && !info.isDirectory() && !info.isSymbolicLink()) {
    throw new Error(`Install target is not a directory: ${resolved}`);
  }
  if (!info && !dryRun) await fs.mkdir(resolved, { recursive: true });
  if (await pathInfo(resolved)) {
    const canonical = await fs.realpath(resolved);
    const canonicalInfo = await fs.stat(canonical);
    if (!canonicalInfo.isDirectory()) throw new Error(`Install target is not a directory: ${resolved}`);
    return canonical;
  }
  return resolved;
}

export async function executeInstall({
  target,
  instructions,
  skills,
  agents = ["codex", "claude"],
  dryRun = false,
  force = false,
}) {
  const resolvedTarget = await resolveTarget(target, dryRun);
  const skillCopies = skills.flatMap((skill) =>
    destinationsFor(resolvedTarget, agents, skill).map((destination) => ({ skill, destination }))
  );

  const conflicts = [];
  const copies = [];
  const unchanged = [];
  for (const item of skillCopies) {
    const destinationInfo = await pathInfo(item.destination);
    if (!destinationInfo) {
      copies.push(item);
      continue;
    }
    try {
      if (await directoryDigest(item.skill.source) === await directoryDigest(item.destination)) {
        unchanged.push(item.destination);
        continue;
      }
    } catch {
      // A file or broken link at a skill destination is an unmanaged collision.
    }
    if (force) copies.push(item);
    else conflicts.push(item.destination);
  }

  if (conflicts.length) {
    const error = new Error(`Refusing to overwrite changed skills:\n${conflicts.map((file) => `  - ${file}`).join("\n")}\nRe-run with --force to replace them.`);
    error.code = "SKILL_CONFLICT";
    throw error;
  }

  const operations = [];
  const events = [];
  if (instructions.length) {
    const agentsFile = path.join(resolvedTarget, "AGENTS.md");
    const agentsInfo = await pathInfo(agentsFile);
    if (agentsInfo?.isSymbolicLink()) throw new Error(`Refusing to update symlinked AGENTS.md: ${agentsFile}`);
    if (agentsInfo && !agentsInfo.isFile()) throw new Error(`Refusing to replace non-file AGENTS.md: ${agentsFile}`);
    const current = agentsInfo ? await fs.readFile(agentsFile, "utf8") : "";
    const content = mergeManagedBlock(current, renderManagedInstructions(instructions));
    if (content === current) events.push({ action: "unchanged", path: agentsFile });
    else {
      operations.push({ type: "file", path: agentsFile, content });
      events.push({ action: "write", path: agentsFile });
    }

    if (agents.includes("claude")) {
      await validateClaudeShim(resolvedTarget);
      const claude = await planClaudeShim(resolvedTarget);
      if (claude.operation) operations.push(claude.operation);
      events.push(claude.event);
    }
  }

  for (const item of copies) {
    operations.push({ type: "directory", path: item.destination, source: item.skill.source });
    events.push({ action: "copy", path: item.destination });
  }
  events.push(...unchanged.map((file) => ({ action: "unchanged", path: file })));

  for (const operation of operations) await validateDestinationParents(resolvedTarget, operation.path);
  if (!dryRun) await applyTransaction(resolvedTarget, operations);

  return { target: resolvedTarget, dryRun, events };
}
