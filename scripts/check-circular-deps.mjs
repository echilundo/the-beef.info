#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const srcRoot = path.join(projectRoot, "src");

const importRegex = /^import\s+(?:[^'"\n]+?from\s+)?["']([^"']+)["']/gm;
const extensions = [".astro", ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mdx"];
const filePattern = /\.(astro|ts|tsx|js|jsx|mjs|cjs|mdx)$/;

function listSourceFiles(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  return items.flatMap((item) => {
    const absPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      return listSourceFiles(absPath);
    }
    return filePattern.test(item.name) ? [absPath] : [];
  });
}

function resolveImport(sourceFile, specifier) {
  let targetPath = "";

  if (specifier.startsWith("@")) {
    targetPath = path.join(srcRoot, specifier.slice(1));
  } else if (specifier.startsWith(".")) {
    targetPath = path.resolve(path.dirname(sourceFile), specifier);
  } else {
    return null;
  }

  const candidates = [
    targetPath,
    ...extensions.map((ext) => `${targetPath}${ext}`),
    ...extensions.map((ext) => path.join(targetPath, `index${ext}`)),
  ];

  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile()) ?? null;
}

function buildGraph(sourceFiles) {
  const graph = new Map();

  for (const file of sourceFiles) {
    const content = fs.readFileSync(file, "utf8");
    const dependencies = new Set();
    let match = importRegex.exec(content);

    while (match) {
      const specifier = match[1];
      const resolved = resolveImport(file, specifier);
      if (resolved) {
        dependencies.add(path.relative(projectRoot, resolved));
      }
      match = importRegex.exec(content);
    }

    importRegex.lastIndex = 0;
    graph.set(path.relative(projectRoot, file), [...dependencies]);
  }

  return graph;
}

function detectCycles(graph) {
  const cycles = [];
  const visited = new Set();
  const onStack = new Set();
  const stack = [];

  const traverse = (node) => {
    visited.add(node);
    onStack.add(node);
    stack.push(node);

    for (const dep of graph.get(node) ?? []) {
      if (!graph.has(dep)) continue;

      if (!visited.has(dep)) {
        traverse(dep);
      } else if (onStack.has(dep)) {
        const cycleStart = stack.indexOf(dep);
        cycles.push([...stack.slice(cycleStart), dep]);
      }
    }

    stack.pop();
    onStack.delete(node);
  };

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      traverse(node);
    }
  }

  const deduped = [];
  const seen = new Set();
  for (const cycle of cycles) {
    const body = cycle.slice(0, -1);
    const rotations = body.map((_, idx) => [...body.slice(idx), ...body.slice(0, idx)].join(" -> "));
    const canonical = rotations.sort()[0];
    if (!seen.has(canonical)) {
      seen.add(canonical);
      deduped.push(cycle);
    }
  }

  return deduped;
}

const sourceFiles = listSourceFiles(srcRoot);
const graph = buildGraph(sourceFiles);
const cycles = detectCycles(graph);

console.log(`Scanned ${sourceFiles.length} source files.`);

if (cycles.length === 0) {
  console.log("No circular dependencies detected.");
  process.exit(0);
}

console.error(`Detected ${cycles.length} circular dependenc${cycles.length === 1 ? "y" : "ies"}:`);
for (const cycle of cycles) {
  console.error(`- ${cycle.join(" -> ")}`);
}
process.exit(1);
