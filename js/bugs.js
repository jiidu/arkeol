/*
  Arkeol v0.3.5 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  bugs.js – ant columns and scorpions
*/
'use strict';
Object.assign(sfx,{
  antClick:()=>{for(let i=0;i<3;i++)setTimeout(()=>tone(2400+Math.random()*600,.015,'square',.008),i*35)},
  scorpRattle:()=>{for(let i=0;i<5;i++)setTimeout(()=>noise(.025,.05,3200,'bandpass'),i*45)},
  sting:()=>{tone(900,.08,'sawtooth',.03,-500);noise(.05,.06,2600,'highpass')}
});

function mkAnt(x,y,fire){return {type:'ant',x,y,w:7,h:4,vx:0,vy:0,st:'walk',hp:1,face:Math.random()<.5?-1:1,bite:0,t:Math.random()*99,anim:Math.random()*99,hurt:0,dead:false,fire}}
function mkScorpion(x,y){return {type:'scorpion',x,y,w:14,h:8,vx:0,vy:0,st:'walk',hp:3,face:Math.random()<.5?-1:1,t:0,cd:0,anim:Math.random()*99,hurt:0,dead:false}}

function spawnBugs(lv,H){const {ri,r,airFloor,far,sy}=H;if(inVoid||lv<2)return;
  // ants march in little columns along the floor
  const nCol=biome==='cold'?0:biome==='hot'?2:1+(lv>=5&&r()<.5?1:0);let c=0;
  for(let a=0;a<1500&&c<nCol;a++){const x=ri(4,MW-6),y=ri(sy+2,MH-3);
    if(!airFloor(x,y)||!airFloor(x+1,y)||!airFloor(x+2,y)||!far(x,y,11)||isWater(x,y))continue;
    const n=3+ri(0,2+Math.min(2,lv>>2)),fire=biome==='hot'||(lv>=7&&r()<.4);
    for(let k=0;k<n;k++)foes.push(mkAnt(x*T+2+k*6,(y+1)*T-4.001,fire));c++}
  // scorpions like it hot and dry
  if(lv>=3&&biome!=='cold'&&biome!=='moss'){const nS=(biome==='hot'||biome==='desert'?2:r()<.6?1:0)+(lv>=8&&r()<.4?1:0);let s=0;
    for(let a=0;a<1500&&s<nS;a++){const x=ri(3,MW-4),y=ri(sy+3,MH-3);
      if(!airFloor(x,y)||!airFloor(x+1,y)||!far(x,y,12)||isWater(x,y))continue;foes.push(mkScorpion(x*T+1,(y+1)*T-8.001));s++}}
}

/* ants: wander, then swarm toward you and nip; easy to squash */
function updAnt(f,dx,dy,dist,sees,fcx){f.t++;f.vy=Math.min(f.vy+.3,6);if(f.bite>0)f.bite--;
  const chase=(sees&&dist<6*T)||(f.mt!==undefined&&frame-f.mt<120&&(dx||dy));
  if(f.onGround){
    if(chase&&f.bite<=0){if(Math.abs(dx)>3)f.face=Math.sign(dx);f.vx=f.face*1.15}
    else if(f.bite>0){f.vx=-f.face*.6}
    else{if(Math.random()<.008)f.face*=-1;f.vx=f.face*.45}
    // turn round at ledges unless chasing
    const ax=Math.floor((fcx+f.face*5)/T),ay=Math.floor((f.y+f.h+2)/T);if(!chase&&!isSolid(ax,ay))f.face*=-1}
  move(f);
  if(f.hitX){if(f.onGround&&chase)f.vy=-3.2;else f.face*=-1}
  if(f.hitY)f.vy=0;
  if(chase&&f.t%40===0&&dist<5*T)sfx.antClick();
  if(state==='play'&&overlap(P,f)){
    if(P.vy>.8&&P.y+P.h-f.y<6&&!P.climb){killFoe(f,'stomp');P.vy=-3.6;P.peak=P.y}
    else if(f.bite<=0){if(f.fire)poisonHit(1,'cAnt',fcx,200);else hurt(1,'cAnt',fcx);f.bite=70}}
  return chase?.15:0}

/* scorpions: creep closer, raise the tail (that is your warning), then sting */
function updScorpion(f,dx,dy,dist,sees,fcx,fcy){f.t++;f.vy=Math.min(f.vy+.3,6);if(f.cd>0)f.cd--;
  const near=Math.abs(dx)<1.9*T&&Math.abs(dy)<14;
  if(f.st==='walk'){
    if(sees&&dist<7*T){if(Math.abs(dx)>4)f.face=Math.sign(dx);f.vx=f.face*.7;
      if(near&&f.cd<=0&&f.onGround){f.st='raise';f.t=0;f.vx=0;sfx.scorpRattle()}}
    else{if(f.onGround){if(Math.random()<.006)f.face*=-1;f.vx=f.face*.3;const ax=Math.floor((fcx+f.face*9)/T),ay=Math.floor((f.y+f.h+2)/T);if(!isSolid(ax,ay))f.face*=-1}}}
  else if(f.st==='raise'){f.vx*=.6;if(f.t>30){f.st='strike';f.t=0;sfx.sting();
      const box={x:f.face>0?f.x+f.w-2:f.x-16,y:f.y-12,w:18,h:22};
      if(state==='play'&&overlap(P,box))poisonHit(1,'cSting',fcx,360)}}
  else{if(f.t>14){f.st='walk';f.cd=80}}
  move(f);if(f.hitX){if(f.st==='walk'&&f.onGround&&sees)f.vy=-3;else f.face*=-1}if(f.hitY)f.vy=0;
  if(state==='play'&&overlap(P,f)){
    if(P.vy>1&&P.y+P.h-f.y<6&&!P.climb){damageFoe(f,1,P.x+P.w/2,'stomp');P.vy=-4.4;P.peak=P.y}
    else if(f.st!=='strike')hurt(1,'cSting',fcx)}
  return sees&&dist<7*T?.45:0}

