/*
  Arkeol v0.3.5 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  void.js – the other side of the rifts (contains spoilers), demon weapons, wooden blocks,
            and the look of the main trader's shop
*/
'use strict';
let inVoid=false,voidSnap=null,voidBack=null,demon=null;

/* ================================================= world snapshot: the real layer waits while you are away */
function snapWorld(){return {grid,dmgA,webA,seen,prot,skyA,decos,springs,foes,crates,pots,pickups,links,shop,junk,npcs,foods,gnats,drips,rocks,motes,surf,shaft,door,biome,lastBiome,era,terms,vaults,ropes,acids,puddles,arrows,bombs,shots,fireballs,flies,tossed,fishSpots,fishes,corA,levelTime,clouds,levelKills,waterAwake,sandAwake}}
function restoreWorld(s){grid=s.grid;dmgA=s.dmgA;webA=s.webA;seen=s.seen;prot=s.prot;skyA=s.skyA;decos=s.decos;springs=s.springs;foes=s.foes;crates=s.crates;pots=s.pots;pickups=s.pickups;links=s.links;shop=s.shop;junk=s.junk;npcs=s.npcs;foods=s.foods;gnats=s.gnats;drips=s.drips;rocks=s.rocks;motes=s.motes;surf=s.surf;shaft=s.shaft;door=s.door;biome=s.biome;lastBiome=s.lastBiome;era=s.era;terms=s.terms;vaults=s.vaults;ropes=s.ropes;acids=s.acids;puddles=s.puddles;arrows=s.arrows;bombs=s.bombs;shots=s.shots;fireballs=s.fireballs;flies=s.flies;tossed=s.tossed;fishSpots=s.fishSpots;fishes=s.fishes||[];corA=s.corA||null;levelTime=s.levelTime;clouds=s.clouds;levelKills=s.levelKills;waterAwake=true;sandAwake=true;parts=[];texts=[];flashes=[]}

/* ================================================= look and sound of the other side */
BGS.void=bgSet([12,4,8],3300);TEXB.void=biomeSet([44,14,22],[36,20,30],[22,10,18],[120,20,34],3500);
TEXB.void[SAND]=[0,1,2,3].map(v=>tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary([40,22,26],r,5));for(let k=0;k<20;k++)px(r()*T,r()*T,r()<.5?[26,12,16]:[70,30,36])},3600+v));
TEXB.void[BRICK]=[0,1,2,3].map(v=>tex((px,r)=>brickFill(px,r,[52,24,30],[22,8,12]),3700+v));TEXB.void[GLYPH]=TEXB.void[BRICK];
TEXB.void[ICE]=[0,1].map(v=>tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary([46,30,52],r,5));for(let k=0;k<6;k++)px(r()*T,r()*T,[110,70,120])},3800+v));
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
  irisClose(P.x+P.w/2,P.y+P.h/2,40,()=>{resetAtmosphere();voidSnap=snapWorld();voidBack={x:P.x,y:P.y,d};inVoid=true;
    genLevel(level);const {sx,fy}=buildVoidTunnel();
    acids=[];puddles=[];arrows=[];bombs=[];shots=[];tossed=[];fishSpots={};ropes=pendingRopes.slice();parts=[];texts=[];flashes=[];fireballs=[];flies=[];levelTime=0;
    P.x=sx*T+T-P.w/2;P.y=fy*T-P.h-.01;P.vx=0;P.vy=0;P.peak=P.y;P.climb=null;P.inv=60;P.safeFall=true;P.line=null;
    door={x:-999,y:-999,w:0,h:0};placeDemonChest(sx);foes=foes.filter(f=>!(f.type==='spider'||f.type==='wolf')||Math.random()<.4);
    cam.x=P.x-VW/2;cam.y=P.y-VH/2;clampCam();state='play';
    showToast(t('voidTitle'),t('voidSub'),t('voidKick'));Music.play('void');irisOpen(P.x+5,P.y+20,50)})}
