/*
  Arkeol v0.3.1 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  foes2.js – bats, mimic chests, burrowing worms and will-o'-the-wisps
*/
'use strict';
let lastNoise={x:0,y:0,f:-999};
Object.assign(sfx,{
  batScreech:()=>{tone(3400,.05,'square',.012,1800);setTimeout(()=>tone(3900,.04,'square',.01,1500),60)},
  chomp:()=>{noise(.08,.12,900);tone(140,.1,'square',.05,-60);setTimeout(()=>{noise(.06,.1,1100);tone(170,.08,'square',.04,-60)},110)},
  rumble:()=>{noise(1.1,.16,140);noise(.9,.06,320,'bandpass')},
  wormRoar:()=>{tone(80,.7,'sawtooth',.07,-30);noise(.6,.12,500,'bandpass')},
  wispSteal:()=>{tone(1300,.5,'sine',.035,-900);setTimeout(()=>tone(980,.6,'sine',.03,-700),120);setTimeout(()=>tone(700,.7,'triangle',.02,-400),260)},
  wispPop:()=>{tone(1800,.15,'sine',.04,600);noise(.15,.05,4000,'highpass')}
});
const soft=(tx,ty)=>{const tt=tileAt(tx,ty);return (tt===DIRT||tt===SAND||tt===STONE)&&!prot[idx(tx,ty)]};
const cellSolid=(x,y)=>isSolid(Math.floor(x/T),Math.floor(y/T));

/* ------------------------------------------------ factories */
function mkBat(x,y){return {type:'bat',x:x-2,y,w:12,h:8,vx:0,vy:0,hx:x-2,hy:y,st:'sleep',hp:1,t:0,lost:0,anim:Math.random()*99,hurt:0,dead:false,face:1}}
function mkMimic(x,y){return {type:'mimic',x,y,w:12,h:11,vx:0,vy:0,st:'disguise',hp:4,t:0,hop:20,lost:0,anim:Math.random()*999,hurt:0,dead:false,face:1}}
function mkWorm(x,y){return {type:'worm',x,y,w:12,h:12,hx:x+6,hy:y+6,vx:0,vy:0,st:'lurk',hp:5,cd:240,t:0,trail:[],anim:0,hurt:0,dead:false,face:1}}
function mkWisp(x,y){return {type:'wisp',x,y,w:8,h:8,hx:x,hy:y,vx:0,vy:0,st:'drift',hp:1,t:0,anim:Math.random()*99,hurt:0,dead:false,face:1,fade:1}}

function spawnExtraFoes(lv,H){const {ri,r,airFloor,far,sy}=H;
  // bats roost in little groups under ceilings
  const nG=lv===1?1:Math.min(1+Math.floor(lv/3),3);let g=0;
  for(let a=0;a<2000&&g<nG;a++){const x=ri(3,MW-4),y=ri(sy+2,MH-5);
    if(grid[idx(x,y)]!==AIR||!isSolid(x,y-1)||isSolid(x,y+1)||isSolid(x,y+2)||isWater(x,y)||!far(x,y,10))continue;
    let n=0;for(let dx=-2;dx<=2&&n<2+ri(0,2);dx++){if(grid[idx(x+dx,y)]===AIR&&isSolid(x+dx,y-1)){foes.push(mkBat((x+dx)*T+4,y*T+.5));n++}}g++}
  // a mimic sits where a chest would be
  if(lv>=3){const nM=(r()<.55?1:0)+(lv>=6&&r()<.35?1:0);let m=0;
    for(let a=0;a<1500&&m<nM;a++){const x=ri(2,MW-3),y=ri(sy+2,MH-3);if(!airFloor(x,y)||!far(x,y,10)||isWater(x,y))continue;foes.push(mkMimic(x*T+2,(y+1)*T-11.001));m++}}
  // one burrowing worm in soft ground
  if(lv>=3&&biome!=='cold'&&(lv>=5||r()<.55)){for(let a=0;a<1500;a++){const x=ri(4,MW-5),y=ri(Math.max(sy+6,MH*.35|0),MH-4);
    if(!soft(x,y)||!soft(x,y+1)||!far(x,y,16))continue;foes.push(mkWorm(x*T+2,y*T+2));break}}
  // will-o'-the-wisps in the deep
  if(lv>=4){const nW=1+(r()<.4?1:0);let w=0;for(let a=0;a<1500&&w<nW;a++){const x=ri(3,MW-4),y=ri(Math.max(sy+4,MH*.35|0),MH-4);
    if(grid[idx(x,y)]!==AIR||isWater(x,y)||!far(x,y,14))continue;foes.push(mkWisp(x*T+4,y*T+4));w++}}
}

