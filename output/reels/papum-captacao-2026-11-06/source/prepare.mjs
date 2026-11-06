import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=process.cwd();
const source=path.dirname(fileURLToPath(import.meta.url));
const req=createRequire(path.join(root,'package.json'));
const React=req('react');
const {renderToStaticMarkup}=req('react-dom/server');
const {Store,BookOpen,Utensils,ArrowUpRight}=req('lucide-react');
const assets=path.join(source,'assets');fs.mkdirSync(assets,{recursive:true});
const files=[['fba5a26ea33df6a3-s.p.18rizl4rsrl42.woff2','plus-jakarta-latin.woff2'],['3c285486269019b7-s.p.2g-0we2o5_ngd.woff2','be-vietnam-regular.woff2'],['8f46d218c8f79e34-s.p.2wu4yy186g04j.woff2','be-vietnam-semibold.woff2']];
for(const [from,to]of files)fs.copyFileSync(path.join(root,'.next/static/media',from),path.join(assets,to));
const iconsText=fs.readFileSync(path.join(root,'src/components/ui/icons.tsx'),'utf8');
const fn=iconsText.slice(iconsText.indexOf('function PapumLogo('),iconsText.indexOf('export function LogoWhite('));
let logo=fn.match(/<svg[\s\S]*?<\/svg>/)[0]
  .replace(/\s*\{\.\.\.props\}/g,'')
  .replace(/fill=\{colored \? "#1b1c1c" : "currentColor"\}/g,'fill="currentColor"')
  .replace(/\s+fill=\{colored \? "[^"]+" : undefined\}/g,'')
  .replace(/width=\{171\}/g,'width="171"').replace(/height=\{66\}/g,'height="66"');
if(logo.includes('{'))throw new Error('JSX residual no logo');
fs.writeFileSync(path.join(assets,'papum-logo.svg'),logo);
const data={logo,icons:{store:renderToStaticMarkup(React.createElement(Store)),book:renderToStaticMarkup(React.createElement(BookOpen)),utensils:renderToStaticMarkup(React.createElement(Utensils)),arrow:renderToStaticMarkup(React.createElement(ArrowUpRight))}};
for(const [key,name]of [['orders','orders.svg'],['contacts','contacts.svg'],['bolt','lightning.svg']]){const buf=fs.readFileSync(path.join(root,'public/home/product',name));fs.writeFileSync(path.join(assets,name),buf);data[key]='data:image/svg+xml;base64,'+buf.toString('base64')}
fs.writeFileSync(path.join(source,'assets.js'),'window.PAPUM_ASSETS='+JSON.stringify(data)+';\n');
const rate=48000,duration=25,N=rate*duration;
const left=new Float64Array(N),right=new Float64Array(N);
const freq=m=>440*2**((m-69)/12);
function tone(at,len,midi,amp,pan=0,type='pluck'){
 const begin=Math.round(at*rate),end=Math.min(N,begin+Math.round(len*rate)),f=freq(midi);
 for(let j=begin;j<end;j++){const t=(j-begin)/rate;const fade=Math.min(1,t/.012)*Math.min(1,(len-t)/.12);let wave,env;
  if(type==='pad'){wave=(Math.sin(2*Math.PI*f*t)+.18*Math.sin(2*Math.PI*f*2*t)+.08*Math.sin(2*Math.PI*f*3*t))/1.26;env=fade*.8}
  else{wave=Math.sin(2*Math.PI*f*t)+.17*Math.sin(2*Math.PI*f*2*t)*Math.exp(-t*9);env=Math.exp(-t*(type==='bass'?5:7))*fade}
  left[j]+=wave*env*amp*(1-pan*.25);right[j]+=wave*env*amp*(1+pan*.25);
 }
}
const beat=60/104;
for(let bar=0;bar<11;bar++){const at=bar*beat*4;if(at>=24)break;const chord=bar%4<2?[48,55,59,64]:[45,52,57,60];for(const [i,m]of chord.entries())tone(at,2.7,m,.006,i%2?-.5:.5,'pad');tone(at,1,chord[0]-12,.035,0,'bass');tone(at+beat*2,.7,chord[0]-12,.024,0,'bass');for(const [k,note]of [72,76,79].entries())tone(at+beat*(.5+k*.75),.65,note,.012,k%2?-.5:.5)}
const cues=[0,.43,.86,3,3.72,4.4,5.1,7,8.7,11,11.28,12.7,16,19,19.2];
for(const [k,at]of cues.entries()){tone(at,.25,k%3===0?79:76,.017,0);tone(at,.17,55,.008,0,'bass')}
function wav(file,l,r,gain=1){const buffer=Buffer.alloc(44+N*4);buffer.write('RIFF',0);buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(2,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*4,28);buffer.writeUInt16LE(4,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(N*4,40);let peak=0;for(let i=0;i<N;i++){const fade=Math.min(1,i/rate/.25)*Math.min(1,(duration-i/rate)/.8);for(let c=0;c<2;c++){const v=(c?r[i]:l[i])*gain*fade;peak=Math.max(peak,Math.abs(v));buffer.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*4+c*2)}}fs.writeFileSync(file,buffer);return peak}
const peak=wav(path.join(source,'../audio/trilha-original.wav'),left,right);
const speech=[];for(let i=1;i<=7;i++){const file=path.join(source,`../audio/voice-${String(i).padStart(2,'0')}.wav`);const b=fs.readFileSync(file);let bytesPerSecond=0,dataBytes=0;for(let p=12;p+8<b.length;){const key=b.toString('ascii',p,p+4),len=b.readUInt32LE(p+4);if(key==='fmt ')bytesPerSecond=b.readUInt32LE(p+16);if(key==='data')dataBytes=len;p+=8+len+(len%2)}speech.push({file:path.basename(file),durationSeconds:dataBytes/bytesPerSecond})}
fs.writeFileSync(path.join(source,'../audio/audio-source.json'),JSON.stringify({voice:'Microsoft Maria, pt-BR, síntese local do Windows',music:'Composição instrumental original gerada para esta peça; sem samples externos.',musicPeak:peak,speech},null,2));
console.log(JSON.stringify({assetsPrepared:true,speech,musicPeak:peak},null,2));
