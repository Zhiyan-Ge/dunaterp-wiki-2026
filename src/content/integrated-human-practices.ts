import type { WikiPage, WikiSection } from '../site-data';
import type { ContentBlock, WikiReference } from './types';
import generated from './integrated-human-practices.generated.json';
import { stakeholderAnalysis } from './stakeholder-analysis';

type GeneratedIhp = {
  background: WikiSection;
  improvement: WikiSection;
  references: WikiReference[];
};

const source = generated as unknown as GeneratedIhp;

function stakeholderBlocks(): ContentBlock[] {
  return stakeholderAnalysis.sections.map((section) => {
    const blocks: ContentBlock[] = [];
    if (section.body) blocks.push({ kind: 'paragraph', text: section.body });
    if (section.blocks) blocks.push(...section.blocks);
    if (section.items?.length) {
      blocks.push({
        kind: 'document-list',
        items: section.items.map((item) => [{ text: item }]),
      });
    }
    if (section.note) blocks.push({ kind: 'paragraph', text: section.note });
    return { kind: 'details', summary: section.title, blocks };
  });
}

export const integratedHumanPractices: WikiPage = {
  title: 'Integrated Human Practices',
  eyebrow: 'Human Practices',
  intro: 'DunaTerp developed through a continuous cycle of research, dialogue, reflection and redesign. Background research defined the problem, stakeholder engagement tested our assumptions, and each round of feedback produced a documented change in the project.',
  status: 'team-draft',
  sections: [
    source.background,
    {
      title: 'Stakeholder Analysis',
      body: 'We mapped the people and organisations who shape, assess, regulate, use or may be affected by DunaTerp, then translated their priorities into project decisions.',
      blocks: stakeholderBlocks(),
    },
    source.improvement,
  ],
  references: source.references,
};
