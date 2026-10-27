/*
  Arkeol v0.3.5 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  domains.js – open-sky layers to rest in (the philosopher's and the fisher's domains),
               the very last layer with its golden hole, and the ending
*/
'use strict';
const LAST_LAYER=15;
let domain=null,lastDomainLv=-9,bottom=null,ending=null;

/* ------------------------------------------------ which layers open up to the sky */
function pickDomain(lv){if(inVoid)return null;if(DBG&&DBG.domain)return DBG.domain;if(DBG)return null;
  if(lv<2||lv>=LAST_LAYER||lv-lastDomainLv<2)return null;const q=Math.random();return q<.11?'philo':q<.22?'fisher':q<.29?'traveler':null}
function buildDomain(kind){lastDomainLv=level;const ph=Math.random()*9;
  grid=new Uint8Array(MW*MH);dmgA=new Float32Array(MW*MH);webA=new Uint8Array(MW*MH);seen=new Uint8Array(MW*MH).fill(1);prot=new Uint8Array(MW*MH).fill(1);skyA=new Uint8Array(MW*MH);corA=new Uint8Array(MW*MH);
  decos=[];springs=[];foes=[];crates=[];pots=[];pickups=[];links=[];shop=null;junk=null;npcs=[];foods=[];gnats=[];drips=[];rocks=[];terms=[];vaults=[];fishes=[];
  biome='normal';era=null;const top=new Int16Array(MW);
  for(let x=0;x<MW;x++)top[x]=26+Math.round(Math.sin(x*.13+ph)*2+Math.sin(x*.29+ph*2)*1);
  const ex=MW-7,cx=Math.floor(MW/2);for(const x of [ex-1,ex,ex+1,4,5,6])top[x]=top[ex];for(let x=4;x<=6;x++)top[x]=top[5];
  if(kind==='traveler')biome='desert';
  let pond=null;if(kind==='fisher'){const h=top[cx];for(let x=cx-8;x<=cx+8;x++)top[x]=h;pond={x0:cx-5,x1:cx+5,y:h}}
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=idx(x,y);
    if(x===0||x===MW-1||y===MH-1){grid[i]=BED;if(y<top[x])skyA[i]=1;continue}
    if(y<top[x]){grid[i]=AIR;skyA[i]=1;continue}grid[i]=y<top[x]+3?DIRT:y<top[x]+10?STONE:GRAN}
  if(pond)for(let y=pond.y;y<pond.y+3;y++)for(let x=pond.x0;x<=pond.x1;x++){if(y===pond.y+2&&(x===pond.x0||x===pond.x1))continue;grid[idx(x,y)]=WATER}
  const ground=Math.max(...top);surf={top,ground};clouds=[];for(let i=0;i<8;i++)clouds.push({x:Math.random()*MW*T,y:Math.random()*60+10,w:30+Math.random()*50,s:.05+Math.random()*.12});
  shaft={x:-20,y0:0,y1:0};door={x:ex*T,y:top[ex]*T-24,w:16,h:24};
  // meadow: trees, flowers and sprouts
  for(let x=2;x<MW-2;x++){if(Math.abs(x-ex)<3||x<8||pond&&x>=pond.x0-2&&x<=pond.x1+2)continue;const h=hash(x,91+level);
    if(kind==='traveler'){if(Math.abs(x-cx)<9)continue;if(h%9===0)decos.push({tx:x,ty:top[x]-1,k:'cactus',sx:0,sy:1,v:h>>8&3});else if(h%5===0)decos.push({tx:x,ty:top[x]-1,k:'sprout',sx:0,sy:1,v:h>>8&3});continue}
    if(h%7===0)decos.push({tx:x,ty:top[x]-1,k:'tree',sx:0,sy:1,v:h>>8&3});else if(h%3===0)decos.push({tx:x,ty:top[x]-1,k:'flowers',sx:0,sy:1,v:h>>4&3});else if(h%4===1)decos.push({tx:x,ty:top[x]-1,k:'sprout',sx:0,sy:1,v:h>>8&3})}
  // the host
  if(kind==='traveler'){const h=top[cx];for(let x=cx-8;x<=cx+8;x++){top[x]=h;for(let y=0;y<MH-1;y++){const i=idx(x,y);if(y<h){grid[i]=AIR;skyA[i]=1}else grid[i]=y<h+3?DIRT:STONE}}
    decos.push({tx:cx-6,ty:h-1,k:'caravan',sx:0,sy:1},{tx:cx-2,ty:h-1,k:'campfire',sx:0,sy:1},{tx:cx+5,ty:h-1,k:'camel',sx:0,sy:1},{tx:cx-1,ty:h-1,k:'rug',sx:0,sy:1},{tx:cx+3,ty:h-1,k:'lanternpost',sx:0,sy:1},{tx:cx-8,ty:h-1,k:'suitcase',sx:0,sy:1});
    npcs.push({type:'traveler',name:'',x:(cx+1)*T+8,y:h*T,face:-1,gift:false,li:0,anim:0,wx:0,wy:0,domain:true,decorated:true})}
  else if(kind==='philo'){const nx=cx+2;npcs.push({type:Math.random()<.5?'hippie':'stoic',name:'',x:nx*T+8,y:top[nx]*T,face:-1,gift:false,li:0,anim:Math.random()*99,wx:0,wy:0,domain:true})}
  else{const nx=pond.x1+1;npcs.push({type:'fisher',name:'',x:nx*T+8,y:top[nx]*T,face:-1,gift:false,li:0,anim:0,wx:(pond.x1-1)*T+8,wy:pond.y*T+3,domain:true});
    for(const x of [pond.x0-1,pond.x0-2])decos.push({tx:x,ty:top[x]-1,k:'reeds',sx:0,sy:1})}
  decorateAllNpcs();
  domain={kind,px:5*T+2,py:top[5]*T,lastWx:frame};return {sx:5}}
