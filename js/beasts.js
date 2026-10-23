/*
  Arkeol v0.3.4 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  beasts.js – creatures of the slipped-in-time layers: raptors and a great tyrant in the age of dinosaurs,
              knights, mammoths and a dragon in the medieval layer
*/
'use strict';
ERAS.push('dino');
ERADECO.dino=[['fern','floor'],['dinoegg','floor'],['fossil','wall'],['bigbone','floor'],['fern','floor']];
Object.assign(STR.en,{era_dino:'The age of dinosaurs',cRaptor:'a raptor',cRex:'a tyrant lizard',cKnight:'a knight’s sword',cMammoth:'a charging mammoth'});
Object.assign(STR.fi,{era_dino:'Dinosaurusten aikaa',cRaptor:'raptori',cRex:'tyrannolisko',cKnight:'ritarin miekka',cMammoth:'rynnäkköön lähtenyt mammutti'});
Object.assign(sfx,{
  raptor:()=>{tone(900,.12,'sawtooth',.02,500);setTimeout(()=>tone(1200,.1,'square',.012,-400),90)},
  rexRoar:()=>{tone(60,1.2,'sawtooth',.08,-20);tone(95,1,'square',.04,-40);noise(1.1,.12,380,'bandpass')},
  stomp:()=>{tone(45,.25,'sine',.08,-15);noise(.2,.06,200,'lowpass')},
  clang:()=>{tone(1400,.2,'triangle',.03,-200);tone(2100,.15,'square',.012,-500)},
  trumpet:()=>{tone(220,.7,'sawtooth',.05,180);setTimeout(()=>tone(330,.5,'sawtooth',.04,-60),250)}
});
const mkRaptor=(x,y)=>({type:'raptor',x,y,w:12,h:10,vx:0,vy:0,hp:2,st:'roam',t:0,cd:0,face:Math.random()<.5?-1:1,anim:Math.random()*99,hurt:0,dead:false});
const mkRex=(x,y)=>({type:'rex',x,y,w:28,h:26,vx:0,vy:0,hp:12,st:'roam',t:0,cd:0,face:Math.random()<.5?-1:1,anim:0,hurt:0,dead:false,roared:false});
const mkKnight=(x,y)=>({type:'knight',x,y,w:10,h:18,vx:0,vy:0,hp:5,st:'guard',t:0,cd:0,face:Math.random()<.5?-1:1,anim:Math.random()*99,hurt:0,dead:false});
const mkMammoth=(x,y)=>({type:'mammoth',x,y,w:32,h:24,vx:0,vy:0,hp:10,st:'graze',t:0,cd:0,face:Math.random()<.5?-1:1,anim:Math.random()*99,hurt:0,dead:false});

function placeOnFloor(H,w,h,far,n,mk){const {ri,airFloor}=H;let c=0;
  for(let a=0;a<2500&&c<n;a++){const x=ri(3,MW-5),y=ri(H.sy+3,MH-3);if(!H.far(x,y,far))continue;let ok=true;const tw=Math.ceil(w/T),th=Math.ceil(h/T);
    for(let yy=y-th+1;yy<=y&&ok;yy++)for(let xx=x;xx<x+tw&&ok;xx++)if(grid[idx(xx,yy)]!==AIR||isWater(xx,yy))ok=false;
    for(let xx=x;xx<x+tw&&ok;xx++)if(!isSolid(xx,y+1))ok=false;if(!ok)continue;foes.push(mk(x*T+1,(y+1)*T-h-.001));c++}}
function spawnEraFoes(lv,H){if(inVoid||!era)return;const r=H.r;
  if(era==='dino'){placeOnFloor(H,12,10,9,3+Math.min(3,lv>>2),mkRaptor);placeOnFloor(H,28,26,14,lv>=6||r()<.6?1:0,mkRex)}
  else if(era==='medieval'){placeOnFloor(H,10,18,9,2+(lv>=6?1:0),mkKnight);placeOnFloor(H,32,24,12,1,mkMammoth);
    if(!foes.some(f=>f.type==='dragon')&&(lv>=5||r()<.5))placeOnFloor(H,34,20,16,1,mkDragon)}}

