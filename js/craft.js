/*
  Arkeol v0.3.2 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  craft.js – materials, recipes, campfires as workbenches and placeable torches and ladders
*/
'use strict';
const MATS={
  fiber:{n:{en:'Fibre',fi:'Kuitu'},c:'#7aa652'},
  wood:{n:{en:'Wood',fi:'Puu'},c:'#9a6a3a'},
  silk:{n:{en:'Spider silk',fi:'Seitti'},c:'#e6e8f0'},
  bone:{n:{en:'Bone',fi:'Luu'},c:'#efe8d8'},
  scrap:{n:{en:'Scrap',fi:'Romu'},c:'#8f99a3'},
  powder:{n:{en:'Saltpetre',fi:'Salpietari'},c:'#d8d0c0'},
  spores:{n:{en:'Spores',fi:'Itiöt'},c:'#7fe8d8'},
  shroom:{n:{en:'Mushrooms',fi:'Sienet'},c:'#d83a2a'},
  berry:{n:{en:'Berries',fi:'Marjat'},c:'#3a5ad8'},
  fish:{n:{en:'Fish',fi:'Kala'},c:'#b8c8d8'}
};
const MATKEYS=Object.keys(MATS);
const RECIPES=[
 {id:'rope',n:{en:'Rope',fi:'Köysi'},d:{en:'Braided from fibres. +1 rope.',fi:'Punottu kuiduista. +1 köysi.'},need:{fiber:3},ic:'rope',start:1,make:()=>{P.ropes++}},
 {id:'torch',n:{en:'Torch',fi:'Soihtu'},d:{en:'Place it on a wall or the floor. It keeps burning.',fi:'Aseta seinään tai lattialle. Palaa pysyvästi.'},need:{wood:1,spores:1},ic:'torch',start:1,make:()=>{P.torches=(P.torches||0)+1}},
 {id:'bandage',n:{en:'Bandage',fi:'Side'},d:{en:'+1 heart and cures poison.',fi:'+1 sydän ja parantaa myrkytyksen.'},need:{fiber:2,spores:1},ic:'bandage',start:1,ok:()=>P.hp<8||P.poison>0,make:()=>{P.hp=Math.min(8,P.hp+1);P.maxHp=Math.max(P.maxHp,P.hp);P.poison=0}},
 {id:'ladder',n:{en:'Ladder',fi:'Tikkaat'},d:{en:'Place it to climb up to a ceiling or down a drop.',fi:'Aseta ja kiipeä kattoon asti tai alas pudotukseen.'},need:{wood:4},ic:'ladder',start:1,station:1,make:()=>{P.ladders=(P.ladders||0)+1}},
 {id:'silkrope',n:{en:'Silk rope',fi:'Seittiköysi'},d:{en:'Spider silk is stronger than it looks. +1 rope.',fi:'Seitti on vahvempaa kuin luulisi. +1 köysi.'},need:{silk:2},ic:'rope'},
 {id:'arrows',n:{en:'Arrows',fi:'Nuolet'},d:{en:'Bone tips on wooden shafts. +5 arrows.',fi:'Luukärjet puuvarsissa. +5 nuolta.'},need:{wood:1,bone:1},ic:'arrows',make:()=>{P.arrows+=5}},
 {id:'fried',n:{en:'Fried mushrooms',fi:'Paistetut sienet'},d:{en:'Keeps in your pack. Eat later: +1 heart and a digging frenzy.',fi:'Säilyy repussa. Syö myöhemmin: +1 sydän ja kaivuuvimma.'},need:{shroom:2},ic:'meal_fried',station:1,start:1,meal:1},
 {id:'pie',n:{en:'Blueberry pie',fi:'Mustikkapiirakka'},d:{en:'Keeps in your pack. Eat later: +2 hearts.',fi:'Säilyy repussa. Syö myöhemmin: +2 sydäntä.'},need:{berry:3,wood:1},ic:'meal_pie',station:1,start:1,meal:1},
 {id:'kalakukko',n:{en:'Kalakukko',fi:'Kalakukko'},d:{en:"Grandma's fish pasty from Kuopio. Keeps for days. Eat later: +3 hearts and cures poison.",fi:'Mummon kalakukko Kuopiosta. Säilyy päiviä. Syö myöhemmin: +3 sydäntä ja parantaa myrkytyksen.'},need:{fish:2,wood:1,berry:1},ic:'meal_kukko',station:1,meal:1,special:1},
 {id:'stew',meal:1,n:{en:'Mushroom stew',fi:'Sienimuhennos'},d:{en:'Keeps in your pack. Eat later: +2 hearts.',fi:'Säilyy repussa. Syö myöhemmin: +2 sydäntä.'},need:{spores:3,bone:1},ic:'stew',station:1,make:()=>{P.hp=Math.min(8,P.hp+2);P.maxHp=Math.max(P.maxHp,P.hp)}},
 {id:'bomb',n:{en:'Bomb',fi:'Pommi'},d:{en:'Saltpetre packed in a scrap shell. +1 bomb.',fi:'Salpietaria romukuoressa. +1 pommi.'},need:{powder:2,scrap:1},ic:'bomb',station:1,make:()=>{P.bombs++}},
 {id:'ammo',n:{en:'Hand-loaded rounds',fi:'Itse ladatut patruunat'},d:{en:'+4 rounds for the pistol and shotgun.',fi:'+4 patruunaa pistooliin ja haulikkoon.'},need:{powder:1,scrap:2},ic:'ammo',station:1,make:()=>{P.ammo+=4}}
];
RECIPES.find(r=>r.id==='silkrope').make=()=>{P.ropes++};
store.recipes=store.recipes||{};
(function(){try{const s=JSON.parse(localStorage.getItem(SKEY)||'null');if(s&&s.recipes)store.recipes=s.recipes}catch(e){}for(const r of RECIPES)if(r.start)store.recipes[r.id]=1})();
const knowsRecipe=id=>!!store.recipes[id];
const lockedRecipes=()=>RECIPES.filter(r=>!knowsRecipe(r.id)&&!r.special);
const MEALS={fried:{hp:1,haste:1},pie:{hp:2},kalakukko:{hp:3,cure:1},stew:{hp:2}};
function eatMeal(id){const m=MEALS[id];if(!(P.meals[id]>0))return;P.meals[id]--;sfx.eat();P.hp=Math.min(8,P.hp+m.hp);P.maxHp=Math.max(P.maxHp,P.hp);if(m.cure)P.poison=0;if(m.haste)P.haste=1200;
  const r=RECIPES.find(q=>q.id===id);floatText(P.x+5,P.y-10,tr(r.n),'#ffcf7a');particle(P.x+5,P.y+4,['#ffcf7a','#ff8a7a'],12,1.6,24,0,1)}
