/*
  Arkeol v0.3.3 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  void.js – the other side of the rifts (contains spoilers), demon weapons, wooden blocks,
            and the look of the main trader's shop
*/
'use strict';
let inVoid=false,voidSnap=null,voidBack=null,demon=null;

/* ================================================= world snapshot: the real layer waits while you are away */
function snapWorld(){return {grid,dmgA,webA,seen,prot,skyA,decos,springs,foes,crates,pots,pickups,links,shop,junk,npcs,foods,gnats,drips,rocks,motes,surf,shaft,door,biome,lastBiome,era,terms,vaults,ropes,acids,puddles,arrows,bombs,shots,fireballs,flies,tossed,fishSpots,levelTime,clouds,levelKills,waterAwake,sandAwake}}
function restoreWorld(s){grid=s.grid;dmgA=s.dmgA;webA=s.webA;seen=s.seen;prot=s.prot;skyA=s.skyA;decos=s.decos;springs=s.springs;foes=s.foes;crates=s.crates;pots=s.pots;pickups=s.pickups;links=s.links;shop=s.shop;junk=s.junk;npcs=s.npcs;foods=s.foods;gnats=s.gnats;drips=s.drips;rocks=s.rocks;motes=s.motes;surf=s.surf;shaft=s.shaft;door=s.door;biome=s.biome;lastBiome=s.lastBiome;era=s.era;terms=s.terms;vaults=s.vaults;ropes=s.ropes;acids=s.acids;puddles=s.puddles;arrows=s.arrows;bombs=s.bombs;shots=s.shots;fireballs=s.fireballs;flies=s.flies;tossed=s.tossed;fishSpots=s.fishSpots;levelTime=s.levelTime;clouds=s.clouds;levelKills=s.levelKills;waterAwake=true;sandAwake=true;parts=[];texts=[];flashes=[]}

/* ================================================= look and sound of the other side */
BGS.void=bgSet([30,8,12],3300);TEXB.void=TEXB.hot||TEXB.normal;
TRACKSETS.void=['void'];
TRACKS.void={bpm:44,step(t,b,M){const E=M.eighth;
    if(b%32===0){M.pad(t,[38,39,45],E*32,'sawtooth',.007,320);M.pad(t,[62,63,68],E*32,'sine',.008,800);M.bassN(t,26,E*32,.06,true)}
    if(b%8===0||b%8===3)M.thump(t,.55);
    if(b%16===10&&Math.random()<.6)M.bell(t,pickR([73,74,80]));
    if(Math.random()<.04)M.wind(t,E*8);
    if(b%32===24&&Math.random()<.5)M.flute(t,pickR([63,66,69]),E*6)},tension:false};
Object.assign(sfx,{voidIn:()=>{tone(220,1.2,'sawtooth',.05,-180);noise(1.2,.12,300,'bandpass')},voidOut:()=>{tone(180,1,'sine',.05,400);noise(.8,.08,1200,'bandpass')},
  demonOpen:()=>{tone(60,1.6,'sawtooth',.08,-20);noise(1.4,.14,500);setTimeout(()=>tone(440,.6,'triangle',.04,-200),400)},
  scythe:()=>{noise(.18,.1,2400,'bandpass');tone(300,.15,'sine',.03,-200)},hellShot:()=>{noise(.25,.1,600);tone(120,.3,'sawtooth',.05,-60)},boneShot:()=>{noise(.08,.06,3200,'highpass');tone(700,.08,'triangle',.03,-300)}});

