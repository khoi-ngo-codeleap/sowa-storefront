import { SyntaxKind, SourceFile, Node } from "ts-morph";

export const refactorPagination = (file: SourceFile) => {
  let changed = false;

  /**
   * We use a single traversal to handle both:
   * 1. Removing the flattened type definitions.
   * 2. Replacing references in other types.
   */
  file.forEachChild((node) => {
    // CASE 1: Handle Type Alias Definitions (The "Flattened" Objects)
    if (Node.isTypeAliasDeclaration(node)) {
      const name = node.getName();
      const typeNode = node.getTypeNode();

      if (
        name.includes("Pagination") &&
        Node.isTypeLiteral(node.getTypeNode())
      ) {
        const properties = typeNode!
          .asKindOrThrow(SyntaxKind.TypeLiteral)
          .getProperties();
        const hasItems = properties.some((p) => p.getName() === "items");
        const hasTotal = properties.some((p) => p.getName() === "totalItems");

        if (hasItems && hasTotal) {
          node.remove();
          changed = true;
          return; // Skip further processing for this node
        }
      }
    }

    // CASE 2: Handle Type References in the rest of the node's structure
    // We look for any node that contains the "Of" pattern
    node.forEachDescendant((descendant) => {
      if (Node.isTypeReference(descendant)) {
        const typeName = descendant.getText();
        const match = typeName.match(/PaginationResponse\w*Of(\w+)/);

        if (match) {
          const innerType = match[1];
          descendant.replaceWithText(`Pagination<${innerType}>`);
          changed = true;
        }
      }
    });
  });

  return changed;
};