/* ------------------------------------------------ drawing */
function drawAnt(f){const x=Math.round(f.x+f.w/2),y=Math.round(f.y+f.h),hc=f.hurt>0,c=hc?'#fff':f.fire?'#b0301c':'#2a1a14',c2=f.fire?'#d8502a':'#4a3024',step=(f.t>>2)%2;
  ctx.save();ctx.translate(x,y);if(f.face<0)ctx.scale(-1,1);
  // legs
  for(let i=0;i<3;i++){const lx=-2+i*2,o=(i+step)%2;R(lx-1+o,-1,1,1,c);R(lx+o,0,1,1,c)}
  R(-4,-3,3,2,c);R(-1,-3,2,2,c);R(1,-4,3,3,c);R(-4,-3,1,1,c2);R(2,-4,1,1,c2);
  R(4,-5,1,1,c);R(5,-6,1,1,c);R(3,-5,1,1,c);R(4,-1,1,1,'#e8d8b0');
  ctx.restore()}
function drawScorpion(f){const x=Math.round(f.x+f.w/2),y=Math.round(f.y+f.h),hc=f.hurt>0&&(f.hurt>>1)%2,deep=biome==='hot';
  const B=hc?'#fff':deep?'#2e1210':'#a8783a',D=hc?'#ddd':deep?'#140604':'#6a4a22',L=deep?'#d0602a':'#d0a058',step=(frame>>3)%2;
  ctx.save();ctx.translate(x,y);if(f.face<0)ctx.scale(-1,1);
  for(let i=0;i<4;i++){const lx=-4+i*3,o=(i+step)%2;R(lx,-2,1,1,D);R(lx-1+o,-1,1,1,D);R(lx-1+o,0,1,1,D)}
  R(-5,-4,10,3,B);R(-5,-4,10,1,L);R(-3,-3,1,1,D);R(0,-3,1,1,D);
  // pincers
  R(5,-4,3,1,B);R(7,-5,2,1,B);R(7,-3,2,1,B);R(9,-5,1,1,D);R(9,-3,1,1,D);
  R(6,-4,1,1,'#101010');
  // tail: segments curling over the back; higher when raised, forward on strike
  const raise=f.st==='raise'?Math.min(1,f.t/14):0,st=f.st==='strike';
  // tail: rises from the rear and curls forward over the back; on a strike it whips forward
  const REST=[[-6,-4],[-8,-5],[-9,-7],[-9,-9],[-8,-11],[-6,-12],[-4,-12],[-2,-11]],HIT=[[-6,-4],[-7,-6],[-7,-9],[-5,-11],[-2,-12],[1,-11],[4,-9],[6,-6]];
  const k2=st?1:raise*.25,lift=raise*2;let tx=0,ty=0;
  REST.forEach((q,i)=>{const h=HIT[i],x2=q[0]+(h[0]-q[0])*k2,y2=q[1]+(h[1]-q[1])*k2-(i>2?lift:0);R(Math.round(x2),Math.round(y2),i<3?3:2,2,i%2?D:B);tx=x2;ty=y2});
  R(Math.round(tx)+1,Math.round(ty)+2,1,2,'#e8e0c0');R(Math.round(tx)+2,Math.round(ty)+3,1,1,'#e8e0c0');
  if(f.st==='raise'&&(frame>>2)%2)R(Math.round(tx)+1,Math.round(ty)+2,2,2,'#ffda6a');
  ctx.restore()}

Object.assign(EXTRA_UPD,{ant:updAnt,scorpion:updScorpion});
Object.assign(EXTRA_DRAW,{ant:drawAnt,scorpion:drawScorpion});
Object.assign(EXTRA_KILL,{
  ant:f=>{sfx.squish();particle(f.x+3,f.y+2,f.fire?['#b0301c','#d8502a']:['#2a1a14','#4a3024'],5,1.2,20,.2,1);addMoney(8,f.x+3,f.y-4,'#e8d8b0')},
  scorpion:f=>{sfx.squish();particle(f.x+7,f.y+4,['#a8783a','#6a4a22','#e8e0c0'],14,1.8,34,.2,1);addMoney(90,f.x+7,f.y-6,'#ffe08a');dropMat('bone',f.x+7,f.y+2,1)}
});