/* ------------------------------------------------ behaviour (each returns how much it adds to the music's tension) */
function wakeBat(f){if(f.st!=='sleep')return;f.st='fly';f.t=0;f.vy=1;sfx.batScreech();
  for(const o of foes)if(o.type==='bat'&&o.st==='sleep'&&Math.hypot(o.x-f.x,o.y-f.y)<3*T){o.st='fly';o.t=Math.random()*40;o.vy=1}}
function updBat(f,dx,dy,dist,sees,fcx,fcy){const pcx=fcx+dx,pcy=fcy+dy;
  if(f.st==='sleep'){f.vx=f.vy=0;if((sees&&dist<3.6*T)||(frame-lastNoise.f<4&&Math.hypot(lastNoise.x-fcx,lastNoise.y-fcy)<6*T))wakeBat(f);return 0}
  f.t++;
  if(f.st==='fly'){const tx=pcx+Math.sin(f.t*.045+f.anim)*26,ty=pcy-8+Math.cos(f.t*.07+f.anim)*12;
    if(f.t%150>100){f.vx*=.86;f.vy*=.86}else{f.vx+=(tx-fcx)*.0035+(Math.random()-.5)*.06;f.vy+=(ty-fcy)*.0035+(Math.random()-.5)*.06}
    if(!sees){if(++f.lost>300)f.st='home'}else f.lost=0}
  else if(f.st==='flee'){f.vx+=-Math.sign(dx)*.06;f.vy-=.05;if(f.t>110){f.st='fly';f.t=0}}
  else{const hx=f.hx-fcx,hy=f.hy-fcy,d=Math.hypot(hx,hy);f.vx+=hx/(d||1)*.08;f.vy+=hy/(d||1)*.08;if(d<3){f.x=f.hx;f.y=f.hy;f.st='sleep';f.lost=0;return 0}if(sees&&dist<5*T)f.st='fly'}
  const sp=Math.hypot(f.vx,f.vy),mx=f.st==='flee'?1.3:1.35;if(sp>mx){f.vx*=mx/sp;f.vy*=mx/sp}
  move(f);if(f.hitX)f.vx*=-.6;if(f.hitY)f.vy*=-.6;if(Math.abs(f.vx)>.1)f.face=Math.sign(f.vx);
  if(f.st==='fly'&&state==='play'&&overlap(P,f)){hurt(1,'cBat',fcx);f.st='flee';f.t=0}
  return f.st==='fly'?.3:0}
function updMimic(f,dx,dy,dist,sees,fcx){
  f.vy=Math.min(f.vy+.3,7);
  if(f.st==='disguise'){f.vx=0;move(f);if(f.hitY)f.vy=0;
    if((sees&&dist<1.7*T)||(state==='play'&&overlap(P,f))){f.st='awake';f.vy=-3.2;f.hop=30;sfx.chomp();floatText(fcx,f.y-6,'!','#ff8a6a');shake=Math.max(shake,4)}return 0}
  f.face=Math.sign(dx)||f.face;
  if(f.onGround){f.vx*=.75;if(--f.hop<=0){f.vx=f.face*2.2;f.vy=-3.6;f.hop=36+Math.random()*16;sfx.chomp()}}
  move(f);if(f.hitX)f.vx*=-.4;if(f.hitY)f.vy=0;
  if(!sees&&dist>10*T){if(++f.lost>420){f.st='disguise';f.lost=0}}else f.lost=0;
  if(state==='play'&&overlap(P,f)){if(P.vy>1&&P.y+P.h-f.y<7&&!P.climb){damageFoe(f,1,P.x+P.w/2,'stomp');P.vy=-4.6;P.peak=P.y}else hurt(1,'cMimic',fcx)}
  return .6}
