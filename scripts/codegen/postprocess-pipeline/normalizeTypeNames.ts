import { SourceFile, TypeAliasDeclaration, Node, SyntaxKind } from "ts-morph";

/**
 * Domain rules
 */
const REMOVE_WORDS = ["App", "Manifest"];
const NOISE_WORDS = ["Capabilities", "Capability"];

/**
 * Helpers
 */
const singularize = (word: string) => {
  if (word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.endsWith("s")) return word.slice(0, -1);
  return word;
};

const splitWords = (name: string): string[] => {
  return name.match(/[A-Z][a-z0-9]*/g) || [];
};

/**
 * Detect if type is a response map: { 200: ..., 400: ... }
 */
const isResponseMap = (typeAlias: TypeAliasDeclaration) => {
  const typeNode = typeAlias.getTypeNode();
  if (!Node.isTypeLiteral(typeNode)) return false;

  const props = typeNode.getProperties();

  return props.some((p) => /^\d+$/.test(p.getName()));
};

/**
 * Normalize general name
 */
const normalizeBaseName = (name: string): string => {
  if (name === "AppManifest") return name;

  let words = splitWords(name);

  words = words.filter((w) => !REMOVE_WORDS.includes(w));
  words = words.filter((w) => !NOISE_WORDS.includes(w));

  if (words.length > 0) {
    const last = words[words.length - 1];
    words[words.length - 1] = singularize(last);
  }

  return words.join("");
};

/**
 * Main transform
 */
export const normalizeTypeNames = (file: SourceFile): boolean => {
  let changed = false;

  const renames = new Map<string, string>();

  /**
   * Step 1: collect rename rules
   */
  file.getTypeAliases().forEach((typeAlias) => {
    const oldName = typeAlias.getName();

    let newName = oldName;

    /**
     * 🔥 CASE 1: Response2 → Response
     */
    if (/Response\d+$/.test(oldName)) {
      newName = oldName.replace(/Response\d+$/, "Response");
    } else if (oldName.endsWith("Response") && isResponseMap(typeAlias)) {

    /**
     * 🔥 CASE 2: Response → Responses (if it's a map)
     */
      newName = oldName.replace(/Response$/, "Responses");
    } else {

    /**
     * 🔥 CASE 3: General normalization
     */
      newName = normalizeBaseName(oldName);
    }

    if (oldName !== newName) {
      renames.set(oldName, newName);
    }
  });

  if (renames.size === 0) return false;

  /**
   * Step 2: apply renames
   */
  file.getTypeAliases().forEach((typeAlias) => {
    const oldName = typeAlias.getName();
    const newName = renames.get(oldName);

    if (newName && newName !== oldName) {
      typeAlias.rename(newName);
      changed = true;
    }
  });

  return changed;
};