function exitVoid(){if(!inVoid||state!=='play')return;state='trans';sfx.voidOut();
  irisClose(P.x+P.w/2,P.y+P.h/2,40,()=>{resetAtmosphere();restoreWorld(voidSnap);inVoid=false;demon=null;
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
  if(left.length){const w=pickR(left);giveWeapon(w);if(P.wdur)delete P.wdur[w];P.souls=(P.souls||0)+12;renderHotbar();showSlotName();rareFx({r:4,n:WPN[w].n,v:0})}
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
function updVoid(){if(!inVoid)return;updTentacles();if(frame%3===0)parts.push({x:cam.x+Math.random()*VW,y:cam.y+VH+4,vx:rand(-.2,.2),vy:-rand(.3,.8),life:180,max:180,col:pickR(['rgba(255,80,60,.5)','rgba(120,110,110,.5)','rgba(40,30,30,.6)']),g:-.001,sz:1});
  if(frame%600===0&&Math.random()<.6)pickR([sfx.whisper,sfx.farScream,sfx.musicbox])()}
function voidOverlay(){if(!inVoid)return;ctx.setTransform(1,0,0,1,0,0);const g=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.height*.12,cv.width/2,cv.height/2,cv.width*.62);
  const pulse=.06*Math.sin(frame*.03);g.addColorStop(0,`rgba(40,0,8,${.22+pulse})`);g.addColorStop(.6,'rgba(16,0,4,.7)');g.addColorStop(1,'rgba(0,0,0,.92)');ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height)}
/* decorations of the other side, filled in by spawnDeep when inVoid */
function spawnVoidDecor(H){const {ri,airFloor}=H;
  const put=(k,wall,n)=>{let c=0;for(let a=0;a<900&&c<n;a++){const x=ri(2,MW-3),y=ri(3,MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y))continue;
    if(wall==='floor'){if(!airFloor(x,y))continue;decos.push({tx:x,ty:y,k,sx:0,sy:1,v:ri(0,3),txt:ri(0,8)});c++}
    else if(wall==='ceil'){if(!isSolid(x,y-1))continue;decos.push({tx:x,ty:y,k,sx:0,sy:-1,v:1+ri(0,2),txt:0});c++}
    else{const s=isSolid(x-1,y)?-1:isSolid(x+1,y)?1:0;if(!s)continue;decos.push({tx:x,ty:y,k,sx:s,sy:0,v:ri(0,3),txt:ri(0,8)});c++}}};
  put('blood','wall',14);put('hand','wall',8);put('scrawl','wall',8);put('eyes','wall',34);put('bigeye','wall',8);put('vein','wall',22);put('chain','ceil',8);put('skulls','floor',10);put('bones','floor',8);put('tally','wall',4);
  spawnTentacles(ri)}