function updWorm(f,dx,dy,dist,sees,fcx,fcy){const pcx=fcx+dx,pcy=fcy+dy;f.anim++;
  if(f.st==='lurk'){f.cd--;
    if(dist<13*T){const tx=pcx,ty=pcy+4*T,a=Math.atan2(ty-f.hy,tx-f.hx),nx=f.hx+Math.cos(a)*.7,ny=f.hy+Math.sin(a)*.7;if(cellSolid(nx,ny)||!cellSolid(f.hx,f.hy)){f.hx=nx;f.hy=ny}
      else{const b=a+(Math.random()<.5?1.4:-1.4),bx=f.hx+Math.cos(b)*.7,by=f.hy+Math.sin(b)*.7;if(cellSolid(bx,by)){f.hx=bx;f.hy=by}}}
    if(f.cd<=0&&Math.abs(f.hx-pcx)<2.6*T&&f.hy>pcy&&f.hy-pcy<7*T&&P.onGround&&!P.dead&&cellSolid(f.hx,f.hy)){f.st='rumble';f.t=55;sfx.rumble()}}
  else if(f.st==='rumble'){shake=Math.max(shake,2.2);
    if(f.t%6===0){const tx=Math.floor(f.hx/T);let ty=Math.floor(f.hy/T);while(ty>0&&isSolid(tx,ty))ty--;particle(f.hx+rand(-10,10),(ty+1)*T,['#8a7a66','#6b5a4c'],3,1,22,.15,1)}
    if(--f.t<=0){const a=Math.atan2(pcy-10-f.hy,pcx-f.hx);f.vx=Math.cos(a)*3.7;f.vy=Math.sin(a)*3.7;f.st='lunge';f.t=0;sfx.wormRoar();shake=Math.max(shake,6)}}
  else{f.t++;f.vy+=.11;f.hx+=f.vx;f.hy+=f.vy;const tx=Math.floor(f.hx/T),ty=Math.floor(f.hy/T);
    if(soft(tx,ty))breakTile(tx,ty,true);
    if(f.hx<T||f.hx>(MW-1)*T||f.hy<T||f.hy>(MH-1)*T){f.hx=clamp(f.hx,T,(MW-1)*T);f.hy=clamp(f.hy,T,(MH-1)*T);f.st='lurk';f.cd=240}
    else if((f.t>22&&cellSolid(f.hx,f.hy))||f.t>110){f.st='lurk';f.cd=260+Math.random()*160}}
  f.trail.unshift([f.hx,f.hy]);if(f.trail.length>44)f.trail.length=44;f.x=f.hx-6;f.y=f.hy-6;f.face=f.vx>=0?1:-1;
  if(f.st==='lunge'&&state==='play'){for(let k=0;k<f.trail.length;k+=4){const [sx,sy]=f.trail[k];if(sx>P.x-3&&sx<P.x+P.w+3&&sy>P.y-3&&sy<P.y+P.h+3){hurt(1,'cWorm',sx);break}}}
  return f.st==='lurk'?(dist<8*T?.25:0):.9}
function updWisp(f,dx,dy,dist,sees,fcx,fcy){f.t++;const pcx=fcx+dx,pcy=fcy+dy;
  if(f.fade<1)f.fade=Math.min(1,f.fade+.02);
  if(f.st==='drift'){let tx=f.hx+Math.sin(f.t*.013+f.anim)*22,ty=f.hy+Math.cos(f.t*.019+f.anim)*12;
    if(dist<7*T&&!P.dead){tx=pcx;ty=pcy-4}
    const sp=dist<7*T?.42:.3;const a=Math.atan2(ty-fcy,tx-fcx),d=Math.hypot(tx-fcx,ty-fcy);if(d>1){f.x+=Math.cos(a)*Math.min(sp,d);f.y+=Math.sin(a)*Math.min(sp,d)}
    if(state==='play'&&overlap(P,f)&&f.fade>=1){P.dark=720;sfx.wispSteal();floatText(fcx,f.y-8,t('lightStolen'),'#9fe8ff');f.st='flee';f.t=0;particle(fcx,fcy,['#c8fbff','#7fe8ff'],16,1.8,40,0,1)}}
  else{f.x+=-Math.sign(dx||1)*1.5;f.y-=.4;
    if(f.t>110){for(let a=0;a<200;a++){const x=1+Math.floor(Math.random()*(MW-2)),y=1+Math.floor(Math.random()*(MH-2));
        if(grid[idx(x,y)]===AIR&&Math.hypot(x*T-pcx,y*T-pcy)>14*T){f.x=f.hx=x*T+4;f.y=f.hy=y*T+4;break}}f.st='drift';f.t=0;f.fade=0}}
  if(frame%9===0)parts.push({x:f.x+4+rand(-2,2),y:f.y+4,vx:0,vy:-.15,life:30,max:30,col:'rgba(160,240,255,.7)',g:0,sz:1});
  return 0}

