import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import QRCode from 'qrcode';
import jsQR from 'jsqr';

const dir = path.resolve('output/playwright/qr-morph/model');
await mkdir(dir, {recursive:true});
for (const name of ['qr-tree', 'qr-tree-morph']) {
  const source = await readFile(`src/lib/${name}.ts`, 'utf8');
  const result = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replaceAll('"./qr-tree"','"./qr-tree.mjs"');
  await writeFile(path.join(dir,`${name}.mjs`),result);
}
const {buildTreeMorph, sampleMorphCell, morphColors} = await import(pathToFileURL(path.join(dir,'qr-tree-morph.mjs')));
let checks=0;
for (const payload of ['https://hoahwa.com', 'https://hoahwa.com/a123', 'https://hoahwa.com/SakuraGarden2026', 'https://example.com/hoa?ten=anh%20dao']) {
  const start=performance.now(), model=buildTreeMorph(payload,130), elapsed=performance.now()-start;
  const qr=QRCode.create(payload,{errorCorrectionLevel:'H'}), {cells,size,world}=model;
  assert.equal(world,size+8); assert.equal(cells.length,world*world);
  assert.equal(new Set(cells.map(c=>`${c.row}:${c.col}`)).size,cells.length);
  assert.deepEqual(model,buildTreeMorph(payload,130));
  for (const cell of cells) {
    const inside=cell.row>=0&&cell.col>=0&&cell.row<size&&cell.col<size;
    assert.equal(cell.dark,inside&&Boolean(qr.modules.get(cell.row,cell.col)));
    const folded=sampleMorphCell(cell,0), grown=sampleMorphCell(cell,1);
    assert.equal(folded.x,cell.flat.x); assert.equal(folded.y,0); assert.equal(folded.z,cell.flat.z); assert.equal(folded.size,1);
    for (const axis of ['x','y','z']) assert.ok(Math.abs(grown[axis]-cell.grown[axis])<1e-9);
    if (!inside) { assert.equal(cell.role,'stone'); assert.deepEqual(cell.flat,cell.grown); }
    if (cell.dark) assert.notEqual(cell.role,'stone');
    for (const t of [0.2,0.6,0.3,0.9,0]) {
      const p=sampleMorphCell(cell,t);
      assert.ok([p.x,p.y,p.z,p.size,p.tumble].every(Number.isFinite));
    }
  }
  assert.ok(cells.some(c=>c.role==='wood')); assert.ok(cells.some(c=>c.role==='blossom'));
  assert.ok(buildTreeMorph(payload,2000).height>buildTreeMorph(payload,0).height);
  const px=12, width=world*px;
  for (const season of ['spring','summer','autumn']) for (const palette of ['gold','lavender','coral','sky','snow']) {
    const pixels=new Uint8ClampedArray(width*width*4);
    for (const cell of cells) {
      const hex=morphColors(cell,size,season,palette).flat;
      const rgb=[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16),255];
      for(let y=0;y<px;y++)for(let x=0;x<px;x++)pixels.set(rgb,(((cell.row+4)*px+y)*width+(cell.col+4)*px+x)*4);
    }
    assert.equal(jsQR(pixels,width,width)?.data,payload);
    checks++;
  }
  console.log(`PASS ${payload}: ${cells.length} cells; deterministic assembly ${elapsed.toFixed(1)} ms; 15 palettes decode`);
}
console.log(`PASS: bijection, quiet zone, all dark modules move, exact endpoints, reversible interpolation, growth, ${checks} QR decoding cases`);
