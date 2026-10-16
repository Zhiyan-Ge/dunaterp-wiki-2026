import type { WikiSection } from '../site-data';
import protocols from './wet-lab-protocols.json';

const methods = [
  { source: protocols[0].sections[0], id: 'cloning', phase: 'Build', short: 'Molecular cloning' },
  { source: protocols[0].sections[1], id: 'transformation', phase: 'Transform', short: 'Algal transformation' },
  { source: protocols[0].sections[2], id: 'dna-extraction', phase: 'Characterise', short: 'Genomic DNA extraction' },
  { source: protocols[0].sections[3], id: 'qpcr', phase: 'Characterise', short: 'Genomic DNA qPCR' },
  { source: protocols[1].sections[3], id: 'chromatography', phase: 'Separate', short: 'Product separation' },
];

// The three shared methods are byte-identical in both source documents.
// Show them once; keep both original documents downloadable and fidelity-checked.
for (let i = 1; i < 4; i++) {
  if (protocols[0].sections[i].html !== protocols[1].sections[i - 1].html) {
    throw new Error('Wet-lab source methods differ: review before combining them.');
  }
}

export const wetLabSections: WikiSection[] = [
  { title: 'Experimental workflow', tocTitle: 'Workflow', eyebrow: 'Wet Lab', body: '', blocks: [{ kind: 'wet-lab-overview' }] },
  ...methods.map(({ source, id, phase, short }): WikiSection => {
    // Replace the duplicated Word outline with in-protocol links. Preserve all
    // authored introductions, procedures, reaction tables and conditions.
    const [introHtml, remainder] = source.html.split('<p>This section includes:</p>');
    const match = remainder?.match(/<h3>([\s\S]*?)<\/h3>([\s\S]*)$/);
    if (!match) throw new Error(`Unexpected source structure: ${source.title}`);
    const headings: { id: string; title: string }[] = [];
    const html = match[2].replace(/<h4>([\s\S]*?)<\/h4>/g, (_whole, content: string) => {
      const target = `method-${id}-${headings.length + 1}`;
      headings.push({ id: target, title: content.replace(/<[^>]+>/g, '').trim() });
      return `<h4 id="${target}" tabindex="-1">${content}</h4>`;
    });
    return {
      title: source.title, tocTitle: short, eyebrow: phase, body: '',
      blocks: [{ kind: 'wet-lab-method', id, introHtml, html, protocolTitle: match[1], headings }],
    };
  }),
  {
    title: 'Protocols & related work', tocTitle: 'Original protocols', body: '',
    blocks: [
      ...protocols.map(document => ({ kind: 'download' as const, src: document.file, label: `${document.label} — original protocol (DOCX)` })),
      { kind: 'paragraph', text: 'The Transcriptomics page follows the carotenoid pathway from sequence annotation to replicate-aware light comparisons, then carries the LCYB response into the mathematical model.' },
      { kind: 'paragraph', text: 'The Mathematical Modeling page records a five-state ODE from regulatory-factor activity through promoter occupancy and LCYB expression to β-carotene. The implementation requires explicit parameters and initial values, so published observations and project measurements remain distinguishable.' },
      { kind: 'links', links: [{ label: 'Transcriptomics', href: '/transcriptomics' }, { label: 'Mathematical Modeling', href: '/model' }] },
    ],
  },
];
