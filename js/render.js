/*
  Arkeol v0.3.5 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
/* =========================================================== render */
function R(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(x,y,w,h)}
function stepDust(p){const fx=Math.floor((p.x+p.w/2)/T),fy=Math.floor((p.y+p.h+2)/T),tt=tileAt(fx,fy);
  const C=tt===SAND?['#e4d0a0','#d0b886']:tt===ICE||biome==='cold'?['#ffffff','#cfe8f8']:tt===DIRT?(biome==='moss'?['#6a9a3e','#7a5a3a']:['#8c6a4a','#6b5038']):tt===BRICK||tt===SHOPB||tt===GLYPH?['#c08a5a','#9a6a40']:tt===WATER?['#cfeaff','#9fd3f5']:['#a8a8b0','#8a8a94'];
  const n=tt===SAND?4:Math.abs(p.vx)>1.6?3:2;for(let i=0;i<n;i++)parts.push({x:p.x+p.w/2-p.face*rand(2,5),y:p.y+p.h-1,vx:-p.face*rand(.1,.5),vy:-rand(.15,.5),life:14+Math.random()*8|0,max:22,col:pickR(C),g:.02,sz:1})}
function drawPlayer(p=P){
  const o=look(),SC=sleeveC(o),moving=p.onGround&&Math.abs(p.vx)>.3;if(p.inv>0&&!p.dead&&(frame>>2)%2)return;
  ctx.save();ctx.translate(Math.round(p.x+p.w/2),Math.round(p.y+p.h));if(p.face<0)ctx.scale(-1,1);
  if(p.dead){ctx.rotate(Math.PI/2);ctx.translate(-6,-4)}
  const climb=!!p.climb,BOOT=p.softBoots?'#efe8dc':'#1e1610',FAR=shade(o.pc,-.32);
  // animation state: run phase, idle timer, landing squash
  const run=p.onGround&&Math.abs(p.vx)>.3&&!climb&&!p.dead;
  if(run)p.runPh=(p.runPh||0)+Math.min(.2,.07+Math.abs(p.vx)*.07);else p.runPh=0;
  if(p.onGround&&!run&&!p.swing&&!p.drilling)p.idleT=(p.idleT||0)+1;else p.idleT=0;
  if(p===P){if(!p.onGround&&!climb){p._air=1;p._lvy=p.vy}else if(p._air){p._air=0;if(p._lvy>3.2){p.squash=8;particle(p.x+p.w/2,p.y+p.h,['#8a7a66','#6b5a4c'],6,1.2,18,.05,1)}}}
  if(p.squash>0)p.squash--;
  const leg=(x,lift,col)=>{R(x,-5,3,5-lift,col);R(x,-1-lift,4,1,BOOT);if(p.jumpV>6&&!lift)R(x,0,2,1,'#b9c3cc')};
  let bob=0,lean=0;
  if(p.dead){leg(-4,0,FAR);leg(1,0,o.pc)}
  else if(climb){const c=Math.floor(p.y/5)%2;R(-4,-5-c,3,5,'#4b3628');R(1,-6+c,3,5,'#4b3628');R(-4,-1-c,3,1,'#2a1e16');R(1,-2+c,3,1,'#2a1e16')}
  else if(!p.onGround){if(p.vy<-.5){leg(-5,2,FAR);leg(2,3,o.pc);bob=-1}else if(p.vy>1.5){leg(-5,0,FAR);leg(2,1,o.pc)}else{leg(-4,1,FAR);leg(1,2,o.pc)}}
  else if(p.squash>0){leg(-5,1,FAR);leg(2,1,o.pc);bob=p.squash>3?2:1}
  else if(run){const F=[[-2,0,2,0,0],[-1,1,1,0,0],[0,2,0,0,-1],[2,0,-2,0,0],[1,0,-1,1,0],[0,0,0,2,-1]],k=Math.floor(p.runPh)%6,f=F[k];
    leg(-3+f[0],f[1],FAR);leg(0+f[2],f[3],o.pc);bob=f[4];lean=Math.abs(p.vx)>1.7?1:0;
    if(p===P&&k!==p._rk&&(k===0||k===3))stepDust(p);p._rk=k}
  else{const tap=p.idleT>300&&(frame%34)<5;leg(-4,0,FAR);leg(1,tap?1:0,o.pc);bob=(Math.floor(frame/38)%2)}
  ctx.save();ctx.translate(lean,bob);
  drawTop(o,moving);
  R(-7,-10,3,5,'#7a4f2a');R(-7,-10,3,1,'#9a6a3a');
  drawHairBack(o);R(-4,-15,8,4,o.sk);{const blink=!p.dead&&(frame+(p===P?0:50))%210<5,look=p.idleT>200&&(frame%300)<90?-1:0;if(p.dead)R(1,-13,3,1,'#1a1410');else if(blink)R(2+look,-13,1,1,'#1a1410');else R(2+look,-14,1,2,'#1a1410')}R(3,-12,1,1,o.body==='f'?'#c8706a':shade(o.sk,-.15));if(o.body==='f'&&!p.dead)R(3,-15,1,1,'#1a1410');drawNeck(o,moving);
  drawHat(o);
  const sw=p.swing>0?(12-p.swing)/12:0;
  ctx.save();ctx.translate(1,-9);
  const la0=p.face>0?p.aimAng:Math.PI-p.aimAng;const ang=clamp(Math.atan2(Math.sin(la0),Math.cos(la0)),-1.55,1.55);
  if(p.drilling){ctx.rotate(ang+Math.sin(frame*1.3)*.05);const body=p.drill>2?'#c8d0dc':p.drill>1?'#7a5a20':'#5e6670',tip=p.drill>2?'#7ff0ff':p.drill>1?'#f2c84b':'#b9c3cc';R(0,-2,3,3,SC);R(3,-2,6,4,body);R(3,-2,6,1,'#c8d0d8');
    ctx.fillStyle=tip;ctx.beginPath();ctx.moveTo(9,-2.5);ctx.lineTo(14,0);ctx.lineTo(9,2.5);ctx.fill();ctx.fillStyle='#6b747d';const o=frame%3;for(let k=0;k<2;k++)ctx.fillRect(10+k*2+o*.6,-1,1,2);R(4,1,2,1,'#d24a2e')}
  else if(p.whip>0){const tt=(10-p.whip)/10;R(0,-1,3,3,SC);R(2,-1,3,2,'#4b3628');ctx.strokeStyle='#8a5f34';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(4,0);ctx.quadraticCurveTo(12,-10+tt*14,6+tt*22,-4+tt*6);ctx.stroke()}
  else if(p.swing>0){const base=-1.7+sw*2.1;ctx.rotate(ang+base);const head=p.pick>1?'#43c9e6':'#9aa3ad';R(0,-1,3,3,SC);R(2,-.5,8,1.6,'#8a5f34');R(8,-4,2,8,head);R(7,-4,1,1,'#e3f6ff');R(7,3,1,1,'#e3f6ff')}
  else if(p.slot===1&&curW()&&curW()!=='whip'){ctx.rotate(ang);R(0,-1,3,3,SC);const w=curW();
    if(DEMON_DRAW[w])DEMON_DRAW[w](p);
    else if(w==='bow'){ctx.strokeStyle='#8a5f34';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(3,0,6,-1.25,1.25);ctx.stroke();ctx.strokeStyle='#d8d0bc';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(4.9,-5.7);ctx.lineTo(p.wcd>20?4.9:2,0);ctx.lineTo(4.9,5.7);ctx.stroke();if(p.wcd<=20&&p.arrows>0)R(2,-.5,8,1,'#b58b4c')}
    else if(w==='xbow'){R(1,-1,10,2,'#7a4a24');R(9,-5,2,10,'#5e6670');R(2,1,2,2,'#5e3618');if(p.wcd<=30&&p.arrows>0)R(4,-2,7,1,'#b58b4c')}
    else if(w==='pistol'){R(2,-1,7,2,'#3d3f48');R(2,0,2,3,'#5e3618');R(8,-1,1,1,'#7a7e8a');if(p.wcd>12)R(9,-2,3,3,'#ffd27a')}
    else{R(2,-1,11,2,'#3d3f48');R(1,0,4,3,'#7a4a24');if(p.wcd>40)R(13,-2,3,4,'#ffd27a')}}
  else if(p.slot===2&&p.rod){R(0,-1,3,3,SC);ctx.strokeStyle='#8a5f34';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(2,0);ctx.lineTo(13,-13);ctx.stroke();R(3,-2,2,2,'#5e6670')}
  else{ctx.rotate(clamp(ang*.85+.45,-1.2,1.6));const head=p.pick>1?'#43c9e6':'#9aa3ad';R(0,-1,3,3,SC);R(2,-.5,8,1.6,'#8a5f34');R(8,-4,2,8,head);R(7,-4,1,1,'#e3f6ff');R(7,3,1,1,'#e3f6ff')}
  ctx.restore();ctx.restore();ctx.restore();
  if(p.breath<p.maxBreath&&!p.dead){const n=Math.ceil(p.breath/p.maxBreath*5);for(let i=0;i<5;i++){ctx.fillStyle=i<n?'rgba(190,230,255,.9)':'rgba(190,230,255,.2)';ctx.beginPath();ctx.arc(p.x-3+i*4,p.y-12,1.5,0,7);ctx.fill()}}
}
/* spider: eight jointed legs around a small head and a big striped abdomen */
function drawSpider(s){
  const jit=s.st==='hang'&&s.dropT>8?(Math.random()-.5)*1.4:0;
  ctx.save();ctx.translate(Math.round(s.x+s.w/2)+jit,Math.round(s.y+s.h/2)+1);
  if(s.st==='hang')ctx.scale(1,-1);if(s.face<0)ctx.scale(-1,1);
  const moving=Math.abs(s.vx)>.2||!s.onGround&&s.st!=='hang';const ph=s.anim*(moving?.5:.12);
  const leg=(hx,kx,ky,fx,fy,col,w)=>{ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(hx,-1);ctx.lineTo(kx,ky);ctx.lineTo(fx,fy);ctx.stroke()};
  const SP=[[-1,-7,-5,-10,4],[0,-3,-7,-5,4],[2,3,-7,4,4],[3,7,-5,10,4]];
  for(let side=0;side<2;side++){const far=side===0;const col=far?'#14120c':'#262116',w=far?.8:1.1,dx=far?1:0;
    SP.forEach(([hx,kx,ky,fx,fy],i)=>{const sw=Math.sin(ph+i*1.7+side*Math.PI)*(moving?1.6:.5);leg(hx+dx,kx+dx+sw*.6,ky-Math.abs(sw)*.6+(far?1:0),fx+dx+sw,fy+(far?-.5:0),col,w)})}
  const glow=s.wind>0?.5+.5*Math.sin(frame*.8):0,sw=s.wind>0?1+.38*(1-s.wind/50)+Math.sin(frame*.7)*.05:1;
  ctx.fillStyle=s.hurt?'#5a4a3a':'#2c2a1a';ctx.beginPath();ctx.ellipse(-4-(sw-1)*3,-1,5.2*sw,4.2*sw,-.12,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,.08)';ctx.beginPath();ctx.ellipse(-5,-3,2.5,1.3,-.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=glow?`rgba(200,255,100,${.6+glow*.4})`:'#86c42c';
  ctx.fillRect(-7,-2,1,2);ctx.fillRect(-5,-3,2,1);ctx.fillRect(-5,0,2,1);ctx.fillRect(-3,-2,1,2);ctx.fillRect(-8,-1,1,1);
  ctx.fillStyle='#3a3420';ctx.fillRect(-9,-2,1,1);ctx.fillRect(-8,1,1,1);ctx.fillRect(-1,-4,1,1);
  ctx.fillStyle='#1d1b12';ctx.beginPath();ctx.ellipse(2.4,0,2.8,2.3,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#ff4a3a';ctx.fillRect(3,-1.5,1,1);ctx.fillRect(4.2,-1.2,1,1);ctx.fillStyle='#b8261a';ctx.fillRect(3.6,-.3,1,1);
  ctx.fillStyle='#0e0d08';ctx.fillRect(4.6,.8,1,1.6);ctx.fillRect(3.8,1.4,1,1.4);
  if(s.charge){ctx.fillStyle='#b6f05a';ctx.fillRect(5,2.6,1,1+(frame>>2)%2)}
  ctx.restore();
  if(s.st==='hang'){ctx.fillStyle='rgba(220,220,230,.35)';ctx.fillRect(Math.round(s.x+s.w/2),Math.floor(s.y/T)*T-1,1,Math.round(s.y-Math.floor(s.y/T)*T)+2)}
}
function drawMummy(m){
  ctx.save();ctx.translate(Math.round(m.x+m.w/2),Math.round(m.y+m.h));if(m.face<0)ctx.scale(-1,1);
  const ch=m.st==='chase',walk=m.onGround&&Math.abs(m.vx)>.1?Math.floor(m.anim/(ch?6:11))%2:0,sway=ch?0:Math.sin(m.anim*.05)*.6;
  const c1=m.hurt?'#f4e0d8':'#cfc3a0',c2='#a89878',c3='#8a7a5c';
  R(-4,-5,3,5-walk,c2);R(1,-5,3,4+walk,c2);R(-4,-2,3,1,c3);
  ctx.rotate(sway*.05);
  R(-5,-12,10,8,c1);for(let i=0;i<4;i++)R(-5,-11+i*2,10,1,i%2?c2:c3);R(-5,-9,3,1,'#e6dcc0');
  R(-4,-17,8,5,c1);R(-4,-16,8,1,c3);R(-4,-13,8,1,c2);R(0,-15,4,1,'#1a1410');
  R(-6,-9+((m.anim>>3)%2),1,5,c2);R(-7,-5+((m.anim>>3)%2),1,2,c3);
  if(ch){R(2,-11,8,2,c1);R(2,-10,8,1,c3);R(9,-12,1,1,c2)}else{R(1,-11,2,6,c1);R(1,-8,2,1,c3)}
  ctx.restore();
}
function drawWolf(w){
  ctx.save();ctx.translate(Math.round(w.x+w.w/2),Math.round(w.y+w.h));if(w.face<0)ctx.scale(-1,1);
  const run=Math.abs(w.vx)>.3&&w.onGround;const ph=run?Math.floor(w.anim/(w.st==='chase'?3:6))%4:0;const leg=[0,1,2,1][ph];
  const fur=w.hurt?'#b0a0a0':'#6f717a',dark=w.hurt?'#806868':'#4c4e56',light='#9a9ca6';
  R(-7,-3-leg%2,2,3+leg%2,dark);R(-4,-3-(leg+1)%2,2,3,dark);R(2,-3-(leg+2)%2,2,3,dark);R(5,-3-(leg+3)%2,2,3,dark);
  R(-7,-8,13,5,fur);R(-7,-8,13,1,light);R(-6,-4,10,1,dark);
  R(-10,-9+(w.st==='chase'?-1:1),4,2,fur);R(-11,-10+(w.st==='chase'?-1:1),2,2,light);
  R(4,-11,5,5,fur);R(8,-9,3,2,fur);R(10,-9,1,1,'#1b1b22');R(5,-13,2,2,dark);R(7,-13,1,2,dark);R(6,-6,4,1,dark);
  if(w.st==='chase'&&w.cd>55)R(8,-7,3,1,'#efe4d2');
  ctx.restore();
}
function drawMerchant(m){
  const x=Math.round(m.x),y=Math.round(m.y),bob=Math.sin(frame*.05)>.9?1:0;
  R(x-3,y+12,20,6,'#6b3a1e');R(x-3,y+12,20,1,'#8a5228');R(x-2,y+14,2,4,'#4b2814');R(x+13,y+14,2,4,'#4b2814');
  R(x+1,y+4,12,10,'#efe8dc');R(x+1,y+4,12,1,'#fff');R(x+5,y+6,4,1,'#d6b04a');
  R(x+2,y-4+bob,10,8,'#9c6a3e');R(x,y-6+bob,14,3,'#d6b04a');for(let i=0;i<4;i++)R(x+i*4,y-6+bob,2,3,'#3d5fb8');
  R(x,y-3+bob,2,8,'#d6b04a');R(x+12,y-3+bob,2,8,'#d6b04a');R(x,y-1+bob,2,1,'#3d5fb8');R(x+12,y-1+bob,2,1,'#3d5fb8');R(x,y+2+bob,2,1,'#3d5fb8');R(x+12,y+2+bob,2,1,'#3d5fb8');
  R(x+4,y-2+bob,2,1,'#1b120a');R(x+8,y-2+bob,2,1,'#1b120a');R(x+6,y+2+bob,2,2,'#2a1e16');
  R(x-2,y+9,3,3,'#d9a826');R(x+14,y+8,3,4,'#3d9fbf');R(x+15,y+7,1,1,'#bff3ff');
}
function drawNpc(n){if(FOLK_DRAW[n.type]){FOLK_DRAW[n.type](n);return}
  const x=Math.round(n.x),y=Math.round(n.y),f=n.face,b=Math.sin(n.anim*.05)>.92?1:0;
  if(n.type==='coffee'){const fx=x+f*13;R(fx-6,y-2,12,2,'#5a3a20');R(fx-5,y-3,10,1,'#6b4426');R(fx-7,y-3,3,3,'#6a6c77');R(fx+4,y-3,3,3,'#6a6c77');
    const fl=Math.sin(frame*.4)*1;R(fx-2,y-6+fl*.5,4,3,'#ffb347');R(fx-1,y-8+fl,2,2,'#fff1b0');
    R(fx-1,y-13,9,1,'#3a3236');R(fx-1,y-15,1,2,'#3a3236');R(fx+7,y-15,1,2,'#3a3236');R(fx+1,y-14,5,4,'#1d1d24');R(fx+2,y-15,3,1,'#2a2a32');R(fx+6,y-13,2,1,'#1d1d24');R(x-8,y-4,16,4,'#6b4426');R(x-8,y-4,16,1,'#8a5a32')}
  else if(n.type==='knitter'){R(x-7,y-12,2,12,'#6b4426');R(x-7,y-1,12,1,'#5a3a20');R(x-5,y-4,10,2,'#6b4426');const lx=x-f*12;R(lx-2,y-8,5,7,'#ffcf7a');R(lx-2,y-9,5,1,'#3a3236');R(lx-2,y-1,5,1,'#3a3236');ctx.fillStyle='#c0392b';ctx.beginPath();ctx.arc(x+f*9,y-2,2.5,0,7);ctx.fill()}
  else if(n.type==='reader'){R(x-6,y-5,12,5,'#8a5a2c');R(x-6,y-5,12,1,'#b07a40');const lx=x-f*12;R(lx-2,y-8,5,7,'#ffcf7a');R(lx-2,y-9,5,1,'#3a3236');R(lx-2,y-1,5,1,'#3a3236')}
  else{R(x-5,y-4,10,4,'#6a6c77');R(x-5,y-4,10,1,'#8a8c96')}
  ctx.save();ctx.translate(x,y-4);if(f<0)ctx.scale(-1,1);
  const C={coffee:{shirt:'#4a6a3a',pants:'#3a3a48',skin:'#e2b48a',hat:'#b03a2e'},fisher:{shirt:'#c9a043',pants:'#3a4a68',skin:'#d8a47a',hat:'#4a6a3a'},harmonica:{shirt:'#3d5fb8',pants:'#4b3628',skin:'#c98f68',hat:'#2a2a32'},knitter:{shirt:'#8a3a5a',pants:'#5a4a5a',skin:'#ecc49a',hat:'#c8c8cc'},reader:{shirt:'#6a6a72',pants:'#3a3a48',skin:'#e2b48a',hat:'#5a4a3a'}}[n.type];
  R(-3,-3,8,3,C.pants);R(4,-3,2,6,C.pants);R(4,2,4,1,'#2a1e16');
  R(-4,-10-b,7,7,C.shirt);R(-4,-10-b,7,1,'rgba(255,255,255,.15)');
  R(-3,-14-b,6,4,C.skin);R(1,-13-b,1,1,'#1a1410');
  if(n.type==='coffee'){R(-4,-16-b,7,3,C.hat);R(-2,-17-b,3,1,C.hat);R(-3,-11-b,6,2,'#d8d0c4');R(3,-8,3,3,'#efe8dc');R(6,-7,1,1,'#efe8dc')}
  else if(n.type==='fisher'){R(-5,-15-b,9,1,C.hat);R(-3,-17-b,6,2,C.hat);R(2,-8,4,2,C.skin)}
  else if(n.type==='harmonica'){R(-4,-16-b,7,2,C.hat);R(2,-16-b,3,1,C.hat);const tt=(frame>>4)%2;R(3,-12-b+tt,3,1,'#c8ccd2');R(2,-11,3,2,C.skin)}
  else if(n.type==='knitter'){R(-4,-16-b,6,3,C.hat);R(-5,-15-b,2,2,C.hat);R(-4,-9,8,3,'#b03a2e');R(3,-7,3,2,'#c0392b');R(2,-10,1,4,'#c8ccd2');R(5,-10,1,4,'#c8ccd2')}
  else if(n.type==='reader'){R(-4,-16-b,7,2,C.hat);R(1,-13-b,3,1,'#c8ccd2');R(3,-12,6,7,'#efe8dc');R(4,-10,4,1,'#8a8478');R(4,-8,3,1,'#8a8478')}
  ctx.restore();
  if(n.type==='fisher'){const tx=x+f*16,ty=y-20;ctx.strokeStyle='#8a5f34';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+f*4,y-11);ctx.lineTo(tx,ty);ctx.stroke();
    if(n.wy){ctx.strokeStyle='rgba(225,225,215,.5)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(n.wx,n.wy);ctx.stroke();R(n.wx-1,n.wy-1+Math.sin(frame*.07+n.anim)*.6,3,2,'#e2483d')}}
}
function drawDoor(d){
  R(d.x-4,d.y-4,24,28,'#3f3a44');R(d.x-4,d.y-4,24,1,'#5d5763');R(d.x-3,d.y-3,22,2,'#4b4550');
  for(let k=0;k<3;k++){R(d.x-4,d.y+4+k*8,4,1,'#2c2830');R(d.x+16,d.y+4+k*8,4,1,'#2c2830')}
  const pulse=.75+.25*Math.sin(frame*.06);R(d.x,d.y,16,24,'#1a0d06');
  ctx.fillStyle=`rgba(255,170,70,${.55*pulse})`;ctx.fillRect(d.x+2,d.y+2,12,22);ctx.fillStyle=`rgba(255,230,160,${.5*pulse})`;ctx.fillRect(d.x+5,d.y+6,6,18);
  R(d.x,d.y,3,24,'#6b4426');R(d.x,d.y,3,1,'#8a5a32');
}

/* ------------------------------------------------ surface trees, wind, leaves, campfire */
const leaves=[];
function windAt(tx){return Math.sin(frame*.011+tx*.35)*.55+Math.sin(frame*.031+tx*.9)*.25+Math.sin(frame*.004)*.35}
function drawTree(x,y,v,tx){
  const H=[44,54,48,58][v],w=windAt(tx),base=y+16,cx=x+8;
  const kind=v===2?'pine':v===3?'birch':'oak';
  const bend=w*(kind==='pine'?2:3),topY=base-H;
  // trunk: tapered, bent slightly by the wind
  const tc=kind==='birch'?'#d9d2c2':'#4a3220',th=kind==='birch'?'#f0ead8':'#654330';
  for(let yy=0;yy<H-8;yy++){const k=yy/(H-8),ww=Math.max(2,Math.round(6-k*3)),ox=Math.round(bend*k*k);
    R(cx-Math.floor(ww/2)+ox,base-yy-1,ww,1,tc);R(cx-Math.floor(ww/2)+ox,base-yy-1,1,1,th);
    if(kind==='birch'&&(yy*7+tx)%9===0)R(cx-1+ox,base-yy-1,2,1,'#2a2420')}
  if(kind!=='pine'){ctx.strokeStyle=tc;ctx.lineWidth=2;const by=base-H*.55;ctx.beginPath();ctx.moveTo(cx+bend*.3,by);ctx.lineTo(cx-7+bend*.6,by-9);ctx.moveTo(cx+1+bend*.35,by+3);ctx.lineTo(cx+8+bend*.6,by-6);ctx.stroke()}R(cx-4,base-2,9,2,tc);R(cx-5,base-1,11,1,kind==='birch'?'#bdb5a3':'#3a2618'); // root flare
  const SEA=surf?SKY.season:'summer';
  if(SEA==='winter'&&kind!=='pine'){ctx.strokeStyle=tc;ctx.lineWidth=1;const by=base-H*.55;for(const [ax,ay,bx2,by2] of [[0,0,-10,-16],[0,-4,9,-18],[-6,-8,-12,-20],[5,-10,10,-22],[0,-12,1,-26]]){ctx.beginPath();ctx.moveTo(cx+ax+bend*.5,by+ay);ctx.lineTo(cx+bx2+bend*.8,by+by2);ctx.stroke();R(Math.round(cx+bx2+bend*.8)-1,Math.round(by+by2),3,1,'#eef2fa')}return}
  if(kind==='pine'){
    const tiers=5,cols=SEA==='winter'?['#1f3a2c','#e8eef8','#ffffff']:['#1f3a24','#28482c','#305634'];
    for(let i=0;i<tiers;i++){const k=i/(tiers-1),ty=topY+6+i*(H-14)/tiers,hw=4+k*10,ox=bend*(1-k*.6)+Math.sin(frame*.05+i+tx)*.4*(1-k);
      ctx.fillStyle=cols[0];ctx.beginPath();ctx.moveTo(cx+ox,ty-6);ctx.lineTo(cx+ox+hw,ty+8);ctx.lineTo(cx+ox-hw,ty+8);ctx.fill();
      ctx.fillStyle=cols[1];ctx.beginPath();ctx.moveTo(cx+ox,ty-6);ctx.lineTo(cx+ox-1,ty+8);ctx.lineTo(cx+ox-hw,ty+8);ctx.fill();
      ctx.fillStyle=cols[2];ctx.fillRect(Math.round(cx+ox-hw*.6),Math.round(ty+6),Math.round(hw*.5),1)}
    return}
  // leafy crown: clusters of blobs in three tones, each swaying a little on its own
  const pal=SEA==='autumn'?(kind==='birch'?['#8a6a10','#c8a020','#f0c840','#fff080']:[['#6a2a10','#a84a18','#d87a28','#f0b040'],['#5a3a10','#9a6a1a','#c89a2a','#f0d060']][v&1])
    :SEA==='spring'?(kind==='birch'?['#4a7a2a','#6aa03a','#9ac858','#d8f0a0']:[['#2e5a24','#4a7a32','#6aa046','#ffc8e0'],['#2e5a24','#4a7a32','#6aa046','#fff0f4']][v&1])
    :kind==='birch'?['#3f5a26','#5a7a30','#86a648','#b0c868']:[ ['#22381c','#2f4a26','#44662f','#6a8a3e'],['#263c1e','#36522a','#4c6e32','#76963f']][v&1];
  const blobs=[[0,-2,10],[-8,4,8],[8,5,8],[-4,-9,8],[5,-8,7],[0,8,8],[-11,-2,6],[11,-1,6]];
  const cy=topY+12;
  for(let layer=0;layer<3;layer++){
    for(let i=0;i<blobs.length;i++){const [bx,by,br]=blobs[i],sw=bend*(1-by/40)+Math.sin(frame*.06+i*1.7+tx)*.6;
      const lx=layer===0?1.5:layer===2?-1.5:0,ly=layer===0?2:layer===2?-2:0,rr=br-(layer===2?3:layer===1?1:0);if(rr<=0)continue;
      ctx.fillStyle=pal[layer];ctx.beginPath();ctx.arc(Math.round(cx+bx+sw+lx),Math.round(cy+by+ly),rr,0,7);ctx.fill()}}
  // speckled leaf highlights
  for(let i=0;i<14;i++){const h=hash(tx*31+i,v+5)>>>0,px=(h%22)-11,py=((h>>>5)%20)-12,sw=bend*(1-py/40)+Math.sin(frame*.07+i)*.7;
    R(Math.round(cx+px+sw),Math.round(cy+py),((h>>9)&1)+1,1,pal[3])}
  // falling leaves
  if(state!=='over'&&Math.random()<(SEA==='autumn'?.03:.006)&&leaves.length<(SEA==='autumn'?90:40)){const a=Math.random()*Math.PI*2,r=Math.random()*12;
    leaves.push({x:cx+Math.cos(a)*r+bend,y:cy+Math.sin(a)*r*.7,vy:.15,ph:Math.random()*6,t:0,rest:0,col:pal[2+(Math.random()<.5?0:1)],tx})}
}
function drawLeaves(){if(!surf){leaves.length=0;return}
  for(let i=leaves.length-1;i>=0;i--){const L=leaves[i];L.t++;
    if(!L.rest){L.vy=Math.min(L.vy+.004,.32);const w=windAt(L.tx);L.x+=w*.35+Math.sin(L.t*.07+L.ph)*.38;L.y+=L.vy+Math.cos(L.t*.07+L.ph)*.08;
      if(isSolid(Math.floor(L.x/T),Math.floor((L.y+1)/T))){L.rest=1;L.y=Math.floor((L.y+1)/T)*T-1}}
    else L.rest++;
    if(L.rest>360||L.t>2000){leaves.splice(i,1);continue}
    ctx.globalAlpha=L.rest>240?1-(L.rest-240)/120:1;const flip=!L.rest&&Math.sin(L.t*.14+L.ph)>0;
    R(Math.round(L.x),Math.round(L.y),flip?1:2,flip?2:1,L.col)}
  ctx.globalAlpha=1}
function drawCampfire(x,y,tx){
  const bx=x+8,base=y+16,f=frame;
  // stone ring
  for(const [ox,c] of [[-5,'#6a6c77'],[-2,'#7e808a'],[1,'#5e606a'],[4,'#6a6c77']])R(bx+ox-1,base-2,3,2,c);
  // crossed logs and embers
  ctx.save();ctx.translate(bx,base-3);ctx.rotate(-.35);R(-5,0,10,2,'#4a2e18');ctx.rotate(.7);R(-5,0,10,2,'#5e3a1e');ctx.restore();
  for(let i=0;i<3;i++){const h=hash(i,f>>3);R(bx-3+i*2+(h&1),base-3,1,1,h&2?'#ff7a1a':'#ffcf5a')}
  // flames: three flickering tongues
  const tongue=(ox,hh,w,col)=>{const fl=Math.sin(f*.3+ox*2)*1.2+Math.sin(f*.53+ox)*.8,h2=hh+fl*1.5;ctx.fillStyle=col;ctx.beginPath();
    ctx.moveTo(bx+ox-w,base-4);ctx.quadraticCurveTo(bx+ox-w*.6,base-4-h2*.6,bx+ox+fl*.6,base-4-h2);ctx.quadraticCurveTo(bx+ox+w*.6,base-4-h2*.5,bx+ox+w,base-4);ctx.fill()};
  tongue(-2,5,2,'#e2451a');tongue(2,6,2,'#e2451a');tongue(0,8,3,'#f07a1e');tongue(0,5,2,'#ffb63a');tongue(0,3,1,'#fff0a0');
  // sparks and smoke
  if(Math.random()<.18)parts.push({x:bx+(Math.random()*6-3),y:base-8,vx:(Math.random()-.5)*.4+windAt(tx)*.2,vy:-.6-Math.random()*.6,life:40,max:40,col:Math.random()<.5?'#ffcf5a':'#ff7a1a',g:-.004,sz:1});
  if(f%9===0)parts.push({x:bx+(Math.random()*4-2),y:base-12,vx:windAt(tx)*.25,vy:-.25,life:90,max:90,col:'rgba(150,140,130,.35)',g:-.002,sz:2});
}
function drawDeco(d){if(drawDeepDeco(d)||drawShamanDeco(d)||drawVoidDeco(d)||drawFolkDeco(d))return;
  const x=d.tx*T,y=d.ty*T,v=d.v||0;
  switch(d.k){
    case 'stal':{ctx.fillStyle=biome==='cold'?'#bfe4fa':'#6a6c77';ctx.beginPath();const w=[6,4,8,5][v],l=[7,5,10,6][v],ox=[5,9,3,7][v];ctx.moveTo(x+ox,y);ctx.lineTo(x+ox+w,y);ctx.lineTo(x+ox+w/2,y+l);ctx.fill();R(x+ox+1,y,1,l-3,'#8a8c96');
      if((frame+d.tx*13)%160<2)parts.push({x:x+ox+w/2,y:y+l,vx:0,vy:.5,life:40,max:40,col:'#8fc8f0',g:.15,sz:1});break}
    case 'roots':{ctx.strokeStyle='#5a3b22';ctx.lineWidth=1;for(let i=0;i<2+v%2;i++){const rx=x+3+i*5+v;ctx.beginPath();ctx.moveTo(rx,y);ctx.quadraticCurveTo(rx+(i%2?3:-3),y+5,rx+1,y+8+v*2);ctx.stroke()}break}
    case 'mush':{const c=['#58e0d0','#9be86a','#c58cff','#58e0d0'][v];R(x+5,y+12,2,4,'#d8d2c4');R(x+3,y+10,6,2,c);R(x+4,y+9,4,1,c);R(x+10,y+13,1,3,'#d8d2c4');R(x+9,y+12,3,1,c);break}
    case 'sprout':{for(let i=0;i<4;i++){const sx=x+2+i*3+(v&1);R(sx,y+16-(2+((i+v)%3)),1,2+((i+v)%3),i%2?'#5f7a44':'#7b9a52')}break}
    case 'bones':{const bc='#e8e0cc',bs='#b8ad94',bd='#2a2420';
      if(v===0){R(x+4,y+14,8,1,bc);R(x+4,y+15,8,1,bs);R(x+2,y+13,2,2,bc);R(x+1,y+14,1,1,bc);R(x+2,y+15,2,1,bs);R(x+12,y+13,2,2,bc);R(x+14,y+14,1,1,bc);R(x+12,y+15,2,1,bs)}
      else if(v===1){R(x+2,y+15,12,1,bs);for(let i=0;i<5;i++){R(x+3+i*2,y+11+(i===0||i===4?1:0),1,4-(i===0||i===4?1:0),bc);R(x+3+i*2,y+11+(i===0||i===4?1:0),2,1,bc)}R(x+13,y+14,2,1,bc)}
      else{const sx=v===3?x-1:x;R(sx+5,y+8,6,1,bc);R(sx+4,y+9,8,4,bc);R(sx+4,y+13,8,1,bs);R(sx+5,y+14,6,2,bs);R(sx+5,y+10,2,2,bd);R(sx+9,y+10,2,2,bd);R(sx+8,y+13,1,1,bd);R(sx+6,y+15,1,1,bd);R(sx+8,y+15,1,1,bd);R(sx+10,y+15,1,1,bd);R(sx+5,y+8,2,1,'#fff8e8');
        if(v===3){ctx.fillStyle=bc;for(let k=0;k<7;k++){R(x+9+k,y+15-((k/2)|0),1,1,bc)}R(x+15,y+11,1,2,bc)}}break}
    case 'beam':{const hh=(v||2)*T,yb=y+T-hh;R(x+2,yb,3,hh,'#6b4426');R(x+3,yb,1,hh,'#8a5a32');R(x+2*T+11,yb,3,hh,'#6b4426');R(x+2*T+12,yb,1,hh,'#8a5a32');R(x,yb,3*T,3,'#5a3a20');R(x,yb,3*T,1,'#8a5a32');R(x+3,yb+1,1,1,'#b0b4bc');R(x+3*T-4,yb+1,1,1,'#b0b4bc');ctx.strokeStyle='#4a3020';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+5,yb+3);ctx.lineTo(x+12,yb+10);ctx.moveTo(x+3*T-5,yb+3);ctx.lineTo(x+3*T-12,yb+10);ctx.stroke();break}
    case 'oldpick':{ctx.strokeStyle='#6b4426';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+5,y+16);ctx.lineTo(x+11,y+6);ctx.stroke();R(x+7,y+4,8,2,'#7a7c84');R(x+6,y+5,2,2,'#5a5c64');R(x+14,y+5,1,2,'#5a5c64');break}
    case 'bedroll':{R(x+1,y+11,14,5,'#4a5a34');R(x+1,y+12,14,1,'#a3261c');R(x+1,y+14,14,1,'#a3261c');R(x+1,y+11,2,5,'#3a4628');R(x+13,y+11,2,5,'#3a4628');break}
    case 'tripod':{ctx.strokeStyle='#8a6a40';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+8,y+5);ctx.lineTo(x+3,y+16);ctx.moveTo(x+8,y+5);ctx.lineTo(x+13,y+16);ctx.moveTo(x+8,y+5);ctx.lineTo(x+8,y+16);ctx.stroke();R(x+5,y+2,6,3,'#c9a043');R(x+10,y+3,2,1,'#3a3236');break}
    case 'oldlamp':{R(x+5,y+9,6,7,v?'#ffcf7a':'#3a3a40');R(x+5,y+8,6,1,'#2a2a30');R(x+7,y+6,2,2,'#2a2a30');R(x+5,y+15,6,1,'#2a2a30');R(x+5,y+9,1,6,'#2a2a30');R(x+10,y+9,1,6,'#2a2a30');break}
    case 'flag':{R(x+7,y+3,1,13,'#c4b090');R(x+8,y+3,5,3,'#e2483d');R(x+8,y+4,5,1,'#efe8dc');break}
    case 'cavepaint':{ctx.globalAlpha=.5;const C=v&1?'#a83a1e':'#8a4a1e';
      if(v%3===0){R(x+2,y+6,9,4,C);R(x+10,y+4,3,3,C);R(x+12,y+2,1,2,C);R(x+13,y+1,2,1,C);R(x+3,y+10,1,4,C);R(x+9,y+10,1,4,C);R(x+1,y+6,1,2,C)}
      else if(v%3===1){for(let i=0;i<3;i++){const hx=x+2+i*5;R(hx,y+3,1,4,C);R(hx-1,y+5,3,1,C);R(hx-1,y+7,1,3,C);R(hx+1,y+7,1,3,C);R(hx,y+1,1,1,C)}R(x+1,y+12,14,1,C);R(x+3,y+13,10,1,C)}
      else{R(x+4,y+4,6,6,C);R(x+5,y+3,1,1,C);R(x+7,y+2,1,2,C);R(x+9,y+3,1,1,C);R(x+3,y+5,1,1,C);for(let i=0;i<3;i++)R(x+11,y+3+i*3,3,1,C)}ctx.globalAlpha=1;break}
    case 'campchair':{R(x+3,y+9,10,2,'#3a5a7a');R(x+11,y+3,2,8,'#3a5a7a');R(x+3,y+9,10,1,'#4a6a8a');ctx.strokeStyle='#8f99a3';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+4,y+11);ctx.lineTo(x+12,y+16);ctx.moveTo(x+12,y+11);ctx.lineTo(x+4,y+16);ctx.moveTo(x+13,y+3);ctx.lineTo(x+12,y+11);ctx.stroke();break}
    case 'kettle':{const bx=x+8;ctx.strokeStyle='#4a3220';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bx-6,y+16);ctx.lineTo(bx,y-1);ctx.lineTo(bx+6,y+16);ctx.stroke();R(bx,y-1,1,3,'#3a3236');
      R(bx-2,y+2,5,4,'#8f99a3');R(bx-2,y+2,5,1,'#6a6c77');R(bx-2,y+3,1,3,'#b0b8c0');
      if(frame%12===0)parts.push({x:bx,y:y+1,vx:windAt(d.tx)*.1,vy:-.3,life:45,max:45,col:'rgba(230,230,230,.4)',g:-.002,sz:1});break}
    case 'mark':{ctx.globalAlpha=.55;ctx.fillStyle='#e8e2d0';if(v===0){R(x+3,y+8,9,1,'#e8e2d0');R(x+10,y+6,1,5,'#e8e2d0');R(x+11,y+7,1,3,'#e8e2d0')}else if(v===1){R(x+7,y+3,1,9,'#e8e2d0');R(x+5,y+9,5,1,'#e8e2d0');R(x+6,y+10,3,1,'#e8e2d0')}else if(v===2){const MK=['E.V.|09','J.H.|06','N.F.|CAIRO','A.T.|ICI AUSSI','T.M.|HARARE','I.Q.|11','Z.M.|LAMU','B.G.|3 NOTES','K.|TITAN?','Z.B.|120 m','I.S.|4112','M.D.|ICI','A.L.F.|07','R.O.|ÄRA','E.L.|08','H-P.K.|HIER','K.T.|7','A.N.|09','LINDQ.|9','J+E|','SOS|','E.V.|→ 3','I.S.|NED','M.D.|NON','A.L.F.|NÃO','H-P.K.|NEIN','R.O.|TAGASI'],mk=MK[hash(d.tx*3,d.ty*7)%MK.length].split('|');ctx.font='5px "Pixelify Sans", monospace';ctx.textAlign='center';ctx.fillText(mk[0],x+8,y+7);if(mk[1])ctx.fillText(mk[1],x+8,y+13);ctx.textAlign='left'}else if(v===3){for(let k=0;k<4;k++)R(x+3+k*2,y+5,1,6,'#e8e2d0');R(x+2,y+8,10,1,'#e8e2d0')}else{R(x+4,y+4,1,1,'#e8e2d0');for(let k=0;k<6;k++){R(x+4+k,y+4+k,1,1,'#e8e2d0');R(x+10-k,y+4+k,1,1,'#e8e2d0')}}ctx.globalAlpha=1;break}
    case 'vine':{for(let k=0;k<v;k++){const yy=y+k*T;ctx.strokeStyle='#3a6224';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+8,yy);ctx.quadraticCurveTo(x+8+Math.sin(frame*.02+d.tx+k)*2,yy+8,x+8,yy+16);ctx.stroke();R(x+6,yy+4,2,2,'#5e9238');R(x+9,yy+10,2,2,'#4a7a2e');if(k===v-1)R(x+7,yy+14,2,2,'#6aa63c')}break}
    case 'bigmush':{const cap=['#5ae0d0','#b07aff','#ff7ab8'][v],st=y+16,ht=26;R(x+6,st-ht+6,4,ht-6,'#e8e0d0');R(x+7,st-ht+6,1,ht-6,'#fff');ctx.fillStyle=cap;ctx.beginPath();ctx.ellipse(x+8,st-ht+5,11,6,0,Math.PI,0);ctx.fill();R(x-3,st-ht+5,22,2,cap);ctx.fillStyle='rgba(255,255,255,.75)';ctx.fillRect(x+2,st-ht+1,2,2);ctx.fillRect(x+10,st-ht-1,2,2);ctx.fillRect(x+14,st-ht+3,1,1);break}
    case 'glowworm':{for(let i=0;i<3;i++){const h=hash(d.tx*3+i,d.ty),cx=x+3+i*5+(h&1),len=4+((h>>>3)%9),sw=Math.sin(frame*.025+i+d.tx)*.6;
        ctx.fillStyle='rgba(200,240,255,.35)';ctx.fillRect(Math.round(cx+sw*.5),y,1,len);const pulse=.6+.4*Math.sin(frame*.05+h);ctx.fillStyle=`rgba(120,230,255,${pulse.toFixed(2)})`;ctx.fillRect(Math.round(cx+sw),y+len,1,2)}break}
    case 'fern':{const sw=Math.sin(frame*.03+d.tx*1.7)*.8;ctx.strokeStyle=v&1?'#4f7a34':'#3f6a2c';ctx.lineWidth=1;
        for(const [a,l] of [[-1.1,8],[-.5,10],[0,9],[.5,10],[1.1,7]]){const ex=x+8+Math.sin(a)*l+sw,ey=y+16-Math.cos(a)*l*.9;ctx.beginPath();ctx.moveTo(x+8,y+16);ctx.quadraticCurveTo(x+8+Math.sin(a)*l*.4,y+16-l*.8,ex,ey);ctx.stroke();
          for(let k=2;k<l;k+=2){const t2=k/l,px=x+8+(ex-x-8)*t2,py=y+16+(ey-y-16)*t2;R(Math.round(px)-1,Math.round(py),1,1,'#6a9a44');R(Math.round(px)+1,Math.round(py),1,1,'#5a8a3a')}}break}
    case 'glowflower':{const c=['#7fe8ff','#ff9ad8','#b9ff7a'][v%3],sw=Math.sin(frame*.035+d.tx)*.7;
        for(let i=0;i<3;i++){const sx=x+3+i*5,h=6+((i*7+v)%4)*2,tx2=Math.round(sx+sw*(i-1));R(sx,y+16-h+2,1,h-2,'#3f6a3a');R(tx2-1,y+16-h,3,2,c);R(tx2,y+16-h+2,1,1,c);R(sx+1,y+12,2,1,'#4f7a40')}
        if((frame+d.tx*17)%140===0)parts.push({x:x+8,y:y+8,vx:(Math.random()-.5)*.2,vy:-.15,life:80,max:80,col:c,g:-.001,sz:1});break}
    case 'hangvine':{const n=v,sw0=frame*.02+d.tx*.9;ctx.strokeStyle='#3a6224';ctx.lineWidth=1;let px=x+8,py=y;
        for(let k=0;k<n*4;k++){const nx=x+8+Math.sin(sw0+k*.35)*(k*.25),ny=y+k*4+4;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(nx,ny);ctx.stroke();if(k%2===0){R(Math.round(nx)+(k%4?1:-2),ny-1,2,2,k%3?'#5e9238':'#4a7a2e')}px=nx;py=ny}
        if(biome==='moss'||v>2)R(Math.round(px)-1,py,2,2,'#c8e86a');break}
    case 'mosscarpet':{const c=biome==='shroom'?['#3f6a6a','#5a8a86','#7ab0a8']:['#3f6a2a','#5a8a36','#7aac48'],b=y+16;R(x,b-2,16,2,c[0]);
        for(let i=0;i<16;i+=2){const h=hash(d.tx*16+i,d.ty)>>>0;const hh=(h%3);R(x+i,b-2-hh,2,hh,c[1]);if(h%5===0)R(x+i,b-3-hh,1,1,c[2])}
        if(d.v===3&&biome==='moss'&&(frame+d.tx*7)%120<60)R(x+7,b-4,1,1,'#e0ff9a');break}
    case 'mossceil':{const c=biome==='shroom'?['#3f6a6a','#5a8a86']:['#3f6a2a','#5a8a36'];R(x,y,16,2,c[0]);
        for(let i=0;i<16;i+=2){const h=hash(d.tx*16+i,d.ty*3)>>>0,hh=h%4;R(x+i,y+2,2,hh>>1,c[1]);if(hh===3)R(x+i,y+2,1,3+(d.v&1),c[0])}break}
    case 'grass':{for(let i=0;i<6;i++){const gx=x+1+i*2.5,h=2+((i*5+v)%4),sw=Math.round(Math.sin(frame*.04+d.tx+i)*.6);R(Math.round(gx)+sw*(h>3?1:0),y+16-h,1,h,i%2?'#5f8a40':'#7aa652')}break}
    case 'wallmoss':{const side=d.sx>0?14:0;for(let i=0;i<6;i++){const h=hash(d.tx+i,d.ty*5);R(x+side+(d.sx>0?-((h>>>4)%3):((h>>>4)%3)),y+2+i*2,2,2,(h&3)?'#4e7a32':'#6a9a3e')}
        if(biome==='moss'&&(frame+d.ty*31)%90<45)R(x+side+(d.sx>0?-2:2),y+6,1,1,'#d8ff9a');break}
    case 'crys':{const up=d.sy<0;ctx.fillStyle=['#b48cff','#7fe8ff','#ff8cc8','#b48cff'][v];for(let i=0;i<3;i++){const cx=x+4+i*4,h=4+((i+v)%3)*2;ctx.beginPath();if(up){ctx.moveTo(cx-1.5,y);ctx.lineTo(cx+1.5,y);ctx.lineTo(cx,y+h)}else{ctx.moveTo(cx-1.5,y+16);ctx.lineTo(cx+1.5,y+16);ctx.lineTo(cx,y+16-h)}ctx.fill()}break}
    case 'ftorch':{R(x+7,y+6,2,10,'#5a3a20');R(x+6,y+15,4,1,'#3a2614');const f=Math.sin(frame*.3+d.tx);R(x+6,y+3+f*.5,4,3,'#ffb347');R(x+7,y+2+f,2,2,'#fff1b0');if(frame%8===0)parts.push({x:x+8,y:y+2,vx:rand(-.2,.2),vy:-.5,life:18,max:18,col:'#ffcf7a',g:-.01,sz:1});break}
    case 'torch':{const wx=d.sx<0?x+2:x+10;R(wx,y+8,3,6,'#5a3a20');const f=Math.sin(frame*.3+d.tx);R(wx,y+5+f*.5,3,3,'#ffb347');R(wx+1,y+4+f,1,2,'#fff1b0');if(frame%8===0)parts.push({x:wx+1.5,y:y+4,vx:rand(-.2,.2),vy:-.5,life:18,max:18,col:'#ffcf7a',g:-.01,sz:1});break}
    case 'lantern':{R(x+7,y,1,4,'#3a3236');R(x+5,y+4,5,1,'#3a3236');R(x+5,y+5,5,6,'#ffcf7a');R(x+5,y+5,1,6,'#6b3a1e');R(x+9,y+5,1,6,'#6b3a1e');R(x+5,y+11,5,1,'#3a3236');break}
    case 'banner':{for(let i=-2;i<=2;i++){R(x+i*16+2,y,12,10,i%2?'#3d5fb8':'#c0392b');R(x+i*16+2,y+10,12,2,'#d6b04a');ctx.fillStyle=i%2?'#c0392b':'#3d5fb8';ctx.beginPath();ctx.moveTo(x+i*16+2,y+12);ctx.lineTo(x+i*16+8,y+16);ctx.lineTo(x+i*16+14,y+12);ctx.fill()}
      ctx.font='600 6px "Pixelify Sans", monospace';ctx.textAlign='center';ctx.fillStyle='#f3dfb0';ctx.fillText('SABU',x+8,y+8);break}
    case 'jar':{R(x+4,y+8,8,8,'#b0643a');R(x+5,y+6,6,2,'#c97a4a');R(x+4,y+11,8,1,'#3d5fb8');R(x+10,y+4,3,12,'#d9a826');R(x+10,y+3,3,1,'#fff3aa');break}
    case 'rugpile':{R(x+1,y+12,14,4,'#8a2b2b');R(x+1,y+13,14,1,'#d6b04a');R(x+3,y+9,10,3,'#2b4a8a');R(x+3,y+10,10,1,'#d6b04a');break}
    case 'terminal':{drawTerminal(d);break}
    case 'lever':{drawLever(d);break}
    case 'wbutton':{drawWButton(d);break}
    case 'candle':{const f=Math.sin(frame*.25+d.tx*3);R(x+6,y+10,3,6,'#d8d0b8');R(x+5,y+15,5,1,'#8a7a5a');R(x+7,y+9,1,1,'#2a1e16');R(x+6+(f>.6?1:0),y+6,2,3,'#ffb347');R(x+7,y+5+(f>0?1:0),1,2,'#fff1b0');R(x+9,y+12,1,3,'#e8e0c8');break}
    case 'sarcoph':{R(x+2,y-14,12,30,'#6a5530');R(x+3,y-13,10,28,'#c49a3a');R(x+5,y-11,6,6,'#e0c48a');R(x+6,y-9,1,1,'#1a1410');R(x+9,y-9,1,1,'#1a1410');R(x+4,y-4,8,1,'#3d5fb8');R(x+4,y-1,8,1,'#3d5fb8');R(x+4,y+2,8,1,'#3d5fb8');for(let k=0;k<4;k++)R(x+5+k*2,y+6,1,7,'#8a6a2a');
      if((frame+d.tx*11)%400<20){ctx.fillStyle='rgba(200,255,110,.9)';ctx.fillRect(x+6,y-9,1,1);ctx.fillRect(x+9,y-9,1,1)}break}
    case 'skulls':{for(const [ox,oy] of [[2,11],[8,11],[5,7]]){R(x+ox,y+oy,5,4,'#d8d0c0');R(x+ox+1,y+oy+1,1,1,'#1a1410');R(x+ox+3,y+oy+1,1,1,'#1a1410');R(x+ox+1,y+oy+4,3,1,'#b8b0a0')}break}
    case 'cweb':{ctx.strokeStyle='rgba(220,224,232,.45)';ctx.lineWidth=.6;const ox=d.sx<0?x:x+16,dir=d.sx<0?1:-1;ctx.beginPath();for(let k=0;k<5;k++){const a=k/4*Math.PI/2;ctx.moveTo(ox,y);ctx.lineTo(ox+Math.cos(a)*14*dir,y+Math.sin(a)*14)}
      for(const r of [5,9,13]){ctx.moveTo(ox+r*dir,y);for(let k=1;k<=4;k++){const a=k/4*Math.PI/2;ctx.lineTo(ox+Math.cos(a)*r*dir,y+Math.sin(a)*r)}}ctx.stroke();break}
    case 'junkpile':{const C=['#5e6670','#8f99a3','#a0522d','#6b4426','#3a5a8a'];for(let i=0;i<7;i++){const h=hash(d.tx*7+i,v);R(x+1+(h%11),y+8+((h>>3)%6),3+((h>>6)%4),2+((h>>9)%3),C[(h>>12)%5])}if(v===1){R(x+3,y+4,8,5,'#3a3236');R(x+4,y+5,6,3,'#6a8a7a')}if(v===2){ctx.strokeStyle='#2a2a2a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+8,y+12,4,0,7);ctx.stroke()}break}
    case 'tarp':{ctx.fillStyle='#4a6a4a';ctx.beginPath();ctx.moveTo(x-8,y);ctx.lineTo(x+40,y);ctx.lineTo(x+36,y+5+Math.sin(frame*.03)*.6);ctx.lineTo(x-4,y+4);ctx.fill();R(x-8,y,48,1,'#5a7a5a');break}
    case 'barrel':{R(x+3,y+5,10,11,'#7a4a24');R(x+3,y+7,10,1,'#3a3236');R(x+3,y+13,10,1,'#3a3236');R(x+4,y+5,2,11,'#8a5a32');break}
    case 'pedestal':{R(x+2,y+10,12,6,'#c4a46a');R(x+1,y+10,14,1,'#e0c48a');R(x+4,y+12,8,1,'#8a6a40');break}
    case 'mural':{const k=(v+level)%6;ctx.globalAlpha=.55;if(k===0){R(x+6,y+4,3,8,'#c0392b');R(x+6,y+2,3,2,'#e8b32c');R(x+9,y+6,4,1,'#c4c4c4')}
      else if(k===1){R(x+4,y+8,9,2,'#3d5fb8');ctx.fillStyle='#d9a826';ctx.beginPath();ctx.arc(x+8,y+5,3,0,7);ctx.fill()}
      else if(k===2){R(x+7,y+2,2,10,'#2a1e16');R(x+5,y+4,6,1,'#2a1e16');R(x+5,y+12,6,1,'#2a1e16')}
      else if(k===3){ctx.fillStyle='#3d9fbf';ctx.beginPath();ctx.moveTo(x+3,y+12);ctx.lineTo(x+8,y+3);ctx.lineTo(x+13,y+12);ctx.fill()}
      else if(k===4){R(x+3,y+6,10,2,'#2a1e16');R(x+5,y+5,6,1,'#2a1e16');R(x+7,y+7,2,1,'#e8e0cf')}
      else{R(x+5,y+3,6,9,'#a37b3a');R(x+6,y+5,1,1,'#2a1e16');R(x+9,y+5,1,1,'#2a1e16')}ctx.globalAlpha=1;break}
    case 'tree':{drawTree(x,y,v,d.tx);break}
    case 'campfire':{drawCampfire(x,y,d.tx);break}
    case 'tent':{ctx.fillStyle='#b8a070';ctx.beginPath();ctx.moveTo(x-10,y+16);ctx.lineTo(x+8,y-4);ctx.lineTo(x+26,y+16);ctx.fill();ctx.fillStyle='#8a7448';ctx.beginPath();ctx.moveTo(x+8,y-4);ctx.lineTo(x+26,y+16);ctx.lineTo(x+16,y+16);ctx.fill();
      ctx.fillStyle='#24180e';ctx.beginPath();ctx.moveTo(x+3,y+16);ctx.lineTo(x+8,y+3);ctx.lineTo(x+13,y+16);ctx.fill();
      ctx.fillStyle='#d8c890';ctx.beginPath();ctx.moveTo(x+3,y+16);ctx.lineTo(x+8,y+3);ctx.lineTo(x+1,y+12);ctx.fill();
            const nl=surf&&skyNow().dl<.6;R(x+8,y-1,1,3,'#3a3236');R(x+7,y+2,3,4,nl?'#ffd27a':'#8a7a5a');R(x+7,y+2,3,1,'#3a3236');
      R(x+7,y-7,2,4,'#5a3a20');R(x+9,y-7+(Math.sin(frame*.08)>0?0:1),5,3,'#a3261c');
      break}
    case 'derrick':{ctx.strokeStyle='#6b4426';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-6,y+16);ctx.lineTo(x+16,y-26);ctx.lineTo(x+38,y+16);ctx.moveTo(x+2,y);ctx.lineTo(x+30,y);ctx.stroke();
      R(x+12,y-30,8,6,'#5a3a20');ctx.fillStyle='#8f99a3';ctx.beginPath();ctx.arc(x+16,y-24,3,0,7);ctx.fill();R(x+15.5,y-21,1,30,'#b58b4c');R(x+13,y+8,7,5,'#6b4426');R(x+13,y+8,7,1,'#8a5a32');break}
  }
}
function render(){
  const pcx=P.x+P.w/2,pcy=P.y+P.h/2;
  let lookX=0;if(mouse.seen&&mouse.inside&&state==='play'&&!coarse){const m=mouseWorld();lookX=clamp((m.x-pcx)*.15,-30,30)}
  if(state==='menu'){cam.x+=(shaft.x*T-VW/2-cam.x)*.02;cam.y+=((surf?surf.ground*T:shaft.y1*T)-VH*.45-cam.y)*.02}
  else if(state!=='trans'){cam.x+=(pcx+lookX-VW/2-cam.x)*.12;cam.y+=(pcy-VH/2-cam.y)*.12}
  clampCam();
  const shx=shakeOn&&shake>.3?rand(-shake,shake):0,shy=shakeOn&&shake>.3?rand(-shake,shake):0;shake*=.86;
  const ox=Math.round((cam.x+shx)*S),oy=Math.round((cam.y+shy)*S);lastOx=ox;lastOy=oy;
  ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#0c0a0f';ctx.fillRect(0,0,cv.width,cv.height);
  ctx.setTransform(S,0,0,S,-ox,-oy);ctx.imageSmoothingEnabled=false;
  const x0=Math.max(0,Math.floor(cam.x/T)-1),x1=Math.min(MW-1,Math.ceil((cam.x+VW)/T)+1),y0=Math.max(0,Math.floor(cam.y/T)-1),y1=Math.min(MH-1,Math.ceil((cam.y+VH)/T)+1);
  const inView=(x,y,m)=>x>cam.x-m&&x<cam.x+VW+m&&y>cam.y-m&&y<cam.y+VH+m;
  // sky, sun or moon, hills, clouds and weather (layer 1) – surface.js
  if(surf)drawSky();
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=idx(x,y),tt=grid[i];if(SOL[tt]||skyA[i])continue;
    ctx.drawImage(prot[i]&&shop&&x>=shop.x0&&x<shop.x0+shop.w&&y>=shop.y0&&y<shop.y0+shop.h?BGB[hash(x,y)&1]:BGS[horrorOn()||corruptAt(i)?'void':biome][hash(x,y)&3],x*T,y*T);
    if(isSolid(x,y-1)){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(x*T,y*T,T,3)}
    if(isSolid(x-1,y)){ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(x*T,y*T,2,T)}
    if(isSolid(x+1,y)){ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(x*T+T-2,y*T,2,T)}}
  if(shop){ctx.fillStyle='rgba(10,4,16,.32)';ctx.fillRect((shop.x0+1)*T,(shop.y0+1)*T,(shop.w-2)*T,(shop.h-2)*T);const g2=ctx.createLinearGradient(0,(shop.y0+1)*T,0,(shop.y0+shop.h-1)*T);g2.addColorStop(0,'rgba(60,0,10,.25)');g2.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g2;ctx.fillRect((shop.x0+1)*T,(shop.y0+1)*T,(shop.w-2)*T,(shop.h-2)*T)}
  for(const d of decos){if(d.dead||d.tx<x0-3||d.tx>x1+3||d.ty<y0-4||d.ty>y1+1)continue;if(d.sx||d.sy){if(!isSolid(d.tx+d.sx,d.ty+d.sy)){d.dead=true;continue}}if(SOL[tileAt(d.tx,d.ty)]){d.dead=true;continue}drawDeco(d)}
  drawLeaves();
  for(const m of motes){const mx=m.x+Math.sin(frame*m.s+m.p)*m.r,my=m.y+Math.cos(frame*m.s*1.3+m.p)*m.r*.6;if((frame*m.s*3+m.p)%6<4.5)R(Math.round(mx),Math.round(my),1,1,'#e8ff9a')}
  drawDoor(door);
  for(const r of ropes){const x=r.tx*T+7;
    if(r.lad){const y0=r.top*T-4,y1=(r.top+r.len)*T;R(x-5,y0,2,y1-y0,'#6b4426');R(x+5,y0,2,y1-y0,'#6b4426');R(x-5,y0,1,y1-y0,'#8a5a32');R(x+5,y0,1,y1-y0,'#8a5a32');for(let yy=y0+3;yy<y1;yy+=5){R(x-4,yy,10,2,(yy>>2)%3?'#7a5230':'#5e3e22');R(x-4,yy,10,1,'#9a6a3a')}continue}
    if(r.nat){const gy=(r.top+1)*T,px=x+r.side*9;R(px,gy-7,3,7,'#5a3a20');R(px,gy-7,3,1,'#8a6a44');ctx.strokeStyle='#94805a';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(px+1,gy-5);ctx.quadraticCurveTo((px+x)/2+1,gy-1,x+1,gy-3);ctx.stroke();R(px-1,gy-5,5,1,'#7a6a4c');const len=r.len*T;for(let yy=0;yy<len-2;yy+=4){const sw=Math.round(Math.sin(frame*.03+yy*.08+r.tx)*.6*yy/len);if(yy<12)continue;R(x+sw,r.top*T+2+yy,2,4,(yy/4)%2?'#7a6a4c':'#94805a')}R(x,r.top*T+len-3,2,3,'#6a5a3c');R(x-1,r.top*T+len-1,1,2,'#6a5a3c');R(x+2,r.top*T+len-1,1,2,'#6a5a3c');continue}
    if(r.head>r.top*T){R(x,r.head,2,4,'#b58b4c');R(x-1,r.head-2,4,2,'#8f99a3')}
    else{R(x-2,r.top*T,6,2,'#8f99a3');const len=r.cur*T;for(let yy=0;yy<len;yy+=4){R(x,r.top*T+2+yy,2,4,(yy/4)%2?'#9c7440':'#b58b4c')}}}
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=idx(x,y),tt=grid[i];if(!SOL[tt])continue;
    const arr=TEXB[horrorOn()||corruptAt(i)?'void':biome][tt]||TEX[tt],hh=hash(x,y);ctx.drawImage(tt===DIAM?TEX[DIAM][gemTypeAt(x,y)]:arr[hh%arr.length],x*T,y*T);
    if(tt===DIRT||tt===STONE||tt===GRAN||tt===SAND){const sh=((hash(x>>2,y>>2)>>>3)%7-3)*.024+((hh>>>20)%5-2)*.012;if(sh){ctx.fillStyle=sh>0?`rgba(255,240,220,${sh.toFixed(3)})`:`rgba(0,0,0,${(-sh).toFixed(3)})`;ctx.fillRect(x*T,y*T,T,T)}}
    if(!isSolid(x,y-1)&&!LIQ[tileAt(x,y-1)]){const soil=tt===DIRT||tt===STONE||tt===GRAN;if(biome==='moss'&&soil)ctx.drawImage(MOSSB[hash(y,x)&3],x*T,y*T);else if(biome==='shroom'&&soil)ctx.drawImage(MYC[hash(y,x)&3],x*T,y*T);else if(biome==='cold'&&(tt===DIRT||tt===STONE||tt===GRAN))ctx.drawImage(SNOW[hash(y,x)&3],x*T,y*T);else if(biome==='hot'&&tt===DIRT)ctx.drawImage(ASH[hash(y,x)&3],x*T,y*T);else if(tt===DIRT)ctx.drawImage(isSky(x,y-1)?GRASS[hash(y,x)&3]:MOSS[hash(y,x)&3],x*T,y*T)}
    if(!isSolid(x,y-1)){ctx.fillStyle='rgba(255,255,255,.07)';ctx.fillRect(x*T,y*T,T,1)}
    if(!isSolid(x,y+1)){ctx.fillStyle='rgba(0,0,0,.32)';ctx.fillRect(x*T,y*T+T-2,T,2)}
    if(tt===TRAPL||tt===TRAPR){const l=links.find(q=>q.tx===x&&q.ty===y);if(l&&l.spent){ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(x*T+(tt===TRAPL?0:12),y*T+6,4,4)}}
    if(tt===PLATE){const l=links.find(q=>q.px===x&&q.py===y);if(l&&(l.pressed||l.anim>0)){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(x*T+2,y*T,12,2)}}
    const d=dmgA[i];if(d>0&&isFinite(HP[tt])){const st=Math.min(2,Math.floor(d/HP[tt]*3));ctx.drawImage(CRACK[st],x*T,y*T)}}
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const w=webA[idx(x,y)];if(w)ctx.drawImage(WEB[w],x*T,y*T)}
  for(const q of puddles){const a=Math.min(1,q.life/60);ctx.fillStyle=`rgba(140,220,40,${.75*a})`;ctx.fillRect(q.tx*T+1,q.ty*T-2,14,3);
    ctx.fillStyle=`rgba(210,255,140,${.8*a})`;const bx=(q.bub*.37|0)%12;ctx.fillRect(q.tx*T+2+bx,q.ty*T-3-((q.bub>>3)%2),1,1);ctx.fillRect(q.tx*T+3,q.ty*T-2,3,1)}
  for(const c of crates){if(!inView(c.x,c.y,20))continue;if(c.open){R(c.x,c.y+4,12,7,'#6a4220');R(c.x+1,c.y+5,10,2,'#2a1a0c');R(c.x,c.y-1,12,3,'#8a5a2c');R(c.x,c.y+7,12,1,'#b0b4bc');continue}
    R(c.x,c.y+1,12,10,'#8a5a2c');R(c.x,c.y,12,4,'#a06a34');R(c.x+1,c.y,10,1,'#c08a4c');R(c.x,c.y+4,12,1,'#5e3c1c');R(c.x+2,c.y,1,11,'#b0b4bc');R(c.x+9,c.y,1,11,'#b0b4bc');R(c.x+5,c.y+3,2,3,'#f2c84b');R(c.x+5,c.y+5,2,1,'#7a5a1a');if((frame+(c.x|0))%160<5){R(c.x+3,c.y-1,1,1,'#fff6c0')}}
  for(const p of pots){if(p.broken||!inView(p.x,p.y,20))continue;R(p.x+1,p.y+3,8,7,'#9a5a34');R(p.x+2,p.y+1,6,2,'#b06a3e');R(p.x+3,p.y,4,1,'#7a4428');R(p.x+1,p.y+5,8,1,'#d6b04a');R(p.x+2,p.y+3,1,5,'#b87a50')}
  if(shop)drawMerchant(shop.merchant);if(junk)drawJunkMerchant(junk.merchant);
  for(const n of npcs)if(inView(n.x,n.y,40))drawNpc(n);drawDogs();
  for(const p of pickups){if(!inView(p.x,p.y,20))continue;
    if(p.kind==='gold'){R(p.x,p.y+1,6,4,'#b07c20');R(p.x+1,p.y,4,4,'#f2c84b');R(p.x+1,p.y,2,1,'#fff3aa');if(p.fang)R(p.x+2,p.y-2,2,3,'#efe8dc')}
    else if(p.kind==='gem'){const G=GEMS[p.gid||4];ctx.fillStyle=hexOf(G.c[1]);ctx.beginPath();ctx.moveTo(p.x,p.y+2);ctx.lineTo(p.x+2,p.y);ctx.lineTo(p.x+5,p.y);ctx.lineTo(p.x+7,p.y+2);ctx.lineTo(p.x+3.5,p.y+6);ctx.fill();R(p.x+2,p.y+1,3,1,'#e8ffff');R(p.x+1,p.y+2,2,1,'#9af4ff')}
    else if(p.kind==='relic'){const b=Math.sin(frame*.08);R(p.x,p.y+b,8,8,'#d9a826');R(p.x+1,p.y+1+b,6,6,'#f2c84b');R(p.x+2,p.y+2+b,2,2,'#fff3c0');R(p.x+3,p.y+5+b,2,1,'#3d5fb8')}
    else if(p.kind==='fish'){const fl=Math.sin(frame*.4);ctx.fillStyle=p.col;ctx.beginPath();ctx.ellipse(p.x+4,p.y+2.5,4,2.2,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(p.x,p.y+2.5);ctx.lineTo(p.x-3,p.y+fl);ctx.lineTo(p.x-3,p.y+5-fl);ctx.fill();R(p.x+6,p.y+1.5,1,1,'#111')}
    else if(p.kind==='parrow'){ctx.save();ctx.translate(p.x+4,p.y+2);ctx.rotate(p.ang||0);R(-6,-.5,8,1,'#8a6132');R(2,-1,2,2,'#b8c0c8');R(-7,-1.5,2,1,'#e6e0d0');R(-7,.5,2,1,'#e6e0d0');ctx.restore()}
    else if(p.kind==='mat'){const c=MATS[p.mat].c,b=Math.sin(frame*.09+p.x)*.6;R(p.x,p.y+1+b,6,4,shade(c,-.35));R(p.x+1,p.y+b,4,4,c);R(p.x+1,p.y+b,2,1,shade(c,.4))}
    else if(p.kind==='disc'){const b=Math.sin(frame*.1+p.x)*.8;ctx.fillStyle='#c8ccd8';ctx.beginPath();ctx.arc(p.x+4,p.y+3+b,4,0,7);ctx.fill();ctx.fillStyle=`hsl(${(frame*4)%360},70%,70%)`;ctx.fillRect(p.x+1,p.y+1+b,3,1);ctx.fillStyle='#2a2630';ctx.beginPath();ctx.arc(p.x+4,p.y+3+b,1,0,7);ctx.fill()}
    else if(p.kind==='recipe'){const fl=Math.sin(frame*.1+p.x)*.8;R(p.x,p.y+fl,8,6,'#cfdcf0');R(p.x+1,p.y+1+fl,6,1,'#3d5fb8');R(p.x+1,p.y+3+fl,3,1,'#3d5fb8');R(p.x+5,p.y+3+fl,2,2,'#3d5fb8')}
    else if(p.kind==='lore'){const fl=Math.sin(frame*.1+p.x)*.8;if(p.cat==='paper'){R(p.x,p.y+fl,8,6,'#e8dcc0');R(p.x+1,p.y+2+fl,5,1,'#8a7a5a');R(p.x+1,p.y+4+fl,4,1,'#8a7a5a');R(p.x+6,p.y+fl,2,2,'#c9b890')}
      else{R(p.x,p.y+fl,8,6,'#f1ead8');R(p.x+1,p.y+1+fl,6,3,'#7a6a52');R(p.x+2,p.y+2+fl,2,1,'#c9b890')}}}
  for(const f of foods){if(inView(f.x,f.y,20))drawFood(f)}
  for(const g of gnats){if(!inView(g.x,g.y,20))continue;for(const d of g.d){const a=frame*d.s+d.a;ctx.fillStyle='rgba(20,18,16,.85)';ctx.fillRect(g.x+Math.cos(a)*d.r+Math.sin(a*2.3)*1.5,g.y+Math.sin(a*1.3)*d.r*.6,1,1)}}
  for(const r of rocks){if(!inView(r.x,r.y,20))continue;ctx.fillStyle='#7a7c87';ctx.beginPath();ctx.ellipse(r.x+3,r.y+2.8,3.2,2.4,0,0,7);ctx.fill();R(r.x+1,r.y+1,2,1,'#a8aab4');R(r.x+3,r.y+4,3,1,'#5a5c66')}
  for(const d of drips){if(!inView(d.x,d.y,30))continue;const j=d.st==='shake'?(Math.random()-.5)*1.6:0;const c1=d.ice?'#cfeeff':'#7a7c87',c2=d.ice?'#8cc4ea':'#5a5c66',c3=d.ice?'#ffffff':'#9a9ca6';
    ctx.fillStyle=c1;ctx.beginPath();ctx.moveTo(d.x+j,d.y);ctx.lineTo(d.x+8+j,d.y);ctx.lineTo(d.x+4+j,d.y+12);ctx.fill();ctx.fillStyle=c2;ctx.beginPath();ctx.moveTo(d.x+5+j,d.y);ctx.lineTo(d.x+8+j,d.y);ctx.lineTo(d.x+4+j,d.y+12);ctx.fill();R(d.x+2+j,d.y,1,6,c3);
    if(d.st==='shake'&&frame%4===0)parts.push({x:d.x+4,y:d.y+1,vx:rand(-.3,.3),vy:.4,life:20,max:20,col:d.ice?'#e8f8ff':'#8a8c96',g:.15,sz:1})}
  for(const f of foes){if(f.dead||!inView(f.x,f.y,24))continue;if(EXTRA_DRAW[f.type])EXTRA_DRAW[f.type](f);else if(f.type==='spider')drawSpider(f);else if(f.type==='mummy')drawMummy(f);else if(f.type==='snake')drawSnake(f);else drawWolf(f)}
  if(state!=='trans'&&state!=='menu')drawPlayer();drawTossed();
  if(P.line&&state!=='trans'){const L=P.line,tp=rodTip();ctx.strokeStyle='rgba(225,225,215,.6)';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(tp.x,tp.y);ctx.quadraticCurveTo((tp.x+L.x)/2,Math.max(tp.y,L.y)+(L.st==='fly'?0:10),L.x,L.y);ctx.stroke();
    const dip=L.st==='bite'?2+Math.sin(frame*.9):Math.sin(frame*.08)*.6;R(L.x-1.5,L.y-2+dip,3,2,'#e2483d');R(L.x-1.5,L.y+dip,3,1,'#f3ead6');
    if(L.st==='bite'){ctx.font='700 9px "Pixelify Sans", monospace';ctx.textAlign='center';ctx.fillStyle='#000';ctx.fillText('!',L.x+.5,L.y-6.5);ctx.fillStyle='#ffe08a';ctx.fillText('!',L.x,L.y-7)}}
  for(const b of bombs){ctx.fillStyle=b.fuse<40&&(b.fuse>>2)%2?'#7a1c14':'#1d1d24';ctx.beginPath();ctx.arc(b.x+3,b.y+3.5,3.5,0,Math.PI*2);ctx.fill();R(b.x+1,b.y+1,1,1,'#6b6b78');R(b.x+4,b.y-1,1,2,'#b58b4c')}
  for(const s of shots){if(drawDemonShot(s))continue;if(s.k==='arrow'||s.k==='bolt'){const a=Math.atan2(s.vy,s.vx);ctx.save();ctx.translate(s.x,s.y);ctx.rotate(a);R(-9,-.5,9,s.k==='bolt'?1.5:1,'#8a6132');R(0,-1,2,s.k==='bolt'?3:2,'#b8c0c8');if(s.k==='arrow'){R(-10,-1.5,2,1,'#e6e0d0');R(-10,.5,2,1,'#e6e0d0')}ctx.restore()}
    else R(s.x-1,s.y-.5,s.k==='bullet'?3:2,s.k==='bullet'?1:2,'#ffe7a0')}
  for(const a of arrows){const s=Math.sign(a.vx)||1;const x=a.stuck?a.sx:a.x;ctx.globalAlpha=a.stuck?Math.min(1,a.life/40):1;
    R(x-(s>0?10:0),a.y,10,1,'#8a6132');if(s>0){R(x,a.y-1,2,3,'#b8c0c8');R(x-11,a.y-1,2,1,'#e6e0d0');R(x-11,a.y+1,2,1,'#e6e0d0')}else{R(x-2,a.y-1,2,3,'#b8c0c8');R(x+9,a.y-1,2,1,'#e6e0d0');R(x+9,a.y+1,2,1,'#e6e0d0')}
    ctx.globalAlpha=1}
  for(const a of acids){R(a.x-2,a.y-2,4,4,'#8fdc2c');R(a.x-1,a.y-2,2,1,'#e0ff9e')}
  for(const f of fireballs){ctx.fillStyle='#ff6a1a';ctx.beginPath();ctx.arc(f.x+3,f.y+3,3.4,0,7);ctx.fill();ctx.fillStyle='#ffd27a';ctx.beginPath();ctx.arc(f.x+3,f.y+2.5,1.8,0,7);ctx.fill()}
  drawFish();
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(grid[idx(x,y)]!==LAVA)continue;const top=!LIQ[tileAt(x,y-1)]&&!isSolid(x,y-1);
    R(x*T,y*T+(top?3:0),T,T-(top?3:0),'#c8401a');R(x*T,y*T+(top?6:3),T,3,'#e2601e');
    if(top){const w=Math.sin(frame*.04+x*1.1);R(x*T,y*T+3+(w>0?0:1),T,2,'#ffb347');R(x*T+((frame>>3)+x*5)%14,y*T+3,2,1,'#fff1b0')}
    if(((frame>>4)+x*3+y*7)%11===0)R(x*T+(hash(x,y)%12),y*T+9,3,2,'#ff8a3a')}
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(grid[idx(x,y)]!==WATER)continue;const top=!isWater(x,y-1)&&!isSolid(x,y-1);
    ctx.fillStyle='rgba(38,104,180,.58)';ctx.fillRect(x*T,y*T+(top?3:0),T,T-(top?3:0));
    if(top){const w=Math.sin(frame*.05+x*1.3)*.5;ctx.fillStyle='rgba(150,210,255,.5)';ctx.fillRect(x*T,y*T+3+(w>0?0:1),T,1)}
    if(((frame>>3)+x*7+y*3)%29===0){ctx.fillStyle='rgba(190,230,255,.3)';ctx.fillRect(x*T+(hash(x,y)%12),y*T+8,3,1)}}
  for(const s of springs){if(s.tx<x0-1||s.tx>x1+1)continue;const top=(s.ty+1)*T,bot=fallBottom(s),x=s.tx*T+4;
    ctx.fillStyle='rgba(120,185,240,.55)';ctx.fillRect(x,top,8,bot-top);
    ctx.fillStyle='rgba(225,245,255,.6)';for(let yy=top-12+((frame*2)%12);yy<bot;yy+=12){ctx.fillRect(x+1,yy,1,6);ctx.fillRect(x+5,yy+5,1,5)}
    ctx.fillStyle='rgba(210,235,255,.4)';ctx.fillRect(x-2,bot-3,12,3);R(x-1,top,10,2,'#5a6070')}
  for(const q of parts){ctx.globalAlpha=Math.min(1,q.life/q.max*1.5);ctx.fillStyle=q.col;ctx.fillRect(q.x,q.y,q.sz,q.sz)}ctx.globalAlpha=1;

  drawSurfaceFx(x0,x1,y0,y1);
  drawAtmos(x0,x1,y0,y1);
  /* ---- lighting ---- */
  const LS=lc.width/cv.width*S;
  lx.setTransform(1,0,0,1,0,0);lx.globalCompositeOperation='source-over';
  const dark=inVoid?.99:inTent?.5:inDebug?.45:Math.min(.97,.87+level*.012+clamp((P.poison||0)/120,0,1)*.04);
  lx.fillStyle=`rgba(5,4,9,${dark})`;lx.fillRect(0,0,lc.width,lc.height);
  lx.setTransform(LS,0,0,LS,-ox*LS/S,-oy*LS/S);lx.globalCompositeOperation='destination-out';
  const hole=(x,y,r,a)=>{if(!inView(x,y,r))return;const g=lx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(.55,`rgba(0,0,0,${a*.75})`);g.addColorStop(1,'rgba(0,0,0,0)');lx.fillStyle=g;lx.fillRect(x-r,y-r,r*2,r*2)};
  // daylight from the surface and the glow falling down the shaft
  const sx0=shaft.x*T,sx1=(shaft.x+2)*T;
  if(surf){const DL=skyDL(),gy=(surf.ground+4)*T;const g=lx.createLinearGradient(0,0,0,gy);g.addColorStop(0,`rgba(0,0,0,${DL})`);g.addColorStop((surf.ground-2)*T/gy,`rgba(0,0,0,${DL})`);g.addColorStop(1,'rgba(0,0,0,0)');lx.fillStyle=g;lx.fillRect(0,0,MW*T,gy)}
  if(!inVoid){const y0s=shaft.y0*T,y1s=(shaft.y1+4)*T;const g=lx.createLinearGradient(0,y0s,0,y1s);const a0=surf?skyDL():.75;g.addColorStop(0,`rgba(0,0,0,${a0})`);g.addColorStop(1,'rgba(0,0,0,0)');lx.fillStyle=g;
    lx.beginPath();lx.moveTo(sx0,y0s);lx.lineTo(sx1,y0s);lx.lineTo(sx1+1.2*T,y1s);lx.lineTo(sx0-1.2*T,y1s);lx.fill();hole((sx0+sx1)/2,(shaft.y1+1)*T,4.5*T,surf?.8:.55)}
  const pk=clamp((P.poison||0)/120,0,1);
  if(state!=='menu'){const flick=1+Math.sin(frame*.13)*.015+Math.sin(frame*.37)*.01+(pk?Math.sin(frame*.07)*.06*pk:0);hole(pcx+P.face*3,pcy-4,P.lampR*T*flick*(1-.45*pk)*(shop&&pcx>shop.x0*T&&pcx<(shop.x0+shop.w)*T&&pcy>shop.y0*T&&pcy<(shop.y0+shop.h)*T?.55:1)*(P.dark>0?(P.dark<60?.42+.58*(1-P.dark/60):.42):1)*(level>=8?.9:1)*(inVoid?.62:1),1)}
  if(!inVoid)hole(door.x+8,door.y+12,3.4*T,.9);
  const glows=[];
  for(const n of npcs){if(n.type==='coffee'){const f=1+Math.sin(frame*.25+n.anim)*.07;hole(n.x+n.face*13,n.y-6,4.2*T*f,.95);glows.push([n.x+n.face*13,n.y-6,3*T,'rgba(255,140,50,.2)'])}else if(n.type==='knitter'||n.type==='reader'){hole(n.x-n.face*12,n.y-5,3.2*T,.85);glows.push([n.x-n.face*12,n.y-5,2.2*T,'rgba(255,180,90,.16)'])}else hole(n.x,n.y-8,2*T,.5)}
  for(const d of decos){if(d.dead)continue;const x=d.tx*T+8,y=d.ty*T+8;
    if(d.k==='ftorch'){const f=1+Math.sin(frame*.2+d.tx)*.06;hole(x,y-4,3.6*T*f,.85);glows.push([x,y-4,2.6*T,'rgba(255,150,60,.16)'])}
    else if(d.k==='torch'){const f=1+Math.sin(frame*.2+d.tx)*.06;hole(x,y,3.6*T*f,.85);glows.push([x,y,2.6*T,'rgba(255,150,60,.16)'])}
    else if(d.k==='campfire'){const f=1+Math.sin(frame*.23)*.05+Math.sin(frame*.61)*.03;hole(x,y-2,5.5*T*f,.95);glows.push([x,y-2,4*T*f,'rgba(255,130,40,.22)'])}
    else if(d.k==='tent'&&surf&&skyNow().dl<.6){hole(x+1,y+3,2.6*T,.8);glows.push([x+1,y+3,1.8*T,'rgba(255,190,90,.22)'])}
    else if(d.k==='lantern'){if(shop&&d.tx>=shop.x0&&d.tx<shop.x0+shop.w&&d.ty>=shop.y0&&d.ty<shop.y0+shop.h){const fl=.75+Math.sin(frame*.23+d.tx)*.12+(Math.random()<.03?-.3:0);hole(x,y+2,2.3*T*fl,.75);glows.push([x,y+2,1.8*T,'rgba(255,120,40,.16)'])}else{hole(x,y+2,4.5*T,.9);glows.push([x,y+2,3*T,'rgba(255,170,80,.18)'])}}
    else if(d.k==='candle'){const fl=1+Math.sin(frame*.31+d.tx)*.1;hole(x,y,1.6*T*fl,.7);glows.push([x,y,1.2*T,'rgba(255,150,60,.2)'])}
    else if(d.k==='mush'){hole(x,y+4,1.6*T,.55);glows.push([x,y+4,T,['rgba(80,230,210,.2)','rgba(150,240,100,.2)','rgba(190,130,255,.2)','rgba(80,230,210,.2)'][d.v]])}
    else if(d.k==='oldlamp'&&d.v){hole(x,y+4,2.2*T,.6);glows.push([x,y+4,1.4*T,'rgba(255,180,90,.14)'])}
    else if(d.k==='bigmush'){const c=['rgba(90,224,208,.22)','rgba(176,122,255,.22)','rgba(255,122,184,.22)'][d.v];hole(x,y-14,3.4*T,.8);glows.push([x,y-14,2.4*T,c])}
    else if(d.k==='glowworm'){hole(x,y+2,2*T,.5);glows.push([x,y+6,1.5*T,'rgba(90,210,255,.16)'])}
    else if(d.k==='glowflower'){hole(x,y+2,1.9*T,.55);glows.push([x,y+3,1.3*T,['rgba(120,230,255,.2)','rgba(255,150,220,.2)','rgba(180,255,120,.18)'][d.v%3]])}
    else if(d.k==='crys'){hole(x,y,1.8*T,.5);glows.push([x,y,1.3*T,'rgba(180,140,255,.18)'])}}
  for(const m of motes){const mx=m.x+Math.sin(frame*m.s+m.p)*m.r,my=m.y+Math.cos(frame*m.s*1.3+m.p)*m.r*.6;if((frame*m.s*3+m.p)%6<4.5){hole(mx,my,T*.7,.45);glows.push([mx,my,T*.6,'rgba(210,255,140,.22)'])}}
  for(const a of acids)hole(a.x,a.y,T*1.1,.6);
  extraLight(hole,glows);deepLight(hole,glows);voidLight(hole,glows);secretsLight(hole,glows);folkLight(hole,glows);if(junk){const m=junk.merchant,fl=1+Math.sin(frame*.27)*.07;hole(m.x+21,m.y+4,4.2*T*fl,.92);glows.push([m.x+21,m.y+4,3*T,'rgba(255,140,50,.22)'])}
  for(const f of fireballs){hole(f.x+3,f.y+3,1.8*T,.85);glows.push([f.x+3,f.y+3,1.4*T,'rgba(255,140,40,.3)'])}
  for(const q of puddles)hole(q.tx*T+8,q.ty*T-2,T*1.3,.55);
  for(const b of bombs)hole(b.x+4,b.y,T*1.2,.6);
  for(const f of flashes)hole(f.x,f.y,f.r*(f.life/f.max),1);
  for(const p of pickups)if(p.kind==='gem'||p.kind==='relic')hole(p.x+3,p.y+3,T*(p.kind==='relic'?1.6:.9),.55);
  for(const s of springs)hole(s.tx*T+8,(s.ty*T+fallBottom(s))/2,2*T,.25);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x+=2){if(grid[idx(x,y)]===LAVA&&!LIQ[tileAt(x,y-1)]){hole(x*T+8,y*T+4,2.6*T,.75);glows.push([x*T+8,y*T+4,2*T,'rgba(255,110,30,.22)'])}}
  ctx.setTransform(1,0,0,1,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(lc,0,0,cv.width,cv.height);ctx.imageSmoothingEnabled=false;drawFlash();voidOverlay();folkOverlay();drawHorror(ox,oy);
  ctx.setTransform(S,0,0,S,-ox,-oy);ctx.globalCompositeOperation='lighter';
  const glow=(x,y,r,c)=>{if(!inView(x,y,r))return;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)};
  // warm light spilling down the shaft
  if(!inVoid){const y0s=shaft.y0*T,y1s=(shaft.y1+3)*T;const g=ctx.createLinearGradient(0,y0s,0,y1s);g.addColorStop(0,surf?'rgba(255,214,150,.22)':'rgba(255,200,130,.16)');g.addColorStop(1,'rgba(255,190,120,0)');ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(sx0,y0s);ctx.lineTo(sx1,y0s);ctx.lineTo(sx1+1*T,y1s);ctx.lineTo(sx0-1*T,y1s);ctx.fill();if(!surf)glow((sx0+sx1)/2,y0s+4,3*T,'rgba(255,214,150,.25)')}
  if(state!=='menu')glow(pcx+P.face*3,pcy-6,4*T,'rgba(255,190,100,.10)');
  glow(door.x+8,door.y+12,2.5*T,'rgba(255,150,60,.16)');
  for(const g of glows)glow(g[0],g[1],g[2],g[3]);
  for(const a of acids)glow(a.x,a.y,10,'rgba(150,255,60,.35)');
  for(const q of puddles)glow(q.tx*T+8,q.ty*T-1,13,'rgba(150,255,60,.22)');
  for(const f of flashes)glow(f.x,f.y,f.r*.7*(f.life/f.max),'rgba(255,170,80,.45)');
  for(const p of pickups)if(p.kind==='relic')glow(p.x+4,p.y+4,14,'rgba(255,200,90,.3)');
  ctx.globalCompositeOperation='source-over';
  for(const f of flies){if(!inView(f.x,f.y,4))continue;const a=.5+.5*Math.sin(f.ph*3);ctx.fillStyle=`rgba(216,255,106,${a})`;ctx.fillRect(f.x,f.y,1,1);ctx.fillStyle=`rgba(216,255,106,${a*.25})`;ctx.fillRect(f.x-1,f.y-1,3,3)}
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(grid[idx(x,y)]!==DIAM)continue;const h=hash(x,y),ph=(frame+h)%110;
    if(ph<10){const a=1-Math.abs(ph-5)/5,sx=x*T+3+(h>>4)%10,sy=y*T+3+(h>>8)%10;ctx.fillStyle=`rgba(220,255,255,${a})`;ctx.fillRect(sx,sy,1,1);
      ctx.fillStyle=`rgba(140,240,255,${a*.7})`;ctx.fillRect(sx-1,sy,1,1);ctx.fillRect(sx+1,sy,1,1);ctx.fillRect(sx,sy-1,1,1);ctx.fillRect(sx,sy+1,1,1)}}
  for(const f of foes){if(f.dead||!inView(f.x,f.y,20))continue;
    if(EXTRA_DRAW[f.type]){extraEyes(f)}
    else if(f.type==='wolf'){const ex=f.face>0?f.x+f.w/2+9:f.x+f.w/2-10,ey=f.y+f.h-10;if((frame+f.anim*7|0)%200>=6){ctx.fillStyle=f.st==='chase'?'#ff6a3a':'#ffc24a';ctx.fillRect(ex,ey,1,1);ctx.fillStyle='rgba(255,170,60,.35)';ctx.fillRect(ex-1,ey-1,3,3)}}
    else if(f.type==='snake'){const up=f.st==='coil'?5:f.st==='strike'?2:0,ex=f.x+f.w/2+(f.face>0?8:-9),ey=f.y+f.h-3-up;ctx.fillStyle='rgba(255,220,80,.9)';ctx.fillRect(ex,ey,1,1)}
    else if(f.type==='mummy'){const ex=f.x+f.w/2+(f.face>0?2:-3),ey=f.y+f.h-15;ctx.fillStyle=f.st==='chase'?'rgba(200,255,110,.95)':'rgba(150,180,100,.7)';ctx.fillRect(ex,ey,1,1);ctx.fillRect(ex+(f.face>0?2:-2),ey,1,1);if(f.st==='chase'){ctx.fillStyle='rgba(200,255,110,.25)';ctx.fillRect(ex-1,ey-1,5,3)}}
    else{const hang=f.st==='hang',ex=f.x+f.w/2+(f.face>0?3:-4),ey=hang?f.y+f.h/2-.5:f.y+f.h/2;ctx.fillStyle='rgba(255,70,50,.85)';ctx.fillRect(ex,ey,1,1);ctx.fillRect(ex+(f.face>0?1:-1),ey,1,1)}}
  if(shop&&(frame%260)>6){const m=shop.merchant;ctx.fillStyle='rgba(255,210,90,.95)';ctx.fillRect(m.x+5,m.y+6,1,1);ctx.fillRect(m.x+9,m.y+6,1,1);ctx.fillStyle='rgba(255,200,90,.25)';ctx.fillRect(m.x+4,m.y+5,7,3)}
  for(const p of pickups)if(p.kind==='recipe'&&(frame+(p.x|0))%120<6){ctx.fillStyle='rgba(220,235,255,.9)';ctx.fillRect(p.x+6,p.y-1,1,1);ctx.fillRect(p.x+5,p.y,3,1)}
  for(const p of pickups)if(p.kind==='lore'&&(frame+(p.x|0))%140<6){ctx.fillStyle='rgba(255,250,230,.9)';ctx.fillRect(p.x+6,p.y-1,1,1);ctx.fillRect(p.x+5,p.y,3,1)}
  if(state==='play'&&!P.dead){
    if(mouse.seen&&mouse.inside&&!coarse){const a=mouseAim();if(a.tx!==null){ctx.strokeStyle='rgba(255,236,170,.75)';ctx.lineWidth=2/S;ctx.strokeRect(a.tx*T+.5,a.ty*T+.5,T-1,T-1)}
      const m=mouseWorld();ctx.fillStyle='rgba(255,236,170,.9)';ctx.fillRect(m.x-3,m.y,2,1);ctx.fillRect(m.x+2,m.y,2,1);ctx.fillRect(m.x,m.y-3,1,2);ctx.fillRect(m.x,m.y+2,1,2)}
    if(P.compass){const dx=door.x+8-pcx,dy=door.y+12-pcy,d=Math.hypot(dx,dy);if(d>5*T){const a=Math.atan2(dy,dx);ctx.save();ctx.translate(pcx+Math.cos(a)*22,pcy+Math.sin(a)*22);ctx.rotate(a);ctx.fillStyle='rgba(242,200,75,.85)';ctx.beginPath();ctx.moveTo(5,0);ctx.lineTo(-3,-3);ctx.lineTo(-1,0);ctx.lineTo(-3,3);ctx.fill();ctx.restore()}}
  }
  if(level>=7&&!domain&&state==='play'){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=`rgba(${level>=9?60:40},0,6,${Math.min(.16,.05+(level-7)*.035)})`;ctx.fillRect(0,0,cv.width,cv.height);ctx.setTransform(S,0,0,S,-ox,-oy)}
  if(P.trip>0&&state==='play'){const tk=clamp(P.trip/90,0,1);ctx.setTransform(1,0,0,1,0,0);if(!shimC||shimC.width!==cv.width||shimC.height!==cv.height)shimC=mk(cv.width,cv.height);
    const sg=shimC.getContext('2d');sg.clearRect(0,0,cv.width,cv.height);sg.drawImage(cv,0,0);const band=Math.max(3,Math.round(5*DPR));
    for(let yy=0;yy<cv.height;yy+=band){const off=Math.sin(frame*.05+yy*.012/DPR)*S*2.2*tk;ctx.drawImage(shimC,0,yy,cv.width,band,off,yy,cv.width,band)}ctx.setTransform(S,0,0,S,-ox,-oy)}
  if(biome==='hot'){ctx.setTransform(1,0,0,1,0,0);if(!shimC||shimC.width!==cv.width||shimC.height!==cv.height)shimC=mk(cv.width,cv.height);
    const sg=shimC.getContext('2d');sg.clearRect(0,0,cv.width,cv.height);sg.drawImage(cv,0,0);const band=Math.max(2,Math.round(3*DPR));
    for(let yy=0;yy<cv.height;yy+=band){const off=Math.sin(frame*.09+yy*.045/DPR)*Math.max(1,S*.45);ctx.drawImage(shimC,0,yy,cv.width,band,off,yy,cv.width,band)}
    ctx.fillStyle='rgba(255,110,40,.07)';ctx.fillRect(0,0,cv.width,cv.height);ctx.setTransform(S,0,0,S,-ox,-oy)}
  else{const tint={cold:'rgba(120,170,255,.07)',moss:'rgba(90,170,60,.06)',shroom:'rgba(170,90,230,.07)',void:'rgba(50,0,16,.1)',desert:'rgba(255,200,120,.06)'}[biome];if(tint){ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle=tint;ctx.fillRect(0,0,cv.width,cv.height);ctx.setTransform(S,0,0,S,-ox,-oy)}}
  ctx.setTransform(S,0,0,S,-ox,-oy);ctx.font='600 7px "Pixelify Sans", monospace';ctx.textAlign='center';
  for(const tx of texts){ctx.globalAlpha=Math.min(1,tx.life/20);ctx.fillStyle='#000';ctx.fillText(tx.txt,tx.x+.5,tx.y+.5);ctx.fillStyle=tx.col;ctx.fillText(tx.txt,tx.x,tx.y)}ctx.globalAlpha=1;
}
function drawMini(){const c=$('mini'),g=c.getContext('2d');const sc=3;c.width=MW*sc;c.height=MH*sc;g.fillStyle='#08060a';g.fillRect(0,0,c.width,c.height);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++){const i=idx(x,y);if(skyA[i]){g.fillStyle='#5a6a8a';g.fillRect(x*sc,y*sc,sc,sc);continue}if(!seen[i])continue;const tt=grid[i];
    g.fillStyle=tt===SAND?'#b8a070':tt===AIR?'#2a2226':tt===DIRT&&biome==='moss'?'#3e5a2a':tt===WATER?'#2a6ab0':tt===LAVA?'#e2601e':tt===ICE?'#a8d8f0':tt===GOLD?'#c9a23a':tt===DIAM?'#4ad6ee':tt===SHOPB?'#c4744a':tt===BRICK||tt===GLYPH?'#a8865a':tt===BED?'#141216':tt===VAULT?'#3a3e4a':tt===VDOOR?'#c8a030':'#5a5058';g.fillRect(x*sc,y*sc,sc,sc)}
  if(seen[idx(Math.floor(door.x/T),Math.floor((door.y+16)/T))]){g.fillStyle='#ffb347';g.fillRect(door.x/T*sc-1,door.y/T*sc,sc+2,sc*2)}
  if(junk&&seen[idx(junk.x0+3,junk.y0+3)]){g.fillStyle='#c8a030';g.fillRect((junk.x0+3)*sc-2,(junk.y0+2)*sc,6,6)}
  if(shop&&seen[idx(shop.x0+6,shop.y0+3)]){g.fillStyle='#3d5fb8';g.fillRect((shop.x0+6)*sc-2,(shop.y0+2)*sc,6,6)}
  g.fillStyle=(frame>>4)%2?'#fff':'#f2c84b';g.fillRect((P.x+P.w/2)/T*sc-2,(P.y+P.h/2)/T*sc-2,4,4)}