/* ================================================= going through a rift and coming back */
function enterVoid(d){if(inVoid||state!=='play')return;state='trans';P.vx=0;P.vy=0;sfx.voidIn();shake=Math.max(shake,5);
  irisClose(P.x+P.w/2,P.y+P.h/2,40,()=>{voidSnap=snapWorld();voidBack={x:P.x,y:P.y,d};inVoid=true;
    const {sx}=genLevel(level);
    acids=[];puddles=[];arrows=[];bombs=[];shots=[];tossed=[];fishSpots={};ropes=pendingRopes.slice();parts=[];texts=[];flashes=[];fireballs=[];flies=[];levelTime=0;
    P.x=sx*T+T-P.w/2;P.y=2;P.vx=0;P.vy=.5;P.peak=P.y;P.climb=null;P.inv=60;P.safeFall=true;P.line=null;
    door={x:-999,y:-999,w:0,h:0};placeDemonChest(sx);
    cam.x=P.x-VW/2;cam.y=P.y-VH/2;clampCam();state='play';
    showToast(t('voidTitle'),t('voidSub'),t('voidKick'));Music.play('void');irisOpen(P.x+5,P.y+20,50)})}
function exitVoid(){if(!inVoid||state!=='play')return;state='trans';sfx.voidOut();
  irisClose(P.x+P.w/2,P.y+P.h/2,40,()=>{restoreWorld(voidSnap);inVoid=false;demon=null;
    P.x=voidBack.x;P.y=voidBack.y;P.vx=0;P.vy=0;P.climb=null;P.inv=60;P.peak=P.y;if(voidBack.d)voidBack.d.dead=true;voidSnap=null;
    cam.x=P.x-VW/2;cam.y=P.y-VH/2;clampCam();state='play';floatText(P.x+5,P.y-10,t('voidBack'),'#d8a0ff');Music.play(levelTrack());irisOpen(P.x+5,P.y+8,46)})}
function placeDemonChest(sx){let best=null,bd=0;
  for(let a=0;a<2500;a++){const x=2+Math.floor(Math.random()*(MW-5)),y=6+Math.floor(Math.random()*(MH-9));
    if(grid[idx(x,y)]!==AIR||grid[idx(x+1,y)]!==AIR||!isSolid(x,y+1)||!isSolid(x+1,y+1)||grid[idx(x,y-1)]!==AIR||isWater(x,y))continue;
    const d=Math.hypot(x-sx,y-6);if(d>bd){bd=d;best={x,y}}}
  if(!best)best={x:sx+3,y:8};demon={tx:best.x,ty:best.y,open:false};decos.push({tx:best.x,ty:best.y,k:'demonchest',sx:0,sy:1});
  prot[idx(best.x,best.y)]=1;prot[idx(best.x+1,best.y)]=1}
function openDemon(){if(!demon||demon.open)return;demon.open=true;sfx.demonOpen();shake=Math.max(shake,10);
  const x=demon.tx*T+16,y=demon.ty*T+8;particle(x,y,['#ff2a3a','#2a0008','#ff8a3a','#fff1b0'],50,3,60,-.02,2);flashes.push({x,y,life:30,max:30,r:8*T});
  const left=['scythe','hellgun','bonebow'].filter(w=>!P.weapons.includes(w));
  if(left.length){const w=pickR(left);giveWeapon(w);P.wdur[w]=w==='scythe'?14:10;renderHotbar();showSlotName();rareFx({r:4,n:{en:tr2(WPN[w].n,'en')+' · '+P.wdur[w]+' uses',fi:tr2(WPN[w].n,'fi')+' · kestää '+P.wdur[w]},v:0})}
  else{addMoney(3000,x,y-10,'#ff8a8a');rareFx({r:3,n:{en:'A heap of cursed gold',fi:'Kasa kirottua kultaa'},v:3000})}
  // the way back opens beside the chest
  let px=demon.tx+3;if(!(grid[idx(px,demon.ty)]===AIR&&isSolid(px,demon.ty+1)))px=demon.tx-2;if(!(grid[idx(px,demon.ty)]===AIR))px=demon.tx;
  decos.push({tx:px,ty:demon.ty,k:'vportal',sx:0,sy:0,born:frame});setTimeout(()=>floatText(px*T+8,demon.ty*T-14,t('voidOpen'),'#d8a0ff'),900)}
