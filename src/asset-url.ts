import deployAssets from './content/deploy-assets.json';
import localAssets from './content/local-assets.json';

const assets: Record<string, string> = import.meta.env.VITE_LOCAL_ASSETS === "1" ? localAssets : deployAssets;

/** Resolve official CDN assets, with local aliases for offline review tools. */
export function assetUrl(src: string): string {
  const raw = src.trim();
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(raw)) return raw;
  const relative = raw.replace(/^\/+/, '');
  if (/^(?:data|blob):/i.test(relative)) return relative;
  const mapped = assets[relative] ?? relative;
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(mapped)) return mapped;
  const base = import.meta.env.BASE_URL || '/';
  return `${base.endsWith('/') ? base : `${base}/`}${mapped}`;
}
