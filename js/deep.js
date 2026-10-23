/*
  Arkeol v0.3.4 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  deep.js – coloured gems, the dragon, layers out of time, the darkness that grows with depth,
            keepsakes found with letters (with rarities), campfires and pan coffee
*/
'use strict';
let era=null;
/* ================================================= gems of many colours */
const GEMS=[
 {id:'amethyst',n:{en:'Amethyst',fi:'Ametisti'},c:[[200,140,255],[110,60,200],[240,224,255]],v:220,b:30,k:-2},
 {id:'topaz',n:{en:'Topaz',fi:'Topaasi'},c:[[255,210,90],[200,140,30],[255,246,200]],v:320,b:22,k:-1},
 {id:'emerald',n:{en:'Emerald',fi:'Smaragdi'},c:[[90,230,130],[30,140,70],[210,255,220]],v:520,b:14,k:.5},
 {id:'sapphire',n:{en:'Sapphire',fi:'Safiiri'},c:[[90,140,255],[30,60,190],[210,225,255]],v:600,b:12,k:.8},
 {id:'diamond',n:{en:'Diamond',fi:'Timantti'},c:[[150,240,255],[40,160,200],[245,255,255]],v:780,b:10,k:1},
 {id:'ruby',n:{en:'Ruby',fi:'Rubiini'},c:[[255,80,100],[170,20,40],[255,210,215]],v:950,b:5,k:1.2},
 {id:'opal',n:{en:'Black opal',fi:'Musta opaali'},c:[[40,30,60],[120,255,200],[255,120,240]],v:2400,b:.4,k:.35}];
const hexOf=c=>'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');
TEX[DIAM]=GEMS.map((g,i)=>tex((px,r)=>{stoneFill(px,r,[92,94,106]);cluster(px,r,g.c,3)},400+i*7));
function gemTypeAt(x,y){const L=Math.min(level,12),ws=GEMS.map(g=>Math.max(.2,g.b+g.k*L)),sum=ws.reduce((a,b)=>a+b,0);
  let r=(hash(x*7+level*131,y*13+level)%10000)/10000*sum;for(let i=0;i<ws.length;i++){r-=ws[i];if(r<=0)return i}return 0}

/* ================================================= keepsakes found with letters */
const RARITY=[{n:{en:'Common',fi:'Tavallinen'},c:'#c8c4bc'},{n:{en:'Uncommon',fi:'Epätavallinen'},c:'#7ae07a'},{n:{en:'Rare',fi:'Harvinainen'},c:'#6aa8ff'},{n:{en:'Epic',fi:'Eeppinen'},c:'#c87aff'},{n:{en:'Legendary',fi:'Legendaarinen'},c:'#ffc84a'}];
const ITEMS=[
 {id:'button',r:0,n:{en:'Brass button',fi:'Messinkinappi'},v:40},
 {id:'stamp',r:0,n:{en:'Postage stamp, 2003',fi:'Postimerkki, 2003'},v:60},
 {id:'cofftin',r:0,n:{en:'Tin of coffee',fi:'Kahvipurkki'},v:0,fx:()=>{P.mats.beans=(P.mats.beans||0)+2}},
 {id:'ring',r:1,n:{en:'Silver ring',fi:'Hopeasormus'},v:180},
 {id:'dyn',r:1,n:{en:'Two sticks of dynamite',fi:'Kaksi dynamiittipötkyä'},v:0,fx:()=>{P.bombs+=2;renderHotbar()}},
 {id:'film',r:1,n:{en:'Undeveloped film',fi:'Kehittämätön filmirulla'},v:160},
 {id:'watch',r:2,n:{en:'Pocket watch, stopped at 4:12',fi:'Taskukello, pysähtynyt 4.12'},v:450},
 {id:'locket',r:2,n:{en:'Locket with a photo',fi:'Medaljonki ja valokuva'},v:520},
 {id:'hmap',r:2,n:{en:'Hand-drawn map of this layer',fi:'Käsin piirretty kartta tästä kerroksesta'},v:0,fx:()=>{seen.fill(1);if(!mapOn)toggleMap();else drawMini()}},
 {id:'compassI',r:3,n:{en:'Brass compass',fi:'Messinkikompassi'},v:900,fx:()=>{if(!P.compass){P.compass=true;return true}}},
 {id:'medal',r:3,n:{en:'Expedition medal, 1911',fi:'Retkikuntamitali, 1911'},v:1100},
 {id:'hglass',r:4,n:{en:"A time traveller's hourglass",fi:'Aikamatkaajan tiimalasi'},v:2500},
 {id:'scarab',r:4,n:{en:'Golden scarab amulet',fi:'Kultainen skarabeusamuletti'},v:1500,fx:()=>{P.maxHp=Math.min(8,P.maxHp+1);P.hp=Math.min(8,P.hp+1)}}];