/* ================================================= demon weapons */
Object.assign(WPN,{scythe:{n:{en:'Soul scythe',fi:'Sieluviikate'},ic:'scythe',cd:26},hellgun:{n:{en:'Hellfire revolver',fi:'Helvetinliekki'},ic:'hellgun',cd:30,am:'souls'},bonebow:{n:{en:'Bone bow',fi:'Luujousi'},ic:'bonebow',cd:18,am:'souls'}});
ICON.souls=pixIcon(p=>{p(3,7,3,6,'#8a3aff');p(4,5,1,2,'#c87aff');p(7,4,3,9,'#b05aff');p(8,2,1,2,'#e8b0ff');p(11,8,2,5,'#7a2ad8');p(8,5,1,3,'#fff');p(3,13,10,1,'#3a1a4a')});
Object.assign(STR.en,{soulsW:'soul shards',noSouls:'No soul shards'});Object.assign(STR.fi,{soulsW:'sielusirpaletta',noSouls:'Ei sielusirpaleita'});
ICON.scythe=pixIcon(p=>{p(3,3,2,12,'#3a2a2a');p(4,2,8,2,'#c8c8d8');p(10,3,3,2,'#c8c8d8');p(12,5,2,2,'#e8e8f8');p(3,12,2,2,'#a02a3a')});
ICON.hellgun=pixIcon(p=>{p(2,6,10,3,'#2a1a1a');p(10,6,3,2,'#5a1010');p(3,8,3,5,'#4a1a10');p(6,8,3,2,'#ff3a2a');p(12,5,2,1,'#ff8a3a')});
ICON.bonebow=pixIcon((p,g)=>{g.strokeStyle='#e8e0d0';g.lineWidth=2;g.beginPath();g.arc(5,8,6,-1.2,1.2);g.stroke();p(10,2,1,12,'rgba(200,40,60,.8)');p(4,7,3,2,'#a02a3a')});
const DEMON_FIRE={
  scythe:(a,cx)=>{const p=P;p.wcd=WPN.scythe.cd;p.scy=14;sfx.scythe();const bx=p.face>0?p.x+p.w-4:p.x-30;hitStuff({x:p.face>0?p.x+p.w-4:p.x-38,y:p.y-12,w:42,h:p.h+16},6,cx,'whip');startMelee(p.face,40,6,'whip');
    for(let k=0;k<10;k++)parts.push({x:cx+p.face*rand(6,26),y:p.y+rand(-8,10),vx:p.face*rand(.5,1.5),vy:rand(-.5,.5),life:16,max:16,col:pickR(['#c87aff','#ff3a6a','#2a0018']),g:0,sz:1})},
  hellgun:(a,cx)=>{const p=P,ca=Math.cos(a.ang),sa=Math.sin(a.ang);p.wcd=WPN.hellgun.cd;shots.push({x:cx+ca*9,y:p.y+6+sa*9,vx:ca*6.5,vy:sa*6.5,g:0,dmg:6,k:'hell',life:90});sfx.hellShot();shake=Math.max(shake,3);flashes.push({x:cx+ca*9,y:p.y+6+sa*9,life:6,max:6,r:3*T})},
  bonebow:(a,cx)=>{const p=P,ca=Math.cos(a.ang),sa=Math.sin(a.ang);p.wcd=WPN.bonebow.cd;shots.push({x:cx+ca*9,y:p.y+6+sa*9,vx:ca*11,vy:sa*11,g:.01,dmg:5,k:'bone',life:150});sfx.boneShot()}};
function hellBurst(x,y){particle(x,y,['#ff3a2a','#ff8a3a','#2a0008'],18,2.4,30,.05,1.5);sfx.knock();for(const f of foes)if(!f.dead&&Math.hypot(f.x+f.w/2-x,f.y+f.h/2-y)<2.3*T)damageFoe(f,3,x,'ranged')}
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
  case 'eyes':{drawStareEye(d,x,y,false);break}
  case 'bigeye':{drawStareEye(d,x,y,true);break}
  case 'vein':{drawVein(d,x,y);break}
  case 'tentacle':{drawTentacle(d);break}
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
  else if(d.k==='eyes'||d.k==='bigeye'){glows.push([x,y-2,(d.k==='bigeye'?1:.5)*T,'rgba(255,60,40,.12)'])}}}

function tr2(o,l){return o[l]||o.en}

/* ================================================= the walls of the other side: staring eyes, veins and reaching tentacles */
function spawnTentacles(ri){let n=0;
  for(let a=0;a<3000&&n<34;a++){const x=ri(2,MW-3),y=ri(3,MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y))continue;
    let sx=0,sy=0;if(isSolid(x-1,y))sx=-1;else if(isSolid(x+1,y))sx=1;else if(isSolid(x,y-1))sy=-1;else if(isSolid(x,y+1))sy=1;else continue;
    if(decos.some(d=>d.k==='tentacle'&&Math.abs(d.tx-x)+Math.abs(d.ty-y)<3))continue;
    decos.push({tx:x,ty:y,k:'tentacle',sx,sy,len:16+ri(0,16),ph:Math.random()*99,reach:0,cd:ri(0,200),grab:0});n++}}
