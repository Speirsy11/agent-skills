import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { loadCatalog } from "./catalog.mjs";
import { executeInstall } from "./install.mjs";

const HELP = `agent-config — install shared instructions and skills

Usage:
  agent-config add [options]
  agent-config install [options]   Alias for add
  agent-config list

Interactive:
  agent-config add

Scripted examples:
  agent-config add --all --yes
  agent-config add --instructions typescript-safety,testing-and-verification --skills tdd --yes
  agent-config add --categories development --agents codex,claude --yes

Options:
  --target <path>          Project to update (default: current directory)
  --instructions <ids>    Comma-separated instruction pack IDs
  --skills <ids>          Comma-separated skill IDs
  --categories <names>    Install every skill in these categories
  --agents <names>        codex, claude, or both (default: both)
  --all                    Select all instructions and skills
  --dry-run                Print the plan without writing files
  --force                  Replace conflicting installed skill directories
  -y, --yes                Skip the interactive wizard and confirmation
  -h, --help               Show this help
`;

function splitValues(value) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function parseArgs(argv) {
  const args = [...argv];
  const options = { command: "install", target: process.cwd(), agents: ["codex", "claude"] };
  if (args[0] && !args[0].startsWith("-")) options.command = args.shift();

  while (args.length) {
    const flag = args.shift();
    if (flag === "-h" || flag === "--help") options.help = true;
    else if (flag === "-y" || flag === "--yes") options.yes = true;
    else if (flag === "--all") options.all = true;
    else if (flag === "--dry-run") options.dryRun = true;
    else if (flag === "--force") options.force = true;
    else if (["--target", "--instructions", "--skills", "--categories", "--agents"].includes(flag)) {
      const value = args.shift();
      if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
      if (flag === "--target") options.target = value;
      else options[flag.slice(2)] = splitValues(value);
    } else throw new Error(`Unknown option: ${flag}`);
  }
  return options;
}

function byIds(items, ids, label) {
  if (!ids) return [];
  const known = new Map(items.map((item) => [item.id, item]));
  const missing = ids.filter((id) => !known.has(id));
  if (missing.length) throw new Error(`Unknown ${label}: ${missing.join(", ")}`);
  return ids.map((id) => known.get(id));
}

function compactDescription(description, limit = 96) {
  const compact = description.replace(/\s+/g, " ").trim();
  return compact.length > limit ? `${compact.slice(0, limit - 1).trimEnd()}…` : compact;
}

async function selectMany(rl, title, items, defaults = []) {
  output.write(`\n${title}\n`);
  items.forEach((item, index) => {
    const selected = defaults.includes(item.id) ? "*" : " ";
    const description = item.description ? ` — ${compactDescription(item.description)}` : "";
    output.write(`  ${index + 1}. [${selected}] ${item.title || item.id}${description}\n`);
  });
  const defaultLabel = defaults.length ? defaults.join(",") : "none";

  while (true) {
    const answer = (await rl.question(`Choose numbers/IDs, all, or none [${defaultLabel}]: `)).trim();
    if (!answer) return items.filter((item) => defaults.includes(item.id));
    if (answer === "all") return [...items];
    if (answer === "none") return [];
    const tokens = splitValues(answer);
    const selected = [];
    let invalid;
    for (const token of tokens) {
      const byNumber = /^\d+$/.test(token) ? items[Number(token) - 1] : undefined;
      const byId = items.find((item) => item.id === token);
      const item = byNumber || byId;
      if (!item) { invalid = token; break; }
      if (!selected.includes(item)) selected.push(item);
    }
    if (!invalid) return selected;
    output.write(`Unknown selection: ${invalid}\n`);
  }
}

