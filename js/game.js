/*
  Arkeol v0.3.5 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
/* =========================================================== helpers */
function particle(x,y,col,n,spd,life,grav,size){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,s=Math.random()*spd;
  parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-(grav>0?spd*.4:0),life:life*(.6+Math.random()*.6),max:life,col:Array.isArray(col)?col[i%col.length]:col,g:grav,sz:size||1})}}
function floatText(x,y,txt,col){texts.push({x,y,txt,col,life:80})}
const TILECOL={[SAND]:['#d0b886','#b69e6e','#e4d0a0'],[ICE]:['#cfeeff','#9ccaf0','#ffffff'],[DIRT]:['#76503a','#5c3d26','#8c6340'],[STONE]:['#6c6e79','#565863','#80828c'],[GOLD]:['#f2c84b','#6c6e79','#b07c20'],
  [DIAM]:['#6ef2ff','#5c5e6a','#1c96c4'],[PLATE]:['#6c6e79','#565863'],[TRAPL]:['#565863','#3e3f48'],[TRAPR]:['#565863','#3e3f48'],
  [BRICK]:['#be9862','#8a6a40'],[GLYPH]:['#be9862','#5c4226'],[GRAN]:['#484450','#96686f','#2a2830']};
function wakeWater(){waterAwake=true}
function breakTile(tx,ty,quiet,byAcid){
  const i=idx(tx,ty),tt=tileAt(tx,ty);if(!SOL[tt]||tt===BED||tt===SHOPB||tt===VAULT||tt===VDOOR)return;
  grid[i]=AIR;dmgA[i]=0;
  const cx=tx*T+8,cy=ty*T+8;lastNoise={x:cx,y:cy,f:frame};
  particle(cx,cy,TILECOL[tt]||'#777',10,2.2,30,.2,2);
  if(tt===GOLD){const n=2+(Math.random()*2|0);for(let k=0;k<n;k++)pickups.push({x:cx-3,y:cy-3,w:6,h:5,vx:rand(-1.2,1.2),vy:rand(-2.5,-1),kind:'gold',value:50+(Math.random()*7|0)*10,t:0})}
  if(tt===DIAM){const gi=gemTypeAt(tx,ty),G=GEMS[gi];pickups.push({x:cx-3,y:cy-3,w:7,h:6,vx:rand(-1,1),vy:-2.4,kind:'gem',gid:gi,value:Math.round(G.v*(.9+Math.random()*.2)/5)*5,t:0})}
  if((tt===STONE&&biome==='hot'&&Math.random()<.07)||(tt===GRAN&&Math.random()<.035))dropMat('powder',cx,cy);
  if((tt===BRICK||tt===GLYPH)&&Math.random()<.12)pickups.push({x:cx-3,y:cy-3,w:6,h:5,vx:rand(-1,1),vy:-2,kind:'gold',value:120,t:0});
  if(tt===PLANK){P.planks=(P.planks||0)+1;renderHotbar()}
  if(tt===TRAPL||tt===TRAPR||tt===PLATE)links=links.filter(l=>!((l.tx===tx&&l.ty===ty)||(l.px===tx&&l.py===ty)));
  for(const p of puddles)if(p.tx===tx&&p.ty===ty){p.life=0;acids.push({x:cx,y:ty*T,vx:0,vy:.5,life:0})}
  for(const a of arrows)if(a.stuck&&Math.floor(a.sx/T)===tx&&Math.floor(a.sy/T)===ty)a.life=0;
  for(const p of pickups)if(p.still&&p.kind==='parrow'&&Math.abs(p.x+4-cx)<12&&Math.abs(p.y-cy)<12)p.still=false;
  springs=springs.filter(s=>!(s.tx===tx&&s.ty===ty));
  wakeWater();sandAwake=true;
  if(!byAcid)store.stats.blocks++;
  if(!quiet)sfx.brk();
}
function damageTile(tx,ty,amt){const tt=tileAt(tx,ty);if(!SOL[tt])return false;if(tt===BED||tt===SHOPB){if(Math.random()<.3)particle(tx*T+8,ty*T+8,'#888',2,1.5,10,.1,1);return true}
  const i=idx(tx,ty);dmgA[i]+=amt;if(dmgA[i]>=HP[tt])breakTile(tx,ty);return true}
function hurt(n,why,fromX){
  if(P.inv>0||P.dead||state!=='play')return;
  P.hp-=n;P.inv=80;shake=Math.max(shake,7);sfx.hurt();P.climb=null;
  if(fromX!==undefined){P.vx=(P.x+P.w/2<fromX?-1:1)*2.6;P.vy=-3}
  particle(P.x+P.w/2,P.y+P.h/2,['#e2483d','#a02b24'],10,2.5,30,.2,1.5);
  $('hurt').style.opacity=1;
  if(P.hp<=0){P.hp=0;P.dead=true;P.cause=why;state='dead';P.vy=-4;P.line=null;setTimeout(gameOver,1400)}
}
function damageFoe(f,dmg,fromX,how){
  if(f.dead)return;f.hp-=dmg;f.hurt=10;if(P){f.mx=P.x+P.w/2;f.my=P.y+P.h/2;f.mt=frame}
  if(fromX!==undefined){const d=Math.sign(f.x+f.w/2-fromX)||1;f.vx=d*(f.type==='wolf'?2.4:1.8);if(f.st==='hang')f.st='fall';else f.vy=Math.min(f.vy,-1.8)}
  if(f.type==='wolf'&&f.st!=='chase')f.st='chase';
  if(f.type==='mummy'&&f.st!=='chase'){f.st='chase';f.groan=200;sfx.groan()}
  onExtraHurt(f);if(f.type==='dragon')wakeDragon(f);
  if(f.hp<=0)killFoe(f,how);else sfx.squish();
}
function killFoe(f,how){if(f.dead)return;f.dead=true;levelKills++;if(runKills[f.type]!==undefined)runKills[f.type]++;
  if(EXTRA_KILL[f.type])EXTRA_KILL[f.type](f);
  else if(f.type==='spider'){sfx.squish();particle(f.x+6,f.y+5,['#a6f03a','#2b3320','#6fb42a'],16,2.4,40,.2,1.5);store.stats.spiders++;addMoney(25,f.x+6,f.y-4,'#c9f58a')}
  else if(f.type==='mummy'){sfx.groan(.5);particle(f.x+5,f.y+8,['#d8cca8','#a89878','#6a5a48'],22,2.4,50,.15,1.5);store.stats.mummies=(store.stats.mummies||0)+1;addMoney(200,f.x+5,f.y-4,'#efe4c0');if(Math.random()<.15){const rel=chooseRelic();pickups.push({x:f.x,y:f.y,w:8,h:8,vx:0,vy:-2,kind:'relic',rid:rel.id,value:rel.value,t:0})}}
  else{sfx.growl();particle(f.x+7,f.y+5,['#7d7f88','#4a4b52','#a02b24'],18,2.4,40,.2,1.5);store.stats.wolves++;addMoney(60,f.x+7,f.y-4,'#d9dbe2');
    if(Math.random()<.5)pickups.push({x:f.x+4,y:f.y,w:6,h:5,vx:rand(-1,1),vy:-2,kind:'gold',value:150,t:0,fang:true})}
  if(how==='stomp')unlock('stomp');if(how==='ranged'&&P&&Math.hypot(f.x-P.x,f.y-P.y)>6*T)unlock('sniper');
  save();
}
function addMoney(v,x,y,col){if(x!==undefined&&v>0&&P.goldK)v=Math.round(v*P.goldK);P.money+=v;P.earned+=v;if(x!==undefined)floatText(x,y,`+${fmt(v)}`,col||'#ffe08a')}
function recordRun(){let nr=false;if(P.earned>store.best&&P.earned>0){store.best=P.earned;nr=true}if((P.maxDepth||0)>store.bestDepth){store.bestDepth=P.maxDepth;nr=true}save();return nr}
function gameOver(){
  const nr=recordRun();$('newRec').hidden=!nr;$('newRec').textContent=t('newRecord');
  state='over';
  const ep=STR[LANG].epitaphs;$('epitaph').textContent=ep[Math.floor(Math.random()*ep.length)];
  $('cause').textContent=t('recap',{ch:level,chName:chapterName(level),depth:P.maxDepth||0,money:fmt(P.earned),earned:P.earned,gems:gemsTotal,relics:relicsRun,lore:runFinds,k:runKills,cause:P.cause?t(P.cause):'?'});
  $('oDepth').textContent=`${P.maxDepth||0} m`;$('oMoney').textContent=fmt(P.earned);
  $('oGems').textContent=gemsTotal;$('oRelics').textContent=relicsRun;$('oBest').textContent=fmt(store.best);
  $('over').hidden=false;setTimeout(()=>$('againBtn').focus(),50);
}
const REACH=2.1*T;
function keyAim(){
  const U=held.up,D=held.down,cx=P.x+P.w/2,cy=P.y+P.h/2;
  if(typeof PAD!=='undefined'&&PAD.aim!==null){const an=PAD.aim,hx=cx+Math.cos(an)*14,hy=cy+Math.sin(an)*14;return {tx:Math.floor(hx/T),ty:Math.floor(hy/T),ang:an,hx,hy}}
  if(U&&!P.climb)return {tx:Math.floor(cx/T),ty:Math.floor((P.y-3)/T),ang:-Math.PI/2,hx:cx,hy:P.y-6};
  if(D&&!P.climb)return {tx:Math.floor(cx/T),ty:Math.floor((P.y+P.h+3)/T),ang:Math.PI/2,hx:cx,hy:P.y+P.h+6};
  return {tx:Math.floor((cx+P.face*(P.w/2+4))/T),ty:Math.floor(cy/T),ang:P.face>0?0:Math.PI,hx:cx+P.face*12,hy:cy};
}
function mouseAim(){
  if(!mouse.seen)return keyAim();
  const m=mouseWorld(),cx=P.x+P.w/2,cy=P.y+P.h/2-2;let dx=m.x-cx,dy=m.y-cy;const d=Math.hypot(dx,dy)||1;dx/=d;dy/=d;
  const ang=Math.atan2(dy,dx);let tx=null,ty=null;
  for(let s=3;s<=Math.min(REACH,d+2);s+=2){const x=Math.floor((cx+dx*s)/T),y=Math.floor((cy+dy*s)/T);if(isSolid(x,y)){tx=x;ty=y;break}}
  return {tx,ty,ang,hx:cx+dx*12,hy:cy+dy*12};
}
const aimFor=src=>src==='mouse'?mouseAim():keyAim();
function setFaceFromAim(a){const c=Math.cos(a.ang);if(Math.abs(c)>.2)P.face=c>0?1:-1;P.ang=a.ang;let d=a.ang-P.aimAng;d=Math.atan2(Math.sin(d),Math.cos(d));P.aimAng+=d*.7}
/* forgiving melee: a swing hits any enemy roughly on that side, and keeps hitting for a few frames */
let melee=null;
function meleeBox(side,reach){const p=P;return {x:side>0?p.x+p.w-3:p.x+3-reach,y:p.y-12,w:reach,h:p.h+16}}
function startMelee(side,reach,dmg,how){melee={t:7,side,reach,dmg,how,done:new Set()};return meleeTick()}
function meleeTick(){if(!melee||!P)return false;const box=meleeBox(melee.side,melee.reach),cx=P.x+P.w/2;let any=false;
  for(const f of foes)if(!f.dead&&!melee.done.has(f)&&overlap(box,f)){melee.done.add(f);damageFoe(f,melee.dmg,cx,melee.how);any=true}return any}
function updMelee(){if(!melee)return;if(--melee.t<=0){melee=null;return}meleeTick()}
function hitStuff(box,dmg,fromX,how){let any=false;
  for(const f of foes)if(!f.dead&&overlap(box,f)&&!(melee&&melee.done.has(f))){if(melee&&how!=='ranged')melee.done.add(f);damageFoe(f,dmg,fromX,how);any=true}
  for(const p of pots)if(!p.broken&&overlap(box,p)){breakPot(p);any=true}
  if(how!=='ranged'&&harvestBox(box))any=true;
  const x0=Math.floor(box.x/T),x1=Math.floor((box.x+box.w)/T),y0=Math.floor(box.y/T),y1=Math.floor((box.y+box.h)/T);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(x<0||y<0||x>=MW||y>=MH)continue;const i=idx(x,y);if(webA[i]){webA[i]=0;any=true;sfx.cut();particle(x*T+8,y*T+6,'rgba(230,232,240,.8)',8,1.2,24,.03,1);if(Math.random()<.6)dropMat('silk',x*T+8,y*T+8)}}
  return any}
