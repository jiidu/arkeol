/*
  Arkeol v0.3.2 · Copyright (C) 2026 JP Hakoluoto
  SPDX-License-Identifier: GPL-3.0-or-later (with the additional attribution term in NOTICE)
  wardrobe.js – clothes, dyes and the wardrobe screen
*/
const DYES=[
 {id:'khaki',c:'#a89464',n:{en:'Khaki',fi:'Khaki'},start:1},
 {id:'brown',c:'#6b5636',n:{en:'Brown',fi:'Ruskea'},start:1},
 {id:'tan',c:'#c49a52',n:{en:'Tan',fi:'Kameli'},start:1},
 {id:'red',c:'#b84a32',n:{en:'Brick red',fi:'Tiilenpunainen'},start:1},
 {id:'olive',c:'#6e7440',n:{en:'Olive',fi:'Oliivi'}},
 {id:'cream',c:'#e6dcc4',n:{en:'Cream',fi:'Kerma'}},
 {id:'charcoal',c:'#3a3640',n:{en:'Charcoal',fi:'Hiili'}},
 {id:'navy',c:'#2f4470',n:{en:'Navy',fi:'Laivastonsininen'}},
 {id:'sky',c:'#6aa4c8',n:{en:'Sky blue',fi:'Taivaansininen'}},
 {id:'teal',c:'#2f7a78',n:{en:'Teal',fi:'Sinivihreä'}},
 {id:'forest',c:'#3c6a34',n:{en:'Forest green',fi:'Metsänvihreä'}},
 {id:'mustard',c:'#c99a2a',n:{en:'Mustard',fi:'Sinappi'}},
 {id:'rust',c:'#a4502c',n:{en:'Rust',fi:'Ruoste'}},
 {id:'crimson',c:'#9a1e2a',n:{en:'Crimson',fi:'Karmiini'}},
 {id:'plum',c:'#6a3a6e',n:{en:'Plum',fi:'Luumu'}},
 {id:'rose',c:'#c8728a',n:{en:'Rose',fi:'Ruusu'}}
];
const HATS=[
 {id:'pith',n:{en:'Pith helmet',fi:'Tropiikkikypärä'},start:1},
 {id:'none',n:{en:'No hat',fi:'Ei hattua'},start:1},
 {id:'fedora',n:{en:'Fedora',fi:'Fedora'}},
 {id:'cap',n:{en:'Cap',fi:'Lippis'}},
 {id:'hardhat',n:{en:'Hard hat',fi:'Kypärä'}},
 {id:'beanie',n:{en:'Beanie',fi:'Pipo'}},
 {id:'cowboy',n:{en:'Wide-brim hat',fi:'Leveälierinen hattu'}},
 {id:'straw',n:{en:'Straw hat',fi:'Olkihattu'}},
 {id:'fez',n:{en:'Fez',fi:'Fez'},shop:1}
];
const TOPS=[
 {id:'shirt',n:{en:'Field shirt',fi:'Kenttäpaita'},start:1},
 {id:'vest',n:{en:'Vest',fi:'Liivi'}},
 {id:'coat',n:{en:'Long coat',fi:'Pitkä takki'}},
 {id:'sweater',n:{en:'Knitted sweater',fi:'Neulepaita'}}
];
const NECKS=[
 {id:'bandana',n:{en:'Bandana',fi:'Huivi'},start:1},
 {id:'none',n:{en:'Nothing',fi:'Ei mitään'},start:1},
 {id:'scarf',n:{en:'Long scarf',fi:'Pitkä kaulaliina'}},
 {id:'tie',n:{en:'Necktie',fi:'Solmio'}}
];
const WCATS={d:DYES,h:HATS,t:TOPS,n:NECKS};
const WALL=[...DYES.map(x=>'d:'+x.id),...HATS.map(x=>'h:'+x.id),...TOPS.map(x=>'t:'+x.id),...NECKS.map(x=>'n:'+x.id)];
const HAIRS=[{id:'brown',c:'#4a3020'},{id:'dark',c:'#1e1612'},{id:'blond',c:'#c8a050'},{id:'red',c:'#8a3a1a'},{id:'grey',c:'#9a948a'}];
const hairC=id=>(HAIRS.find(h=>h.id===id)||HAIRS[0]).c;
const WDEF={body:'m',hair:'brown',hat:'pith',hatC:'tan',top:'shirt',topC:'khaki',pants:'brown',neck:'bandana',neckC:'red'};
store.wardrobe=store.wardrobe||{own:{},look:{}};
(function(){try{const s=JSON.parse(localStorage.getItem(SKEY)||'null');if(s&&s.wardrobe)store.wardrobe=s.wardrobe}catch(e){}
  const w=store.wardrobe;w.own=w.own||{};w.look=Object.assign({},WDEF,w.look||{});
  for(const k in WCATS)for(const it of WCATS[k])if(it.start)w.own[k+':'+it.id]=1})();
