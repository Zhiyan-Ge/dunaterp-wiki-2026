import type { ContentBlock, DocumentTextRun, WikiReference } from './content/types';
import { projectDescription } from './content/project-description';
import { design } from './content/design';
import { attributions } from './content/attributions';
import { refs } from './content/references';
import { safety } from './content/safety';
import { protein } from './content/protein';
import { dryLabNavigation, dryLabIndex, hardware, hardwareDesign, metabolomics, modeling, transcriptomics } from './content/dry-lab';
import { collaboration, cooperation, education } from './content/human-practices';
import { ihpBackgroundResearch, ihpProjectImprovement, ihpStakeholderAnalysis, integratedHumanPractices } from './content/integrated-human-practices';
import { team } from './content/team';
import { labSafety } from './content/lab-safety';
import { labNotebook } from './content/lab-notebook';
import { engineeringProductSections } from './content/engineering-products';
import { productExperimentSections } from './content/product-experiments';

export type WikiSection = {
  title: string;
  titleRuns?: DocumentTextRun[];
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
  heroImage?: string;
  figure?: { src: string; alt: string; caption: string };
  references?: WikiReference[];
};

export const navigation: Array<{ label: string; items: ReadonlyArray<readonly [string, string]> }> = [
  { label: "Project", items: [["Description", "/project-description"], ["Contribution", "/contribution"], ["Design", "/design"], ["Experiments", "/experiments"], ["Results", "/results"], ["Engineering", "/engineering"], ["Parts", "/parts"]] },
  { label: "Dry Lab", items: dryLabNavigation },
  { label: "Human Practices", items: [["Integrated Human Practices", "/integrated-human-practices"], ["Education", "/education"], ["Cooperation", "/cooperation"]] },
  { label: "Lab", items: [["Lab Safety", "/lab-safety"], ["Notebook", "/lab-notebook"]] },
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
        ["Safety", "/safety-and-security"],
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
  "project-description": projectDescription,
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
  design,
  engineering: {
    title: "Engineering DunaTerp through iterative cycles", eyebrow: "Engineering", intro: "Our engineering work connects product synthesis with biological containment. Iterative Design–Build–Test–Learn cycles were used to construct and verify β-citraurin and β-ionone pathways, while the salt-responsive mazEF circuit was developed to separate controlled cultivation from release conditions.", status: "team-draft",
    references: [refs.dca1, refs.mazf, refs.chen2009],
    sections: [
      {
        eyebrow: "Kill switch architecture",
        title: "Engineer a Salt-Controlled Suicide Switch",
        body: "The suicide switch is the core of the biosafety design: engineered Dunaliella salina cells should survive in the high-salt working environment but automatically initiate a suicide program after escape into low-salt waters. The final engineering narrative develops this system through four iterative DBTL cycles that validate MazF toxicity, tune basal toxin output, test the salt-responsive PDCA1 input and prepare co-transformation of the complete switch.",
        blocks: [
          { kind: "paragraph", text: "Under high-salt conditions, PDCA1 is activated and drives mazE expression, so the MazE antitoxin can neutralise the low basal MazF toxin produced from the weak Pip promoter. Under low-salt conditions, PDCA1 activity weakens, mazE expression drops and MazF becomes relatively excessive, allowing toxicity to dominate." },
          { kind: "paragraph", text: "Because MazF is clearly toxic in prokaryotes but had not yet been proven to function in the eukaryotic chassis D. salina, the engineering work first had to establish whether MazF remained effective, then reduce its basal burden and finally combine it with a salt-responsive neutralisation layer." },
          {
            kind: "figure-grid",
            caption: "Fig. 1 Working principle of the salt-controlled suicide switch under high-salt and low-salt conditions.",
            figures: [
              { src: "/figures/wet-lab/biosafety-design-high-salt.png", alt: "Working principle of the salt-controlled suicide switch under high-salt conditions, where PDCA1 drives mazE expression and MazE neutralises MazF.", caption: "High-salt state" },
              { src: "/figures/wet-lab/biosafety-design-low-salt.png", alt: "Working principle of the salt-controlled suicide switch under low-salt conditions, where PDCA1 activity weakens, MazE protection is lost and MazF kills the cells.", caption: "Low-salt state" },
            ],
          },
        ],
      },
      {
        eyebrow: "Cycle I",
        title: "Validate MazF as the Killing Effector",
        body: "Cycle I tested whether MazF could retain lethal activity in the eukaryotic chassis D. salina by forcing strong constitutive expression from the CaMV 35S promoter and tracking cell growth for 10 consecutive days.",
        blocks: [
          { kind: "heading", text: "Design" },
          { kind: "paragraph", text: "To verify the lethality and killing efficiency of MazF in the green alga D. salina, we constructed the validation plasmid p1302-CaMV35S-mazF, in which mazF is driven by the strong constitutive CaMV 35S promoter. MazF transformants, empty-vector transformants and wild type were cultured in parallel so that growth inhibition could be tested directly." },
          { kind: "heading", text: "Build" },
          { kind: "paragraph", text: "The mazF gene was cloned downstream of CaMV 35S in the pCAMBIA1302 backbone by restriction-enzyme digestion. After transformation into E. coli DH5α, single colonies were screened by colony PCR and sequence-verified before the confirmed plasmid was delivered into D. salina by osmotic transformation." },
          { kind: "paragraph", text: "The algal transformation workflow followed 1 M NaCl pre-adaptation for 8 h, resuspension in 0.1 M NaCl, addition of 5.46 μg plasmid DNA and 15 μL of 0.1% Triton X-100, 90 s vortexing and 48 h recovery culture. Because the vector carries hptII, positive transformants were selected on hygromycin B before the three groups were inoculated at the same starting density in 0.5 M NaCl PKS/DM liquid medium." },
          { kind: "heading", text: "Test" },
          { kind: "paragraph", text: "The MazF group barely grew during the 10-day assay: OD680 remained around 0.05-0.08 and stayed significantly below the WT and EV controls on days 6-10. WT rose to approximately 0.36, while EV reached about 0.28, showing that strong MazF expression imposed pronounced growth inhibition on D. salina." },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle1-map.png", alt: "Plasmid map of p1302-CaMV35S-mazF used for Cycle I MazF toxicity validation.", caption: "Fig. 2 Plasmid map of p1302-CaMV35S-mazF" },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle1-colony-pcr.png", alt: "Colony PCR verification of p1302-CaMV35S-mazF. M is the DL2000 DNA marker and lanes 1-11 are PCR products from individual colonies.", caption: "Fig. 3 Colony PCR verification of p1302-CaMV35S-mazF. M: DL2000 DNA marker; lanes 1-11: PCR products from individual colonies." },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle1-sequencing.png", alt: "Sequencing result confirming p1302-CaMV35S-mazF construction.", caption: "Fig. 4 Sequencing result of p1302-CaMV35S-mazF" },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle1-growth-curve.png", alt: "Ten-day growth curves of D. salina transformants comparing wild type, empty-vector and p1302-CaMV35S-mazF lines.", caption: "Fig. 5 Ten-day growth curves of D. salina transformants. WT: wild type; EV: empty-vector transformants; MazF: p1302-CaMV35S-mazF transformants. Data are mean ± SEM (n = 3)." },
          { kind: "heading", text: "Learn" },
          { kind: "paragraph", text: "Cycle I confirmed that MazF retains strong killing activity in the eukaryotic microalgal host, which is the key prerequisite for the suicide switch. At the same time, complete growth arrest showed that CaMV 35S-driven toxin output far exceeds the cellular tolerance window, so the final circuit cannot rely on a strong constitutive promoter and must instead reduce basal MazF expression while introducing dynamic neutralisation by MazE." },
        ],
      },
      {
        eyebrow: "Cycle II",
        title: "Tune Basal MazF Expression with Pip",
        body: "Cycle II redesigned the toxin module so that MazF remained inhibitory but no longer completely lethal during normal cultivation. This iteration introduced the bar marker for orthogonal selection and the weak endogenous Pip promoter to lower basal toxin output.",
        blocks: [
          { kind: "heading", text: "Design" },
          { kind: "paragraph", text: "Based on the problems exposed in Cycle I, two engineering modifications were made. First, the backbone was replaced with pCAMBIA1302-Bar so that the toxin plasmid would carry phosphinothricin resistance and remain compatible with later orthogonal double selection. Second, the low-abundance endogenous Pip promoter was chosen to drive mazF and keep basal toxin production at a tolerable level." },
          { kind: "heading", text: "Build" },
          { kind: "paragraph", text: "The Pip promoter and mazF gene fragment were amplified by PCR, the pCAMBIA1302-Bar backbone was linearised, and p1302-Bar-Pip-mazF was assembled by multi-fragment homologous recombination. After transformation into E. coli DH5α, kanamycin selection, colony PCR and sequencing confirmed the correct construct before osmotic transformation into D. salina and resistance screening on phosphinothricin-containing medium." },
          { kind: "paragraph", text: "Pip-mazF transformants were cultured in parallel with WT under 0.5 M NaCl conditions, and OD680 was measured continuously to determine whether weak-promoter toxin expression could remain viable while still suppressing growth." },
          { kind: "heading", text: "Test" },
          { kind: "paragraph", text: "Unlike the complete lethality seen in Cycle I, p1302-Bar-Pip-mazF transformants were able to survive and maintain growth. The Pip-mazF group showed a marked growth trough on day 2 at roughly OD680 0.015, then gradually recovered; by day 6 it reached about 0.165, which was approximately 69% of WT at the same time point. This indicates that weak-promoter-driven MazF is tolerable but still imposes sustained growth inhibition." },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle2-map.png", alt: "Plasmid map of p1302-Bar-Pip-mazF used in Cycle II to weaken toxin output.", caption: "Fig. 6 Plasmid map of p1302-Bar-Pip-mazF" },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle2-colony-pcr.png", alt: "Colony PCR verification of p1302-Bar-Pip-mazF. M is the DL5000 DNA marker, lanes 1-5 are PCR products from individual colonies, and NTC is the negative template control.", caption: "Fig. 7 Colony PCR verification of p1302-Bar-Pip-mazF. M: DL5000 DNA marker; lanes 1-5: PCR products from individual colonies; NTC: negative template control." },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle2-sequencing.png", alt: "Sequencing result confirming p1302-Bar-Pip-mazF construction.", caption: "Fig. 8 Sequencing result of p1302-Bar-Pip-mazF" },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle2-growth-curve.png", alt: "Six-day growth curves of D. salina transformants comparing wild type and p1302-Bar-Pip-mazF lines.", caption: "Fig. 9 Six-day growth curves of D. salina transformants. WT: wild type; Pip-MazF: p1302-Bar-Pip-mazF transformants. Data are mean ± SEM (n = 3)." },
          { kind: "heading", text: "Learn" },
          { kind: "paragraph", text: "Cycle II showed that the Pip weak promoter can reduce MazF to a viable but still growth-inhibited level. However, basal mazF expression persists at all salt concentrations, so a weak promoter alone cannot provide strict switch control. The next step must therefore introduce a salt-responsive antitoxin module in which PDCA1 drives mazE under high salt and allows MazF to dominate under low salt." },
        ],
      },
      {
        eyebrow: "Cycle III",
        title: "Validate PDCA1 as the Salt-Responsive Input",
        body: "Cycle III focused on the control layer of the switch. The PDCA1 promoter was coupled to EGFP so that its salt-response range could be measured directly in D. salina before building the complete antitoxin branch.",
        blocks: [
          { kind: "heading", text: "Design" },
          { kind: "paragraph", text: "To implement the intended 'survive in high salt, die in low salt' logic, the circuit needs a salt-responsive element that can dynamically regulate antitoxin expression. PDCA1 is an endogenous salt-regulated promoter of D. salina whose transcriptional activity increases under high-salt conditions and weakens under low salt, so we constructed p2301-PDCA1-EGFP to test whether EGFP fluorescence rises with salinity." },
          { kind: "heading", text: "Build" },
          { kind: "paragraph", text: "The PDCA1 promoter and EGFP reporter gene were assembled into the pCAMBIA2301 backbone by homologous recombination, generating p2301-PDCA1-EGFP. After transformation into E. coli DH5α, positive clones were screened by colony PCR and sequencing, then introduced into D. salina by osmotic transformation." },
          { kind: "paragraph", text: "Reporter transformants were inoculated into media containing 0.5 M, 2 M and 3 M NaCl so that EGFP fluorescence could be measured across a salinity gradient and used to define the usable response range of PDCA1." },
          { kind: "heading", text: "Test" },
          { kind: "paragraph", text: "After introducing p2301-PDCA1-EGFP into D. salina, clear EGFP fluorescence was observed under high-salt culture conditions at 2 M NaCl, whereas the fluorescence signal was significantly weakened under low-salt conditions at 0.5 M NaCl. This provides preliminary confirmation that PDCA1 has salt-concentration-responsive activity in D. salina and can drive downstream expression as intended." },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle3-map.png", alt: "Plasmid map of p2301-PDCA1-EGFP used to validate the salt-responsive PDCA1 promoter.", caption: "Fig. 10 Plasmid map of p2301-PDCA1-EGFP" },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle3-colony-pcr.png", alt: "Colony PCR verification of p2301-PDCA1-EGFP. M is the DL5000 DNA marker, lanes 1-5 are negative controls, and lanes 6-8 are PDCA1-EGFP colony PCR products.", caption: "Fig. 11 Colony PCR verification of p2301-PDCA1-EGFP. M: DL5000 DNA marker; lanes 1-5: negative controls (NTC); lanes 6-8: PDCA1-EGFP colony PCR products." },
          { kind: "figure", src: "/figures/wet-lab/kill-switch-engineering/killswitch-cycle3-sequencing.png", alt: "Sequencing result confirming p2301-PDCA1-EGFP construction.", caption: "Fig. 12 Sequencing result of p2301-PDCA1-EGFP" },
          { kind: "heading", text: "Learn" },
          { kind: "paragraph", text: "The PDCA1 promoter behaved as expected in D. salina: it is activated under high salt and weakened under low salt, which matches the intended control logic of the switch. More detailed fluorescence measurements across the salinity gradient will refine the response curve, but the toxin module and the salt-responsive input have now both been validated well enough to support complete-switch assembly." },
        ],
      },
      {
        eyebrow: "Cycle IV",
        title: "Assemble the Complete Suicide Switch",
        body: "Cycle IV combines the validated toxin branch and the salt-responsive input into the complete switch. This stage remains an engineering plan for co-transformation and salt-switch testing of double-positive transformants.",
        blocks: [
          { kind: "heading", text: "Design" },
          { kind: "paragraph", text: "Based on Cycles I-III, the complete suicide-switch module is designed by pairing the PDCA1-driven antitoxin vector p2301-PDCA1-mazE with p1302-Bar-Pip-mazF in D. salina. Under high salt, PDCA1 should activate mazE and neutralise low basal MazF; under low salt, PDCA1 activity should weaken, MazE should fall and MazF should become relatively excessive and kill the cells." },
          { kind: "heading", text: "Build" },
          { kind: "paragraph", text: "The PDCA1 promoter and mazE gene fragment will be amplified by PCR and assembled into the pCAMBIA2301 backbone carrying the hptII hygromycin marker to generate p2301-PDCA1-mazE. This plasmid will then be mixed with p1302-Bar-Pip-mazF at an equal molar ratio and co-delivered into D. salina by osmotic transformation." },
          { kind: "paragraph", text: "Cells will be plated on double-selective PKS/DM medium containing hygromycin B and phosphinothricin so that double-positive transformants carrying both plasmids can be isolated for salt-switch validation." },
          { kind: "heading", text: "Test" },
          { kind: "paragraph", text: "Double-positive transformants will first be cultured in high-salt medium at 2 M NaCl for 5 days and then transferred into low-salt medium at 0.5 M NaCl. OD680 will be tracked continuously so that the intended 'survive in high salt, die in low salt' phenotype can be evaluated directly." },
          { kind: "heading", text: "Learn" },
          { kind: "paragraph", text: "Two risks are already visible before the final assay. If double-positive transformants still survive under low salt, residual PDCA1 activity may keep MazE high enough to neutralise MazF. If they die even under high salt, Pip leakiness may still be excessive or plasmid copy number may become imbalanced after co-transformation. The salt-switch growth curves from this stage will therefore provide the strongest evidence for whether the complete suicide switch functions as designed." },
        ],
      },
      ...engineeringProductSections,
    ],
  },
  experiments: {
    title: "Testing the salt-controlled circuit", eyebrow: "Experiments", intro: "Wet-lab validation begins with MazF toxicity, then verifies PDCA1 as the salt-responsive input and finally tests whether co-transformed toxin and antitoxin modules can support the intended salt-switch logic.", status: "team-draft",
    references: [refs.mazf, refs.dca1],
    sections: [
      {
        title: "Wet-lab protocols",
        body: "The revised kill-switch workflow contains three linked experiment sets: MazF toxicity verification, PDCA1 salt-response validation and co-transformation-based functional testing of the complete switch module.",
        blocks: [
          { kind: "heading", text: "1. Verification of MazF toxicity (p1302-CaMV35S-mazF)" },
          { kind: "paragraph", text: "MazF is the toxin of the classical mazEF toxin-antitoxin system and serves as the core lethal element of this kill-switch design [1]. To verify whether MazF remains cytotoxic in the eukaryotic chassis D. salina, mazF was placed under the strong constitutive CaMV 35S promoter in the verification plasmid p1302-CaMV35S-mazF." },
          { kind: "paragraph", text: "The mazF insert was cloned into the pCAMBIA1302 backbone by restriction-enzyme digestion, transformed into E. coli DH5α for amplification, and verified by colony PCR and sequencing. The confirmed plasmid was then delivered into D. salina by osmotic transformation after 1 M NaCl pre-adaptation for 8 h, resuspension in 0.1 M NaCl medium, addition of 5.46 μg plasmid DNA and 15 μL of 0.1% Triton X-100, 90 s vortexing and 48 h recovery." },
          { kind: "paragraph", text: "Because the vector carries the hptII hygromycin-resistance marker, transformed algal cells were selected on hygromycin B-containing medium. Wild type and empty-vector transformants were cultured in parallel as controls in 0.5 M NaCl PKS/DM liquid medium at 26 °C under 50 μmol photons m⁻² s⁻¹ and a 16 h light / 8 h dark photoperiod, and OD680 was measured daily for 10 consecutive days." },
          { kind: "figure", src: "/figures/wet-lab/experiment1.png", alt: "Plasmid map of p1302-CaMV35S-mazF used for MazF toxicity verification.", caption: "Fig. 1 Plasmid map of p1302-CaMV35S-mazF" },
          { kind: "figure", src: "/figures/wet-lab/experiment3.png", alt: "Ten-day growth curves comparing wild type, empty-vector and MazF transformant Dunaliella salina strains.", caption: "Fig. 2 Growth curves of WT, empty-vector and MazF transformants" },
          { kind: "paragraph", text: "Result: the MazF group remained close to its initial density and stayed clearly below both controls throughout the assay, confirming that MazF retains strong growth-inhibitory activity in the eukaryotic microalgal host." },
          { kind: "heading", text: "2. Validation of the PDCA1 salt-induced response system (p2301-PDCA1-EGFP)" },
          { kind: "paragraph", text: "PDCA1 is an endogenous salt-regulated promoter of D. salina whose transcriptional activity increases under high-salt conditions and weakens under low-salt conditions [2]. Verifying this salt-responsive behaviour is a prerequisite for the intended 'survive in high salt, die in low salt' logic of the switch." },
          { kind: "paragraph", text: "To test this input layer, the endogenous PDCA1 promoter and the EGFP reporter gene were assembled into the linearised pCAMBIA2301 backbone by homologous recombination, generating p2301-PDCA1-EGFP. Colony PCR provided preliminary confirmation after E. coli DH5α transformation, and sequencing confirmed correct assembly of the functional elements." },
          { kind: "paragraph", text: "Transformants were then cultured in media containing different NaCl concentrations, including 0.5 M, 2 M and 3 M NaCl. EGFP fluorescence was measured across the salt gradient to quantify PDCA1 activity and define its usable dynamic range as a salinity-responsive control input." },
          { kind: "figure", src: "/figures/wet-lab/experiment6.png", alt: "Plasmid map of p2301-PDCA1-EGFP used to test PDCA1 salt responsiveness.", caption: "Fig. 3 Plasmid map of p2301-PDCA1-EGFP" },
          { kind: "heading", text: "3. Co-transformation and functional validation of the switch module" },
          { kind: "paragraph", text: "Because strong CaMV 35S-driven toxin expression is too high for stable maintenance, the final circuit reduces toxin output and pairs it with a salinity-responsive antitoxin module. The toxin plasmid uses the pCAMBIA1302-Bar backbone and the low-abundance endogenous Pip promoter to drive mazF, while the antitoxin plasmid places mazE under PDCA1 control in p2301-PDCA1-mazE." },
          { kind: "paragraph", text: "For the toxin branch, the Pip promoter and mazF fragment were amplified by PCR, the pCAMBIA1302-Bar backbone was linearised, and p1302-Bar-Pip-mazF was assembled by multi-fragment homologous recombination. The product was transformed into E. coli DH5α, selected on kanamycin plates and verified by colony PCR and sequencing. In parallel, the antitoxin vector p2301-PDCA1-mazE was assembled in the pCAMBIA2301 backbone, transformed into E. coli DH5α and confirmed by colony PCR plus sequencing." },
          { kind: "paragraph", text: "The two verified plasmids were mixed at an equal molar ratio and simultaneously delivered into D. salina by osmotic transformation using the same 1 M NaCl pre-adaptation, 0.1 M NaCl resuspension, Triton-assisted vortexing and 48 h recovery workflow. Double-positive transformants were then selected on PKS/DM medium containing phosphinothricin for p1302-Bar-Pip-mazF and G418 for p2301-PDCA1-mazE." },
          { kind: "figure", src: "/figures/wet-lab/experiment4.png", alt: "Plasmid map of p1302-Bar-Pip-mazF using the bar marker and the weak Pip promoter.", caption: "Fig. 4 Plasmid map of p1302-Bar-Pip-mazF" },
          { kind: "paragraph", text: "Functional validation is performed by inoculating double-positive transformants in parallel into high-salt (2 M NaCl) and low-salt (0.5 M NaCl) media and monitoring OD680 over time. Under high salt, PDCA1 is expected to activate mazE and neutralise MazF; under low salt, PDCA1 activity should fall, MazE protection should weaken and MazF toxicity should dominate." },
        ],
      },
      ...productExperimentSections,
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
  "safety-and-security": safety,
  parts: {
    title: "Parts",
    eyebrow: "Parts",
    intro: "DunaTerp's Registry record brings together the regulatory elements, coding sequences, targeting element, vector and composite expression constructs used across the project. Each Part number below links directly to its official iGEM Registry record.",
    status: "review-ready",
    sections: [
      {
        title: "Overview",
        body: "This collection presents 11 basic parts and 5 composite parts used in DunaTerp. The basic parts include promoters, coding sequences, a chloroplast transit peptide and a plasmid vector. The composite parts combine these elements into expression constructs for our *Dunaliella salina* platform. Each entry links to its official iGEM Registry record.",
        blocks: [
          { kind: "links", links: [
            { label: "Open the official SCU-China (2026) Registry record", href: "https://registry.igem.org/organisations/b53d8950-5efe-4d5a-89b8-294aa00758ab" },
          ] },
        ],
      },
      {
        title: "Basic Parts",
        body: "The building blocks of our platform provide transcriptional control, protein coding sequences, chloroplast targeting and the vector backbone.",
        blocks: [
          { kind: "table", caption: "Basic Parts · SCU-China 2026", columns: ["Part number", "Part name", "Type", "Length", "Registry link"], rows: [
            ["BBa_26A1VMDJ", "*PDCA1* salt-responsive promoter", "Promoter", "1,369 bp", "https://registry.igem.org/parts/bba-26a1vmdj"],
            ["BBa_26S2808C", "*Pip* weak promoter", "Promoter", "2,044 bp", "https://registry.igem.org/parts/bba-26s2808c"],
            ["BBa_26EJ70BX", "*DtRBCS2* Promoter", "Promoter", "419 bp", "https://registry.igem.org/parts/bba-26ej70bx"],
            ["BBa_26TQTS2R", "CaMV 35S promoter", "Promoter", "346 bp", "https://registry.igem.org/parts/bba-26tqts2r"],
            ["BBa_261OJ38D", "*CitCCD4*", "CDS", "1,692 bp", "https://registry.igem.org/parts/bba-261oj38d"],
            ["BBa_2697BHS2", "*CCD1*", "CDS", "1,617 bp", "https://registry.igem.org/parts/bba-2697bhs2"],
            ["BBa_26FN67DL", "*MazE* antitoxin CDS", "CDS", "249 bp", "https://registry.igem.org/parts/bba-26fn67dl"],
            ["BBa_26VRE9P8", "*MazF* toxin CDS", "CDS", "336 bp", "https://registry.igem.org/parts/bba-26vre9p8"],
            ["BBa_26RSNHS8", "*GFP* reporter CDS", "CDS", "717 bp", "https://registry.igem.org/parts/bba-26rsnhs8"],
            ["BBa_265TD6LS", "*DtRBCS2* Chloroplast Transit Peptide", "Transit Peptide", "144 bp", "https://registry.igem.org/parts/bba-265td6ls"],
            ["BBa_26QLEIH2", "pCAMBIA1302", "Plasmid Vector", "10,549 bp", "https://registry.igem.org/parts/bba-26qleih2"],
          ] },
        ],
      },
      {
        title: "Composite Parts",
        body: "These expression constructs combine promoters and coding sequences, with a chloroplast transit peptide included in the targeted *CCD1* construct.",
        blocks: [
          { kind: "table", caption: "Composite Parts · SCU-China 2026", columns: ["Part number", "Part name", "Type", "Length", "Registry link"], rows: [
            ["BBa_26HXFBCU", "p*RBCS2*-*CitCCD4*", "Engineered Region", "2,111 bp", "https://registry.igem.org/parts/bba-26hxfbcu"],
            ["BBa_26LDQ026", "p35S-*CitCCD4*", "Engineered Region", "2,068 bp", "https://registry.igem.org/parts/bba-26ldq026"],
            ["BBa_261RCD6J", "p*RBCS2*-*CCD1*", "Engineered Region", "2,036 bp", "https://registry.igem.org/parts/bba-261rcd6j"],
            ["BBa_2682BGY8", "p35S-*CCD1*", "Engineered Region", "1,993 bp", "https://registry.igem.org/parts/bba-2682bgy8"],
            ["BBa_267QXDD3", "p*RBCS2*-Transit Peptide-*CCD1*", "Engineered Region", "2,177 bp", "https://registry.igem.org/parts/bba-267qxdd3"],
          ] },
        ],
      },
    ],
  },
  "lab-safety": labSafety,
  "lab-notebook": labNotebook,
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
  "integrated-human-practices": integratedHumanPractices,
  "background-research": ihpBackgroundResearch,
  "stakeholder-analysis": ihpStakeholderAnalysis,
  "project-improvement": ihpProjectImprovement,
  team,
  attributions,
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
