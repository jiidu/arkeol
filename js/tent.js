/*
  Arkeol v0.3.5 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  tent.js – the inside of the tent at the camp: a calm place with its own music, the relic shelf,
            the photo board, the wardrobe trunk and the layer album (jump to any layer you have reached)
*/
'use strict';
let inTent=false,tentSnap=null,tentBack=null;
(function(){try{const s=JSON.parse(localStorage.getItem(SKEY)||'null');if(s){store.shots=s.shots||{};store.maxLayer=s.maxLayer||1}}catch(e){}})();
const TL=(en,fi)=>LANG==='fi'?fi:en;

BGS.tent=bgSet([96,70,44],3900);
TEXB.tent=biomeSet([120,90,56],[176,146,100],[150,120,80],[210,180,130],4000);

/* a slow lullaby: soft pad, music box and a little harp */
TRACKS.tent={bpm:54,step(t,b,M){const E=M.eighth;
  const CH=[[48,55,60,64],[45,52,57,60],[41,48,53,57],[43,50,55,59]];const ci=Math.floor(b/16)%4;
  if(b%16===0){M.pad(t,CH[ci],E*16,'sine',.018,900);M.bassN(t,CH[ci][0]-12,E*16,.035,true)}
  const mel=[0,2,3,1,2,3,1,0];if(b%2===0&&Math.random()<.85)M.box(t,CH[ci][mel[(b/2|0)%8]]+24);
  if(b%8===5&&Math.random()<.45)M.harp(t,CH[ci][2]+12);if(Math.random()<.03)M.crackle(t)},tension:false};
if(typeof TRACKSETS!=='undefined')TRACKSETS.tent=['tent'];

/* ------------------------------------------------ a photograph of every layer you have cleared */
function recordLayerShot(){if(inDebug||inVoid||inTent)return;store.shots=store.shots||{};
  if(!store.shots[level])store.shots[level]={b:biome,e:era||'',s:(Math.random()*1e9)|0};store.maxLayer=Math.max(store.maxLayer||1,level+1);save()}
const BIOPAL={normal:[[60,44,32],[118,84,56],[170,130,90]],hot:[[70,30,20],[150,70,40],[240,140,60]],cold:[[30,40,60],[100,130,170],[210,230,250]],moss:[[26,40,24],[70,110,50],[150,200,100]],shroom:[[36,24,50],[100,70,140],[200,150,255]],void:[[30,6,12],[90,20,40],[200,60,80]]};
function drawLayerShot(c,L,info){const W=96,H=64;c.width=W;c.height=H;const g=c.getContext('2d'),r=mulberry32((info&&info.s)||L*977),pal=BIOPAL[info&&info.b]||BIOPAL.normal;
  const col=(k,v)=>`rgb(${pal[k].map(q=>Math.max(0,Math.min(255,q*v))|0).join(',')})`;
  g.fillStyle=col(0,1);g.fillRect(0,0,W,H);
  // a cave passage: wavy floor and ceiling
  g.fillStyle=col(1,1);g.beginPath();g.moveTo(0,0);for(let x=0;x<=W;x+=4)g.lineTo(x,10+Math.sin(x*.08+r()*2)*5+r()*3);g.lineTo(W,0);g.fill();
  g.beginPath();g.moveTo(0,H);for(let x=0;x<=W;x+=4)g.lineTo(x,48+Math.sin(x*.06+r()*2)*4+r()*3);g.lineTo(W,H);g.fill();
  for(let i=0;i<30;i++){g.fillStyle=col(1,.7+r()*.5);g.fillRect(r()*W,r()<.5?r()*14:46+r()*18,2,2)}
  // glints of something precious
  for(let i=0;i<4;i++){g.fillStyle=col(2,1.1);const x=r()*W,y=r()<.5?8+r()*6:50+r()*6;g.fillRect(x,y,2,2);g.fillStyle='rgba(255,255,255,.7)';g.fillRect(x,y,1,1)}
  // the era, if the layer had slipped in time
  const e=info&&info.e;g.fillStyle=col(2,.9);
  if(e==='roman'){for(const x of [20,70]){g.fillRect(x,22,5,26);g.fillRect(x-2,20,9,3)}}else if(e==='stone'){g.fillRect(56,24,10,2);g.fillRect(60,20,2,10)}else if(e==='medieval'){g.fillRect(20,28,8,20);g.fillRect(18,26,12,3)}else if(e==='future'){g.fillStyle='rgba(140,240,255,.7)';g.fillRect(64,22,14,10)}
  // a small explorer with a lamp
  g.fillStyle='#1a1410';g.fillRect(40,38,6,10);g.fillRect(41,34,4,4);g.fillRect(39,33,8,2);g.fillStyle='rgba(255,230,160,.9)';g.fillRect(45,35,2,1);
  const lg=g.createRadialGradient(46,35,0,46,35,22);lg.addColorStop(0,'rgba(255,220,150,.35)');lg.addColorStop(1,'rgba(255,220,150,0)');g.fillStyle=lg;g.fillRect(0,0,W,H);
  // photo grain and vignette
  const id=g.getImageData(0,0,W,H);for(let i=0;i<id.data.length;i+=4){const n=(r()-.5)*16,x=(i/4)%W,y=(i/4)/W|0,vg=1-Math.pow(Math.hypot((x-W/2)/W,(y-H/2)/H)*1.35,2)*.5;
    for(let k=0;k<3;k++)id.data[i+k]=(id.data[i+k]+n)*vg}g.putImageData(id,0,0)}