function toggleMap(){mapOn=!mapOn;$('mini').hidden=!mapOn;$('mapBtn').setAttribute('aria-pressed',String(mapOn));if(mapOn)drawMini()}

/* =========================================================== HUD */
const heartSVG=(full,pz)=>`<svg viewBox="0 0 16 15"><path d="M8 14 1.5 7.5A3.6 3.6 0 0 1 8 3a3.6 3.6 0 0 1 6.5 4.5Z" fill="${full?(pz?'#6fbf2a':'#e2483d'):'none'}" stroke="${full?(pz?'#b8f07a':'#ff8a7a'):'#6a4a4e'}" stroke-width="1.4"/></svg>`;
let hudCache='',hbCache='';
function hud(){
  const dep=curDepth(),pz=P.poison>0;
  const key=[P.hp,P.money,Math.round(P.fuel),dep,P.maxHp,LANG,pz,level,inVoid].join('|');$('lvlNum').textContent=inVoid?'???':inDebug?'DBG':inTent?'⌂':level;
  if(key!==hudCache){hudCache=key;let h='';for(let i=0;i<Math.max(4,P.maxHp,P.hp);i++)h+=heartSVG(i<P.hp,pz);$('hp').innerHTML=h;
    $('money').textContent=fmt(P.money);$('fuel').style.width=P.fuel+'%';$('depth').textContent=dep+' m'}
  const pk=clamp((P.poison||0)/120,0,1),tk=clamp((P.trip||0)/90,0,1);let flt=pk>0?`blur(${(.5+pk*1.3).toFixed(1)}px) saturate(${(1-pk*.35).toFixed(2)})`:'';if(tk>0)flt+=` hue-rotate(${Math.round(Math.sin(frame*.02)*160*tk)}deg) saturate(${(1+tk*.6).toFixed(2)})`;
  if(frame%15===0){const ch=[];if(P.haste>0)ch.push(`<span class="chip" style="background:#ffb347">${esc(t('stHaste'))} ${Math.ceil(P.haste/60)}</span>`);if(P.trip>0)ch.push(`<span class="chip" style="background:#d8a0ff">${esc(t('stTrip'))} ${Math.ceil(P.trip/60)}</span>`);if(P.poison>0)ch.push(`<span class="chip" style="background:#9be86a">${esc(t('stPoison'))} ${Math.ceil(P.poison/60)}</span>`);const st=$('status'),h=ch.join('');if(st.innerHTML!==h)st.innerHTML=h;st.hidden=!ch.length}if(cv.style.filter!==flt)cv.style.filter=flt;
  const hk=[P.stones,P.bombs,P.ropes,P.ammo,P.arrows,P.slot,P.wi,P.weapons.length,P.rod,P.pick,P.drill,Math.round(P.fuel),LANG,P.fires,P.planks,P.torches,P.souls].join('|');if(hk!==hbCache){hbCache=hk;renderHotbar()}
  const hv=$('hurt');const o=+hv.style.opacity||0;if(o>0)hv.style.opacity=Math.max(0,o-.03).toFixed(2);
  $('vign').style.opacity=P.poison>0?(Math.min(1,P.poison/90)*(.75+.25*Math.sin(frame*.12))).toFixed(2):0;
  if(mapOn&&frame%15===0)drawMini();
}
let toastTimer=0;
function showToast(big,small,kick){$('toastKick').textContent=kick||'';$('toastBig').textContent=big;$('toastSmall').textContent=small;$('toast').classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('on'),3600)}