function voidHint(p,cx){const cy=p.y+p.h/2;
  for(const d of decos){if(d.dead)continue;
    if(d.k==='rift'&&!inVoid&&Math.abs(d.tx*T+8-cx)<T&&Math.abs(d.ty*T+4-cy)<1.4*T){if(hit.act||hit.up)enterVoid(d);return coarse?t('hintRiftT'):t('hintRift')}
    if(d.k==='vportal'&&Math.abs(d.tx*T+8-cx)<T&&Math.abs(d.ty*T+4-cy)<1.4*T){if(hit.act||hit.up)exitVoid();return coarse?t('hintBackT'):t('hintBack')}
    if(d.k==='demonchest'&&demon&&!demon.open&&Math.abs(d.tx*T+16-cx)<1.6*T&&Math.abs(d.ty*T+8-cy)<1.3*T){if(hit.act)openDemon();return coarse?t('hintDemonT'):t('hintDemon')}}
  return ''}
function updVoid(){if(!inVoid)return;if(frame%3===0)parts.push({x:cam.x+Math.random()*VW,y:cam.y+VH+4,vx:rand(-.2,.2),vy:-rand(.3,.8),life:180,max:180,col:pickR(['rgba(255,80,60,.5)','rgba(120,110,110,.5)','rgba(40,30,30,.6)']),g:-.001,sz:1});
  if(frame%600===0&&Math.random()<.6)pickR([sfx.whisper,sfx.farScream,sfx.musicbox])()}
function voidOverlay(){if(!inVoid)return;ctx.setTransform(1,0,0,1,0,0);const g=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.height*.2,cv.width/2,cv.height/2,cv.width*.75);
  g.addColorStop(0,'rgba(60,0,10,.18)');g.addColorStop(1,'rgba(20,0,4,.6)');ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height)}
/* decorations of the other side, filled in by spawnDeep when inVoid */
function spawnVoidDecor(H){const {ri,airFloor}=H;
  const put=(k,wall,n)=>{let c=0;for(let a=0;a<900&&c<n;a++){const x=ri(2,MW-3),y=ri(3,MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y))continue;
    if(wall==='floor'){if(!airFloor(x,y))continue;decos.push({tx:x,ty:y,k,sx:0,sy:1,v:ri(0,3),txt:ri(0,8)});c++}
    else if(wall==='ceil'){if(!isSolid(x,y-1))continue;decos.push({tx:x,ty:y,k,sx:0,sy:-1,v:1+ri(0,2),txt:0});c++}
    else{const s=isSolid(x-1,y)?-1:isSolid(x+1,y)?1:0;if(!s)continue;decos.push({tx:x,ty:y,k,sx:s,sy:0,v:ri(0,3),txt:ri(0,8)});c++}}};
  put('blood','wall',14);put('hand','wall',8);put('scrawl','wall',10);put('eyes','wall',12);put('chain','ceil',10);put('skulls','floor',10);put('bones','floor',10);put('tally','wall',4)}