function breakPot(p){if(p.broken)return;p.broken=true;sfx.pot();particle(p.x+5,p.y+5,['#a8643a','#7a4428','#c98a5a'],12,2,30,.2,2);
  if(Math.random()<.04&&gainCosmetic(randomCosmetic(),p.x+5,p.y-6))return;
  const r=Math.random(),cx=p.x+2,cy=p.y;
  if(r<.4){const n=1+(Math.random()*2|0);for(let k=0;k<n;k++)pickups.push({x:cx,y:cy,w:6,h:5,vx:rand(-1.2,1.2),vy:rand(-2.5,-1),kind:'gold',value:40+(Math.random()*5|0)*10,t:0})}
  else if(r<.62){pickups.push({x:cx,y:cy,w:6,h:5,vx:rand(-1,1),vy:-2,kind:'gold',value:30,t:0})}
  else if(r<.73){P.bombs++;floatText(p.x+5,p.y-6,t('plus1Bomb'),'#ffe7a8')}
  else if(r<.77){const it=chooseLore();if(it)pickups.push({x:cx,y:cy,w:8,h:6,vx:0,vy:-2,kind:'lore',cat:it.cat,lid:it.id,value:0,t:0})}
  else if(r<.80){const rel=chooseRelic();pickups.push({x:cx,y:cy,w:8,h:8,vx:0,vy:-2.5,kind:'relic',rid:rel.id,value:rel.value,t:0})}
}
function throwRope(down){
  const cx=P.x+P.w/2;let tx=Math.floor(cx/T),ty=Math.floor((P.y+P.h/2)/T);
  if(down&&P.onGround){const fx=tx+P.face;if(isSolid(fx,ty))return false;
    let len=0;while(len<10&&!isSolid(fx,ty+len))len++;ropes.push({tx:fx,top:ty,len,cur:0,head:ty*T});sfx.rope();return true}
  let top=ty;for(let k=0;k<8;k++){if(isSolid(tx,top-1))break;top--}
  let len=0;while(len<11&&!isSolid(tx,top+len))len++;
  if(len<1)return false;ropes.push({tx,top,len,cur:0,head:P.y});sfx.rope();return true;
}
function ropeAt(){const cx=P.x+P.w/2;for(const r of ropes){if(r.cur<1)continue;
  if(cx>=r.tx*T+1&&cx<r.tx*T+T-1&&P.y<(r.top+r.cur)*T&&P.y+P.h>r.top*T)return r}return null}
function explode(x,y){
  const R=2.6*T;sfx.boom();shake=16;flashes.push({x,y,life:26,max:26,r:7*T});store.stats.bombs++;
  for(let ty=Math.floor((y-R)/T);ty<=Math.floor((y+R)/T);ty++)for(let tx=Math.floor((x-R)/T);tx<=Math.floor((x+R)/T);tx++){
    if(Math.hypot(tx*T+8-x,ty*T+8-y)>=R)continue;if(SOL[tileAt(tx,ty)])breakTile(tx,ty,true);if(tx>=0&&ty>=0&&tx<MW&&ty<MH)webA[idx(tx,ty)]=0}
  particle(x,y,['#fff1b0','#ffb347','#ff7a2e','#d63c1e'],40,4,28,.04,2);
  particle(x,y,['#3a3438','#55494c'],20,2,70,-.02,3);
  const d=Math.hypot(P.x+P.w/2-x,P.y+P.h/2-y);
  if(d<R*1.35){P.inv=0;hurt(2,'cBomb',x);P.vy=-5}
  for(const f of foes)if(!f.dead&&Math.hypot(f.x+f.w/2-x,f.y+f.h/2-y)<R*1.4)killFoe(f,'bomb');
  for(const b of bombs)if(b.fuse>6&&Math.hypot(b.x-x,b.y-y)<R*1.3)b.fuse=6;
  for(const p of pickups){if(p.still&&Math.hypot(p.x-x,p.y-y)<R)p.still=false;if(p.still)continue;const dx=p.x-x,dy=p.y-y,dd=Math.hypot(dx,dy)||1;if(dd<R*1.5){p.vx+=dx/dd*3;p.vy+=dy/dd*3-2}}
  for(const c of crates)if(!c.open&&Math.hypot(c.x+6-x,c.y+5-y)<R)openCrate(c);
  for(const p of pots)if(!p.broken&&Math.hypot(p.x+5-x,p.y+5-y)<R)breakPot(p);
  save();
}
function openCrate(c){c.open=true;sfx.crate();particle(c.x+6,c.y+5,['#a8743c','#7a5228'],10,2,30,.2,2);dropMat('wood',c.x+6,c.y+4,1+(Math.random()<.5?1:0));if(Math.random()<.18)dropMat('beans',c.x+6,c.y+4);if(Math.random()<.25)dropMat('scrap',c.x+6,c.y+4);
  if(Math.random()<.12){const lk=lockedRecipes();if(lk.length){pickups.push({x:c.x+2,y:c.y,w:8,h:6,vx:0,vy:-2,kind:'recipe',rid:pickR(lk).id,value:0,t:0});return}}
  if(Math.random()<.16&&gainCosmetic(randomCosmetic(),c.x+6,c.y-6)){renderHotbar();return}
  const r=Math.random();let txt;
  if(!P.hasDrill&&r<.3){P.hasDrill=true;P.fuel=60;txt=t('foundDrill');sfx.relic()}else if(!P.weapons.length&&r<.42){giveWeapon('bow');P.slot=1;P.arrows+=6;txt=t('foundBow');sfx.relic()}
  else if(r<.48){P.bombs+=2;txt=t('plus2Bombs')}else if(r<.72){P.ropes+=2;txt=t('plus2Ropes')}else if(r<.84&&P.hasDrill){P.fuel=Math.min(100,P.fuel+50);txt=t('fuel50')}
  else if(r<.92&&ammoKind()){const k=ammoKind();P[k]+=k==='arrows'?5:4;txt=k==='arrows'?t('plus5Arrows'):t('plus4Ammo')}else{P.hp=Math.min(P.hp+1,Math.max(P.maxHp,4));txt=t('plusHeart')}
  floatText(c.x+6,c.y-6,txt,'#ffe7a8');renderHotbar()}

/* =========================================================== toolbar: left mouse = pickaxe, right mouse = selected */
const SLOTS=['drill','weapon','rod','bomb','rope','stone','plank','fire','torch'];
const WPN={whip:{n:{en:'Whip',fi:'Ruoska'},ic:'whip',cd:22},bow:{n:{en:'Bow',fi:'Jousipyssy'},ic:'bow',cd:30,am:'arrows'},xbow:{n:{en:'Crossbow',fi:'Varsijousi'},ic:'xbow',cd:58,am:'arrows'},pistol:{n:{en:'Scrap pistol',fi:'Romupistooli'},ic:'pistol',cd:16,am:'ammo'},gun:{n:{en:'Scrap shotgun',fi:'Romuhaulikko'},ic:'gun',cd:46,am:'ammo'}};
const curW=()=>P.weapons[P.wi]||null;
function ammoKind(){if(P.weapons.some(w=>WPN[w].am==='arrows'))return 'arrows';if(P.weapons.some(w=>WPN[w].am==='ammo'))return 'ammo';return null}
function giveWeapon(w){if(!P.weapons.includes(w))P.weapons.push(w);P.wi=P.weapons.indexOf(w);P.slot=1}
function slotNames(){const w=curW();return [P.hasDrill?t(P.drill>2?'drill3':P.drill>1?'drill2':'drill'):t('noDrillS'),w?tr(WPN[w].n)+(WPN[w].am?` · ${P[WPN[w].am]} ${t(WPN[w].am==='arrows'?'arrowsW':WPN[w].am==='souls'?'soulsW':'ammoW')}`:'')+(P.wdur&&P.wdur[w]!==undefined?` · ${t('usesLeft',P.wdur[w])}`:''):t('noWeapon'),P.rod?t('rod'):t('noRodS'),t('bomb'),t('rope'),t('stone'),t('plankS'),t('fireS'),t('torchS')]}
function slotIcon(i){const w=curW();return [!P.hasDrill?ICON.none:P.drill>2?ICON.drill3:P.drill>1?ICON.drill2:ICON.drill,w?ICON[WPN[w].ic]:ICON.none,P.rod?ICON.rod:ICON.none,ICON.bomb,ICON.rope,ICON.stone,ICON.plank,ICON.campfireI,ICON.torch][i]}
function slotHas(i){return [P.hasDrill,P.weapons.length>0,P.rod,P.gotBomb||P.bombs>0,P.gotRope||P.ropes>0,P.gotStone||P.stones>0,P.gotPlank||P.planks>0,P.gotFire||P.fires>0,P.gotTorch||P.torches>0][i]}
function renderHotbar(){if(!P)return;const hb=$('hotbar');
  if(!hb.children.length){
    for(let i=0;i<9;i++){const b=document.createElement('button');b.className='slot';b.type='button';b.innerHTML=`<img alt=""><span class="k">${i+1}</span><span class="n"></span>`;
    b.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();ensureAudio();pickSlot(i)});hb.appendChild(b)}}
  const names=slotNames(),w=curW();
  if(P.bombs>0)P.gotBomb=true;if(P.ropes>0)P.gotRope=true;if(P.stones>0)P.gotStone=true;if(P.planks>0)P.gotPlank=true;if(P.fires>0)P.gotFire=true;if(P.torches>0)P.gotTorch=true;
  P.order=P.order||[];for(const i of [1,0,2,3,4,5,6,7,8])if(slotHas(i)&&!P.order.includes(i))P.order.push(i);
  if(!slotHas(P.slot)){const f=P.order.find(slotHas);if(f!==undefined)P.slot=f}
  [...hb.children].forEach((b,i)=>{b.hidden=!slotHas(i);const pos=P.order.indexOf(i);b.style.order=pos<0?9:pos;b.querySelector('.k').textContent=pos<0?'':pos+1;const img=b.querySelector('img');const src=slotIcon(i);if(img.getAttribute('src')!==src)img.setAttribute('src',src);
    b.classList.toggle('sel',P.slot===i);b.title=names[i];b.setAttribute('aria-label',names[i]);b.dataset.btn=t('rmb');
    b.classList.toggle('off',(i===1&&!w)||(i===2&&!P.rod)||(i===3&&!P.bombs)||(i===4&&!P.ropes)||(i===5&&!P.stones)||(i===6&&!P.planks)||(i===7&&!P.fires)||(i===8&&!P.torches)||(i===0&&(!P.hasDrill||P.fuel<=0)));
    b.querySelector('.n').textContent=i===3?P.bombs:i===4?P.ropes:i===5?P.stones:i===6?P.planks:i===7?(P.fires||0):i===8?(P.torches||0):i===1&&w&&WPN[w].am?P[WPN[w].am]:i===0&&P.hasDrill?Math.round(P.fuel)+'%':''});
  $('fuelGrp').hidden=!P.hasDrill}
let slotNameT=0;
function showSlotName(){const el=$('slotName');el.textContent=slotNames()[P.slot];el.classList.add('on');clearTimeout(slotNameT);slotNameT=setTimeout(()=>el.classList.remove('on'),1300)}
function selectSlot(i){if(!P||!slotHas(i))return;P.slot=i;if(i!==2)P.line=null;renderHotbar();showSlotName()}
function slotAtPos(n){return P&&P.order&&P.order[n]!==undefined?P.order[n]:n}
function stepSlot(d){if(!P||!P.order||!P.order.length)return;let k=P.order.indexOf(P.slot);for(let j=0;j<9;j++){k=(k+d+P.order.length)%P.order.length;if(slotHas(P.order[k]))break}selectSlot(P.order[k])}
function pickSlot(i){if(i===1&&P.slot===1&&P.weapons.length>1)cycleWeapon();else selectSlot(i)}
function cycleWeapon(){if(!P.weapons.length)return;P.wi=(P.wi+1)%P.weapons.length;P.slot=1;P.line=null;sfx.click();renderHotbar();showSlotName()}