function tentBase(d){const x=d.tx*T,y=d.ty*T;return d.sx<0?[x,y+8,0]:d.sx>0?[x+16,y+8,Math.PI]:d.sy<0?[x+8,y,Math.PI/2]:[x+8,y+16,-Math.PI/2]}
function tentPts(d){const [bx,by,ang]=tentBase(d),N=12,t=frame*.035+d.ph,L=d.len*(1+d.reach*1.6),pts=[[bx,by]];let x=bx,y=by,a=ang;
  const tgt=P?Math.atan2(P.y+P.h/2-by,P.x+P.w/2-bx):ang;let da=tgt-ang;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
  for(let i=1;i<=N;i++){const k=i/N;a=ang+da*d.reach*Math.min(1,k*1.6)+Math.sin(t+i*.55)*.32*k*(1-d.reach*.7)+Math.sin(t*.37+d.ph)*.25*k;
    x+=Math.cos(a)*L/N;y+=Math.sin(a)*L/N;pts.push([x,y])}return pts}
function drawTentacle(d){const pts=tentPts(d),N=pts.length-1;d.tip=pts[N];
  for(let i=0;i<=N;i++){const k=i/N,w=Math.max(1,4.2*(1-k)+1),[x,y]=pts[i];
    ctx.fillStyle='#24081a';ctx.beginPath();ctx.arc(x,y,w+.6,0,7);ctx.fill();ctx.fillStyle=d.grab>0?'#7a1a3a':'#5a1a3e';ctx.beginPath();ctx.arc(x,y,w,0,7);ctx.fill();
    ctx.fillStyle='rgba(170,70,120,.6)';ctx.fillRect(x-w*.5,y-w*.7,w*.9,1);
    if(i%2===0&&i>0&&i<N){ctx.fillStyle='rgba(240,170,190,.75)';ctx.fillRect(Math.round(x+w*.3),Math.round(y+w*.2),1,1)}}
  const [tx,ty]=pts[N];if(d.reach>.5){ctx.fillStyle='rgba(255,90,90,.7)';ctx.fillRect(tx-.5,ty-.5,1,1)}}
function updTentacles(){if(!P)return;const pcx=P.x+P.w/2,pcy=P.y+P.h/2;
  for(const d of decos){if(d.k!=='tentacle'||d.dead)continue;const [bx,by]=tentBase(d),dist=Math.hypot(pcx-bx,pcy-by);if(d.cd>0)d.cd--;
    if(d.grab>0){d.grab--;d.held=(d.held||0)+1;if(d.held%120===0){P.inv=0;hurt(1,'cTentacle');P.vx=0;P.vy=0}d.reach=Math.min(1,d.reach+.05);const tp=d.tip||[bx,by];P.x+=(tp[0]-P.w/2-P.x)*.25;P.y+=(tp[1]-P.h/2-P.y)*.25;P.vx=0;P.vy=0;P.climb=null;
      if(frame%20===0)shake=Math.max(shake,2);
      if(hit.jump||hit.dig||hit.mdig||hit.weapon){d.struggle=(d.struggle||0)+1;particle(pcx,pcy,['#3a0a1a','#7a1a3a'],4,1.2,14,.1,1)}
      if(d.grab<=0||d.struggle>=4||P.dead){d.grab=0;d.struggle=0;d.cd=420;P.vy=-2.5;P.vx=(pcx<bx?-1:1)*2;sfx.squish()}
      continue}
    const want=d.cd<=0&&dist<d.len*2.6+12&&!P.dead&&state==='play'&&los(bx,by,pcx,pcy);
    d.reach=want?Math.min(1,d.reach+.025):Math.max(0,d.reach-.03);
    if(want&&d.reach>.3&&frame%90===0&&Math.random()<.15&&sfx.whisper)sfx.whisper();
    const tp=d.tip;
    if(tp&&!d.weak&&d.reach>.6&&!(P.inv>0)&&Math.abs(tp[0]-pcx)<P.w/2+3&&Math.abs(tp[1]-pcy)<P.h/2+3&&!decos.some(o=>o.k==='tentacle'&&o.grab>0)){
      d.grab=300;d.held=0;d.struggle=0;shake=Math.max(shake,3);sfx.chomp&&sfx.chomp();floatText(pcx,P.y-10,LANG==='fi'?'Rimpuile irti!':'Struggle free!','#ff8a9a')}
    // a swing at the tentacle makes it flinch back
    if(melee&&tp&&d.reach>.2){const b=meleeBox(melee.side,melee.reach);if(tp[0]>b.x&&tp[0]<b.x+b.w&&tp[1]>b.y&&tp[1]<b.y+b.h){d.reach=0;d.cd=300;d.grab=0;particle(tp[0],tp[1],['#3a0a1a','#7a1a3a','#c86a8a'],10,1.6,20,.1,1);sfx.squish()}}}}