const wOwn=key=>!!store.wardrobe.own[key];
const wItem=key=>{const [k,id]=key.split(':');return WCATS[k].find(x=>x.id===id)};
const dyeC=id=>(DYES.find(d=>d.id===id)||DYES[0]).c;
function shade(hex,f){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;
  if(f>0){r+=(255-r)*f;g+=(255-g)*f;b+=(255-b)*f}else{r*=1+f;g*=1+f;b*=1+f}
  return '#'+[r,g,b].map(v=>Math.round(v).toString(16).padStart(2,'0')).join('')}
/* resolved colours for the current look */
function look(){const L=store.wardrobe.look;return {body:L.body||'m',hc2:hairC(L.hair),hat:L.hat,hc:dyeC(L.hatC),top:L.top,tc:dyeC(L.topC),pc:dyeC(L.pants),neck:L.neck,nc:dyeC(L.neckC)}}
/* pick something not yet found; dyes are the most common find */
function randomCosmetic(only){const pool=WALL.filter(k=>!wOwn(k)&&!wItem(k).shop&&(!only||only.includes(k[0])));if(!pool.length)return null;
  const w=pool.map(k=>k[0]==='d'?3:1),sum=w.reduce((a,b)=>a+b,0);let r=Math.random()*sum;for(let i=0;i<pool.length;i++){r-=w[i];if(r<=0)return pool[i]}return pool[0]}
function gainCosmetic(key,x,y){if(!key||wOwn(key))return false;store.wardrobe.own[key]=1;save();
  const it=wItem(key),name=tr(it.n)+(key[0]==='d'?' '+t('wDyeSuffix'):'');sfx.relic();
  if(x!==undefined)floatText(x,y,name,key[0]==='d'?dyeC(it.id):'#ffe7a8');
  const el=document.createElement('div');el.className='achT clothesT';el.innerHTML=`<small>${esc(t('newClothes'))}</small><b>${esc(name)}</b>${esc(t('wHint'))}`;$('achs').appendChild(el);setTimeout(()=>el.remove(),4200);return true}

