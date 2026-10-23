/*
  Arkeol v0.3.4 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
/* =========================================================== world state */
let grid,dmgA,webA,seen,prot,skyA,level=1,state='menu',frame=0;
let npcs=[],foods=[],gnats=[],drips=[],rocks=[],biome='normal',lastBiome='normal',shimC=null,P,foes,acids,puddles,arrows,bombs,shots,pickups,crates,pots,ropes,parts,texts,links,flashes,door,decos,springs,shop,levelKills=0,waterAwake=true;
let surf=null,shaft=null,clouds=[],motes=[],pendingRopes=[];
let cam={x:0,y:0},shake=0,gemsTotal=0,relicsRun=0,mapOn=false,underwaterT=0;
const idx=(x,y)=>y*MW+x;
const tileAt=(x,y)=>(x<0||y<0||x>=MW||y>=MH)?BED:grid[idx(x,y)];
const isSolid=(x,y)=>SOL[tileAt(x,y)]===1;
const isWater=(x,y)=>tileAt(x,y)===WATER;
const isSky=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&skyA[idx(x,y)]===1;
function boxHits(x,y,w,h){const x0=Math.floor(x/T),x1=Math.floor((x+w-.001)/T),y0=Math.floor(y/T),y1=Math.floor((y+h-.001)/T);
  for(let ty=y0;ty<=y1;ty++)for(let tx=x0;tx<=x1;tx++)if(isSolid(tx,ty))return true;return false}
function move(e){
  e.hitX=0;e.hitY=0;e.onGround=false;
  if(e.vx){let nx=e.x+e.vx;if(boxHits(nx,e.y,e.w,e.h)){nx=e.vx>0?Math.floor((nx+e.w)/T)*T-e.w-.001:Math.floor(nx/T)*T+T+.001;if(boxHits(nx,e.y,e.w,e.h))nx=e.x;e.hitX=Math.sign(e.vx)}e.x=nx}
  if(e.vy){let ny=e.y+e.vy;if(boxHits(e.x,ny,e.w,e.h)){if(e.vy>0){ny=Math.floor((ny+e.h)/T)*T-e.h-.001;e.onGround=true}else ny=Math.floor(ny/T)*T+T+.001;if(boxHits(e.x,ny,e.w,e.h))ny=e.y;e.hitY=Math.sign(e.vy)}e.y=ny}
  if(!e.onGround&&e.vy>=0&&boxHits(e.x,e.y+1,e.w,e.h))e.onGround=true;
}
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function los(x0,y0,x1,y1){const d=Math.hypot(x1-x0,y1-y0),n=Math.ceil(d/3);for(let i=1;i<n;i++){const x=x0+(x1-x0)*i/n,y=y0+(y1-y0)*i/n;if(isSolid(Math.floor(x/T),Math.floor(y/T)))return false}return true}
const inWaterAt=(x,y)=>isWater(Math.floor(x/T),Math.floor(y/T));

/* =========================================================== level generation */
function newPlayer(){return {x:0,y:0,w:10,h:15,vx:0,vy:0,face:1,onGround:false,hp:4,maxHp:4,bombs:0,ropes:0,fuel:100,money:0,earned:0,inv:0,coy:0,jbuf:0,peak:0,climb:null,
  swing:0,swingCd:0,drilling:false,anim:0,acid:0,dead:false,cause:'',ang:0,aimAng:0,slot:5,pick:1,drill:1,hasDrill:false,weapons:[],wi:0,stones:0,arrows:0,ammo:0,rod:false,line:null,wcd:0,whip:0,
  lampR:7.2,jumpV:5.3,softBoots:false,breath:100,maxBreath:100,compass:false,fuelWarn:false,inWater:false,safeFall:true,mats:{},torches:0,ladders:0,fires:0,regen:0,dark:0,wdur:{},meals:{},bake:{},cozy:0,souls:0}}
