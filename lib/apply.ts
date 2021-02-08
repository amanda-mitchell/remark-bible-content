import type { Node } from 'unist';
import { findRelevantNodes } from './find-nodes';
import { isParent } from './predicates';

export function applyReplacements(
  tree: Node,
  replacements: Record<string, Node>,
  skipReferenceDetection: boolean
) {
  if (!isParent(tree)) {
    return tree;
  }

  const targetNodeToReplacement = new Map<Node, Node>();
  for (const { node, reference } of findRelevantNodes(
    tree,
    skipReferenceDetection
  )) {
    const replacement = replacements[reference];

    if (replacement) {
      targetNodeToReplacement.set(node, replacement);
    }
  }

  return {
    ...tree,
    children: tree.children.map(
      node => targetNodeToReplacement.get(node) || node
    ),
  };
}
