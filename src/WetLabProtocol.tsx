import type { ContentBlock } from './content/types';
import './wet-lab.css';
import { assetUrl } from './asset-url';

const visuals: Record<string, { alt: string; caption: string }> = {
  qpcr: { alt: 'qPCR assay design using genomic DNA and the programmed amplification temperatures; this is not a measured amplification curve.', caption: 'Fig. 2 qPCR assay design' },
};

function MethodFigure({ name, alt, caption }: { name: string; alt: string; caption: string }) {
  const base = `figures/wet-lab/${name}`;
  const height = name === 'experimental-workflow' ? 520 : name === 'qpcr' ? 430 : 320;
  const mobileHeight = name === 'experimental-workflow' ? 890 : name === 'qpcr' ? 700 : 770;
  return <figure className="method-figure">
    <picture><source media="(max-width: 600px)" srcSet={assetUrl(`${base}-mobile.svg`)} width={520} height={mobileHeight} /><img src={assetUrl(`${base}.svg`)} width={960} height={height} alt={alt} loading="lazy" decoding="async" /></picture>
    <figcaption>{caption}</figcaption>
  </figure>;
}

export function WetLabOverview() {
  return <div className="wet-lab-overview">
    <p className="method-lead">Plasmid construction and algal transformation lead into two strands of experimental work: genetic characterisation and product separation.</p>
    <MethodFigure name="experimental-workflow" alt="Experimental workflow from plasmid construction to algal transformation, branching into genomic DNA characterisation and pigment separation."
      caption="Fig. 1 Experimental workflow" />
  </div>;
}

export function WetLabMethod({ block }: { block: Extract<ContentBlock, { kind: 'wet-lab-method' }> }) {
  const visual = visuals[block.id];
  return <div className="wet-lab-method" data-method={block.id}>
    <div className="method-introduction" dangerouslySetInnerHTML={{ __html: block.introHtml }} />
    {visual && <MethodFigure name={block.id} {...visual} />}
    <div className="method-protocol">
      <h3>{block.protocolTitle}</h3>
      <div className="wet-lab-protocol" dangerouslySetInnerHTML={{ __html: block.html }} />
    </div>
  </div>;
}