store.items=store.items||{};
(function(){try{const s=JSON.parse(localStorage.getItem(SKEY)||'null');if(s&&s.items)store.items=s.items}catch(e){}})();
function rollKeepsake(x,y){if(Math.random()>.4)return;const w=[50,27,14,7,2];let r=Math.random()*100,rar=0;for(let i=0;i<5;i++){r-=w[i];if(r<=0){rar=i;break}}
  const pool=ITEMS.filter(i=>i.r===rar);const it=pickR(pool);setTimeout(()=>giveKeepsake(it,x,y),450)}
function giveKeepsake(it,x,y){store.items[it.id]=(store.items[it.id]||0)+1;save();const used=it.fx?it.fx():false;if(it.v&&!used)addMoney(it.v,x,y-8,RARITY[it.r].c);
  floatText(x,y-16,tr(it.n),RARITY[it.r].c);particle(x,y,[RARITY[it.r].c,'#fff'],10+it.r*8,1.4+it.r*.4,30+it.r*6,0,1);
  if(it.r>=2)rareFx(it);else sfx.pickup()}
function rareFx(it){const R2=RARITY[it.r],el=$('rareFx');el.style.setProperty('--rc',R2.c);el.className='rareFx r'+it.r;
  el.innerHTML=`<div class="rays"></div><div class="rcard"><small>${esc(t('rareFind',tr(R2.n)))}</small><b>${esc(tr(it.n))}</b>${it.v?`<span>${fmt(it.v)}</span>`:''}</div>`;
  el.hidden=false;void el.offsetWidth;el.classList.add('on');sfx.relic();[0,140,280,420].slice(0,it.r).forEach((d,i)=>setTimeout(()=>tone(660+i*220,.25,'triangle',.04,120),d));
  if(it.r>=4){shake=Math.max(shake,6);flashes.push({x:P.x+5,y:P.y+5,life:30,max:30,r:10*T})}
  clearTimeout(rareFx.t);rareFx.t=setTimeout(()=>{el.classList.remove('on');setTimeout(()=>el.hidden=true,500)},2900)}

/* ================================================= campfires you build, and pan coffee */
function placeFire(){if(!(P.fires>0))return false;const tx=Math.floor((P.x+P.w/2)/T),fy=Math.floor((P.y+P.h-1)/T);
  if(!P.onGround||SOL[tileAt(tx,fy)]||!isSolid(tx,fy+1)||decos.some(d=>!d.dead&&d.tx===tx&&d.ty===fy&&(d.k==='campfire'||d.k==='torch'||d.k==='ftorch')))return false;
  decos.push({tx,ty:fy,k:'campfire',sx:0,sy:1,own:1});P.fires--;sfx.crate();particle(tx*T+8,fy*T+12,['#ffcf7a','#ff8a2a'],12,1.2,24,-.02,1);return true}
function updRegen(){if(!(P.regen>0))return;P.regen--;if(frame%14===0)parts.push({x:P.x+P.w/2+rand(-2,2),y:P.y-2,vx:rand(-.1,.1),vy:-.35,life:30,max:30,col:'rgba(230,230,230,.45)',g:0,sz:1});
  if(P.regen%300===0&&P.hp<8&&!P.dead){P.hp++;P.maxHp=Math.max(P.maxHp,P.hp);floatText(P.x+5,P.y-8,'+1 ♥','#ff9a8a')}}

