// Double Take! — a spot-the-difference game for make.fun's
// best-spot-the-difference-game-20261121-0451 bounty.
//
// The game is plain static files under game/ (game/index.html and its
// ES modules, no library, no network request at run time) and this
// program hands it in: it copies game/ and screenshots/ from beside
// this file to /output and writes /output/dossier.json with the
// vendored make.fun library, exactly as the kit's starter does.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.
// Serve the game itself with `node serve.ts` (http://localhost:8080).

import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

// The scorer's own caps (see the kit's RULES.txt): text_max_bytes is
// the only one that shapes the dossier's bytes; the rest refuse an
// entry the scorer would refuse — more than 4 screenshots or one over
// 256 KiB, more than 993 files in game/ or 48 MiB of game files in all,
// or a path under game/ over 1000 bytes.
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
console.log(`wrote ${dossierPath} (${statSync(dossierPath).size} bytes)`);