/* ------------------------------------------------ behaviour */
const gnd=(f,g=.32)=>{f.vy=Math.min(f.vy+g,7)};
const edgeAhead=(f)=>{const ax=Math.floor((f.x+(f.face>0?f.w+2:-2))/T),ay=Math.floor((f.y+f.h+2)/T);return !isSolid(ax,ay)};
function stompable(f,P0,fcx,h,dmg){if(P0.vy>1&&P0.y+P0.h-f.y<h&&!P0.climb){damageFoe(f,dmg,P0.x+P0.w/2,'stomp');P0.vy=-4.6;P0.peak=P0.y;return true}return false}
function updRaptor(f,dx,dy,dist,sees,fcx){f.t++;gnd(f);if(f.cd>0)f.cd--;const hunt=sees&&dist<8*T||f.mt!==undefined&&frame-f.mt<150&&(dx||dy);
  if(f.onGround){if(hunt){if(Math.abs(dx)>3)f.face=Math.sign(dx);f.vx+=(f.face*2.1-f.vx)*.15;
      if(f.cd<=0&&Math.abs(dx)<3*T&&Math.abs(dy)<2*T){f.vy=-3.8;f.vx=f.face*3.3;f.cd=70;sfx.raptor()}}
    else{if(f.t%120===0&&Math.random()<.5)f.face*=-1;if(edgeAhead(f))f.face*=-1;f.vx+=(f.face*.6-f.vx)*.1}}
  move(f);if(f.hitX){if(f.onGround&&hunt)f.vy=-3.6;else f.face*=-1}if(f.hitY)f.vy=0;
  if(state==='play'&&overlap(P,f)&&!stompable(f,P,fcx,6,2))hurt(1,'cRaptor',fcx);
  return hunt?.45:0}
function updRex(f,dx,dy,dist,sees,fcx,fcy){f.t++;gnd(f,.35);if(f.cd>0)f.cd--;const hunt=sees&&dist<10*T||f.mt!==undefined&&frame-f.mt<240&&(dx||dy);
  if(hunt&&!f.roared){f.roared=true;f.st='roar';f.t=0;sfx.rexRoar();shake=Math.max(shake,8)}
  if(f.st==='roar'){f.vx*=.8;if(f.t>60)f.st='hunt'}
  else if(f.st==='bite'){f.vx*=.7;if(f.t===26){const box={x:f.face>0?f.x+f.w-4:f.x-14,y:f.y-2,w:18,h:16};if(state==='play'&&overlap(P,box))hurt(2,'cRex',fcx)}if(f.t>40){f.st='hunt';f.cd=50}}
  else{if(hunt){if(Math.abs(dx)>6)f.face=Math.sign(dx);f.vx+=(f.face*1.05-f.vx)*.06;
      if(f.cd<=0&&Math.abs(dx)<2.6*T&&Math.abs(dy)<2*T){f.st='bite';f.t=0}}
    else{if(f.t%200===0&&Math.random()<.5)f.face*=-1;if(edgeAhead(f))f.face*=-1;f.vx+=(f.face*.35-f.vx)*.05}
    if(f.onGround&&Math.abs(f.vx)>.3&&f.t%28===0&&dist<12*T){sfx.stomp();shake=Math.max(shake,dist<6*T?3:1.5)}}
  move(f);if(f.hitX){if(f.onGround&&hunt)f.vy=-4;else f.face*=-1}if(f.hitY)f.vy=0;
  if(state==='play'&&overlap(P,f)){if(P.vy>1&&P.y+P.h-f.y<8){damageFoe(f,1,P.x+P.w/2,'stomp');P.vy=-5;P.peak=P.y}else hurt(1,'cRex',fcx)}
  return hunt?1:0}