/* =========================================================== update */
let drillSnd=0;
function updatePlayer(){
  const p=P;p.anim++;
  if(p.scy>0)p.scy--;if(p.inv>0)p.inv--;if(p.acid>0)p.acid--;if(p.poison>0)p.poison--;if(p.haste>0){p.haste--;if(frame%8===0)parts.push({x:p.x+rand(0,p.w),y:p.y+rand(0,p.h),vx:0,vy:-.4,life:20,max:20,col:'#ffd27a',g:0,sz:1})}if(p.trip>0)p.trip--;if(p.swing>0)p.swing--;if(p.swingCd>0)p.swingCd--;if(p.wcd>0)p.wcd--;if(p.whip>0)p.whip--;
  const L=held.left,R=held.right,U=held.up,D=held.down;
  const dir=(R?1:0)-(L?1:0);if(dir)p.face=dir;
  const cx=p.x+p.w/2;p.maxDepth=Math.max(p.maxDepth||0,curDepth());
  { // aim: the cursor when the mouse is in use, otherwise facing (plus up/down)
    let tgt;const mouseOn=inputMode==='mouse'&&mouse.seen&&!coarse&&(mouse.inside||held.mdig||held.use)&&performance.now()-(mouse.t||0)<6000;
    if(mouseOn&&!p.climb){const m=mouseWorld();const dx=m.x-cx;tgt=Math.atan2(m.y-(p.y+6),dx);if(Math.abs(dx)>3)p.face=dx>0?1:-1}
    else tgt=U&&!p.climb?-Math.PI/2:D&&!p.climb&&!p.onGround?Math.PI/2:D&&!p.climb?Math.PI/2:(p.face>0?.15:Math.PI-.15);
    let d=tgt-p.aimAng;d=Math.atan2(Math.sin(d),Math.cos(d));p.aimAng+=d*.3;
  }
  p.inWater=inWaterAt(cx,p.y+p.h*.6);
  const headWet=inWaterAt(cx,p.y+2);
  let webbed=false;{const x0=Math.floor(p.x/T),x1=Math.floor((p.x+p.w)/T),y0=Math.floor(p.y/T),y1=Math.floor((p.y+p.h)/T);for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>=0&&y>=0&&x<MW&&y<MH&&webA[idx(x,y)])webbed=true}
  if(webbed&&!p.wasWebbed)unlock('web');p.wasWebbed=webbed;
  if(!p.climb){const r=ropeAt();if(r&&(U||(D&&!p.onGround)))p.climb=r}
  if(p.climb&&ropeAt()!==p.climb)p.climb=null;
  if(p.climb){
    const r=p.climb;p.x=r.tx*T+T/2-p.w/2;p.vx=0;p.vy=U?-1.6:D?1.9:0;
    if(p.y+p.vy<r.top*T-4)p.vy=0;p.peak=p.y;
    if(hit.jump){p.climb=null;p.vy=-4.2;p.vx=dir*2;sfx.jump()}
    else{move(p);if(p.hitY)p.vy=0;if(p.onGround&&D)p.climb=null}
  }else{
    const fyI=Math.floor((p.y+p.h+1)/T),onIce=p.onGround&&(tileAt(Math.floor((p.x+1)/T),fyI)===ICE||tileAt(Math.floor((p.x+p.w-1)/T),fyI)===ICE);
    const acc=onIce?.13:p.onGround?.45:.28,max=p.inWater?1.4:onIce?2.5:2.1;
    if(dir)p.vx+=dir*acc;else p.vx*=onIce?.975:p.onGround?.68:.93;
    if(p.launch>0){p.launch--;p.vx*=.985}else{p.vx=clamp(p.vx,-max-.6,max+.6);if(Math.abs(p.vx)>max)p.vx*=.9}if(Math.abs(p.vx)<.05)p.vx=0;
    p.coy=p.onGround?6:p.coy-1;
    p.jbuf=hit.jump?7:p.jbuf-1;
    if(p.inWater){
      if(hit.jump){p.vy=headWet?-2.7:-p.jumpV*.85;sfx.splash();particle(cx,p.y,'#8fc8f0',4,1,16,.1,1)}
      if(U)p.vy-=.12;p.vy=Math.min(p.vy+.12,1.5);p.peak=p.y;
    }else{
      if(p.jbuf>0&&p.coy>0){p.vy=-p.jumpV;p.jbuf=0;p.coy=0;sfx.jump()}
      if(!held.jump&&p.vy<-2&&!(p.launch>0))p.vy*=.84;
      p.vy=Math.min(p.vy+.33,7.5);
    }
    if(webbed){p.vx*=.45;p.vy=Math.min(p.vy*.5,.8);if(p.vy<-1)p.vy=-1}
    const wasG=p.onGround;move(p);if(p.hitX)p.vx=0;if(p.hitY)p.vy=0;
    if(!p.onGround)p.peak=Math.min(p.peak,p.y);
    if(p.onGround&&!wasG){const f=(p.y-p.peak)/T;particle(cx,p.y+p.h,'#6b5a4c',f>3?8:2,1.2,16,.05,1);
      const shaftLand=p.safeShaft&&level===1&&shaft&&Math.abs(cx/T-shaft.x-1)<3&&p.y/T>surf.ground;if(shaftLand)p.safeShaft=false;
      if(p.safeFall||shaftLand){if(!(level===1&&p.y/T<=surf.ground))p.safeFall=false;if(f>3){sfx.land();shake=Math.max(shake,4)}}
      else if(f>=7.5+(p.fallPlus||0)&&!p.softBoots)hurt(f>=11+(p.fallPlus||0)?2:1,'cFall');}
    if(p.onGround)p.peak=p.y;
    if(p.onGround&&Math.abs(p.vx)>.4&&!p.inWater){p.stepAcc=(p.stepAcc||0)+Math.abs(p.vx);if(p.stepAcc>15){p.stepAcc=0;sfx.step(tileAt(Math.floor(cx/T),Math.floor((p.y+p.h+1)/T)))}}
  }
  if(headWet){p.breath-=.28;underwaterT++;if(underwaterT>300)unlock('diver');if(frame%40===0)sfx.bubble();if(frame%12===0)parts.push({x:cx+p.face*3,y:p.y+2,vx:rand(-.2,.2),vy:-.6,life:40,max:40,col:'#bfe6ff',g:-.01,sz:1});
    if(p.breath<=0){p.breath=0;if(frame%50===0){p.inv=0;hurt(1,'cDrown')}}}
  else{underwaterT=0;p.breath=Math.min(p.maxBreath,p.breath+1.4)}
  if(!p.dead&&(tileAt(Math.floor(cx/T),Math.floor((p.y+p.h-2)/T))===LAVA||tileAt(Math.floor(cx/T),Math.floor((p.y+4)/T))===LAVA)){if(p.inv<=0){sfx.sizzle();particle(cx,p.y+p.h,['#ffb347','#ff6a1a','#fff1b0'],14,2.4,24,-.02,1.5)}hurt(2,'cLava');if(!p.dead)p.vy=-5.5}
  if(biome==='cold'&&frame%70===0)for(let k=0;k<3;k++)parts.push({x:cx+p.face*5,y:p.y+3,vx:p.face*rand(.2,.5),vy:rand(-.25,-.05),life:40,max:40,col:'rgba(230,240,255,.55)',g:-.002,sz:2});
  if(p.inWater&&!p.wasWater){sfx.splash();particle(cx,p.y+p.h,'#9fd3f5',8,1.6,20,.15,1)}p.wasWater=p.inWater;

  // pickaxe: X on the keyboard, left mouse button, touch "Pick"
  if((held.dig||held.mdig)&&p.swingCd<=0){const a=aimFor(held.mdig?'mouse':'key');setFaceFromAim(a);p.swing=12;p.swingCd=Math.round((p.pick>1?11:14)*(p.haste>0?.55:1)*(p.digK||1));
    const side=Math.abs(a.hx-cx)>3?Math.sign(a.hx-cx):p.face,dm=p.pick>1?1.5:1;
    if(!startMelee(side,24,dm,'pick')&&!hitStuff({x:a.hx-8,y:a.hy-8,w:16,h:16},dm,cx,'pick')){if(a.tx!==null&&damageTile(a.tx,a.ty,p.pick)){sfx.dig();particle(a.tx*T+8,a.ty*T+8,TILECOL[tileAt(a.tx,a.ty)]||'#888',4,1.6,16,.15,1)}}}
  updMelee();
  // selected item: right mouse, V, touch "Use" — plus direct shortcuts
  const kind=SLOTS[p.slot];
  const viaUse=k=>held.use&&kind===k;
  const srcOf=k=>viaUse(k)&&!held[k]?useSrc:'key';
  p.drilling=false;
  if((held.drill||viaUse('drill'))&&!p.hasDrill){if(!p.noDrillWarn){p.noDrillWarn=true;floatText(cx,p.y-8,t('noDrill'),'#c7d3d9')}}
  else if(held.drill||viaUse('drill')){if(p.fuel>0){const a=aimFor(srcOf('drill'));setFaceFromAim(a);p.drilling=true;p.fuel=Math.max(0,p.fuel-(p.drill>2?.015:p.drill>1?.11:.16));
      if(a.tx!==null&&damageTile(a.tx,a.ty,(p.drill>2?.85:p.drill>1?.42:.24)*(p.haste>0?1.7:1))){if(frame%3===0)particle(a.tx*T+8,a.ty*T+8,TILECOL[tileAt(a.tx,a.ty)]||'#999',2,2,12,.1,1);shake=Math.max(shake,1.2)}
      if(frame%6===0)hitStuff({x:a.hx-7,y:a.hy-7,w:14,h:14},.35,cx,'drill');
      if(++drillSnd%5===0)sfx.drill();if(frame%20===0)renderHotbar()}
    else if(!p.fuelWarn){p.fuelWarn=true;floatText(cx,p.y-8,t('noFuel'),'#c7d3d9')}}
  if(hit.cycle)cycleWeapon();
  if((held.weapon||viaUse('weapon'))&&p.wcd<=0&&p.weapons.length){const a=aimFor(srcOf('weapon'));setFaceFromAim(a);fireWeapon(a,cx)}
  if(hit.fish||(hit.use&&kind==='rod'))useRod(hit.fish?'key':useSrc,cx);
  updateLine(cx);
  const bombPress=hit.bomb||(hit.use&&kind==='bomb');
  if(bombPress&&p.bombs>0){p.bombs--;const viaMouse=hit.use&&kind==='bomb'&&useSrc==='mouse'&&!hit.bomb;
    if(viaMouse&&mouse.seen){const m=mouseWorld();const dx=m.x-cx,dy=m.y-(p.y+4),d=Math.hypot(dx,dy)||1;const pw=clamp(d/22,2,6);
      bombs.push({x:cx-3,y:p.y+4,w:6,h:6,vx:dx/d*pw,vy:dy/d*pw-1.6,fuse:150});p.face=dx>0?1:-1}
    else{const drop=held.down;bombs.push({x:cx-3+(drop?0:p.face*4),y:p.y+4,w:6,h:6,vx:drop?0:p.face*3.6+p.vx*.5,vy:drop?0:(held.up?-5.2:-3.2),fuse:150})}
    renderHotbar()}
  if(hit.use&&kind==='plank'&&p.planks>0)placePlank(useSrc,cx);
  if(hit.use&&kind==='torch'&&p.torches>0){if(placeTorch())renderHotbar();else{sfx.nope();floatText(cx,p.y-8,t('cantPlace'),'#ffb0a0')}}
  if(hit.use&&kind==='fire'&&p.fires>0){if(placeFire())renderHotbar();else{sfx.nope();floatText(cx,p.y-8,t('cantPlace'),'#ffb0a0')}}
  if((hit.throw||(hit.use&&kind==='stone'))&&p.stones>0)throwStone(hit.use&&kind==='stone'&&!hit.throw?useSrc:'key',cx);
  const ropePress=hit.rope||(hit.use&&kind==='rope');
  if(ropePress&&p.ropes>0){let down=held.down;if(hit.use&&kind==='rope'&&useSrc==='mouse'&&mouse.seen){const m=mouseWorld();down=m.y>p.y+p.h+4;if(down)p.face=m.x>cx?1:-1}
    if(throwRope(down)){p.ropes--;renderHotbar()}}
  // interactions
  let hintTxt='';
  if(overlap(p,door)){hintTxt=coarse?t('hintDoorT'):t('hintDoor');if(hit.up||hit.act)enterDoor()}
  if(shop&&Math.abs(shop.merchant.x+7-cx)<3*T&&Math.abs(shop.merchant.y+9-(p.y+p.h/2))<2*T){
    hintTxt=coarse?t('hintShopT'):t('hintShop');if(!shop.greeted){shop.greeted=true;floatText(shop.merchant.x+7,shop.merchant.y-6,t('welcome'),'#f3dfb0')}
    if(hit.act)openShop()}
  if(nearJunk(cx,p.y+p.h/2)){hintTxt=coarse?t('hintJunkT'):t('hintJunk');if(!junk.greeted){junk.greeted=true;floatText(junk.merchant.x+7,junk.merchant.y-6,t('junkHi'),'#f3dfb0')}if(hit.act)openShop(junk)}
  for(const n of npcs){if(Math.abs(n.x-cx)<1.8*T&&Math.abs(n.y-(p.y+p.h))<1.2*T){hintTxt=coarse?t('hintTalkT',npcTitle(n)):t('hintTalk',npcTitle(n));if(hit.act)talkTo(n);break}}
  if(!hintTxt){const h=debugHint(p,cx);if(h)hintTxt=h}
  if(!hintTxt){const h=tentHint(p,cx);if(h)hintTxt=h}
  if(!hintTxt){const h=secretsHint(p,cx);if(h)hintTxt=h}
  if(!hintTxt){const h=voidHint(p,cx);if(h)hintTxt=h}
  for(const f of foods)if(f.kind==='mushP'){if(f.cd>0)f.cd--;else if(Math.hypot(f.x+5-cx,f.y+5-(p.y+p.h/2))<1.7*T&&!p.dead)puffSpores(f)}
  if(!hintTxt){const fd=foods.find(f=>f.kind!=='mushP'&&Math.abs(f.x+5-cx)<12&&Math.abs(f.y+5-(p.y+p.h-4))<14);if(fd){hintTxt=coarse?t('hintEatT',tr(FOOD[fd.kind])):t('hintEat',tr(FOOD[fd.kind]));if(hit.act){eatFood(fd);hit.act=false}}}
  if(!hintTxt&&p.stones<8){const nr=rocks.find(r=>!r.thrown&&Math.abs(r.x+3-cx)<12&&Math.abs(r.y-(p.y+p.h-3))<14);if(nr){hintTxt=coarse?t('hintRockT'):t('hintRock');if(hit.act)pickRock(nr)}}
  const hint=$('hint');if(hintTxt){hint.hidden=false;if(hint.textContent!==hintTxt)hint.textContent=hintTxt}else hint.hidden=true;
  for(const c of crates)if(!c.open&&overlap(p,c))openCrate(c);
  const pressedAt=new Set();const addFeet=(e,who)=>{if(!e.onGround)return;const fy=Math.floor((e.y+e.h+1.5)/T);for(const fx of [Math.floor((e.x+1)/T),Math.floor((e.x+e.w-1)/T)])pressedAt.add(fx+','+fy+','+who)};
  addFeet(p,'p');for(const r of rocks)addFeet(r,r.byPlayer?'r':'o');for(const f of foes)if(!f.dead&&f.type!=='spider')addFeet(f,'o');
  for(const l of links){const k=l.px+','+l.py,byP=pressedAt.has(k+',p'),byR=pressedAt.has(k+',r'),on=byP||byR||pressedAt.has(k+',o');
    if(on&&!l.pressed){l.anim=20;sfx.click();const tt=tileAt(l.tx,l.ty);
      if((tt===TRAPL||tt===TRAPR)&&!l.spent){l.spent=true;arrows.push({x:l.dir<0?l.tx*T-1:l.tx*T+T+1,y:l.ty*T+8,vx:l.dir*7,stuck:false,life:240,sx:0,sy:0,trap:byP,hp0:P.hp});setTimeout(sfx.arrow,40);if(byR&&!byP)unlock('rockplate')}}
    l.pressed=on;if(l.anim>0)l.anim--}
  if(p.y>MH*T){if(bottom){if(p.y>MH*T+3*T)startEnding()}else hurt(9,'cFall')}
  for(const s of springs){const sx=s.tx*T+5;if(cx>sx-2&&cx<sx+8&&p.y>s.ty*T){const bot=fallBottom(s);if(p.y<bot){unlock('shower');if(frame%30===0)particle(cx,p.y,'#cfeaff',3,1,14,.1,1)}}}
}
function enterDoor(){
  if(state!=='play')return;state='trans';sfx.door();P.vx=0;$('hint').hidden=true;$('talk').hidden=true;
  if(P.hp===1)unlock('lastheart');if(levelKills===0&&level>=2)unlock('pacifist');
  recordLayerShot();irisClose(P.x+P.w/2,P.y+P.h/2,34,()=>{level++;P.fuel=Math.min(100,P.fuel+25);P.fuelWarn=false;buildLevel();state='play';cam.x=P.x+5-VW/2;cam.y=P.y+20-VH/2;checkAch();renderHotbar();irisOpen(P.x+5,P.y+30,46)});
}
const FOOD={mushR:{en:'the red mushroom',fi:'punainen sieni'},mushP:{en:'the purple mushroom',fi:'violetti sieni'},berryR:{en:'the red berries',fi:'punaiset marjat'},berryB:{en:'the blue berries',fi:'siniset marjat'}};
function puffSpores(f){f.cd=720;const x=f.x+5,y=f.y+3;noise(.6,.07,700,'bandpass');setTimeout(()=>tone(520,.6,'sine',.02,-260),60);
  for(let k=0;k<34;k++)parts.push({x:x+rand(-3,3),y:y+rand(-2,2),vx:rand(-.7,.7),vy:rand(-.9,-.1),life:70+Math.random()*50|0,max:120,col:pickR(['rgba(200,150,255,.7)','rgba(150,240,220,.6)','rgba(255,170,230,.6)']),g:-.004,sz:2});
  P.trip=Math.max(P.trip||0,900);floatText(x,y-10,t('fxTrip'),'#d8a0ff')}
