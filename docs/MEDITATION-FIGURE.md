# Meditation Figure

The meditation figure is a Three.js WebGL scene rendered inside a `react-native-webview` on the Home screen. It is not a 2D canvas — all drawing is done via GLSL shaders with additive blending.

## Source files

- **Runtime**: `assets/webview/meditationFigureHtml.ts` — TypeScript template literal, injected into WebView via `getMeditationFigureHtml(glowColor)`
- **Reference**: `assets/webview/Meditation Figure.html` — standalone HTML file for browser preview. Must be kept in sync with the TS file manually after every change.

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

## Skeleton Structure

Total joints: 27
Total edges: 34
Chakra spine: indices 0–6 (highest intensity — aSize 12–14, aRank forced 0.0)
Shoulders: indices 7–8
Left arm: indices 9–12
Right arm: indices 13–16
Hips: indices 17–18
Left leg: indices 19–22
Right leg: indices 23–26
Crossed feet connection: edge [21,24] and [25,20]

### Joint coordinates (x, y, z)

| Index | Name | x | y | z |
|---|---|---|---|---|
| 0 | Crown | 0 | 1.85 | 0.00 |
| 1 | Third Eye | 0 | 1.72 | 0.05 |
| 2 | Throat | 0 | 1.52 | 0.02 |
| 3 | Heart | 0 | 1.28 | 0.00 |
| 4 | Solar Plexus | 0 | 1.08 | 0.00 |
| 5 | Sacral | 0 | 0.88 | 0.00 |
| 6 | Root | 0 | 0.72 | 0.00 |
| 7 | Left Shoulder | -0.38 | 1.38 | 0.00 |
| 8 | Right Shoulder | 0.38 | 1.38 | 0.00 |
| 9 | Left Elbow | -0.52 | 1.05 | 0.08 |
| 10 | Left Wrist | -0.58 | 0.78 | 0.12 |
| 11 | Left Hand | -0.62 | 0.68 | 0.15 |
| 12 | Left Fingers | -0.58 | 0.65 | 0.18 |
| 13 | Right Elbow | 0.52 | 1.05 | 0.08 |
| 14 | Right Wrist | 0.58 | 0.78 | 0.12 |
| 15 | Right Hand | 0.62 | 0.68 | 0.15 |
| 16 | Right Fingers | 0.58 | 0.65 | 0.18 |
| 17 | Left Hip | -0.28 | 0.72 | 0.00 |
| 18 | Right Hip | 0.28 | 0.72 | 0.00 |
| 19 | Left Knee | -0.62 | 0.52 | 0.22 |
| 20 | Left Ankle | -0.30 | 0.28 | 0.28 |
| 21 | Left Foot inner | -0.12 | 0.18 | 0.30 |
| 22 | Left Foot outer | -0.22 | 0.14 | 0.28 |
| 23 | Right Knee | 0.62 | 0.52 | 0.22 |
| 24 | Right Ankle | 0.30 | 0.28 | 0.28 |
| 25 | Right Foot inner | 0.12 | 0.18 | 0.30 |
| 26 | Right Foot outer | 0.22 | 0.14 | 0.28 |

### Edge groups (34 total)

| Group | Edges |
|---|---|
| Spine (6) | [0,1] [1,2] [2,3] [3,4] [4,5] [5,6] |
| Shoulder girdle (3) | [7,2] [8,2] [7,8] |
| Left arm (4) | [7,9] [9,10] [10,11] [11,12] |
| Right arm (4) | [8,13] [13,14] [14,15] [15,16] |
| Hip base (3) | [17,6] [18,6] [17,18] |
| Left leg (4) | [17,19] [19,20] [20,21] [21,22] |
| Right leg (4) | [18,23] [23,24] [24,25] [25,26] |
| Crossed feet (2) | [21,24] [25,20] |
| Ribcage suggestion (4) | [3,7] [3,8] [4,17] [4,18] |

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
