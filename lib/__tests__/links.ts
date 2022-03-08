import { createBibliaLink } from '../links.js';

describe.each([
  row({ book: 'genesis' }, 'https://biblia.com/bible/leb/genesis'),
  row(
    { book: 'genesis', endBook: 'revelation' },
    'https://biblia.com/bible/leb/genesis--revelation'
  ),
  row(
    { book: 'genesis', endBook: 'revelation', endChapter: 1 },
    'https://biblia.com/bible/leb/genesis--revelation-1'
  ),
  row(
    { book: 'genesis', endBook: 'revelation', endChapter: 1, endVerse: 1 },
    'https://biblia.com/bible/leb/genesis--revelation-1-1'
  ),
  row(
    { book: 'genesis', chapter: 1, endBook: 'revelation' },
    'https://biblia.com/bible/leb/genesis-1--revelation'
  ),
  row(
    { book: 'genesis', chapter: 1, endBook: 'revelation', endChapter: 1 },
    'https://biblia.com/bible/leb/genesis-1--revelation-1'
  ),
  row(
    {
      book: 'genesis',
      chapter: 1,
      endBook: 'revelation',
      endChapter: 1,
      endVerse: 1,
    },
    'https://biblia.com/bible/leb/genesis-1--revelation-1-1'
  ),
  row(
    { book: 'genesis', chapter: 1, endChapter: 2 },
    'https://biblia.com/bible/leb/genesis-1--2'
  ),
  row(
    { book: 'genesis', chapter: 1, endChapter: 2, endVerse: 1 },
    'https://biblia.com/bible/leb/genesis-1--2-1'
  ),
  row(
    { book: 'genesis', chapter: 1, verse: 1 },
    'https://biblia.com/bible/leb/genesis/1/1'
  ),
  row(
    { book: 'genesis', chapter: 1, verse: 1, endBook: 'revelation' },
    'https://biblia.com/bible/leb/genesis-1-1--revelation'
  ),
  row(
    {
      book: 'genesis',
      chapter: 1,
      verse: 1,
      endBook: 'revelation',
      endChapter: 1,
    },
    'https://biblia.com/bible/leb/genesis-1-1--revelation-1'
  ),
  row(
    {
      book: 'genesis',
      chapter: 1,
      verse: 1,
      endBook: 'revelation',
      endChapter: 1,
      endVerse: 1,
    },
    'https://biblia.com/bible/leb/genesis-1-1--revelation-1-1'
  ),
  row(
    { book: 'genesis', chapter: 1, verse: 1, endChapter: 2, endVerse: 1 },
    'https://biblia.com/bible/leb/genesis-1-1--2-1'
  ),
  row(
    { book: 'genesis', chapter: 1, verse: 1, endVerse: 2 },
    'https://biblia.com/bible/leb/genesis/1/1-2'
  ),
  row(
    { book: 'genesis', chapter: 1, verse: 1, endVerse: 2 },
    'https://biblia.com/bible/esv/genesis/1/1-2',
    'esv'
  ),
])('render url', ({ input, expected, version }) => {
  test('it renders the expected value', () => {
    expect(createBibliaLink(version, input)).toBe(expected);
  });
});

function row(
  input: Parameters<typeof createBibliaLink>[1],
  expected: string,
  version = 'leb'
) {
  return { input, expected, version };
}
