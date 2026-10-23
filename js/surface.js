/*
  Arkeol v0.3.4 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  surface.js – the world above: seasons, a turning clock, sun and moon, stars, rain, snow, fog and storms
*/
'use strict';
const SKY={season:'summer',hour:18.5,weather:'clear',wint:0,target:0,flash:0,nextFlash:0,nextWx:0,nextAmb:0,drops:[],stars:[]};
for(let i=0;i<70;i++)SKY.stars.push({x:Math.random(),y:Math.random()*.8,s:Math.random(),p:Math.random()*7});
const SEASONS=['spring','summer','autumn','winter'];
function rollSky(){const s=pickR(SEASONS);SKY.season=s;SKY.hour=pickR([5.6,6.5,8,11,13.5,16,18.4,19.4,21.5,23.5,1.5]);
  const q=Math.random();SKY.weather=s==='winter'?(q<.45?'snow':q<.6?'fog':q<.75?'cloudy':'clear'):s==='autumn'?(q<.3?'rain':q<.42?'storm':q<.55?'fog':q<.62?'snow':q<.8?'cloudy':'clear'):s==='spring'?(q<.3?'rain':q<.45?'cloudy':q<.55?'fog':'clear'):(q<.18?'rain':q<.3?'storm':q<.4?'cloudy':'clear');
  SKY.wint=SKY.target=SKY.weather==='clear'?0:1;SKY.drops=[];SKY.nextWx=frame+3600+Math.random()*7200}
/* sky colour keyframes through the day: hour, top, middle, horizon, daylight, far hills, near hills, clouds */
const SKYK=[[0,'#04060e','#0c1428','#18223c',.18,'#1a1e2e','#11141f','#3a4058'],[5,'#0a1022','#2a2a4a','#4a3a5a',.26,'#2a2638','#1a1626','#4a4660'],
  [6.5,'#3a4a7a','#e89a8a','#ffd2a0',.75,'#6a5a7a','#4a3a56','#ffd8cc'],[9,'#4a7ac0','#9ac0e0','#e8eef0',.95,'#6a7a9a','#4a5a72','#ffffff'],
  [13,'#3a78d0','#7ab8e8','#d0e8f4',1,'#5a7a9a','#3a5a6a','#ffffff'],[17,'#4a6aa0','#c8a080','#f0d0a0',.9,'#6a5a6a','#4a3a4a','#ffecd2'],
  [18.8,'#3a4a74','#c88a6a','#f4c27a',.75,'#6a4a5a','#4a3446','#ffe2c8'],[20.5,'#141c38','#3a2a48','#5a3a4a',.32,'#2a2236','#1a1626','#787090'],
  [24,'#04060e','#0c1428','#18223c',.18,'#1a1e2e','#11141f','#3a4058']];
const hx=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const mixA=(A,B,k)=>A.map((v,i)=>Math.round(v+(B[i]-v)*k)),rgbS=a=>`rgb(${a.join(',')})`;
const mixC=(a,b,k)=>rgbS(mixA(hx(a),hx(b),k));
function skyNow(){const h=SKY.hour;let i=0;while(i<SKYK.length-2&&SKYK[i+1][0]<=h)i++;const a=SKYK[i],b=SKYK[i+1],k=(h-a[0])/(b[0]-a[0]);
  const o={top:mixC(a[1],b[1],k),mid:mixC(a[2],b[2],k),bot:mixC(a[3],b[3],k),dl:a[4]+(b[4]-a[4])*k,far:mixC(a[5],b[5],k),near:mixC(a[6],b[6],k),cloudA:mixA(hx(a[7]),hx(b[7]),k)};
  const w=SKY.wint,heavy=SKY.weather==='storm'?1:SKY.weather==='rain'||SKY.weather==='snow'?.75:SKY.weather==='fog'?.5:SKY.weather==='cloudy'?.45:0;
  o.gray=w*heavy;o.dl=Math.min(1,o.dl*(1-.28*o.gray)+(SKY.flash>0?.7:0));return o}
const skyDL=()=>surf?skyNow().dl:1;
const onSurface=()=>surf&&(state==='menu'||(P&&P.y<(surf.ground+3)*T));

