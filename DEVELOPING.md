# Developing Arkeol

*Version 0.3.5 · Arkeol by JP Hakoluoto · GPL-3.0-or-later with an attribution term (see `LICENSE` and `NOTICE`)*

This document is for people who want to read, modify or extend the code. It describes the architecture,
conventions and the usual extension points. It does not explain the story or the game's secrets. Where a file
holds that kind of content, it is marked **(contains spoilers)**.

---

## Quick start

There is no build step, no package manager and no dependencies.

1. Clone or unzip the project.
2. Open `index.html` in a browser, or serve the folder with any static server (for example
   `python3 -m http.server`).
3. Edit a file and reload.

The only external resource is Google Fonts (Silkscreen, Pixelify Sans, VT323). The game works offline with
fallback fonts.

---

## Project layout

```
index.html        Page markup: canvas, HUD, menus and every screen (all hidden by default)
favicon.svg       16×16 pixel-art icon (pickaxe and gem)
css/style.css     All styling. Later rules deliberately override earlier ones in places
js/               Game code, loaded in a fixed order (see below)
LICENSE           GNU GPL v3
NOTICE            Additional attribution term under GPL §7(b)
README.md         Short project description
GUIDE.md          Spoiler-free player's guide
DEVELOPING.md     This document
```

### Script load order

All scripts are **classic scripts** that share one global lexical scope (no modules, no bundler). Order
matters: a file may only use another file's top-level bindings **at load time** if that file was loaded before
it. Calls made later, at runtime, can go in any direction.

| # | File | Responsibility |
| --- | --- | --- |
| 1 | `i18n.js` | `VERSION`, `LANG`, the `STR.en` / `STR.fi` string tables, `t()` |
| 2 | `core.js` | Tile constants and tables, canvas setup and resize, utilities, the persistent `store` |
| 3 | `art.js` | Procedural tile textures (`TEX`, `TEXB`), background tiles, UI icons (`ICON`) |
| 4 | `lore.js` | Collectible texts, photographs and relics, and their drawing routines **(contains spoilers)** |
| 5 | `wardrobe.js` | Clothes, dyes, character looks, the wardrobe screen |
| 6 | `craft.js` | Materials, recipes, harvesting, workbenches, placeable items, the crafting screen |
| 7 | `audio.js` | Web Audio: sound effects (`sfx`), generative music (`Music`, `TRACKS`), ambience |
| 8 | `input.js` | Keyboard, mouse, wheel and touch input → `held` / `hit` action maps |
| 9 | `world.js` | Level generation (`genLevel`), level setup (`buildLevel`), `newGame`, enemy factories |
| 10 | `game.js` | Player, world and enemy updates, combat, items, shops, fishing, NPCs, liquids, sand |
| 11 | `ui.js` | Achievements, menus and panels, archive, shop screen |
| 12 | `render.js` | Drawing: tiles, decorations, entities, player, lighting, minimap, HUD |
| 13 | `foes2.js` | Additional enemy types, plugged in through the `EXTRA_*` tables |
| 14 | `bugs.js` | Ant columns and scorpions (also registered through `EXTRA_*`) |
| 15 | `vents.js` | Steam vents in floors, walls and ceilings (`spawnVents`, `updVents`, `drawVent`); strong ones launch the player (`P.launch`) |
| 16 | `junk.js` | Second trader, wearable weapons, fishing spots, start-of-run setup, iris transitions |
| 17 | `secrets.js` | Interactive hidden content **(contains spoilers)** |
| 18 | `deep.js` | Late-layer content: gem types, keepsakes, campfires, layer themes, depth atmosphere **(contains spoilers)** |
| 19 | `beasts.js` | Era creatures: raptors and a tyrant lizard (dinosaur era, `ERAS` gets `'dino'`), knights, a mammoth and a dragon (medieval era); `spawnEraFoes` |
| 20 | `surface.js` | The world above: seasons, time of day, sun/moon, weather and its sounds |
| 21 | `void.js` | World snapshots for side trips, special weapons, wooden blocks, the main trader's look, the short "horror moments" (`startHorror`, `updHorror`, `drawHorror`), the other side seeping into layers 9+ (`spawnCorruption`, `corA`) and `resetAtmosphere()`, called whenever a layer is built **(contains spoilers)** |
| 22 | `folk.js` | Character voices and typewriter speech (`showTalk`, `shopSay`, `VOICE`), extra dialogue, the tea philosopher, the bakery (`BAKE_ITEMS`), visible fish (`fishes`), the small crafting reminder beside the hotbar (`updCraftTip`); defines the final `talkTo` |
| 23 | `debug.js` | Hidden test hall: press **End** at the tent on the surface. Doors to every layer, biome, era, trader, the dragon and the other side (`buildDebugRoom`, `goLayer`, forced options in `DBG`) |
| 24 | `tent.js` | Inside the camp tent (E at the tent): calm music (`TRACKS.tent`), relic shelf, photo board, wardrobe trunk, a cot, and the layer album (`store.shots`, `store.maxLayer`, `openAlbum`) for jumping to any layer already reached |
| 25 | `people.js` | Generic titles (`NPC_TITLE`, `npcTitle`), the lost soldier, the traveller, the visitor (laser drill and laser pistol), the flower philosopher, nature around each character (`decorateNpc`), deep warnings (`WARN`) and rumours about the bottom |
| 26 | `domains.js` | Open-sky rest layers (`pickDomain`, `buildDomain`, `domainArrive`), the last layer `LAST_LAYER` with its golden hole (`buildBottom`) and the ending (`startEnding`) **(contains spoilers)** |
| 27 | `atmos.js` | Drifting fog, floor mist and dust motes (`drawAtmos`), the sunken desert biome, caravan props, and the present-minded lines everyone speaks (`SAY`) |
| 28 | `tutorial.js` | The field-note tutorial at the start of every run (`TUT` steps, each with a `done()` test; turned off in Settings, key `arkeol-tutorial`) |
| 29 | `pad.js` | Gamepad support (standard mapping) |
| 30 | `main.js` | Language switching, the main loop, menu wiring, settings |

