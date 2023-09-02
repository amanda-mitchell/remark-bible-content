import type { Node, Parent } from 'unist';

export function* findRelevantNodes(
  tree: Parent,
  skipReferenceDetection: boolean,
) {
  for (const child of tree.children) {
    if (!isParagraph(child)) {
      continue;
    }

    const { children } = child;

    if (children.length === 1) {
      if (skipReferenceDetection) {
        continue;
      }

      const [element] = children;
      if (!isText(element)) {
        continue;
      }

      const match = isSingleElementBibleParagraph.exec(element.value);
      if (!match) {
        continue;
      }

      yield { node: child, reference: match[1].trim() };
    }

    if (children.length === 2) {
      const [firstElement, secondElement] = children;
      if (
        !isText(firstElement) ||
        !isLink(secondElement) ||
        !secondElement.data
      ) {
        continue;
      }

      const match = isTwoElementBibleParagraph.exec(firstElement.value);
      if (!match) {
        continue;
      }

      const { bibleReference } = secondElement.data as {
        bibleReference?: { passage?: string };
      };

      if (!bibleReference) {
        continue;
      }

      const { passage } = bibleReference;
      if (!passage || typeof passage !== 'string') {
        continue;
      }

      yield { node: child, reference: passage };
    }
  }
}

interface Paragraph extends Parent {
  type: 'paragraph';
}

interface Text extends Node {
  type: 'text';
  value: string;
}

interface Resource {
  url: string;
  title?: string;
}

type WithMixin<TNode extends Node, TMixin> = TNode & TMixin;

interface Link extends WithMixin<Parent, Resource> {
  type: 'link';
}

function isParagraph(node: Node): node is Paragraph {
  return node.type === 'paragraph';
}

function isText(node: Node): node is Text {
  return node.type === 'text';
}

function isLink(node: Node): node is Link {
  return node.type === 'link';
}

const isSingleElementBibleParagraph = /^bible:\s*(.+)$/i;
const isTwoElementBibleParagraph = /^bible:\s*$/i;