function drawSky(){const sh=(surf.ground+1)*T,W=MW*T,o=skyNow(),h=SKY.hour;
  const g=ctx.createLinearGradient(0,0,0,sh);g.addColorStop(0,o.top);g.addColorStop(.55,o.mid);g.addColorStop(1,o.bot);ctx.fillStyle=g;ctx.fillRect(0,0,W,sh);
  // stars
  const night=clamp(1-o.dl*1.6,0,1)*(1-o.gray);if(night>.02)for(const s of SKY.stars){const a=night*(.5+.5*Math.sin(frame*.03+s.p))*(.4+s.s*.6);ctx.fillStyle=`rgba(255,255,240,${a.toFixed(2)})`;ctx.fillRect(Math.round(s.x*W),Math.round(s.y*(sh-50)),s.s>.85?2:1,s.s>.85?2:1)}
  // sun or moon on an arc
  if(h>5.6&&h<19.4){const p=(h-5.6)/13.8,x=W*(.08+.84*p),y=sh-26-Math.sin(Math.PI*p)*(sh-60),low=1-Math.sin(Math.PI*p);
    const sg=ctx.createRadialGradient(x,y,2,x,y,90);sg.addColorStop(0,`rgba(255,${240-low*40|0},${200-low*80|0},${1-o.gray*.8})`);sg.addColorStop(.12,`rgba(255,${220-low*50|0},${150-low*60|0},${.9-o.gray*.7})`);sg.addColorStop(1,'rgba(255,190,120,0)');ctx.fillStyle=sg;ctx.fillRect(x-90,y-90,180,180)}
  else{const hh=h<12?h+24:h,p=(hh-19.4)/10.2,x=W*(.12+.76*p),y=sh-30-Math.sin(Math.PI*p)*(sh-70);ctx.globalAlpha=1-o.gray*.85;
    const mg=ctx.createRadialGradient(x,y,4,x,y,40);mg.addColorStop(0,'rgba(220,230,255,.35)');mg.addColorStop(1,'rgba(220,230,255,0)');ctx.fillStyle=mg;ctx.fillRect(x-40,y-40,80,80);
    ctx.fillStyle='#e8ecf4';ctx.beginPath();ctx.arc(x,y,7,0,7);ctx.fill();ctx.fillStyle='#c8ccd8';ctx.fillRect(x-3,y-2,2,2);ctx.fillRect(x+2,y+2,3,2);ctx.fillRect(x-1,y+4,1,1);ctx.globalAlpha=1}
  // weather greys the sky
  if(o.gray>0){ctx.fillStyle=`rgba(${SKY.weather==='fog'?'170,176,184':'60,66,76'},${(o.gray*(SKY.weather==='fog'?.45:.55)).toFixed(2)})`;ctx.fillRect(0,0,W,sh)}
  // hills (snowy in winter)
  ctx.fillStyle=o.far;ctx.beginPath();ctx.moveTo(0,sh);for(let x=0;x<=W;x+=24)ctx.lineTo(x,sh-30-Math.sin(x*.013)*14-Math.sin(x*.041)*6);ctx.lineTo(W,sh);ctx.fill();
  if(SKY.season==='winter'){ctx.fillStyle='rgba(235,240,250,.35)';ctx.beginPath();ctx.moveTo(0,sh);for(let x=0;x<=W;x+=24)ctx.lineTo(x,sh-30-Math.sin(x*.013)*14-Math.sin(x*.041)*6);for(let x=W;x>=0;x-=24)ctx.lineTo(x,sh-24-Math.sin(x*.013)*14-Math.sin(x*.041)*6);ctx.fill()}
  ctx.fillStyle=o.near;ctx.beginPath();ctx.moveTo(0,sh);for(let x=0;x<=W;x+=20)ctx.lineTo(x,sh-16-Math.sin(x*.021+2)*9);ctx.lineTo(W,sh);ctx.fill();
  // clouds: more and darker in bad weather
  const cc=SKY.weather==='storm'?'#4a4e58':SKY.weather==='rain'||SKY.weather==='snow'?'#8a909a':null;
  const cloudC=rgbS(cc?mixA(o.cloudA,hx(cc),SKY.wint):o.cloudA);
  for(const c of clouds){ctx.fillStyle=cloudC;ctx.globalAlpha=.55+o.gray*.35;ctx.beginPath();ctx.ellipse(c.x,c.y,c.w*(1+o.gray*.5),7+o.gray*4,0,0,7);ctx.ellipse(c.x+c.w*.3,c.y-5,c.w*.45,7+o.gray*3,0,0,7);ctx.fill();ctx.globalAlpha=1}
  if(SKY.weather==='fog'&&SKY.wint>0){for(let i=0;i<3;i++){ctx.fillStyle=`rgba(210,214,220,${(.12*SKY.wint).toFixed(2)})`;ctx.fillRect(0,sh-40-i*14+Math.sin(frame*.004+i)*4,W,26)}}}

