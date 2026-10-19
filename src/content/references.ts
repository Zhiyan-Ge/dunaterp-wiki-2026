import type { WikiReference } from './types';

const article = (label: string, href: string): WikiReference => ({ label, href, kind: 'Article' });
const dataset = (label: string, href: string): WikiReference => ({ label, href, kind: 'Dataset' });
const database = (label: string, href: string): WikiReference => ({ label, href, kind: 'Database' });
const image = (label: string, href: string): WikiReference => ({ label, href, kind: 'Image' });

/**
 * Shared, checked bibliography entries. Keeping the full citation in one place
 * makes repeated sources consistent across the project, results and modeling
 * chapters while each page remains free to choose its own citation order.
 */
export const refs = {
  oren2005: article(
    'Oren, A. (2005). A hundred years of Dunaliella research: 1905–2005. Saline Systems, 1, Article 2. https://doi.org/10.1186/1746-1448-1-2',
    'https://doi.org/10.1186/1746-1448-1-2',
  ),
  borowitzka2013: article(
    'Borowitzka, M. A. (2013). High-value products from microalgae—their development and commercialisation. Journal of Applied Phycology, 25(3), 743–756. https://doi.org/10.1007/s10811-013-9983-9',
    'https://doi.org/10.1007/s10811-013-9983-9',
  ),
  lan2022: article(
    'Lan, Y., Song, Y., Guo, Y., Qiao, D., Cao, Y. & Xu, H. (2022). DsLCYB directionally modulated β-carotene of the green alga Dunaliella salina under red light stress. Journal of Microbiology and Biotechnology, 32(12), 1622–1631. https://doi.org/10.4014/jmb.2208.08044',
    'https://doi.org/10.4014/jmb.2208.08044',
  ),
  mialoundama2010: article(
    'Mialoundama, A. S. et al. (2010). Characterization of plant carotenoid cyclases as members of the flavoprotein family functioning with no net redox change. Plant Physiology, 153(3), 970–979. https://doi.org/10.1104/pp.110.155440',
    'https://doi.org/10.1104/pp.110.155440',
  ),
  transcriptomeDataset: dataset(
    'Li, Y. & Wang, G. (2018; public release 2020). GSE120965: Transcriptome analysis reveals regulation of gene expression during photoacclimation to high irradiance levels in Dunaliella salina (Chlorophyceae). NCBI Gene Expression Omnibus. BioProject PRJNA495151.',
    'https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=GSE120965',
  ),
  li2019: article(
    'Li, Y., Gu, W., Huang, A., Xie, X., Wu, S. & Wang, G. (2019). Transcriptome analysis reveals regulation of gene expression during photoacclimation to high irradiance levels in Dunaliella salina (Chlorophyceae). Phycological Research, 67(4), 291–302. https://doi.org/10.1111/pre.12379',
    'https://doi.org/10.1111/pre.12379',
  ),
  grabherr2011: article(
    'Grabherr, M. G. et al. (2011). Full-length transcriptome assembly from RNA-Seq data without a reference genome. Nature Biotechnology, 29, 644–652. https://doi.org/10.1038/nbt.1883',
    'https://doi.org/10.1038/nbt.1883',
  ),
  diamond2015: article(
    'Buchfink, B., Xie, C. & Huson, D. H. (2015). Fast and sensitive protein alignment using DIAMOND. Nature Methods, 12, 59–60. https://doi.org/10.1038/nmeth.3176',
    'https://doi.org/10.1038/nmeth.3176',
  ),
  deseq2010: article(
    'Anders, S. & Huber, W. (2010). Differential expression analysis for sequence count data. Genome Biology, 11, Article R106. https://doi.org/10.1186/gb-2010-11-10-r106',
    'https://doi.org/10.1186/gb-2010-11-10-r106',
  ),
  fachet2020: article(
    'Fachet, M., Witte, C., Flassig, R. J., Rihko-Struckmann, L. K., McKie-Krisberg, Z., Polle, J. E. W. & Sundmacher, K. (2020). Reconstruction and analysis of a carbon-core metabolic network for Dunaliella salina. BMC Bioinformatics, 21, Article 1. https://doi.org/10.1186/s12859-019-3325-0',
    'https://doi.org/10.1186/s12859-019-3325-0',
  ),
  orth2010: article(
    'Orth, J. D., Thiele, I. & Palsson, B. Ø. (2010). What is flux balance analysis? Nature Biotechnology, 28(3), 245–248. https://doi.org/10.1038/nbt.1614',
    'https://doi.org/10.1038/nbt.1614',
  ),
  bintu2005: article(
    'Bintu, L., Buchler, N. E., Garcia, H. G., Gerland, U., Hwa, T., Kondev, J. & Phillips, R. (2005). Transcriptional regulation by the numbers: models. Current Opinion in Genetics & Development, 15(2), 116–124. https://doi.org/10.1016/j.gde.2005.02.007',
    'https://doi.org/10.1016/j.gde.2005.02.007',
  ),
  liang2017: article(
    'Liang, M.-H., Lu, Y., Chen, H.-H. & Jiang, J.-G. (2017). The salt-regulated element in the promoter of lycopene β-cyclase gene confers a salt regulatory pattern in carotenogenesis of Dunaliella bardawil. Environmental Microbiology, 19(3), 982–989. https://doi.org/10.1111/1462-2920.13539',
    'https://doi.org/10.1111/1462-2920.13539',
  ),
  pubchemLycopene: database(
    'National Center for Biotechnology Information. (2026). PubChem Compound Summary for CID 446925, Lycopene. Retrieved 19 October 2026.',
    'https://pubchem.ncbi.nlm.nih.gov/compound/446925',
  ),
  alphafold3: article(
    'Abramson, J. et al. (2024). Accurate structure prediction of biomolecular interactions with AlphaFold 3. Nature, 630(8016), 493–500. https://doi.org/10.1038/s41586-024-07487-w',
    'https://doi.org/10.1038/s41586-024-07487-w',
  ),
  foldx: article(
    'Schymkowitz, J. et al. (2005). The FoldX web server: an online force field. Nucleic Acids Research, 33(Web Server issue), W382–W388. https://doi.org/10.1093/nar/gki387',
    'https://doi.org/10.1093/nar/gki387',
  ),
  vina: article(
    'Eberhardt, J., Santos-Martins, D., Tillack, A. F. & Forli, S. (2021). AutoDock Vina 1.2.0: new docking methods, expanded force field, and Python bindings. Journal of Chemical Information and Modeling, 61(8), 3891–3898. https://doi.org/10.1021/acs.jcim.1c00203',
    'https://doi.org/10.1021/acs.jcim.1c00203',
  ),
  gromacs: article(
    'Abraham, M. J., Murtola, T., Schulz, R., Páll, S., Smith, J. C., Hess, B. & Lindahl, E. (2015). GROMACS: high performance molecular simulations through multi-level parallelism from laptops to supercomputers. SoftwareX, 1–2, 19–25. https://doi.org/10.1016/j.softx.2015.06.001',
    'https://doi.org/10.1016/j.softx.2015.06.001',
  ),
  gaff: article(
    'Wang, J., Wolf, R. M., Caldwell, J. W., Kollman, P. A. & Case, D. A. (2004). Development and testing of a general AMBER force field. Journal of Computational Chemistry, 25(9), 1157–1174. https://doi.org/10.1002/jcc.20035',
    'https://doi.org/10.1002/jcc.20035',
  ),
  chen2009: article(
    'Chen, H. & Jiang, J.-G. (2009). Osmotic responses of Dunaliella to the changes of salinity. Journal of Cellular Physiology, 219(2), 251–258. https://doi.org/10.1002/jcp.21715',
    'https://doi.org/10.1002/jcp.21715',
  ),
  dca1: article(
    'Li, J., Lu, Y., Xue, L. & Xie, H. (2010). A structurally novel salt-regulated promoter of duplicated carbonic anhydrase gene 1 from Dunaliella salina. Molecular Biology Reports, 37, 1143–1154. https://doi.org/10.1007/s11033-009-9901-z',
    'https://doi.org/10.1007/s11033-009-9901-z',
  ),
  mazf: article(
    'Zhang, Y., Zhang, J., Hoeflich, K. P., Ikura, M., Qing, G. & Inouye, M. (2003). MazF cleaves cellular mRNAs specifically at ACA to block protein synthesis in Escherichia coli. Molecular Cell, 12(4), 913–923. https://doi.org/10.1016/S1097-2765(03)00402-7',
    'https://doi.org/10.1016/S1097-2765(03)00402-7',
  ),
  farhat2011: article(
    'Farhat, N. et al. (2011). Optimization of salt concentrations for a higher carotenoid production in Dunaliella salina (Chlorophyceae). Journal of Phycology, 47(5), 1072–1077. https://doi.org/10.1111/j.1529-8817.2011.01036.x',
    'https://doi.org/10.1111/j.1529-8817.2011.01036.x',
  ),
  gomez2005: article(
    'Gómez, P. I. & González, M. A. (2005). The effect of temperature and irradiance on the growth and carotenogenic capacity of seven strains of Dunaliella salina cultivated under laboratory conditions. Biological Research, 38(2–3), 151–162. https://doi.org/10.4067/S0716-97602005000200005',
    'https://doi.org/10.4067/S0716-97602005000200005',
  ),
  posten2009: article(
    'Posten, C. (2009). Design principles of photo-bioreactors for cultivation of microalgae. Engineering in Life Sciences, 9(3), 165–177. https://doi.org/10.1002/elsc.200900003',
    'https://doi.org/10.1002/elsc.200900003',
  ),
  carvalho2011: article(
    'Carvalho, A. P., Silva, S. O., Baptista, J. M. & Malcata, F. X. (2011). Light requirements in microalgal photobioreactors: an overview of biophotonic aspects. Applied Microbiology and Biotechnology, 89(5), 1275–1288. https://doi.org/10.1007/s00253-010-3047-8',
    'https://doi.org/10.1007/s00253-010-3047-8',
  ),
  humanPracticesHero: image(
    'Freeman, M. L. (2017). Great Salt Lake, USGS boat at work [Photograph]. Utah Water Science Center, U.S. Geological Survey. Public domain.',
    'https://www.usgs.gov/media/images/great-salt-lake-usgs-boat-work',
  ),
} as const satisfies Record<string, WikiReference>;