/* ================================================= demon weapons */
Object.assign(WPN,{scythe:{n:{en:'Soul scythe',fi:'Sieluviikate'},ic:'scythe',cd:26},hellgun:{n:{en:'Hellfire revolver',fi:'Helvetinliekki'},ic:'hellgun',cd:36},bonebow:{n:{en:'Bone bow',fi:'Luujousi'},ic:'bonebow',cd:22}});
ICON.scythe=pixIcon(p=>{p(3,3,2,12,'#3a2a2a');p(4,2,8,2,'#c8c8d8');p(10,3,3,2,'#c8c8d8');p(12,5,2,2,'#e8e8f8');p(3,12,2,2,'#a02a3a')});
ICON.hellgun=pixIcon(p=>{p(2,6,10,3,'#2a1a1a');p(10,6,3,2,'#5a1010');p(3,8,3,5,'#4a1a10');p(6,8,3,2,'#ff3a2a');p(12,5,2,1,'#ff8a3a')});
ICON.bonebow=pixIcon((p,g)=>{g.strokeStyle='#e8e0d0';g.lineWidth=2;g.beginPath();g.arc(5,8,6,-1.2,1.2);g.stroke();p(10,2,1,12,'rgba(200,40,60,.8)');p(4,7,3,2,'#a02a3a')});
const DEMON_FIRE={
  scythe:(a,cx)=>{const p=P;p.wcd=WPN.scythe.cd;p.scy=14;sfx.scythe();const bx=p.face>0?p.x+p.w-4:p.x-30;hitStuff({x:bx,y:p.y-10,w:34,h:p.h+14},4,cx,'whip');
    for(let k=0;k<10;k++)parts.push({x:cx+p.face*rand(6,26),y:p.y+rand(-8,10),vx:p.face*rand(.5,1.5),vy:rand(-.5,.5),life:16,max:16,col:pickR(['#c87aff','#ff3a6a','#2a0018']),g:0,sz:1})},
  hellgun:(a,cx)=>{const p=P,ca=Math.cos(a.ang),sa=Math.sin(a.ang);p.wcd=WPN.hellgun.cd;shots.push({x:cx+ca*9,y:p.y+6+sa*9,vx:ca*6,vy:sa*6,g:0,dmg:4,k:'hell',life:90});sfx.hellShot();shake=Math.max(shake,3);flashes.push({x:cx+ca*9,y:p.y+6+sa*9,life:6,max:6,r:3*T})},
  bonebow:(a,cx)=>{const p=P,ca=Math.cos(a.ang),sa=Math.sin(a.ang);p.wcd=WPN.bonebow.cd;shots.push({x:cx+ca*9,y:p.y+6+sa*9,vx:ca*10,vy:sa*10,g:.01,dmg:3.5,k:'bone',life:150});sfx.boneShot()}};
