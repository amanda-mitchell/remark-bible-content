import type {
  createBibliaApiClient,
  AvailableBible as BibliaAvailableBible,
} from '@amanda-mitchell/biblia-api';
import type { createEsvApiClient } from '@amanda-mitchell/esv-api';

export type AvailableBible = BibliaAvailableBible | 'esv';

export type BibliaApiClient = Pick<
  ReturnType<typeof createBibliaApiClient>,
  'parse' | 'content'
>;

export type EsvApiClient = Pick<
  ReturnType<typeof createEsvApiClient>,
  'passageHtml'
>;
