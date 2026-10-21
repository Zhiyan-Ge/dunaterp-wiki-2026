import type { WikiPage, WikiSection } from '../site-data';
import type { ContentBlock } from './types';

const p = (text: string): ContentBlock => ({ kind: 'paragraph', text });
const section = (title: string, ...blocks: ContentBlock[]): WikiSection => ({ title, body: '', blocks });

export const labSafety: WikiPage = {
  title: 'Laboratory Safety',
  eyebrow: 'Lab / Safety',
  status: 'review-ready',
  intro: 'The safety of laboratory personnel and the surrounding environment is paramount in any research setting. Our team works in a biosafety level 1 laboratory suited to the requirements of our experiments, and follows the iGEM competition’s safety and security guidelines throughout the project.',
  sections: [
    section('Chemical Storage in the Laboratory',
      p('Proper chemical management is essential for laboratory safety. Reagents are categorized according to their hazards and use. Hazardous chemicals are kept in designated safety cabinets with appropriate ventilation and locks, and each cabinet carries clear warning labels. An up-to-date inventory supports correct handling and disposal, while regular audits verify that materials remain stored in accordance with laboratory safety requirements.'),
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
    ),
    section('Laboratory Environment and Facilities',
      p('Our laboratory is maintained as a safe and efficient research environment. We work with the institutional safety committee to inspect and maintain the facilities, and adequate ventilation helps prevent the accumulation of hazardous fumes. Workspaces are kept clean and organized to reduce the risk of accidents.'),
      p('Nianhui Zhang, the team PI, is responsible for laboratory biosafety and provides safety guidance based on 29 years of teaching experience. Before beginning laboratory work, every team member completes training in safety knowledge and experimental procedures under the guidance of staff and teachers.'),
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
      p('SCU-China’s 2026 project DunaTerp aims to engineer the halophilic microalga *Dunaliella salina* as a platform for producing terpene-derived ingredients. Because this organism is cultivated in liquid culture and can occur in natural saline habitats, our assessment covers the full production pathway—from cultivation and harvesting to waste handling and accidental release. The proposed biological safeguard is a salt-responsive mazEF suicide switch intended to limit the survival of engineered algae outside controlled cultivation conditions.'),
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
    ),
    section('Biosafety',
      p('The heterologous carotenoid-pathway enzymes are sourced from plants or algae: ketolase BKT from *Haematococcus pluvialis*, CCD1 from *Arabidopsis*, GjCCD4a and GjALDH2C3 from gardenia (*Gardenia jasminoides*), and CitCCD4 from citrus. None is intended to introduce a toxin, allergen, virulence factor, hormone disruptor or antimicrobial-resistance determinant into the production pathway. Cloning and enzyme-activity validation use a non-pathogenic, K-12-derived laboratory *Escherichia coli* strain that remains inside the laboratory; selectable markers are confined to this cloning host.'),
      p('The proposed safety circuit uses the salt-responsive PDCA1 promoter to drive the antitoxin gene mazE, while the weaker Pip promoter drives the toxin gene mazF. Under high-salt cultivation conditions, PDCA1 is expected to promote MazE production and neutralize MazF. If salinity falls, reduced PDCA1 activity is intended to lower MazE production, allowing MazF to inhibit cell growth. The salt-responsive behavior of the PDCA1 promoter has been reported in *D. salina*, and MazF-family toxins are bacterial endoribonucleases whose activity can be neutralized by their cognate antitoxins.'),
    ),
    section('Biocontainment',
      p('Throughout cultivation, culture media remain in closed systems. Wastewater and used culture medium are not discharged into natural water bodies. Biological waste is sterilized under high pressure or chemically deactivated before disposal, handled with dedicated equipment, and recorded during operation and movement. The project does not use open ponds or field release; any future large-scale application would require environmental assessment and regulatory approval.'),
      p('The suicide switch provides an additional biological safeguard if cells escape physical containment. It complements rather than replaces closed cultivation and waste treatment. *D. salina* is obligately halophilic and cannot establish in fresh water or ordinary soil, so the ecological mismatch of a low-salt receiving environment forms a passive second barrier behind the active kill switch.'),
    ),
    section('Pollution and Use of Natural Resources',
      p('An accidental release could introduce engineered cells or genetic material into the environment. This possibility requires particular attention because *D. salina* can be an important primary producer in hypersaline ecosystems. Culture liquids and wash water may also contain high salt concentrations, so disposal must prevent uncontrolled discharge.'),
      p('DunaTerp’s planned products include carotenoid-derived ingredients and aroma compounds. Their intended value does not remove the need to manage engineered biomass and process residues responsibly. Containment, collection and appropriate treatment of culture waste limit both biological release and unnecessary environmental salt loading.'),
    ),
    section('Socio-economic Impacts',
      p('Introducing an engineered microalgal platform requires careful attention to public understanding and acceptance. Transparent communication about the chassis’s non-pathogenic nature, the salt-dependent kill switch and closed production can support trust, while the food-grade, clean-label positioning explains the intended application. A route to market will depend on the relevant novel-food or GRAS-type regulatory approval and continuing dialogue with authorities and stakeholders. Production cost and scale-up must be supported by safety evidence and economic evaluation. Throughout development, DunaTerp is framed as a closed, controlled and non-release production system.'),
    ),
  ],
};
