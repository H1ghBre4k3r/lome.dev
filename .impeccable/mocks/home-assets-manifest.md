# Home asset manifest — Cover Split

Approved source: `home-cover-split.png` (1536 × 1024). This is a layout reference, not a shippable raster to place in the site.

## Keep live (no raster asset)

| Region | Production medium |
|---|---|
| Utility masthead, navigation, identity headline, thesis, actions, batch labels, proof-label text, and project index rows | Semantic HTML + CSS. Do not rasterize text or interface. |
| Hard rules, clipped/stamped action-tab silhouette, portrait frame, dividers, underline, and print-registration marks | CSS geometry; use small inline SVG only for the simple proof/registration glyphs. |
| Portrait duotone, coarse halftone screen, and print misregistration character | CSS treatment over the local portrait raster (blend/filter/mask or layered repeating-dot treatment), not a baked illustration. |
| Warm base stock | CSS solid `#DED8C9`; the texture below only supplies grain. |
| Breakout playfield, paddle, ball, bricks, and game state | Canvas plus semantic controls/status. |

## Raster assets to supply

| Asset | Recommended output path | Dimensions / format | Crop and treatment | Transparency |
|---|---|---|---|---|
| Louis’s real GitHub avatar, retained as the portrait source | `public/images/louis-github-avatar.webp` | 400 × 400 WebP, quality 90; the public GitHub source resolves at 400px even when requesting a larger size, so preserve native resolution rather than upscale it | Square source is sufficient. Render with `object-fit: cover`, positioned face-first, into the approximately 3:4 hard portrait plate; apply burgundy duotone and coarse halftone in CSS. Do not bake labels, frame, or screenprint treatment into the file. | No — opaque image. |
| Restrained uncoated-paper grain | `public/images/textures/paper-grain-1024.png` | 1024 × 1024, 8-bit grayscale PNG with alpha; seamless/tileable | Fine, low-contrast fibers and speckle only; no stains, vignette, text, or directional motif. Composite at low opacity over the CSS paper base. | Yes — alpha preserves the exact `#DED8C9` base and lets opacity adapt by section. |

## Source suitability decisions

- The supplied real GitHub avatar satisfies the portrait requirement: its winter portrait identity is the required factual source, and the planned coarse halftone makes the available 400px source appropriate. Keep it at native resolution and declare fixed rendered dimensions.
- A paper-grain raster is materially required. The approved surface brief explicitly requires visible restrained grain and rejects a CSS-gradient substitute; a transparent, tileable raster is the minimal faithful implementation.
- No additional photography, project thumbnails, logos, illustrations, or rasterized UI/text should be produced.
