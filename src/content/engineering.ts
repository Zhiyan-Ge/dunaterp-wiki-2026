import type { WikiPage } from '../site-data';
import generated from './engineering.generated.json';

// Exact text and run formatting from the team's consolidated Engineering DOCX.
export const engineering = generated as unknown as WikiPage;
