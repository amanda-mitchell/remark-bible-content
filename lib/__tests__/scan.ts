import { createBibliaApiClient } from '@amanda-mitchell/biblia-api';
import fetch from 'node-fetch';
import { u as build } from 'unist-builder';
import { scanTextNodes } from '../scan.js';
import { getExpectedEnvironmentVariable } from '../test-util/index.js';

const apiKey = getExpectedEnvironmentVariable('BIBLIA_API_KEY');

it('parses values correctly', async () => {
  const document = build('root', [
    buildParagraphWithText('Genesis 1:2'),
    buildParagraphWithText('bible: Proverbs 26:4-5'),
    buildParagraphWithText('Bible: 2 Ki 4'),
    buildParagraphWithText('bible: Proverbs 26:4, 5'),
    buildParagraphWithText('bible: not a reference'),
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

  const result = await scanTextNodes(document, createClient(), false);

  expect(result).toEqual({
    'Proverbs 26:4-5': {
      passage: 'Proverbs 26:4\u20135',
      parts: { book: 'Proverbs', chapter: 26, verse: 4, endVerse: 5 },
    },
    '2 Ki 4': { passage: '2 Kings 4', parts: { book: '2 Kings', chapter: 4 } },
    'John 3:17': {
      passage: 'John 3:17',
      parts: { book: 'John', chapter: 3, verse: 17 },
    },
  });
});

it('respects the skipReferenceDetection flag', async () => {
  const document = build('root', [
    buildParagraphWithText('Genesis 1:2'),
    buildParagraphWithText('bible: Proverbs 26:4-5'),
    buildParagraphWithText('Bible: 2 Ki 4'),
    buildParagraphWithText('bible: Proverbs 26:4, 5'),
    buildParagraphWithText('bible: not a reference'),
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

  const result = await scanTextNodes(document, createClient(), true);

  expect(result).toEqual({
    'John 3:17': {
      passage: 'John 3:17',
      parts: { book: 'John', chapter: 3, verse: 17 },
    },
  });
});

function createClient() {
  return createBibliaApiClient({ apiKey: apiKey, fetch });
}

function buildParagraphWithText(text: string) {
  return build('paragraph', [build('text', text)]);
}