function eatFood(f){foods=foods.filter(x=>x!==f);const cx=P.x+P.w/2;sfx.eat();
  if(f.kind==='mushR'){P.haste=1200;floatText(cx,P.y-10,t('fxHaste'),'#ffb347');particle(cx,P.y+4,['#ffb347','#fff1b0'],12,1.8,24,0,1)}
  else if(f.kind==='mushP'){P.trip=900;floatText(cx,P.y-10,t('fxTrip'),'#d8a0ff');particle(cx,P.y+4,['#d8a0ff','#7ff0d8','#ffb0e0'],16,2,30,0,1)}
  else if(f.kind==='berryR'){if(P.hp<8){P.hp++;P.maxHp=Math.max(P.maxHp,P.hp)}floatText(cx,P.y-10,t('plusHeart'),'#ff8a7a')}
  else{if(P.hp<8){P.hp++;P.maxHp=Math.max(P.maxHp,P.hp)}P.poison=Math.max(0,(P.poison||0)-200);floatText(cx,P.y-10,t('fxBlue'),'#8ab0ff')}}
function drawFood(f){const x=Math.round(f.x),y=Math.round(f.y);
  if(f.kind==='mushP'){const spent=f.cd>0,cap=spent?'#6a4a8a':'#9a5ad8',sw=spent?0:Math.round(Math.sin(frame*.05+f.ph));R(x+4,y+5,2,4,'#efe8dc');R(x+1,y+3+(spent?1:0),8,2,cap);R(x+2,y+2+(spent?1:0)+sw*0,6,1,cap);if(!spent){R(x+3,y+1,4,1,cap);R(x+3,y+3,1,1,'#e8c8ff');R(x+6,y+2,1,1,'#e8c8ff');if((frame+f.ph*40|0)%50===0)parts.push({x:x+5,y:y+1,vx:rand(-.15,.15),vy:-.25,life:40,max:40,col:'rgba(200,150,255,.7)',g:0,sz:1})}}
  else if(f.kind==='mushR'){const cap='#d83a2a';R(x+4,y+5,2,4,'#efe8dc');R(x+1,y+3,8,2,cap);R(x+2,y+2,6,1,cap);R(x+3,y+1,4,1,cap);R(x+3,y+3,1,1,'#fff');R(x+6,y+2,1,1,'#fff')}
  else{const b=f.kind==='berryR'?'#e2483d':'#3a5ad8';R(x,y+5,10,4,'#3e6a2a');R(x+1,y+4,8,2,'#4f7a32');R(x+4,y+3,2,2,'#5e9238');for(const [bx,by] of [[1,5],[4,6],[7,5],[3,4],[8,7]])R(x+bx,y+by,1,1,b)}}
function clickInteract(){
  const m=mouseWorld(),cx=P.x+P.w/2;
  if(secretsClick(m,cx))return true;
  if(junk){const mm=junk.merchant;if(m.x>mm.x-4&&m.x<mm.x+mm.w+4&&m.y>mm.y-6&&m.y<mm.y+mm.h&&Math.hypot(mm.x+7-cx,mm.y+9-P.y)<4*T){openShop(junk);return true}}
  if(shop){const mm=shop.merchant;if(m.x>mm.x-4&&m.x<mm.x+mm.w+4&&m.y>mm.y-6&&m.y<mm.y+mm.h&&Math.hypot(mm.x+7-cx,mm.y+9-P.y)<4*T){openShop();return true}}
  if(overlap(P,door)&&m.x>door.x-4&&m.x<door.x+20&&m.y>door.y-4&&m.y<door.y+28){enterDoor();return true}
  for(const f of foods)if(f.kind!=='mushP'&&Math.abs(m.x-(f.x+5))<9&&Math.abs(m.y-(f.y+5))<9&&Math.hypot(f.x-cx,f.y-P.y)<3*T){eatFood(f);return true}
  for(const r of rocks)if(!r.thrown&&P.stones<8&&Math.abs(m.x-(r.x+3))<8&&Math.abs(m.y-(r.y+2))<8&&Math.hypot(r.x-cx,r.y-P.y)<3*T){pickRock(r);return true}
  for(const n of npcs)if(Math.abs(m.x-n.x)<10&&m.y>n.y-24&&m.y<n.y+2&&Math.hypot(n.x-cx,n.y-(P.y+P.h))<3*T){talkTo(n);return true}
  return false;
}
function fallBottom(s){const x=s.tx;let y=s.ty+1;while(y<MH&&!isSolid(x,y)&&!isWater(x,y))y++;return y*T}

