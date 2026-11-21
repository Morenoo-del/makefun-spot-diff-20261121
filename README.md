[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Morenoo-del/makefun-spot-diff-20261121/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Morenoo-del/makefun-spot-diff-20261121/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

# Double Take! — Spot the Difference

A complete spot-the-difference game for the
[make.fun bounty](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451):
two near-identical pictures side by side, click the differences to mark them,
find them all before the clock runs out.

## The game

Three original scenes with rising difficulty, all art drawn procedurally on
canvas (no images, no libraries, no network):

| Scene | Differences | Time limit |
|---|---|---|
| 1. Lighthouse Cove | 5 | 120s |
| 2. Night Market | 7 | 150s |
| 3. Wizard's Study | 10 | 180s |

Click a difference on either panel to mark it (gold ring + checkmark +
particle burst + chime, pitch rising with your combo). Wrong clicks cost
5 seconds; hints (3 per level) pulse a ring around one unfound difference;
clearing a level earns a time bonus. Keyboard: H hint, R restart, N next,
Enter start/next.

## Run

```sh
node serve.ts   # serves game/ at http://localhost:8080
```

Or open `game/index.html` from any static server. The hand-in program
`main.ts` copies `game/` and `screenshots/` to `/output` and writes
`/output/dossier.json`.

## License

MIT — see [LICENSE](LICENSE).