Every file starts with the same GPL header and `'use strict';`. Keep both in new files.

---

## Core concepts

### Coordinates and tiles

- The world is a grid of `MW × MH` tiles (58 × 54). Each tile is `T = 16` world pixels.
- `grid` (a typed array) holds tile ids. Use `idx(x, y)`, `tileAt(x, y)`, `isSolid(x, y)` and `isWater(x, y)`
  instead of indexing directly.
- Tile ids are constants in `core.js` (`AIR`, `DIRT`, `STONE`, `BED`, …). Each id has an entry in three
  parallel arrays:
  - `HP[id]`: how much digging damage breaks it (`Infinity` = unbreakable)
  - `SOL[id]`: 1 if solid
  - `LIQ[id]`: 1 if liquid
- Other per-tile arrays: `dmgA` (accumulated damage), `webA` (spider webs), `seen` (minimap fog), `prot`
  (protected by level generation: no random content is placed there), `skyA` (open sky on the surface).

### Entities

Entities are plain objects with an axis-aligned box `{x, y, w, h}` in world pixels plus `vx`, `vy`.
`move(e)` integrates velocity against the tile grid and sets `e.hitX`, `e.hitY` and `e.onGround`.
`overlap(a, b)` tests two boxes. There are no classes. Each kind of thing lives in its own global array:

| Array | Contents |
| --- | --- |
| `foes` | Enemies (`type` selects the behaviour) |
| `npcs` | Friendly characters (`type` keys into `NPCD`; the baker carries her shop state in `n.shop`) |
| `fishes` | Decorative fish in water pools (`folk.js`) |
| `pickups` | Collectibles (`kind`: `gold`, `gem`, `relic`, `lore`, `mat`, `recipe`, …) |
| `decos` | Decorations and static props (`k` = kind, `tx`, `ty`, `sx`/`sy` = the support direction) |
| `crates`, `pots`, `rocks`, `ropes`, `bombs`, `shots`, `arrows`, `fireballs` | What their names say |
| `parts`, `texts`, `flashes` | Particles, floating text, light flashes |

A decoration is removed automatically when the tile it leans on (`tx + sx`, `ty + sy`) stops being solid.

### Game state

The global `state` string drives everything:

| State | Meaning |
| --- | --- |
| `menu` | Title screen. The camp scene runs behind it |
| `play` | Normal gameplay |
| `trans` | Moving between layers (iris transition) |
| `dead` | Death animation before the recap |
| `over` | Recap / epitaph screen |
| `pause`, `modal`, `shop`, `craft`, `term` | Overlays that freeze the simulation |

The frozen states are listed in `loop()` in `main.js`. If you add an overlay that should pause the world, add
its state there, and handle **Escape** for it in `input.js`.

### Main loop

`main.js` runs a fixed 60 Hz simulation step (`step()`) with an accumulator, and renders once per animation
frame. In `play`, a step calls `updatePlayer()`, `updateWorld()` (which includes enemies, liquids, sand and
particles) and the small update hooks (`updTossed`, `updSecrets`, `updDeep`); `updSurface()` runs in every state so the sky keeps turning on the title screen. `frame` counts steps and is the
clock for all animation.