function openAlbum(){const shots=store.shots||{},max=store.maxLayer||1;let html=`<h2 style="margin:0 0 12px">${esc(TL('Layer album','Kerrosalbumi'))}</h2><div class="album">`;
    const cleared=Object.keys(shots).map(Number).filter(L=>L>=2&&L<max).sort((a,b)=>a-b);
  for(const L of cleared)html+=`<button type="button" class="ashot" data-l="${L}"><canvas data-shot="${L}"></canvas><b>${esc(TL('Layer ','Kerros ')+L)}</b><span>${esc(t('b_'+(shots[L].b==='void'?'normal':shots[L].b)))}</span></button>`;
  html+='</div>';openModal(html,true);
  document.querySelectorAll('[data-shot]').forEach(c=>{const L=+c.dataset.shot;drawLayerShot(c,L,shots[L])});
  document.querySelectorAll('.ashot').forEach(b=>b.addEventListener('click',()=>{const L=+b.dataset.l;closeModal();inTent=false;tentSnap=null;goLayer(L,null)}))}

/* ------------------------------------------------ entering and leaving */
const TCX=28,TFLOOR=25;
function enterTent(){if(state!=='play'||inTent)return;state='trans';sfx.door();
  irisClose(P.x+P.w/2,P.y+P.h/2,30,()=>{tentSnap=snapWorld();tentBack={x:P.x,y:P.y};buildTentRoom();state='play';irisOpen(P.x+5,P.y+8,40)})}
function leaveTent(then){if(!inTent)return;state='trans';sfx.door();
  irisClose(P.x+P.w/2,P.y+P.h/2,26,()=>{inTent=false;restoreWorld(tentSnap);tentSnap=null;P.x=tentBack.x;P.y=tentBack.y;P.vx=P.vy=0;P.peak=P.y;P.climb=null;
    cam.x=P.x-VW/2;cam.y=P.y-VH/2;clampCam();state='play';Music.play(levelTrack());if(then)then();else irisOpen(P.x+5,P.y+8,36)})}
