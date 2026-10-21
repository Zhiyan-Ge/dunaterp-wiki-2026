import type { DocumentTextRun } from './content/types';

// Taxa used in the Wiki. An explicit list avoids treating ordinary English,
// gene symbols, protein names or strain identifiers as scientific names.
const taxa: ReadonlyArray<readonly [string, readonly string[]]> = [
  ['Dunaliella', ['salina', 'bardawil']],
  ['Haematococcus', ['pluvialis']],
  ['Escherichia', ['coli']],
  ['Agrobacterium', ['tumefaciens']],
  ['Arabidopsis', ['thaliana']],
  ['Bacillus', ['subtilis']],
  ['Citrus', ['unshiu']],
  ['Crocus', ['sativus']],
  ['Gardenia', ['jasminoides']],
  ['Phaeodactylum', ['tricornutum']],
  ['Scenedesmus', ['dimorphus']],
  ['Taxus', ['brevifolia']],
  ['Saccharomyces', ['cerevisiae']],
  ['Chlamydomonas', ['reinhardtii']],
  ['Acinetobacter', []],
];

const names = taxa.flatMap(([genus, species]) => [
  species.length ? `${genus}(?:\\s+(?:${species.join('|')}))?` : genus,
  ...species.map(epithet => `${genus[0]}\\.\\s*${epithet}`),
]);
const scientificName = new RegExp(`(?<![A-Za-z])(?:${names.join('|')})(?![A-Za-z])`, 'g');

export function scientificNameRanges(text: string) {
  return Array.from(text.matchAll(scientificName), match => ({
    start: match.index,
    end: match.index + match[0].length,
  }));
}

type ScientificTextRun = DocumentTextRun & { scientificName?: boolean };

/** Preserve every character and existing run attribute, including split names. */
export function formatScientificNames(runs: DocumentTextRun[]): ScientificTextRun[] {
  const ranges = scientificNameRanges(runs.map(run => run.text).join(''));
  if (!ranges.length) return runs;
  let offset = 0;
  return runs.flatMap(run => {
    const start = offset;
    offset += run.text.length;
    const overlaps = ranges.filter(range => range.start < offset && range.end > start);
    if (!overlaps.length) return [run];
    const cuts = [...new Set([0, run.text.length, ...overlaps.flatMap(range => [
      Math.max(0, range.start - start), Math.min(run.text.length, range.end - start),
    ])])].sort((a, b) => a - b);
    return cuts.slice(0, -1).map((cut, index) => {
      const text = run.text.slice(cut, cuts[index + 1]);
      return overlaps.some(range => range.start <= start + cut && range.end > start + cut)
        ? { ...run, text, italic: true, scientificName: true }
        : { ...run, text };
    });
  });
}