function hellBurst(x,y){particle(x,y,['#ff3a2a','#ff8a3a','#2a0008'],18,2.4,30,.05,1.5);sfx.knock();for(const f of foes)if(!f.dead&&Math.hypot(f.x+f.w/2-x,f.y+f.h/2-y)<1.8*T)damageFoe(f,2,x,'ranged')}
const DEMON_DRAW={
  scythe:p=>{const k=p.scy>0?(14-p.scy)/14:0;ctx.rotate(-1.2+k*2.4);R(0,-1,3,3,'#e2b48a');R(2,-.5,14,1.6,'#3a2a2a');ctx.fillStyle='#d8d8e8';ctx.beginPath();ctx.moveTo(15,-1);ctx.quadraticCurveTo(12,-10,4,-11);ctx.quadraticCurveTo(10,-6,13,0);ctx.fill();if(p.scy>0){ctx.strokeStyle='rgba(200,120,255,.6)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,15,-.6,.6);ctx.stroke()}},
  hellgun:p=>{R(2,-1,8,2,'#2a1a1a');R(2,0,2,3,'#4a1a10');R(9,-1,2,1,'#5a1010');R(5,-1,2,1,'#ff3a2a');if(p.wcd>28)R(11,-2,3,3,'#ff6a2a')},
  bonebow:p=>{ctx.strokeStyle='#e8e0d0';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(3,0,6,-1.25,1.25);ctx.stroke();ctx.strokeStyle='rgba(220,60,80,.8)';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(4.9,-5.7);ctx.lineTo(p.wcd>14?4.9:2,0);ctx.lineTo(4.9,5.7);ctx.stroke()}};
function drawDemonShot(s){if(s.k==='hell'){ctx.fillStyle='#ff3a2a';ctx.beginPath();ctx.arc(s.x,s.y,2.5,0,7);ctx.fill();R(s.x-1,s.y-1,2,2,'#fff1b0');if(frame%2===0)parts.push({x:s.x,y:s.y,vx:rand(-.2,.2),vy:-.2,life:12,max:12,col:'#ff6a2a',g:-.01,sz:1});return true}
  if(s.k==='bone'){const a=Math.atan2(s.vy,s.vx);ctx.save();ctx.translate(s.x,s.y);ctx.rotate(a);R(-9,-.5,9,1,'#e8e0d0');R(0,-1,2,2,'#c8c0b0');R(-10,-1.5,2,1,'#a02a3a');R(-10,.5,2,1,'#a02a3a');ctx.restore();return true}return false}

/* ================================================= wooden blocks */
TEX[PLANK]=[0,1,2,3].map(v=>tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++){const row=Math.floor(y/4),b=[142,98,56];px(x,y,vary(b,r,6));if(y%4===3)px(x,y,[84,56,30]);if((x+row*5+v*3)%11===0)px(x,y,[96,64,34])}px(2,1,[60,44,30]);px(13,9,[60,44,30])},1900+v));
TILECOL[PLANK]=['#9a6a3a','#6b4426','#c49a62'];
function placePlank(src,cx){const p=P;if(!(p.planks>0))return false;let tx,ty;
  if(src==='mouse'&&mouse.seen){const m=mouseWorld();if(Math.hypot(m.x-cx,m.y-(p.y+p.h/2))>4.5*T)return false;tx=Math.floor(m.x/T);ty=Math.floor(m.y/T)}
  else if(held.up||held.down||(typeof PAD!=='undefined'&&PAD.aim!==null)){const a=keyAim();tx=a.tx;ty=a.ty}
  else{tx=Math.floor((cx+p.face*12)/T);ty=Math.floor((p.y+p.h+2)/T);if(isSolid(tx,ty))ty=Math.floor((p.y+p.h-3)/T)}
  if(tx<1||ty<1||tx>=MW-1||ty>=MH-1||grid[idx(tx,ty)]!==AIR||prot[idx(tx,ty)])return false;
  const box={x:tx*T,y:ty*T,w:T,h:T};if(overlap(box,p)||foes.some(f=>!f.dead&&overlap(box,f)))return false;
  grid[idx(tx,ty)]=PLANK;dmgA[idx(tx,ty)]=0;p.planks--;sfx.knock();particle(tx*T+8,ty*T+8,['#9a6a3a','#c49a62'],6,1,14,.1,1);renderHotbar();return true}
ICON.plank=pixIcon(p=>{for(let y=3;y<13;y+=4){p(2,y,12,3,'#9a6a3a');p(2,y,12,1,'#c49a62');p(2,y+3,12,1,'#5a3a20')}p(4,4,1,1,'#3a2614');p(11,8,1,1,'#3a2614')});