function domainArrive(){if(!domain)return;P.x=domain.px;P.y=domain.py-P.h-.01;P.vx=0;P.vy=0;P.peak=P.y;P.safeFall=true;P.hp=Math.max(P.hp,P.maxHp);P.poison=0;
  cam.x=P.x-VW/2;cam.y=P.y-VH/2;clampCam();rollSky();if(domain.kind==='traveler'){SKY.season='summer';SKY.weather='clear';SKY.wint=SKY.target=0}
  showToast(domain.kind==='philo'?TL("The philosopher's domain",'Filosofin domaini'):domain.kind==='traveler'?TL("The traveller's domain",'Matkailijan domaini'):TL("The fisher's domain",'Kalastajan domaini'),TL('Open sky. Rest as long as you like.','Avoin taivas. Lepää niin kauan kuin haluat.'),TL('Layer ','Kerros ')+level);
  levelMusic='camp';Music.play('camp')}
/* the weather and the season keep turning in the fisher's domain */
function updDomain(){if(domain&&domain.kind==='fisher'&&frame-domain.lastWx>2400){domain.lastWx=frame;rollSky()}
  if(bottom&&state==='play'&&!P.dead){
    if(frame%3===0)parts.push({x:bottom.cx+rand(-5,5),y:bottom.ybot-rand(0,30),vx:rand(-.15,.15),vy:-rand(.4,1.1),life:90,max:90,col:pickR(['#ffe08a','#fff3c0','#f2c84b']),g:-.002,sz:1})}}

/* ------------------------------------------------ the bottom of the world */
function buildBottom(){const ex=Math.round(door.x/T),ey=Math.round((door.y+24)/T)-1;door={x:-999,y:-999,w:0,h:0};
  for(let y=ey+1;y<MH;y++){grid[idx(ex,y)]=AIR;prot[idx(ex,y)]=1;for(const x of [ex-1,ex+1])grid[idx(x,y)]=GRAN}
  for(let x=ex-2;x<=ex+2;x++){if(!isSolid(x,ey+1)&&x!==ex)grid[idx(x,ey+1)]=GRAN}
  decos=decos.filter(d=>Math.abs(d.tx-ex)>1||d.ty<ey);decos.push({tx:ex-1,ty:ey,k:'goldhole',sx:0,sy:1});
  bottom={tx:ex,cx:ex*T+8,y0:(ey+1)*T,ybot:MH*T}}
