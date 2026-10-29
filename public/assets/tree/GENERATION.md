# Sakura QR artwork

Generated with the built-in image_gen tool on 2026-09-11.

- sakura-canopy.png: original art-direction image, retained as source artwork.
- sakura-blossoms.png: original transparent blossom cluster.
- sakura-blossoms-256.webp: 256px derivative of that cluster, used as small flower sprays along the spreading branches (Sharp, WebP quality 86). Each spray faces the viewer so petals stay light and readable on mobile.

The generated images do not encode a payload. The current implementation follows the QR Zoo reference: every QR module is a persistent Three.js cube. Those same cubes rise into a branching cherry tree, then return to their exact starting cells. The crown spreads across long, tiered limbs with 25 small blossom sprays and open space between the branches, following the airy foliage in the ICQR tree reference. Flower modules become smaller as the generated petals open; the tree still works if that optional texture cannot load.

`qr-tree-morph.ts` owns the deterministic source/destination mapping and shared colors. `GroveCanvas.tsx` animates it with one instanced cube mesh. `qr-garden-art.ts` draws the identical matrix and colors for the no-WebGL fallback and PNG export. Error correction H, the four-module quiet zone, and a precisely top-down orthographic camera keep the folded QR readable. Never substitute a generated QR approximation for this matrix.

The preview has no invented click count. Saved trees use API click counts; the QR always encodes the returned short URL. Validation: `npm run test:tree:morph` checks deterministic mapping and all 15 season/palette combinations across four payloads; `npm run test:tree` decodes actual browser screenshots and exports, checks responsive layout, reversible assembly, inputs, fallback, and API UI behavior using a mocked PHP API.

## Canopy prompt

Use case: stylized-concept
Asset type: square botanical texture for an interactive cherry-blossom QR garden.
Primary request: generate an exquisite straight-down orthographic aerial view of one Japanese cherry blossom tree growing at the center of a pale ivory limestone courtyard. Its broad organic branching canopy fills the central 70 percent of the square, with layered clusters of delicate five-petal sakura blossoms, visible fine brown branches, small burgundy shaded flower centers, blush, dusty rose and deep rose flowers. Natural sage, moss and forest-green planting softly frames all four edges and corners. A little pale stone paving shows between the flower clusters, with scattered fallen pink petals.
Style/medium: beautifully art-directed miniature botanical 3D render, tactile natural petals and foliage, soft diffuse daylight, fine detailed flower texture.
Composition: perfectly top-down flat square; no perspective, no horizon, no sky, centered canopy with irregular airy edge, rich pink center and green corners, continuous edge-to-edge texture, no outer frame.
Constraints: this image is a source texture; do not draw a QR code, any black-and-white squares, text, symbols, watermark, user interface, pot, people, building or border. The application will arrange the color values into a mathematically correct QR. Pink blossom tree must be clearly recognizable from above.

## Blossom prompt

Use case: stylized-concept
Asset type: transparent botanical sprite texture for the blossom canopy of a 3D cherry tree.
Primary request: a small airy cluster of seven delicate Japanese sakura blossoms, five subtly notched petals on each flower, individual golden stamens and deeper rose centers, blush pink to creamy pale pink petals with soft translucent veining. Flowers overlap naturally, with two tiny burgundy buds and just one tiny sage leaf, no long stem.
Style: exquisite softly lit botanical miniature 3D render, flower heads mostly facing the viewer, natural slight variation of angles, diffuse light, no cast shadow outside the flowers.
Composition: one compact roughly circular isolated cluster centered in a square with all edges inside the frame, entirely transparent background including gaps between blossoms. Large flowers occupy 85 percent of canvas.
Constraints: actual transparent alpha background, no white background, no checkerboard, no ground, no pot, no text, no watermark, no frame.