/* ================================================= the main trader's shop: candles, herbs, bones and smoke */
TEX[SHOPB]=[0,1,2,3].map(v=>tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++){const log=Math.floor(y/5),edge=y%5===4;px(x,y,edge?[30,20,14]:vary([74+log*6,50+log*3,32],r,6))}if(v===1)for(let k=0;k<5;k++)px(3+k*2,7,[150,40,30]);if(v===2){px(6,2,[200,180,140]);px(7,2,[200,180,140]);px(6,3,[40,30,20])}},2100+v));
BGB[0]=tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary(x%8===0?[34,24,18]:[52,36,26],r,5));for(let k=0;k<3;k++)px(4+k*3,5+k,[120,40,30])},2200);
BGB[1]=tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary(x%8===0?[34,24,18]:[48,34,24],r,5));px(9,9,[150,130,90]);px(10,9,[150,130,90])},2201);
function drawShamanDeco(d){const x=d.tx*T,y=d.ty*T,v=d.v||0,sw=Math.sin(frame*.03+d.tx);
  switch(d.k){
  case 'herbs':{for(let i=0;i<3;i++){const hx=x+3+i*5,len=6+((i+v)%3)*2,o=Math.round(sw*(i-1)*.5);R(hx,y,1,3,'#6a5030');R(hx-1+o,y+3,3,len,['#5a6a30','#7a6a3a','#4a5a2a'][(i+v)%3]);R(hx+o,y+3+len,1,2,'#8a7a40')}break}
  case 'chimes':{for(let i=0;i<4;i++){const cx=x+3+i*3,len=5+i%2*3,o=Math.round(Math.sin(frame*.05+i)*.8);R(cx,y,1,len,'#5a4a3a');R(cx-1+o,y+len,2,3,'#e8e0d0')}break}
  case 'mask':{R(x+3,y+1,10,13,'#7a4a24');R(x+4,y+2,8,11,'#a86a34');R(x+5,y+5,2,2,'#1a0a04');R(x+9,y+5,2,2,'#1a0a04');R(x+7,y+8,2,2,'#5a2a14');R(x+5,y+11,6,1,'#e8e0d0');R(x+2,y+3,1,6,'#c84a2a');R(x+13,y+3,1,6,'#2a6ac8');R(x+7,y,2,2,'#e8c050');break}
  case 'potions':{R(x,y+12,16,2,'#5a3a20');for(let i=0;i<4;i++){const c=['#4ad06a','#c84ad8','#3a8ae8','#e8a83a'][(i+v)%4];R(x+1+i*4,y+7+(i%2),3,5-(i%2),c);R(x+2+i*4,y+5+(i%2),1,2,'#d8d0c0')}break}
  case 'bigplant':{for(let k=0;k<7;k++){const a=-1.3+k*.43+sw*.08,l=10+(k%3)*3;ctx.strokeStyle=k%2?'#3a7a3a':'#4a9a42';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+8,y+12);ctx.quadraticCurveTo(x+8+Math.sin(a)*l*.5,y+12-l*.7,x+8+Math.sin(a)*l,y+12-Math.cos(a)*l);ctx.stroke()}R(x+4,y+11,8,5,'#8a4a2a');R(x+4,y+11,8,1,'#a86a3a');break}
  case 'skullcandle':{R(x+4,y+9,8,6,'#d8d0c0');R(x+5,y+11,2,2,'#1a1410');R(x+9,y+11,2,2,'#1a1410');R(x+6,y+14,4,1,'#b8b0a0');R(x+7,y+5,2,4,'#e8e0c8');const f=Math.sin(frame*.3+d.tx);R(x+7,y+2+(f>0?1:0),2,3,'#ffb347');R(x+7,y+2,1,1,'#fff1b0');break}
  case 'drum':{R(x+3,y+8,10,8,'#8a4a2a');R(x+2,y+7,12,2,'#e0d0b0');for(let i=0;i<4;i++)R(x+3+i*3,y+10,1,5,'#3a2614');break}
  case 'incense':{R(x+6,y+13,4,3,'#5a3a20');R(x+7,y+8,1,5,'#3a2a1a');R(x+7,y+7,1,1,'#ff6a2a');if(frame%6===0)parts.push({x:x+7.5,y:y+6,vx:Math.sin(frame*.05)*.15,vy:-.35,life:80,max:80,col:'rgba(200,190,210,.35)',g:-.002,sz:2});break}
  case 'crystals':{for(let i=0;i<3;i++){const cx=x+4+i*4,h=5+(i*3+v)%4;ctx.fillStyle=['#c88aff','#7ae8ff','#ff8ad8'][(i+v)%3];ctx.beginPath();ctx.moveTo(cx-1.5,y+16);ctx.lineTo(cx+1.5,y+16);ctx.lineTo(cx,y+16-h);ctx.fill()}break}
  default:return false}
  return true}
