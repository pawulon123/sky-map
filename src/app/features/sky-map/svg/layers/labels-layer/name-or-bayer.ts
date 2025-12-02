import { Star } from '../../../domain/models/star.model';
import { StarsLabelsSettings } from '../../../domain/models/stars-layer-settings.model';

const GREEK: Record<string, string> = {
  alpha: 'α',
  alf: 'α',
  a: 'α',
  beta: 'β',
  bet: 'β',
  b: 'β',
  gamma: 'γ',
  gam: 'γ',
  g: 'γ',
  delta: 'δ',
  del: 'δ',
  d: 'δ',
  epsilon: 'ε',
  eps: 'ε',
  e: 'ε',
  zeta: 'ζ',
  zet: 'ζ',
  z: 'ζ',
  eta: 'η',
  et: 'η',
  h: 'η',
  theta: 'θ',
  the: 'θ',
  th: 'θ',
  iota: 'ι',
  iot: 'ι',
  i: 'ι',
  kappa: 'κ',
  kap: 'κ',
  k: 'κ',
  lambda: 'λ',
  lam: 'λ',
  l: 'λ',
  mu: 'μ',
  m: 'μ',
  nu: 'ν',
  n: 'ν',
  xi: 'ξ',
  x: 'ξ',
  omicron: 'ο',
  omi: 'ο',
  o: 'ο',
  pi: 'π',
  p: 'π',
  rho: 'ρ',
  r: 'ρ',
  sigma: 'σ',
  sig: 'σ',
  s: 'σ',
  tau: 'τ',
  t: 'τ',
  upsilon: 'υ',
  ups: 'υ',
  u: 'υ',
  phi: 'φ',
  fi: 'φ',
  ph: 'φ',
  chi: 'χ',
  ch: 'χ',
  psi: 'ψ',
  ps: 'ψ',
  omega: 'ω',
  omg: 'ω',
  w: 'ω',
};

const superscript = (n: string) =>
  n
    .split('')
    .map(
      (c) =>
        ({
          '0': '⁰',
          '1': '¹',
          '2': '²',
          '3': '³',
          '4': '⁴',
          '5': '⁵',
          '6': '⁶',
          '7': '⁷',
          '8': '⁸',
          '9': '⁹',
          '-': '⁻',
        })[c] ?? c
    )
    .join('');

export function toGreekBayer(bayer: string): string {
  const parts = bayer.trim().split(/\s+/);
  if (parts.length === 0) return bayer;

  const head = parts[0];
  const rest = parts.slice(1);

  const match = head.match(/^([a-zA-Z]+)([-]?\d+)?$/);
  if (!match) return bayer;

  const [, latin, index] = match;
  const greek = GREEK[latin.toLowerCase()];
  if (!greek) return bayer;

  const greekWithIndex = index ? greek + superscript(index.replace('-', '')) : greek;

  return rest.length > 0 ? `${greekWithIndex} ${rest.join(' ')}` : greekWithIndex;
}

// export type LabelLineFn = (star: Star, settings: StarsLabelsSettings) => string | null | undefined;
export type LabelLineFn = (star: Star, settings: StarsLabelsSettings) => string | null | undefined;

export const buildLabelLines =
  (...fns: LabelLineFn[]) =>
  (getSettings: Function) =>
  (star: Star): string[] =>
    fns.reduce<string[]>((acc, fn) => {
      const setingsLabel = getSettings();
      const line = fn(star, setingsLabel);
      if (line && line.trim().length > 0) {
        acc.push(line);
      }
      return acc;
    }, []);

// 1. Pierwsza linia: nazwa + ewentualnie Bayer w nawiasie
export const firstLine: LabelLineFn = (star, settings) => {
  const rawName = (star as any).name;
  const rawBayer = (star as any).bayer;

  const name = rawName != null ? String(rawName).trim() : '';
  const bayerLatin = rawBayer != null ? String(rawBayer).trim() : '';

  const hasName = name.length > 0;
  const hasBayer = bayerLatin.length > 0;
  const showBayer = settings.showBayer;

  if (!hasName && (!showBayer || !hasBayer)) {
    return null;
  }

  const bayerGreek = hasBayer ? toGreekBayer(bayerLatin) : '';

  if (hasName) {
    if (showBayer && hasBayer) {
      return `${name} (${bayerGreek})`;
    }
    return name;
  }

  if (showBayer && hasBayer) {
    return bayerGreek;
  }

  return null;
};