function learnRecipe(id,x,y){if(!id||knowsRecipe(id))return false;store.recipes[id]=1;save();const r=RECIPES.find(q=>q.id===id);sfx.page();
  if(x!==undefined)floatText(x,y,tr(r.n),'#ffe7a8');
  const el=document.createElement('div');el.className='achT';el.innerHTML=`<small>${esc(t('newRecipe'))}</small><b>${esc(tr(r.n))}</b>${esc(t('newRecipeHint'))}`;$('achs').appendChild(el);setTimeout(()=>el.remove(),4200);return true}

/* ------------------------------------------------ materials */
function dropMat(mat,x,y,n=1){for(let k=0;k<n;k++)pickups.push({x:x-3,y:y-3,w:6,h:5,vx:rand(-1,1),vy:rand(-2.2,-1),kind:'mat',mat,t:0})}
function gainMat(mat,n,x,y){P.mats[mat]=(P.mats[mat]||0)+n;sfx.pickup();if(x!==undefined)floatText(x,y,`+${n} ${tr(MATS[mat].n)}`,MATS[mat].c)}
const HARVEST={hangvine:['fiber',1,1],vine:['fiber',1,1],grass:['fiber',1,.7],fern:['fiber',1,1],wallmoss:['fiber',1,.5],mosscarpet:['fiber',1,.35],mossceil:['fiber',1,.35],
  glowflower:['spores',1,1],mush:['spores',1,1],bigmush:['spores',2,1],bones:['bone',1,1],beam:['wood',2,1],oldpick:['scrap',1,1],oldlamp:['scrap',1,1],tripod:['scrap',1,1],bedroll:['fiber',2,1],flag:['wood',1,1],barrel:['wood',1,1],sprout:['fiber',1,.5]};