function updKnight(f,dx,dy,dist,sees,fcx){f.t++;gnd(f);if(f.cd>0)f.cd--;const hunt=sees&&dist<7*T||f.mt!==undefined&&frame-f.mt<180&&(dx||dy);
  if(f.st==='swing'){f.vx*=.6;if(f.t===22){sfx.whip();const box={x:f.face>0?f.x+f.w-2:f.x-16,y:f.y-4,w:18,h:f.h+4};if(state==='play'&&overlap(P,box))hurt(1,'cKnight',fcx)}if(f.t>36){f.st='guard';f.cd=40}}
  else{if(hunt){if(Math.abs(dx)>3)f.face=Math.sign(dx);f.vx+=(f.face*.9-f.vx)*.12;if(f.cd<=0&&Math.abs(dx)<1.5*T&&Math.abs(dy)<T){f.st='swing';f.t=0}}
    else{if(f.t%180===0)f.face*=-1;if(edgeAhead(f))f.face*=-1;f.vx+=(f.face*.3-f.vx)*.08}}
  move(f);if(f.hitX){if(f.onGround&&hunt)f.vy=-3.4;else f.face*=-1}if(f.hitY)f.vy=0;
  if(state==='play'&&overlap(P,f)&&!stompable(f,P,fcx,7,1))hurt(1,'cKnight',fcx);
  return hunt?.6:0}
function updMammoth(f,dx,dy,dist,sees,fcx){f.t++;gnd(f,.35);if(f.cd>0)f.cd--;
  if(f.st==='graze'){if(f.t%240===0&&Math.random()<.5)f.face*=-1;if(edgeAhead(f))f.face*=-1;f.vx+=(f.face*.25-f.vx)*.05;
    if(f.cd<=0&&(sees&&dist<5*T&&Math.abs(dy)<2*T||f.hurt>0)){f.st='warn';f.t=0;f.face=Math.sign(dx)||f.face;sfx.trumpet()}}
  else if(f.st==='warn'){f.vx*=.8;if(f.t>40){f.st='charge';f.t=0}}
  else{f.vx+=(f.face*2.6-f.vx)*.12;if(f.onGround&&f.t%16===0){sfx.stomp();shake=Math.max(shake,2.5)}if(f.t>80||f.hitX){f.st='graze';f.cd=140;f.vx*=.3;if(f.hitX)shake=Math.max(shake,4)}}
  move(f);if(f.hitX&&f.st==='graze')f.face*=-1;if(f.hitY)f.vy=0;
  if(state==='play'&&overlap(P,f)){if(P.vy>1&&P.y+P.h-f.y<8){P.vy=-5.5;P.peak=P.y}else{hurt(f.st==='charge'?2:1,'cMammoth',fcx);if(f.st==='charge'){P.vx=f.face*5;P.vy=-3.5;P.launch=20}}}
  return f.st==='charge'?.9:0}

/* ------------------------------------------------ drawing */
function drawRaptor(f){const x=Math.round(f.x+f.w/2),y=Math.round(f.y+f.h),hc=f.hurt>0&&(f.hurt>>1)%2,B=hc?'#fff':'#5a7a3a',D=hc?'#ddd':'#3a5226',L='#9ab868',run=Math.abs(f.vx)>.5?(f.t>>2)%2:0;
  ctx.save();ctx.translate(x,y);if(f.face<0)ctx.scale(-1,1);
  R(-10,-8,6,2,B);R(-13,-9,4,2,B);R(-15,-10,3,1,D);// tail
  R(-5,-9,9,5,B);R(-4,-5,7,1,L);for(let k=0;k<3;k++)R(-4+k*3,-9,1,1,D);// body with stripes
  R(3,-12,3,4,B);R(4,-14,6,3,B);R(9,-13,2,1,B);R(5,-11,5,1,D);R(7,-13,1,1,'#ff3a1a');R(9,-11,1,1,'#efe8dc');// neck, head, eye, teeth
  R(3,-6,2,1,D);R(4,-5,1,1,'#efe8dc');// little arm and claw
  R(-3+run,-4,2,4,D);R(1-run,-4,2,4,D);R(-3+run,0,3,1,D);R(1-run,0,3,1,D);
  ctx.restore()}
