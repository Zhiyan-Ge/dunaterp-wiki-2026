// Original vector method schematics, derived from the supplied wet-lab protocols.
// No measurements, construct sequence, fluorescence curves or results are invented.
// Emits an apply_patch patch; generated SVGs are served as ordinary image assets.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const dir = new URL('../public/figures/wet-lab/', import.meta.url);
const ink = '#143f35', green = '#70974c', teal = '#438b92', amber = '#ce9250';
const label = (x,y,s,size=20,color=ink,anchor='middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${color}" font-size="${size}">${s}</text>`;
const arrow = (x,y,x2,y2) => `<path d="M${x} ${y} L${x2} ${y2}" fill="none" stroke="#91a49b" stroke-width="2.5" marker-end="url(#arrow)"/>`;
const circleDNA = (x,y) => `<g transform="translate(${x} ${y})"><circle r="40" fill="none" stroke="${teal}" stroke-width="10"/><path d="M-28 -28 A40 40 0 0 1 28 -28" fill="none" stroke="${amber}" stroke-width="10"/><path d="M-13 -43v17M13 -43v17" stroke="${ink}" stroke-width="2"/></g>`;
const fragments = (x,y) => `<g transform="translate(${x} ${y})"><path d="M-42-22h84M-42-13h84" stroke="${teal}" stroke-width="4"/><path d="M-25 20h50M-25 29h50" stroke="${amber}" stroke-width="4"/><path d="M-37-22v9M-24-22v9M-11-22v9M2-22v9M15-22v9M28-22v9M-20 20v9M-7 20v9M6 20v9M19 20v9" stroke="#91a49b" stroke-width="2"/></g>`;
const tube = (x,y,color=teal) => `<g transform="translate(${x} ${y})"><path d="M-24 -48h48v65L0 48l-24-31z" fill="#fff" stroke="${ink}" stroke-width="2.5"/><path d="M-19 0h38v15L0 40l-19-25z" fill="${color}" opacity=".5"/><rect x="-29" y="-57" width="58" height="12" rx="3" fill="#e1e9dd" stroke="${ink}" stroke-width="2.5"/></g>`;
const cell = (x,y) => `<g transform="translate(${x} ${y})"><path d="M-8 -34C-42 -76 -63 -51 -52 -91M8 -34C35 -71 66 -62 58 -92" fill="none" stroke="${green}" stroke-width="3"/><ellipse cy="5" rx="42" ry="50" fill="#e6efd7" stroke="${green}" stroke-width="3"/><path d="M-29 -15Q-43 47 8 43Q35 32 29 -18Q17 10 0 7Q-18 8 -29 -15" fill="#a9c481"/><circle cx="2" cy="-8" r="10" fill="#fffdf3" stroke="${green}" stroke-width="2"/><circle cx="22" cy="-18" r="6" fill="${amber}"/></g>`;
const helix = (x,y) => `<g transform="translate(${x} ${y})" fill="none" stroke-width="3"><path d="M-18 -48C45 -16 -45 16 18 48" stroke="${teal}"/><path d="M18 -48C-45 -16 45 16 -18 48" stroke="${green}"/><path d="M-14 -42h28M-7 -27H7M-15 -12h30M-15 12h30M-7 27H7M-14 42h28" stroke="#a3b8ac" stroke-width="2"/></g>`;
const column = (x,y) => `<g transform="translate(${x} ${y})"><path d="M-24 -68h48v100L7 54v27H-7V54l-17-22z" fill="#fff" stroke="${ink}" stroke-width="2.5"/><path d="M-19 -48h38v77L4 48h-8l-15-19z" fill="#eee4c6"/><path d="M-19 -27h38M-19 -10h38M-19 8h38" stroke="${amber}" stroke-width="9" opacity=".65"/><path d="M-11 70h22" stroke="${ink}" stroke-width="3"/></g>`;
const flask = (x,y,color=green) => `<g transform="translate(${x} ${y})"><path d="M-12-48h24v28l31 54q5 9-7 9h-72q-12 0-7-9l31-54z" fill="#fff" stroke="${ink}" stroke-width="2.5"/><path d="M-23 6h46l16 29q2 3-5 3h-68q-7 0-5-3z" fill="${color}" opacity=".45"/><path d="M-16-48h32" stroke="${ink}" stroke-width="4"/></g>`;
const gel = (x,y) => `<g transform="translate(${x} ${y})"><rect x="-42" y="-45" width="84" height="90" rx="7" fill="#e5eff0" stroke="${teal}" stroke-width="2.5"/><path d="M-25-30h14M-7-30H7M11-30h14" stroke="${teal}" stroke-width="5"/><path d="M-25-12h14M-25 2h14M-25 16h14M-25 30h14M-7 2H7M11 2h14" stroke="${teal}" stroke-width="3" opacity=".65"/></g>`;
const magnify = (x,y) => `<g transform="translate(${x} ${y})"><circle r="32" fill="#eff4e8" stroke="${ink}" stroke-width="3"/><path d="M24 24l28 28" stroke="${ink}" stroke-width="8" stroke-linecap="round"/><path d="M-17 0l11 12L18-14" fill="none" stroke="${green}" stroke-width="4"/></g>`;
const wrap = (name,height,body,description,width=960) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc"><title id="title">${name}</title><desc id="desc">${description}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1L9 5L0 9" fill="none" stroke="#91a49b" stroke-width="1.5"/></marker></defs><rect width="${width}" height="${height}" rx="12" fill="#f6f7ef"/><g font-family="Arial, Helvetica, sans-serif">${body}</g></svg>\n`;
const rail = (title,steps,icons,notes) => wrap(title,320,
  label(30,35,'METHOD SCHEMATIC',12,'#61786b','start') + steps.map((s,i)=>{
    const x=120+i*240;
    return (i<3?arrow(x+65,139,x+172,139):'')+icons[i](x,139)+label(x,232,s,19)+label(x,264,notes[i],14,'#61786b');
  }).join(''), title+'; arrows describe the method, not experimental results.');
const sequences = {
  cloning: ['Plasmid construction workflow', ['Vector &amp; insert','DNA purification','Recombination','Clone verification'], [fragments,gel,circleDNA,magnify], ['PCR amplification','Gel electrophoresis / extraction','Homology-based assembly','Colony PCR &amp; sequencing']],
  transformation: ['Osmotic shock transformation', ['Culture','Precondition','Osmotic shock','Recover &amp; screen'], [flask,tube,cell,flask], ['1.5 M NaCl','1 M NaCl · 8 h','0.1 M NaCl + plasmid DNA','48 h recovery']],
  'dna-extraction': ['Genomic DNA extraction', ['Algal pellet','Lysis &amp; clarification','Bind &amp; wash','Elute DNA'], [cell,tube,column,helix], ['Sample preparation','Transfer the aqueous phase','Spin-column purification','Concentration &amp; purity check']],
  chromatography: ['Product separation', ['Crude pigment extract','Silica column','Collect fractions','Concentrate &amp; store'], [flask,column,(x,y)=>tube(x-25,y,amber)+tube(x+32,y,teal),flask], ['Pretreat &amp; filter','Load / gradient elution','Separate collection','Prepare for HPLC analysis']],
};
const images = {};
for (const [name, args] of Object.entries(sequences)) {
  images[`${name}.svg`] = rail(...args);
  const [title, steps, icons, notes] = args;
  images[`${name}-mobile.svg`] = wrap(title,770,
    label(26,34,'METHOD SCHEMATIC',15,'#61786b','start') + steps.map((step,i)=>{
      const y=145+i*175;
      return icons[i](90,y)+label(175,y-5,step,21,ink,'start')+label(175,y+26,notes[i],16,'#61786b','start')+(i<3?arrow(90,y+89,90,y+111):'');
    }).join(''),title+'; method schematic.',520);
}
images['qpcr.svg'] = wrap('Genomic DNA qPCR assay',430,
  label(30,35,'ASSAY DESIGN &amp; THERMAL PROGRAM',12,'#61786b','start')+
  `<path d="M330 65V395" stroke="#d6dfd4"/>`+
  helix(72,142)+arrow(116,142,165,142)+tube(225,142)+
  label(72,218,'Genomic DNA',17)+label(225,218,'qPCR',17)+
  label(30,278,'Wild type / transgenic lines',16,ink,'start')+
  label(30,306,'No-template control',16,ink,'start')+
  label(30,350,'3 biological replicates',14,'#61786b','start')+
  label(30,374,'3 technical replicates',14,'#61786b','start')+
  label(372,82,'AMPLIFICATION',14,teal,'start')+
  `<path d="M390 155H505V225H710" fill="none" stroke="${teal}" stroke-width="4"/>`+
  label(445,127,'95°C',24)+label(445,185,'10 s',15)+label(607,202,'58–60°C',24)+label(607,254,'20 s',15)+
  `<path d="M705 271v24H391v-58" fill="none" stroke="#91a49b" stroke-width="2" marker-end="url(#arrow)"/>`+
  label(551,320,'40 cycles',17)+
  label(800,83,'MELT CURVE',14,green,'start')+
  `<path d="M800 225L905 145" fill="none" stroke="${green}" stroke-width="4"/>`+
  label(800,254,'65°C',16)+label(905,128,'95°C',16)+label(851,295,'Slow ramp',15,'#61786b')+
  label(372,371,'Initial denaturation: 95°C for 3 min',16,ink,'start')+
  label(372,399,'Readouts: Ct values, amplification &amp; melt curves',15,'#61786b','start'),
  'Assay schematic and programmed temperatures from the supplied qPCR protocol, not measured amplification or melt curves.');
images['experimental-workflow.svg'] = wrap('Wet-lab experimental workflow',520,
  label(32,40,'FROM PLASMID CONSTRUCTION TO CHARACTERISATION',14,'#61786b','start')+
  circleDNA(112,190)+label(112,270,'Molecular cloning',20)+label(112,300,'Assembled plasmids',15,'#61786b')+
  arrow(174,190,285,190)+cell(350,190)+label(350,270,'Transformation',20)+label(350,300,'D. salina cultures',15,'#61786b')+
  `<path d="M411 190H470V125H520" fill="none" stroke="#91a49b" stroke-width="2.5" marker-end="url(#arrow)"/><path d="M470 190V380H520" fill="none" stroke="#91a49b" stroke-width="2.5" marker-end="url(#arrow)"/>`+
  label(540,76,'GENETIC CHARACTERISATION',13,teal,'start')+
  helix(586,140)+label(586,223,'Genomic DNA',18)+label(586,247,'Extraction &amp; purity',14,'#61786b')+
  arrow(642,140,750,140)+tube(815,140)+label(815,223,'qPCR',18)+label(815,247,'Target-gene copy number',14,'#61786b')+
  label(540,322,'PRODUCT SEPARATION',13,amber,'start')+
  flask(586,385,amber)+label(586,465,'Pigment extraction',18)+
  arrow(642,385,750,385)+column(815,385)+label(815,490,'Chromatographic separation',18),
  'Molecular cloning supplies plasmids for D. salina transformation. The methods then cover genetic characterisation through genomic DNA extraction and qPCR, and product separation through pigment extraction and chromatography.');
images['experimental-workflow-mobile.svg'] = wrap('Wet-lab workflow',890,
  circleDNA(260,80)+label(260,145,'Molecular cloning',24)+arrow(260,165,260,208)+
  cell(260,310)+label(260,385,'Algal transformation',24)+
  `<path d="M260 405V445H130V490" fill="none" stroke="#91a49b" stroke-width="2.5" marker-end="url(#arrow)"/><path d="M260 445H390V490" fill="none" stroke="#91a49b" stroke-width="2.5" marker-end="url(#arrow)"/>`+
  helix(130,560)+flask(390,560,amber)+label(130,635,'Genomic DNA',21)+label(390,635,'Pigment extract',21)+
  arrow(130,655,130,700)+arrow(390,655,390,700)+tube(130,770)+column(390,770)+
  label(130,865,'qPCR',23)+label(390,865,'Chromatography',21),
  'Build and transform, then characterise genomic DNA or separate pigment extracts.',520);
images['qpcr-mobile.svg'] = wrap('Genomic DNA qPCR assay',700,
  label(28,38,'ASSAY DESIGN',17,teal,'start')+helix(130,130)+arrow(190,130,325,130)+tube(390,130)+
  label(130,210,'Genomic DNA',23)+label(390,210,'qPCR',23)+
  label(28,267,'Wild type / transgenic lines',20,ink,'start')+label(28,300,'No-template control',20,ink,'start')+
  label(28,340,'3 biological + 3 technical replicates',19,'#61786b','start')+
  `<path d="M28 375H492" stroke="#d6dfd4"/>`+
  label(28,414,'THERMAL PROGRAM',17,teal,'start')+
  label(28,457,'Initial denaturation: 95°C · 3 min',21,ink,'start')+
  `<path d="M66 525H238V570H450" stroke="${teal}" stroke-width="4" fill="none"/>`+
  label(145,504,'95°C · 10 s',22)+label(345,550,'58–60°C · 20 s',22)+
  label(260,613,'40 cycles',22)+label(28,663,'Melt curve: 65°C → 95°C, slow ramp',20,ink,'start'),
  'Protocol schematic: sample groups and programmed temperatures, not measured amplification curves.',520);
console.log('*** Begin Patch');
for(const [name,svg] of Object.entries(images)) {
  const file=fileURLToPath(new URL(name,dir));
  if(fs.existsSync(file)) {
    console.log('*** Update File: '+file+'\n@@\n'+fs.readFileSync(file,'utf8').trimEnd().split('\n').map(l=>'-'+l).join('\n')+'\n'+svg.trimEnd().split('\n').map(l=>'+'+l).join('\n'));
  } else console.log('*** Add File: '+file+'\n'+svg.trimEnd().split('\n').map(l=>'+'+l).join('\n'));
}
console.log('*** End Patch');