const NT=['coffee','fisher','harmonica','knitter','reader'];
function genLevel(lv){
  const seed=(Math.random()*2**31)|0;
  const r=mulberry32(seed), nz=makeNoise(r), nz2=makeNoise(r), nz3=makeNoise(r);
  const ri=(a,b)=>a+Math.floor(r()*(b-a+1));
  if(inVoid)biome='void';else if(DBG&&DBG.biome){biome=DBG.biome;lastBiome=biome}else{if(lv===1)biome='normal';else{const opts=['normal','hot','cold','moss','shroom'].filter(b=>b!==lastBiome);biome=opts[ri(0,opts.length-1)]}lastBiome=biome}
  const edge=(x,y)=>x<=1||y<=1||x>=MW-2||y>=MH-2;
  // the surface (layer 1) or a ceiling with a light shaft (deeper layers)
  const sx=ri(6,MW-7);
  const top=new Int16Array(MW);
  if(lv===1){for(let x=0;x<MW;x++)top[x]=8+Math.round((nz2(x/10,3.3)-.5)*4);const c=sx-4;if(c>4){const h=top[c];for(let x=c-4;x<=sx-1;x++)top[x]=h;top[sx]=Math.max(top[sx],h);top[sx+1]=Math.max(top[sx+1],h)}}else top.fill(1);
  const ground=Math.max(top[sx],top[sx+1]);
  const sy=lv===1?ground+6:5;
  let cave=new Uint8Array(MW*MH);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)cave[idx(x,y)]=edge(x,y)?1:(r()<.535?1:0);
  for(let it=0;it<5;it++){const n=new Uint8Array(MW*MH);
    for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){if(edge(x,y)){n[idx(x,y)]=1;continue}let c=0;
      for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){if(!i&&!j)continue;c+=cave[idx(x+i,y+j)]}
      n[idx(x,y)]=cave[idx(x,y)]?(c>=4?1:0):(c>=5?1:0)}
    cave=n}
  // solid crust right under the surface
  for(let x=0;x<MW;x++)for(let y=top[x];y<top[x]+3&&y<MH;y++)cave[idx(x,y)]=1;
  const carve=(x,y,rad)=>{for(let j=-rad;j<=rad;j++)for(let i=-rad;i<=rad;i++){const xx=x+i,yy=y+j;if(!edge(xx,yy)&&Math.abs(i)+Math.abs(j)<=rad)cave[idx(xx,yy)]=0}};
  let ex;do{ex=ri(5,MW-6)}while(Math.abs(ex-sx)<16);
  const ey=MH-5;
  let wx=sx+2,wy=sy+1;
  for(let k=0;k<900&&!(Math.abs(wx-ex)<2&&Math.abs(wy-ey)<2);k++){if(r()<.62)carve(wx,wy,r()<.15?1:0);
    if(r()<.5){if(r()<.65)wy+=Math.sign(ey-wy);else wx+=Math.sign(ex-wx)}else{const d=ri(0,3);wx+=[1,-1,0,0][d];wy+=[0,0,1,-1][d]}
    wx=clamp(wx,2,MW-3);wy=clamp(wy,sy,MH-3)}
  for(let w=0;w<2;w++){let x=ri(3,MW-4),y=ri(sy+6,MH-8);for(let k=0;k<70;k++){carve(x,y,r()<.25?1:0);const d=ri(0,3);x=clamp(x+[1,-1,0,0][d],2,MW-3);y=clamp(y+[0,0,1,-1][d],sy+3,MH-3)}}
  for(let y=sy-1;y<=sy+1;y++)for(let x=sx-2;x<=sx+3;x++)cave[idx(x,y)]=0;
  for(let x=sx-2;x<=sx+3;x++)cave[idx(x,sy+2)]=1;
  for(let y=ey-2;y<=ey;y++)for(let x=ex-2;x<=ex+2;x++)cave[idx(x,y)]=0;

  grid=new Uint8Array(MW*MH);dmgA=new Float32Array(MW*MH);webA=new Uint8Array(MW*MH);seen=new Uint8Array(MW*MH);prot=new Uint8Array(MW*MH);skyA=new Uint8Array(MW*MH);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=idx(x,y);
    if(lv===1&&y<top[x]){grid[i]=AIR;skyA[i]=1;continue}
    if(x===0||y===0||x===MW-1||y===MH-1){grid[i]=BED;continue}
    if(!cave[i]){grid[i]=AIR;continue}
    const v=nz(x/6,y/6)*.75+(y/MH)*.6+lv*.03+r()*.04;
    let tt=v<.6?DIRT:STONE;
    if(lv===1&&y<top[x]+3)tt=DIRT;
    if(y>MH*.3&&nz2(x/5,y/5)>.66-lv*.015-(y/MH)*.08)tt=GRAN;
    else if(nz3(x/4,y/3)>.74&&!(lv===1&&y<top[x]+4)&&biome!=='cold')tt=SAND;
    grid[i]=tt}
  // the drop shaft: two tiles wide, from the light down to the first cavern
  for(let y=(lv===1?0:0);y<sy;y++)for(const x of [sx,sx+1]){grid[idx(x,y)]=AIR;if(lv===1&&y<top[x])skyA[idx(x,y)]=1}
  for(let x=ex-2;x<=ex+2;x++)grid[idx(x,ey+1)]=STONE;
  {let mv=true,n=0;while(mv&&n<MH){mv=false;n++;for(let y=MH-2;y>=1;y--)for(let x=1;x<MW-1;x++){const i=idx(x,y);if(grid[i]===SAND&&grid[idx(x,y+1)]===AIR){grid[idx(x,y+1)]=SAND;grid[i]=AIR;mv=true}}}
   for(let y=0;y<sy;y++)for(const x of [sx,sx+1])if(grid[idx(x,y)]===SAND)grid[idx(x,y)]=AIR}
  surf=lv===1?{top,ground}:null;if(lv===1)firstGround=ground;
  shaft={x:sx,y0:lv===1?ground:0,y1:sy};
  const protRect=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>0&&y>=0&&x<MW-1&&y<MH-1)prot[idx(x,y)]=1};
  protRect(sx-3,0,sx+4,sy+3);protRect(ex-3,ey-3,ex+3,ey+1);
  for(let x=0;x<MW;x++)for(let y=0;y<(lv===1?top[x]+2:2);y++)prot[idx(x,y)]=1;
  const far=(x,y,d)=>Math.hypot(x-sx,y-sy)>d;
  const freeRect=(x0,y0,w,h)=>{for(let y=y0-2;y<y0+h+2;y++)for(let x=x0-2;x<x0+w+2;x++){if(x<1||y<1||x>=MW-1||y>=MH-1||prot[idx(x,y)])return false}return true};

  decos=[];springs=[];foes=[];crates=[];pots=[];pickups=[];links=[];shop=null;junk=null;npcs=[];
  if(lv===1){ // a little dig camp on the surface
    const camp=sx-4;if(camp>4){decos.push({tx:camp,ty:top[camp]-1,k:'tent',sx:0,sy:1});decos.push({tx:camp-3,ty:top[camp]-1,k:'campfire',sx:0,sy:1},{tx:camp-3,ty:top[camp]-1,k:'kettle',sx:0,sy:1},{tx:camp-2,ty:top[camp]-1,k:'campchair',sx:0,sy:1})}
    decos.push({tx:sx,ty:ground-1,k:'derrick',sx:0,sy:0});
    for(let x=2;x<MW-2;x++){if(Math.abs(x-sx)<5||(x>=sx-9&&x<=sx))continue;const h=hash(x,77);if(h%9===0)decos.push({tx:x,ty:top[x]-1,k:'tree',sx:0,sy:1,v:h>>8&3});else if(h%3===0)decos.push({tx:x,ty:top[x]-1,k:'sprout',sx:0,sy:1,v:h>>8&3})}
    clouds=[];for(let i=0;i<7;i++)clouds.push({x:r()*MW*T,y:r()*60+10,w:30+r()*50,s:.05+r()*.12});
  }
  // Sabu's shop
  if(!inVoid&&((DBG&&DBG.shop)||lv>=2&&(lv===2||r()<.7))){
    for(let a=0;a<300;a++){const w=13,h=6,x0=ri(3,MW-w-3),y0=ri(9,MH-h-8);if(!freeRect(x0,y0,w,h))continue;
      for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const wall=y===y0||y===y0+h-1||x===x0||x===x0+w-1;grid[idx(x,y)]=wall?SHOPB:AIR}
      for(const dx of [0,w-1])for(const dy of [h-3,h-2])grid[idx(x0+dx,y0+dy)]=AIR;
      for(let k=1;k<=3;k++)for(const dy of [h-3,h-2]){for(const xx of [x0-k,x0+w-1+k])if(grid[idx(xx,y0+dy)]!==BED)grid[idx(xx,y0+dy)]=AIR}
      for(let k=1;k<=3;k++){for(const xx of [x0-k,x0+w-1+k]){const yy=y0+h-1;if(grid[idx(xx,yy)]===AIR)grid[idx(xx,yy)]=STONE}}
      protRect(x0-4,y0-1,x0+w+3,y0+h);
      const mx=x0+Math.floor(w/2);
      shop={x0,y0,w,h,merchant:{x:mx*T+1,y:(y0+h-1)*T-18,w:14,h:18},stock:null,greeted:false};
      for(let x=x0+1;x<x0+w-1;x+=2)decos.push({tx:x,ty:y0+1,k:x%4===1?'herbs':'chimes',sx:0,sy:-1,v:x%3});
      decos.push({tx:mx,ty:y0+1,k:'mask',sx:0,sy:0},{tx:mx-3,ty:y0+2,k:'potions',sx:0,sy:0,v:1},{tx:mx+3,ty:y0+2,k:'potions',sx:0,sy:0,v:2},{tx:x0+1,ty:y0+1,k:'cweb',sx:-1,sy:-1},{tx:x0+w-2,ty:y0+1,k:'cweb',sx:1,sy:-1});
      const fl=y0+h-2;decos.push({tx:x0+1,ty:fl,k:'bigplant',sx:0,sy:1},{tx:x0+w-2,ty:fl,k:'bigplant',sx:0,sy:1},{tx:x0+2,ty:fl,k:'skullcandle',sx:0,sy:1},{tx:x0+w-3,ty:fl,k:'skullcandle',sx:0,sy:1},
        {tx:mx-2,ty:fl,k:'crystals',sx:0,sy:1,v:1},{tx:mx+2,ty:fl,k:'incense',sx:0,sy:1},{tx:x0+3,ty:fl,k:'drum',sx:0,sy:1},{tx:x0+w-4,ty:fl,k:'candle',sx:0,sy:1,v:0},{tx:mx-4,ty:fl,k:'candle',sx:0,sy:1,v:1},{tx:mx+4,ty:fl,k:'rugpile',sx:0,sy:1},{tx:x0+4,ty:fl,k:'skulls',sx:0,sy:1});
      break}
  }
  if(!inVoid)spawnSecrets(lv,{ri,r,airFloor:(x,y)=>grid[idx(x,y)]===AIR&&isSolid(x,y+1)&&!prot[idx(x,y)],far:(x,y,d)=>Math.hypot(x-sx,y-sy)>d,sy,freeRect,protRect});
  // Reijo's scrap stall: a low nook with an oil-drum fire
  if(!inVoid&&((DBG&&DBG.junk)||lv>=2&&r()<.5)){
    for(let a=0;a<300;a++){const w=9,h=5,x0=ri(3,MW-w-3),y0=ri(9,MH-h-6);if(!freeRect(x0,y0,w,h))continue;if(shop&&Math.abs(x0-shop.x0)<18&&Math.abs(y0-shop.y0)<10)continue;
      for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const wall=y===y0||y===y0+h-1||x===x0||x===x0+w-1;grid[idx(x,y)]=wall?(y===y0+h-1?STONE:DIRT):AIR}
      for(const dx of [0,w-1])for(const dy of [h-3,h-2])grid[idx(x0+dx,y0+dy)]=AIR;
      for(let k=1;k<=3;k++)for(const dy of [h-3,h-2]){for(const xx of [x0-k,x0+w-1+k])if(grid[idx(xx,y0+dy)]!==BED&&!prot[idx(xx,y0+dy)])grid[idx(xx,y0+dy)]=AIR}
      for(let k=1;k<=3;k++){for(const xx of [x0-k,x0+w-1+k]){const yy=y0+h-1;if(grid[idx(xx,yy)]===AIR)grid[idx(xx,yy)]=STONE}}
      protRect(x0-4,y0-1,x0+w+3,y0+h);
      const mx=x0+3;junk={x0,y0,w,h,merchant:{x:mx*T+1,y:(y0+h-1)*T-18,w:14,h:18},stock:null,greeted:false};
      decos.push({tx:x0+1,ty:y0+h-2,k:'junkpile',sx:0,sy:1,v:0},{tx:x0+w-2,ty:y0+h-2,k:'junkpile',sx:0,sy:1,v:1},{tx:x0+w-3,ty:y0+h-2,k:'junkpile',sx:0,sy:1,v:2},{tx:x0+2,ty:y0+1,k:'tarp',sx:0,sy:-1});
      break}
  }
  spawnBakery(lv,{ri,r,freeRect,protRect});
  // sealed relic chamber
  if(lv>=2&&r()<.5){
    for(let a=0;a<300;a++){const w=9,h=6,x0=ri(3,MW-w-3),y0=ri(Math.floor(MH*.3),MH-h-5);if(!freeRect(x0,y0,w,h))continue;
      for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const wall=y===y0||y===y0+h-1||x===x0||x===x0+w-1;grid[idx(x,y)]=wall?(r()<.3?GLYPH:BRICK):AIR}
      protRect(x0,y0,x0+w-1,y0+h-1);
      const cx=x0+4,fy=y0+h-2;
      decos.push({tx:cx,ty:fy,k:'pedestal',sx:0,sy:1});
      for(let x=x0+1;x<x0+w-1;x++)decos.push({tx:x,ty:y0+1,k:'mural',sx:0,sy:-1,v:x-x0});
      decos.push({tx:x0+1,ty:y0+2,k:'torch',sx:-1,sy:0},{tx:x0+w-2,ty:y0+2,k:'torch',sx:1,sy:0});
      const rel=chooseRelic(r);
      pickups.push({x:cx*T+4,y:fy*T+2,w:8,h:8,vx:0,vy:0,kind:'relic',rid:rel.id,value:rel.value,t:99,still:true});
      pots.push({x:(x0+1)*T+3,y:(fy+1)*T-10,w:10,h:10},{x:(x0+w-2)*T+3,y:(fy+1)*T-10,w:10,h:10});
      if(r()<.55)foes.push(mkMummy((x0+w-3)*T+3,(fy+1)*T-16.001));
      if(r()<.6){const side=r()<.5?-1:1;const px=cx+side,tx=side<0?x0:x0+w-1;grid[idx(px,fy+1)]=PLATE;grid[idx(tx,fy)]=side<0?TRAPR:TRAPL;links.push({tx,ty:fy,dir:-side,px,py:fy+1,pressed:false,anim:0})}
      break}
  }
  const vein=(n,ymin,lenA,lenB,type)=>{for(let k=0;k<n;k++){let x=ri(2,MW-3),y=ri(ymin,MH-3),len=ri(lenA,lenB);
    for(let j=0;j<len;j++){const i=idx(x,y),tt=grid[i];if(!prot[i]&&(tt===DIRT||tt===STONE||tt===GRAN))grid[i]=type;const d=ri(0,3);x=clamp(x+[1,-1,0,0][d],1,MW-2);y=clamp(y+[0,0,1,-1][d],1,MH-2)}}};
  vein(8+lv,sy+2,2,4,GOLD);
  if(lv>=2)vein(Math.min(1+Math.floor(lv/2),5),Math.floor(MH*.4),1,2,DIAM);
  if(biome==='cold')for(let y=sy;y<MH-1;y++)for(let x=1;x<MW-1;x++){const i=idx(x,y),tt=grid[i];if((tt===DIRT||tt===STONE)&&grid[idx(x,y-1)]===AIR&&!prot[i]&&r()<.35)grid[i]=ICE}
  // water basins and their springs
  const basins=[];
  for(let a=0;a<500&&basins.length<2+(lv%3);a++){
    const x=ri(3,MW-4),y=ri(Math.floor(MH*.25),MH-4);
    if(grid[idx(x,y)]!==AIR||!isSolid(x,y+1)||prot[idx(x,y)]||!far(x,y,8))continue;
    let rows=0,tp=null;
    for(let yy=y;yy>y-4;yy--){let l=x,rr=x;
      const sup=c=>isSolid(c,yy+1)||LIQ[tileAt(c,yy+1)];
      if(grid[idx(x,yy)]!==AIR)break;
      while(grid[idx(l-1,yy)]===AIR&&sup(l-1)&&x-l<14)l--;
      while(grid[idx(rr+1,yy)]===AIR&&sup(rr+1)&&rr-x<14)rr++;
      if(!isSolid(l-1,yy)||!isSolid(rr+1,yy)||rr-l>13)break;
      let bad=false;for(let c=l;c<=rr;c++)if(prot[idx(c,yy)])bad=true;if(bad)break;
      for(let c=l;c<=rr;c++)grid[idx(c,yy)]=biome==='hot'?LAVA:WATER;rows++;tp={y:yy,l,rr}}
    if(rows&&biome==='cold')for(let c=tp.l;c<=tp.rr;c++)grid[idx(c,tp.y)]=ICE;
    if(rows){basins.push(tp);
      if((biome==='normal'||biome==='moss')&&r()<.75){const c=ri(tp.l,tp.rr);for(let k=2;k<16;k++){const ty=tp.y-k;if(ty<2)break;if(isSolid(c,ty)){if(k>=4&&tileAt(c,ty)!==BED)springs.push({tx:c,ty});break}}}}
  }
  // underground dwellers
  const want=[];if(inVoid){}else if(lv===1){if(r()<.5)want.push('coffee')}else{if(r()<.4)want.push('stoic');const pool=NT.filter(q=>q!=='fisher'||((biome==='normal'||biome==='moss')&&basins.length));if(r()<.45){want.push(pool[ri(0,pool.length-1)]);if(r()<.12){const p2=pool.filter(q=>q!==want[0]);want.push(p2[ri(0,p2.length-1)])}}}
  for(const type of want){
    for(let a=0;a<900;a++){const x=ri(3,MW-4),y=ri(sy,MH-3);
      if(npcs.some(n=>Math.abs(n.x/T-x)<8&&Math.abs(n.y/T-y)<6))continue;
      let ok=true;for(let dx=-1;dx<=1;dx++){for(let dy=-1;dy<=0;dy++){const i=idx(x+dx,y+dy);if(grid[i]!==AIR||prot[i])ok=false}if(!SOL[tileAt(x+dx,y+1)]&&type!=='fisher')ok=false}
      if(!ok||!isSolid(x,y+1)||!far(x,y,lv===1?5:9)||Math.hypot(x-ex,y-ey)<4)continue;
      let face=r()<.5?-1:1,wx=0,wy=0;
      if(type==='fisher'){let found=false;for(const s of [-1,1])for(let k=1;k<=2&&!found;k++)if(isWater(x+s*k,y+1)||isWater(x+s*k,y)){face=s;found=true;let yy=isWater(x+s*k,y)?y:y+1;while(isWater(x+s*k,yy-1))yy--;wx=(x+s*k)*T+8;wy=yy*T+3}if(!found)continue}
      else if(!isSolid(x+face,y+1))continue;
      npcs.push({type,name:NPCD[type].names[ri(0,2)],x:x*T+8,y:(y+1)*T,face,gift:false,li:0,anim:r()*99,wx,wy});
      protRect(x-2,y-2,x+2,y+1);break}}
  // arrow traps
  const nTraps=Math.min(1+Math.floor(lv/2),5);
  for(let a=0;a<900&&links.length<nTraps;a++){
    const x=ri(2,MW-3),y=ri(sy,MH-3);
    if(grid[idx(x,y)]!==AIR||grid[idx(x,y-1)]!==AIR||prot[idx(x,y)])continue;
    const f=grid[idx(x,y+1)];if(f!==DIRT&&f!==STONE)continue;
    if(!far(x,y,8)||Math.hypot(x-ex,y-ey)<4)continue;
    const dir=r()<.5?-1:1;let ok=false,k=1;
    for(;k<=10;k++){const tt=tileAt(x+dir*k,y);if(tt!==AIR){ok=(k>=3&&(tt===DIRT||tt===STONE||tt===GRAN));break}}
    if(!ok)continue;const tx=x+dir*k;
    if(links.some(l=>Math.abs(l.px-x)<3&&Math.abs(l.py-(y+1))<2))continue;
    grid[idx(tx,y)]=dir>0?TRAPL:TRAPR;grid[idx(x,y+1)]=PLATE;
    links.push({tx,ty:y,dir:-dir,px:x,py:y+1,pressed:false,anim:0});
  }
  const airFloor=(x,y)=>grid[idx(x,y)]===AIR&&isSolid(x,y+1)&&!prot[idx(x,y)];
  const nSp=Math.min(4+lv*2,20);
  for(let a=0;a<1500&&foes.length<nSp;a++){const x=ri(2,MW-3),y=ri(sy,MH-3);
    if(grid[idx(x,y)]!==AIR||!isSolid(x,y-1)||isSolid(x,y+1)||prot[idx(x,y)]||!far(x,y,13))continue;
    if(foes.some(s=>Math.abs(s.x/T-x)<4&&Math.abs(s.y/T-y)<4))continue;
    foes.push(mkSpider(x*T+2,y*T+.01,'hang'));
    for(const dx of [-1,1])if(grid[idx(x+dx,y)]===AIR&&isSolid(x+dx,y-1)&&!prot[idx(x+dx,y)]&&r()<.6)webA[idx(x+dx,y)]=isSolid(x+dx*2,y)?(dx<0?1:2):3}
  const nW=lv<=1?1:Math.min(1+lv,8);let wc=0;
  for(let a=0;a<1500&&wc<nW;a++){const x=ri(2,MW-3),y=ri(sy+2,MH-3);
    if(!airFloor(x,y)||grid[idx(x,y-1)]!==AIR||!far(x,y,15)||isWater(x,y))continue;
    if(!airFloor(x+1,y)&&!airFloor(x-1,y))continue;
    foes.push({type:'wolf',x:x*T+1,y:(y+1)*T-11.001,w:14,h:11,vx:0,vy:0,face:r()<.5?-1:1,hp:3,st:'idle',cd:0,jcd:0,lost:0,anim:r()*99,hurt:0,dead:false,howled:false,turn:60});wc++}
  if(biome!=='cold'){const nS=biome==='moss'?3+Math.floor(lv/3):1+(lv>2?1:0);let sc=0;
    for(let a=0;a<1500&&sc<nS;a++){const x=ri(2,MW-3),y=ri(sy+2,MH-3);if(!airFloor(x,y)||!airFloor(x+1,y)||!far(x,y,12)||isWater(x,y))continue;foes.push(mkSnake(x*T+1,(y+1)*T-7.001));sc++}}
  if(lv>=2){const nM=Math.min((biome==='hot'?2:1)+Math.floor(lv/3),5);let mc=0;
    for(let a=0;a<1500&&mc<nM;a++){const x=ri(2,MW-3),y=ri(sy+2,MH-3);if(!airFloor(x,y)||grid[idx(x,y-1)]!==AIR||!far(x,y,15)||isWater(x,y))continue;foes.push(mkMummy(x*T+3,(y+1)*T-16.001));mc++}}
  spawnExtraFoes(lv,{ri,r,airFloor,far,sy});spawnBugs(lv,{ri,r,airFloor,far,sy});spawnAmbientFish();spawnVents(lv,{ri,r,sy});spawnCorruption(lv,{ri});
  drips=[];const nD=lv===1?6:biome==='cold'?9:biome==='hot'?2:4;
  for(let a=0;a<900&&drips.length<nD;a++){const x=ri(2,MW-3),y=ri(sy,MH-4);
    if(grid[idx(x,y)]!==AIR||!isSolid(x,y-1)||isSolid(x,y+1)||isSolid(x,y+2)||isSolid(x,y+3)||prot[idx(x,y)]||!far(x,y,6))continue;
    if(drips.some(d=>Math.abs(d.x/T-x)<3&&Math.abs(d.y/T-y)<3))continue;drips.push({x:x*T+4,y:y*T,w:8,h:11,st:'hang',t:0,vy:0,ice:biome==='cold'})}
  foods=[];const nF=3+ri(0,2)+(biome==='shroom'?3:0)+(biome==='moss'?2:0);
  for(let a=0;a<900&&foods.length<nF;a++){const x=ri(2,MW-3),y=ri(sy,MH-3);if(!airFloor(x,y)||isWater(x,y)||tileAt(x,y+1)===PLATE||foods.some(f=>Math.abs(f.x/T-x)<3&&Math.abs(f.y/T-y)<2))continue;
    const q=r(),kind=biome==='shroom'?(q<.45?'mushR':q<.85?'mushP':'berryB'):(q<.28?'mushR':q<.46?'mushP':q<.78?'berryR':'berryB');foods.push({x:x*T+3,y:(y+1)*T-9,kind,ph:r()*7})}
  rocks=[];for(let a=0;a<900&&rocks.length<10;a++){const x=ri(2,MW-3),y=ri(sy,MH-3);if(!airFloor(x,y)||isWater(x,y)||tileAt(x,y+1)===PLATE)continue;rocks.push({x:x*T+5,y:(y+1)*T-5.001,w:6,h:5,vx:0,vy:0,thrown:false,t:0})}
  let webs=0;
  for(let a=0;a<800&&webs<12+lv*2;a++){const x=ri(2,MW-3),y=ri(sy,MH-3),i=idx(x,y);if(webA[i]||grid[i]!==AIR||!isSolid(x,y-1)||prot[i]||!far(x,y,6))continue;
    if(isSolid(x-1,y))webA[i]=1;else if(isSolid(x+1,y))webA[i]=2;else if(r()<.3)webA[i]=3;if(webA[i])webs++}
  for(let a=0;a<900&&crates.length<3+Math.floor(lv/2);a++){const x=ri(2,MW-3),y=ri(sy,MH-3);
    if(!airFloor(x,y)||!far(x,y,6)||tileAt(x,y+1)===PLATE||isWater(x,y))continue;if(crates.some(c=>Math.abs(c.x/T-x)<5))continue;
    crates.push({x:x*T+2,y:(y+1)*T-11.001,w:12,h:11})}
  for(let a=0;a<900&&pots.length<6+lv;a++){const x=ri(2,MW-3),y=ri(sy,MH-3);
    if(!airFloor(x,y)||!far(x,y,5)||isWater(x,y))continue;if(pots.some(c=>Math.abs(c.x/T-x)<3&&Math.abs(c.y/T-y)<2))continue;
    pots.push({x:x*T+3,y:(y+1)*T-10.001,w:10,h:10})}
  const loreN=1+(r()<.55?1:0);
  for(let n=0;n<loreN;n++){const item=chooseLore();if(!item)break;
    for(let a=0;a<600;a++){const x=ri(2,MW-3),y=ri(sy,MH-3);if(!airFloor(x,y)||!far(x,y,7)||isWater(x,y))continue;
      pickups.push({x:x*T+4,y:(y+1)*T-6.001,w:8,h:6,vx:0,vy:0,kind:'lore',cat:item.cat,lid:item.id,value:0,t:99});break}}
  for(let y=2;y<MH-1;y++)for(let x=1;x<MW-1;x++){const i=idx(x,y);if(grid[i]!==AIR||prot[i])continue;const up=tileAt(x,y-1),dn=tileAt(x,y+1);const h=hash(x+lv*131,y);const q=(h%1000)/1000;
    if((up===STONE||up===GRAN)&&!isSolid(x,y+1)&&q<.10)decos.push({tx:x,ty:y,k:'stal',sx:0,sy:-1,v:h>>12&3});
    else if(up===DIRT&&q<.16)decos.push({tx:x,ty:y,k:'roots',sx:0,sy:-1,v:h>>12&3});
    else if((dn===DIRT||dn===STONE)&&q<.03)decos.push({tx:x,ty:y,k:'mush',sx:0,sy:1,v:h>>12&3});
    else if(dn===DIRT&&q<.09)decos.push({tx:x,ty:y,k:'sprout',sx:0,sy:1,v:h>>12&3});
    else if(SOL[dn]&&q<.105)decos.push({tx:x,ty:y,k:'bones',sx:0,sy:1,v:h>>12&3});
    else if(y>MH*.45&&(SOL[dn]||SOL[up])&&q<.125)decos.push({tx:x,ty:y,k:'crys',sx:0,sy:SOL[dn]?1:-1,v:h>>12&3})}
  if(biome==='moss'||biome==='shroom')for(let y=sy;y<MH-1;y++)for(let x=1;x<MW-1;x++){const i=idx(x,y);if(grid[i]!==AIR||prot[i])continue;const h=hash(x*7+lv,y*3),q=(h%1000)/1000;
    if(biome==='moss'&&isSolid(x,y-1)&&!isSolid(x,y+1)&&q<.2)decos.push({tx:x,ty:y,k:'vine',sx:0,sy:-1,v:1+(h>>>9)%3});
    if(biome==='shroom'&&isSolid(x,y+1)&&!isSolid(x,y-1)&&!isSolid(x,y-2)&&q<.06)decos.push({tx:x,ty:y,k:'bigmush',sx:0,sy:1,v:(h>>>9)%3});
    else if(biome==='shroom'&&isSolid(x,y+1)&&q<.16)decos.push({tx:x,ty:y,k:'mush',sx:0,sy:1,v:(h>>>9)&3})}
  // ---- extra life: ferns, grass, glowing flowers, glow-worms, hanging vines and wall moss
  const taken=new Set(decos.map(d=>d.tx+','+d.ty));motes=[];
  for(let y=sy;y<MH-1;y++)for(let x=1;x<MW-1;x++){const i=idx(x,y);if(grid[i]!==AIR||prot[i]||taken.has(x+','+y)||isWater(x,y))continue;
    const up=tileAt(x,y-1),dn=tileAt(x,y+1),h=hash(x*13+lv*7,y*29)>>>0,q=(h%1000)/1000,deep=y>MH*.4,lush=biome==='moss'||biome==='normal';
    let k=null,sxx=0,syy=0,v=(h>>>10)&7;
    if(SOL[dn]&&dn!==SAND){
      if(lush&&(dn===DIRT||dn===STONE)&&q<.055)k='fern';else if(lush&&q<.12&&(dn===DIRT||dn===STONE))k='grass';
      else if(deep&&biome!=='hot'&&q<.145)k='glowflower';else if(biome==='moss'&&q<.2)k='grass';syy=1}
    else if(SOL[up]&&!isSolid(x,y+1)){
      if(deep&&biome!=='hot'&&q<.05)k='glowworm';else if(biome!=='hot'&&biome!=='cold'&&q<(biome==='moss'?.32:lush?.24:.07)&&!isSolid(x,y+2)){k='hangvine';v=1+(h>>>12)%(isSolid(x,y+3)?2:4)}syy=-1}
    else if((isSolid(x-1,y)||isSolid(x+1,y))&&lush&&q<(biome==='moss'?.32:.13)){k='wallmoss';sxx=isSolid(x-1,y)?-1:1}
    const mp=biome==='moss'?.75:biome==='normal'?.32:biome==='shroom'?.14:0,h2=(hash(x*5+lv,y*11)>>>0)%1000/1000;
    if(mp&&SOL[dn]&&dn!==SAND&&h2<mp)decos.push({tx:x,ty:y,k:'mosscarpet',sx:0,sy:1,v:(h2*997|0)&7});
    if(mp&&SOL[up]&&up!==SAND&&h2>1-mp*.6)decos.push({tx:x,ty:y,k:'mossceil',sx:0,sy:-1,v:(h2*991|0)&7});
    if(k){decos.push({tx:x,ty:y,k,sx:sxx,sy:syy,v});taken.add(x+','+y);if((k==='glowflower'||k==='fern')&&motes.length<16&&r()<.3)motes.push({x:x*T+8,y:y*T+2,r:6+r()*10,s:.01+r()*.02,p:r()*7})}}
  let bc=0;const ceilH=(x,y)=>{for(let h=1;h<=4;h++){if(isSolid(x,y-h))return h;if(prot[idx(x,y-h)])return 0}return 0};
  for(let a=0;a<2500&&bc<3+(lv%3);a++){const x=ri(2,MW-5),y=ri(sy,MH-3);
    if(![0,1,2].every(dx=>grid[idx(x+dx,y)]===AIR&&!prot[idx(x+dx,y)]&&isSolid(x+dx,y+1)))continue;
    const h1=ceilH(x,y),h2=ceilH(x+2,y),hm=ceilH(x+1,y);if(h1<2||h1!==h2||hm<h1-0||h1>4)continue;
    if(decos.some(d=>d.k==='beam'&&Math.abs(d.tx-x)<5&&Math.abs(d.ty-y)<3))continue;decos.push({tx:x,ty:y,k:'beam',sx:0,sy:1,v:h1});bc++}
  const REM=['oldpick','bedroll','tripod','oldlamp','flag','mark','mark'];let rc=0;
  for(let a=0;a<800&&rc<4+ri(0,3);a++){const x=ri(2,MW-3),y=ri(sy,MH-3),k=REM[ri(0,REM.length-1)];
    if(k==='mark'){if(grid[idx(x,y)]===AIR&&!prot[idx(x,y)]&&isSolid(x,y+1)===false&&!decos.some(d=>d.tx===x&&d.ty===y)){decos.push({tx:x,ty:y,k,sx:0,sy:0,v:ri(0,4)});rc++}continue}
    if(!airFloor(x,y)||isWater(x,y)||decos.some(d=>d.tx===x&&d.ty===y))continue;decos.push({tx:x,ty:y,k,sx:0,sy:1,v:ri(0,1)});rc++}
  // initials and messages scratched by earlier expeditions, and much older paintings
  if(!inVoid){let mc=0;for(let a=0;a<900&&mc<3+ri(0,4);a++){const x=ri(2,MW-3),y=ri(sy,MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y)||!(isSolid(x-1,y)||isSolid(x+1,y))||decos.some(d=>d.tx===x&&d.ty===y))continue;decos.push({tx:x,ty:y,k:'mark',sx:0,sy:0,v:r()<.7?2:ri(0,4)});mc++}
    if(r()<.45){let pc=0;for(let a=0;a<900&&pc<1+ri(0,2);a++){const x=ri(2,MW-3),y=ri(sy+2,MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y)||!isSolid(x,y-1)||isSolid(x,y+1)||decos.some(d=>d.tx===x&&d.ty===y))continue;decos.push({tx:x,ty:y,k:'cavepaint',sx:0,sy:0,v:ri(0,5)});pc++}}}
  gnats=[];for(let a=0;a<400&&gnats.length<3+ri(0,2);a++){const x=ri(2,MW-3),y=ri(sy,MH-3);if(!airFloor(x,y)||grid[idx(x,y-1)]!==AIR)continue;
    gnats.push({x:x*T+8,y:y*T+4,d:Array.from({length:5+ri(0,4)},()=>({a:r()*7,r:2+r()*5,s:.08+r()*.12}))})}
  let tc=0;for(let a=0;a<400&&tc<3+(lv>>1);a++){const x=ri(2,MW-3),y=ri(sy,MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)])continue;const sd=isSolid(x-1,y)?-1:isSolid(x+1,y)?1:0;if(!sd||!isSolid(x,y+2))continue;decos.push({tx:x,ty:y,k:'torch',sx:sd,sy:0});tc++}
  // ---- abandoned camps: a campfire that still works as a workbench, and maybe a recipe note
  if(lv>1){let cc=0;const want=1+(r()<.45?1:0);for(let a=0;a<4000&&cc<want;a++){const x=ri(4,MW-5),y=ri(sy+2,MH-3);
    if(![-1,0,1].every(dx=>airFloor(x+dx,y))||grid[idx(x,y-1)]!==AIR||!far(x,y,6)||isWater(x,y))continue;
    if(decos.some(d=>d.tx===x&&d.ty===y&&!['grass','mosscarpet','fern','sprout'].includes(d.k)))continue;
    decos=decos.filter(d=>!(Math.abs(d.tx-x)<=1&&d.ty===y&&['grass','mosscarpet','fern','sprout','mush'].includes(d.k)));
    if(decos.some(d=>d.k==='campfire'&&Math.abs(d.tx-x)<14&&Math.abs(d.ty-y)<10))continue;
    decos.push({tx:x,ty:y,k:'campfire',sx:0,sy:1});if(airFloor(x+2,y))decos.push({tx:x+2,ty:y,k:'bedroll',sx:0,sy:1,v:0});cc++}}
  {const lk=lockedRecipes();if(lk.length&&r()<.6)for(let a=0;a<600;a++){const x=ri(2,MW-3),y=ri(sy,MH-3);if(!airFloor(x,y)||!far(x,y,9)||isWater(x,y))continue;
    pickups.push({x:x*T+4,y:(y+1)*T-6.001,w:8,h:6,vx:0,vy:0,kind:'recipe',rid:lk[ri(0,lk.length-1)].id,value:0,t:99});break}}
  spawnDeep(lv,{ri,r,airFloor,far,sy});spawnEraFoes(lv,{ri,r,airFloor,far,sy});
  // ---- old ropes and ladders left by earlier expeditions at natural drops
  const natRopes=[];ropes=[];
  for(let a=0;a<3000&&natRopes.length<3+ri(0,2);a++){const x=ri(3,MW-4),y=ri(sy+1,MH-8);
    if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y))continue;
    const side=isSolid(x-1,y+1)&&!isSolid(x-1,y)?-1:isSolid(x+1,y+1)&&!isSolid(x+1,y)?1:0;if(!side)continue;   // a ledge to stand on beside the drop
    let len=0;while(len<13&&!isSolid(x,y+len)&&!isWater(x,y+len))len++;if(len<5||len>12||!isSolid(x,y+len))continue;
    if(natRopes.some(o=>Math.abs(o.tx-x)<7&&Math.abs(o.top-y)<10))continue;
    let wall=0;for(let k=1;k<len;k++)if(isSolid(x-side,y+k)||isSolid(x+side,y+k))wall++;
    const lad=wall>=len*.7&&r()<.75;natRopes.push({tx:x,top:y,len,cur:len,head:y*T,nat:!lad,lad,side})}
  door={x:ex*T,y:(ey+1)*T-24,w:16,h:24};
  if(lv===1){let len=0;while(len<sy&&!isSolid(sx,ground-1+len))len++;if(len>2)natRopes.push({tx:sx,top:ground-1,len,cur:len,head:(ground-1)*T,lad:true})}
  pendingRopes=natRopes;
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){const i=idx(x,y);if(grid[i]===SAND){const b=grid[idx(x,y+1)];if(b===AIR||LIQ[b])grid[i]=DIRT}}
  waterAwake=true;sandAwake=true;
  return {sx,sy};
}
const CHAPTERS={en:['To the Depths','The Whispering Dark','Halls of the Forgotten','Where the Radios Fell Silent','The Merchant’s Road','Bones and Embers','The Sleeping Pharaoh','Beneath the Beneath','The Last Lantern','No Bottom, Only Deeper'],
  fi:['Syvyyksiin','Kuiskaava pimeys','Unohdettujen salit','Missä radiot vaikenivat','Kauppiaan tie','Luita ja hiillosta','Nukkuva farao','Pohjan alla','Viimeinen lyhty','Ei pohjaa, vain syvemmälle']};
