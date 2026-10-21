import type { WikiPage } from '../site-data';
import generated from './lab-notebook.generated.json';

export const labNotebook = generated as unknown as WikiPage;