function harvestBox(box){let any=false;const x0=Math.floor(box.x/T),x1=Math.floor((box.x+box.w)/T),y0=Math.floor(box.y/T),y1=Math.floor((box.y+box.h)/T);
  for(const d of decos){if(d.dead||d.tx<x0||d.tx>x1||d.ty<y0||d.ty>y1)continue;const h=HARVEST[d.k];if(!h)continue;
    if(d.k==='barrel'&&shop&&d.tx>=shop.x0&&d.tx<shop.x0+shop.w)continue;
    d.dead=true;any=true;sfx.cut();particle(d.tx*T+8,d.ty*T+10,[MATS[h[0]].c,'#4a6a30'],7,1.2,22,.1,1);if(Math.random()<h[2])dropMat(h[0],d.tx*T+8,d.ty*T+8,h[1])}
  for(const f of foods.slice()){if(f.x+10<box.x||f.x>box.x+box.w||f.y+10<box.y||f.y>box.y+box.h)continue;
    if(f.kind==='mushP'){if(!(f.cd>0))puffSpores(f);continue}
    foods=foods.filter(q=>q!==f);any=true;sfx.cut();const m=f.kind==='mushR'?'shroom':'berry';particle(f.x+5,f.y+6,[MATS[m].c,'#4a6a30'],7,1.2,22,.1,1);dropMat(m,f.x+5,f.y+4,f.kind==='mushR'?1:2)}
  return any}

/* ------------------------------------------------ workbench = a campfire (or the coffee-boiler's fire) */
function nearStation(){if(!P)return false;const cx=P.x+P.w/2,cy=P.y+P.h/2;
  return decos.some(d=>!d.dead&&d.k==='campfire'&&Math.hypot(d.tx*T+8-cx,d.ty*T+8-cy)<4*T)||npcs.some(n=>n.type==='coffee'&&Math.hypot(n.x-cx,n.y-cy)<5*T)}

/* ------------------------------------------------ placing torches and ladders */
function placeTorch(){if(!(P.torches>0))return false;const tx=Math.floor((P.x+P.w/2)/T),ty=Math.floor((P.y+P.h/2)/T);
  if(SOL[tileAt(tx,ty)]||decos.some(d=>!d.dead&&d.tx===tx&&d.ty===ty&&(d.k==='torch'||d.k==='ftorch')))return false;
  let d=null;if(isSolid(tx+P.face,ty))d={tx,ty,k:'torch',sx:P.face,sy:0};else if(isSolid(tx-P.face,ty))d={tx,ty,k:'torch',sx:-P.face,sy:0};
  else{const fy=Math.floor((P.y+P.h-1)/T);if(isSolid(tx,fy+1))d={tx,ty:fy,k:'ftorch',sx:0,sy:1}}
  if(!d)return false;decos.push(d);P.torches--;sfx.click();particle(tx*T+8,ty*T+8,['#ffcf7a','#ffb347'],8,1,20,-.02,1);return true}
function placeLadder(){if(!(P.ladders>0))return false;const tx=Math.floor((P.x+P.w/2)/T),fy=Math.floor((P.y+P.h-1)/T);
  let lad=null;
  if(P.onGround){const fx=tx+P.face;if(!isSolid(fx,fy)&&!isSolid(fx,fy+1)){let len=0;while(len<12&&!isSolid(fx,fy+len))len++;if(len>=2)lad={tx:fx,top:fy,len}}}
  if(!lad){let top=fy;for(let k=0;k<9;k++){if(isSolid(tx,top-1))break;top--}const len=fy-top+1;if(len>=2)lad={tx,top,len}}
  if(!lad)return false;ropes.push({tx:lad.tx,top:lad.top,len:lad.len,cur:lad.len,head:lad.top*T,lad:true});P.ladders--;sfx.knock();return true}