function onExtraHurt(f){if(f.type==='mimic'&&f.st==='disguise'){f.st='awake';f.hop=10;sfx.chomp()}if(f.type==='bat')wakeBat(f);if(f.type==='worm'&&f.st==='lurk')f.cd=0}
const EXTRA_UPD={bat:updBat,mimic:updMimic,worm:updWorm,wisp:updWisp};
const EXTRA_KILL={
  bat:f=>{sfx.squish();particle(f.x+4,f.y+3,['#4a3a42','#2a2026','#a02b24'],10,1.8,30,.2,1);store.stats.bats=(store.stats.bats||0)+1;addMoney(15,f.x+4,f.y-4,'#d9c8d0');if(store.stats.bats>=10)unlock('bat10')},
  mimic:f=>{sfx.chomp();particle(f.x+6,f.y+5,['#a06a34','#8a5a2c','#f2c84b'],18,2.2,40,.2,1.5);addMoney(80,f.x+6,f.y-6,'#ffe08a');
    for(let k=0;k<3;k++)pickups.push({x:f.x+3,y:f.y,w:6,h:5,vx:rand(-1.4,1.4),vy:rand(-3,-1.5),kind:'gold',value:60+(Math.random()*5|0)*10,t:0});
    dropMat('wood',f.x+6,f.y+2,2);const lk=lockedRecipes();if(lk.length&&Math.random()<.4)pickups.push({x:f.x+2,y:f.y,w:8,h:6,vx:0,vy:-2,kind:'recipe',rid:pickR(lk).id,value:0,t:0});unlock('mimic1')},
  worm:f=>{sfx.wormRoar();for(const [x,y] of f.trail.filter((_,i)=>i%4===0))particle(x,y,['#b8706a','#8a4a46','#e0a090'],6,2,40,.2,1.5);addMoney(300,f.hx,f.hy-8,'#ffd0c0');dropMat('bone',f.hx,f.hy,2);unlock('worm1');shake=Math.max(shake,8)},
  wisp:f=>{sfx.wispPop();particle(f.x+4,f.y+4,['#ffffff','#c8fbff','#7fe8ff'],24,2.4,46,0,1);addMoney(120,f.x+4,f.y-6,'#c8fbff');dropMat('spores',f.x+4,f.y+4,2);if(P)P.dark=0;flashes.push({x:f.x+4,y:f.y+4,life:18,max:18,r:4*T})}
};

/* ------------------------------------------------ drawing */
function drawBat(f){const x=Math.round(f.x+f.w/2),y=Math.round(f.y),body=biome==='cold'?'#6a6a7a':'#3a2a32',wing=biome==='cold'?'#8a8a9a':'#4e3a44';
  if(f.st==='sleep'){R(x-1,y,1,1,'#2a2026');R(x+1,y,1,1,'#2a2026');R(x-2,y+1,5,5,wing);R(x-1,y+2,3,4,body);R(x,y+6,1,1,body);
    if((frame+f.anim*10|0)%200<30)R(x-2,y+3,1,2,wing);return}
  const fl=Math.sin(frame*.55+f.anim),wy=Math.round(fl*3);ctx.fillStyle=wing;
  for(const s of [-1,1]){ctx.beginPath();ctx.moveTo(x+s,y+3);ctx.lineTo(x+s*7,y+1-wy);ctx.lineTo(x+s*5,y+4-wy*.3);ctx.lineTo(x+s*3,y+5);ctx.fill()}
  R(x-2,y+2,4,4,body);R(x-2,y+1,1,1,body);R(x+1,y+1,1,1,body)}