function drawGoldHole(d){if(!bottom)return true;const x=bottom.cx,y0=bottom.y0,y1=bottom.ybot,p=.7+.3*Math.sin(frame*.05);
  const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'rgba(255,220,120,0)');g.addColorStop(.6,`rgba(255,215,110,${.35*p})`);g.addColorStop(1,`rgba(255,245,200,${.85*p})`);ctx.fillStyle=g;ctx.fillRect(x-8,y0,16,y1-y0);const hg=ctx.createRadialGradient(x,y0,0,x,y0,14);hg.addColorStop(0,`rgba(255,235,160,${.5*p})`);hg.addColorStop(1,'rgba(255,220,120,0)');ctx.fillStyle=hg;ctx.fillRect(x-14,y0-14,28,28);
  for(let k=0;k<6;k++){const sx=x+Math.sin(frame*.03+k*1.7)*5,sy=y1-((frame*.6+k*40)%(y1-y0));if((frame+k*7)%30<20){ctx.fillStyle='rgba(255,250,220,.9)';ctx.fillRect(sx,sy,1,1);ctx.fillRect(sx-1,sy,3,.5)}}return true}
function bottomLight(hole,glows){if(!bottom)return;for(let y=bottom.y0;y<bottom.ybot;y+=2*T){const k=(y-bottom.y0)/(bottom.ybot-bottom.y0);hole(bottom.cx,y,(2+k*3)*T,.5+k*.4);glows.push([bottom.cx,y,(1.5+k*2)*T,`rgba(255,210,110,${.1+k*.2})`])}
  hole(bottom.cx,bottom.y0-T,4*T,.6);glows.push([bottom.cx,bottom.y0,3*T,'rgba(255,220,130,.25)'])}

/* ------------------------------------------------ the end */
TRACKS.ending={bpm:92,step(t,b,M){const E=M.eighth;const CH=[[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]];const ci=Math.floor(b/8)%4;
  if(b%8===0){M.pad(t,CH[ci],E*8,'triangle',.02,1600);M.bassN(t,CH[ci][0]-12,E*8,.05,true)}
  M.box(t,CH[ci][[0,1,2,3,2,1,2,3][b%8]]+12);if(b%4===2)M.harp(t,CH[ci][3]+12);if(b%16===0)M.harp(t,CH[ci][0]+24)},tension:false};
function startEnding(){if(ending||state!=='play')return;ending={t:0};state='ending';sfx.relic();releaseAll();store.endings=(store.endings||0)+1;save();
  const el=$('ending');el.hidden=false;el.classList.remove('roll');void el.offsetWidth;el.classList.add('black');
  try{Music.play('ending')}catch(e){}
  const C=(a,b)=>`<p class="${b||''}">${esc(a)}</p>`;
  $('endRoll').innerHTML=[C('ARKEOL','eTitle'),C('Arkeol by JP Hakoluoto','eBy'),'<br>',C(TL('You reached the bottom of the world.','Pääsit maailman pohjalle.')),C(TL('It was warm down there. It smelled of summer and coffee.','Siellä oli lämmintä. Tuoksui kesältä ja kahvilta.')),'<br>',
    C(TL('With','Mukana'),'eHead'),...['coffee','fisher','harmonica','knitter','reader','stoic','hippie','soldier','traveler','alien','baker'].map(k=>C(tr(NPC_TITLE[k]))),C(TL('The merchant','Kauppias')),C(TL('The junk dealer','Romukauppias')),'<br>',
    C(TL('Expedition','Retkikunta'),'eHead'),C(TL('Money: ','Rahaa: ')+fmt(P.money)),C(TL('Relics found: ','Reliikkejä: ')+relicsRun),C(TL('Layers: ','Kerroksia: ')+LAST_LAYER),'<br>',
    C(TL('and you.','ja sinä.'),'eYou'),'<br>','<br>',`<button type="button" class="btn" id="endBack">${esc(TL('Back to the surface','Takaisin pinnalle'))}</button>`].join('');
  setTimeout(()=>{el.classList.add('roll')},3500);
  $('endBack').addEventListener('click',()=>{el.hidden=true;el.classList.remove('roll','black');ending=null;bottom=null;if(typeof unlock==='function')unlock('theend');recordRun();toMenu()})}
if(typeof ACH!=='undefined')ACH.push({id:'theend',n:{en:'Bottom of the World',fi:'Maailman pohja'},d:{en:'Find what waits at the very bottom.',fi:'Löydä se, mikä odottaa aivan pohjalla.'}});
(function(){const d=document.createElement('div');d.id='ending';d.hidden=true;d.innerHTML='<div id="endRoll"></div>';document.body.appendChild(d)})();