/* ================================================= layers out of time */
const ERAS=['stone','roman','medieval','future'];
const ERADECO={stone:[['painting','wall'],['tusk','floor'],['painting','wall'],['flint','floor']],roman:[['column','floor'],['amphora','floor'],['mosaic','floor'],['column','floor']],
  medieval:[['armor','floor'],['swordstone','floor'],['shield','wall'],['armor','floor']],future:[['neon','wall'],['robot','floor'],['holo','floor'],['neon','wall']]};
const SCRAWL={en:['DONT DIG','IT HEARS YOU','DAY 17','WHERE IS THE LIGHT','THEY SING','GO BACK UP','HE SMILES','NOT ALONE','COUNT THE STEPS'],fi:['ÄLÄ KAIVA','SE KUULEE','PÄIVÄ 17','MISSÄ VALO','NE LAULAA','PALAA YLÖS','HÄN HYMYILEE','ET OLE YKSIN','LASKE ASKELEET']};
function spawnDeep(lv,H){const {ri,r,airFloor,far,sy}=H;era=null;if(inVoid){spawnVoidDecor(H);return}
  const put=(where,k,extra)=>{for(let a=0;a<600;a++){const x=ri(2,MW-3),y=ri(sy+1,MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y)||decos.some(d=>d.tx===x&&d.ty===y))continue;
    if(where==='floor'){if(!airFloor(x,y))continue;if(k==='column'||k==='armor'||k==='holo'){if(grid[idx(x,y-1)]!==AIR)continue}decos.push({tx:x,ty:y,k,sx:0,sy:1,v:ri(0,3),...extra});return true}
    const s=isSolid(x-1,y)?-1:isSolid(x+1,y)?1:0;if(!s)continue;decos.push({tx:x,ty:y,k,sx:s,sy:0,v:ri(0,3),...extra});return true}return false};
  // a layer that has slipped out of its own time
  if((DBG&&DBG.era)||lv>=3&&r()<.4){era=(DBG&&DBG.era)||pickR(ERAS);const n=8+ri(0,6);for(let i=0;i<n;i++){const [k,w]=pickR(ERADECO[era]);put(w,k)}for(let i=0;i<1+(r()<.5?1:0);i++)put('floor','rift')}
  // the deeper you go, the worse it gets
  if(lv>=5){const n=lv===5?3:lv===6?6:9+ri(0,4);for(let i=0;i<n;i++){const k=pickR(lv>=7?['blood','blood','hand','scrawl','scrawl','tally']:['blood','tally','scrawl']);put('wall',k,{txt:ri(0,8)})}}
  // the dragon sleeps only far below
  if((DBG&&DBG.dragon)||lv>=7&&r()<(lv>=10?.45:.28)){for(let a=0;a<2000;a++){const x=ri(4,MW-8),y=ri(sy+4,MH-4);if(!far(x,y,18))continue;let ok=true;
      for(let yy=y-3;yy<=y&&ok;yy++)for(let xx=x-1;xx<=x+3&&ok;xx++)if(grid[idx(xx,yy)]!==AIR||prot[idx(xx,yy)])ok=false;
      for(let xx=x-1;xx<=x+3&&ok;xx++)if(!isSolid(xx,y+1))ok=false;if(!ok)continue;foes.push(mkDragon(x*T,(y+1)*T-20.001));break}}}