The loop body is wrapped in `try/catch`. If something throws, the error is logged once to the console and the
game keeps running. **Watch the console while developing**, because a recurring error can otherwise go unnoticed.

### Rendering

`render()` in `render.js` draws in world space with a camera (`cam`) and an integer scale `S`:

1. sky and background, background tiles, decorations
2. ropes, doors, merchants, pickups, enemies, the player
3. foreground tiles
4. lighting: a quarter-resolution canvas filled dark, with radial "holes" for light sources (`hole()`) and
   additive coloured glows
5. screen effects (tints, poison blur) and the HUD

Use the helper `R(x, y, w, h, colour)` for pixel rectangles. Everything is drawn procedurally, and there are
no image files.

### Level generation

`genLevel(lv)` in `world.js` builds a layer in this order:

1. cave noise and cellular automaton
2. materials and biome
3. the drop shaft and the exit door
4. special rooms
5. hazards, liquids and traps
6. enemies, NPCs, food and decorations
7. extra content hooks (`spawnSecrets`, `spawnDeep`, `spawnExtraFoes`)
8. ropes and ladders
9. a final pass that settles loose sand

It uses a seeded RNG `r()` and the helpers `ri(a, b)`, `airFloor(x, y)`, `far(x, y, d)`, `freeRect(...)` and
`protRect(...)`. Use those, not `Math.random()`, for anything that shapes the layout. `buildLevel()` then
resets the per-level arrays, places the player and shows the chapter title.

### Side trips

`snapWorld()` / `restoreWorld()` in `void.js` capture every per-layer global so the player can leave a layer and come back to it unchanged. If you add a new per-layer global, add it to both functions.

### Persistence

Everything persistent lives in the `store` object (`core.js`) and is saved with `save()` under the
`localStorage` key `arkeol-v1`. Other keys are `arkeol-lang` and `arkeol-settings`. Modules that add fields to
`store` (wardrobe, recipes, databases, keepsakes) re-read their own field from storage on load. Follow the
same pattern and always tolerate the field being missing, because old saves must keep working.

A run's own state (money, materials, weapons) lives on the player object `P` and is discarded at the end of
the run.

### Localisation

- UI strings live in `STR.en` and `STR.fi` in `i18n.js`. Look them up with `t(key, ...args)`. A value may be a
  function for strings with parameters or plurals.
- Content defined elsewhere (items, recipes, enemies) uses inline `{en: '…', fi: '…'}` objects, read with
  `tr(obj)`.
- Static markup uses `data-i18n="key"`. `applyLang()` fills it, and also re-renders any open panel.
- **Every new string needs both languages.** Keep the keys in the same order in both tables.

### Audio

- `sfx` is an object of small synthesised sounds. Add new ones with `Object.assign(sfx, {...})`, using
  `tone()` and `noise()`.
- Music is generative. Each entry in `TRACKS` has a tempo and a `step(t, beat, M)` function that schedules
  notes through the instruments on `Music`, such as `pad`, `pluck`, `flute`, `harp` and `guitar`.
- `Music.play(name)` crossfades to another track. The level music is chosen by `levelTrack()`.

---

## Common extension points

### Add an enemy

Enemies are registered in three tables defined in `foes2.js`, so the core loop does not need to change:

```js
function mkGhost(x, y){ return {type:'ghost', x, y, w:10, h:12, vx:0, vy:0, hp:2, hurt:0, dead:false, face:1, anim:0}; }

EXTRA_UPD.ghost  = (f, dx, dy, dist, sees, fcx, fcy) => { /* move, attack */ return 0.3; }; // return = music tension
EXTRA_DRAW.ghost = f => { /* draw with R() / ctx */ };
EXTRA_KILL.ghost = f => { addMoney(50, f.x, f.y); };
```

- `sees` is already line-of-sight checked. `dx`/`dy` point to the **last known** player position (seen, heard or felt), not the live one, and are 0 if the enemy has never noticed the player. Use `rdx`-style real distances only for proximity, never for tracking.
- Use `hurt(n, causeKey, fromX)` or `poisonHit(...)` to damage the player.
- Spawn from `spawnExtraFoes()` (or a function like `spawnBugs()` called right after it) with the generation helpers.
- Add a kill counter to `runKills` (both places), a recap phrase in `STR.*.recap` and a cause-of-death string.

### Add a talking character

- Add an entry to `NPCD` with `names`, bilingual `lines` and a `gift()` for the first conversation, and a voice in `VOICE` (`folk.js`): a base pitch and an oscillator type.
- Draw it in `FOLK_DRAW[type]`; `drawNpc()` uses that before its built-in characters.
- Spawning happens in the dwellers section of `genLevel()` (`want` list).
- Speech goes through `showTalk(name, text, voiceKey)` and shop lines through `shopSay(text)`; both type the text out and babble.