/* ------------------------------------------------ crafting screen */
function openCraft(){if(state!=='play'||!P)return;state='craft';releaseAll();renderCraft();$('craft').hidden=false;setTimeout(()=>$('craftClose').focus(),30)}
function closeCraft(){$('craft').hidden=true;if(state==='craft')state='play';releaseAll();renderHotbar()}
function renderCraft(){const at=nearStation();
  $('craftStation').textContent=at?t('atFire'):t('noFire');$('craftStation').className='craftStation'+(at?' on':'');
  const mr=$('craftMats');mr.innerHTML='';for(const k of MATKEYS){const s=document.createElement('span');s.className='mat'+((P.mats[k]||0)?'':' zero');s.innerHTML=`<img alt="" src="${ICON['m_'+k]}"><b>${P.mats[k]||0}</b><small>${esc(tr(MATS[k].n))}</small>`;mr.append(s)}
  const pl=$('craftPlace');pl.innerHTML='';
  for(const id of Object.keys(MEALS)){const n=P.meals[id]||0;if(!n)continue;const r=RECIPES.find(q=>q.id===id),b=document.createElement('button');b.type='button';b.className='btn2 eatBtn';b.textContent=t('eatMeal',tr(r.n),n);b.addEventListener('click',()=>{eatMeal(id);renderCraft()});pl.append(b)}
  for(const [id,cnt,fn] of [['torch',P.torches||0,placeTorch],['ladder',P.ladders||0,placeLadder]]){if(!cnt)continue;const b=document.createElement('button');b.type='button';b.className='btn2';b.textContent=t('place_'+id,cnt);
    b.addEventListener('click',()=>{closeCraft();if(!fn()){sfx.nope();floatText(P.x+5,P.y-8,t('cantPlace'),'#ffb0a0')}});pl.append(b)}
  pl.hidden=!pl.children.length;
  const g=$('craftGrid');g.innerHTML='';const known=RECIPES.filter(r=>knowsRecipe(r.id)).length;$('craftProg').textContent=t('recipesKnown',known,RECIPES.length);
  for(const r of RECIPES){const kn=knowsRecipe(r.id),d=document.createElement('div');d.className='sitem craftItem'+(kn?'':' sold');
    if(!kn){d.innerHTML=`<img alt="" src="${ICON.none}"><div><b>???</b><span>${esc(t('recipeLocked'))}</span></div>`;g.append(d);continue}
    const needs=Object.entries(r.need).map(([m,n])=>`<i class="${(P.mats[m]||0)>=n?'ok':'no'}"><img alt="" src="${ICON['m_'+m]}">${P.mats[m]||0}/${n}</i>`).join('');
    d.innerHTML=`<img alt="" src="${ICON[r.ic]}"><div><b>${esc(tr(r.n))}${r.station?` <em class="fireTag">${esc(t('fireTag'))}</em>`:''}</b><span>${esc(tr(r.d))}</span><span class="needs">${needs}</span></div>`;
    const can=Object.entries(r.need).every(([m,n])=>(P.mats[m]||0)>=n)&&(!r.station||at)&&(r.meal||!r.ok||r.ok());
    const b=document.createElement('button');b.type='button';b.textContent=t('make');b.disabled=!can;
    b.addEventListener('click',()=>{for(const [m,n] of Object.entries(r.need))P.mats[m]-=n;if(r.meal)P.meals[r.id]=(P.meals[r.id]||0)+1;else r.make();sfx.buy();store.stats.crafts=(store.stats.crafts||0)+1;save();renderCraft();renderHotbar()});
    d.append(b);g.append(d)}}