function updateFoes(){
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2;let threat=0;if(P.dark>0)P.dark--;
  for(const f of foes){if(f.dead)continue;f.anim++;f.cd--;if(f.hurt>0)f.hurt--;
    const fcx=f.x+f.w/2,fcy=f.y+f.h/2,rdx=pcx-fcx,rdy=pcy-fcy,dist=Math.hypot(rdx,rdy);
    const sees=!P.dead&&dist<9*T&&los(fcx,fcy-2,pcx,pcy-2)&&los(fcx,fcy+2,pcx,pcy+2);
    // enemies only know what they have seen, felt or heard: a remembered position, never the live one
    if(sees){f.mx=pcx;f.my=pcy;f.mt=frame}
    else if(frame-lastNoise.f<3&&Math.hypot(lastNoise.x-fcx,lastNoise.y-fcy)<5*T){f.mx=lastNoise.x;f.my=lastNoise.y;f.mt=frame}
    const feel=f.type==='worm'&&dist<7*T&&P.onGround,mem=f.mt!==undefined&&frame-f.mt<240;
    const dx=sees||feel?rdx:mem?f.mx-fcx:0,dy=sees||feel?rdy:mem?f.my-fcy:0;
    if(f.type==='spider'){
      if(dx)f.face=Math.sign(dx);
      if(f.st==='hang'){
        if(!isSolid(Math.floor(fcx/T),Math.floor((f.y-2)/T)))f.st='fall';
        else if(sees&&Math.abs(dx)<16&&dy>0&&dy<7*T){f.dropT=(f.dropT||0)+1;if(f.dropT>55)f.st='fall'}
        else{if(f.dropT>0)f.dropT--;if(sees)f.aware=(f.aware||0)+1;else f.aware=0;if(!f.wind&&sees&&f.aware>45&&dist<5*T&&f.cd<=0&&onScreen(fcx,fcy)&&frame-lastEnemyShot>120){f.wind=80;lastEnemyShot=frame;sfx.spiderCharge()}}
      }else{
        const wet=inWaterAt(fcx,fcy);f.vy=Math.min(f.vy+(wet?.1:.3),wet?1.5:7);
        if(f.onGround){f.vx*=.8;f.hop--;
          if(sees)f.aware=(f.aware||0)+1;else f.aware=0;
          if(!f.wind&&sees&&f.aware>45&&f.cd<=0&&dist>2.5*T&&dist<5*T&&onScreen(fcx,fcy)&&frame-lastEnemyShot>120){f.wind=80;lastEnemyShot=frame;sfx.spiderCharge()}
          else if(!f.wind&&sees&&f.aware>30&&f.hop<=0){f.vx=Math.sign(dx)*1.5;f.vy=-3.6;f.hop=95+Math.random()*70}
          else if(!sees&&f.hop<=-120){f.vx=(Math.random()<.5?-1:1)*1.4;f.vy=-3;f.hop=60}}
        move(f);if(f.hitX)f.vx*=-.5;if(f.hitY)f.vy=0;
      }
      if(f.wind>0){f.wind--;f.vx*=.7;if(f.wind===0){if(sees&&onScreen(fcx,fcy))spit(f);else f.cd=80}}
      f.charge=f.wind>0?1:0;if(sees&&dist<7*T)threat+=.35;
      if(state==='play'&&overlap(P,f)){
        if(P.vy>1&&P.y+P.h-f.y<9&&!P.climb){killFoe(f,'stomp');P.vy=-4.6;P.peak=P.y}
        else poisonHit(1,'cBite',fcx,420)}
    }else if(EXTRA_UPD[f.type]){threat+=EXTRA_UPD[f.type](f,dx,dy,dist,sees,fcx,fcy)||0}else if(f.type==='snake'){updSnake(f,dx,dy,dist,sees,fcx);if(f.st!=='slither')threat+=.4}else if(f.type==='mummy'){updMummy(f,dx,dy,dist,sees,fcx);if(f.st==='chase')threat+=.7}else{
      const wet=inWaterAt(fcx,fcy);
      f.vy=Math.min(f.vy+(wet?.1:.33),wet?1.6:7.5);f.jcd--;
      if(f.st==='watch'){ // a wolf first stands its ground and growls
        f.vx*=.8;if(Math.abs(dx)>2)f.face=Math.sign(dx);f.watch--;if(!sees)f.lost++;else f.lost=0;
        if(f.watch%60===0){sfx.growl();floatText(fcx,f.y-6,t('growl'),'#d9dbe2')}
        if(f.lost>120){f.st='idle';f.lost=0}
        else if(dist<3*T||f.watch<=0){f.st='chase';if(!f.howled){f.howled=true;sfx.howl();floatText(fcx,f.y-10,t('howl'),'#d9dbe2')}}
      }else if(f.st==='idle'){
        if(sees&&dist<8*T){f.st='watch';f.watch=150+Math.floor(Math.random()*90);f.lost=0;f.vx=0;sfx.growl();floatText(fcx,f.y-6,t('growl'),'#d9dbe2')}
        else if(f.onGround){f.vx=f.face*.55;f.turn--;
          const ahead=Math.floor((f.face>0?f.x+f.w+1:f.x-1)/T),row=Math.floor((f.y+f.h-2)/T);
          if(isSolid(ahead,row)||!isSolid(ahead,row+1)||f.turn<=0){f.face*=-1;f.turn=90+Math.random()*120}}
      }else{
        if(!sees){f.lost++;if(f.lost>180){f.st='idle';f.lost=0}}else f.lost=0;
        const tg=Math.abs(dx)>4?Math.sign(dx):f.face;f.face=tg;threat+=sees?.6:.25;
        if(f.onGround){
          if(f.cd<=0&&sees&&Math.abs(dx)<2.2*T&&Math.abs(dy)<T*1.2){f.vx=tg*2.4;f.vy=-1.5;f.cd=160;sfx.growl()}
          else{const back=f.cd>100;f.vx=clamp(f.vx+(back?-tg*.12:tg*.14),-1.2,1.2);
            const ahead=Math.floor((tg>0?f.x+f.w+2:f.x-2)/T),row=Math.floor((f.y+f.h-2)/T);
            if(isSolid(ahead,row)&&f.jcd<=0&&!isSolid(ahead,row-1)){f.vy=-4.4;f.jcd=40}
            else if(dy<-T*1.2&&dy>-T*2.2&&Math.abs(dx)<2.5*T&&f.jcd<=0){f.vy=-4.8;f.jcd=70}}}
      }
      move(f);if(f.hitX){f.vx=0;if(f.st==='idle')f.face*=-1}if(f.hitY)f.vy=0;
      if(state==='play'&&overlap(P,f)){
        if(P.vy>1&&P.y+P.h-f.y<8&&!P.climb){damageFoe(f,1.5,pcx,'stomp');P.vy=-5;P.peak=P.y}
        else{hurt(1,'cWolf',fcx);f.cd=Math.max(f.cd,170);f.vx=-Math.sign(dx||1)*1.6}}
    }
    if(f.y>MH*T)f.dead=true;
    if(!f.dead&&tileAt(Math.floor(fcx/T),Math.floor((f.y+f.h-3)/T))===LAVA){sfx.sizzle();killFoe(f,'lava')}
  }
  Music.target=clamp(threat,0,1);
}
function updSnake(f,dx,dy,dist,sees,fcx){
  f.vy=Math.min(f.vy+.33,7.5);if(f.cd>0)f.cd--;
  if(f.st==='slither'){
    if(sees&&dist<4.5*T&&Math.abs(dy)<T*1.2&&f.cd<=0&&onScreen(fcx,f.y)){f.st='coil';f.t=42;f.face=Math.sign(dx)||f.face;f.vx=0;sfx.snakeHiss()}
    else if(f.onGround){f.vx=f.face*.35;f.turn--;const ahead=Math.floor((f.face>0?f.x+f.w+1:f.x-1)/T),row=Math.floor((f.y+f.h-2)/T);
      if(isSolid(ahead,row)||!isSolid(ahead,row+1)||f.turn<=0){f.face*=-1;f.turn=120+Math.random()*120}}}
  else if(f.st==='coil'){f.vx*=.6;f.face=Math.sign(dx)||f.face;if(--f.t<=0){f.st='strike';f.t=22;f.vx=f.face*3.1;f.vy=-1.6}}
  else{if(--f.t<=0){f.st='slither';f.cd=100}}
  move(f);if(f.hitX){f.face*=-1;f.vx=0}if(f.hitY)f.vy=0;
  if(state==='play'&&overlap(P,f)){if(P.vy>1&&P.y+P.h-f.y<6&&!P.climb){damageFoe(f,2,P.x+P.w/2,'stomp');P.vy=-4.6;P.peak=P.y}else poisonHit(1,'cSnake',fcx,540)}
}
function drawSnake(s){
  ctx.save();ctx.translate(Math.round(s.x+s.w/2),Math.round(s.y+s.h));if(s.face<0)ctx.scale(-1,1);
  const c1=s.hurt?'#c8e0a0':'#5a8a3a',c2='#3e6a26',c3='#d8c04a',up=s.st==='coil'?5:s.st==='strike'?2:0;
  for(let i=0;i<7;i++){const x=-8+i*2,w=Math.sin(s.anim*.25-i*.9)*(s.st==='slither'?1:.4);R(x,-3+w,2,3,i%2?c1:c2);if(i%3===1)R(x,-3+w,1,1,c3)}
  R(5,-4-up,4,3,c1);R(6,-4-up,3,1,c2);R(8,-3-up,1,1,'#1a1410');
  if((s.anim>>3)%3===0||s.st!=='slither'){R(9,-2-up,2,1,'#e2483d');R(11,-3-up,1,1,'#e2483d');R(11,-1-up,1,1,'#e2483d')}
  if(up){R(4,-2-up,2,up,c2)}
  ctx.restore();
}
function poisonHit(n,cause,fromX,dur){if(P.inv>0||P.dead||state!=='play')return;hurt(n,cause,fromX);applyPoison(dur)}
function applyPoison(dur){if(P.dead)return;if(P.poison<=0)floatText(P.x+P.w/2,P.y-10,t('poisoned'),'#9be86a');P.poison=Math.max(P.poison||0,Math.round(dur*(P.poisonK||1)))}
let lastEnemyShot=-999;
function onScreen(x,y){return x>cam.x+6&&x<cam.x+VW-6&&y>cam.y+6&&y<cam.y+VH-6}
/* fireballs leap from lava and bounce along the floor in the scorching layers */
let fireballs=[],flies=[],firstGround=8,levelTime=0,nextAmbient=600,inputMode='mouse';
let runKills={spider:0,wolf:0,mummy:0,snake:0,frog:0,dragon:0,bat:0,mimic:0,worm:0,wisp:0,ant:0,scorpion:0,raptor:0,rex:0,knight:0,mammoth:0},runFinds=0;
function curDepth(){return P?Math.max(0,Math.floor((level-1)*MH-firstGround+(P.y+P.h)/T)):0}
function updateFireballs(){
  if((biome==='hot'||biome==='void')&&state==='play'&&levelTime>480&&frame%75===0&&fireballs.length<4){const px=Math.floor((P.x+P.w/2)/T),py=Math.floor(P.y/T);let done=false;
    for(let a=0;a<30&&!done;a++){const x=px+Math.floor(rand(-14,14)),y=py+Math.floor(rand(-8,9));if(Math.abs(x-px)>=4&&tileAt(x,y)===LAVA&&!LIQ[tileAt(x,y-1)]&&!isSolid(x,y-1)){fireballs.push({x:x*T+5,y:y*T-6,w:6,h:6,vx:rand(-1.5,1.5),vy:-rand(5.5,7.5),b:0,life:0});sfx.whoosh();done=true}}}
  for(const f of fireballs){f.life++;f.vy=Math.min(f.vy+.22,7);const vy0=f.vy,vx0=f.vx;move(f);
    if(f.hitY>0){f.vy=-Math.abs(vy0)*.72;f.b++;particle(f.x+3,f.y+6,['#ffb347','#ff6a1a'],4,1.2,14,.1,1)}else if(f.hitY<0)f.vy=0;if(f.hitX)f.vx=-vx0;
    if(frame%2===0)parts.push({x:f.x+3+rand(-1,1),y:f.y+3,vx:rand(-.2,.2),vy:-.2,life:16,max:16,col:pickR(['#ffd27a','#ff8a3a','#ff5a1a']),g:-.01,sz:1});
    if(tileAt(Math.floor((f.x+3)/T),Math.floor((f.y+3)/T))===LAVA&&f.vy>0&&f.life>10)f.dead=true;
    if(f.b>4||f.life>420)f.dead=true;
    if(state==='play'&&!P.dead&&overlap(P,f)){hurt(1,'cFire',f.x+3);f.dead=true}}
  fireballs=fireballs.filter(f=>!f.dead)}
function updMummy(f,dx,dy,dist,sees,fcx){
  f.vy=Math.min(f.vy+.33,7.5);
  if(f.st==='patrol'){
    if(sees&&dist<7*T){f.st='chase';f.groan=220;sfx.groan();shake=Math.max(shake,3)}
    else if(f.onGround){if(f.pause>0){f.pause--;f.vx=0}else{f.vx=f.face*.42;if(Math.random()<.004)f.pause=60+Math.random()*90}}
  }else{
    if(!sees){f.lost++;if(f.lost>420){f.st='patrol';f.lost=0}}else f.lost=0;
    const tg=Math.abs(dx)>3?Math.sign(dx):f.face;f.face=tg;
    if(f.onGround){f.vx=tg*1.25;const ahead=Math.floor((tg>0?f.x+f.w+2:f.x-2)/T),row=Math.floor((f.y+f.h-2)/T);if(isSolid(ahead,row)&&!isSolid(ahead,row-1))f.vy=-4.4}
    if(--f.groan<=0){f.groan=220+Math.random()*160;sfx.groan(.7)}
  }
  move(f);if(f.hitX){if(f.st==='patrol')f.face*=-1;else f.vx=0}if(f.hitY)f.vy=0;
  if(state==='play'&&overlap(P,f)){if(P.vy>1&&P.y+P.h-f.y<8&&!P.climb){damageFoe(f,1,P.x+P.w/2,'stomp');P.vy=-5;P.peak=P.y}else hurt(1,'cMummy',fcx)}
}
/* stalactites and icicles: they shiver when you walk underneath, then drop */
function updateDrips(){const pcx=P.x+P.w/2;
  for(const d of drips){if(d.dead)continue;const tx=Math.floor((d.x+4)/T);
    if(d.st==='hang'){if(!isSolid(tx,Math.floor((d.y-2)/T)))d.st='fall';
      else if(state==='play'&&!P.dead&&pcx>d.x-8&&pcx<d.x+16&&P.y>d.y&&P.y-d.y<9*T&&onScreen(d.x+4,d.y+4)&&los(d.x+4,d.y+12,pcx,P.y+4)){d.st='shake';d.t=26;sfx.creak()}}
    else if(d.st==='shake'){if(--d.t<=0){d.st='fall';d.vy=1}}
    else{d.vy=Math.min(d.vy+.42,9);d.y+=d.vy;const box={x:d.x+1,y:d.y,w:6,h:12};
      if(state==='play'&&!P.dead&&overlap(P,box)){hurt(2,'cStal',d.x+4);shatter(d);continue}
      for(const f of foes)if(!f.dead&&overlap(f,box)){damageFoe(f,3,d.x+4,'drip');shatter(d);break}
      if(!d.dead&&isSolid(tx,Math.floor((d.y+12)/T)))shatter(d)}}
  drips=drips.filter(d=>!d.dead)}