/* ================================================= the dragon */
function mkDragon(x,y){return {type:'dragon',x,y,w:34,h:20,vx:0,vy:0,st:'sleep',hp:14,t:0,cd:120,side:1,anim:Math.random()*99,hurt:0,dead:false,face:1}}
Object.assign(sfx,{
  roar:()=>{tone(70,1.4,'sawtooth',.09,-30);tone(105,1.2,'square',.04,-50);noise(1.2,.16,600,'bandpass')},
  inhale:()=>{noise(.7,.08,400,'bandpass');tone(60,.7,'sawtooth',.04,30)},
  whisper:()=>{noise(1.6,.03,2600,'bandpass');setTimeout(()=>noise(1.1,.025,3000,'bandpass'),500)},
  farScream:()=>{if(!AC||muted)return;tone(900,1.6,'sine',.012,-500);tone(1200,1.2,'sine',.006,-700)},
  musicbox:()=>{[76,79,75,72,71].forEach((n,i)=>setTimeout(()=>tone(440*Math.pow(2,(n-69)/12)*(i===2?.97:1),.4,'sine',.02,0),i*330))}
});
function updDragon(f,dx,dy,dist,sees,fcx,fcy){const pcx=fcx+dx,pcy=fcy+dy;f.anim++;
  if(f.st==='sleep'){f.vx=0;f.vy=Math.min(f.vy+.3,6);move(f);if(f.hitY)f.vy=0;if(frame%70===0)parts.push({x:fcx+f.face*14,y:f.y+4,vx:.1,vy:-.3,life:60,max:60,col:'rgba(160,160,160,.5)',g:-.002,sz:2});
    if((sees&&dist<8*T)||(frame-lastNoise.f<4&&Math.hypot(lastNoise.x-fcx,lastNoise.y-fcy)<5*T))wakeDragon(f);return dist<10*T?.2:0}
  f.cd--;
  if(f.st==='fly'){if(f.anim%420===0)f.side*=-1;const tx=pcx+f.side*70,ty=pcy-48+Math.sin(f.anim*.03)*14;
    f.vx+=clamp((tx-fcx)*.004,-.08,.08);f.vy+=clamp((ty-fcy)*.004,-.08,.08);const sp=Math.hypot(f.vx,f.vy);if(sp>1.6){f.vx*=1.6/sp;f.vy*=1.6/sp}
    f.face=Math.sign(dx)||f.face;if(f.cd<=0&&sees&&dist<11*T){f.st='breath';f.t=48;sfx.inhale()}}
  else if(f.st==='breath'){f.vx*=.9;f.vy*=.9;f.face=Math.sign(dx)||f.face;f.t--;const mx=fcx+f.face*17,my=f.y+6;
    if(frame%3===0)parts.push({x:mx,y:my,vx:f.face*rand(.2,.6),vy:rand(-.3,.1),life:20,max:20,col:pickR(['#ffb347','#ff6a1a','#fff1b0']),g:-.01,sz:1});
    if(f.t<=0){const a0=Math.atan2(pcy-my,pcx-mx);for(let k=-2;k<=2;k++){const a=a0+k*.16,s=4.2;fireballs.push({x:mx-3,y:my-3,w:6,h:6,vx:Math.cos(a)*s,vy:Math.sin(a)*s,b:2,life:120})}
      sfx.whoosh();shake=Math.max(shake,4);f.st='fly';f.cd=190+Math.random()*60}}
  move(f);if(f.hitX)f.vx*=-.5;if(f.hitY)f.vy*=-.5;
  if(state==='play'&&overlap(P,f))hurt(1,'cDragon',fcx);
  return 1}
