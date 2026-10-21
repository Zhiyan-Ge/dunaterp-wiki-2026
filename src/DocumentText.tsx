import type { DocumentTextRun } from './content/types';
import { formatScientificNames } from './scientific-names';

/** Text and formatting imported from the team's Word document; no HTML execution. */
export function DocumentText({ runs }: { runs: DocumentTextRun[] }) {
  return <>{formatScientificNames(runs).map((run, index) => {
    let text = <>{run.text}</>;
    if (run.verticalAlign === 'subscript') text = <sub>{text}</sub>;
    if (run.verticalAlign === 'superscript') text = <sup>{text}</sup>;
    if (run.italic) text = <em className={run.scientificName ? 'scientific-name' : undefined}>{text}</em>;
    if (run.bold) text = <strong>{text}</strong>;
    return run.href
      ? <a key={index} href={run.href} className={/^#reference-\d+$/.test(run.href) ? 'inline-citation' : undefined}>{text}</a>
      : <span key={index}>{text}</span>;
  })}</>;
}
