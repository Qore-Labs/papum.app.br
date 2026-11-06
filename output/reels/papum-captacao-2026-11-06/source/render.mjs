import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=process.cwd(),source=path.dirname(fileURLToPath(import.meta.url)),out=path.resolve(source,'..');
const req=createRequire(path.join(root,'package.json'));
const pnpm=path.join(root,'node_modules/.pnpm');
const core=fs.readdirSync(pnpm).find(x=>x.startsWith('playwright-core@'));
const {chromium}=req(path.join(pnpm,core,'node_modules/playwright-core'));
const sharp=req(req.resolve('sharp',{paths:[path.dirname(req.resolve('next/package.json'))]}));
const previews=path.join(root,'output/playwright/reels');fs.mkdirSync(previews,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--font-render-hinting=none']});
const page=await browser.newPage({viewport:{width:1080,height:1920},deviceScaleFactor:1,reducedMotion:'no-preference'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(pathToFileURL(path.join(source,'composition.html')).href);
await page.evaluate(async()=>{await document.fonts.load('800 100px PapumHeading');await document.fonts.load('600 40px PapumBody');await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()))});
const fontState=await page.evaluate(()=>[...document.fonts].map(f=>({family:f.family,status:f.status})));
if(fontState.some(f=>f.status!=='loaded'))throw new Error('Fonte não carregada: '+JSON.stringify(fontState));
const stillTimes=[1.3,5.4,9,14,17.2,22.8];
const thumbs=[];
for(let i=0;i<stillTimes.length;i++){
 await page.evaluate(t=>window.renderAt(t,{captions:true}),stillTimes[i]);
 const file=path.join(previews,`scene-${i+1}.png`);await page.screenshot({path:file});
 thumbs.push({input:await sharp(file).resize(360,640).png().toBuffer(),left:(i%3)*360,top:Math.floor(i/3)*640});
}
await sharp({create:{width:1080,height:1280,channels:3,background:'#faf9f5'}}).composite(thumbs).png().toFile(path.join(out,'storyboard.png'));
await page.evaluate(()=>window.renderAt(1.3));await page.screenshot({path:path.join(out,'capa.png')});
const captions=path.join(source,'captions');fs.mkdirSync(captions,{recursive:true});
for(let i=0;i<7;i++){await page.evaluate(index=>window.showCaption(index),i);await page.screenshot({path:path.join(captions,`caption-${i+1}.png`),clip:{x:0,y:0,width:840,height:132},omitBackground:true})}
await page.evaluate(()=>window.restoreComposition());
const layout=await page.evaluate(()=>{window.renderAt(22.8,{captions:true});return [...document.querySelectorAll('#scene-5 .headline,#cta-visual,#closing-note,#closing-site,.header,.caption')].map(el=>{const r=el.getBoundingClientRect();return {text:el.innerText.trim().replace(/\s+/g,' '),x:r.x,y:r.y,width:r.width,height:r.height}})});
if(errors.length)throw new Error(errors.join('\n'));
fs.writeFileSync(path.join(out,'visual-check.json'),JSON.stringify({fontState,errors,layout,stillTimes},null,2));
if(process.argv.includes('--preview')){console.log(JSON.stringify({preview:path.join(out,'storyboard.png'),fontState,layout},null,2));await browser.close();process.exit(0)}
const frames=path.join(out,'frames');fs.mkdirSync(frames,{recursive:true});
const windows=[[0,1.25],[3,3.45],[7,7.45],[11,11.65],[12.7,13],[16,16.7],[19,19.75]];
const discrete=[3.6,4.3,5,8.7,12.7];
const selected=[];
for(let frame=0;frame<750;frame++){const t=frame/30;if(frame===0||frame===749||windows.some(([a,b])=>t>=a-1e-8&&t<=b+1e-8)||discrete.some(d=>Math.abs(t-d)<.017))selected.push(frame)}
const list=['ffconcat version 1.0'];
for(let i=0;i<selected.length;i++){
 const frame=selected[i],t=frame/30,file=path.join(frames,`frame-${String(frame).padStart(4,'0')}.png`);
 await page.evaluate(time=>window.renderAt(time),t);
 await page.screenshot({path:file});
 const count=(selected[i+1]??750)-frame;
 list.push(`file '${file.replaceAll('\\','/')}'`,`duration ${(count/30).toFixed(9)}`);
 if(i%30===0)console.log(JSON.stringify({rendered:i+1,total:selected.length,time:t}));
}
list.push(`file '${path.join(frames,`frame-${String(selected.at(-1)).padStart(4,'0')}.png`).replaceAll('\\','/')}'`);
fs.writeFileSync(path.join(out,'frames.ffconcat'),list.join('\n')+'\n');
fs.writeFileSync(path.join(out,'render-info.json'),JSON.stringify({duration:25,fps:30,width:1080,height:1920,uniqueFrames:selected.length,totalFrames:750,frameTimes:selected.map(f=>f/30)},null,2));
await browser.close();console.log(JSON.stringify({done:true,uniqueFrames:selected.length,duration:25}));