function shatter(d){d.dead=true;sfx.crash();particle(d.x+4,d.y+10,d.ice?['#d8f0ff','#9ccaf0','#ffffff']:['#8a8c96','#6a6c77','#a8aab4'],14,2.2,30,.25,1.5);shake=Math.max(shake,3)}
/* stones: pick them up, throw them; a thrown stone can set off a pressure plate */
function pickRock(r){rocks=rocks.filter(x=>x!==r);P.stones++;sfx.pickup();floatText(r.x+3,r.y-4,t('plusStone'),'#d8d0c4');renderHotbar()}
function throwStone(src,cx){const p=P;if(p.stones<=0)return;p.stones--;let vx,vy;
  if(src==='mouse'&&mouse.seen){const m=mouseWorld(),dx=m.x-cx,dy=m.y-(p.y+4),d=Math.hypot(dx,dy)||1,pw=clamp(d/16,3,7.5);vx=dx/d*pw;vy=dy/d*pw-1.4;p.face=dx>0?1:-1}
  else{vx=p.face*5.5+p.vx*.4;vy=held.up?-6:held.down?1:-2.6}
  rocks.push({x:cx-3,y:p.y+3,w:6,h:5,vx,vy,thrown:true,byPlayer:true,t:0});p.swing=8;sfx.throwS();renderHotbar()}
function updateRocks(){
  for(const r of rocks){r.t++;const wet=inWaterAt(r.x+3,r.y+3);r.vy=Math.min(r.vy+(wet?.12:.3),wet?1.4:7);const vx0=r.vx,vy0=r.vy,sp=Math.hypot(vx0,vy0);move(r);
    if(r.hitX){r.vx=-vx0*.4;if(sp>2)sfx.knock()}if(r.hitY>0){r.vy=Math.abs(vy0)>1.5?-vy0*.3:0;r.vx*=.7;if(Math.abs(vy0)>2)sfx.knock()}else if(r.hitY<0)r.vy=0;
    if(r.onGround)r.vx*=.85;if(Math.abs(r.vx)<.03)r.vx=0;
    if(r.thrown){if(sp>2.5){const box={x:r.x-1,y:r.y-1,w:r.w+2,h:r.h+2};
        for(const f of foes)if(!f.dead&&overlap(f,box)){damageFoe(f,1.2,r.x-r.vx,'ranged');r.vx*=-.3;r.vy=-1.5;sfx.knock();break}
        for(const pt of pots)if(!pt.broken&&overlap(pt,box))breakPot(pt)}
      if(r.onGround&&sp<.4&&r.t>10)r.thrown=false}
    if(tileAt(Math.floor((r.x+3)/T),Math.floor((r.y+3)/T))===LAVA)r.gone=true}
  rocks=rocks.filter(r=>!r.gone&&r.y<MH*T)}
function spit(s){
  const scx=s.x+s.w/2,scy=s.y+(s.st==='hang'?s.h:2);
  const dx=P.x+P.w/2-scx+rand(-26,26),dy=P.y+P.h/2-scy+rand(-10,8);const dist=Math.hypot(dx,dy);
  const tt=clamp(dist/2.6,18,40)*rand(.8,1.25),g=.18;
  acids.push({x:scx,y:scy,vx:dx/tt,vy:dy/tt-.5*g*tt,life:0});
  s.cd=230+Math.random()*160;lastEnemyShot=frame;sfx.spit();
}
/* Water: a cell falls if it can; otherwise it moves one step toward the nearest reachable drop on its row
   (an air cell with air below), travelling only across air that is supported. With no drop in reach it
   stays put, so settled pools never jitter. The whole pass sleeps until something nearby changes. */
/* sand settles: a sand tile with air (or water) under it drops one tile at a time, never into the player */
let sandAwake=true;
function sandStep(){if(!sandAwake)return;let moved=false;const occ=new Set();const mark=e=>{for(let yy=Math.floor(e.y/T);yy<=Math.floor((e.y+e.h-.01)/T);yy++)for(let xx=Math.floor(e.x/T);xx<=Math.floor((e.x+e.w-.01)/T);xx++)occ.add(xx+yy*MW)};
  for(const n of npcs)mark({x:n.x-6,y:n.y-16,w:12,h:16});for(const f of foes)if(!f.dead&&f.type!=='bat'&&f.type!=='wisp'&&f.type!=='worm')mark(f);for(const c of crates)mark(c);for(const q of pots)if(!q.broken)mark(q);
  const px0=Math.floor(P.x/T),px1=Math.floor((P.x+P.w-.01)/T),py0=Math.floor(P.y/T),py1=Math.floor((P.y+P.h-.01)/T);
  for(let y=MH-2;y>=1;y--)for(let x=1;x<MW-1;x++){const i=idx(x,y);if(grid[i]!==SAND)continue;const b=idx(x,y+1),bt=grid[b];
    if((bt===AIR||bt===WATER)&&!(x>=px0&&x<=px1&&y+1>=py0&&y+1<=py1)&&!occ.has(b)){grid[b]=SAND;grid[i]=bt;dmgA[b]=0;dmgA[i]=0;moved=true;if(!isSolid(x,y+2)&&Math.random()<.3)particle(x*T+8,(y+1)*T,['#d0b886','#e4d0a0'],2,.6,14,.1,1);
      if(isSolid(x,y+2)&&Math.random()<.5)sfx.sandLand()}}
  if(!moved)sandAwake=false}