function chapterName(l){const a=CHAPTERS[LANG]||CHAPTERS.en;return a[(l-1)%a.length]+(l>a.length?' '+'II III IV V'.split(' ')[Math.min(3,Math.floor((l-1)/a.length)-1)]:'')}
function mkSnake(x,y){return {type:'snake',x,y,w:14,h:7,vx:0,vy:0,face:Math.random()<.5?-1:1,hp:2,st:'slither',t:0,cd:0,anim:Math.random()*99,hurt:0,dead:false,turn:120}}
function mkMummy(x,y){return {type:'mummy',x,y,w:10,h:16,vx:0,vy:0,face:Math.random()<.5?-1:1,hp:4,st:'patrol',cd:0,lost:0,anim:Math.random()*99,hurt:0,dead:false,pause:0,groan:0}}
function mkSpider(x,y,st){return {type:'spider',x,y,w:12,h:9,vx:0,vy:0,st,hp:2,cd:60+Math.random()*120,hop:30,anim:Math.random()*99,face:1,dead:false,charge:0,hurt:0}}
function chooseRelic(r){const rr=r||Math.random;const un=RELICS.filter(x=>!store.relics[x.id]);const pool=un.length&&rr()<.8?un:RELICS;return pool[Math.floor(rr()*pool.length)]}
let placedLore=new Set();
function chooseLore(){const pool=[];PAPERS.forEach((pp,i)=>{const k='p'+i;if(!store.lore[k]&&!placedLore.has(k)&&(pp.minLv||0)<=level)pool.push({cat:'paper',id:i,k})});PHOTOS.forEach((ph,i)=>{const k='f'+i;if(!store.lore[k]&&!placedLore.has(k)&&(ph.minLv||0)<=level)pool.push({cat:'photo',id:i,k})});
  if(!pool.length)return null;const it=pickR(pool);placedLore.add(it.k);return it}
