import type { Node } from 'unist';
import { u as build } from 'unist-builder';
import { applyReplacements } from './apply.js';
import type {
  AvailableBible,
  EsvApiClient,
  BibliaApiClient,
} from './common-types.js';
import { createBibliaLink } from './links.js';
import { createPassageDownloader } from './passage-downloader.js';
import { scanTextNodes } from './scan.js';

type InsertBibleContentOptions = {
  bibliaApi: BibliaApiClient;
  esvApi: EsvApiClient;
  version?: AvailableBible;
  skipReferenceDetection?: boolean;
};

type UnwrappedPromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

type PassageParts = UnwrappedPromise<
  ReturnType<BibliaApiClient['parse']>
>['passages'][number]['parts'];

export function insertBibleContent({
  bibliaApi,
  esvApi,
  version = 'leb',
  skipReferenceDetection = false,
}: InsertBibleContentOptions) {
  if (!bibliaApi) {
    throw new Error('bibliaApi is required');
  }
  if (!esvApi && version === 'esv') {
    throw new Error('esvApi is required when inserting ESV content');
  }

  return async function transform(tree: Node) {
    const passageReferences = await scanTextNodes(
      tree,
      bibliaApi,
      skipReferenceDetection,
    );

    const downloadPassage = createPassageDownloader({ bibliaApi, esvApi });

    const uniqueReferences: Record<string, PassageParts> = {};
    for (const { passage, parts } of Object.values(passageReferences)) {
      uniqueReferences[passage] = parts;
    }

    const passages = Object.fromEntries(
      await Promise.all(
        Object.keys(uniqueReferences).map(
          async passage =>
            [
              passage,
              await downloadPassage(passage, version || 'leb'),
            ] as const,
        ),
      ),
    );

    const urls = Object.fromEntries(
      Object.entries(uniqueReferences).map(
        ([passage, parts]) =>
          [passage, createBibliaLink(version, parts)] as const,
      ),
    );

    // TODO: Use a smarter mapping to reader-friendly names.
    const versionSuffix = ` (${version.toUpperCase()})`;

    const quotations = Object.fromEntries(
      Object.entries(passages).map(
        ([passageReference, passageText]) =>
          [
            passageReference,
            build('blockquote', [
              passageText,
              build('footer', { data: { hName: 'footer' } }, [
                build(
                  'link',
                  {
                    url: urls[passageReference],
                    bibleReference: {
                      passage: passageReference,
                      parts: uniqueReferences[passageReference],
                    },
                  },
                  [build('text', passageReference)],
                ),
                build('text', versionSuffix),
              ]),
            ]),
          ] as const,
      ),
    );

    const replacements = Object.fromEntries(
      Object.entries(passageReferences).map(
        ([unparsedReference, { passage }]) =>
          [unparsedReference, quotations[passage]] as const,
      ),
    );

    return applyReplacements(tree, replacements, skipReferenceDetection);
  };
}
