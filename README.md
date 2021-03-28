# @amanda-mitchell/remark-bible-content

This is a plugin for remark that detects paragraphs consisting of a single Bible reference and replaces them with the text of the passage.

In this example markdown document:

```markdown
Proverbs 26:4-5 is a passage that has particularly special significance to me.

bible: Proverbs 26:4-5
```

The second paragraph would be replaced with the text of Proverbs 26:4-5 inside of a blockquote with a linked citation in a footer element.

## Installation

```
yarn add @amanda-mitchell/biblia-api @amanda-mitchell/remark-bible-content
```

If you want to include quotations from the ESV, you'll also need to run

```
yarn add @amanda-mitchell/esv-api
```

## Usage

```js
import fetch from 'node-fetch';
import unified from 'unified';
import markdown from 'remark-parse';
import remarkRehype from 'remark-rehype';
import raw from 'rehype-raw';
import html from 'rehype-stringify';
import { createBibliaApiClient } from '@amanda-mitchell/biblia-api';
import { createEsvApiClient } from '@amanda-mitchell/esv-api'; // only required when using the ESV.
import { insertBibleContent } from '@amanda-mitchell/remark-bible-content';

const bibliaApiKey =
  'Go to https://bibliaapi.com/docs/API_Keys to generate an API key.';
const esvApiKey =
  'Go to https://api.esv.org/ to register an application and get an API key.';

const bibliaApi = createBibliaApiClient({ apiKey: bibliaApiKey, fetch });
const esvApi = createEsvApiClient({ apiKey: esvApiKey, fetch });

const processor = unified()
  .use(markdown)
  .use(insertBibleContent, {
    bibliaApi,
    esvApi, // only required when using the ESV.
    version: 'esv',
  })
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(raw)
  .use(html);

const markdownDoc = `# Heading

bible: Prov 26:4-5

This passage is profound.`;

processor.process(markdownDoc).then(result => console.log(String(result)));
```

When run, this script will print

<!-- prettier-ignore -->
```html
<h1>Heading</h1>
<blockquote>
<p class="block-indent"><span class="begin-line-group"></span>
<span id="p20026004_01-1" class="line"><b class="verse-num inline" id="v20026004-1">4&nbsp;</b>&nbsp;Answer not a fool according to his folly,</span><br><span id="p20026004_01-1" class="indent line">&nbsp;lest you be like him yourself.</span><br><span id="p20026005_01-1" class="line"><b class="verse-num inline" id="v20026005-1">5&nbsp;</b>&nbsp;Answer a fool according to his folly,</span><br><span id="p20026005_01-1" class="indent line">&nbsp;lest he be wise in his own eyes.</span><br></p><span class="end-line-group"></span>
<footer><a href="https://biblia.com/bible/esv/proverbs/26/4-5">Proverbs 26:4–5</a> (ESV)</footer>
</blockquote>
<p>This passage is profound.</p>
```

### Options

#### `bibliaApi`

Required. This should be an instance of the client from `@amanda-mitchell/biblia-api`.

#### `esvApi`

Required when `version` is set to `'esv'`. This should be an instance of the client from `@amanda-mitchell/esv-api`.

#### `version`

Optional. The Bible version whose content should be retrieved. This may be any version string supported by the Biblia API or the string `'esv'`. Defaults to `'leb'`.

#### `skipReferenceDetection`

Optional. When using `@amanda-mitchell/remark-tag-bible-references`, setting this to `true` will cause this plugin to only replace paragraphs that have already been tagged by that plugin. Defaults to `false`.

## Open issues

The `{ allowDangerousHtml: true }` option and `rehype-raw` plugins are required when transforming this plugin's output to HTML because existing plugins don't supply the means to preserve CSS when performing a roundtrip to Markdown and back to HTML. I would be happy to accept PRs that massage the API results into a more sensible Markdown AST, as long as it preserves the style info.