function waterStep(){
  if(!waterAwake)return;let moved=false;const stamp=new Uint8Array(MW*MH);const flip=(frame>>2)&1;
  for(let y=MH-2;y>=1;y--)for(let k=1;k<MW-1;k++){const x=flip?k:MW-1-k,i=idx(x,y);const lq=grid[i];if(!LIQ[lq]||stamp[i])continue;
    const b=idx(x,y+1);
    if(grid[b]===AIR){grid[b]=lq;grid[i]=AIR;stamp[b]=1;moved=true;continue}
    let go=0;const open=[true,true];
    for(let d=1;d<=16&&!go&&(open[0]||open[1]);d++){for(let si=0;si<2;si++){if(!open[si])continue;const s=(si^flip)?1:-1;const xx=x+s*d;
        if(xx<1||xx>MW-2||grid[idx(xx,y)]!==AIR){open[si]=false;continue}
        if(grid[idx(xx,y+1)]===AIR){go=s;break}}}
    if(go){const j=idx(x+go,y);grid[j]=lq;grid[i]=AIR;stamp[j]=1;moved=true}}
  if(!moved)waterAwake=false;
}
function updateWorld(){
  updateFoes();
  for(const a of acids){a.life++;a.vy+=.18;a.x+=a.vx;a.y+=a.vy;
    if(frame%2===0)parts.push({x:a.x,y:a.y,vx:0,vy:0,life:10,max:10,col:'#7fd12a',g:0,sz:1});
    if(inWaterAt(a.x,a.y)){a.life=999;particle(a.x,a.y,'#b7e88a',5,1,14,-.02,1);continue}
    if(state==='play'&&!P.dead&&a.x>P.x-2&&a.x<P.x+P.w+2&&a.y>P.y-2&&a.y<P.y+P.h+2){
      poisonHit(1,'cAcid',a.x,480);a.life=999;particle(a.x,a.y,['#a6f03a','#d8ff8a'],10,2,24,.15,1);sfx.hiss();continue}
    const tx=Math.floor(a.x/T),ty=Math.floor(a.y/T);
    if(isSolid(tx,ty)){a.life=999;particle(a.x,a.y,['#a6f03a','#6fb42a'],8,1.6,20,.15,1);
      let px=tx,py=ty;if(isSolid(px,py-1)){px=Math.floor((a.x-a.vx)/T);py=Math.floor(a.y/T)+1;let k=0;while(k<6&&!isSolid(px,py)){py++;k++}}
      const pt=tileAt(px,py);if(SOL[pt]&&!isSolid(px,py-1)&&!isWater(px,py-1)&&pt!==BED&&pt!==SHOPB){const ex=puddles.find(q=>q.tx===px&&q.ty===py);if(ex)ex.life=420;else puddles.push({tx:px,ty:py,life:420,bub:0})}
      sfx.hiss()}
  }
  acids=acids.filter(a=>a.life<300);
  for(const q of puddles){q.life--;q.bub++;const tt=tileAt(q.tx,q.ty);
    if(!SOL[tt]||isWater(q.tx,q.ty-1)){q.life=0;continue}
    const i=idx(q.tx,q.ty);dmgA[i]+=tt===DIRT?.011:tt===STONE?.0035:.002;
    if(dmgA[i]>=HP[tt]){breakTile(q.tx,q.ty,true,true);sfx.hiss();continue}
    if(P.onGround&&P.x+P.w>q.tx*T+2&&P.x<q.tx*T+T-2&&Math.abs(P.y+P.h-q.ty*T)<2)hurt(1,'cAcid');
  }
  puddles=puddles.filter(q=>q.life>0);
  for(const a of arrows){
    if(a.stuck){a.life--;continue}
    a.x+=a.vx;
    if(state==='play'&&!P.dead&&a.y>P.y&&a.y<P.y+P.h&&a.x>P.x-3&&a.x<P.x+P.w+3){hurt(2,'cTrap',a.x-a.vx*3);a.life=0;continue}
    for(const f of foes)if(!f.dead&&a.x>f.x&&a.x<f.x+f.w&&a.y>f.y-2&&a.y<f.y+f.h+2){killFoe(f,'arrow');a.life=0}
    for(const p of pots)if(!p.broken&&a.x>p.x&&a.x<p.x+p.w&&a.y>p.y&&a.y<p.y+p.h)breakPot(p);
    const tx=Math.floor((a.x+Math.sign(a.vx)*5)/T),ty=Math.floor(a.y/T);
    if(isSolid(tx,ty)){a.stuck=true;a.sx=a.x+Math.sign(a.vx)*5;a.sy=a.y;sfx.thunk();particle(a.x,a.y,'#999',3,1,10,.1,1);
      if(a.trap&&state==='play'&&!P.dead&&P.hp>=a.hp0)unlock('dodge')}
  }
  arrows=arrows.filter(a=>a.life>0);
  updateShots();updateNpcs();updateDrips();updateRocks();updateFireballs();
  if(state==='play'){levelTime++;
    if(frame>=nextAmbient){nextAmbient=frame+480+Math.floor(Math.random()*720);const ev=['ambRumble','ambPebbles','ambGust'];
      if(biome!=='hot')ev.push('ambDrip','ambDrip');if(biome==='hot')ev.push('ambLava','ambLava');if(biome==='cold')ev.push('ambIce','ambIce');if(biome==='shroom')ev.push('ambWhisper');if(level>=3&&Math.random()<.4)ev.push('ambWhisper');
      if(foes.some(f=>f.type==='wolf'&&!f.dead))ev.push('distHowl');if(foes.some(f=>f.type==='mummy'&&!f.dead))ev.push('distGroan');
      const e=pickR(ev);if(e==='distHowl'){const v=sfxVol;sfxVol=v*.35;sfx.howl();sfxVol=v}else if(e==='distGroan')sfx.groan(.28);else sfx[e]()}
    if(P.hp===1&&!P.dead&&frame%55===0)sfx.heartbeat();
    if(frame%30===0)Echo.wet(isSky(Math.floor((P.x+P.w/2)/T),Math.floor(P.y/T))?.08:.4)}
  if(state==='play'&&frame%90===0&&gnats.some(g=>Math.hypot(g.x-(P.x+P.w/2),g.y-(P.y+P.h/2))<3*T))sfx.buzz();
  if(biome==='moss'&&frame%14===0&&flies.length<26)flies.push({x:cam.x+Math.random()*VW,y:cam.y+Math.random()*VH,ph:Math.random()*7,life:600});
  for(const f of flies){f.life--;f.ph+=.05;f.x+=Math.cos(f.ph*.7)*.3;f.y+=Math.sin(f.ph)*.25}flies=flies.filter(f=>f.life>0&&!isSolid(Math.floor(f.x/T),Math.floor(f.y/T)));
  if(biome==='shroom'&&frame%6===0)parts.push({x:cam.x+Math.random()*VW,y:cam.y+VH*Math.random(),vx:rand(-.15,.15),vy:-rand(.05,.2),life:180,max:180,col:pickR(['rgba(200,150,255,.6)','rgba(120,230,220,.5)','rgba(255,170,220,.5)']),g:0,sz:1});
  if(biome==='hot'&&frame%5===0)parts.push({x:cam.x+Math.random()*VW,y:cam.y+VH+4,vx:rand(-.2,.2),vy:-rand(.3,.8),life:200,max:200,col:pickR(['#ff8a3a','#ffb347','#ff6a1a']),g:-.001,sz:1});
  if(biome==='hot'&&frame%7===0){const x=Math.floor((cam.x+Math.random()*VW)/T),y=Math.floor((cam.y+Math.random()*VH)/T);if(tileAt(x,y)===LAVA&&!LIQ[tileAt(x,y-1)])particle(x*T+8,y*T+2,['#ffd27a','#ff8a3a'],3,1.2,20,.08,1)}
  if(frame%30===0&&state==='play'){const near=npcs.some(n=>Math.hypot(n.x-(P.x+P.w/2),n.y-(P.y+P.h))<7*T);const inShop=shop&&P.x>shop.x0*T&&P.x<(shop.x0+shop.w)*T&&P.y>shop.y0*T&&P.y<(shop.y0+shop.h)*T;Music.play(inTent?'tent':inVoid?'void':nearPeace()?'peace':domain?'camp':inShop?'crypt':near||nearJunk(P.x+5,P.y+8)?'campfire':levelTrack())}
  for(const b of bombs){b.fuse--;const wet=inWaterAt(b.x+3,b.y+3);b.vy=Math.min(b.vy+(wet?.1:.3),wet?1.2:7);if(wet)b.vx*=.92;const vx0=b.vx,vy0=b.vy;move(b);
    if(b.hitX)b.vx=-vx0*.45;if(b.hitY>0){b.vy=Math.abs(vy0)>1.2?-vy0*.35:0;b.vx*=.75}else if(b.hitY<0)b.vy=0;
    if(b.onGround)b.vx*=.9;
    if(frame%3===0)parts.push({x:b.x+5,y:b.y-1,vx:rand(-.3,.3),vy:-.5,life:12,max:12,col:b.fuse<40?'#ff6b4a':'#ffd27a',g:0,sz:1});
    if(b.fuse%20===0)sfx.fuse();
    if(b.fuse<=0){b.dead=true;explode(b.x+3,b.y+3)}}
  bombs=bombs.filter(b=>!b.dead);
  for(const p of pickups){p.t++;
    if(!p.still){const wet=inWaterAt(p.x+3,p.y+3);p.vy=Math.min(p.vy+(wet?.08:.3),wet?1:7);const vx0=p.vx,vy0=p.vy;move(p);
      if(p.hitX)p.vx=-vx0*.4;if(p.hitY>0){p.vy=Math.abs(vy0)>1.5?-vy0*.3:0;p.vx*=.6}else if(p.hitY<0)p.vy=0;if(p.onGround)p.vx*=.85}
    if(state==='play'&&p.t>12&&overlap(P,{x:p.x-2,y:p.y-2,w:p.w+4,h:p.h+4}))collect(p)}
  pickups=pickups.filter(p=>!p.got&&p.y<MH*T);
  for(const r of ropes){const topY=r.top*T;if(r.head>topY){r.head=Math.max(topY,r.head-12)}else if(r.cur<r.len){r.cur=Math.min(r.len,r.cur+.5)}}
  for(const s of springs){if(frame%3===0){const b=fallBottom(s);parts.push({x:s.tx*T+5+Math.random()*6,y:b-1,vx:rand(-.8,.8),vy:rand(-1.4,-.4),life:20,max:20,col:Math.random()<.5?'#d8efff':'#8fc8f0',g:.08,sz:1})}}
  if(surf&&frame%5===0)parts.push({x:shaft.x*T+rand(0,32),y:shaft.y0*T+rand(0,(shaft.y1-shaft.y0)*T),vx:rand(-.1,.1),vy:rand(-.05,.12),life:120,max:120,col:'rgba(255,236,190,.55)',g:0,sz:1});
  else if(!surf&&frame%9===0)parts.push({x:shaft.x*T+rand(0,32),y:rand(0,shaft.y1*T),vx:rand(-.1,.1),vy:rand(.05,.2),life:120,max:120,col:'rgba(255,230,180,.4)',g:0,sz:1});
  for(const q of parts){q.life--;q.vy+=q.g;q.x+=q.vx;q.y+=q.vy;q.vx*=.97;if(q.g>0&&isSolid(Math.floor(q.x/T),Math.floor(q.y/T))){q.vy*=-.3;q.vx*=.5;q.y-=q.vy*2}}
  parts=parts.filter(q=>q.life>0);if(parts.length>1000)parts.splice(0,parts.length-1000);
  for(const tx of texts){tx.life--;tx.y-=.32}texts=texts.filter(tx=>tx.life>0);
  for(const f of flashes)f.life--;flashes=flashes.filter(f=>f.life>0);
  if(clouds.length)for(const c of clouds){c.x+=c.s;if(c.x>MW*T+60)c.x=-80}
  if(frame%8===0)waterStep();
  if(frame%5===0)sandStep();
  for(const pt of pots){if(pt.broken)continue;pt.vx=0;pt.vy=Math.min((pt.vy||0)+.3,7);const vy0=pt.vy;move(pt);if(pt.hitY>0||pt.onGround){if(vy0>2.2)breakPot(pt);pt.vy=0}}
  for(const c of crates){c.vx=0;c.vy=Math.min((c.vy||0)+.3,7);const vy0=c.vy;move(c);if(c.hitY>0||c.onGround){if(vy0>2.5){sfx.knock();particle(c.x+6,c.y+11,'#6b5a4c',6,1,16,.05,1)}c.vy=0}}
  if(frame%6===0&&P)markSeen();
  if(frame%10===0&&AC&&P){let best=0;const pcx=P.x+P.w/2,pcy=P.y+P.h/2;for(const s of springs){const d=Math.hypot(s.tx*T+8-pcx,(s.ty*T+fallBottom(s))/2-pcy);best=Math.max(best,clamp(1-d/(9*T),0,1))}Ambient.set(state==='play'?best*.09:0)}
}
function collect(p){p.got=true;const cx=p.x+3,cy=p.y-4;
  if(p.kind==='mat'){gainMat(p.mat,1,cx,cy);return}
  if(p.kind==='disc'){applyDisc(p.db,cx,cy);return}
  if(p.kind==='recipe'){if(!learnRecipe(p.rid,cx,cy-4))addMoney(150,cx,cy,'#efe4d2');return}
  if(p.kind==='parrow'){P.arrows++;floatText(cx,cy,t('plusArrow'),'#e6e0d0');sfx.click();renderHotbar();return}
  if(p.kind==='fish'){P.mats.fish=(P.mats.fish||0)+1;store.stats.fish++;save();unlock('fish1');sfx.gold();addMoney(p.value,cx,cy-6,'#cfeaff');floatText(cx,cy+4,tr(p.fname),p.col);checkAch();return}
  if(p.kind==='gem'){const G=GEMS[p.gid??4];gemsTotal++;sfx.gem();particle(cx,cy+6,[hexOf(G.c[2]),hexOf(G.c[0])],10+(p.gid===6?20:0),1.6,26,0,1);addMoney(p.value,cx,cy,hexOf(G.c[0]));floatText(cx,cy+6,tr(G.n),hexOf(G.c[0]));unlock('first_gem');if(p.gid===6)rareFx({r:4,n:G.n,v:p.value})}
  else if(p.kind==='gold'){sfx.gold();particle(cx,cy+6,'#ffe28a',5,1.2,18,0,1);addMoney(p.value,cx,cy);unlock('first_gold')}
  else if(p.kind==='relic'){const rel=RELICS.find(r=>r.id===p.rid);sfx.relic();addMoney(rel.value,cx,cy,'#ffd27a');relicsRun++;const isNew=!store.relics[rel.id];store.relics[rel.id]=true;save();
    particle(cx,cy+6,['#ffd27a','#fff3c0','#d9a826'],24,2.2,40,0,1.5);showRelic(rel,isNew,true)}
  else if(p.kind==='lore'){if(p.cat==='paper')rollKeepsake(cx,cy);if(p.cat==='paper'&&PAPERS[p.lid]&&PAPERS[p.lid].unlock)setTimeout(()=>learnRecipe(PAPERS[p.lid].unlock),600);sfx.page();runFinds++;const k=(p.cat==='paper'?'p':'f')+p.lid;store.lore[k]=true;save();addMoney(100,cx,cy,'#efe4d2');if(p.cat==='paper')showPaper(p.lid,true);else showPhoto(p.lid,true)}
  checkAch();
}
function markSeen(){const r=Math.ceil(P.lampR)+1,cx=Math.floor((P.x+P.w/2)/T),cy=Math.floor((P.y+P.h/2)/T);
  for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++)if(x>=0&&y>=0&&x<MW&&y<MH&&(x-cx)**2+(y-cy)**2<=r*r)seen[idx(x,y)]=1}
function clampCam(){const mw=MW*T,mh=MH*T;cam.x=VW>=mw?(mw-VW)/2:clamp(cam.x,0,mw-VW);cam.y=VH>=mh?(mh-VH)/2:clamp(cam.y,0,mh-VH)}

/* =========================================================== ranged weapons */
function fireWeapon(a,cx){const p=P,w=curW(),d=WPN[w];
  if(DEMON_FIRE[w]){if(d.am&&!(p[d.am]>0)){p.wcd=30;sfx.click();floatText(cx,p.y-8,t('noSouls'),'#c7d3d9');return}if(d.am)p[d.am]--;DEMON_FIRE[w](a,cx);renderHotbar();return}
  if(w==='whip'){p.wcd=d.cd;p.whip=10;sfx.whip();const bx=p.face>0?p.x+p.w-2:p.x-30;startMelee(p.face,32,2,'whip');hitStuff({x:bx,y:p.y-4,w:32,h:p.h+4},2,cx,'whip');return}
  if(d.am&&p[d.am]<=0){p.wcd=30;sfx.click();floatText(cx,p.y-8,d.am==='arrows'?t('noArrows'):t('noAmmo'),'#c7d3d9');return}
  if(d.am)p[d.am]--;p.wcd=d.cd;setTimeout(()=>wearWeapon(w),0);const ca=Math.cos(a.ang),sa=Math.sin(a.ang),mx=cx+ca*9,my=p.y+6+sa*9;
  if(w==='bow'){shots.push({x:mx,y:my,vx:ca*7,vy:sa*7,g:.13,dmg:2,k:'arrow',life:240});sfx.bow()}
  else if(w==='xbow'){shots.push({x:mx,y:my,vx:ca*11,vy:sa*11,g:.03,dmg:3.5,k:'bolt',life:240});sfx.xbow();shake=Math.max(shake,2)}
  else if(w==='pistol'){shots.push({x:mx,y:my,vx:ca*10,vy:sa*10,g:0,dmg:1.6,k:'bullet',life:70});sfx.pistol();flashes.push({x:mx,y:my,life:5,max:5,r:3*T});shake=Math.max(shake,2)}
  else{for(let k=0;k<6;k++){const an=a.ang+rand(-.2,.2),sp=rand(7,9);shots.push({x:mx,y:my,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,g:.05,dmg:1.4,k:'pellet',life:22})}
    sfx.shot();shake=Math.max(shake,5);flashes.push({x:mx,y:my,life:6,max:6,r:4*T});particle(mx,my,['#fff1b0','#ffb347'],8,2,10,0,1);p.vx-=ca*2.2}
  renderHotbar()}
