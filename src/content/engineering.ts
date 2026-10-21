import type { WikiPage } from '../site-data';
import generated from './engineering.generated.json';

// Imported DOCX text/runs, with the approved spacing and OD680 corrections
// recorded in docs/reviews/wiki-consistency-20261021.json.
export const engineering = generated as unknown as WikiPage;