function wakeDragon(f){if(f.st!=='sleep')return;f.st='fly';f.vy=-2;f.cd=90;sfx.roar();shake=Math.max(shake,9);floatText(f.x+17,f.y-8,t('dragonWakes'),'#ff8a5a')}
function drawDragon(f){const x=Math.round(f.x+f.w/2),y=Math.round(f.y+f.h),hc=f.hurt>0&&(f.hurt>>1)%2,B=hc?'#fff':'#8a1e22',D=hc?'#ddd':'#5a1016',Bel=hc?'#fff':'#d8a040';
  ctx.save();ctx.translate(x,y);if(f.face<0)ctx.scale(-1,1);
  if(f.st==='sleep'){ctx.fillStyle=D;ctx.beginPath();ctx.ellipse(-2,-6,16,7,0,0,7);ctx.fill();ctx.fillStyle=B;ctx.beginPath();ctx.ellipse(-2,-7,14,6,0,0,7);ctx.fill();
    ctx.fillStyle=D;ctx.beginPath();ctx.moveTo(-6,-12);ctx.lineTo(4,-16);ctx.lineTo(8,-10);ctx.fill();
    ctx.fillStyle=B;ctx.beginPath();ctx.ellipse(13,-4,6,3.5,0,0,7);ctx.fill();R(16,-6,2,1,'#1a0808');R(9,-8,1,2,'#e8d8a0');
    ctx.strokeStyle=B;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-16,-5);ctx.quadraticCurveTo(-24,0,-14,1);ctx.stroke();ctx.restore();return}
  const fl=Math.sin(frame*.18+f.anim);
  // tail
  ctx.strokeStyle=B;ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-10,-10);ctx.quadraticCurveTo(-22,-6+fl*3,-30,-12+fl*2);ctx.stroke();ctx.fillStyle=D;ctx.beginPath();ctx.moveTo(-30,-12+fl*2);ctx.lineTo(-35,-15+fl*2);ctx.lineTo(-33,-9+fl*2);ctx.fill();
  // far wing
  ctx.fillStyle=D;ctx.beginPath();ctx.moveTo(-2,-14);ctx.lineTo(-6,-30-fl*10);ctx.lineTo(-18,-22-fl*6);ctx.lineTo(-10,-14);ctx.fill();
  // body, belly, legs
  ctx.fillStyle=B;ctx.beginPath();ctx.ellipse(-2,-11,13,7,0,0,7);ctx.fill();ctx.fillStyle=Bel;ctx.beginPath();ctx.ellipse(-1,-8,10,3.5,0,0,7);ctx.fill();
  for(let i=-8;i<6;i+=3)R(i,-9,1,2,'#b88030');R(-8,-5,3,5,D);R(4,-5,3,5,D);R(-9,-1,4,1,'#e8d8a0');R(3,-1,4,1,'#e8d8a0');
  // neck and head
  ctx.strokeStyle=B;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(8,-14);ctx.quadraticCurveTo(13,-22,16,-20);ctx.stroke();
  ctx.fillStyle=B;ctx.beginPath();ctx.ellipse(18,-20,6,4,.15,0,7);ctx.fill();R(14,-25,2,3,'#e8d8a0');R(17,-26,2,3,'#e8d8a0');
  const open=f.st==='breath'?2+Math.round((48-f.t)/16):0;R(19,-18,6,2+open,D);if(open){R(20,-17,4,open,'#ff6a1a');R(21,-17,2,1,'#fff1b0')}R(24,-20,1,1,'#1a0808');
  // near wing
  ctx.fillStyle=B;ctx.beginPath();ctx.moveTo(0,-15);ctx.lineTo(2,-34-fl*12);ctx.lineTo(-14,-26-fl*8);ctx.lineTo(-4,-14);ctx.fill();ctx.strokeStyle=D;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-15);ctx.lineTo(-8,-27-fl*9);ctx.stroke();
  ctx.restore()}

