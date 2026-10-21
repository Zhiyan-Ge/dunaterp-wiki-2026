import type { WikiPage } from '../site-data';
import type { ContentBlock } from './types';

const p = (text: string): ContentBlock => ({ kind: 'paragraph', text });
const h = (text: string): ContentBlock => ({ kind: 'heading', text });
const fig = (name: string, alt: string, caption: string): ContentBlock => ({
  kind: 'figure',
  src: `/figures/hp/stakeholder-${name}.webp`,
  alt,
  caption,
});

export const stakeholderAnalysis: WikiPage = {
  title: 'Stakeholder Analysis',
  eyebrow: 'Human Practices',
  intro: 'DunaTerp connects biological design with the people who shape, assess, regulate, use, or may be affected by the platform.',
  status: 'team-draft',
  sections: [
    {
      title: 'Stakeholder Map and Priorities',
      body: '“In nature nothing exists alone.” — Rachel Carson, Silent Spring (1962)',
      blocks: [
        p('DunaTerp aims to develop a programmable terpene biosynthesis platform using Dunaliella salina. Its development involves people and organizations that may influence the project or be affected by its outcomes. We therefore define our stakeholders broadly: they include those who shape our scientific decisions, assess potential applications, oversee safety, or may eventually use or encounter products made through the platform.'),
        p('To guide our engagement, we mapped these stakeholders according to two dimensions: interest, meaning how closely the project relates to their needs and concerns, and influence, meaning their ability to shape project decisions, implementation, or future adoption. The four groups below provide an initial framework for engagement. Their positions may change as target products and applications become clearer; lower interest or influence does not mean that a group’s concerns are less legitimate.'),
        {
          kind: 'table',
          caption: 'Stakeholder interest and influence map',
          columns: ['Interest', 'Influence', 'Main groups', 'Potential benefits', 'Potential risks and burdens', 'Our approach'],
          rows: [
            ['High', 'High', 'Project members, domain experts, microalgae and terpene producers', 'Research progress, collaboration, new production routes', 'R&D investment, technical failure, scale-up risks', 'Engage closely and integrate feedback into DBTL cycles'],
            ['Low', 'High', 'Food safety, biosafety, and relevant approval authorities', 'Information supporting technology assessment', 'Additional safety review and communication workload', 'Consult early on evidence and application requirements'],
            ['High', 'Low', 'Target consumers, downstream companies, competitors, environmental organizations', 'New ingredients and supply options, potential environmental benefits', 'Adaptation costs, competitive pressure, safety and environmental concerns', 'Investigate needs and test market and sustainability assumptions'],
            ['Low', 'Low', 'General public, community members, and students', 'Scientific understanding and participation', 'Information gaps and difficulty understanding the technology', 'Provide accessible education and respond to public concerns'],
          ],
        },
        p('These classifications are provisional and specific to the current project stage. A downstream company may gain substantial influence if it becomes a development partner or major buyer, while a member of the public may become a highly interested stakeholder when a relevant application is identified.'),
        h('Balancing Stakeholder Needs and Setting Priorities'),
        p('Stakeholders may value different outcomes. Researchers may prioritize novelty and reliable evidence, enterprises may emphasize cost and supply consistency, regulators may require adequate safety information, and consumers may focus on safety, affordability, and transparent communication. We therefore do not rank feedback solely by the influence of its source. Concerns involving safety and responsible research take priority; evidence that could change chassis selection, target-product choice, or process feasibility guides the next engineering cycle. Preferences concerning product format and communication are considered alongside these constraints.'),
        p('For example, pursuing several terpene products may demonstrate platform versatility, but it can also increase validation and separation requirements. Likewise, the potential use of saline resources cannot establish an environmental advantage without considering water use, energy demand, and salt management. Where stakeholder expectations conflict, we will make the trade-off explicit and identify what evidence is needed to support the decision.'),
        h('Connecting Engagement with Project Development'),
        p('Our Human Practices engagement prioritizes the first three groups to obtain scientific, regulatory, market, and application feedback. We track the connection between stakeholder input, the question it raises, the resulting project decision, and subsequent evaluation, rather than treating an interview itself as a completed feedback loop.'),
        p('Education primarily broadens engagement with the fourth group through accessible science communication and opportunities for participation. Within our Human Practices approach, education and stakeholder engagement are connected: educational exchanges may reveal concerns that inform project development, while lessons from stakeholder engagement help make educational content more relevant. The distinction lies in the purpose and use of the exchange, rather than the audience alone.'),
      ],
    },
    {
      title: 'Public Perspectives',
      body: '',
      blocks: [
        fig('1', 'Word cloud shaped like a microalga showing public perceptions of microalgae-based biomanufacturing', 'Fig. 1 Public perceptions of microalgae-based biomanufacturing'),
        {
          kind: 'figure-grid',
          figures: [
            { src: '/figures/hp/stakeholder-2-1.webp', alt: 'Poster inviting the public to participate in the microalgae questionnaire', caption: 'Fig. 2a Public questionnaire poster' },
            { src: '/figures/hp/stakeholder-2-2.webp', alt: 'Charts showing public awareness, concerns, and acceptance from 230 questionnaire responses', caption: 'Fig. 2b Questionnaire results' },
          ],
        },
        h('Analysis: Current Status'),
        p("To understand public perceptions of microalgae-based products and synthetic biology, we conducted a questionnaire survey and collected 230 responses to investigate respondents' awareness, expectations, and concerns regarding microalgae and engineered biological systems. The responses reflected both interest in the potential applications of microalgae and concerns about unfamiliar technologies, product safety, and future applications. These findings highlighted the importance of explaining not only what microalgae-based biomanufacturing can achieve, but also how its products are evaluated and how potential risks are addressed."),
        h('Reflection: Insights for Our Project'),
        p('Public acceptance cannot be inferred solely from the potential benefits of a technology. For DunaTerp, the production of high-value terpenes using Dunaliella salina offers an opportunity to explore alternative biomanufacturing pathways, but this scientific potential must be communicated in a way that the public can understand. We therefore recognized the need to distinguish established scientific knowledge from anticipated applications and to address questions about product safety, genetic engineering, and regulatory requirements without overstating the maturity of our platform.'),
        h('Response: Our Action Plan'),
        p('Accessible Science Communication: We will continue translating the principles of microalgal biomanufacturing and terpene biosynthesis into accessible educational content, connecting the scientific mechanisms of DunaTerp with familiar applications of natural compounds.'),
        p("Transparent Risk Communication: We will clearly distinguish the platform's current research progress from its potential future applications and communicate the importance of safety assessment and regulatory review."),
      ],
    },
    {
      title: 'Experience from Microalgae Enterprises',
      body: '',
      blocks: [
        fig('3', 'DunaTerp team members interviewing experts at ASXAN BIOTECH GROUP (ABG)', 'Fig. 3 Interview with experts from ASXAN BIOTECH GROUP (ABG)'),
        h('Analysis: Current Status'),
        p('Our visit to ASXAN BIOTECH GROUP (ABG) showed that the commercial value of microalgae depends on how their products meet the needs of downstream manufacturers. The experts described several application formats for algal extracts, including oil-based soft capsules, water-dispersible powders for tablets and solid beverages, and emulsions for liquid beverages and cosmetic formulations. These examples highlighted that producing a target compound is only the first step: its formulation, stability, and compatibility with customers’ manufacturing processes also influence its market potential.'),
        p('The discussion also placed microalgal production in a competitive context. The experts identified natural β-carotene as an established commercial application of Dunaliella salina, while emphasizing production efficiency and cost when evaluating new products. They also explained that the company was pursuing bacterial platforms for some subsequent development pipelines because of productivity considerations. This challenged our assumption that an endogenous biosynthetic pathway would, by itself, make a microalgal chassis commercially attractive.'),
        h('Reflection: Insights for Our Project'),
        p('For DunaTerp, the central question is therefore which terpene product and customer application could justify using D. salina. Its endogenous MEP pathway provides a biological rationale for chassis development, but commercial feasibility requires comparison with established production routes, including yeast and bacterial fermentation. Such comparisons should consider cultivation time, recoverable product yield, purification requirements, and the specifications expected by downstream customers.'),
        p('The experts also cautioned that producing multiple compounds does not automatically increase commercial value. Mixed products may introduce metabolic competition and make purification and application development more difficult. We therefore see a clearly defined target product and use case as a more practical starting point for evaluating DunaTerp than a broad claim of producing multiple valuable terpenes.'),
        h('Response: Our Action Plan'),
        p('Define a Target Market: Select a priority terpene and identify its potential downstream users, intended application, and required product form. Distinguish between supplying a purified ingredient and supplying a formulated ingredient, as these involve different processing requirements.'),
        p('Benchmark Competing Production Routes: Use published studies and available industry information to compare D. salina with relevant yeast and bacterial platforms, considering productivity, recovery, and processing costs. Treat the advantages of the MEP pathway as hypotheses to be tested.'),
      ],
    },
    {
      title: 'Challenges Faced by Microalgae-Producing Enterprises',
      body: '',
      blocks: [
        h('Analysis: Current Status'),
        p('The company’s experience illustrated how production difficulties become commercial constraints. Tubular photobioreactors were used to improve control over cultivation and contamination, while temperature management and access to suitable light remained important operating considerations. The experts also noted that monitoring equipment could be expensive. These observations showed that greater process control must be weighed against equipment investment and operating costs.'),
        p('Downstream processing provided a particularly concrete example. During the harvesting of Phaeodactylum tricornutum, the company encountered cell damage during centrifugation, allowing intracellular material to leave with the discarded liquid. Residual salts also complicated subsequent processing. Washing could reduce salt content, but could cause further losses when cells were already damaged. The commercial challenge was therefore to obtain a usable product while balancing recovery, desalting, and processing inputs.'),
        {
          kind: 'figure-grid',
          figures: [
            { src: '/figures/hp/stakeholder-4-1.webp', alt: 'Flat-panel microalgae cultivation units at the company', caption: '' },
            { src: '/figures/hp/stakeholder-4-2.webp', alt: 'Illuminated flask cultivation system at the company', caption: '' },
            { src: '/figures/hp/stakeholder-4-3.webp', alt: 'Processing equipment and pipework at the microalgae company', caption: '' },
            { src: '/figures/hp/stakeholder-4-4.webp', alt: 'Tubular photobioreactor arrays at the microalgae company', caption: '' },
          ],
          caption: 'Figure 4 Photos from visiting the microalgae company',
        },
        h('Reflection: Insights for Our Project'),
        p('These observations changed how we interpret productivity in DunaTerp. Higher intracellular terpene accumulation would have limited commercial value if much of the product were lost during harvesting or if recovery required excessive processing. The difficulties observed in P. tricornutum cannot be assumed to occur identically in D. salina, but they identify questions that our project needs to investigate.'),
        p('We therefore need to evaluate the amount and quality of the final recovered product, alongside its intracellular accumulation. Salt tolerance should likewise be assessed across the whole process: its potential cultivation benefits need to be considered together with salt removal and product recovery requirements.'),
        h('Response: Our Action Plan'),
        p('Measure Recovery Across Processing Steps: Track target-product retention during harvesting, desalting, and extraction to distinguish intracellular production from final recovered yield.'),
        p('Build a Preliminary Cost Framework: Include cultivation, harvesting, water use, salt management, extraction, and formulation, and identify which assumptions most strongly affect estimated production cost.'),
        p('Validate One Product First: Prioritize a single target compound with a defined specification. Consider additional products or co-product strategies only when there is evidence of demand and a feasible separation route.'),
      ],
    },
    {
      title: 'Government and Food Safety Regulators',
      body: '',
      blocks: [
        fig('4', 'DunaTerp team members consulting officers from a food safety regulatory department', 'Fig. 5 Consultation with food safety regulatory officers'),
        h('Analysis: Current Status'),
        p('Government consultation highlighted that the regulatory assessment of a food ingredient concerns not only the final compound, but also its production organism and manufacturing process. According to the representatives consulted, ingredients produced using genetically modified microorganisms may require a relevant safety assessment even when the final product is highly purified and contains no residual engineered microorganisms or foreign genetic material. Product purity should therefore not be treated as sufficient evidence that a regulatory assessment is unnecessary.'),
        p('The consultation also raised questions about whether existing approvals cover a change in production source. For example, approval associated with astaxanthin from Haematococcus pluvialis should not automatically be assumed to cover astaxanthin produced by engineered Dunaliella salina. The applicable assessment or application pathway would need further confirmation based on the specific product, production process, and intended use.'),
        h('Reflection: Insights for Our Project'),
        p('The key insight for DunaTerp is that regulatory feasibility should inform target-product selection from the beginning. Successful biosynthesis and purification demonstrate technical progress, but do not by themselves establish that a product is eligible for food applications. A change in biological chassis may introduce additional questions even when the target compound has an established use.'),
        p('We therefore need to evaluate each proposed application separately, connecting the identity of the target compound with its production source, processing steps, and intended use. This also requires careful communication: preliminary consultation provides guidance for project planning, while confirmed requirements must be established through the relevant official documents and competent authorities.'),
        h('Response: Our Action Plan'),
        p('Product-Specific Regulatory Review: For each priority terpene, document its intended use, production chassis, genetic modifications, and purification process. Check the scope of relevant existing approvals and identify questions requiring further confirmation.'),
        p('Safety Evidence Planning: Identify the evidence potentially needed to characterize the production organism, manufacturing process, final-product composition, and relevant residues. Use these needs to guide subsequent experimental and documentation plans.'),
        p('Application Prioritization: Consider regulatory uncertainty alongside market demand and technical feasibility when selecting the initial product. Keep consultation advice, confirmed requirements, and unresolved questions clearly distinguished.'),
      ],
    },
    {
      title: 'Scientific Research and Educational Institutions',
      body: '',
      blocks: [
        fig('5', 'DunaTerp team members in an academic exchange with Sichuan University researchers', 'Fig. 6 Academic exchange with Sichuan University researchers'),
        h('Analysis: Current Status'),
        p('Academic consultations with Professor Liu Ke, Associate Professor Xu Hui, and Researcher Qin Jiufu at Sichuan University provided critical perspectives on the biological feasibility, technical design, and application potential of DunaTerp. Their feedback revealed a common challenge: the novelty of a biological chassis must be supported by a clear scientific rationale and verifiable advantages. Professor Liu encouraged us to investigate the actual market demand for astaxanthin and other target products, while questioning whether Dunaliella salina offers sufficient advantages over established production organisms. He emphasized that claims regarding its tolerance to environmental stress and cultivation efficiency require stronger evidence.'),
        p('Associate Professor Xu focused on the scientific rigor of our design, highlighting the need to define D. salina accurately as a photosynthetic microalgal chassis rather than simply a plant chassis. He also questioned the effectiveness of our proposed biosafety switch and emphasized that directed evolution must be guided by a clearly defined engineering objective and an appropriate screening strategy. Researcher Qin further challenged our initial emphasis on product yield, noting that D. salina faces limitations in growth rate and genetic engineering tools compared with established microbial chassis. He suggested that we instead investigate its distinctive potential for photoautotrophic production using saline water and other marginal resources, while prioritizing a focused proof of concept over multiple unverified product pathways. These discussions highlighted the need to connect biological innovation with technical feasibility, resource sustainability, and realistic application scenarios.'),
        h('Reflection: Insights for Our Project'),
        p('The core insight from these academic consultations is to define the distinctive value of D. salina before pursuing further engineering complexity. Its endogenous MEP pathway and photosynthetic metabolism provide a promising foundation for terpene biosynthesis, but these features alone do not establish superiority over conventional chassis. We need to substantiate its advantages through literature, comparative analysis, and experimental evidence.'),
        p('Expert feedback also prompted us to reconsider our research priorities. Attempting to develop multiple terpene products while simultaneously optimizing metabolic regulation and biosafety could disperse our limited resources. A more focused engineering cycle, supported by clear validation criteria, would provide stronger evidence of platform feasibility. The discussions also highlighted that biosafety design, enzyme functionality, and metabolic balance cannot simply be assumed; each requires independent verification. Finally, product selection must account for market relevance and production constraints, ensuring that DunaTerp addresses a meaningful need rather than pursuing technical novelty alone.'),
        h('Response: Our Action Plan'),
        p('Chassis Advantage Validation: Strengthen the evidence supporting the distinctive characteristics of D. salina, particularly its endogenous MEP pathway, photosynthetic metabolism, and potential use of saline resources. Compare these characteristics with established production chassis rather than assuming inherent superiority.'),
        p('Focused Engineering and Verification: Prioritize a manageable number of target products and key technical modules. Establish clear validation criteria for metabolic regulation, enzyme functionality, and biosafety, using modeling and literature analysis to guide experimental design and subsequent optimization.'),
        p("Application-Oriented Project Development: Incorporate market research, production feasibility, and regulatory considerations into target selection. Following Professor Zhang Xiaohan's advice, we will also clarify the project's central innovation and strengthen the logical connection between the choice of chassis, the intended application, and the real-world problem being addressed."),
      ],
    },
    {
      title: 'Summary',
      body: "Through systematic engagement with key stakeholder groups, we recognized that DunaTerp's value lies not only in developing a programmable terpene biosynthesis platform, but also in addressing the scientific, industrial, regulatory, and social considerations associated with its application. Feedback from different stakeholders helped us reconsider the advantages of Dunaliella salina and identify the challenges that must be addressed before its potential can be translated into practical applications.",
      blocks: [
        p('Public Perspectives: Questionnaire responses revealed both interest in microalgae-based products and concerns about product safety, unfamiliar technologies, and potential risks. These findings reinforced the importance of transparent science communication and responsible innovation.'),
        p('Microalgae Enterprises: Industrial visits highlighted the importance of coordinating cultivation, biomass recovery, and downstream processing. Their experience helped us recognize that biological productivity alone cannot determine the overall performance of a production platform.'),
        p('Government and Food Safety Regulators: Consultations clarified that product purity does not automatically eliminate regulatory obligations. The production source, manufacturing process, and applicable approval requirements must all be considered when exploring food-related applications.'),
        p('Scientific Research and Educational Institutions: Expert feedback emphasized the need to establish a clear scientific rationale, validate the distinctive advantages of D. salina, prioritize feasible engineering objectives, and connect technical innovation with meaningful application scenarios.'),
        h('Priorities for Continued Development'),
        p('Technical Feasibility: The genetic engineering tools and metabolic regulation capabilities of D. salina require further validation and optimization.'),
        p('Industrial Feasibility: Cultivation efficiency, product recovery, downstream processing, and production costs must be evaluated together.'),
        p('Regulatory Feasibility: Target products and their intended applications require careful assessment against relevant food safety requirements.'),
        p('Application Relevance: The advantages of DunaTerp must be demonstrated through reliable evidence and comparisons with existing production routes.'),
        p('These challenges define the priorities for DunaTerp’s continued development. By translating stakeholder feedback into more focused research questions, clearer evaluation criteria, and more responsible application planning, we aim to develop a platform that balances biological innovation with practical feasibility, regulatory compliance, and sustainability.'),
      ],
    },
  ],
};
