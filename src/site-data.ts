import type { ContentBlock, WikiReference } from './content/types';
import { refs } from './content/references';
import { safety } from './content/safety';
import { protein } from './content/protein';
import { dryLabNavigation, dryLabIndex, hardware, hardwareDesign, metabolomics, modeling, transcriptomics } from './content/dry-lab';
import { collaboration, cooperation, education } from './content/human-practices';
import { stakeholderAnalysis } from './content/stakeholder-analysis';
import { team } from './content/team';

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
  { label: "Project", items: [["Description", "/project-description"], ["Contribution", "/contribution"], ["Design", "/design"], ["Experiments", "/experiments"], ["Results", "/results"], ["Engineering", "/engineering"], ["Safety", "/safety-and-security"], ["Parts", "/parts"]] },
  { label: "Dry Lab", items: dryLabNavigation },
  { label: "Human Practices", items: [["Stakeholder Analysis", "/stakeholder-analysis"], ["Education", "/education"], ["Cooperation", "/cooperation"]] },
  { label: "Lab", items: [["Safety", "/lab-safety"], ["Notebook", "/lab-notebook"]] },
  { label: "Team", items: [["Team", "/team"], ["Attributions", "/attributions"], ["Collaboration", "/collaboration"]] },
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
    eyebrow: "Description",
    intro: "DunaTerp asks whether a salt-compatible photosynthetic chassis can become a practical terpenoid platform. The project starts from Dunaliella salina, a naturally β-carotene-rich microalga, and builds outward toward programmable product routes and controlled cultivation.",
    status: "team-draft",
    sections: [
      {
        eyebrow: "Value and production landscape",
        title: "Background & Challenge",
        body: "Terpenoids are used across food, nutrition, aroma, colour and other high-value applications. Current supply spans chemical synthesis, plant extraction and biological production, but each route leaves a gap: chemical synthesis can bring process and environmental costs; plant extraction is constrained by slow growth, variable abundance, land and freshwater demand; conventional yeast or bacterial factories often rely on sterile freshwater cultivation and energy-intensive operation. DunaTerp therefore asks whether a salt-compatible photosynthetic chassis can make this production landscape more practical."
      },
      {
        eyebrow: "Why this chassis",
        title: "A Chassis Shaped by Salt",
        body: "Dunaliella salina brings three connected advantages. First, its tolerance of seawater and hypersaline media supports cultivation in conditions that suppress many contaminants and reduces dependence on freshwater and arable land. Second, it already contains a complete MEP-to-carotenoid pathway and naturally accumulates β-carotene, providing a starting network for engineering. Third, its photosynthetic, salt-compatible biology opens a broad application space in saline environments rather than tying the platform to conventional sterile freshwater fermentation."
      },
      {
        eyebrow: "Project overview",
        title: "A Shared β-Carotene Hub",
        body: "DunaTerp treats the native β-carotene pool of D. salina as a programmable hub rather than a fixed trait. The project introduces transcription factor 2146 as a proposed regulatory input to reshape carotenoid-pathway expression, then branches that shared hub toward several downstream product routes. In this way, the project is framed not as a single-product strain, but as a chassis-level platform with multiple possible outputs."
      },
    ],
  },
  contribution: {
    title: "What DunaTerp contributes",
    eyebrow: "Contribution",
    intro: "This project contributes a chassis-level platform idea, a model-guided route-comparison framework and a salt-responsive containment concept for Dunaliella-based engineering.",
    status: "team-draft",
    sections: [
      {
        title: "A salt-compatible terpenoid platform",
        body: "DunaTerp proposes D. salina as more than a naturally pigmented organism. The project frames it as a salt-compatible engineering chassis whose native β-carotene metabolism can support several downstream terpenoid routes from one shared metabolic hub."
      },
      {
        title: "A model-guided design chain",
        body: "The project links transcriptional regulation, pathway control and downstream product competition in one design chain. Transcript evidence, metabolic modeling and product-route comparison are used together to define which measurements matter most for testing the platform."
      },
      {
        title: "A biosafety concept with explicit assumptions",
        body: "The salt-responsive containment work contributes a concrete biosafety idea for D. salina cultivation: keep cells viable in high-salt production conditions while increasing effective toxicity after a salinity drop. The value of this contribution lies not only in the circuit concept, but also in making its assumptions, response requirements and likely failure points explicit."
      },
    ],
  },
  design: {
    title: "How the project is designed",
    eyebrow: "Design",
    intro: "The design starts from a naturally β-carotene-rich chassis, adds a regulatory layer intended to redirect pathway behavior and then distributes the shared hub into separate product routes and a parallel containment module.",
    status: "team-draft",
    sections: [
      {
        eyebrow: "The core intervention",
        title: "Reprogramme the Metabolic Engine",
        body: "DunaTerp does not stop at using a naturally productive alga. The project identifies and introduces transcription factor 2146 as a regulatory input intended to reshape carotenoid-pathway expression and redirect metabolic flux toward competitive β-carotene synthesis. This turns the native β-carotene pool from a fixed biological trait into the shared, programmable hub of the platform. LCYB remains the enzymatic gate from lycopene into that hub, while TF2146 provides the upstream regulatory intervention."
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
      {
        eyebrow: "Biosafety module",
        title: "Add a Salt-Responsive Safeguard",
        body: "In parallel with the production platform, the project proposes a salt-responsive safeguard module. The intended logic is to maintain cultivation under high-salt conditions while reducing persistence after salinity drops, linking process context directly to containment behavior."
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
          { kind: "figure", src: "/figures/wet-lab/experiment3.png", alt: "Ten-day growth curves comparing wild type, empty-vector and MazF transformant Dunaliella salina strains.", caption: "Fig. 2 Growth curves of WT, empty-vector and MazF transformants" },
          { kind: "paragraph", text: "Result: the MazF group remained close to its initial density and stayed clearly below both controls throughout the assay. This confirms that MazF retains strong growth-inhibitory activity in the eukaryotic microalgal host." },
          { kind: "heading", text: "2. Weak-promoter toxin vector characterisation (p1302-bar-Pip-mazF)" },
          { kind: "paragraph", text: "Because strong toxin expression made stable maintenance difficult, the toxin module was rebuilt with a weaker endogenous promoter and an orthogonal marker. pCAMBIA1302-bar was used as the backbone, and the low-abundance promoter Pip was selected to drive mazF." },
          { kind: "paragraph", text: "The Pip promoter and mazF were amplified, assembled into the linearised backbone by multi-fragment homologous recombination, and transformed into E. coli DH5α. Positive clones were identified on kanamycin plates by colony PCR and confirmed by sequencing." },
          { kind: "paragraph", text: "The verified plasmid was introduced into D. salina by the same osmotic-transformation workflow and selected on phosphinothricin-containing medium. Positive transformants are being followed by OD680 growth-kinetics assays to determine whether weakly expressed MazF still provides sufficient killing efficacy." },
          { kind: "figure", src: "/figures/wet-lab/experiment4.png", alt: "Plasmid map of p1302-Pip-mazF using a bar marker and the weak Pip promoter.", caption: "Fig. 3 Plasmid map of p1302-Pip-mazF" },
          { kind: "paragraph", text: "Current status: molecular construction and sequence verification are complete; the algal growth assay for the weak-promoter toxin module is still in progress." },
          { kind: "heading", text: "3. Validation of the PDCA1 salt-responsive system (p2301-PDCA1-EGFP)" },
          { kind: "paragraph", text: "The final circuit depends on PDCA1 as the salt-responsive input promoter [2]. To verify its suitability, the endogenous PDCA1 promoter was fused to EGFP in the reporter plasmid p2301-PDCA1-EGFP." },
          { kind: "paragraph", text: "The reporter was assembled by homologous recombination into the linearised pCAMBIA2301 backbone, screened by colony PCR and confirmed by sequencing. Transformants were then assigned to media containing different NaCl concentrations, for example 0.5 M, 2 M and 3 M NaCl." },
          { kind: "paragraph", text: "EGFP fluorescence will be quantified across the salt gradient to establish the dynamic range of PDCA1 transcriptional activity and to test whether the promoter provides a usable high-salt versus low-salt switch input for the complete kill-switch design." },
          { kind: "figure", src: "/figures/wet-lab/experiment6.png", alt: "Plasmid map of p2301-PDCA1-EGFP used to test PDCA1 salt responsiveness.", caption: "Fig. 4 Plasmid map of p2301-PDCA1-EGFP" },
        ],
      },
    ],
  },
  results: {
    title: "What the evidence shows", eyebrow: "Results", intro: "Light changes carotenoid-pathway transcript abundance, but the pathway does not rise or fall as one synchronized unit. The models identify LCYB and the β-carotene entry split as useful control points, while protein, pigment and flux measurements remain necessary to test the proposed mechanism.", status: "team-draft",
    references: [refs.transcriptomeDataset, refs.li2019, refs.fachet2020, refs.lan2022, refs.alphafold3, refs.chen2009, refs.dca1, refs.mazf, refs.farhat2011, refs.gomez2005],
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
      { title: "Safety model outcomes", body: "The salt-responsive containment model compares the same salinity drop under retained-cell and water-exchange environments, and tests three response modes: no effective switch, growth inhibition alone and conditional killing. The strongest modeled reduction in cell concentration appears only when the circuit is allowed to add an explicit killing effect after the salinity change.", blocks: [
        { kind: "paragraph", text: "The results compare how salinity change, growth behavior and transport interact under different containment assumptions. They are scenario-based model outcomes, not direct measurements of engineered-strain clearance." },
        { kind: "safety-results" },
        { kind: "paragraph", text: "In the retained-cell baseline, the conditional-killing case reaches T90 at 8.3 h and T99 at 13.2 h, while weaker response assumptions do not reach the same reduction within the modeled time window." },
      ] },
      { title: "Safety sensitivity and cultivation trade-offs", body: "The same containment concept changes substantially when its assumptions are perturbed. Response delay, effective mortality and surrounding salinity all affect whether the modeled safeguard clears cells rapidly, slowly or not at all within the simulation window.", blocks: [
        { kind: "paragraph", text: "Sensitivity analysis highlights which assumptions matter most for the containment design and therefore which project measurements would most improve the model." },
        { kind: "table", caption: "Selected sensitivity results · T99 for a 48 h simulation", columns: ["Change from baseline", "Setting", "T99"], rows: [
          ["Baseline", "No response delay; external salt 0.05 M", "13.2 h"],
          ["Delayed response", "6 h delay", "19.1 h"],
          ["Delayed response", "24 h delay", "37.1 h"],
          ["Lower maximum mortality", "Half the assumed baseline rate", "22.8 h"],
          ["Higher maximum mortality", "Twice the assumed baseline rate", "8.3 h"],
          ["Slower salt change", "Relaxation rate 0.1 h⁻¹", "27.0 h"],
          ["More saline surroundings", "External salt 0.50 M", "38.4 h"],
          ["More saline surroundings", "External salt 0.70 M", "Not reached within 48 h"],
        ] },
        { kind: "paragraph", text: "These comparisons are mathematical stress tests rather than measured confidence intervals, but they show clearly that delay, receiving salinity and maximum effective mortality strongly influence the predicted outcome." },
        { kind: "paragraph", text: "The model also suggests a possible cultivation trade-off: under constant production salinity, the lethal-response scenario leaves a small residual burden on growth. That result does not estimate observed biomass or product loss, but it identifies a question that should be tested experimentally." },
      ] },
    ],
  },
  model: modeling,
  hardware,
  "hardware-design": hardwareDesign,
  "safety-and-security": safety,
  parts: {
    title: "Parts",
    eyebrow: "Parts",
    intro: "This page is reserved for the project's part and device overview and will be completed when the material is ready.",
    status: "structure-only",
    sections: [
      { title: "Content in preparation", body: "Team input required: add the parts and devices summary for this section." },
    ],
  },
  "lab-safety": {
    title: "Lab Safety",
    eyebrow: "Lab",
    intro: "This page is reserved for lab safety content and will be completed when the material is ready.",
    status: "structure-only",
    sections: [
      { title: "Content in preparation", body: "Team input required: add the lab-specific safety content for this section." },
    ],
  },
  "lab-notebook": {
    title: "Lab Notebook",
    eyebrow: "Lab",
    intro: "This page is reserved for lab notebook content and will be completed when the material is ready.",
    status: "structure-only",
    sections: [
      { title: "Content in preparation", body: "Team input required: add the lab notebook content for this section." },
    ],
  },
  "alternative-platform": {
    title: "Engineering beyond the usual chassis", eyebrow: "Alternative Platform", intro: "Dunaliella salina combines extreme halotolerance, photosynthetic carbon fixation and native carotenoid accumulation. DunaTerp uses those traits as functional parts of the engineering strategy rather than treating the alga as an interchangeable host.", status: "team-draft",
    references: [refs.oren2005, refs.lan2022, refs.fachet2020],
    sections: [
      { title: "A metabolism already oriented toward carotenoids", body: "D. salina contains the MEP-to-carotenoid pathway and can accumulate β-carotene under environmental stress [2]. The project therefore begins with an established pigment network and asks how regulation and branch competition can be reshaped around its native β-carotene pool." },
      { title: "Salt tolerance changes cultivation", body: "Growth in seawater and hypersaline media can reduce freshwater demand and suppress many common contaminants [1]. At the same time, high salinity affects materials, sensors, fluid handling and downstream recovery, so the chassis choice directly informs the reactor and process design." },
      { title: "Engineering the chassis", body: "Osmotic transformation provides a route for introducing genetic constructs into D. salina. The containment work tests MazF toxicity and weak-promoter control, while the central platform design proposes TF2146 as a regulatory input. These interventions must be evaluated with construct verification, expression measurements and matched pigment or flux data." },
    ],
  },
  education,
  cooperation,
  collaboration,
  "stakeholder-analysis": stakeholderAnalysis,
  team,
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
};

export const pageOrder = [...new Set([
  'project-description', 'contribution', 'design', 'experiments', 'results', 'engineering', 'safety-and-security', 'parts',
  'dry-lab', 'transcriptomics', 'metabolomics', 'protein', 'model', 'hardware', 'hardware-design',
  ...Object.keys(pages).filter((key) => ![
    'project-description', 'contribution', 'design', 'experiments', 'results', 'engineering', 'safety-and-security', 'parts',
    'dry-lab', 'transcriptomics', 'metabolomics', 'protein',
    'model', 'hardware', 'hardware-design',
  ].includes(key)),
])];
