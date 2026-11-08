import type { CategorySlug } from '@/types';

export type ArtKind = 'bottle' | 'jar' | 'tube' | 'pump' | 'dropper' | 'bar';

interface ArtOptions {
  kind: ArtKind;
  /** Background gradient start / end. */
  bg: [string, string];
  /** Container colour. */
  body: string;
  /** Label / cap accent colour. */
  accent: string;
}

const leaf = (x: number, y: number, s = 1, rot = 0, fill = '#8CC63F') =>
  `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0C0-30 18-48 46-48 46-18 28 0 0 0Z" fill="${fill}"/><path d="M4-4C16-18 26-28 40-42" stroke="#fff" stroke-opacity=".7" stroke-width="3" stroke-linecap="round" fill="none"/></g>`;

function container({ kind, body, accent }: ArtOptions): string {
  const label = (x: number, y: number, w: number, h: number) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#fff" fill-opacity=".92"/>${leaf(x + w / 2 - 14, y + h / 2 + 14, 0.55)}<rect x="${x + 22}" y="${y + h - 22}" width="${w - 44}" height="5" rx="2.5" fill="${accent}" fill-opacity=".45"/>`;
  switch (kind) {
    case 'bottle':
      return `<rect x="165" y="70" width="70" height="50" rx="10" fill="${accent}"/><rect x="178" y="110" width="44" height="30" fill="${body}"/><rect x="130" y="130" width="140" height="215" rx="38" fill="${body}"/>${label(150, 185, 100, 110)}`;
    case 'pump':
      return `<rect x="188" y="52" width="70" height="16" rx="8" fill="${accent}"/><rect x="190" y="64" width="20" height="46" rx="6" fill="${accent}"/><rect x="172" y="104" width="56" height="26" rx="8" fill="${accent}"/><rect x="132" y="126" width="136" height="222" rx="30" fill="${body}"/>${label(150, 190, 100, 110)}`;
    case 'jar':
      return `<rect x="120" y="140" width="160" height="40" rx="14" fill="${accent}"/><rect x="108" y="172" width="184" height="150" rx="40" fill="${body}"/>${label(138, 205, 124, 82)}`;
    case 'tube':
      return `<path d="M150 90h100l14 232a14 14 0 0 1-14 15H150a14 14 0 0 1-14-15Z" fill="${body}"/><rect x="160" y="326" width="80" height="26" rx="6" fill="${accent}"/><rect x="170" y="56" width="60" height="42" rx="10" fill="${accent}"/>${label(158, 150, 84, 120)}`;
    case 'dropper':
      return `<path d="M185 60a15 15 0 0 1 30 0v48h-30Z" fill="${accent}"/><rect x="172" y="104" width="56" height="28" rx="6" fill="${accent}"/><rect x="146" y="130" width="108" height="206" rx="26" fill="${body}" fill-opacity=".95"/>${label(160, 185, 80, 110)}`;
    case 'bar':
      return `<g transform="rotate(-12 200 220)"><rect x="95" y="150" width="210" height="140" rx="38" fill="${body}"/><rect x="111" y="166" width="178" height="108" rx="28" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="3"/>${leaf(170, 240, 1.1, 0, accent)}</g>`;
  }
}

/** Builds a self-contained SVG data URI used as demo product artwork. */
export function productArt(options: ArtOptions): string {
  const [from, to] = options.bg;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient><filter id="s" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#1B2E24" flood-opacity=".18"/></filter></defs><rect width="400" height="400" fill="url(#g)"/><circle cx="330" cy="70" r="90" fill="#fff" fill-opacity=".35"/><circle cx="50" cy="360" r="110" fill="#fff" fill-opacity=".25"/><ellipse cx="200" cy="352" rx="110" ry="12" fill="#1B2E24" fill-opacity=".08"/><g filter="url(#s)">${container(options)}</g></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const CATEGORY_LABELS: Record<CategorySlug, string> = {
  'skin-care': 'Skin Care',
  'bath-body': 'Bath & Body',
};

