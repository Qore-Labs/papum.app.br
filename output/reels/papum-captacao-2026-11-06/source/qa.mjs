import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath,pathToFileURL} from 'node:url';
const source=path.dirname(fileURLToPath(import.meta.url)),root=process.cwd(),out=path.resolve(source,'..');
const req=createRequire(path.join(root,'package.json')),pnpm=path.join(root,'node_modules/.pnpm');
const core=fs.readdirSync(pnpm).find(x=>x.startsWith('playwright-core@'));
const {chromium}=req(path.join(pnpm,core,'node_modules/playwright-core'));
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(pathToFileURL(path.join(source,'preview.html')).href);
const state=await page.evaluate(async()=>{
 const v=document.querySelector('video');
 if(v.readyState<1)await new Promise((resolve,reject)=>{v.addEventListener('loadedmetadata',resolve,{once:true});v.addEventListener('error',()=>reject(new Error(v.error?.message||'Falha no vídeo')),{once:true})});
 const result={duration:v.duration,width:v.videoWidth,height:v.videoHeight,readyState:v.readyState,frames:[]};
 for(const time of [0,1.5,5,9,14,17.5,23.5,24.9]){v.currentTime=time;await new Promise(resolve=>v.addEventListener('seeked',resolve,{once:true}));result.frames.push({time:v.currentTime,readyState:v.readyState,error:v.error?.code??null})}
 v.currentTime=0;v.muted=true;await v.play();await new Promise(resolve=>setTimeout(resolve,1200));result.playbackTime=v.currentTime;result.paused=v.paused;v.pause();
 result.overflow=document.documentElement.scrollWidth>innerWidth;
 return result;
});
if(state.width!==1080||state.height!==1920||Math.abs(state.duration-25)>.05||state.frames.some(f=>f.error)||state.paused||state.playbackTime<.5||state.overflow||errors.length)throw new Error(JSON.stringify({state,errors}));
await page.evaluate(()=>{document.querySelector('video').currentTime=23.5});await page.waitForFunction(()=>!document.querySelector('video').seeking);
await page.screenshot({path:path.join(root,'output/playwright/reels/video-mobile.png')});
fs.writeFileSync(path.join(out,'verificacao-navegador.json'),JSON.stringify({state,errors},null,2));
await browser.close();console.log(JSON.stringify({state,errors},null,2));