/* ------------------------------------------------ drawing the outfit (origin at the feet, facing right) */
function drawHat(o){const c=o.hc,d=shade(c,-.25),l=shade(c,.22);
  switch(o.hat){
  case 'none':{const h=o.hc2;R(-4,-16,8,2,h);R(-4,-14,2,2,h);R(-3,-17,5,1,shade(h,.15));if(o.body==='f'){R(-5,-16,2,5,h);R(2,-16,2,1,h)}break}
  case 'fedora':R(-6,-16,12,1,d);R(-4,-19,8,3,c);R(-4,-19,8,1,l);R(-1,-19,2,1,d);R(-4,-17,8,1,'#2a1e16');break;
  case 'cap':R(-4,-18,8,3,c);R(-3,-19,6,1,c);R(-3,-19,6,1,l);R(3,-16,4,1,d);R(-1,-20,2,1,l);break;
  case 'hardhat':R(-5,-16,10,1,d);R(-4,-19,8,3,c);R(-3,-20,6,1,c);R(-1,-20,2,4,l);R(3,-18,2,2,'#fff6c0');break;
  case 'beanie':R(-4,-19,8,4,c);R(-3,-20,6,1,c);R(-4,-16,8,1,d);R(-4,-18,8,1,l);R(-1,-22,2,2,l);break;
  case 'cowboy':R(-7,-16,14,1,d);R(-7,-17,1,1,d);R(6,-17,1,1,d);R(-3,-20,6,4,c);R(-3,-20,6,1,l);R(-1,-20,2,1,d);R(-3,-17,6,1,'#2a1e16');break;
  case 'straw':R(-7,-16,14,1,'#d8bc6a');R(-6,-16,1,1,'#b89a4a');R(4,-16,1,1,'#b89a4a');R(-3,-19,6,3,'#e0c47a');R(-3,-19,6,1,'#f0dc9a');R(-3,-17,6,1,c);break;
  case 'fez':{R(-3,-20,6,5,c);R(-2,-21,4,1,c);R(-3,-20,1,5,d);R(2,-20,1,5,l);const sw=Math.round(Math.sin(frame*.12)*.6);R(-4+sw,-20,1,4,'#1a1410');R(-4+sw,-17,1,1,'#d6b04a');break}
  default:R(-6,-16,12,1,shade(c,-.15));R(-4,-18,8,2,c);R(-3,-19,6,1,c);R(-4,-18,8,1,l);R(-4,-16,8,1,'#5a3a22');R(3,-18,2,2,'#fff6c0')}}
function drawHairBack(o){const h=o.hc2;if(o.body==='f'){const sw=Math.round(Math.sin(frame*.12)*.6);R(-6,-15,2,3,h);R(-7+sw,-12,2,4,h);R(-7+sw,-9,2,1,shade(h,-.2));R(-6,-13,1,1,'#b84a32')}else R(-5,-15,1,3,h)}
function drawTop(o,moving){const c=o.tc,d=shade(c,-.2),l=shade(c,.2);
  switch(o.top){
  case 'vest':R(-5,-11,10,6,'#e6dcc4');R(-5,-11,10,1,'#f4ecda');R(-5,-11,4,6,c);R(1,-11,4,6,c);R(-5,-11,4,1,l);R(1,-11,4,1,l);R(-1,-9,1,1,d);R(-1,-7,1,1,d);R(-5,-6,10,1,'#5a3a22');R(-1,-6,2,1,'#c9a043');break;
  case 'coat':{R(-5,-11,10,6,c);R(-5,-11,10,1,l);R(0,-11,1,6,d);R(-5,-11,2,2,d);R(3,-11,2,2,d);const fl=moving?Math.round(Math.sin(frame*.3)):0;R(-6-fl,-6,4,4,c);R(-6-fl,-3,4,1,d);R(2,-6,3,3,c);R(2,-4,3,1,d);break}
  case 'sweater':R(-5,-11,10,6,c);R(-5,-11,10,1,l);for(let i=0;i<5;i++)R(-5+i*2,-9,1,1,l);for(let i=0;i<5;i++)R(-4+i*2,-8,1,1,d);R(-5,-6,10,1,d);break;
  default:R(-5,-11,10,6,c);R(-5,-11,10,1,l);R(-5,-6,10,1,'#5a3a22');R(-1,-6,2,1,'#c9a043');R(-2,-11,1,5,d)}}
function sleeveC(o){return o.top==='vest'?'#e6dcc4':o.tc}
function drawNeck(o,moving){const c=o.nc,d=shade(c,-.25);
  switch(o.neck){
  case 'bandana':R(-3,-11,6,1,c);R(-4,-11,2,2,c);R(-5,-10,1,1,d);break;
  case 'scarf':{R(-4,-12,8,2,c);R(-4,-12,8,1,shade(c,.2));const fl=moving?Math.round(Math.sin(frame*.35)*1.5):0;R(-6,-11,2,3,c);R(-7,-9+fl,2,2,c);R(-7,-8+fl,2,1,d);break}
  case 'tie':R(1,-11,2,1,c);R(1,-10,2,3,c);R(2,-8,1,1,d);break}}

