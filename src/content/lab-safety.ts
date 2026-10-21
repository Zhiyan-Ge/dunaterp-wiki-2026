import type { WikiPage, WikiSection } from '../site-data';
import type { ContentBlock } from './types';

const p = (text: string): ContentBlock => ({ kind: 'paragraph', text });
const section = (title: string, ...blocks: ContentBlock[]): WikiSection => ({ title, body: '', blocks });

export const labSafety: WikiPage = {
  title: 'Laboratory Safety',
  eyebrow: 'Lab / Safety',
  status: 'review-ready',
  intro: 'Our laboratory practices and project-specific safeguards protect researchers, surrounding communities and the environment throughout the DunaTerp workflow.',
  sections: [
    section('Laboratory Safety',
      p('The safety of laboratory personnel and the surrounding environment is paramount in any research setting. This principle is particularly crucial in our iGEM project. Our team operates in a biosafety level 1 laboratory, an environment well-suited to the requirements of our experiments, ensuring safety while facilitating groundbreaking research. We adhere strictly to the iGEM competition\'s safety and security guidelines, underscoring our commitment to high safety standards.'),
      { kind: 'heading', text: 'Chemical Storage in the Laboratory' },
      p('Proper chemical management is essential for ensuring laboratory safety. All chemical reagents and substances are meticulously categorized in our lab based on their potential hazards and usage. Hazardous reagents are stored in designated safety cabinets with appropriate ventilation and locks. Each cabinet is clearly labeled with warning signs to alert team members to the potential risks. Additionally, we maintain an up-to-date inventory system that tracks all chemicals, ensuring that any handling or disposal follows the recommended safety procedures. Regular audits are conducted to verify that all substances are stored in compliance with safety regulations, minimizing the risk of accidental exposure or chemical reactions.'),
      {
        kind: 'figure-grid',
        figures: [
          {
            src: '/figures/lab-safety/chemical-storage-cabinet.webp',
            alt: 'Clearly labelled laboratory cabinets used for classified chemical storage',
            caption: 'Fig. 1 Classified chemical storage cabinet',
          },
          {
            src: '/figures/lab-safety/explosion-proof-cabinet.webp',
            alt: 'Locked yellow cabinet for storing flammable liquids',
            caption: 'Fig. 2 Explosion-proof cabinet',
          },
        ],
      },
      { kind: 'heading', text: 'Laboratory Environment and Facilities' },
      p('Our laboratory is designed to support a safe and efficient research environment. We routinely collaborate with our institution\'s safety committee to inspect and maintain our facilities, ensuring compliance with the latest safety standards. Adequate ventilation systems are installed to prevent the accumulation of hazardous fumes, and all workspaces are kept clean and organized to reduce the risk of accidents.'),
      p('Nianhui Zhang, the PI of our team, is responsible for the biosafety of our lab. He can provide us with reliable safety guidance because he has 29 years of teaching experience. Before starting work in the lab, all team members must undergo comprehensive training in safety knowledge and experimental operation under the guidance of staff and teachers.'),
      {
        kind: 'figure-grid',
        figures: [
          {
            src: '/figures/lab-safety/laboratory-bench.webp',
            alt: 'Organized laboratory benches and equipment in the team laboratory',
            caption: 'Fig. 3 Laboratory bench and equipment',
          },
          {
            src: '/figures/lab-safety/biological-safety-cabinet.webp',
            alt: 'Biological safety cabinet used for controlled laboratory work',
            caption: 'Fig. 4 Biological safety cabinet',
          },
        ],
      },
    ),
    section('SCU-China DunaTerp',
      p('SCU China’s 2026 program DunaTerp aims to engineer the halophilic microalga *Dunaliella salina* as a platform for producing terpene-derived ingredients. Because this organism is cultivated in liquid culture and can occur in natural saline habitats, our safety assessment considers the entire production pathway—from cultivation and harvesting to waste handling and the possibility of accidental release. The project’s proposed biological safeguard is a salt-responsive mazEF suicide switch, which is intended to limit the survival of engineered algae outside controlled culture conditions.'),
      {
        kind: 'table',
        caption: 'Potential contact and impact across the production pathway',
        columns: ['Stage or location', 'Possible contact or impact'],
        rows: [
          ['Cultivation and harvesting', 'Culture vessels, operators, sampling and transfer operations'],
          ['Facility drainage and waste handling', 'Residual cells in culture liquids, wash water, filters or harvested biomass'],
          ['Receiving waters and nearby environments', 'Native microorganisms and aquatic communities, particularly in saline habitats'],
          ['Downstream ingredient processing', 'Workers handling algal biomass or purified products'],
        ],
      },
      { kind: 'heading', text: 'Biosafety' },
      p('All heterologous genes are endogenous carotenoid enzymes sourced from plants or algae: the ketolase BKT from *Haematococcus pluvialis*, CCD1 from *Arabidopsis*, GjCCD4a and GjALDH2C3 from gardenia (*Gardenia jasminoides*), and CitCCD4 from citrus. None encodes a toxin, allergen, virulence factor, hormone disruptor, or antimicrobial-resistance determinant intended for environmental spread. Cloning and enzyme-activity validation use a non-pathogenic laboratory *Escherichia coli* (K-12 derived) strain that remains inside the laboratory and is never released; any selectable marker is confined to this cloning host.'),
      p('Our proposed safety circuit uses the salt-responsive PDCA1 promoter to drive the antitoxin gene mazE, while the weaker Pip promoter drives the toxin gene mazF. Under high-salt cultivation conditions, PDCA1 is expected to promote MazE production, which can neutralize MazF. If salinity falls, reduced PDCA1 activity is intended to lower MazE production and allow MazF to inhibit cell growth. The salt-responsive behavior of the PDCA1 promoter has been reported in *D. salina*, and MazF-family toxins are bacterial endoribonucleases whose activity can be neutralized by their cognate antitoxins.'),
      { kind: 'heading', text: 'Biocontainment' },
      p('During the cultivation process, we ensure that all the culture media remain in a closed state; no wastewater or used culture media will be discharged into natural water bodies. All biological waste is sterilized under high pressure or chemically deactivated before disposal. It is handled using dedicated equipment and the operation and entry/exit situations are recorded. Open ponds or field discharges are not carried out; any future large-scale use will require waiting for environmental impact assessment and approval from relevant departments.'),
      p('The suicide switch is intended to provide an additional biological safeguard if cells escape physical containment. It should be considered alongside, rather than in place of, containment and waste-handling measures. Beyond the genetic switch, *D. salina* is obligately halophilic and cannot establish in fresh water or ordinary soil; a low-salt natural environment is already non-permissive for its growth. This ecological-niche mismatch acts as a passive second barrier behind the active kill switch.'),
      { kind: 'heading', text: 'Pollution and Use of Natural Resources' },
      p('An accidental release could introduce engineered cells or genetic material into the environment. This possibility deserves particular attention because *D. salina* can be an important primary producer in hypersaline ecosystems. Culture liquids and wash water may also carry high salt concentrations, so their disposal should be managed to avoid uncontrolled discharge.'),
      p('DunaTerp’s planned products include carotenoid-derived ingredients and aroma compounds. The intended value of these products does not remove the need to manage engineered biomass and process residues responsibly. Containment, collection, and appropriate treatment of culture waste can help limit both biological release and unnecessary environmental salt loading.'),
      { kind: 'heading', text: 'Socio-economic Impacts' },
      p('Introducing an engineered microalgal platform requires careful attention to public perception and acceptance. Transparent communication about the chassis’s non-pathogenic nature, the salt-dependent kill switch, and strictly closed production helps build trust; the food-grade, clean-label positioning further lowers consumer concern. Route-to-market depends on novel-food/GRAS-type regulatory approval and active dialogue with authorities and stakeholders. Initial production cost and scale-up must be addressed by demonstrating safety data and economic viability. Throughout, we emphasize closed, controlled, non-release production rather than environmental dispersal.'),
    ),
  ],
};