function buildTentRoom(){resetAtmosphere();inTent=true;
  // fresh arrays: the camp's own arrays live on untouched in tentSnap
  grid=new Uint8Array(MW*MH).fill(BED);dmgA=new Float32Array(MW*MH);webA=new Uint8Array(MW*MH);prot=new Uint8Array(MW*MH).fill(1);seen=new Uint8Array(MW*MH).fill(1);skyA=new Uint8Array(MW*MH);corA=new Uint8Array(MW*MH);
  decos=[];springs=[];foes=[];crates=[];pots=[];pickups=[];links=[];shop=null;junk=null;npcs=[];foods=[];gnats=[];drips=[];rocks=[];terms=[];vaults=[];fishes=[];ropes=[];
  acids=[];puddles=[];arrows=[];bombs=[];shots=[];tossed=[];fireballs=[];flies=[];parts=[];texts=[];flashes=[];
  surf=null;door={x:-999,y:-999,w:0,h:0};biome='tent';era=null;
  // a peaked canvas room on a plank floor
  for(let y=14;y<=TFLOOR;y++)for(let x=TCX-14;x<=TCX+14;x++)grid[idx(x,y)]=STONE;
  for(let y=16;y<TFLOOR;y++){const hw=Math.min(11,1+Math.round((y-16)*1.45));for(let x=TCX-hw;x<=TCX+hw;x++)grid[idx(x,y)]=AIR}
  for(let x=TCX-12;x<=TCX+12;x++)grid[idx(x,TFLOOR)]=PLANK;
  for(let y=TFLOOR+1;y<TFLOOR+5;y++)for(let x=TCX-16;x<=TCX+16;x++)grid[idx(x,y)]=DIRT;
  shaft={x:TCX,y0:16,y1:16};
  const fy=TFLOOR-1;
  decos.push({tx:TCX-10,ty:fy,k:'tflap',sx:0,sy:1},{tx:TCX-6,ty:fy,k:'relicshelf',sx:0,sy:1},{tx:TCX-2,ty:fy,k:'photoboard',sx:0,sy:1},
    {tx:TCX+2,ty:fy,k:'albumtable',sx:0,sy:1},{tx:TCX+6,ty:fy,k:'trunk',sx:0,sy:1},{tx:TCX+9,ty:fy,k:'cot',sx:0,sy:1},{tx:TCX,ty:16,k:'tlantern',sx:0,sy:-1},{tx:TCX-3,ty:fy,k:'rug',sx:0,sy:1});
  P.x=(TCX-9)*T+2;P.y=TFLOOR*T-P.h-.01;P.vx=P.vy=0;P.peak=P.y;P.climb=null;P.line=null;P.safeFall=true;
  cam.x=P.x-VW/2;cam.y=P.y-VH/2;clampCam();
  showToast(TL('The tent','Teltta'),TL('Quiet. Warm. Safe for a while.','Hiljaista. Lämmintä. Turvassa hetken.'),TL('Camp','Leiri'));Music.play('tent')}

/* ------------------------------------------------ what you can do inside */
function tentScreen(id,tab){if(tab)curTab=tab;state='modal';releaseAll();openScreen(id)}
const TENT_ACTS={
  tflap:{h:()=>TL('E: go outside','E: mene ulos'),go:()=>leaveTent()},
  relicshelf:{h:()=>TL('E: admire your relics','E: ihastele reliikkejä'),go:()=>tentScreen('archive','relics')},
  photoboard:{h:()=>TL('E: look at the photographs','E: katsele valokuvia'),go:()=>tentScreen('archive','photos')},
  albumtable:{h:()=>TL('E: open the layer album','E: avaa kerrosalbumi'),go:()=>openAlbum()},
  trunk:{h:()=>TL('E: change clothes','E: vaihda vaatteita'),go:()=>tentScreen('wardrobe')},
  cot:{h:()=>TL('E: rest for a moment','E: lepää hetki'),go:()=>{P.hp=Math.max(P.hp,P.maxHp);P.poison=0;floatText(P.x+5,P.y-10,TL('Rested','Levännyt'),'#ffe0b0');sfx.tea&&sfx.tea()}}
};
function tentHint(p,cx){
  if(!inTent){if(level===1&&surf&&!inVoid&&!inDebug&&nearTent()){if(hit.act)enterTent();return TL('E: go into the tent','E: mene telttaan')}return ''}
  const cy=p.y+p.h/2;for(const d of decos){const A=TENT_ACTS[d.k];if(!A)continue;if(Math.abs(d.tx*T+8-cx)<1.3*T&&Math.abs(d.ty*T+8-cy)<1.6*T){if(hit.act||(d.k==='tflap'&&hit.up))A.go();return A.h()}}
  return ''}

