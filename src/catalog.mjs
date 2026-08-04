import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const packageRoot = fileURLToPath(new URL("../", import.meta.url));

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(entryPath));
    else if (entry.isFile()) files.push(entryPath);
  }

  return files;
}

function unquote(value) {
  const trimmed = value.trim();
  if (/^[>|][+-]?$/.test(trimmed)) return "";
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { attributes: {}, body: markdown };

  const attributes = {};
  let activeKey;
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) {
      activeKey = field[1];
      attributes[activeKey] = unquote(field[2]);
      continue;
    }
    if (activeKey && /^\s+\S/.test(line)) {
      attributes[activeKey] = `${attributes[activeKey]} ${line.trim()}`.trim();
    }
  }

  return { attributes, body: markdown.slice(match[0].length).trim() };
}

function booleanValue(value) {
  return value === true || value === "true";
}

function validateIds(items, kind) {
  const seen = new Set();
  for (const item of items) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(item.id)) {
      throw new Error(`Invalid ${kind} ID "${item.id}" in ${item.source}`);
    }
    if (seen.has(item.id)) throw new Error(`Duplicate ${kind} ID "${item.id}"`);
    seen.add(item.id);
  }
}

export async function loadCatalog(root = packageRoot) {
  const instructionRoot = path.join(root, "instructions");
  const skillRoot = path.join(root, "skills");
  const instructionFiles = (await walk(instructionRoot)).filter((file) => file.endsWith(".md"));
  const skillFiles = (await walk(skillRoot)).filter((file) => path.basename(file) === "SKILL.md");

  const instructions = await Promise.all(instructionFiles.map(async (file) => {
    const parsed = parseFrontmatter(await fs.readFile(file, "utf8"));
    const relative = path.relative(instructionRoot, file);
    const [category] = relative.split(path.sep);
    const id = parsed.attributes.id || path.basename(file, ".md");
    return {
      id,
      title: parsed.attributes.title || id,
      description: parsed.attributes.description || "",
      default: booleanValue(parsed.attributes.default),
      category,
      body: parsed.body,
      source: file,
    };
  }));

  const skills = await Promise.all(skillFiles.map(async (file) => {
    const parsed = parseFrontmatter(await fs.readFile(file, "utf8"));
    const relative = path.relative(skillRoot, file);
    const parts = relative.split(path.sep);
    if (parts.length !== 3) throw new Error(`Skills must use skills/<category>/<skill>/SKILL.md: ${file}`);
    const [category, folder] = parts;
    return {
      id: parsed.attributes.name || folder,
      title: parsed.attributes.name || folder,
      description: parsed.attributes.description || "",
      category,
      source: path.dirname(file),
    };
  }));

  validateIds(instructions, "instruction");
  validateIds(skills, "skill");
  instructions.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
  skills.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title));
  return { instructions, skills };
}