function buildLevel(){resetAtmosphere();
  const {sx}=genLevel(level);
  acids=[];puddles=[];arrows=[];bombs=[];shots=[];tossed=[];fishSpots={};ropes=pendingRopes.slice();parts=[];texts=[];flashes=[];levelKills=0;
  // drop in from above
  P.x=sx*T+T-P.w/2;P.y=(level===1?1:0)*T+2;P.vx=0;P.vy=.5;P.peak=P.y;P.climb=null;P.inv=30;P.breath=P.maxBreath;P.safeFall=true;P.line=null;
  cam.x=P.x-VW/2;cam.y=P.y-VH/2;clampCam();
  if(shop)shop.stock=makeStock();
  const sp=foes.filter(f=>f.type==='spider').length,wo=foes.filter(f=>f.type==='wolf').length;
  const mu=foes.filter(f=>f.type==='mummy').length;
  fireballs=[];flies=[];levelTime=0;nextAmbient=frame+400;
  showToast(chapterName(level),level===1?skyLabel():t('lvl',level,t('b_'+biome),!!shop,!!junk)+(era?' · '+t('era_'+era):''),t('chapterN',level));
  pickLevelMusic();if(state==='play'||state==='trans')Music.play(levelTrack());
}
function newGame(){
  ensureAudio();closePanel(true);
  rollSky();level=1;gemsTotal=0;relicsRun=0;runFinds=0;runKills={spider:0,wolf:0,mummy:0,snake:0,frog:0,dragon:0,bat:0,mimic:0,worm:0,wisp:0,ant:0,scorpion:0,raptor:0,rex:0,knight:0,mammoth:0};placedLore=new Set();store.runs=(store.runs||0)+1;save();
  inDebug=false;DBG=null;inTent=false;tentSnap=null;P=newPlayer();state='play';buildLevel();
  for(const id of ['menu','over','pause','modal','shop','howto','settings','credits','license'])$(id).hidden=true;
  releaseAll();renderHotbar();Music.hero(levelTrack());if(level===1)startAtTent();
}