/* things drawn over the finished world: snow on the ground, rain, snowflakes, mist, lightning */
function drawSurfaceFx(x0,x1,y0,y1){if(!surf)return;
  if(SKY.season==='winter'){ctx.fillStyle='#eef2fa';for(let x=x0;x<=x1;x++){const ty=surf.top[x];if(ty===undefined||ty<y0-1||ty>y1+1)continue;if(!isSolid(x,ty)||isSolid(x,ty-1))continue;R(x*T,ty*T-1,T,3,'#eef2fa');if(hash(x,ty)&1)R(x*T+3+(hash(x,9)%8),ty*T-2,4,1,'#ffffff')}}
  const o=skyNow(),lit=.35+.65*o.dl;
  for(const d of SKY.drops){if(d.snow){ctx.fillStyle=`rgba(255,255,255,${(.85*lit).toFixed(2)})`;ctx.fillRect(Math.round(d.x),Math.round(d.y),d.s,d.s)}
    else{ctx.strokeStyle=`rgba(180,200,230,${(.55*lit).toFixed(2)})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-d.vx*1.6,d.y-d.vy*1.6);ctx.stroke()}}
  if(SKY.weather==='fog'&&SKY.wint>0&&onSurface()){ctx.fillStyle=`rgba(200,206,214,${(.16*SKY.wint).toFixed(2)})`;ctx.fillRect(x0*T,0,(x1-x0+1)*T,(surf.ground+2)*T)}}
function drawFlash(){if(SKY.flash>0&&surf&&onSurface()){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=`rgba(230,235,255,${(SKY.flash/10*.55).toFixed(2)})`;ctx.fillRect(0,0,cv.width,cv.height)}}

/* ------------------------------------------------ sounds of the weather */
let rainG=null,windG=null;
function weatherAudio(){if(!AC||rainG)return;const mk=(f,type,q)=>{const s=AC.createBufferSource();s.buffer=noiseBuf();s.loop=true;const fl=AC.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=AC.createGain();g.gain.value=0;s.connect(fl).connect(g).connect(AC.destination);s.start(AC.currentTime+Math.random());return g};
  rainG=mk(2200,'bandpass',.6);windG=mk(380,'lowpass',.7)}
function setWeatherAudio(){if(!AC)return;weatherAudio();const on=onSurface()&&!muted?1:0,w=SKY.wint*on*sfxVol;
  rainG.gain.setTargetAtTime((SKY.weather==='rain'?.05:SKY.weather==='storm'?.08:0)*w,AC.currentTime,.6);
  windG.gain.setTargetAtTime((SKY.weather==='snow'?.05:SKY.weather==='storm'?.06:SKY.season==='winter'?.02:.012)*(on?1:0)*sfxVol*(SKY.weather==='clear'?.6:1),AC.currentTime,.8)}
Object.assign(sfx,{thunder:(d)=>{setTimeout(()=>{noise(2.2,.22,160);noise(1.4,.1,420)},d)},
  bird:()=>{const b=2400+Math.random()*1200;tone(b,.06,'sine',.02,600);setTimeout(()=>tone(b*1.2,.05,'sine',.018,-500),80);setTimeout(()=>tone(b,.07,'sine',.016,700),170)},
  owl:()=>{tone(420,.35,'sine',.02,-30);setTimeout(()=>tone(400,.5,'sine',.02,-40),450)},
  chirp:()=>{for(let k=0;k<3;k++)setTimeout(()=>tone(4400,.03,'sine',.008,0),k*55)}});

/* ------------------------------------------------ update: clock, weather, precipitation */
function updSurface(){if(!surf)return;
  SKY.hour=(SKY.hour+(state==='menu'?1/(60*25):1/(60*40)))%24;   // a game hour every 25 s on the menu, 40 s in play
  if(frame>SKY.nextWx){SKY.nextWx=frame+4800+Math.random()*7200;const old=SKY.weather;const q=Math.random();
    if(SKY.wint>.5&&q<.55)SKY.target=0;else{SKY.weather=SKY.season==='winter'?pickR(['snow','snow','fog','cloudy']):pickR(SKY.season==='summer'?['rain','storm','cloudy']:['rain','cloudy','fog']);if(old!==SKY.weather)SKY.wint=0;SKY.target=1}}
  SKY.wint+=(SKY.target-SKY.wint)*.004;if(SKY.target===0&&SKY.wint<.02){SKY.wint=0;SKY.weather='clear'}
  if(SKY.flash>0)SKY.flash--;
  if(SKY.weather==='storm'&&SKY.wint>.6&&frame>SKY.nextFlash){SKY.nextFlash=frame+240+Math.random()*420;SKY.flash=10;if(onSurface())sfx.thunder(400+Math.random()*1400)}
  // precipitation over the visible part of the sky
  const rain=SKY.weather==='rain'||SKY.weather==='storm',snow=SKY.weather==='snow';
  if((rain||snow)&&SKY.wint>.05&&onSurface()){const n=Math.round((rain?(SKY.weather==='storm'?7:4):2)*SKY.wint);
    for(let i=0;i<n;i++){const x=cam.x+Math.random()*(VW+80)-40,y=cam.y-10;
      if(rain)SKY.drops.push({x,y,vx:SKY.weather==='storm'?-2.2:-.8,vy:7+Math.random()*2,snow:false});
      else SKY.drops.push({x,y,vx:0,vy:.5+Math.random()*.5,snow:true,s:Math.random()<.3?2:1,p:Math.random()*7})}}
  for(const d of SKY.drops){if(d.snow){d.x+=Math.sin(frame*.03+d.p)*.35+(SKY.weather==='storm'?-.6:-.1);d.y+=d.vy}else{d.x+=d.vx;d.y+=d.vy}
    const tx=Math.floor(d.x/T),ty=Math.floor(d.y/T);
    if(ty>=0&&ty<MH&&tx>=0&&tx<MW&&(isSolid(tx,ty)||isWater(tx,ty)||!skyA[idx(tx,ty)])){d.dead=true;if(!d.snow&&Math.random()<.35)parts.push({x:d.x,y:ty*T-1,vx:rand(-.4,.4),vy:-rand(.3,.8),life:10,max:10,col:'rgba(190,210,235,.7)',g:.08,sz:1})}
    if(d.y>cam.y+VH+20||d.x<cam.x-60)d.dead=true}
  SKY.drops=SKY.drops.filter(d=>!d.dead);if(SKY.drops.length>500)SKY.drops.splice(0,SKY.drops.length-500);
  // the living surface: birds by day, crickets and owls by night
  if(onSurface()&&frame>SKY.nextAmb){SKY.nextAmb=frame+300+Math.random()*700;const o=skyNow();
    if(SKY.weather==='clear'||SKY.weather==='cloudy'){if(o.dl>.7&&SKY.season!=='winter')sfx.bird();else if(o.dl<.4){if(SKY.season==='summer'||SKY.season==='autumn')sfx.chirp();if(Math.random()<.3)sfx.owl()}}}
  if(frame%20===0)setWeatherAudio()}
function skyLabel(){const o=skyNow(),tod=SKY.hour<5.5||SKY.hour>=21?'night':SKY.hour<9?'morning':SKY.hour<17?'day':'evening';
  const S=t('sky_'+SKY.season),Td=t('tod_'+tod),name=LANG==='fi'?S+(S.slice(-1)===Td[0]?'-':'')+Td:S+' '+Td;
  return name+(SKY.weather!=='clear'?' · '+t('wx_'+SKY.weather):'')}
rollSky();
