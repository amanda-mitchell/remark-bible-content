import build from 'unist-builder';
import { findRelevantNodes } from '../find-nodes';

it('find appropriate paragraphs', async () => {
  const document = build('root', [
    buildParagraphWithText('Genesis 1:2'),
    buildParagraphWithText('bible: Proverbs 26:4-5'),
    buildParagraphWithText('Bible: 2 Ki 4'),
    buildParagraphWithText('bible: Proverbs 26:4, 5'),
    buildParagraphWithText('bible: not a reference'),
    buildParagraphWithText('some text that should not be replaced.'),
    build('paragraph', [
      build('link', { url: 'https://example.com/' }, [
        build('text', 'bible: Exodus 2'),
      ]),
    ]),
    build('paragraph', [
      build('text', 'bible: '),
      build('link', {
        url: 'https://biblia.com/bible/esv/john/3/17',
        data: { bibleReference: { passage: 'John 3:17' } },
      }),
    ]),
  ]);

  const result = [...findRelevantNodes(document, false)];

  expect(result).toEqual([
    {
      node: buildParagraphWithText('bible: Proverbs 26:4-5'),
      reference: 'Proverbs 26:4-5',
    },
    { node: buildParagraphWithText('Bible: 2 Ki 4'), reference: '2 Ki 4' },
    {
      node: buildParagraphWithText('bible: Proverbs 26:4, 5'),
      reference: 'Proverbs 26:4, 5',
    },
    {
      node: buildParagraphWithText('bible: not a reference'),
      reference: 'not a reference',
    },
    {
      node: build('paragraph', [
        build('text', 'bible: '),
        build('link', {
          url: 'https://biblia.com/bible/esv/john/3/17',
          data: { bibleReference: { passage: 'John 3:17' } },
        }),
      ]),
      reference: 'John 3:17',
    },
  ]);
});

it('respects the skipReferenceDetection flag', async () => {
  const document = build('root', [
    buildParagraphWithText('Genesis 1:2'),
    buildParagraphWithText('bible: Proverbs 26:4-5'),
    buildParagraphWithText('Bible: 2 Ki 4'),
    buildParagraphWithText('bible: Proverbs 26:4, 5'),
    buildParagraphWithText('bible: not a reference'),
    buildParagraphWithText('some text that should not be replaced.'),
    build('paragraph', [
      build('link', { url: 'https://example.com/' }, [
        build('text', 'bible: Exodus 2'),
      ]),
    ]),
    build('paragraph', [
      build('text', 'bible: '),
      build('link', {
        url: 'https://biblia.com/bible/esv/john/3/17',
        data: { bibleReference: { passage: 'John 3:17' } },
      }),
    ]),
  ]);

  const result = [...findRelevantNodes(document, true)];

  expect(result).toEqual([
    {
      node: build('paragraph', [
        build('text', 'bible: '),
        build('link', {
          url: 'https://biblia.com/bible/esv/john/3/17',
          data: { bibleReference: { passage: 'John 3:17' } },
        }),
      ]),
      reference: 'John 3:17',
    },
  ]);
});

function buildParagraphWithText(text: string) {
  return build('paragraph', [build('text', text)]);
}
