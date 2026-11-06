import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const source=path.dirname(fileURLToPath(import.meta.url)),out=path.resolve(source,'..');
function find(base,name){for(const ent of fs.readdirSync(base,{withFileTypes:true})){if(ent.isFile()&&ent.name===name)return path.join(base,ent.name);if(ent.isDirectory()){const result=find(path.join(base,ent.name),name);if(result)return result}}}
const ffmpeg=find(path.join(out,'tools'),'ffmpeg.exe'),ffprobe=find(path.join(out,'tools'),'ffprobe.exe');
if(!ffmpeg||!ffprobe)throw new Error('FFmpeg completo não disponível.');
function run(bin,args){const result=spawnSync(bin,args,{encoding:'utf8',maxBuffer:12*1024*1024,windowsHide:true});if(result.status!==0)throw new Error(result.stderr||result.error?.message||'Erro de encoding');return result.stdout}
const info=JSON.parse(fs.readFileSync(path.join(out,'audio/audio-source.json'),'utf8'));
const spans=[[0,3],[3,7],[7,11],[11,16],[16,19],[19,22],[22,25]];
const target=[2.65,3.5,2.8,3.3,2.6,2.5,2.6];
const inputs=[];const filters=[];
for(let i=0;i<7;i++){
 inputs.push('-i',path.join(out,'audio',info.speech[i].file));
 const tempo=info.speech[i].durationSeconds/target[i],delay=Math.round((spans[i][0]+.14)*1000);
 filters.push(`[${i}:a]aresample=48000,atempo=${tempo.toFixed(8)},highpass=f=75,lowpass=f=10500,afade=t=in:st=0:d=0.018,afade=t=out:st=${(target[i]-.045).toFixed(4)}:d=0.045,adelay=${delay}|${delay}[voice${i}]`);
}
inputs.push('-i',path.join(out,'audio/trilha-original.wav'));
filters.push('[7:a]volume=1.15[music]');
filters.push(`${Array.from({length:7},(_,i)=>`[voice${i}]`).join('')}[music]amix=inputs=8:duration=longest:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=9,atrim=start=0:end=25,aresample=48000[mix]`);
console.log('Mixando narração e trilha original...');
run(ffmpeg,['-y','-hide_banner','-loglevel','warning',...inputs,'-filter_complex',filters.join(';'),'-map','[mix]','-ac','2','-c:a','pcm_s16le',path.join(out,'audio/audio-final.wav')]);
console.log('Codificando master 1080×1920, 30 fps...');
const master=path.join(out,'papum-delivery-reels-sem-legendas.mp4');
run(ffmpeg,['-y','-hide_banner','-loglevel','warning','-f','concat','-safe','0','-i',path.join(out,'frames.ffconcat'),'-i',path.join(out,'audio/audio-final.wav'),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-r','30','-t','25','-c:a','aac','-b:a','192k','-ar','48000','-movflags','+faststart',master]);
console.log('Aplicando legendas com a fonte original...');
const overlayInputs=[];const overlays=[];
for(let i=0;i<7;i++){overlayInputs.push('-loop','1','-framerate','1','-i',path.join(source,`captions/caption-${i+1}.png`));overlays.push(`[${i===0?'0:v':`cap${i}`}][${i+1}:v]overlay=x=100:y=1110:enable='gte(t,${spans[i][0]})*lt(t,${spans[i][1]})'[cap${i+1}]`)}
const final=path.join(out,'papum-delivery-reels.mp4');
run(ffmpeg,['-y','-hide_banner','-loglevel','warning','-i',master,...overlayInputs,'-filter_complex',overlays.join(';'),'-map','[cap7]','-map','0:a:0','-c:v','libx264','-preset','medium','-crf','17','-pix_fmt','yuv420p','-r','30','-t','25','-c:a','copy','-movflags','+faststart',final]);
run(ffmpeg,['-y','-hide_banner','-loglevel','warning','-i',path.join(out,'audio/audio-final.wav'),'-c:a','libmp3lame','-q:a','2',path.join(out,'audio/narracao-e-trilha.mp3')]);
const probe=JSON.parse(run(ffprobe,['-v','error','-show_streams','-show_format','-of','json',final]));
const video=probe.streams.find(s=>s.codec_type==='video'),audio=probe.streams.find(s=>s.codec_type==='audio');
if(video.width!==1080||video.height!==1920||video.codec_name!=='h264'||video.pix_fmt!=='yuv420p'||Number(video.nb_frames)!==750||Math.abs(Number(probe.format.duration)-25)>.05||audio.codec_name!=='aac')throw new Error('Especificação final incorreta');
const loudness=spawnSync(ffmpeg,['-hide_banner','-i',final,'-af','loudnorm=I=-16:TP=-1.5:LRA=9:print_format=json','-f','null','-'],{encoding:'utf8',windowsHide:true,maxBuffer:4*1024*1024});
const json=loudness.stderr.match(/\{\s*"input_i"[\s\S]*?\}/)?.[0];
fs.writeFileSync(path.join(out,'verificacao-tecnica.json'),JSON.stringify({checkedAt:new Date().toISOString(),video:{codec:video.codec_name,width:video.width,height:video.height,frameRate:video.avg_frame_rate,frames:video.nb_frames,pixelFormat:video.pix_fmt},audio:{codec:audio.codec_name,sampleRate:audio.sample_rate,channels:audio.channels,loudness:json?JSON.parse(json):null},duration:probe.format.duration,bytes:probe.format.size,voice:info.voice,music:info.music},null,2));
console.log(JSON.stringify({final,master,duration:probe.format.duration,frames:video.nb_frames,bytes:probe.format.size}));
