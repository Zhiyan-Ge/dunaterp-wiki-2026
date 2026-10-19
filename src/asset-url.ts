import deployAssets from './content/deploy-assets.json';

const assets: Record<string, string> = deployAssets;

/** Resolve bundled assets, including deduplicated, lossless deployment images. */
export function assetUrl(src: string): string {
  const raw = src.trim();
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(raw)) return raw;
  const relative = raw.replace(/^\/+/, '');
  if (/^(?:data|blob):/i.test(relative)) return relative;
  const mapped = assets[relative] ?? relative;
  if (/^(?:data|blob):/i.test(mapped)) return mapped;
  const base = import.meta.env.BASE_URL || '/';
  return `${base.endsWith('/') ? base : `${base}/`}${mapped}`;
}