function drawStareEye(d,x,y,big){const s=big?2:1,ox=d.sx<0?x+3:d.sx>0?x+13-6*s:x+8-3*s,oy=d.sy<0?y+1:d.sy>0?y+15-4*s:y+6,blinkP=(frame+d.tx*53+d.ty*29)%(big?340:220),bl=blinkP<10?1-Math.abs(blinkP-5)/5:0;
  const pcx=P?P.x+P.w/2:ox,pcy=P?P.y+P.h/2:oy,a=Math.atan2(pcy-oy,pcx-ox),near=P&&Math.hypot(pcx-ox,pcy-oy)<6*T;
  const w=6*s,h=4*s;ctx.fillStyle='#1a0408';ctx.beginPath();ctx.ellipse(ox+w/2,oy+h/2,w/2+1,h/2+1,0,0,7);ctx.fill();
  const lid=h*bl;if(lid<h-.5){ctx.save();ctx.beginPath();ctx.rect(ox-1,oy+lid/2,w+2,h-lid);ctx.clip();
    ctx.fillStyle='#e8d8c0';ctx.beginPath();ctx.ellipse(ox+w/2,oy+h/2,w/2,h/2,0,0,7);ctx.fill();
    const px=ox+w/2+Math.cos(a)*w*.22,py=oy+h/2+Math.sin(a)*h*.18;ctx.fillStyle=near?'#c01818':'#7a1010';ctx.beginPath();ctx.arc(px,py,1.3*s,0,7);ctx.fill();
    ctx.fillStyle='#000';ctx.fillRect(Math.round(px)-(big?1:0),Math.round(py)-s,s,s*2);ctx.restore()}
  if(big){ctx.strokeStyle='rgba(120,20,30,.6)';ctx.lineWidth=.6;for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(ox+k*5,oy-1);ctx.lineTo(ox+k*5-2,oy-4);ctx.stroke()}}}
function drawVein(d,x,y){const p=.5+.5*Math.sin(frame*.06+d.tx),bx=d.sx<0?x:x+16,dir=d.sx<0?1:-1;ctx.strokeStyle=`rgba(${90+p*60|0},10,24,.8)`;ctx.lineWidth=1;
  for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(bx,y+3+k*5);ctx.quadraticCurveTo(bx+dir*(5+k*2),y+1+k*6,bx+dir*(3+k*3),y+8+k*3);ctx.stroke()}}

/* ================================================= horror moments: for a heartbeat the world shows its other side */
let horror=null,nextHorror=0;
const horrorOn=()=>!!horror&&horror.t>0&&!horror.blank;
function startHorror(){if(!P)return;const pcx=P.x+P.w/2,pcy=P.y+P.h/2,eyes=[],tents=[];
  const x0=Math.floor((cam.x)/T),x1=Math.floor((cam.x+VW)/T),y0=Math.floor(cam.y/T),y1=Math.floor((cam.y+VH)/T);
  const cand=[];for(let y=Math.max(1,y0);y<=Math.min(MH-2,y1);y++)for(let x=Math.max(1,x0);x<=Math.min(MW-2,x1);x++){if(!isSolid(x,y))continue;
    const open=!isSolid(x-1,y)?-1:!isSolid(x+1,y)?1:!isSolid(x,y+1)?2:!isSolid(x,y-1)?-2:0;if(open)cand.push([x,y,open])}
  for(let k=cand.length-1;k>0;k--){const j=Math.random()*(k+1)|0;[cand[k],cand[j]]=[cand[j],cand[k]]}
  for(const [x,y,o] of cand.slice(0,22))eyes.push({tx:x,ty:y,sx:o===-1?1:-1,big:Math.random()<.3});
  // tentacles reach out of the walls nearest to you
  const near=cand.map(c=>({c,d:Math.hypot(c[0]*T+8-pcx,c[1]*T+8-pcy)})).filter(q=>q.d>1.5*T).sort((a,b)=>a.d-b.d).slice(0,14);
  for(const {c:[x,y,o]} of near.filter((_,i)=>i%2===0)){const ax=o===-1?x-1:o===1?x+1:x,ay=o===2?y+1:o===-2?y-1:y;
    tents.push({tx:ax,ty:ay,k:'tentacle',sx:o===-1?1:o===1?-1:0,sy:o===2?-1:o===-2?1:0,len:18+Math.random()*16,ph:Math.random()*99,reach:0,cd:0,grab:0})}
  const dur=70+(Math.random()*40|0);horror={t:dur,dur,eyes,tents,blank:false};
  shake=Math.max(shake,4);(sfx.farScream||(()=>{}))();if(sfx.whisper)setTimeout(()=>sfx.whisper(),200);tone(46,1.2,'sawtooth',.06,-12);noise(.4,.06,240,'lowpass')}