function drawMimic(f){const x=Math.round(f.x),y=Math.round(f.y),hurtC=f.hurt>0&&(f.hurt>>1)%2;
  if(f.st==='disguise'){const tell=(frame+f.anim|0)%260<14?1:0;
    R(x,y+1,12,10,'#8a5a2c');R(x,y-tell,12,4,'#a06a34');R(x+1,y-tell,10,1,'#c08a4c');R(x,y+4,12,1,'#5e3c1c');R(x+2,y-tell,1,11+tell,'#b0b4bc');R(x+9,y-tell,1,11+tell,'#b0b4bc');R(x+5,y+3-tell,2,3,'#f2c84b');
    if(tell){R(x+3,y+4,6,1,'#2a0a0a');R(x+4,y+4,1,1,'#efe8dc');R(x+7,y+4,1,1,'#efe8dc')}return}
  const open=f.onGround?.35+Math.abs(Math.sin(frame*.25))*.35:.9;
  R(x,y+4,12,7,hurtC?'#fff':'#8a5a2c');R(x+1,y+4,10,3,'#5a0e14');R(x+2,y+7,1,4,'#b0b4bc');R(x+9,y+7,1,4,'#b0b4bc');
  for(let i=0;i<5;i++)R(x+1+i*2,y+4,1,2,'#efe8dc');R(x+4,y+6,4,1,'#e07a8a');
  ctx.save();ctx.translate(x+(f.face>0?0:12),y+4);ctx.scale(f.face>0?1:-1,1);ctx.rotate(-open);R(0,-4,12,4,hurtC?'#fff':'#a06a34');R(1,-4,10,1,'#c08a4c');for(let i=0;i<5;i++)R(1+i*2,0,1,2,'#efe8dc');R(8,-3,2,1,'#ff5a3a');ctx.restore()}
function drawWorm(f){const N=11;
  for(let k=N-1;k>=0;k--){const p=f.trail[Math.min(k*4,f.trail.length-1)];if(!p)continue;const [sx,sy]=p;if(cellSolid(sx,sy))continue;
    const r=6.5-k*.38,c=f.hurt>0?'#fff':k%2?'#b8706a':'#a8605c';ctx.fillStyle=c;ctx.beginPath();ctx.arc(sx,sy,r,0,7);ctx.fill();ctx.strokeStyle='#5a2a2a';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='rgba(255,220,210,.35)';ctx.fillRect(sx-r*.5,sy-r*.7,r*.8,1);
    if(k===0){const a=Math.atan2(f.vy,f.vx);ctx.save();ctx.translate(sx,sy);ctx.rotate(a);ctx.fillStyle='#3a0a10';ctx.beginPath();ctx.arc(3,0,4.2,0,7);ctx.fill();
      ctx.fillStyle='#efe8dc';for(let i=0;i<8;i++){const b=i/8*Math.PI*2;ctx.fillRect(3+Math.cos(b)*3.6-.5,Math.sin(b)*3.6-.5,1,1)}ctx.restore()}}}
function drawWisp(f){const x=f.x+4,y=f.y+4+Math.sin(frame*.06+f.anim)*1.5,a=f.fade,fl=.8+Math.sin(frame*.3+f.anim)*.2;
  const g=ctx.createRadialGradient(x,y,0,x,y,7);g.addColorStop(0,`rgba(255,255,255,${.95*a})`);g.addColorStop(.35,`rgba(170,245,255,${.7*a*fl})`);g.addColorStop(1,'rgba(90,200,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,7,0,7);ctx.fill();
  if(P&&Math.hypot(P.x-f.x,P.y-f.y)<4*T&&f.st==='drift'){ctx.fillStyle=`rgba(20,40,60,${.8*a})`;ctx.fillRect(x-2,y-1,1,1);ctx.fillRect(x+1,y-1,1,1)}}
const EXTRA_DRAW={bat:drawBat,mimic:drawMimic,worm:drawWorm,wisp:drawWisp};
function extraLight(hole,glows){for(const f of foes){if(f.dead)continue;
  if(f.type==='wisp'){hole(f.x+4,f.y+4,2.6*T*f.fade,.8);glows.push([f.x+4,f.y+4,2*T,`rgba(120,220,255,${.25*f.fade})`])}}}
function extraEyes(f){if(f.type==='bat'&&f.st!=='sleep'){const x=Math.round(f.x+f.w/2),y=Math.round(f.y)+3;ctx.fillStyle='rgba(255,60,50,.9)';ctx.fillRect(x-1,y,1,1);ctx.fillRect(x+1,y,1,1)}
  else if(f.type==='mimic'&&f.st==='awake'){ctx.fillStyle='rgba(255,90,58,.9)';ctx.fillRect(f.x+(f.face>0?8:3),f.y+1,1,1)}}
