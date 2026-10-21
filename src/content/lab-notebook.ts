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
  intro: 'Our detailed laboratory notebooks are provided as PDFs.',
  status: 'team-draft',
  sections: [
    {
      title: '2146 experiment module',
      tocTitle: '2146 notebook',
      body: '',
      blocks: [
        pdf('/protocols/Notebook_CPP2146_EN.pdf', '2146 experiment notebook (PDF)'),
      ],
    },
    {
      title: 'Astaxanthin and crocetin module',
      tocTitle: 'Astaxanthin / Crocetin',
      body: '',
      blocks: [
        pdf('/protocols/Notebook_Astaxanthin_Crocetin_EN.pdf', 'Astaxanthin and crocetin notebook (PDF)'),
      ],
    },
    {
      title: 'β-Ionone and β-citraurin module',
      tocTitle: 'β-Ionone / β-Citraurin',
      body: '',
      blocks: [
        pdf('/protocols/Notebook_Beta_Ionone_Beta_Citraurin_EN.pdf', 'β-Ionone and β-citraurin notebook (PDF)'),
      ],
    },
    {
      title: 'Safety module',
      tocTitle: 'Safety notebook',
      body: '',
      blocks: [
        pdf('/protocols/Notebook_Safety_EN.pdf', 'Safety notebook (PDF)'),
      ],
    },
  ],
};
