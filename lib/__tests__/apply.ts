import build from 'unist-builder';
import { applyReplacements } from '../apply';

it('replaces nodes', () => {
  const doc = build('root', { data: { key: 'value' } }, [
    build('paragraph', [build('text', 'first paragraph')]),
    build('paragraph', [build('text', 'bible: Proverbs 26:4-5')]),
    build('paragraph', [build('text', 'third paragraph')]),
    build('paragraph', [build('text', 'bible: not a reference')]),
    build('paragraph', [
      build('text', 'Bible:'),
      build('link', {
        url: '',
        data: { bibleReference: { passage: 'Proverbs 26:4-5' } },
      }),
    ]),
  ]);

  const replacements = {
    'Proverbs 26:4-5': build(
      'paragraph',
      build('text', 'replacement paragraph')
    ),
  };

  expect(applyReplacements(doc, replacements, false)).toEqual(
    build('root', { data: { key: 'value' } }, [
      build('paragraph', [build('text', 'first paragraph')]),
      build('paragraph', build('text', 'replacement paragraph')),
      build('paragraph', [build('text', 'third paragraph')]),
      build('paragraph', [build('text', 'bible: not a reference')]),
      build('paragraph', build('text', 'replacement paragraph')),
    ])
  );
});

it('respect the skipReference detection flag', () => {
  const doc = build('root', { data: { key: 'value' } }, [
    build('paragraph', [build('text', 'first paragraph')]),
    build('paragraph', [build('text', 'bible: Proverbs 26:4-5')]),
    build('paragraph', [build('text', 'third paragraph')]),
    build('paragraph', [build('text', 'bible: not a reference')]),
    build('paragraph', [
      build('text', 'Bible:'),
      build('link', {
        url: '',
        data: { bibleReference: { passage: 'Proverbs 26:4-5' } },
      }),
    ]),
  ]);

  const replacements = {
    'Proverbs 26:4-5': build(
      'paragraph',
      build('text', 'replacement paragraph')
    ),
  };

  expect(applyReplacements(doc, replacements, true)).toEqual(
    build('root', { data: { key: 'value' } }, [
      build('paragraph', [build('text', 'first paragraph')]),
      build('paragraph', [build('text', 'bible: Proverbs 26:4-5')]),
      build('paragraph', [build('text', 'third paragraph')]),
      build('paragraph', [build('text', 'bible: not a reference')]),
      build('paragraph', build('text', 'replacement paragraph')),
    ])
  );
});
