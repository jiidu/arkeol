/*
  Arkeol v0.3.4 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  vents.js – steam vents in floors, walls and ceilings; the strong ones throw you through the air
*/
'use strict';
Object.assign(sfx,{
  ventHiss:()=>{noise(.5,.035,5200,'highpass')},
  ventBlast:()=>{noise(.9,.07,2600,'highpass');noise(.6,.05,700,'bandpass')},
  ventBoom:()=>{noise(1.1,.11,1800,'highpass');tone(70,.5,'sawtooth',.05,-30);noise(.7,.08,300,'lowpass')}
});

/* direction the steam blows: away from the surface the vent sits in */
const ventDir=d=>d.sx<0?[1,0]:d.sx>0?[-1,0]:d.sy<0?[0,1]:[0,-1];
function ventMouth(d){const x=d.tx*T,y=d.ty*T;return d.sx<0?[x,y+8]:d.sx>0?[x+16,y+8]:d.sy<0?[x+8,y]:[x+8,y+16]}

function spawnVents(lv,H){const {ri,r,sy}=H;if(lv<2&&!inVoid)return;
  const n=biome==='hot'?6+ri(0,2):biome==='cold'?2:3+ri(0,2);let c=0;
  for(let a=0;a<2500&&c<n;a++){const x=ri(2,MW-3),y=ri(Math.max(3,sy),MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y))continue;
    // floors are the most common, then walls, then ceilings
    const pick=r();let sx=0,syy=0;
    if(pick<.55&&isSolid(x,y+1))syy=1;else if(pick<.85&&(isSolid(x-1,y)||isSolid(x+1,y)))sx=isSolid(x-1,y)?-1:1;else if(isSolid(x,y-1))syy=-1;else continue;
    const d={tx:x,ty:y,k:'vent',sx,sy:syy},[dx,dy]=ventDir(d);let room=0;for(let k=0;k<4;k++){if(grid[idx(x+dx*k,y+dy*k)]!==AIR)break;room++}if(room<3)continue;
    if(decos.some(o=>o.k==='vent'&&Math.abs(o.tx-x)+Math.abs(o.ty-y)<6))continue;
    d.strong=r()<.35;d.t=ri(60,400);d.st='rest';d.len=(d.strong?6:3.5)*T;decos.push(d);c++}}

function ventBox(d){const [mx,my]=ventMouth(d),[dx,dy]=ventDir(d),L=d.len,W=12;
  return dx?{x:dx>0?mx:mx-L,y:my-W/2,w:L,h:W}:{x:mx-W/2,y:dy>0?my:my-L,w:W,h:L}}

