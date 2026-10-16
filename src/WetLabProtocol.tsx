import { useEffect, useState } from 'react';
import type { ContentBlock } from './content/types';
import './wet-lab.css';

const visuals: Record<string, { alt: string; caption: string }> = {
  cloning: { alt: 'Method schematic of vector and insert preparation, DNA purification, recombination and clone verification.', caption: 'Plasmid construction connects PCR, gel purification, homologous recombination and clone verification. The diagram shows the workflow; the individual methods are below.' },
  transformation: { alt: 'Osmotic transformation schematic showing culture, preconditioning, osmotic shock and recovery.', caption: 'The supplied transformation protocol moves from culture and salt preconditioning to osmotic shock, recovery and screening.' },
  'dna-extraction': { alt: 'Method schematic showing algal sample preparation, lysis, column purification and genomic DNA elution.', caption: 'Genomic DNA is recovered from the algal pellet, purified on a spin column, and checked for concentration and purity before downstream analysis.' },
  qpcr: { alt: 'qPCR assay design using genomic DNA and the programmed amplification temperatures; this is not a measured amplification curve.', caption: 'The assay uses genomic DNA. This schematic shows the sample groups and thermal program specified in the protocol; amplification and melt curves are collected during the run.' },
  chromatography: { alt: 'Method schematic showing crude pigment extract, silica column separation, fraction collection and storage.', caption: 'Product separation starts with the crude pigment extract. Column fractions are collected separately, concentrated and stored for subsequent HPLC analysis.' },
};

function MethodFigure({ name, alt, caption }: { name: string; alt: string; caption: string }) {
  const base = `${import.meta.env.BASE_URL}figures/wet-lab/${name}`;
  const height = name === 'experimental-workflow' ? 520 : name === 'qpcr' ? 430 : 320;
  const mobileHeight = name === 'experimental-workflow' ? 890 : name === 'qpcr' ? 700 : 770;
  return <figure className="method-figure">
    <a href={`${base}.svg`} target="_blank" rel="noreferrer" aria-label={`Open full-size schematic: ${alt}`}>
      <picture><source media="(max-width: 600px)" srcSet={`${base}-mobile.svg`} width={520} height={mobileHeight} /><img src={`${base}.svg`} width={960} height={height} alt={alt} loading="lazy" decoding="async" /></picture>
    </a>
    <figcaption><span>Method schematic</span>{caption}</figcaption>
  </figure>;
}

export function WetLabOverview() {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const sync = () => {
      const panels = Array.from(document.querySelectorAll<HTMLDetailsElement>('.method-protocol'));
      setExpanded(panels.length > 0 && panels.every(panel => panel.open));
    };
    document.addEventListener('toggle', sync, true);
    return () => document.removeEventListener('toggle', sync, true);
  }, []);
  const toggleProtocols = () => {
    const next = !expanded;
    document.querySelectorAll<HTMLDetailsElement>('.method-protocol').forEach(panel => { panel.open = next; });
    setExpanded(next);
  };
  return <div className="wet-lab-overview">
    <p className="method-lead">Plasmid construction and algal transformation lead into two strands of experimental work: genetic characterisation and product separation.</p>
    <MethodFigure name="experimental-workflow" alt="Experimental workflow from plasmid construction to algal transformation, branching into genomic DNA characterisation and pigment separation."
      caption="The methods are arranged by their role in the experiment. Genetic characterisation and product separation are shown as separate branches." />
    <div className="method-reading-tools"><p>Explore the workflow, then open each protocol for the full procedure, reaction mixtures and conditions.</p><button type="button" onClick={toggleProtocols}>{expanded ? 'Collapse all protocols' : 'Expand all protocols'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></button></div>
  </div>;
}

export function WetLabMethod({ block }: { block: Extract<ContentBlock, { kind: 'wet-lab-method' }> }) {
  const visual = visuals[block.id];
  useEffect(() => {
    const target = block.headings.find(heading => window.location.hash === `#${heading.id}`);
    const panel = target && document.getElementById(target.id)?.closest<HTMLDetailsElement>('details');
    if (panel) panel.open = true;
  }, [block.headings]);
  return <div className="wet-lab-method" data-method={block.id}>
    <div className="method-introduction" dangerouslySetInnerHTML={{ __html: block.introHtml }} />
    <MethodFigure name={block.id} {...visual} />
    <details className="method-protocol">
      <summary><div><span className="method-protocol-label">Full protocol</span><strong>{block.protocolTitle}</strong></div><span className="method-toggle" aria-hidden="true" /></summary>
      <div className="method-protocol-body">
        <nav className="method-index" aria-label={`${block.protocolTitle} sections`}>{block.headings.map(heading => <a href={`#${heading.id}`} key={heading.id}>{heading.title}</a>)}</nav>
        <div className="wet-lab-protocol" dangerouslySetInnerHTML={{ __html: block.html }} />
      </div>
    </details>
  </div>;
}
