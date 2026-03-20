import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TYPES_DIR = path.resolve(__dirname, "types");

const ENTITY_BASE_IMPORT =
  "import { EntityBase } from '@jtl/platform-internal-react/jotai'";

function getAllTsFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllTsFiles(fullPath));
    } else if (entry.name.endsWith(".ts")) {
      files.push(fullPath);
    }
  }
  return files;
}

function toUpperSnake(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toUpperCase();
}

function applySharedTransforms(content: string): string {
  // Convert z.enum values from PascalCase to UPPER_SNAKE_CASE
  content = content.replace(
    /z\.enum\(\[([^\]]+)\]/g,
    (_match, inner: string) => {
      const transformed = inner.replace(/"([^"]+)"/g, (_m, val: string) =>
        `"${toUpperSnake(val)}"`,
      );
      return `z.enum([${transformed}]`;
    },
  );
  // Fix zod import: import * as z → import { z }
  content = content.replace(
    /import \* as z from ['"]zod['"]/g,
    "import { z } from 'zod'",
  );

  // z.iso.datetime() → z.string().datetime() (backward compat)
  content = content.replace(/z\.iso\.datetime\(\)/g, "z.string().datetime()");

  // .and(z.object({ → .extend({ (handles multiline + trailing commas from prettier)
  content = content.replace(/\.and\(\s*z\.object\(\s*\{/g, ".extend({");
  content = content.replace(/\}\s*,?\s*\)\s*,?\s*\)/g, "})");

  // EntityBase: extract from multi-imports and replace with external package
  // Handle multi-import: remove EntityBase from the import, add separate import
  content = content.replace(
    /import \{([^}]*)\bEntityBase\b[,\s]*([^}]*)\} from (['"][^'"]+['"])/g,
    (_match, before: string, after: string, source: string) => {
      // Clean up remaining imports (remove leading/trailing commas and whitespace)
      const remaining = [before, after]
        .join("")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const externalImport = ENTITY_BASE_IMPORT;

      if (remaining.length === 0) {
        return externalImport;
      }

      return `import {\n  ${remaining.join(",\n  ")},\n} from ${source};\n\n${externalImport}`;
    },
  );

  return content;
}

function processBarrel(content: string): string {
  // Remove the EntityBase definition
  content = content.replace(
    /\nexport const EntityBase = z\.object\(\{[\s\S]*?\}\);\n/,
    "\n",
  );

  // Add EntityBase import if not already present
  if (!content.includes("@jtl/platform-internal-react/jotai")) {
    content = content.replace(
      /import \{ z \} from ['"]zod['"]/,
      (match) => `${match};\n\n${ENTITY_BASE_IMPORT}`,
    );
  }

  // Fix imports from individual files: named → default
  content = content.replace(
    /import \{ (\w+) \} from (['"])(\.\/[^'"]+)\2/g,
    "import $1 from $2$3$2",
  );

  return content;
}

function processIndividualFile(content: string): string {
  // Fix imports from other individual files: named → default
  // Keep named imports from '../common' (barrel) intact
  content = content.replace(
    /import \{ (\w+) \} from (['"])(\.[^'"]+)\2/g,
    (match, name: string, quote: string, importPath: string) => {
      if (importPath.endsWith("/common")) return match;
      return `import ${name} from ${quote}${importPath}${quote}`;
    },
  );

  // Convert single export to default export pattern
  const exportMatches = content.match(/^export const \w+/gm);
  if (exportMatches?.length === 1) {
    const name = content.match(/^export const (\w+)/m)?.[1];
    if (name) {
      content = content.replace(`export const ${name}`, `const ${name}`);
      content =
        content.trimEnd() +
        `\n\ntype ${name} = z.infer<typeof ${name}>;\n\nexport default ${name};\n`;
    }
  }

  return content;
}

function processFile(filePath: string): void {
  let content = fs.readFileSync(filePath, "utf-8");
  const relativePath = path.relative(TYPES_DIR, filePath);
  const isBarrel = relativePath === "common.ts";

  content = applySharedTransforms(content);
  content = isBarrel ? processBarrel(content) : processIndividualFile(content);

  fs.writeFileSync(filePath, content);
}

const files = getAllTsFiles(TYPES_DIR);
files.forEach(processFile);
console.log(`Processed ${files.length} files`);