function drawRex(f){const x=Math.round(f.x+f.w/2),y=Math.round(f.y+f.h),hc=f.hurt>0&&(f.hurt>>1)%2,B=hc?'#fff':'#6a5a3a',D=hc?'#ddd':'#4a3e26',L=hc?'#fff':'#a89468',step=Math.abs(f.vx)>.3?(f.t>>3)%2:0,open=f.st==='bite'?Math.min(1,f.t/20)*(f.t<28?1:0):f.st==='roar'?1:0;
  ctx.save();ctx.translate(x,y);if(f.face<0)ctx.scale(-1,1);
  // tail
  ctx.fillStyle=B;ctx.beginPath();ctx.moveTo(-8,-20);ctx.lineTo(-26,-14+Math.sin(frame*.05)*1.5);ctx.lineTo(-8,-12);ctx.fill();
  // body and belly
  ctx.beginPath();ctx.ellipse(-2,-16,12,8,-.15,0,7);ctx.fill();ctx.fillStyle=L;ctx.beginPath();ctx.ellipse(0,-12,8,3,-.1,0,7);ctx.fill();
  for(let k=0;k<4;k++)R(-10+k*5,-23+k,2,2,D);
  // legs
  R(-6+step*2,-10,5,10,D);R(-7+step*2,-1,7,1,D);R(1-step*2,-10,5,10,B);R(0-step*2,-1,7,1,B);
  // tiny arms
  R(8,-14,3,1,D);R(10,-13,1,2,D);
  // head with jaw
  R(6,-27,13,7,B);R(16,-25,4,3,B);R(10,-26,2,2,'#1a1410');R(11,-26,1,1,'#ff5a1a');
  ctx.save();ctx.translate(8,-20);ctx.rotate(open*.5);R(0,0,12,3,D);for(let k=0;k<5;k++)R(2+k*2,-1,1,1,'#efe8dc');ctx.restore();
  for(let k=0;k<5;k++)R(8+k*2,-20,1,1,'#efe8dc');
  ctx.restore()}
function drawKnight(f){const x=Math.round(f.x+f.w/2),y=Math.round(f.y+f.h),hc=f.hurt>0&&(f.hurt>>1)%2,A=hc?'#fff':'#9aa3ad',D=hc?'#ddd':'#5e6670',walk=Math.abs(f.vx)>.2?(f.t>>3)%2:0;
  ctx.save();ctx.translate(x,y);if(f.face<0)ctx.scale(-1,1);
  R(-3+walk,-6,3,6,D);R(1-walk,-6,3,6,D);
  R(-4,-14,8,8,A);R(-4,-14,8,1,'#c8d0d8');R(-1,-13,2,6,'#a02a2a');// tabard stripe
  R(-3,-19,7,5,A);R(-1,-17,5,1,'#1a1410');R(0,-21,2,2,'#c03030');R(1,-22,3,1,'#c03030');// helmet, visor, plume
  R(-7,-14,4,7,'#7a4a24');R(-6,-13,2,5,'#c8a030');// shield
  // sword: raised during the wind-up, swept down on the strike
  const sw=f.st==='swing'?(f.t<20?-1.6:f.t<26?.6:.2):-.3;ctx.save();ctx.translate(4,-11);ctx.rotate(sw);R(0,-1,2,2,'#5a3a20');R(2,-1,1,3,'#c8a030');R(3,0,10,1,'#e8eef4');R(3,-1,10,1,'#b9c3cc');ctx.restore();
  ctx.restore()}
