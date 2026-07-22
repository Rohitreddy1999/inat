# Meditation Figure

The meditation figure is a Three.js WebGL scene rendered inside a `react-native-webview` on the Home screen. It is not a 2D canvas — all drawing is done via GLSL shaders with additive blending.

## Source files

- **Runtime**: `assets/webview/meditationFigureHtml.ts` — TypeScript template literal, injected into WebView via `getMeditationFigureHtml(config)`
- **Reference**: `assets/webview/Meditation Figure.html` — standalone Graduation-mode browser preview generated from the same scene source. Run `npm run sync:meditation-figure` after every scene change.

## Scene modes

- `home`: preserves the current phase-colored figure, framing, density, and slow rotation.
- `graduation`: enables figure-originating transcend particles, compact-phone framing, coordinated Iris → Volt → Plasma interpolation, and the native handoff camera state.

Both modes accept `reducedMotion`. Graduation reduced motion renders the fully illuminated figure immediately, keeps particles nearly static, disables camera rotation, and skips the timed opening build. The scene listens for native `pause`, `resume`, and `handoff` messages so inactive WebViews do not keep rendering and Act 2 can pull the camera back without replacing the scene.

## Phase colors

| Phase | Days | Color | irisBoost |
|---|---|---|---|
| Foundation | 1–7 | `#8B5CF6` Iris | 1.35 |
| Build | 8–14 | `#62EE10` Volt | 1.0 |
| Commit | 15–21 | `#FF4FD8` Plasma | 1.0 |

## Camera

| Parameter | Value |
|---|---|
| FOV | 45° |
| Position | `(0, 1.2, 3.7)` |
| Target | `(0, 1.05, 0)` — mid-torso of offset figure |
| Figure Y offset | `figure.position.y = 0.25` |

Graduation starts slightly closer with the figure centered in the usable visual field. During the handoff, the camera eases back and the figure settles toward the upper third while particle intensity drops. Home camera values remain unchanged.

## Graduation energy cycle

The opening completes a legible Iris → Volt → Plasma progression in about 3.2 seconds, then continues as a slower closed loop back through Iris. Over roughly 2.8 seconds, the figure materializes from near-zero scale using a slow-in/slow-out approach while the camera travels in from deep space. The release peaks around three seconds, after the figure is recognizable. Figure filaments, anchor joints, and aura share the interpolated phase color; high-luminosity transcend particles simultaneously carry Iris, Volt, and Plasma so the release visibly represents the entire earned circuit. Arc-Light is limited to particle cores and star-field peak luminosity.

Graduation particles do not begin distributed around the scene. Their first lifecycle is staggered from the source points on the joints, limbs, spine, and crown after the figure begins materializing. They orbit, rise, and disperse before transitioning into the slower steady loop.

## Skeleton structure

The runtime uses 18 named lotus-pose anchors and 18 primary connections. Dense tube strands, scatter points, and short joint tufts turn this compact rig into the recognizable filament figure.

### Joint coordinates (x, y, z)

| Name | Coordinates |
|---|---|
| hips | `(0, .78, 0)` |
| spine1 | `(0, .96, .02)` |
| spine2 | `(0, 1.12, .03)` |
| chest | `(0, 1.26, .02)` |
| neck | `(0, 1.36, .01)` |
| head | `(0, 1.52, 0)` |
| shL / shR | `(-.22 / .22, 1.28, .01)` |
| elL / elR | `(-.31 / .31, 1.04, .09)` |
| haL / haR | `(-.33 / .33, .86, .24)` |
| knL / knR | `(-.42 / .42, .80, .18)` |
| ftL / ftR | `(-.16 / .16, .62 / .60, .34 / .36)` |

Primary connections form the spine, shoulders and arms, hip-to-knee legs, crossed lower legs, the foot bridge, and hand-to-knee meditation-pose braces.

## Rendering layers

1. **Primary lines** (`figFilBase`) — always visible, `uPrimary=1`, brightness `primBright`
2. **Secondary lines** (`figFilSec`) — energy-dependent visibility via `aRank`, brightness `bright`
3. **Scatter points** (`figPts`) — secondary cloud along bones
4. **Anchor nodes** (`figAnchors`) — joint positions, `uPrimary=1`; chakra indices 0–6 are `aSize 12–14` and `aRank 0.0`

## Disabled for Home screen

- `scene.add(water)` — commented out
- `scene.add(reflection)` — commented out
- `reflection.scale.set(...)` — commented out in animation loop
- `reflection.rotation.y` — commented out in animation loop
