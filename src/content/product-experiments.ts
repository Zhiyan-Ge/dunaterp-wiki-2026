import type { WikiSection } from '../site-data';

export const productExperimentSections: WikiSection[] = [
  {
    title: 'Construct β-Ionone and β-Citraurin expression plasmids',
    eyebrow: 'Molecular Cloning',
    body: 'This section follows the full cloning workflow for the five recombinant plasmids used in the β-ionone and β-citraurin routes: backbone linearisation by inverse PCR, target-fragment amplification with homology arms, gel purification, seamless homologous recombination, bacterial transformation and sequence confirmation.',
    blocks: [
      { kind: 'paragraph', text: 'The pCAMBIA1302 vector was used as the backbone. Two backbone variants were prepared by inverse PCR: a 35S group that retained the CaMV 35S promoter, and an RBCS2 group that replaced the 35S promoter with RBCS2. Target genes were amplified from glycerol-stock plasmid templates, and 15-20 bp homology arms were introduced at both primer ends to support one-step assembly.' },
      { kind: 'paragraph', text: 'Agarose gel electrophoresis and gel extraction were used after each PCR step, and seamless ligation was performed with the Vazyme CloneExpress Ultra One Step Cloning Kit. The full ligation product was transformed into DH5α or Stbl3 competent cells, screened by colony PCR, propagated in kanamycin-containing LB medium and finally confirmed by Sanger sequencing.' },
      { kind: 'table', caption: 'Five recombinant plasmids constructed for the product routes', columns: ['ID', 'Promoter', 'Target gene', 'Construct role'], rows: [
        ['C1', 'RBCS2', 'CCD1', 'β-Ionone synthesis'],
        ['C2', 'RBCS2', 'CitCCD4', 'β-Citraurin synthesis'],
        ['C3', 'RBCS2', 'CCD1 with signal peptide', 'Chloroplast-targeted β-ionone design'],
        ['D1', '35S', 'CCD1', 'Constitutive β-ionone comparison'],
        ['D2', '35S', 'CitCCD4', 'Constitutive β-citraurin comparison'],
      ] },
      {
        kind: 'figure-grid',
        caption: 'Backbone and recombinant-plasmid maps for the β-ionone and β-citraurin product routes.',
        figures: [
          { src: '/figures/wet-lab/product-experiments/experiment-product-fig-01.png', alt: 'Backbone plasmid map of pCAMBIA1302 used for product-route cloning.', caption: 'Fig. 1 Backbone plasmid pCAMBIA1302 map' },
          { src: '/figures/wet-lab/product-experiments/experiment-product-fig-02.png', alt: 'Plasmid map of p1302-RBCS2-CCD1 for beta-ionone synthesis.', caption: 'Fig. 2 p1302-RBCS2-CCD1 plasmid map' },
          { src: '/figures/wet-lab/product-experiments/experiment-product-fig-03.png', alt: 'Plasmid map of p1302-RBCS2-CitCCD4 for beta-citraurin synthesis.', caption: 'Fig. 3 p1302-RBCS2-CitCCD4 plasmid map' },
          { src: '/figures/wet-lab/product-experiments/experiment-product-fig-04.png', alt: 'Plasmid map of p1302-RBCS2-SP-CCD1 for chloroplast-targeted beta-ionone synthesis.', caption: 'Fig. 4 p1302-RBCS2-SP-CCD1 plasmid map' },
          { src: '/figures/wet-lab/product-experiments/experiment-product-fig-05.png', alt: 'Plasmid map of p1302-35S-CCD1 for constitutive beta-ionone expression.', caption: 'Fig. 5 p1302-35S-CCD1 plasmid map' },
          { src: '/figures/wet-lab/product-experiments/experiment-product-fig-06.png', alt: 'Plasmid map of p1302-35S-CitCCD4 for constitutive beta-citraurin expression.', caption: 'Fig. 6 p1302-35S-CitCCD4 plasmid map' },
        ],
      },
    ],
  },
  {
    title: 'Transform D. salina and establish selection conditions',
    eyebrow: 'Algal Transformation',
    body: 'This section describes culture of Dunaliella salina FACHB-435 in modified DM medium and its subsequent transformation by osmotic shock. The workflow covers medium preparation, algal expansion, transformation, and the 48 h recovery period before selection.',
    blocks: [
      { kind: 'table', caption: 'Modified DM medium formulation used for D. salina culture', columns: ['Component', 'Amount per 1 L'], rows: [
        ['NaCl', '87.69 g'],
        ['NaNO3', '0.42 g'],
        ['NaH2PO4·2H2O', '15.60 mg'],
        ['MgSO4·7H2O', '1.23 g'],
        ['KCl', '74.00 mg'],
        ['CaCl2·2H2O', '44.00 mg'],
        ['10× A5 solution', '100 μL'],
        ['NaHCO3', '0.84 g'],
        ['Fe·EDTA solution', '1 mL'],
      ] },
      { kind: 'paragraph', text: 'Cells were cultured statically at 26 °C under 50 μmol photons m⁻² s⁻¹ with a 16 h light / 8 h dark photoperiod. For osmotic transformation, log-phase cultures at OD680 about 0.5-1.0 were washed three times with fresh DM medium, adjusted to 10^6 cells/mL, pre-adapted in 1 M NaCl for 8 h, shifted into 0.1 M NaCl and mixed with 5.46 μg plasmid DNA plus 15 μL of 0.1% Triton X-100 before vigorous vortexing for 60-120 s, with 90 s used as the recommended condition.' },
      { kind: 'paragraph', text: 'After transformation, cells were immediately transferred into 30 mL fresh DM medium and allowed to recover statically for 48 h. Three transformation batches were completed for the product-route constructs: batch 1 on August 17, batch 2 on August 21 and batch 3 on August 30, with the final batch containing one transformation each for C1, C2, C3, D1 and D2.' },
      { kind: 'paragraph', text: 'Selection conditions were refined through a hygromycin gradient pre-experiment. A broad concentration range of 100, 200, 300, 600 and 800 mg/L was first tested, then a refined glucose-assisted gradient of 6.25, 12.5, 25, 50, 75, 100 and 200 mg/L with 10 mM glucose co-treatment was evaluated by microscopy on September 5.' },
      {
        kind: 'figure-grid',
        caption: 'Microscopic observations used during hygromycin gradient screening.',
        figures: [
          { src: '/figures/wet-lab/product-experiments/experiment-product-fig-07.png', alt: 'Microscopic view of the hygromycin gradient with glucose co-treatment at 12.5 mg/L.', caption: 'Fig. 7 Hygromycin gradient with glucose co-treatment at 12.5 mg/L' },
          { src: '/figures/wet-lab/product-experiments/experiment-product-fig-08.png', alt: 'Microscopic view of the hygromycin gradient at 25 mg/L.', caption: 'Fig. 8 Hygromycin gradient at 25 mg/L' },
        ],
      },
    ],
  },
  {
    title: 'Screen and verify transformed lines',
    eyebrow: 'Screening & Verification',
    body: 'Screening moved from hygromycin-gradient optimisation to genomic confirmation of transformed lines. This workflow includes antibiotic pre-screening, genomic DNA extraction from D. salina, construct-specific genomic PCR and sequencing-based confirmation where needed.',
    blocks: [
      { kind: 'paragraph', text: 'Because pCAMBIA1302 carries the hptII marker, hygromycin B was used for selection. The pre-experiment stage tested a wide gradient on August 22, and the refinement stage added 10 mM glucose on August 28 to sharpen the viability boundary before microscopic evaluation of live-cell density changes.' },
      { kind: 'paragraph', text: 'Genomic DNA extraction used a Tiangen plant spin-column workflow: algal pellets were collected from 10 mL culture, ground in liquid nitrogen, lysed with GP1 buffer containing RNase A, treated with GP2 buffer, passed through a CB3 adsorption column, washed with GD buffer and finally eluted with TE buffer.' },
      { kind: 'table', caption: 'Genomic PCR verification targets for product-route transformants', columns: ['Primer strategy', 'Representative construct', 'Verification purpose'], rows: [
        ['D1-CCD1-F / CCD1-R', 'D1', 'Verify the D1 constitutive CCD1 construct'],
        ['RBCS2-F / CCD1-R', 'C1 / C3', 'Verify RBCS2-driven CCD1 variants'],
        ['D2-CitCCD4-F / CitCCD4-R', 'D2', 'Verify the D2 constitutive CitCCD4 construct'],
        ['C2-RBCS2-F / CitCCD4-R', 'C2', 'Verify the C2 RBCS2-CitCCD4 construct'],
      ] },
      { kind: 'paragraph', text: 'The genomic PCR used KOD One Master Mix in a 25 μL reaction with 65 °C annealing and 68 °C extension. Positive amplification products were followed by sequencing when required. Together, these steps separated failures caused by construct delivery from failures that emerged later at the product-detection stage.' },
    ],
  },
  {
    title: 'Profile product formation by metabolomics',
    eyebrow: 'Metabolomics Analysis',
    body: 'Metabolomics was used to evaluate metabolic reprogramming in transformants. The updated workflow combines widely targeted UPLC-MS/MS profiling with carotenoid-targeted quantification, covering sample preparation, extraction, instrument conditions and downstream statistical analysis.',
    blocks: [
      { kind: 'table', caption: 'Widely targeted metabolomics sample groups for the β-ionone route', columns: ['Group', 'Sample', 'Host', 'Construct'], rows: [
        ['C1 group', 'C1', 'Dunaliella salina FACHB-435', 'RBCS2-CCD1'],
        ['C3 group', 'C3', 'Dunaliella salina FACHB-435', 'RBCS2-signal peptide-CCD1'],
        ['WT group', 'WT', 'Dunaliella salina FACHB-435', 'Wild-type control'],
      ] },
      { kind: 'paragraph', text: 'For widely targeted metabolomics, 30 mg lyophilised algal powder was extracted with pre-chilled 70% methanol containing an internal standard, vortexed repeatedly, centrifuged and filtered through a 0.22 μm membrane before UPLC-MS/MS analysis. Detection used an ExionLC AD system with an Agilent SB-C18 column, 0.35 mL/min flow rate, 40 °C column temperature and triple-quadrupole MRM acquisition with individually optimised DP and CE values.' },
      { kind: 'paragraph', text: 'Carotenoid-targeted quantification focused on 47 carotenoids and related esters, including β-carotene, β-cryptoxanthin, zeaxanthin and β-citraurin. Samples were extracted with n-hexane / acetone / ethanol containing 0.01% BHT, reconstituted in dichloromethane and analysed on a YMC C30 column with APCI-MS/MS. Quantification used external standard curves from 0.001 to 25 μg/mL, and sample content was calculated from concentration, reconstitution volume and sample mass.' },
      { kind: 'paragraph', text: 'Downstream data processing followed the new document closely: missing values were imputed with one-fifth of the row minimum, metabolites with QC CV below 0.5 were retained, log2 transformation plus centering were applied before PCA, UV scaling was used before clustering, and the analysis suite included PCA, HCA, Pearson correlation, differential-metabolite screening, Venn and K-means analyses, KEGG and MetMap annotation, and carotenoid heatmaps in R 4.1.2.' },
    ],
  },
  {
    title: 'Identify route-specific transcripts by RT-qPCR',
    eyebrow: 'qPCR Identification',
    body: 'RT-qPCR was used for transcriptional validation of D. salina transformants. The workflow includes total RNA extraction, DNase treatment, cDNA synthesis and SYBR Green-based qPCR, with CCD1, CitCCD4, SP-CCD1 and optional HygR as detection targets and actin as the housekeeping gene.',
    blocks: [
      { kind: 'table', caption: 'RT-qPCR groups and representative detection targets', columns: ['Group', 'Construct', 'Promoter / element', 'Detection target'], rows: [
        ['WT', 'Wild type', 'None', 'actin'],
        ['EV', 'Empty vector control', 'None', 'actin / HygR'],
        ['C1', 'p1302-RBCS2-CCD1', 'RBCS2', 'CCD1'],
        ['C2', 'p1302-RBCS2-CitCCD4', 'RBCS2', 'CitCCD4'],
      ] },
      { kind: 'paragraph', text: 'At least three biological replicates and three technical replicates were set for each group, and all samples were harvested on the same day under identical light conditions to minimise RBCS2-related light-response bias. RNA extraction used the Vazyme plant RNA miniprep kit with on-column DNase treatment, strictly under RNase-free conditions and with ice-bath handling during the key lysis and sonication steps.' },
      { kind: 'paragraph', text: 'Two-step reverse transcription was carried out after genomic DNA removal, and the qPCR reaction used a 20 μL TB Green system with 10 μL 2× premix, 0.8 μL of each primer and 2 μL cDNA. The cycling program followed 95 °C denaturation, 61 °C annealing/extension for 40 cycles and a final melting curve. Relative expression was calculated with the 2^(-ΔΔCt) method using wild type as the calibrator, with NTC, minus-RT and melting-curve checks included in every run.' },
    ],
  },
  {
    title: 'Screen carotenoid cleavage products by TLC',
    eyebrow: 'TLC Analysis',
    body: 'Normal-phase silica-gel TLC was used as a rapid screening method for carotenoid cleavage products such as β-ionone, β-apo-8\'-carotenal, β-citraurin and related aldehyde derivatives. The new document keeps this as a semi-quantitative screen that still requires HPLC-DAD or LC-MS confirmation for positive results.',
    blocks: [
      { kind: 'paragraph', text: 'Pigment extraction started from 1-5 mL algal culture. Cell pellets were washed with 0.5 M NaCl, extracted with acetone:methanol (1:1), sonicated in an ice bath, centrifuged and re-extracted once. Carotenoids were then partitioned into n-hexane, dried over anhydrous sodium sulfate, evaporated under nitrogen and reconstituted in acetone under light-protected conditions.' },
      { kind: 'paragraph', text: 'Silica gel GF254 plates were activated at 105 °C for 30 min, spotted 1.2 cm above the lower edge and developed with petroleum ether after 20-30 min chamber equilibration. Plates were evaluated under visible light, 254 nm UV, iodine vapour and 0.4% DNPH in 2 M HCl. In this workflow, a transformant is considered TLC-positive only when it shows a new DNPH-positive spot absent from wild-type and empty-vector controls, with a matching Rf value, no splitting in co-chromatography and confirmation in at least two independent replicates.' },
    ],
  },
];