function updateShots(){
  for(const s of shots){s.life--;s.vy+=s.g;s.x+=s.vx;s.y+=s.vy;if(inWaterAt(s.x,s.y)){s.vx*=.9;s.vy*=.9}
    if(hitStuff({x:s.x-2,y:s.y-2,w:4,h:4},s.dmg,s.x-s.vx,'ranged')){s.life=0;if(s.k==='hell')hellBurst(s.x,s.y);if((s.k==='arrow'||s.k==='bolt')&&Math.random()<.5)pickups.push({x:s.x-4,y:s.y-2,w:8,h:3,vx:0,vy:-1,kind:'parrow',ang:0,t:0});continue}
    if(isSolid(Math.floor(s.x/T),Math.floor(s.y/T))){s.life=0;if(s.k==='hell')hellBurst(s.x,s.y);
      if(s.k==='arrow'||s.k==='bolt'){sfx.thunk();pickups.push({x:s.x-s.vx*.35-4,y:s.y-s.vy*.35-2,w:8,h:4,vx:0,vy:0,kind:'parrow',ang:Math.atan2(s.vy,s.vx),still:true,t:0})}
      else particle(s.x,s.y,'#ffd27a',2,1,8,0,1)}}
  shots=shots.filter(s=>s.life>0)}

/* =========================================================== fishing */
const FISH=[{n:{en:'Blind fish',fi:'Sokeakala'},v:80,w:34,c:'#d8d0e0'},{n:{en:'Cave perch',fi:'Luola-ahven'},v:150,w:25,c:'#8aa86a'},{n:{en:'Shaft herring',fi:'Kuilusilakka'},v:60,w:20,c:'#b8c8d8'},{n:{en:'Glow eel',fi:'Hehkuankerias'},v:400,w:8,c:'#7ff0d8'},{n:{en:'Old rubber boot',fi:'Vanha kumisaapas'},v:5,w:7,c:'#3a3a3a'},{n:{en:'Goldfish',fi:'Kultakala'},v:900,w:3,c:'#f2c84b'},{n:'relic',w:3}];
function useRod(src,cx){const p=P;
  if(!p.rod){floatText(cx,p.y-8,t('noRod'),'#c7d3d9');return}
  if(!p.line){let vx,vy;const ox=cx+p.face*12,oy=p.y-4;let tx=null,ty=null;
    if(src==='mouse'&&mouse.seen){const m=mouseWorld();tx=m.x;ty=m.y;p.face=m.x>cx?1:-1}
    else{let best=1e9;const px=Math.floor(cx/T),py=Math.floor(p.y/T);
      for(let dy=-3;dy<=5;dy++)for(let k=1;k<=8;k++){const x=px+p.face*k,y=py+dy;if(isWater(x,y)&&!isWater(x,y-1)&&!isSolid(x,y-1)){const d=k+Math.abs(dy)*.5;if(d<best){best=d;tx=x*T+8;ty=y*T+4}}}}
    if(tx!==null){const dx=tx-(cx+p.face*12),dy=ty-(p.y-4),tt=clamp(Math.hypot(dx,dy)/4,14,40);vx=dx/tt;vy=dy/tt-.5*.2*tt}
    else{vx=p.face*2.2;vy=-2}
    if(p.slot!==2)selectSlot(2);
    p.line={x:ox,y:oy,vx,vy,st:'fly',t:0,wait:0};sfx.cast();return}
  if(p.line.st==='bite')catchFish(p.line);else sfx.reel();
  p.line=null}
function updateLine(cx){const L=P.line;if(!L)return;
  if(P.dead||P.climb||Math.hypot(L.x-cx,L.y-P.y)>12*T){P.line=null;return}
  if(L.st==='fly'){L.vy+=.2;L.x+=L.vx;L.y+=L.vy;const tx=Math.floor(L.x/T),ty=Math.floor(L.y/T);
    if(isWater(tx,ty)){let sy=ty;while(isWater(tx,sy-1))sy--;L.y=sy*T+3;L.st='float';L.wait=rand(150,460);if(spotLeft(L.x,L.y)<=0){L.wait=1e9;setTimeout(()=>{if(P.line===L)floatText(L.x,L.y-10,t('noBites'),'#c7d3d9')},2600)}sfx.splash();particle(L.x,L.y,'#9fd3f5',5,1.2,16,.12,1)}
    else if(isSolid(tx,ty)||++L.t>200){P.line=null;floatText(cx,P.y-8,t('noWater'),'#c7d3d9')}}
  else{if(!isWater(Math.floor(L.x/T),Math.floor((L.y+2)/T))){P.line=null;return}
    if(L.st==='float'){L.wait--;if(L.wait<=0){L.st='bite';L.t=50;sfx.plop();particle(L.x,L.y,'#cfeaff',5,1,12,.1,1)}}
    else if(L.st==='bite'){L.t--;if(L.t<=0){L.st='float';L.wait=rand(150,420);floatText(L.x,L.y-8,t('bait'),'#c7d3d9')}}}}
function catchFish(L){spotCaught(L.x,L.y);const tot=FISH.reduce((s,f)=>s+f.w,0);let r=Math.random()*tot,f=FISH[0];for(const x of FISH){r-=x.w;if(r<=0){f=x;break}}
  const dx=P.x+P.w/2-L.x,dy=P.y-L.y;
  if(f.n==='relic'){const rel=chooseRelic();pickups.push({x:L.x-4,y:L.y-6,w:8,h:8,vx:dx/40,vy:dy/40-6,kind:'relic',rid:rel.id,value:rel.value,t:0});floatText(L.x,L.y-10,t('heavy'),'#ffd27a')}
  else pickups.push({x:L.x-4,y:L.y-6,w:8,h:5,vx:dx/40,vy:dy/40-6,kind:'fish',fname:f.n,value:f.v,col:f.c,t:0});
  sfx.splash();particle(L.x,L.y,'#cfeaff',10,2,20,.15,1)}
function rodTip(){return {x:P.x+P.w/2+P.face*14,y:P.y+P.h-22}}

/* =========================================================== underground dwellers */
const NPCD={
  coffee:{names:['Erkki','Toivo','Veikko'],lines:{en:["Coffee has to boil up three times, or it's just brown water.",'You used to buy coffee in a shop. Now you can only get it from me.','When the pot is bubbling, even the wolves stay away. I think.','Sabu once asked for the recipe. I didn\'t tell him.'],fi:['Kahvi pitää antaa kuohahtaa kolmesti, muuten se on pelkkää ruskeaa vettä.','Ennen kahvia sai kaupasta. Nyt sitä saa vain minulta.','Kun pannu porisee, sudetkin pysyvät poissa. Luulisin.','Sabu kysyi kerran reseptiä. En kertonut.']},
    gift(){P.poison=0;if(P.hp<8){P.hp++;P.maxHp=Math.max(P.maxHp,P.hp)}unlock('coffee');return LANG==='fi'?'Pannukahvi on just kiehahtanut. Ota kuppi, se lämmittää. (+1 sydän)':"The coffee has just come to the boil. Have a cup, it'll warm you up. (+1 heart)"}},
  fisher:{names:['Raili','Sirkka','Pertti'],lines:{en:["Shh. The fish can hear a digger's boots.",'Blind fish eat anything. Almost like people.','Once I caught a golden fish here. I let it go.','Glow eels only bite when it is completely quiet.'],fi:['Hys. Kalat kuulevat kaivajan saappaat.','Sokeakalat syövät mitä tahansa. Melkein kuin ihmiset.','Kerran sain täältä kultaisen kalan. Päästin sen menemään.','Hehkuankeriaat syövät vasta, kun on ihan hiljaista.']},
    gift(){if(!P.rod){P.rod=true;renderHotbar();return LANG==='fi'?'Ota tämä onki, minulla on toinen. Heitä se veteen ja vedä, kun koho nykäisee. (Onki: paikka 3)':'Take this rod, I have another. Cast it into the water and reel in when the float bobs. (Rod: slot 3)'}addMoney(150);return LANG==='fi'?'Tässä, ota pari sokeakalaa evääksi. (+$150)':'Here, have a couple of blind fish for the road. (+$150)'}},
  harmonica:{names:['Pentti','Kalevi','Eino'],lines:{en:['This tune was on the radio the summer everything still played.',"A harmonica needs no batteries. That's why it still works.",'The echo down here beats any concert hall.'],fi:['Tämä kappale soi radiossa sinä kesänä, kun kaikki vielä soi.','Huuliharppu ei tarvitse paristoja. Siksi se on vielä käytössä.','Kaiku täällä alhaalla on parempi kuin missään konserttisalissa.']},
    gift(){if(!P.weapons.length){giveWeapon('bow');P.arrows+=8;renderHotbar();return LANG==='fi'?'Tämä jousi on roikkunut seinälläni vuosia. Minä soitan, sinä ammut. (+ jousipyssy ja 8 nuolta)':'This bow has hung on my wall for years. I play, you shoot. (+ bow and 8 arrows)'}if(ammoKind()==='arrows'){P.arrows+=6;return LANG==='fi'?'Löysin nämä nuolet kolosta. En osaa ampua, osaan vain soittaa. (+6 nuolta)':"Found these arrows in a crevice. I can't shoot, I can only play. (+6 arrows)"}P.bombs++;return LANG==='fi'?'Löysin tämän kolosta. Pidä se kaukana minusta. (+1 pommi)':'Found this in a crevice. Keep it away from me. (+1 bomb)'}},
  knitter:{names:['Aune','Hilkka','Martta'],lines:{en:['I knit socks for everyone who comes by. You are the fourteenth.','The spiders and I understand each other. We both make yarn.','Keep your toes warm and your head stays cool.'],fi:['Neulon sukat jokaiselle, joka käy. Olet neljästoista.','Hämähäkit ja minä ymmärrämme toisiamme. Molemmat teemme lankaa.','Pidä varpaat lämpiminä, niin pää pysyy kylmänä.']},
    gift(){P.ropes+=2;renderHotbar();return LANG==='fi'?'Lankakerä on köyttä vahvempi, kun sen osaa punoa. Ota nämä. (+2 köyttä)':'Yarn is stronger than rope if you know how to braid it. Take these. (+2 ropes)'}},
  reader:{names:['Ilmari','Sointu','Veli'],lines:{en:['This paper is years old, but I read it again every day.','It has the weather forecast. Do you remember what rain is like?','The horoscope promises surprises. It has always been right.'],fi:['Tämä lehti on vuosien takaa, mutta luen sen joka päivä uudestaan.','Täällä kerrotaan säästä. Muistatko, millaista on sade?','Horoskooppi lupaa yllätyksiä. Se on aina ollut oikeassa.']},
    gift(){const it=chooseLore();if(it){pickups.push({x:P.x,y:P.y,w:8,h:6,vx:0,vy:-1,kind:'lore',cat:it.cat,lid:it.id,value:0,t:6});return LANG==='fi'?'Lehden välissä oli tämä. Se ei kuulu minulle, ehkä se kuuluu sinulle.':"This was tucked inside the paper. It isn't mine. Maybe it's yours."}addMoney(200);return LANG==='fi'?'Löysin lehden välistä vanhoja seteleitä. Ota ne, minulla ei ole niille käyttöä. (+$200)':'Found some old banknotes in the paper. Take them, I have no use for them. (+$200)'}}
};
let talkT=0;
/* showTalk and talkTo live in folk.js (voices, tea, bakery) */
function updateNpcs(){updFolk();for(const n of npcs){n.anim++;if(Math.abs(n.x-(P.x+P.w/2))>VW)continue;
  const fx=n.x+n.face*13;
  if(n.type==='coffee'){if(frame%4===0)parts.push({x:fx+rand(-3,3),y:n.y-5,vx:rand(-.2,.2),vy:-rand(.4,.9),life:22,max:22,col:pickR(['#ffb347','#ff7a2e','#fff1b0']),g:-.01,sz:1});
    if(frame%9===0)parts.push({x:fx+3,y:n.y-14,vx:rand(-.1,.2),vy:-.35,life:60,max:60,col:'rgba(220,220,230,.45)',g:-.002,sz:2})}
  if(n.type==='harmonica'&&frame%40===0)texts.push({x:n.x+n.face*6,y:n.y-20,txt:pickR(['♪','♫']),col:'#f3dfb0',life:60});
  if(n.type==='fisher'&&n.wy&&(frame+n.anim|0)%240===0)particle(n.wx,n.wy,'#cfeaff',3,.8,14,.1,1)}}
