import type { WikiSection } from '../site-data';
import protocols from './wet-lab-protocols.json';

// Preserve both teams' authored sequences, even where their methods overlap.
export const wetLabSections: WikiSection[] = protocols.flatMap((document) =>
  document.sections.map((section, index): WikiSection => ({
    title: section.title,
    tocTitle: `${document.label} · ${section.title}`,
    eyebrow: document.label,
    body: '',
    blocks: [
      { kind: 'wet-lab-protocol', html: section.html },
      ...(index === document.sections.length - 1 ? [{
        kind: 'download' as const,
        src: document.file,
        label: `${document.label} — original protocol (DOCX)`,
      }] : []),
    ],
  })),
);
