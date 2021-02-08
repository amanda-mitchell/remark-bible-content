const bibliaPrefix = 'https://biblia.com/bible';

type PassageParts = {
  book: string;
  endBook?: string;
  chapter?: number;
  endChapter?: number;
  verse?: number;
  endVerse?: number;
};

export function createBibliaLink(
  version: string,
  { book, endBook, chapter, endChapter, verse, endVerse }: PassageParts
) {
  if (endBook || endChapter) {
    return `${bibliaPrefix}/${encodeURIComponent(version)}/${formatPassage({
      book,
      chapter,
      verse,
    })}--${formatPassage({
      book: endBook,
      chapter: endChapter,
      verse: endVerse,
    })}`;
  }

  let result = `${bibliaPrefix}/${encodeURIComponent(version)}/${formatPassage(
    { book, chapter, verse },
    '/'
  )}`;
  if (endVerse) {
    result += `-${endVerse}`;
  }

  return result;
}

function formatPassage(
  {
    book,
    chapter,
    verse,
  }: Partial<Pick<PassageParts, 'book' | 'chapter' | 'verse'>>,
  separator = '-'
) {
  const components = [];
  if (book) {
    components.push(formatBookName(book));
  }
  if (chapter) {
    components.push(chapter);
  }
  if (verse) {
    components.push(verse);
  }

  return components.join(separator);
}

function formatBookName(book: string) {
  return book.toLowerCase().replace(' ', '-');
}
