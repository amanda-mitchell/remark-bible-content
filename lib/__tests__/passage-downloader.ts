import fetch from 'node-fetch';
import { u as build } from 'unist-builder';
import { createBibliaApiClient } from '@amanda-mitchell/biblia-api';
import { createEsvApiClient } from '@amanda-mitchell/esv-api';
import { createPassageDownloader } from '../passage-downloader.js';
import { getExpectedEnvironmentVariable } from '../test-util/index.js';

const bibliaApiKey = getExpectedEnvironmentVariable('BIBLIA_API_KEY');
const esvApiKey = getExpectedEnvironmentVariable('ESV_API_KEY');

const bibliaApi = createBibliaApiClient({ apiKey: bibliaApiKey, fetch });
const esvApi = createEsvApiClient({ apiKey: esvApiKey, fetch });

function createDownloader() {
  return createPassageDownloader({ bibliaApi, esvApi });
}

it('gets text from the ESV', async () => {
  const result = await createDownloader()('Proverbs 26:4-5', 'esv');

  expect(result).toEqual(
    build(
      'html',
      '<p class="block-indent"><span class="begin-line-group"></span>\n<span id="p20026004_01-1" class="line"><b class="verse-num inline" id="v20026004-1">4&nbsp;</b>&nbsp;&nbsp;Answer not a fool according to his folly,</span><br /><span id="p20026004_01-1" class="indent line">&nbsp;&nbsp;&nbsp;&nbsp;lest you be like him yourself.</span><br /><span id="p20026005_01-1" class="line"><b class="verse-num inline" id="v20026005-1">5&nbsp;</b>&nbsp;&nbsp;Answer a fool according to his folly,</span><br /><span id="p20026005_01-1" class="indent line">&nbsp;&nbsp;&nbsp;&nbsp;lest he be wise in his own eyes.</span><br /></p><span class="end-line-group"></span>'
    )
  );
});

it('gets text from the LEB', async () => {
  const result = await createDownloader()('Proverbs 26:4-5', 'leb');

  expect(result).toEqual(
    build(
      'html',
      '<p style="font-size:12pt; margin-left:45pt; text-indent:-27pt;" lang="en-US">\n\t\tDo not answer a fool according to his folly \n\t</p>\n\t<p style="font-size:12pt; margin-left:63pt; text-indent:-27pt;" lang="en-US">\n\t\tlest you become like him&mdash;even you. \n\t</p>\n\t<p style="font-size:12pt; margin-left:45pt; text-indent:-27pt;" lang="en-US">\n\t\tAnswer a fool according to his folly, \n\t</p>\n\t<p style="font-size:12pt; margin-left:63pt; text-indent:-27pt;" lang="en-US">\n\t\tor else he will be wise in his own eyes.\n\t</p>'
    )
  );
});