### Melee

Swings call `startMelee(side, reach, dmg, how)`, which keeps a generous box on that side of the player active for a few frames (`updMelee()`). Each enemy is hit once per swing, so timing and aim only need to be roughly right.

### Add a decoration

Push `{tx, ty, k:'mykind', sx, sy}` into `decos` during generation, and add a `case` in `drawDeco()`
(`render.js`) or `drawDeepDeco()`. Light sources are added in the lighting pass with `hole()` and `glows`.

### Add a recipe or material

- Materials are entries in `MATS` (`craft.js`). Each needs an icon `ICON['m_' + id]` in `art.js`.
- Recipes go in `RECIPES`:
  - `need` lists the materials.
  - `make` runs the effect, or set `meal: 1` for food that is stored in the pack.
  - `station: 1` requires a workbench.
  - `start: 1` makes it known from the beginning.
  - `special: 1` keeps it out of the random recipe pool.
- Harvesting drops are defined in `HARVEST`.

### Add a shop item

- Main trader: add an entry to `SHOP_ITEMS` (`ui.js`), with `ok()` (whether it can be bought now), `buy()`,
  `once` and `ic` (icon).
- Second trader: add an entry to `JUNK_ITEMS` (`junk.js`).
- Bakery: add an entry to `BAKE_ITEMS` (`folk.js`). Pastry effects are run-long and stored on the player (`P.bake`, plus modifiers such as `P.digK`, `P.goldK`, `P.poisonK`, `P.fallPlus`).
- The shop screen picks the item list, portrait and speaker from the open shop: `junk`, an object with `kind:'bake'`, or the main trader.
- `makeStock()` decides what the main trader offers on a given layer.

### Add a tile

1. Add a constant in `core.js`.
2. Extend `HP`, `SOL` and `LIQ`.
3. Add a texture to `TEX` in `art.js` (or in a later file, as `void.js` does for `PLANK`), plus `TILECOL` in `game.js` (break particles) and the minimap colour in `drawMini()`.
4. If the tile must never break, also guard it in `breakTile()`.

### Add a music track

Add an entry to `TRACKS` with `bpm`, `step` and `tension` (whether the danger layer may play on top). Then
select it from `levelTrack()` or call `Music.play()`.

### Add an achievement

Add `{id, n:{en,fi}, d:{en,fi}}` to `ACH` (`ui.js`) and call `unlock(id)` where it is earned.

---

## Conventions

- Plain ES2020+ JavaScript. No frameworks and no external code at runtime.
- The code is written in a dense style, so prefer small, local edits. Keep related logic together, and keep
  new systems in their own file with a clear hook into the core.
- Pixel art is drawn in code. Keep shapes on whole pixels with `Math.round` to avoid blur.
- Both languages for every visible string. Neutral, non-futuristic wording.
- Respect `prefers-reduced-motion` for decorative CSS animation.
- Do not mention third-party organisations or real people's private details in content.
- New files: the GPL header, `'use strict';`, and an entry in **both** script lists if you also maintain a
  single-page build.

---

## Testing

For manual testing there is a hidden **debug hall**: start a run, stand at the tent and press **End**. Each door builds a
fresh layer with forced options (`DBG.biome`, `DBG.era`, `DBG.shop`, `DBG.junk`, `DBG.bake`, `DBG.dragon`), so you can
jump straight to the content you are working on. The other side's door returns you to the hall.

There is no automated test suite in the repository. A practical approach that has worked well during
development is a headless browser (for example Playwright with Chromium):

1. Copy `index.html` to a test page and add a small script after `main.js` that exposes internals, for example:

   ```html
   <script>window.__t = { get P(){return P}, enterDoor, get foes(){return foes}, get level(){return level} };</script>
   ```

2. Drive the game:
   - click **New Game**
   - call `__t.enterDoor()` repeatedly to walk through many generated layers
   - spawn or teleport things
   - simulate keys, or stub `navigator.getGamepads` for controller tests

3. Fail on any `pageerror`. Take screenshots of the scenes you changed and look at them.

Before submitting a change:

- Run `node --check` on every file in `js/`.
- Play at least a few layers of each kind.
- Test both languages.
- Test a narrow (phone-sized) viewport.

---

## Contributing and licence

Contributions are welcome. By contributing you agree that your changes are released under the same licence:
GPL-3.0-or-later with the attribution term in `NOTICE`. Forks and derivative works must keep the notices and
visibly credit the original project, for example **"Based on Arkeol by JP Hakoluoto"**.