function updVents(){if(!P)return;const near=d=>Math.abs(d.tx*T-P.x)<VW&&Math.abs(d.ty*T-P.y)<VH;
  for(const d of decos){if(d.k!=='vent'||d.dead)continue;d.t--;const [mx,my]=ventMouth(d),[dx,dy]=ventDir(d);
    if(d.st==='rest'){if(d.t<=0){d.st='warn';d.t=50;if(near(d))sfx.ventHiss()}}
    else if(d.st==='warn'){if(frame%5===0)parts.push({x:mx+rand(-2,2),y:my+rand(-2,2),vx:dx*.4+rand(-.15,.15),vy:dy*.4-.15,life:30,max:30,col:'rgba(235,240,245,.5)',g:-.003,sz:1});
      if(d.t<=0){d.st='blast';d.t=d.strong?46:70;d.hit=false;if(near(d)){d.strong?sfx.ventBoom():sfx.ventBlast();if(d.strong)shake=Math.max(shake,3)}}}
    else{const k=d.t/(d.strong?46:70);
      for(let i=0;i<(d.strong?4:2);i++){const sp=(d.strong?3.2:2)*(.7+Math.random()*.5);parts.push({x:mx+rand(-3,3)*(dy?1:.3),y:my+rand(-3,3)*(dx?1:.3),vx:dx*sp+rand(-.35,.35),vy:dy*sp+rand(-.35,.35)-.05,life:22+Math.random()*16,max:38,col:pickR(['rgba(240,244,248,.75)','rgba(220,228,236,.6)','rgba(255,255,255,.85)']),g:-.004,sz:2})}
      const box=ventBox(d);
      if(state==='play'&&!P.dead&&overlap(P,box)){
        if(d.strong){if(!d.hit){d.hit=true;P.climb=null;P.vx=dx*6.5+(dy?P.vx*.3:0);P.vy=dy?dy*9.5:-3.4;P.safeFall=true;P.peak=P.y;P.launch=dy?40:34;sfx.jump&&sfx.jump();floatText(P.x+P.w/2,P.y-8,LANG==='fi'?'Fiuuh!':'Whoosh!','#e8f0f8')}}
        else{P.vx=clamp(P.vx+dx*.45,-3.2,3.2);if(dy<0)P.vy=Math.max(Math.min(P.vy-.55,-.4),-3.8);else if(dy>0)P.vy=Math.min(P.vy+.4,5)}}
      // loose things get blown about too
      for(const r of rocks)if(overlap(r,box)){r.vx=(r.vx||0)+dx*.3;r.vy=(r.vy||0)+dy*.3}
      if(d.t<=0){d.st='rest';d.t=d.strong?260+Math.random()*260:180+Math.random()*240}}}}

function drawVent(d){const x=d.tx*T,y=d.ty*T,hot=biome==='hot',rim=hot?'#c8a83a':'#8a8c96',dark='#120c0e',[dx,dy]=ventDir(d),warn=d.st==='warn'?(frame>>2)%2:0;
  if(dy){const yy=dy<0?y+13:y;R(x+3,yy,10,3,rim);R(x+5,yy+(dy<0?1:0),6,2,dark);if(d.strong){R(x+2,yy+(dy<0?2:0),1,1,rim);R(x+13,yy+(dy<0?2:0),1,1,rim)}
    if(warn)R(x+6,yy+(dy<0?0:2),4,1,'rgba(255,255,255,.6)')}
  else{const xx=dx>0?x:x+13;R(xx,y+3,3,10,rim);R(xx+(dx>0?0:1),y+5,2,6,dark);if(d.strong){R(xx,y+2,1,1,rim);R(xx,y+13,1,1,rim)}if(warn)R(xx+(dx>0?2:0),y+6,1,4,'rgba(255,255,255,.6)')}
  if(d.st==='blast'){const b=ventBox(d),k=Math.min(1,d.t/12),g=dx?ctx.createLinearGradient(dx>0?b.x:b.x+b.w,0,dx>0?b.x+b.w:b.x,0):ctx.createLinearGradient(0,dy>0?b.y:b.y+b.h,0,dy>0?b.y+b.h:b.y);
    g.addColorStop(0,`rgba(245,248,252,${.55*k})`);g.addColorStop(1,'rgba(245,248,252,0)');ctx.fillStyle=g;
    const wob=Math.sin(frame*.4)*1.5;ctx.beginPath();if(dx){ctx.moveTo(b.x+(dx>0?0:b.w),b.y+b.h/2-3);ctx.lineTo(b.x+(dx>0?b.w:0),b.y-3+wob);ctx.lineTo(b.x+(dx>0?b.w:0),b.y+b.h+3-wob);ctx.lineTo(b.x+(dx>0?0:b.w),b.y+b.h/2+3)}
    else{ctx.moveTo(b.x+b.w/2-3,b.y+(dy>0?0:b.h));ctx.lineTo(b.x-3+wob,b.y+(dy>0?b.h:0));ctx.lineTo(b.x+b.w+3-wob,b.y+(dy>0?b.h:0));ctx.lineTo(b.x+b.w/2+3,b.y+(dy>0?0:b.h))}ctx.fill()}}