/* ================================================= drawing the new decorations */
function drawDeepDeco(d){const x=d.tx*T,y=d.ty*T,v=d.v||0;
  switch(d.k){
  case 'painting':{const ox=d.sx<0?x+1:x+9;ctx.globalAlpha=.85;R(ox,y+5,1,4,'#b85a2a');R(ox+1,y+5,1,1,'#b85a2a');R(ox+3,y+4,1,5,'#b85a2a');R(ox+2,y+6,3,1,'#b85a2a');R(ox,y+11,6,3,'#8a3a1a');R(ox+1,y+10,4,1,'#8a3a1a');R(ox+5,y+12,1,3,'#8a3a1a');R(ox,y+14,1,1,'#8a3a1a');ctx.globalAlpha=1;break}
  case 'tusk':{ctx.strokeStyle='#efe8d8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+2,y+15);ctx.quadraticCurveTo(x+4,y+4,x+13,y+6);ctx.stroke();ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+5,y+15);ctx.quadraticCurveTo(x+7,y+9,x+12,y+10);ctx.stroke();break}
  case 'flint':{R(x+4,y+13,5,3,'#5a5a66');R(x+5,y+12,3,1,'#7a7a88');R(x+10,y+14,3,2,'#4a4a56');break}
  case 'column':{R(x+3,y-10,10,3,'#e8e2d4');R(x+4,y-7,8,21,'#d8d2c4');for(let i=0;i<3;i++)R(x+5+i*2,y-7,1,21,'#b8b2a4');R(x+2,y+14,12,2,'#c8c2b4');ctx.fillStyle='#d8d2c4';ctx.beginPath();ctx.moveTo(x+3,y-10);ctx.lineTo(x+8,y-14);ctx.lineTo(x+13,y-10);ctx.fill();break}
  case 'amphora':{R(x+5,y+4,6,10,'#b86a3a');R(x+4,y+6,8,6,'#b86a3a');R(x+6,y+2,4,2,'#a85a2a');R(x+3,y+4,1,4,'#8a4a2a');R(x+12,y+4,1,4,'#8a4a2a');R(x+5,y+9,6,1,'#1a1410');R(x+7,y+14,2,2,'#8a4a2a');break}
  case 'mosaic':{const C=['#c8a040','#3d5fb8','#e8e2d4','#a83a2a'];for(let i=0;i<8;i++)R(x+i*2,y+15,2,1,C[(i+v)%4]);break}
  case 'armor':{R(x+5,y-12,6,5,'#8f99a3');R(x+6,y-10,4,1,'#1a1a20');R(x+4,y-7,8,9,'#a8b0b8');R(x+4,y-7,8,1,'#c8d0d8');R(x+3,y-6,1,7,'#8f99a3');R(x+12,y-6,1,7,'#8f99a3');R(x+5,y+2,2,12,'#8f99a3');R(x+9,y+2,2,12,'#8f99a3');R(x+13,y-10,1,24,'#6b4426');R(x+12,y-12,3,2,'#c8d0d8');break}
  case 'swordstone':{R(x+2,y+10,12,6,'#6a6c77');R(x+3,y+9,10,1,'#80828c');R(x+7,y-1,2,11,'#c8d0d8');R(x+5,y+1,6,1,'#c8a040');R(x+7,y-3,2,2,'#6b4426');if((frame+d.tx*9)%150<5)R(x+8,y,1,1,'#fff');break}
  case 'shield':{const ox=d.sx<0?x+1:x+8;R(ox,y+3,7,8,'#3d5fb8');R(ox+1,y+11,5,1,'#3d5fb8');R(ox+2,y+12,3,1,'#3d5fb8');R(ox+3,y+4,1,8,'#c8a040');R(ox+1,y+6,5,1,'#c8a040');break}
  case 'neon':{const ox=d.sx<0?x:x+11,on=(frame+d.tx*13)%97>3;R(ox,y+2,5,12,'#1a1a24');if(on){R(ox+1,y+3,3,1,v&1?'#ff4ad8':'#4af0ff');R(ox+1,y+6,2,1,'#4af0ff');R(ox+1,y+9,3,1,v&1?'#4af0ff':'#ff4ad8');R(ox+2,y+12,1,1,'#fff')}break}
  case 'robot':{R(x+2,y+9,12,7,'#7a828c');R(x+3,y+10,10,1,'#9aa2ac');R(x+4,y+4,7,5,'#8f99a3');R(x+5,y+5,2,2,(frame>>4)%2?'#ff3a3a':'#5a1a1a');R(x+9,y+5,1,2,'#3a3236');R(x+11,y+2,1,3,'#5e6670');R(x+13,y+13,3,2,'#5e6670');break}
  case 'holo':{if((frame+d.tx*7)%60<3)break;ctx.globalAlpha=.45+Math.sin(frame*.2)*.1;ctx.fillStyle='#6af8ff';R(x+6,y-10,4,4,'#6af8ff');R(x+5,y-6,6,8,'#6af8ff');R(x+5,y+2,2,8,'#6af8ff');R(x+9,y+2,2,8,'#6af8ff');for(let k=0;k<4;k++)R(x+3,y-10+((frame>>1)+k*6)%22,10,1,'rgba(255,255,255,.6)');R(x+3,y+14,10,2,'#2a6a7a');ctx.globalAlpha=1;break}
  case 'rift':{const s=Math.sin(frame*.07+d.tx);ctx.save();ctx.translate(x+8,y+4);for(let k=3;k>0;k--){ctx.fillStyle=['','rgba(255,255,255,.7)','rgba(200,120,255,.55)','rgba(110,60,220,.4)'][k];ctx.beginPath();ctx.ellipse(0,0,3+k*2+s,7+k*3+s,0,0,7);ctx.fill()}ctx.restore();
    if(frame%5===0){const a=Math.random()*7;parts.push({x:x+8+Math.cos(a)*12,y:y+4+Math.sin(a)*16,vx:-Math.cos(a)*.5,vy:-Math.sin(a)*.6,life:22,max:22,col:'#d8a0ff',g:0,sz:1})}break}
  case 'blood':{const ox=d.sx<0?x:x+10;ctx.globalAlpha=.8;R(ox,y+2,6,5,'#5a0a0e');R(ox+1,y+7,2,6,'#6a0c12');R(ox+4,y+6,1,8,'#5a0a0e');R(ox+2,y+3,2,2,'#7a1218');ctx.globalAlpha=1;break}
  case 'hand':{const ox=d.sx<0?x+1:x+9;ctx.globalAlpha=.85;R(ox,y+6,5,5,'#6a0c12');for(let i=0;i<4;i++)R(ox+i+(i>2?1:0),y+2+(i===1||i===2?-1:0),1,4,'#6a0c12');R(ox+5,y+8,2,1,'#6a0c12');R(ox+2,y+11,1,3,'#5a0a0e');ctx.globalAlpha=1;break}
  case 'tally':{const ox=d.sx<0?x+1:x+3;ctx.globalAlpha=.7;for(let i=0;i<4;i++)R(ox+i*2,y+4,1,7,'#8a7a6a');ctx.strokeStyle='#8a7a6a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(ox-1,y+9);ctx.lineTo(ox+8,y+5);ctx.stroke();ctx.globalAlpha=1;break}
  case 'scrawl':{const txt=(SCRAWL[LANG]||SCRAWL.en)[d.txt%9];ctx.save();ctx.font='5px Silkscreen, monospace';ctx.fillStyle='rgba(120,10,16,.9)';ctx.textBaseline='top';const w=ctx.measureText(txt).width;ctx.fillText(txt,d.sx<0?x+1:x+15-w,y+5);ctx.restore();break}
  default:return false}
  return true}
function deepLight(hole,glows){for(const d of decos){if(d.dead)continue;const x=d.tx*T+8,y=d.ty*T+8;
    if(d.k==='rift'){hole(x,y-4,2.6*T,.7);glows.push([x,y-4,2*T,'rgba(180,110,255,.22)'])}
    else if(d.k==='neon'&&(frame+d.tx*13)%97>3){hole(x,y,1.8*T,.55);glows.push([x,y,1.4*T,d.v&1?'rgba(255,80,220,.16)':'rgba(80,240,255,.16)'])}
    else if(d.k==='holo'){hole(x,y-2,1.6*T,.5);glows.push([x,y-2,1.3*T,'rgba(100,240,255,.15)'])}}
  for(const f of foes)if(!f.dead&&f.type==='dragon'&&f.st==='breath'){const mx=f.x+f.w/2+f.face*17,my=f.y+6;hole(mx,my,3*T,.85);glows.push([mx,my,2.4*T,'rgba(255,120,40,.3)'])}}
/* ambient dread in the deep */
let nextDread=0;
function updDeep(){updRegen();if(level<6||state!=='play')return;if(!nextDread)nextDread=frame+1800;if(frame<nextDread)return;
  nextDread=frame+Math.max(1200,3600-level*200)+Math.random()*1800;const k=Math.random();if(k<.45)sfx.whisper();else if(k<.75)sfx.farScream();else sfx.musicbox()}

EXTRA_UPD.dragon=updDragon;EXTRA_DRAW.dragon=drawDragon;
EXTRA_KILL.dragon=f=>{sfx.roar();shake=Math.max(shake,12);particle(f.x+17,f.y+10,['#8a1e22','#d8a040','#ff6a1a','#fff1b0'],50,3,60,.15,2);addMoney(1500,f.x+17,f.y-10,'#ffd27a');
  for(let k=0;k<3;k++){const gi=4+(Math.random()*3|0);pickups.push({x:f.x+10+k*5,y:f.y,w:7,h:6,vx:rand(-1.5,1.5),vy:rand(-3.5,-2),kind:'gem',gid:Math.min(6,gi),value:GEMS[Math.min(6,gi)].v,t:0})}
  const rel=chooseRelic();pickups.push({x:f.x+16,y:f.y,w:8,h:8,vx:0,vy:-3,kind:'relic',rid:rel.id,value:rel.value,t:0});unlock('dragon1')};