/* ------------------------------------------------ wardrobe screen */
function wardrobePreview(){const cvs=$('wPrev');if(!cvs)return;const g=cvs.getContext('2d');g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,cvs.width,cvs.height);
  g.imageSmoothingEnabled=false;g.setTransform(4,0,0,4,0,0);
  g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(16,28,9,1.6,0,0,7);g.fill();
  const fake={x:10,y:6,w:12,h:22,face:1,dead:false,inv:0,onGround:true,vx:0,anim:0,climb:0,jumpV:5,softBoots:P?P.softBoots:false,swing:0,aimAng:-.2,drilling:false,whip:0,slot:0,pick:P?P.pick:1,breath:1,maxBreath:1};
  const old=ctx;ctx=g;try{drawPlayer(fake)}finally{ctx=old}}
function renderWardrobe(){const L=store.wardrobe.look,box=$('wRows');box.innerHTML='';
  const own=WALL.filter(wOwn).length;$('wProg').textContent=t('wProg',own,WALL.length);
  const row=(label,cat,list,field)=>{const r=document.createElement('div');r.className='wRow';const h=document.createElement('span');h.className='wLbl';h.textContent=t(label);r.append(h);
    const opts=document.createElement('div');opts.className='wOpts';
    for(const it of list){const key=cat+':'+it.id,have=wOwn(key),b=document.createElement('button');b.type='button';
      if(cat==='d'){b.className='sw';b.style.setProperty('--c',have?it.c:'#2a2630');b.title=have?tr(it.n):t('wLocked');b.setAttribute('aria-label',have?tr(it.n):t('wLocked'));if(!have)b.textContent='?'}
      else{b.className='wOpt';b.textContent=have?tr(it.n):'???';b.title=have?tr(it.n):t('wLocked')}
      b.disabled=!have;b.setAttribute('aria-pressed',String(L[field]===it.id));
      b.addEventListener('click',()=>{L[field]=it.id;save();sfx.ui&&sfx.ui();renderWardrobe()});opts.append(b)}
    r.append(opts);box.append(r)};
  {const r=document.createElement('div');r.className='wRow';r.innerHTML=`<span class="wLbl">${esc(t('wBody'))}</span>`;const op=document.createElement('div');op.className='wOpts';
    for(const [id,k] of [['m','bodyM'],['f','bodyF']]){const b=document.createElement('button');b.type='button';b.className='wOpt';b.textContent=t(k);b.setAttribute('aria-pressed',String((L.body||'m')===id));b.addEventListener('click',()=>{L.body=id;save();renderWardrobe()});op.append(b)}r.append(op);box.append(r)}
  {const r=document.createElement('div');r.className='wRow';r.innerHTML=`<span class="wLbl">${esc(t('wHairC'))}</span>`;const op=document.createElement('div');op.className='wOpts';
    for(const hh of HAIRS){const b=document.createElement('button');b.type='button';b.className='sw';b.style.setProperty('--c',hh.c);b.setAttribute('aria-label',hh.id);b.setAttribute('aria-pressed',String((L.hair||'brown')===hh.id));b.addEventListener('click',()=>{L.hair=hh.id;save();renderWardrobe()});op.append(b)}r.append(op);box.append(r)}
  row('wHat','h',HATS,'hat');if(L.hat!=='none')row('wHatC','d',DYES,'hatC');
  row('wTop','t',TOPS,'top');row('wTopC','d',DYES,'topC');row('wPants','d',DYES,'pants');
  row('wNeck','n',NECKS,'neck');if(L.neck!=='none')row('wNeckC','d',DYES,'neckC');
  wardrobePreview()}