function drawVoidDeco(d){const x=d.tx*T,y=d.ty*T;
  switch(d.k){
  case 'eyes':{const ox=d.sx<0?x+2:x+8,open=(frame+d.tx*37+d.ty*11)%260>14;if(open){R(ox,y+6,3,2,'#ffe0a0');R(ox+1,y+6,1,2,'#2a0000');R(ox+4,y+6,3,2,'#ffe0a0');R(ox+5,y+6,1,2,'#2a0000')}else{R(ox,y+7,3,1,'#3a1a1a');R(ox+4,y+7,3,1,'#3a1a1a')}break}
  case 'chain':{const n=(d.v||1)*4+2,o=Math.sin(frame*.02+d.tx)*1.5;for(let k=0;k<n;k++)R(Math.round(x+7+o*k/n),y+k*4,2,3,k%2?'#4a4a52':'#6a6a74');R(Math.round(x+6+o),y+n*4,4,3,'#5a5a64');break}
  case 'demonchest':{const op=demon&&demon.open,gl=.6+.4*Math.sin(frame*.08);
    R(x+1,y+5,30,11,'#1a0a0c');R(x+2,y+6,28,9,'#2a1014');R(x,y+15,32,1,'#0a0406');for(let i=0;i<4;i++)R(x+4+i*7,y+9,3,3,`rgba(255,${40+i*10},40,${gl.toFixed(2)})`);
    R(x-2,y+1,4,4,'#d8d0c0');R(x+30,y+1,4,4,'#d8d0c0');R(x-3,y-1,2,3,'#d8d0c0');R(x+33,y-1,2,3,'#d8d0c0');
    if(op){R(x+2,y-4,28,4,'#2a1014');R(x+4,y-2,24,2,'#ff3a2a')}else{R(x+1,y+2,30,4,'#3a141a');R(x+1,y+2,30,1,'#5a1a22');R(x+14,y+4,4,4,'#c8a030');R(x+15,y+5,2,2,'#ff3a2a')}break}
  case 'vportal':{const s=Math.sin(frame*.09),age=Math.min(1,(frame-(d.born||0))/40);ctx.save();ctx.translate(x+8,y+2);ctx.scale(age,age);
    for(let k=3;k>0;k--){ctx.fillStyle=['','rgba(255,255,255,.8)','rgba(220,140,255,.6)','rgba(120,60,220,.45)'][k];ctx.beginPath();ctx.ellipse(0,0,3+k*2.5+s,8+k*3.5+s,0,0,7);ctx.fill()}ctx.restore();
    if(frame%4===0){const a=Math.random()*7;parts.push({x:x+8+Math.cos(a)*14,y:y+2+Math.sin(a)*18,vx:-Math.cos(a)*.6,vy:-Math.sin(a)*.7,life:22,max:22,col:'#e8b0ff',g:0,sz:1})}break}
  default:return false}
  return true}
function voidLight(hole,glows){for(const d of decos){if(d.dead)continue;const x=d.tx*T+8,y=d.ty*T+8;
  if(d.k==='skullcandle'){const f=1+Math.sin(frame*.3+d.tx)*.08;hole(x,y-4,2*T*f,.8);glows.push([x,y-4,1.5*T,'rgba(255,150,60,.22)'])}
  else if(d.k==='incense'){hole(x,y-2,.9*T,.4)}else if(d.k==='crystals'){hole(x,y+2,1.4*T,.5);glows.push([x,y+2,T,'rgba(200,130,255,.18)'])}
  else if(d.k==='mask'&&(frame>>5)%5!==0){glows.push([x,y-2,.8*T,'rgba(255,200,90,.2)'])}
  else if(d.k==='demonchest'){hole(x+8,y,3*T,.75);glows.push([x+8,y,2.4*T,'rgba(255,40,60,.25)'])}
  else if(d.k==='vportal'){hole(x,y-6,3.2*T,.85);glows.push([x,y-6,2.4*T,'rgba(200,120,255,.3)'])}
  else if(d.k==='eyes'){glows.push([x,y-2,.5*T,'rgba(255,200,120,.12)'])}}}

function tr2(o,l){return o[l]||o.en}
