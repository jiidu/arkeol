/*
  Arkeol v0.3.4 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  debug.js – a hidden test hall with doors to every layer, biome, era and the other side.
             Reached by pressing End while standing at the tent on the surface.
*/
'use strict';
let inDebug=false,DBG=null; // DBG: forced options for the next generated layer {biome, era, shop, junk, bake, dragon}

const L2=(en,fi)=>LANG==='fi'?fi:en;
function debugDoors(){const D=[];
  // hall A: every layer
  for(let n=1;n<=12;n++)D.push({hall:0,label:()=>L2('Layer ','Kerros ')+n,go:()=>goLayer(n,null)});
  // hall B: biomes and eras
  for(const [b,en,fi] of [['normal','Earth','Multa'],['hot','Hot','Kuuma'],['cold','Ice','Jää'],['moss','Moss','Sammal'],['shroom','Shrooms','Sienet']])D.push({hall:1,label:()=>L2(en,fi),go:()=>goLayer(4,{biome:b})});
  for(const [e,en,fi] of [['stone','Stone Age','Kivikausi'],['roman','Rome','Rooma'],['medieval','Middle Ages','Keskiaika'],['future','Future','Tulevaisuus'],['dino','Dinosaurs','Dinosaurukset']])D.push({hall:1,label:()=>L2(en,fi),go:()=>goLayer(5,{era:e})});
  // hall C: people, beasts and the other side
  D.push({hall:2,label:()=>L2("Sabu's shop",'Sabun kauppa'),go:()=>goLayer(3,{shop:1})});
  D.push({hall:2,label:()=>L2("Reijo's scrap",'Reijon romu'),go:()=>goLayer(3,{junk:1})});
  D.push({hall:2,label:()=>L2('Bakery','Leipomo'),go:()=>goLayer(3,{bake:1})});
  D.push({hall:2,label:()=>L2('Dragon','Lohikäärme'),go:()=>goLayer(9,{dragon:1})});
  D.push({hall:2,label:()=>L2('The other side','Toinen puoli'),go:()=>{state='play';enterVoid({tx:0,ty:0})}});
  D.push({hall:2,label:()=>L2('Back to camp','Takaisin leiriin'),go:()=>goLayer(1,null)});
  return D}

const HALLS=[8,18,28]; // ceiling row of each hall; the floor is 4 rows below
function openDebugRoom(){if(state!=='play'||inVoid)return;state='trans';sfx.door();
  irisClose(P.x+P.w/2,P.y+P.h/2,30,()=>{buildDebugRoom();state='play';irisOpen(P.x+5,P.y+8,40)})}
function buildDebugRoom(){
  resetAtmosphere();level=2;genLevel(2);inDebug=true;DBG=null;biome='normal';era=null;
  grid.fill(STONE);dmgA.fill(0);webA.fill(0);prot.fill(1);seen.fill(1);if(skyA)skyA.fill(0);
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(x<=1||y<=1||x>=MW-2||y>=MH-2)grid[idx(x,y)]=BED;
  decos=[];springs=[];foes=[];crates=[];pots=[];pickups=[];links=[];shop=null;junk=null;npcs=[];foods=[];gnats=[];drips=[];rocks=[];terms=[];vaults=[];fishes=[];
  acids=[];puddles=[];arrows=[];bombs=[];shots=[];tossed=[];fireballs=[];flies=[];parts=[];texts=[];flashes=[];levelKills=0;
  door={x:-999,y:-999,w:0,h:0};surf=null;
  // three halls joined by a ladder shaft on the right, with a little light shaft above the entrance
  for(const top of HALLS){for(let y=top;y<top+4;y++)for(let x=3;x<MW-3;x++)grid[idx(x,y)]=AIR;for(let x=3;x<MW-3;x++)grid[idx(x,top+4)]=BRICK}
  for(let y=HALLS[0];y<HALLS[2]+4;y++)for(const x of [MW-6,MW-5])grid[idx(x,y)]=AIR;
  for(let y=2;y<HALLS[0];y++)for(const x of [4,5])grid[idx(x,y)]=AIR;
  shaft={x:4,y0:2,y1:HALLS[0]-1};
  ropes=[{tx:MW-6,top:HALLS[0],len:HALLS[2]+4-HALLS[0],cur:HALLS[2]+4-HALLS[0],head:HALLS[0]*T,lad:true}];
  // doors, spaced along each hall, with torches between them
  const D=debugDoors();for(let h=0;h<3;h++){const list=D.filter(d=>d.hall===h),gap=Math.floor((MW-16)/list.length);
    list.forEach((d,i)=>{const tx=8+i*gap,fy=HALLS[h]+3;decos.push({tx,ty:fy,k:'ddoor',sx:0,sy:1,dd:d});if(i%2===0)decos.push({tx:tx+Math.floor(gap/2),ty:fy,k:'ftorch',sx:0,sy:1})})}
  P.x=4*T+8;P.y=(HALLS[0]+4)*T-P.h-.01;P.vx=P.vy=0;P.peak=P.y;P.climb=null;P.safeFall=true;P.hp=Math.max(P.hp,P.maxHp);P.line=null;
  cam.x=P.x-VW/2;cam.y=P.y-VH/2;clampCam();
  showToast('DEBUG',L2('Doors to every layer, biome and dimension','Ovet kaikkiin kerroksiin, maailmoihin ja ulottuvuuksiin'),L2('Hidden hall','Salainen halli'));
  Music.play(levelTrack())}
function goLayer(n,opts){state='trans';sfx.door();
  irisClose(P.x+P.w/2,P.y+P.h/2,30,()=>{inDebug=false;DBG=opts;level=n;buildLevel();DBG=null;state='play';cam.x=P.x+5-VW/2;cam.y=P.y+20-VH/2;
    renderHotbar();if(level===1)startAtTent();irisOpen(P.x+5,P.y+20,40)})}
function nearTent(){if(!P||level!==1||!surf)return false;const cx=P.x+P.w/2;return decos.some(d=>d.k==='tent'&&Math.abs(d.tx*T+8-cx)<2.5*T&&Math.abs(d.ty*T-P.y)<3*T)}
function debugHint(p,cx){if(!inDebug)return '';const cy=p.y+p.h/2;
  for(const d of decos){if(d.k!=='ddoor')continue;if(Math.abs(d.tx*T+8-cx)<T&&Math.abs(d.ty*T-cy)<1.6*T){if(hit.act||hit.up)d.dd.go();return (coarse?'':'E / W: ')+d.dd.label()}}
  return ''}
function drawDebugDoor(d){const x=d.tx*T,y=d.ty*T-8;
  R(x-3,y-3,22,27,'#3a3f52');R(x-3,y-3,22,1,'#5a6078');R(x,y,16,24,'#120e1a');
  const pulse=.6+.4*Math.sin(frame*.05+d.tx);ctx.fillStyle=`rgba(120,200,255,${.35*pulse})`;ctx.fillRect(x+2,y+2,12,22);ctx.fillStyle=`rgba(220,240,255,${.35*pulse})`;ctx.fillRect(x+5,y+7,6,17);
  ctx.font='6px "Pixelify Sans", monospace';ctx.textAlign='center';const lb=d.dd.label();ctx.fillStyle='#000';ctx.fillText(lb,x+8.5,y-6.5);ctx.fillStyle='#cfe8ff';ctx.fillText(lb,x+8,y-7);ctx.textAlign='left'}
