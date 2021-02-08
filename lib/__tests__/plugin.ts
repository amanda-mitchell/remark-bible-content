import fetch from 'node-fetch';
import unified from 'unified';
import markdown from 'remark-parse';
import remarkRehype from 'remark-rehype';
import raw from 'rehype-raw';
import html from 'rehype-stringify';
// @ts-expect-error this plugin has not yet been converted to Typescript
import { tagBibleReferences } from '@amanda-mitchell/remark-tag-bible-references';
import { createBibliaApiClient } from '@amanda-mitchell/biblia-api';
import { createEsvApiClient } from '@amanda-mitchell/esv-api';
import { getExpectedEnvironmentVariable } from '../test-util';
import type { AvailableBible } from '../common-types';
import { insertBibleContent } from '../plugin';

const bibliaApiKey = getExpectedEnvironmentVariable('BIBLIA_API_KEY');
const esvApiKey = getExpectedEnvironmentVariable('ESV_API_KEY');

const bibliaApi = createBibliaApiClient({ apiKey: bibliaApiKey, fetch });
const esvApi = createEsvApiClient({ apiKey: esvApiKey, fetch });

const document = `# Heading

bible: Prov 26:4-5

This passage is profound.`;

function createProcessor(
  version: AvailableBible = 'leb',
  skipReferenceDetection = false
) {
  return unified()
    .use(markdown)
    .use(insertBibleContent, {
      bibliaApi,
      esvApi,
      version,
      skipReferenceDetection,
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(raw)
    .use(html);
}

it('creates esv references correctly', async () => {
  const processor = createProcessor('esv');

  const result = await processor.process(document);

  expect(String(result)).toEqual(
    '<h1>Heading</h1>\n<blockquote>\n<p class="block-indent"><span class="begin-line-group"></span>\n<span id="p20026004_01-1" class="line" style="margin: 0;text-indent: -3.5em;padding-left: 5.5em;clear:both;"><b class="verse-num inline" id="v20026004-1">4\u00a0</b>\u00a0\u00a0Answer not a fool according to his folly,</span><br><span id="p20026004_01-1" class="indent line" style="margin: 0;text-indent: -3.5em;clear:both;padding-left:2em;display:inline-block;">\u00a0\u00a0\u00a0\u00a0lest you be like him yourself.</span><br><span id="p20026005_01-1" class="line" style="margin: 0;text-indent: -3.5em;padding-left: 5.5em;clear:both;"><b class="verse-num inline" id="v20026005-1">5\u00a0</b>\u00a0\u00a0Answer a fool according to his folly,</span><br><span id="p20026005_01-1" class="indent line" style="margin: 0;text-indent: -3.5em;clear:both;padding-left:2em;display:inline-block;">\u00a0\u00a0\u00a0\u00a0lest he be wise in his own eyes.</span><br></p><span class="end-line-group"></span>\n<footer><a href="https://biblia.com/bible/esv/proverbs/26/4-5">Proverbs 26:4–5</a> (ESV)</footer>\n</blockquote>\n<p>This passage is profound.</p>'
  );
});

it('creates leb references correctly', async () => {
  const processor = createProcessor();

  const result = await processor.process(document);

  expect(String(result)).toEqual(
    '<h1>Heading</h1>\n<blockquote>\n<p style="font-size:12pt; margin-left:45pt; text-indent:-27pt;" lang="en-US">\n\t\tDo not answer a fool according to his folly \n\t</p>\n\t<p style="font-size:12pt; margin-left:63pt; text-indent:-27pt;" lang="en-US">\n\t\tlest you become like him—even you. \n\t</p>\n\t<p style="font-size:12pt; margin-left:45pt; text-indent:-27pt;" lang="en-US">\n\t\tAnswer a fool according to his folly, \n\t</p>\n\t<p style="font-size:12pt; margin-left:63pt; text-indent:-27pt;" lang="en-US">\n\t\tor else he will be wise in his own eyes.\n\t</p>\n<footer><a href="https://biblia.com/bible/leb/proverbs/26/4-5">Proverbs 26:4–5</a> (LEB)</footer>\n</blockquote>\n<p>This passage is profound.</p>'
  );
});

it('does nothing when skipping reference tagging', async () => {
  const processor = createProcessor('leb', true);

  const result = await processor.process(document);

  expect(String(result)).toEqual(
    '<h1>Heading</h1>\n<p>bible: Prov 26:4-5</p>\n<p>This passage is profound.</p>'
  );
});

it('cooperates with the tag-bible-references plugin', async () => {
  const processor = unified()
    .use(markdown)
    .use(tagBibleReferences, { bibliaApi })
    .use(insertBibleContent, {
      bibliaApi,
      esvApi,
      skipReferenceDetection: true,
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(raw)
    .use(html);

  const result = await processor.process(document);

  expect(String(result)).toEqual(
    '<h1>Heading</h1>\n<blockquote>\n<p style="font-size:12pt; margin-left:45pt; text-indent:-27pt;" lang="en-US">\n\t\tDo not answer a fool according to his folly \n\t</p>\n\t<p style="font-size:12pt; margin-left:63pt; text-indent:-27pt;" lang="en-US">\n\t\tlest you become like him—even you. \n\t</p>\n\t<p style="font-size:12pt; margin-left:45pt; text-indent:-27pt;" lang="en-US">\n\t\tAnswer a fool according to his folly, \n\t</p>\n\t<p style="font-size:12pt; margin-left:63pt; text-indent:-27pt;" lang="en-US">\n\t\tor else he will be wise in his own eyes.\n\t</p>\n<footer><a href="https://biblia.com/bible/leb/proverbs/26/4-5">Proverbs 26:4–5</a> (LEB)</footer>\n</blockquote>\n<p>This passage is profound.</p>'
  );
});
