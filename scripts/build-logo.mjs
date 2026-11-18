// Génère assets/logo/logo.svg — monogramme DT en pixels + connecteurs.
// Usage : node scripts/build-logo.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'assets', 'logo');
mkdirSync(out, { recursive: true });

const CELL = 10;          // taille d'un pixel
const GAP = 2;            // espacement entre pixels
const STEP = CELL + GAP;  // pas de grille
const GREEN = '#6AB04C';
const BLUE = '#1E4DA1';
const NIGHT = '#12275c';  // bleu nuit dérivé

// Grilles 5x7 : D = vert, T = bleu
const D = [
  '11110',
  '10001',
  '10001',
  '10001',
  '10001',
  '10001',
  '11110',
];
const T = [
  '11111',
  '00100',
  '00100',
  '00100',
  '00100',
  '00100',
  '00100',
];

// Pixels connecteurs : positions relatives (col, ligne) autour du monogramme.
// Couleurs alternées vert/bleu nuit, volontairement discrets.
const connectors = [
  [-4, -2, NIGHT], [-3, -4, GREEN], [-1, -5, BLUE], [0, -6, NIGHT],
  [1, -6, GREEN], [3, -5, BLUE], [5, -4, NIGHT], [6, -3, GREEN],
  [7, -1, BLUE], [8, 0, NIGHT], [8, 2, GREEN], [7, 4, BLUE],
  [-5, 3, GREEN], [-6, 1, BLUE], [-7, -1, NIGHT], [-8, -3, GREEN],
  [2, 8, NIGHT], [4, 9, BLUE], [6, 8, GREEN], [-2, 9, BLUE],
];

// Zone lettres : D à x=ox, T décalé à droite avec 1 colonne de vide
const ox = 8, oy = 8;
const tx = ox + 6 * STEP;

// viewBox englobante : lettres + connecteurs + marge de 8
const minX = Math.min(-88, ox) - 8;
const minY = Math.min(-64, oy) - 8;
const maxX = Math.max(tx + 4 * STEP + CELL, 128) + 8;
const maxY = Math.max(oy + 6 * STEP + CELL, 116 + CELL) + 8;
const W = maxX - minX;
const H = maxY - minY;
const VB = `${minX} ${minY} ${W} ${H}`;

const parts = [];
parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" width="${W}" height="${H}" role="img" aria-label="DIGITALIS TOGO">`);
parts.push(`<g class="logo-connectors">`);

function rect(x, y, color, cls) {
  return `<rect class="${cls}" x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="1" fill="${color}"/>`;
}

// rendu lettres pixel
D.forEach((row, r) => {
  for (let c = 0; c < 5; c++) {
    if (row[c] === '1') parts.push(rect(ox + c * STEP, oy + r * STEP, GREEN, 'logo-px logo-px--d'));
  }
});
T.forEach((row, r) => {
  for (let c = 0; c < 5; c++) {
    if (row[c] === '1') parts.push(rect(tx + c * STEP, oy + r * STEP, BLUE, 'logo-px logo-px--t'));
  }
});
parts.push('</g>');

// connecteurs autour du monogramme (coordonnées grille relatives à ox,oy)
for (const [cx, cy, color] of connectors) {
  parts.push(rect(ox + cx * STEP, oy + cy * STEP, color, 'logo-px logo-px--link'));
}

parts.push('</svg>');

writeFileSync(join(out, 'logo.svg'), parts.join('\n') + '\n');
console.log('logo.svg généré :', W, 'x', H);
