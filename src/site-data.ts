import type { ContentBlock, WikiReference } from './content/types';
import { refs } from './content/references';
import { safety } from './content/safety';
import { protein } from './content/protein';
import { dryLabNavigation, dryLabIndex, hardware, hardwareDesign, metabolomics, modeling, transcriptomics } from './content/dry-lab';

export type WikiSection = {
  title: string;
  tocTitle?: string;
  body: string;
  eyebrow?: string;
  items?: string[];
  note?: string;
  blocks?: ContentBlock[];
};

export type WikiPage = {
  title: string;
  eyebrow: string;
  intro: string;
  status: "team-draft" | "structure-only" | "review-ready";
  sections: WikiSection[];
  figure?: { src: string; alt: string; caption: string };
  references?: WikiReference[];
};

export const navigation: Array<{ label: string; items: ReadonlyArray<readonly [string, string]> }> = [
  { label: "Wet Lab", items: [["Description", "/project-description"], ["Engineering", "/engineering"], ["Experiments", "/experiments"], ["Results", "/results"], ["Safety", "/safety-and-security"]] },
  { label: "Dry Lab", items: dryLabNavigation },
  { label: "Human Practices", items: [["Human Practices", "/human-practices"], ["Sustainability", "/sustainability"], ["Education", "/education"]] },
  { label: "People", items: [["Team", "/team"], ["Attributions", "/attributions"], ["Responsible AI", "/responsible-ai"]] },
];

/** The compact header groups Dry Lab into its two main entrances. Indexes and
 * archives expand that group so no existing work disappears from view. */
export const archiveNavigation = navigation.map((group) => group.label === "Dry Lab"
  ? {
      ...group,
      items: [
        ["Transcriptomics", "/transcriptomics"],
        ["Mathematical Modeling", "/model"],
        ["Metabolomics", "/metabolomics"],
        ["Protein", "/protein"],
        ["Hardware Modeling", "/hardware"],
        ["Hardware Design", "/hardware-design"],
      ] as const,
    }
  : group);

