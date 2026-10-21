import type { DocumentTextRun } from './content/types';

/** Text and formatting imported from the team's Word document; no HTML execution. */
export function DocumentText({ runs }: { runs: DocumentTextRun[] }) {
  return <>{runs.map((run, index) => {
    let text = <>{run.text}</>;
    if (run.italic) text = <em>{text}</em>;
    if (run.bold) text = <strong>{text}</strong>;
    return run.href
      ? <a key={index} href={run.href}>{text}</a>
      : <span key={index}>{text}</span>;
  })}</>;
}
