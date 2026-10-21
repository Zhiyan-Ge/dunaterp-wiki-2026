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
    {
      title: 'β-ionone and β-citraurin module',
      tocTitle: 'β-ionone / β-citraurin',
      body: 'This notebook records CCD1- and CitCCD4-based biosynthesis work in Dunaliella salina FACHB-435 from August to October 2026, including expression-vector construction, transformation, molecular identification and expression verification.',
      items: [
        '35S and RBCS2 promoter constructs and chloroplast targeting',
        'Backbone amplification, fragment assembly and clone screening',
        'Dunaliella salina transformation, selection and cultivation',
        'Colony PCR, sequencing and construct re-evaluation',
        'Genomic PCR, RNA extraction and RT-qPCR',
        'Metabolomic analysis and thin-layer chromatography assessment',
      ],
      blocks: [
        pdf('/protocols/Notebook_Beta_Ionone_Beta_Citraurin_EN.pdf', 'β-ionone and β-citraurin notebook (PDF)'),
      ],
    },
    {
      title: '2146 experimental notebook',
      tocTitle: '2146 notebook',
      body: 'This daily experimental notebook covers July 27 to September 22, 2026. It records pCAMBIA1302-based cloning work involving 2146, HpBKT, GjCCD4a and GjALDH2C3, together with RBCS2 and signal-peptide constructs, plasmid verification and Dunaliella salina transformation.',
      items: [
        'Culture-medium preparation and vector amplification',
        'Target-fragment PCR, electrophoresis and gel purification',
        'Homologous recombination and bacterial transformation',
        '2146 plasmid propagation, extraction and algal transformation',
        'RBCS2 and signal-peptide construct screening',
        'Sequencing, reconstruction and follow-up culture records',
      ],
      blocks: [
        pdf('/protocols/Notebook_CPP2146_EN.pdf', '2146 experimental notebook (PDF)'),
        { kind: 'download', src: '/protocols/Notebook_CPP2146_EN.docx', label: 'Download original DOCX' },
      ],
    },
  ],
};
