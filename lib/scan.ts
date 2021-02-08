import type { Node } from 'unist';
import { BibliaApiClient } from './common-types';
import { findRelevantNodes } from './find-nodes';
import { isParent } from './predicates';

export async function scanTextNodes(
  tree: Node,
  bibliaApi: BibliaApiClient,
  skipReferenceDetection: boolean
) {
  if (!bibliaApi) {
    throw new Error('bibliaApi is required.');
  }

  if (!isParent(tree)) {
    return {};
  }

  const allReferences = uniqueValues(
    [...findRelevantNodes(tree, skipReferenceDetection)].map(
      ({ reference }) => reference
    )
  );

  const entries = await Promise.all(
    allReferences.map(async value => {
      const parseResult = await bibliaApi.parse({
        style: 'long',
        passage: value,
      });

      const { passage, passages } = parseResult;
      if (passages.length !== 1) {
        return null;
      }

      return [value, { passage, parts: passages[0].parts }] as const;
    })
  );

  return Object.fromEntries(entries.filter(isDefined));
}

function uniqueValues<T>(items: T[]) {
  return [...new Set(items)];
}

function isDefined<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