function updHorror(){if(inTent||domain){horror=null;return}
  // a running horror moment always plays out and ends, wherever you are
  if(horror){horror.t--;const age=horror.dur-horror.t;horror.blank=age<14&&(age>>2)%2===1||horror.t<10&&(horror.t>>1)%2===0;
    for(const d of horror.tents)d.reach=Math.min(1,age/40)*(horror.t<20?horror.t/20:1);
    if(horror.t<=0||inVoid||inDebug){horror=null;nextHorror=frame+Math.max(2400,7200-level*300)+Math.random()*6000}return}
  if(inVoid||inDebug||!P||state!=='play')return;
  if(level>=9)updTentacles();
  if(!nextHorror)nextHorror=frame+3600+Math.random()*5400;
  if(level>=3&&frame>=nextHorror&&levelTime>900)startHorror()}
/* call when a new layer is built or you change worlds: no theme carries over */
function resetAtmosphere(){horror=null;nextHorror=0;if(typeof nextDread!=='undefined')nextDread=0}

/* ================================================= below the eighth layer the other side starts seeping through */
let corA=null;
function spawnCorruption(lv,H){corA=new Uint8Array(MW*MH);if(inVoid||lv<9)return;const {ri}=H,k=Math.min(1,(lv-8)/5);
  // creeping patches of the other side's rock
  const blobs=2+Math.round(k*7);for(let b=0;b<blobs;b++){const cx=ri(3,MW-4),cy=ri(6,MH-4),r=2+ri(0,2)+Math.round(k*3);
    for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){if(x<1||y<1||x>=MW-1||y>=MH-1)continue;const d=Math.hypot(x-cx,y-cy)+(hash(x,y)%100)/60;if(d<r)corA[idx(x,y)]=1}}
  const put=(kind,n,extra)=>{let c=0;for(let a=0;a<1500&&c<n;a++){const x=ri(2,MW-3),y=ri(4,MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y))continue;
    const s=isSolid(x-1,y)?-1:isSolid(x+1,y)?1:0;if(!s)continue;decos.push({tx:x,ty:y,k:kind,sx:s,sy:0,v:0,...extra});c++}};
  put('eyes',4+Math.round(k*18));put('bigeye',1+Math.round(k*5));put('vein',6+Math.round(k*16));
  let c=0;const nT=Math.round(k*12)+1;for(let a=0;a<2000&&c<nT;a++){const x=ri(2,MW-3),y=ri(4,MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y))continue;
    let sx=0,sy=0;if(isSolid(x-1,y))sx=-1;else if(isSolid(x+1,y))sx=1;else if(isSolid(x,y-1))sy=-1;else continue;
    decos.push({tx:x,ty:y,k:'tentacle',sx,sy,len:14+ri(0,14),ph:Math.random()*99,reach:0,cd:ri(0,300),grab:0,weak:lv<10});c++}}
