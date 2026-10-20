import type { WikiPage } from '../site-data';
import { refs } from './references';
import type { ContentBlock } from './types';

const p = (text: string): ContentBlock => ({ kind: 'paragraph', text });
const eq = (label: string, text: string): ContentBlock => ({ kind: 'equation', label, text });
const table = (caption: string, columns: string[], rows: string[][], collapsed = false): ContentBlock => ({ kind: 'table', caption, columns, rows, collapsed });
const math = String.raw;

export const safety: WikiPage = {
  title: 'Salt-responsive containment',
  eyebrow: 'Safety & Security',
  status: 'team-draft',
  intro: 'This page records the rationale, assumptions and model structure behind the salt-responsive containment concept. It explains why salinity was chosen as a signal, how the circuit is intended to respond and which parameters most shape the design space.',
  references: [refs.chen2009, refs.dca1, refs.mazf, refs.farhat2011, refs.gomez2005],
  sections: [
    { title: 'Why use salinity?', body: '', blocks: [
      p('DunaTerp is designed around a salt-adapted microalga. A fall in salinity offers a possible signal that cells have left their intended cultivation environment. However, Dunaliella can tolerate a broad range of salinities, so low salt cannot be treated as a reliable means of inactivation on its own. The range also varies with the organism and its acclimation history [1].'),
      p('Our containment concept uses salinity to regulate an effector response. We examine both growth inhibition and an assumed lethal effect, because stopping growth and reducing the number of viable cells lead to different outcomes.'),
      { kind: 'safety-overview' },
      p('The current work establishes a design and a computational assessment. Physical containment, waste treatment and incident procedures remain necessary parts of the project; this model does not establish that a biological safeguard can replace them.'),
    ] },
    { title: 'From salt sensing to a cellular response', body: '', blocks: [
      p('DCA1 provides a starting point for salt-responsive regulation. Li et al. observed increased DCA1 expression between 0.5 and 2 M NaCl, followed by a decrease at 3 M. This supports salt-dependent control, with a response that is more complex than a simple high-salt on/off switch [2].'),
      p('The proposed design combines salt-responsive suppression of MazF with MazE-mediated antagonism. Its intended behavior is low effective toxicity during cultivation and increased activity after a fall in salinity. Host expression, RNA-mediated suppression and the balance between MazF and MazE remain unresolved at this stage.'),
      p('MazF cleaves RNA and inhibits translation in the systems studied by Zhang et al. Their eukaryotic evidence comes from a cell-free translation system, rather than living Dunaliella cells [3]. We therefore keep growth inhibition and conditional killing as separate model cases.'),
      p('To assess the overall design without assigning unmeasured rates to every molecular step, the model uses one effective activity variable, x. It summarizes circuit behavior; it is not a measured MazF concentration.'),
    ] },
    { title: 'Parameter choices and their sources', body: '', blocks: [
      p('We use literature to set the biological context and choose plausible scenarios. Where the available studies do not constrain a parameter, we state the assumption and examine its consequences.'),
      table('Evidence used to choose the model inputs', ['Input', 'Choice and rationale', 'Scope of the evidence'], [
        ['Cultivation salinity', '1.50 M NaCl. Farhat et al. found favorable growth at 1.5–3.0 M in their isolate [4].', 'Supports a cultivation scenario; not a universal optimum.'],
        ['Growth-rate amplitude', '0.28 d⁻¹ baseline; 0.14–0.83 d⁻¹ explored using the range in Gómez & González [5].', 'Cross-strain and cross-condition comparison; divisions/day converted to an hourly growth rate.'],
        ['Salt-responsive regulation', 'DCA1 salt regulation motivates the sensing concept [2].', 'Does not establish the full low-salt response curve.'],
        ['Effector mechanism', 'MazF-mediated translation inhibition motivates the effector concept [3].', 'Does not supply a mortality rate in Dunaliella.'],
        ['Circuit kinetics and environment', 'Effective response, delay and salt relaxation are explicit design assumptions.', 'Used to explore requirements and failure cases.'],
      ]),
      eq('Convert division rate to growth rate', String.raw`\mu_{\mathrm{d}}=\ln(2)\,k_{\mathrm{div}},\qquad \mu_{\mathrm{h}}=\frac{\mu_{\mathrm{d}}}{24}`),
      table('Full baseline parameter set', ['Parameter', 'Value', 'Role / source'], [
        [math`$S_{\mathrm{prod}}/S_{\mathrm{env}}$`, '1.50 / 0.05 M', 'Cultivation scenario / low-salt stress scenario'],
        [math`$k_{\mathrm{mix}}$`, '1 h⁻¹', 'Assumed salt relaxation rate'],
        [math`$\mu_{\max}$`, '0.28 d⁻¹', 'Historical scenario amplitude; not a strain-specific fit'],
        [math`$S_{\mathrm{opt}}/\sigma$`, '1.75 / 0.75 M', 'Assumed shape of the salinity–growth curve'],
        [math`$K_S/q/L$`, '0.27 M / 3 / 0', 'Assumed half-response scale, Hill slope and leak'],
        [math`$\beta/\delta$`, '1 / 0.20 h⁻¹', 'Effective activity generation / relaxation'],
        [math`$d_{\max}/m$`, '0.50 h⁻¹ / 2', 'Conditional mortality rate and response exponent'],
        [math`$K_n/n_0/x_0$`, '1 / 0.5 / 0', 'Normalized carrying capacity, initial concentration and activity'],
        ['D', '0 or 1 h⁻¹', 'Cell retention or ideal water exchange'],
      ], true),
    ] },
    { title: 'Model formulation', body: '', blocks: [
      p('Salinity S relaxes toward the receiving-environment value. A decreasing Hill function represents the intended effective circuit response. Concentration is normalized to a reference value; because that reference is unspecified, the model does not convert the normalized state into an absolute number of surviving cells.'),
      eq('Normalized concentration', 'n=\\frac{C}{C_{\\mathrm{ref}}}'),
      eq('Salinity and effective circuit activity', String.raw`S(t)=S_{\rm env}+(S_{\rm prod}-S_{\rm env})e^{-k_{\rm mix}t}\qquad A(S)=L+\frac{1-L}{1+(S/K_S)^q}`),
      eq('Activity and concentration dynamics', String.raw`\frac{dx}{dt}=\beta A(S)-\delta x\qquad\frac{dn}{dt}=\left[\mu_{\rm eff}(S,x)\left(1-\frac{n}{K_n}\right)-d_{\rm eff}(x)-D\right]n`),
      eq('Growth and conditional mortality functions', String.raw`\mu(S)=\mu_{\max}e^{-\frac{(S-S_{\rm opt})^2}{2\sigma^2}}\qquad d(x)=d_{\max}\frac{x^m}{1+x^m}`),
      table('Three alternative biological responses', ['Case', 'Effective growth', 'Extra mortality'], [
        ['No effective switch', 'μ(S)', '0'], ['Growth inhibition only', 'μ(S)/(1 + xᵐ)', '0'], ['Conditional killing', 'μ(S)', 'd(x)'],
      ]),
      p('Time is measured in hours; the daily growth-rate input is divided by 24 before integration. The notebook solves concentration in logarithmic form and tracks accumulated growth G, mortality H and washout W separately. Additional checks compare the salinity and pure-washout solutions with their analytic expressions and examine numerical tolerance.'),
      eq('Log-concentration balance', '\\ln\\!\\left(\\frac{n}{n_0}\\right)=G-H-W'),
      p('Together, these checks test computational consistency within the stated model.'),
    ] },
    { title: 'Implications for the project', body: '', blocks: [
      p('The model identifies three priorities for evaluation: how quickly the full circuit responds to a fall in salinity, whether the response causes recoverable growth arrest or loss of viability, and whether residual activity affects cultivation. These questions matter more to the present design than refining a single predicted clearance time.'),
      p('A practical assessment must also account for weakly responding cells, genetic failure and recovery after conditions change. The present average-cell model does not estimate those outcomes or extinction probability. Its strongest use is to identify the conditions a safeguard would have to meet and the observations that would most change our design decisions.'),
      p('Biological containment is only one layer of risk control. Construct verification, strain-specific response measurements, laboratory controls, closed-reactor operation, waste treatment and incident procedures remain necessary alongside the proposed circuit.'),
    ] },
  ],
};