/* ------------------------------------------------ drawing */
function drawTentDeco(d){const x=d.tx*T,y=d.ty*T;
  switch(d.k){
  case 'tflap':{R(x+2,y-12,12,28,'#6a5236');R(x+4,y-10,8,26,'#2a1e14');ctx.fillStyle='#b8a070';ctx.beginPath();ctx.moveTo(x+2,y-12);ctx.lineTo(x+10,y-12);ctx.lineTo(x+3,y+16);ctx.fill();R(x+12,y-4,2,8,'#8a6a40');return true}
  case 'relicshelf':{R(x-4,y-14,24,30,'#5a3a22');R(x-3,y-13,22,28,'#3a2416');for(const yy of [-4,6,15])R(x-4,y+yy,24,2,'#7a5230');
    const got=RELICS.filter(r=>store.relics[r.id]);got.slice(0,9).forEach((r,i)=>{const sx=x-1+(i%3)*7,sy=y-10+Math.floor(i/3)*10,c=['#f2c84b','#c8d0dc','#6aa8ff','#d8a040','#e2483d'][i%5],gl=.6+.4*Math.sin(frame*.05+i);
      R(sx,sy,4,5,c);R(sx,sy,4,1,'#fff6c0');ctx.fillStyle=`rgba(255,230,150,${.15*gl})`;ctx.fillRect(sx-1,sy-1,6,7)});
    if(!got.length){ctx.font='5px "Pixelify Sans", monospace';ctx.fillStyle='#a08060';ctx.textAlign='center';ctx.fillText('…',x+8,y);ctx.textAlign='left'}return true}
  case 'photoboard':{R(x-2,y-14,20,20,'#8a6a44');R(x-1,y-13,18,18,'#c8a878');R(x+3,y+6,2,10,'#6a5236');R(x+11,y+6,2,10,'#6a5236');
    const n=Math.min(6,Object.keys(store.lore).filter(k=>k[0]==='f').length+Object.keys(store.shots||{}).length);for(let i=0;i<Math.max(2,n);i++){const px=x+(i%3)*6,py=y-12+Math.floor(i/3)*8;R(px,py,5,6,i<n?'#f3ead8':'#a89070');if(i<n)R(px+1,py+1,3,3,['#7a6a52','#5a7aa8','#8a5a3a'][i%3]);R(px+2,py,1,1,'#c0392b')}return true}
  case 'albumtable':{R(x-2,y+4,20,3,'#7a5230');R(x,y+7,2,9,'#5a3a22');R(x+14,y+7,2,9,'#5a3a22');R(x+2,y,12,4,'#3a5a8a');R(x+2,y,12,1,'#5a7aa8');R(x+8,y,1,4,'#c8a030');
    if((frame>>5)%3===0){ctx.fillStyle='rgba(255,236,170,.6)';ctx.fillRect(x+4,y-2,1,1)}return true}
  case 'trunk':{R(x-1,y+3,18,13,'#6a4224');R(x-1,y+3,18,2,'#8a5a32');R(x-1,y+8,18,1,'#4a2a14');R(x+7,y+6,3,4,'#c8a030');R(x+1,y+1,4,3,'#b03a2e');R(x+12,y+2,3,2,'#3d5fb8');return true}
  case 'cot':{R(x-4,y+8,24,3,'#4a6a3a');R(x-4,y+7,24,1,'#6a8a5a');R(x-3,y+11,2,5,'#5a3a22');R(x+17,y+11,2,5,'#5a3a22');R(x+12,y+4,8,4,'#efe8dc');R(x-2,y+6,12,2,'#b03a2e');return true}
  case 'tlantern':{const sw=Math.sin(frame*.02)*1.5;R(x+7,y,1,6,'#3a3236');ctx.save();ctx.translate(x+8+sw*.3,y+6);R(-3,0,6,7,'#3a3236');R(-2,1,4,5,'#ffd27a');R(-3,0,6,1,'#5a5250');ctx.restore();return true}
  case 'rug':{R(x-6,y+15,44,1,'#8a2a2a');for(let k=0;k<44;k+=4)R(x-6+k,y+15,2,1,'#c8a030');return true}}
  return false}
function tentLight(hole,glows){if(!inTent)return;const lx=TCX*T+8,ly=16*T+10,f=1+Math.sin(frame*.07)*.03;hole(lx,ly,9*T*f,.95);glows.push([lx,ly,5*T,'rgba(255,190,110,.28)']);
  for(const d of decos)if(d.k==='relicshelf')glows.push([d.tx*T+8,d.ty*T-2,1.6*T,'rgba(255,220,140,.12)'])}