export const pages: Record<string, WikiPage> = {
  'dry-lab': dryLabIndex,
  transcriptomics,
  metabolomics,
  protein,
  "project-description": {
    title: "DunaTerp: a programmable terpenoid platform",
    eyebrow: "Project description",
    intro: "DunaTerp reprogrammes carotenoid metabolism in the halophilic microalga Dunaliella salina. The core design introduces the project-selected transcription factor 2146 to redirect pathway flux toward a competitive β-carotene hub; four downstream product designs demonstrate what that programmable chassis can support.",
    status: "team-draft",
    references: [refs.oren2005, refs.borowitzka2013, refs.lan2022, refs.mialoundama2010],
    sections: [
      {
        eyebrow: "Value and production landscape",
        title: "Background & Challenge",
        body: "Terpenoids are used across food, nutrition, aroma, colour and other high-value applications. Current supply spans chemical synthesis, plant extraction and biological production, but each route leaves a gap: chemical synthesis can bring process and environmental costs; plant extraction is constrained by slow growth, variable abundance, land and freshwater demand; conventional yeast or bacterial factories often rely on sterile freshwater cultivation and energy-intensive operation. The project therefore asks whether a salt-compatible photosynthetic chassis can make this production landscape more practical [2]."
      },
      {
        eyebrow: "Why this chassis",
        title: "A Chassis Shaped by Salt",
        body: "Dunaliella salina brings three connected advantages. First, its tolerance of seawater and hypersaline media supports cultivation in conditions that suppress many contaminants and reduces dependence on freshwater and arable land. Second, it already contains a complete MEP-to-carotenoid pathway and naturally accumulates β-carotene, providing a starting network for engineering. Third, its photosynthetic, salt-compatible biology opens a broad application space in saline environments rather than tying the platform to conventional sterile freshwater fermentation [1]."
      },
      {
        eyebrow: "The core intervention",
        title: "Reprogramme the Metabolic Engine",
        body: "DunaTerp does not stop at using a naturally productive alga. The project identifies and introduces transcription factor 2146 as a regulatory input intended to reshape carotenoid-pathway expression and redirect metabolic flux toward competitive β-carotene synthesis. This turns the native β-carotene pool from a fixed biological trait into the shared, programmable hub of the platform. LCYB remains the enzymatic gate from lycopene into that hub, while TF2146 provides the upstream regulatory intervention [3] [4].",
      },
      {
        eyebrow: "Model-guided design",
        title: "Connect Regulation to Flux",
        body: "The modeling framework follows the control chain from transcription-factor activity and promoter occupancy to LCYB transcript, active enzyme, lycopene conversion and β-carotene supply. A second layer examines how downstream reactions draw from that shared pool. Together, these models define which regulatory, expression, metabolite and kinetic measurements are needed to test whether TF2146 changes pathway allocation as intended."
      },
      {
        eyebrow: "Downstream demonstrations",
        title: "Four Product Designs from One Hub",
        body: "Only after establishing the chassis and its regulatory logic does the platform branch into four high-value products. BKT and BCH extend the hub toward astaxanthin; CCD1 cleaves β-carotene to β-ionone; BCH supplies zeaxanthin for the GjCCD4a–GjALDH2C3 crocetin route and the CitCCD4 β-citraurin route. The routes are designed as separate strains so each branch can be built and evaluated without presenting the four products as the core innovation.",
        blocks: [
          {
            kind: "figure",
            src: "/figures/project/01_product_routes.svg",
            alt: "DunaTerp metabolic design from light and carbon through lycopene and beta-carotene to astaxanthin, beta-ionone, crocetin and beta-citraurin",
            caption: "Fig. 1 Four product routes from the β-carotene hub"
          }
        ],
        items: [
          "Astaxanthin — BKT and BCH add keto and hydroxyl groups to β-carotene.",
          "β-ionone — CCD1 cleaves β-carotene to release the aroma compound.",
          "Crocetin — BCH supplies zeaxanthin, GjCCD4a forms crocetin dialdehyde and GjALDH2C3 oxidises it to crocetin.",
          "β-citraurin — BCH supplies zeaxanthin and CitCCD4 performs the cleavage step."
        ]
      },
      {
        eyebrow: "From engineered cell to application",
        title: "Characterise the Platform",
        body: "Characterisation first asks whether the regulatory intervention changes pathway expression and β-carotene supply, then tests product identity, titre, conversion efficiency and by-product profiles for each downstream strain. Light delivery, salinity, biomass productivity and recovery yield connect the engineered cell to cultivation and downstream processing."
      },
    ],
  },
  engineering: {
    title: "Building a salt-controlled safeguard", eyebrow: "Engineering", intro: "The containment design developed through three linked questions: can MazF suppress Dunaliella salina growth, can its expression be reduced to a controllable level, and can salt-responsive MazE protection separate cultivation from release conditions?", status: "team-draft",
    references: [refs.dca1, refs.mazf, refs.chen2009],
    sections: [
      {
        eyebrow: "Kill switch architecture",
        title: "Engineer a Salt-Controlled Suicide Switch",
        body: "The biosafety strategy is to let engineered Dunaliella salina survive in high-salt working conditions but lose viability after transfer to low-salt external environments. The circuit therefore couples a salt-responsive antitoxin module to a constitutive toxin module.",
        blocks: [
          { kind: "paragraph", text: "In the intended final design, high salt activates PDCA1 and drives mazE expression. MazE neutralises the low-level MazF produced from the Pip-driven toxin module, so cells remain viable in the target niche [1]." },
          { kind: "paragraph", text: "After transfer to low salt, PDCA1 shuts down, no new MazE is produced, and the remaining MazF is no longer buffered. The resulting toxin activity is expected to stop growth and kill cells outside the intended cultivation environment [2]." },
          { kind: "figure", src: "/figures/wet-lab/engineer1.png", alt: "Working principle of the salt-controlled suicide switch under high-salt conditions with PDCA1-driven MazE neutralising low-level MazF.", caption: "Fig. 1 Salt-controlled switch under high-salt conditions" },
          { kind: "figure", src: "/figures/wet-lab/engineer2.png", alt: "Working principle of the salt-controlled suicide switch under low-salt conditions with loss of MazE protection and MazF-driven cell death.", caption: "Fig. 2 Salt-controlled switch under low-salt conditions" },
        ],
      },
      {
        eyebrow: "Cycle I",
        title: "Validate MazF as the Killing Effector",
        body: "The first engineering question was whether MazF could retain killing activity in the eukaryotic chassis D. salina. Cycle I therefore used a deliberately strong constitutive expression design to test feasibility before attempting circuit balancing.",
        blocks: [
          { kind: "heading", text: "Design" },
          { kind: "paragraph", text: "A validation plasmid, p1302-CaMV35S-mazF, was constructed with mazF under the strong constitutive CaMV 35S promoter. Three experimental groups were defined for comparison: MazF transformants, empty-vector transformants and wild type." },
          { kind: "heading", text: "Build" },
          { kind: "paragraph", text: "mazF was cloned into the pCAMBIA1302 backbone, verified by colony PCR and sequencing, and introduced into D. salina by osmotic transformation. Independent transformants were selected with hygromycin B and then cultured in parallel with the two control groups." },
          { kind: "heading", text: "Test" },
          { kind: "paragraph", text: "Growth was monitored for 10 days in 0.5 M NaCl PKS/DM liquid medium using OD680. This assay tested whether strong MazF expression could suppress D. salina growth relative to both controls." },
          { kind: "figure", src: "/figures/wet-lab/engineer3.png", alt: "Plasmid map of p1302-CaMV35S-mazF used for MazF validation in Dunaliella salina.", caption: "Fig. 3 Plasmid map of p1302-CaMV35S-mazF" },
          { kind: "figure", src: "/figures/wet-lab/engineer4.png", alt: "Colony PCR verification of p1302-CaMV35S-mazF construction.", caption: "Fig. 4 Colony PCR verification of p1302-CaMV35S-mazF" },
          { kind: "figure", src: "/figures/wet-lab/engineer5.png", alt: "Ten-day growth curves comparing wild type, empty-vector and MazF transformant Dunaliella salina strains.", caption: "Fig. 5 Growth curves of WT, empty-vector and MazF transformants" },
          { kind: "heading", text: "Learn" },
          { kind: "paragraph", text: "MazF retained strong growth-inhibitory activity in D. salina, establishing that the toxin module is feasible in the chosen chassis. At the same time, strong-promoter-driven toxin expression appeared too severe for a stable final circuit, so the next iteration focused on reducing leak and creating a workable neutralisation window for MazE." },
        ],
      },
      {
        eyebrow: "Cycle II and III",
        title: "Tune Toxin Output and Assemble the Full Circuit",
        body: "After proving that MazF could suppress growth, the engineering goal shifted from feasibility to controllability. The toxin module was redesigned around weaker expression and orthogonal selection, then paired with a salt-responsive antitoxin design for final assembly.",
        blocks: [
          { kind: "heading", text: "Cycle II: weaken the toxin module" },
          { kind: "paragraph", text: "Two engineering changes were introduced. First, the backbone was switched to pCAMBIA1302-bar so the toxin module would use phosphinothricin resistance and remain orthogonal to the hygromycin-marked antitoxin vector. Second, the endogenous low-abundance promoter Pip was chosen to drive mazF, with the aim of lowering toxin output while preserving killing efficacy." },
          { kind: "paragraph", text: "p1302-Pip-mazF was assembled by homologous recombination, verified by colony PCR and sequencing, and transformed into D. salina. The growth-kinetics assay of weakly expressed MazF is underway and will determine whether this lower-expression design preserves an adequate kill window." },
          { kind: "figure", src: "/figures/wet-lab/engineer6.png", alt: "Plasmid map of p1302-Pip-mazF using the bar selection marker and weak Pip promoter.", caption: "Fig. 6 Plasmid map of p1302-Pip-mazF" },
          { kind: "figure", src: "/figures/wet-lab/engineer7.png", alt: "Colony PCR verification of the p1302-Pip-mazF weak-promoter toxin construct.", caption: "Fig. 7 Colony PCR verification of p1302-Pip-mazF" },
          { kind: "heading", text: "Cycle II: learn" },
          { kind: "paragraph", text: "The weak Pip promoter and bar marker create a more practical toxin module for final assembly: toxin expression is expected to be more controllable, and the marker system is now compatible with orthogonal double selection." },
          { kind: "heading", text: "Cycle III: final assembly in progress" },
          { kind: "paragraph", text: "The next step is to build p1302-PDCA1-mazE, in which the salt-responsive promoter PDCA1 drives the antitoxin. This vector will be co-transformed with p1302-bar-Pip-mazF and selected using hygromycin/phosphinothricin double selection." },
          { kind: "paragraph", text: "The final engineering test is a salt-switch assay from high salt to low salt. Success means robust growth in high salt, loss of protection after the switch, and clear survival or growth differences once the full circuit is triggered." },
        ],
      },
    ],
  },
  experiments: {
    title: "Testing the salt-controlled circuit", eyebrow: "Experiments", intro: "Wet-lab validation begins with MazF toxicity, then reduces toxin expression with the endogenous Pip promoter and tests PDCA1 as the salt-responsive input for MazE protection.", status: "team-draft",
    references: [refs.mazf, refs.dca1],
    sections: [
      {
        title: "Wet-lab protocols",
        body: "The kill-switch module was validated through three connected experiment sets: MazF toxicity verification, weak-promoter toxin tuning and PDCA1 salt-response testing.",
        blocks: [
          { kind: "heading", text: "1. Verification of MazF toxicity (p1302-CaMV35S-mazF)" },
          { kind: "paragraph", text: "MazF is the killing component of the mazEF toxin-antitoxin system and serves as the core lethal element of the kill-switch design [1]. To test whether MazF can suppress D. salina growth, mazF was placed under the constitutive CaMV 35S promoter in p1302-CaMV35S-mazF and functionally characterised." },
          { kind: "paragraph", text: "The construct was assembled in the pCAMBIA1302 backbone, verified by colony PCR and sequencing, and introduced into D. salina strain FACHB-435 by osmotic transformation. Cells were pre-adapted in 1 M NaCl for 8 h, resuspended in 0.1 M NaCl medium, mixed with 5.46 μg plasmid DNA and 15 μL of 0.1% Triton X-100, vortexed for 90 s, and allowed to recover for 48 h." },
          { kind: "paragraph", text: "Transformants were selected with hygromycin B and compared with wild-type and empty-vector controls. All three groups were cultured in 0.5 M NaCl PKS/DM medium at 26 °C under 50 μmol photons m⁻² s⁻¹ and a 16 h light / 8 h dark photoperiod. OD680 was measured daily for 10 days." },
          { kind: "figure", src: "/figures/wet-lab/experiment1.png", alt: "Plasmid map of p1302-CaMV35S-mazF used for MazF toxicity verification.", caption: "Fig. 1 Plasmid map of p1302-CaMV35S-mazF" },
          { kind: "figure", src: "/figures/wet-lab/experiment2.png", alt: "Colony PCR verification of p1302-CaMV35S-mazF with marker, colonies and no-template control lanes.", caption: "Fig. 2 Colony PCR verification of p1302-CaMV35S-mazF" },
          { kind: "figure", src: "/figures/wet-lab/experiment3.png", alt: "Ten-day growth curves comparing wild type, empty-vector and MazF transformant Dunaliella salina strains.", caption: "Fig. 3 Growth curves of WT, empty-vector and MazF transformants" },
          { kind: "paragraph", text: "Result: the MazF group remained close to its initial density and stayed clearly below both controls throughout the assay. This confirms that MazF retains strong growth-inhibitory activity in the eukaryotic microalgal host." },
          { kind: "heading", text: "2. Weak-promoter toxin vector characterisation (p1302-bar-Pip-mazF)" },
          { kind: "paragraph", text: "Because strong toxin expression made stable maintenance difficult, the toxin module was rebuilt with a weaker endogenous promoter and an orthogonal marker. pCAMBIA1302-bar was used as the backbone, and the low-abundance promoter Pip was selected to drive mazF." },
          { kind: "paragraph", text: "The Pip promoter and mazF were amplified, assembled into the linearised backbone by multi-fragment homologous recombination, and transformed into E. coli DH5α. Positive clones were identified on kanamycin plates by colony PCR and confirmed by sequencing." },
          { kind: "paragraph", text: "The verified plasmid was introduced into D. salina by the same osmotic-transformation workflow and selected on phosphinothricin-containing medium. Positive transformants are being followed by OD680 growth-kinetics assays to determine whether weakly expressed MazF still provides sufficient killing efficacy." },
          { kind: "figure", src: "/figures/wet-lab/experiment4.png", alt: "Plasmid map of p1302-Pip-mazF using a bar marker and the weak Pip promoter.", caption: "Fig. 4 Plasmid map of p1302-Pip-mazF" },
          { kind: "figure", src: "/figures/wet-lab/experiment5.png", alt: "Colony PCR verification of the p1302-Pip-mazF weak-promoter toxin construct.", caption: "Fig. 5 Colony PCR verification of p1302-Pip-mazF" },
          { kind: "paragraph", text: "Current status: molecular construction and sequence verification are complete; the algal growth assay for the weak-promoter toxin module is still in progress." },
          { kind: "heading", text: "3. Validation of the PDCA1 salt-responsive system (p2301-PDCA1-EGFP)" },
          { kind: "paragraph", text: "The final circuit depends on PDCA1 as the salt-responsive input promoter [2]. To verify its suitability, the endogenous PDCA1 promoter was fused to EGFP in the reporter plasmid p2301-PDCA1-EGFP." },
          { kind: "paragraph", text: "The reporter was assembled by homologous recombination into the linearised pCAMBIA2301 backbone, screened by colony PCR and confirmed by sequencing. Transformants were then assigned to media containing different NaCl concentrations, for example 0.5 M, 2 M and 3 M NaCl." },
          { kind: "paragraph", text: "EGFP fluorescence will be quantified across the salt gradient to establish the dynamic range of PDCA1 transcriptional activity and to test whether the promoter provides a usable high-salt versus low-salt switch input for the complete kill-switch design." },
          { kind: "figure", src: "/figures/wet-lab/experiment6.png", alt: "Plasmid map of p2301-PDCA1-EGFP used to test PDCA1 salt responsiveness.", caption: "Fig. 6 Plasmid map of p2301-PDCA1-EGFP" },
        ],
      },
    ],
  },
  results: {
    title: "What the evidence shows", eyebrow: "Results", intro: "Light changes carotenoid-pathway transcript abundance, but the pathway does not rise or fall as one synchronized unit. The models identify LCYB and the β-carotene entry split as useful control points, while protein, pigment and flux measurements remain necessary to test the proposed mechanism.", status: "team-draft",
    references: [refs.transcriptomeDataset, refs.li2019, refs.fachet2020, refs.lan2022, refs.alphafold3],
    sections: [
      { title: "Transcript responses are not uniform", body: "Across the three light conditions, carotenoid-pathway transcripts respond individually rather than as a single coordinated block [1] [2]. One LCYB-assigned contig rises from low to medium light and then falls at high light; the other remains higher under high light than under low light. This transcript-specific behavior makes LCYB a biologically motivated modeling focus without implying that LCYB protein activity or β-carotene flux increased.", blocks: [
        { kind: "figure", src: "/figures/dry-lab/transcriptomics-sample-expression.svg", alt: "Replicate-level normalized read counts for six carotenoid-enzyme transcripts across three light conditions.", caption: "Fig. 1 Replicate-level expression of carotenoid transcripts" },
      ] },
      { title: "The shared hub supports unequal product routes", body: "The reconstructed metabolic network is based on the published D. salina carbon-core reconstruction [3] and supports all four engineered product routes under the tested constraints. Conditional maximum flux is consistently highest for β-ionone, followed by β-citraurin, astaxanthin and crocetin. High-light, low-nitrate scenarios provide the strongest modeled product support, and sensitivity analysis places the greatest leverage at the β-carotene entry split.", blocks: [
        { kind: "figure", src: "/figures/dry-lab/platform_environment_map_heatmap.png", alt: "Modeled production potential for four target products across eight environmental scenarios.", caption: "Fig. 2 Product potential across environmental scenarios" },
      ] },
      { title: "Structural screening narrows hypotheses", body: "F404Y produced a slightly more favorable mean lycopene docking score than WT, but the difference was small relative to seed-to-seed variation and did not establish improved binding or catalysis. The TF2146–DNA complex likewise remains a structural hypothesis: AlphaFold 3 provides a predicted interaction model [5], not evidence of native LCYB-promoter recognition.", blocks: [
        { kind: "figure", src: "/figures/protein/docking-seeds.png", alt: "Lycopene docking scores for WT and F404Y LCYB across three search seeds.", caption: "Fig. 3 Lycopene docking scores for WT and F404Y LCYB" },
      ] },
      { title: "The model defines the next measurements", body: "The five-state model links regulatory input, promoter occupancy, LCYB transcript, active enzyme, lycopene conversion and the β-carotene pool. Its present predictions are conditional on assumed parameters. Matched measurements of TF2146 abundance or binding, LCYB transcript and protein, lycopene, β-carotene and product formation are required to calibrate the chain and test whether regulation changes flux.", blocks: [
        { kind: "figure", src: "/figures/dry-lab/14_regulatory_model.png", alt: "Five-state model connecting regulatory input to LCYB expression and beta-carotene.", caption: "Fig. 4 Regulatory model of the LCYB step" },
      ] },
    ],
  },
  model: modeling,
  hardware,
  "hardware-design": hardwareDesign,
  "human-practices": {
    title: "From a biological idea to a usable system", eyebrow: "Human Practices", intro: "DunaTerp connects metabolic engineering with saline cultivation, downstream processing and environmental containment. Its practical value depends on how those parts fit the needs and limits of the people who would build, operate, regulate and use the system.", status: "team-draft",
    references: [refs.borowitzka2013, refs.posten2009, refs.humanPracticesHero],
    sections: [
      { title: "Cultivation", body: "A salt-tolerant photosynthetic chassis changes the operating assumptions of microbial production. Growers and bioprocess engineers must balance salinity, illumination, gas transfer, contamination control, biomass productivity and reactor maintenance; a biological improvement is useful only if the culture remains operable at scale [2]." },
      { title: "Recovery and product use", body: "The four target products differ in chemistry, market use and downstream purification. Product identity, titre and conversion efficiency therefore need to be considered together with extraction solvent, energy demand, purity requirements and the value of the recovered compound [1]." },
      { title: "Containment and environmental responsibility", body: "Hypersaline cultivation does not remove the need for containment. The proposed salt-responsive circuit, physical reactor barriers, waste treatment and monitoring form separate layers. Regulators and environmental experts need evidence for each layer before an engineered strain could move beyond controlled research." },
    ],
  },
  "safety-and-security": safety,
  "alternative-platform": {
    title: "Engineering beyond the usual chassis", eyebrow: "Alternative Platform", intro: "Dunaliella salina combines extreme halotolerance, photosynthetic carbon fixation and native carotenoid accumulation. DunaTerp uses those traits as functional parts of the engineering strategy rather than treating the alga as an interchangeable host.", status: "team-draft",
    references: [refs.oren2005, refs.lan2022, refs.fachet2020],
    sections: [
      { title: "A metabolism already oriented toward carotenoids", body: "D. salina contains the MEP-to-carotenoid pathway and can accumulate β-carotene under environmental stress [2]. The project therefore begins with an established pigment network and asks how regulation and branch competition can be reshaped around its native β-carotene pool." },
      { title: "Salt tolerance changes cultivation", body: "Growth in seawater and hypersaline media can reduce freshwater demand and suppress many common contaminants [1]. At the same time, high salinity affects materials, sensors, fluid handling and downstream recovery, so the chassis choice directly informs the reactor and process design." },
      { title: "Engineering the chassis", body: "Osmotic transformation provides a route for introducing genetic constructs into D. salina. The containment work tests MazF toxicity and weak-promoter control, while the central platform design proposes TF2146 as a regulatory input. These interventions must be evaluated with construct verification, expression measurements and matched pigment or flux data." },
    ],
  },
  sustainability: {
    title: "Resource use across the whole process", eyebrow: "Sustainability", intro: "Saline photosynthetic cultivation may reduce dependence on freshwater, arable land and organic carbon feedstocks, but those advantages must be considered alongside lighting, mixing, nutrients, harvesting, extraction and waste treatment.", status: "team-draft",
    references: [refs.oren2005, refs.borowitzka2013, refs.posten2009, refs.carvalho2011],
    sections: [
      { title: "Water and land", body: "D. salina can grow in seawater or hypersaline media and does not require arable soil [1]. This creates a route that may avoid competition with freshwater agriculture, although medium preparation, evaporation control and cleaning still consume water and must be included in any process comparison." },
      { title: "Energy and materials", body: "Photosynthesis supplies carbon fixation, but artificial illumination, gas transfer, circulation, temperature control and biomass harvesting can dominate energy demand [3] [4]. The PMMA reactor, seals and fittings also have manufacturing and replacement impacts that increase with scale." },
      { title: "Recovery and waste", body: "Product extraction determines whether the biological advantage survives downstream processing. Solvent choice, pigment recovery, residual biomass, saline effluent and containment treatment must therefore be evaluated per unit of purified product rather than per unit of culture alone [2]." },
    ],
  },
  education: {
    title: "Learning along the Salt Route", eyebrow: "Education", intro: "The interactive homepage turns the project into a walk through biological questions: why a salt-adapted alga matters, how carotenoid flux is redirected, what a model can infer and where experimental evidence is still required.", status: "team-draft",
    sections: [
      { title: "Follow the biological chain", body: "Four route stops connect the production challenge to the D. salina chassis, metabolic reprogramming and the final platform design. Moving through them in order shows that product claims depend on several distinct biological layers rather than on a single promising gene." },
      { title: "Meet the field guides", body: "Three fictional guides introduce pathway order, product branching and evidence evaluation. Their questions ask visitors to distinguish transcript abundance from enzyme activity, a modeled optimum from a measured titre and a proposed safeguard from validated containment." },
      { title: "Leave the route", body: "Free-roam exploration rewards curiosity with direct links to protein modeling, metabolic modeling and hardware pages. The activities simplify the science for navigation and discussion; they do not reproduce laboratory experiments or certify learning outcomes." },
    ],
  },
  team: {
    title: "The people behind DunaTerp", eyebrow: "Team", intro: "SCU-China 2026 brings together wet-lab, dry-lab, hardware, human-practices and Wiki work around one salt-adapted terpenoid platform.", status: "team-draft",
    sections: [
      { title: "One project, connected work", body: "Wet-lab construction and validation, transcript and metabolic analysis, protein and regulatory modeling, photobioreactor engineering, project integration and website development are treated as connected parts of the same design chain." },
      { title: "Roles and contributions", body: "The official team roster identifies the members of SCU-China 2026, while the Attributions Form connects experimental, analytical, design, communication and Wiki contributions to the people who performed them." },
    ],
  },
  attributions: {
    title: "Credit is part of the method", eyebrow: "Attributions", intro: "DunaTerp combines team experiments and analysis with public datasets, literature, software and external guidance. The official iGEM Attributions Form remains the authoritative record of individual contributions.", status: "team-draft",
    sections: [
      { title: "Team work", body: "The contribution record distinguishes project conception, experimental design, plasmid construction, algal transformation, data analysis, mathematical and structural modeling, hardware design, writing, visual design and Wiki integration." },
      { title: "External foundations", body: "Public RNA-seq data, protein and motif databases, scientific literature, modeling software and open-source libraries are cited at the point of use. Facilities, mentors, donated materials and external technical support are recorded separately from student work." },
      { title: "Pixel exploration and learning activities", body: "The active homepage uses the repository’s original Canvas pixel world, extended with fictional NPC guides and educational games. The characters do not represent team members or stakeholder testimony. Stardew Valley is a stylistic reference; no game assets, characters, music or dialogue are redistributed." },
      { title: "Earlier website physics and interaction", body: "The retained, inactive 3D implementation’s Rapier physics world, contact-force event loop, dynamic object synchronisation and damped follow-camera in DunaTerp are adapted from Bruno Simon's Folio 2025 under the MIT License. The scroll-constrained route, Dunaliella geometry, scientific landmarks, text and interface are project-specific; no Folio models, artwork, audio or textures are redistributed. Full notice: THIRD_PARTY_NOTICES.md in the Wiki repository." },
      { title: "Scientific equation renderer", body: "The Transcriptomics and Mathematical Modeling pages render equations and fonts locally with KaTeX 0.16.22, licensed under MIT. Source and licence notice: THIRD_PARTY_NOTICES.md in the Wiki repository." },
    ],
  },
  "responsible-ai": {
    title: "Responsible AI use", eyebrow: "Authorship & integrity", intro: "A transparent record of where AI assisted the team, what it did not produce and how humans reviewed the output.", status: "team-draft",
    sections: [
      { title: "Model used", body: "OpenAI Codex (GPT-5 family) was used on 15 August 2026 to scaffold website code, organise navigation, create procedural Three.js geometry, improve interface copy and draft clearly marked content structures from team-authored local reports." },
      { title: "September 2026 website revision", body: "On 9 September 2026, OpenAI Codex coordinated a code and content review with GPT-5.6 Luna subtasks for NPC learning activities, input handling and navigation review. AI assisted with code, fictional guide dialogue and educational questions. Completion badges record in-browser activity only." },
      { title: "Boundaries", body: "AI was not used to generate experimental data, data figures, microscopy, simulated experimental evidence, quotations or citations. Existing scientific figures shown in this prototype were produced by the project's analysis scripts and remain subject to team verification." },
      { title: "Human responsibility", body: "AI-assisted text and code are not treated as scientific evidence. Team members remain responsible for checking scientific statements against source data, confirming citations, rerunning analysis and build code, reviewing accessibility text and approving the final disclosure." },
    ],
  },
};

export const pageOrder = [...new Set([
  'project-description', 'engineering', 'experiments', 'results',
  'dry-lab', 'transcriptomics', 'metabolomics', 'protein', 'model', 'hardware', 'hardware-design',
  ...Object.keys(pages).filter((key) => ![
    'project-description', 'engineering', 'experiments', 'results',
    'dry-lab', 'transcriptomics', 'metabolomics', 'protein',
    'model', 'hardware', 'hardware-design',
  ].includes(key)),
])];
