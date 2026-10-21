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
      title: '2146 experiment module',
      tocTitle: '2146 notebook',
      body: 'This notebook records the dated bench work behind the pCAMBIA1302-based 2146 constructs, from medium preparation and plasmid amplification to target-gene cloning, homologous recombination, sequencing verification and the first Dunaliella salina transformation between July and September 2026.',
      items: [
        'Experimental overview: vector, target genes, hosts and reagents',
        'LB and DM medium preparation for E. coli and D. salina',
        'pCAMBIA1302 transformation, culture and plasmid extraction',
        'Vector backbone and target-gene fragment amplification',
        'Homologous recombination, colony PCR and sequencing verification',
        'RBCS2 signal-peptide fusions and D. salina transformation',
      ],
      blocks: [
        pdf('/protocols/Notebook_2146_EN.pdf', '2146 experiment notebook (PDF)'),
      ],
    },
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
      title: 'β-Ionone and β-citraurin module',
      tocTitle: 'β-Ionone / β-Citraurin',
      body: 'This notebook records the dated bench work for the β-ionone and β-citraurin routes, covering strain screening, metabolomics analysis, transcriptional validation and product verification.',
      items: [
        'Strain screening and single-colony isolation',
        'Metabolomics sample preparation and analysis',
        'Transcriptional validation of the target genes',
        'Product verification of the biosynthesis routes',
      ],
      blocks: [
        pdf('/protocols/Notebook_Beta_Ionone_Beta_Citraurin_EN.pdf', 'β-Ionone and β-citraurin notebook (PDF)'),
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
