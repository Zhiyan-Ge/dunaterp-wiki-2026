import type { WikiSection } from '../site-data';
import generated from './engineering-products.generated.json';

export const engineeringProductSections = generated as unknown as WikiSection[];