const corruptAt=i=>!!(corA&&corA[i]);
function drawSeep(){if(inVoid||inDebug||domain||level<9||horror)return;const k=Math.min(1,(level-8)/5),p=.5+.5*Math.sin(frame*.02);
  ctx.setTransform(1,0,0,1,0,0);const g=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.height*.3,cv.width/2,cv.height/2,cv.width*.7);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(40,0,10,${(.25+.2*p)*k})`);ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height)}
function drawHorror(ox,oy){drawSeep();if(!horror||horror.blank||horror.t<=0)return;const k=Math.min(1,(horror.dur-horror.t)/10,horror.t/10);
  ctx.setTransform(S,0,0,S,-ox,-oy);
  for(const d of horror.tents)drawTentacle(d);
  for(const e of horror.eyes)drawStareEye(e,e.tx*T,e.ty*T,e.big);
  ctx.setTransform(1,0,0,1,0,0);const g=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.height*.1,cv.width/2,cv.height/2,cv.width*.6);
  g.addColorStop(0,`rgba(60,0,12,${.25*k})`);g.addColorStop(.6,`rgba(20,0,6,${.65*k})`);g.addColorStop(1,`rgba(0,0,0,${.92*k})`);ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height)}

/* ================================================= the other side is one long, low tunnel full of things that reach */
function buildVoidTunnel(){grid.fill(BED);dmgA.fill(0);webA.fill(0);prot.fill(0);seen.fill(0);if(skyA)skyA.fill(0);corA=new Uint8Array(MW*MH);
  decos=[];springs=[];foes=[];crates=[];pots=[];pickups=[];links=[];shop=null;junk=null;npcs=[];foods=[];gnats=[];drips=[];rocks=[];terms=[];vaults=[];fishes=[];
  surf=null;door={x:-999,y:-999,w:0,h:0};const cy=Math.floor(MH/2),ph=Math.random()*9,ph2=Math.random()*9,tops=[],bots=[];
  for(let x=3;x<MW-3;x++){const top=cy-2-Math.round(1.4+Math.sin(x*.31+ph)*1.4+Math.sin(x*.13+ph2)),bot=cy+2+Math.round(Math.sin(x*.27+ph2)*1.1);tops[x]=top;bots[x]=bot;
    for(let y=top-3;y<=bot+3;y++)grid[idx(x,y)]=STONE;for(let y=top;y<bot;y++)grid[idx(x,y)]=AIR}
  for(const x of [3,MW-4])for(let y=0;y<MH;y++)if(grid[idx(x,y)]===AIR)grid[idx(x,y)]=STONE;
  shaft={x:4,y0:cy,y1:cy};
  const floorY=x=>bots[x]-1,air=(x,y)=>grid[idx(x,y)]===AIR;
  // eyes in the rock all along the walls
  for(let x=4;x<MW-4;x++){if(Math.random()<.5)decos.push({tx:x,ty:tops[x],k:Math.random()<.25?'bigeye':'eyes',sx:0,sy:-1});
    if(Math.random()<.3)decos.push({tx:x,ty:floorY(x),k:'eyes',sx:0,sy:1})}
  // tentacles from the floor and the ceiling; the further you go, the more there are
  for(let x=8;x<MW-6;x+=1){const k=(x-8)/(MW-14);if(Math.random()>.5+k*.4)continue;const fromTop=Math.random()<.5;
    decos.push({tx:x,ty:fromTop?tops[x]:floorY(x),k:'tentacle',sx:0,sy:fromTop?-1:1,len:12+Math.random()*14+k*10,ph:Math.random()*99,reach:0,cd:Math.random()*240|0,grab:0,weak:Math.random()<.45})}
  for(let x=5;x<MW-5;x++){const r=Math.random();if(!air(x,floorY(x)))continue;
    if(r<.06)decos.push({tx:x,ty:floorY(x),k:'skulls',sx:0,sy:1,v:0});else if(r<.12)decos.push({tx:x,ty:floorY(x),k:'bones',sx:0,sy:1,v:Math.random()*4|0});else if(r<.15)decos.push({tx:x,ty:floorY(x),k:'skullcandle',sx:0,sy:1});
    if(Math.random()<.1)decos.push({tx:x,ty:tops[x],k:'chain',sx:0,sy:-1,v:1+(Math.random()*2|0)});if(Math.random()<.18)decos.push({tx:x,ty:tops[x]-1,k:'vein',sx:0,sy:0})}
  return {sx:4,fy:bots[5]}}