async function interactiveSelections(catalog, target) {
  const rl = readline.createInterface({ input, output });
  try {
    output.write(`\nInstalling into ${target}\n`);
    const defaults = catalog.instructions.filter((item) => item.default).map((item) => item.id);
    const instructions = await selectMany(rl, "Instruction packs", catalog.instructions, defaults);
    const categoryNames = [...new Set(catalog.skills.map((skill) => skill.category))];
    const categories = await selectMany(rl, "Skill categories", categoryNames.map((id) => ({ id, title: id })), []);
    const skills = [];
    for (const category of categories) {
      const available = catalog.skills.filter((skill) => skill.category === category.id);
      skills.push(...await selectMany(rl, `${category.title} skills`, available, available.map((skill) => skill.id)));
    }
    const agents = await selectMany(rl, "Agent targets", [
      { id: "codex", title: "Codex and AGENTS.md-compatible agents" },
      { id: "claude", title: "Claude Code" },
    ], ["codex", "claude"]);
    if (!agents.length) throw new Error("Choose at least one agent target");

    output.write(`\nSelected ${instructions.length} instruction pack(s) and ${skills.length} skill(s).\n`);
    const confirm = (await rl.question("Install? [Y/n]: ")).trim().toLowerCase();
    if (confirm === "n" || confirm === "no") return null;
    return { instructions, skills, agents: agents.map((agent) => agent.id) };
  } finally {
    rl.close();
  }
}

function scriptedSelections(catalog, options) {
  if (options.all) return { instructions: catalog.instructions, skills: catalog.skills };
  if (!options.instructions && !options.skills && !options.categories) {
    throw new Error("Non-interactive installs require --all, --instructions, --skills, or --categories");
  }
  const instructions = byIds(catalog.instructions, options.instructions, "instruction pack");
  const explicitSkills = byIds(catalog.skills, options.skills, "skill");
  const categories = options.categories || [];
  const knownCategories = new Set(catalog.skills.map((skill) => skill.category));
  const unknownCategories = categories.filter((category) => !knownCategories.has(category));
  if (unknownCategories.length) throw new Error(`Unknown skill categories: ${unknownCategories.join(", ")}`);
  const categorySkills = catalog.skills.filter((skill) => categories.includes(skill.category));
  const skills = [...new Map([...explicitSkills, ...categorySkills].map((skill) => [skill.id, skill])).values()];
  return { instructions, skills };
}

function printCatalog(catalog) {
  output.write("Instructions\n");
  for (const instruction of catalog.instructions) output.write(`  ${instruction.id} (${instruction.category})\n`);
  output.write("\nSkills\n");
  for (const category of [...new Set(catalog.skills.map((skill) => skill.category))]) {
    output.write(`  ${category}\n`);
    for (const skill of catalog.skills.filter((item) => item.category === category)) output.write(`    ${skill.id}\n`);
  }
}

export async function run(argv = []) {
  const options = parseArgs(argv);
  if (options.help) { output.write(HELP); return; }
  const catalog = await loadCatalog();
  if (options.command === "list") { printCatalog(catalog); return; }
  if (!["add", "install"].includes(options.command)) throw new Error(`Unknown command: ${options.command}`);

  let selected;
  if (!options.yes && process.stdin.isTTY) selected = await interactiveSelections(catalog, options.target);
  else selected = scriptedSelections(catalog, options);
  if (!selected) { output.write("Cancelled.\n"); return; }

  const requestedAgents = options.yes ? options.agents : selected.agents;
  const agents = requestedAgents.includes("both") ? ["codex", "claude"] : requestedAgents;
  const invalidAgents = agents.filter((agent) => !["codex", "claude"].includes(agent));
  if (invalidAgents.length) throw new Error(`Unknown agents: ${invalidAgents.join(", ")}`);
  const result = await executeInstall({
    target: options.target,
    instructions: selected.instructions,
    skills: selected.skills,
    agents,
    dryRun: options.dryRun,
    force: options.force,
  });

  output.write(`${result.dryRun ? "Planned" : "Installed"} in ${result.target}\n`);
  for (const event of result.events) output.write(`  ${event.action.padEnd(9)} ${event.path}\n`);
}
