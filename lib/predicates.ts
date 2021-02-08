import type { Node, Parent } from 'unist';

export function isParent(node: Node): node is Parent {
  return !!(node as any).children;
}
