import build from 'unist-builder';
import type {
  BibliaApiClient,
  EsvApiClient,
  AvailableBible,
} from './common-types';

type createPassageDownloaderOptions = {
  bibliaApi?: BibliaApiClient;
  esvApi?: EsvApiClient;
};

export function createPassageDownloader({
  bibliaApi,
  esvApi,
}: createPassageDownloaderOptions) {
  return async function functionDownloadPassage(
    passage: string,
    version: AvailableBible
  ) {
    const text = await downloadPassageText(passage, version);

    // CONSIDER: It would probably be good to strip insignificant whitespace
    // and minify the HTML. Converting to all the way to a markdown AST would
    // be great, too, but the existing library for doing so throws away all of the CSS.
    return build('html', text.trim());
  };

  function downloadPassageText(passage: string, version: AvailableBible) {
    if (version == 'esv') {
      return downloadEsvPassage(passage);
    }

    return downloadBibliaPassage(passage, version);
  }

  async function downloadEsvPassage(passage: string) {
    if (!esvApi) {
      throw new Error('ESV passages cannot be downloaded without the ESV API.');
    }

    const { passages } = await esvApi.passageHtml(passage, {
      includePassageReferences: false,
      includeFootnotes: false,
      includeHeadings: false,
      includeShortCopyright: false,
      includeChapterNumbers: false,
      includeSubheadings: false,
      includeAudioLink: false,
    });

    return passages[0];
  }

  async function downloadBibliaPassage(
    passage: string,
    version: Exclude<AvailableBible, 'esv'>
  ) {
    if (!bibliaApi) {
      throw new Error(
        `${version} passages cannot be downloaded without the Biblia API.`
      );
    }

    const result = await bibliaApi.content({
      passage,
      bible: version,
      format: 'html',
    });

    return result;
  }
}
