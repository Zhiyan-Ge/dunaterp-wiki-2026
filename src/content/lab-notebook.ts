import type { WikiPage } from '../site-data';
import type { ContentBlock } from './types';

const pdf = (src: string, label: string): Extract<ContentBlock, { kind: 'pdf' }> => ({
  kind: 'pdf',
  src,
  downloadSrc: src,
  label,
  downloadLabel: 'Download PDF',
});

export const labNotebook: WikiPage = {
  title: 'Lab Notebook',
  eyebrow: 'Lab / Notebook',
  intro: 'Following the 2025-style notebook layout, this page keeps the chapter overview on-page and provides the full dated laboratory records as PDFs for direct reading and download.',
  status: 'team-draft',
  sections: [
    {
      title: 'Astaxanthin and crocetin module',
      tocTitle: 'Astaxanthin / Crocetin',
      body: 'This notebook records the construction, screening and resequencing workflow for the astaxanthin and crocetin modules in Dunaliella salina from July to September 2026.',
      items: [
        'Experimental preparation and vector amplification',
        'Fragment amplification and initial plasmid construction',
        'Sequencing preparation and transformation-condition adjustment',
        'Promoter and signal-peptide construct screening',
        'Reconstruction after suspected cassette loss',
        'End-of-September resequencing and candidate re-evaluation',
      ],
      blocks: [
        pdf('/protocols/Notebook_Astaxanthin_Crocetin_EN.pdf', 'Astaxanthin and crocetin notebook (PDF)'),
      ],
    },
    {
      title: 'Safety module',
      tocTitle: 'Safety notebook',
      body: 'This notebook records the salt-responsive safety-module work, including PDCA1 promoter amplification, reporter construction, MazF validation, transformation-condition optimisation and follow-up growth monitoring in D. salina.',
      items: [
        'PDCA1 promoter amplification from genomic DNA',
        'p2301-PDCA1-EGFP reporter construction and verification',
        'p1302-CaMV35S-mazF cloning and sequence confirmation',
        'Transformation and recovery-condition optimisation',
        'Hygromycin enrichment and mazF target detection',
        'MazF growth-curve recording and Pip-mazF assembly follow-up',
      ],
      blocks: [
        pdf('/protocols/Notebook_Safety_EN.pdf', 'Safety notebook (PDF)'),
      ],
    },
  ],
};