function drawMammoth(f){const x=Math.round(f.x+f.w/2),y=Math.round(f.y+f.h),hc=f.hurt>0&&(f.hurt>>1)%2,B=hc?'#fff':'#6a4a2e',D=hc?'#ddd':'#4a321e',step=Math.abs(f.vx)>.3?(f.t>>3)%2:0,sw=Math.sin(frame*.06+f.anim)*(f.st==='charge'?.1:.35);
  ctx.save();ctx.translate(x,y);if(f.face<0)ctx.scale(-1,1);
  ctx.fillStyle=B;ctx.beginPath();ctx.ellipse(-2,-14,15,10,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(-8,-20,8,5,0,0,7);ctx.fill();// body and hump
  for(let k=0;k<12;k++)R(-15+k*2.5,-6-(k%3),1,4,D);// shaggy fur
  R(-12+step,-6,5,6,D);R(-4-step,-6,5,6,D);R(4+step,-6,5,6,D);R(-12+step,-1,5,1,'#2a1e14');R(4+step,-1,5,1,'#2a1e14');
  ctx.beginPath();ctx.fillStyle=B;ctx.ellipse(11,-16,6,6,0,0,7);ctx.fill();R(13,-18,1,1,'#1a1410');R(7,-19,4,6,D);// head, eye, ear
  ctx.save();ctx.translate(15,-13);ctx.rotate(sw);R(-1,0,3,9,B);R(-1,8,3,1,D);ctx.restore();// trunk
  ctx.strokeStyle='#efe8d8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(13,-11);ctx.quadraticCurveTo(22,-6,20,-16);ctx.stroke();// tusk
  if(f.st==='warn'&&(frame>>2)%2){R(12,-24,1,3,'#ffda6a');R(12,-20,1,1,'#ffda6a')}
  ctx.restore()}
function drawEraDeco(d){const x=d.tx*T,y=d.ty*T;
  if(d.k==='dinoegg'){for(let i=0;i<3;i++){const ex=x+2+i*4,ey=y+9+(i%2);ctx.fillStyle=i===1?'#d8d0a8':'#c8c098';ctx.beginPath();ctx.ellipse(ex+1.5,ey+3,2.2,3,0,0,7);ctx.fill();R(ex,ey+2,1,1,'#8a8a6a')}R(x,y+14,16,2,'#6a5a3a');return true}
  if(d.k==='fossil'){const ox=d.sx<0?x+1:x+5;ctx.globalAlpha=.75;R(ox,y+8,10,1,'#d8d0c0');for(let k=0;k<4;k++)R(ox+1+k*2,y+5,1,6,'#d8d0c0');R(ox+9,y+6,3,3,'#d8d0c0');ctx.globalAlpha=1;return true}
  if(d.k==='bigbone'){R(x-4,y+12,24,2,'#e8e0cc');R(x-6,y+10,4,6,'#e8e0cc');R(x+18,y+10,4,6,'#e8e0cc');R(x+2,y+6,2,6,'#d8d0bc');R(x+8,y+5,2,7,'#d8d0bc');R(x+14,y+6,2,6,'#d8d0bc');return true}
  return false}

Object.assign(EXTRA_UPD,{raptor:updRaptor,rex:updRex,knight:updKnight,mammoth:updMammoth});
Object.assign(EXTRA_DRAW,{raptor:drawRaptor,rex:drawRex,knight:drawKnight,mammoth:drawMammoth});
Object.assign(EXTRA_KILL,{
  raptor:f=>{sfx.squish();particle(f.x+6,f.y+5,['#5a7a3a','#9ab868','#a02b24'],12,1.8,30,.2,1);addMoney(40,f.x+6,f.y-6,'#c8e8a0')},
  rex:f=>{sfx.rexRoar();shake=Math.max(shake,10);particle(f.x+14,f.y+12,['#6a5a3a','#a89468','#a02b24'],40,2.6,50,.2,2);addMoney(600,f.x+14,f.y-8,'#ffd27a');dropMat('bone',f.x+14,f.y+10,3)},
  knight:f=>{sfx.clang();particle(f.x+5,f.y+9,['#9aa3ad','#c8d0d8','#a02a2a'],16,2,34,.2,1);addMoney(120,f.x+5,f.y-6,'#e8eef4');dropMat('scrap',f.x+5,f.y+8,2)},
  mammoth:f=>{sfx.trumpet();shake=Math.max(shake,6);particle(f.x+16,f.y+12,['#6a4a2e','#4a321e','#efe8d8'],30,2.2,44,.2,2);addMoney(300,f.x+16,f.y-8,'#ffd27a');dropMat('bone',f.x+16,f.y+10,2)}
});
