/*
  Arkeol v0.3.4 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
/* =========================================================== textures */
function tex(fn,seed){const c=mk(T,T),g=c.getContext('2d'),id=g.createImageData(T,T),r=mulberry32(seed);
  const px=(x,y,col)=>{x|=0;y|=0;if(x<0||y<0||x>=T||y>=T)return;const i=(y*T+x)*4;id.data[i]=col[0];id.data[i+1]=col[1];id.data[i+2]=col[2];id.data[i+3]=255};
  fn(px,r);g.putImageData(id,0,0);return c}
const vary=(c,r,a)=>{const d=(r()-.5)*2*a;return [c[0]+d,c[1]+d,c[2]+d]};
const add=(c,k)=>[c[0]+k,c[1]+k,c[2]+k];
function stoneFill(px,r,base){
  for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary(base,r,8));
  for(let k=0;k<6;k++){const bx=r()*T,by=r()*T,dk=r()<.55?-15:11;for(let j=0;j<4;j++)px(bx+(r()*3|0)-1,by+(r()*3|0)-1,vary(add(base,dk),r,3))}
  let cx=r()*T,cy=r()*T;for(let j=0;j<5;j++){px(cx,cy,add(base,-32));cx+=r()<.6?1:0;cy+=r()<.5?1:0}
}
function cluster(px,r,cols,n){for(let k=0;k<n;k++){const cx=2+r()*11|0,cy=2+r()*11|0;
  px(cx,cy,cols[0]);px(cx+1,cy,cols[0]);px(cx,cy+1,cols[1]);px(cx+1,cy+1,cols[1]);px(cx-1,cy,cols[2]);if(r()<.6)px(cx+1,cy-1,cols[0])}}
function brickFill(px,r,base,mortar){for(let y=0;y<T;y++)for(let x=0;x<T;x++){const row=y>>2,off=(row%2)*4;const m=(y%4===3)||((x+off)%8===7);px(x,y,m?vary(mortar,r,4):vary(base,r,7))}}
const STONE_C=[108,110,121], DIRT_C=[118,80,51], BED_C=[40,38,46], SAND_C=[190,152,98], GRAN_C=[72,68,80];
const TEX=[];
TEX[DIRT]=[0,1,2,3,4,5,6,7].map(v=>tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary(DIRT_C,r,7));
  for(let k=0;k<22;k++)px(r()*T,r()*T,r()<.5?[92,61,37]:[140,99,63]);
  if(r()<.8){const x=r()*13,y=r()*13;px(x,y,[128,124,118]);px(x+1,y,[110,106,100]);px(x,y+1,[96,92,88])}},100+v));
TEX[STONE]=[0,1,2,3,4,5,6,7].map(v=>tex((px,r)=>stoneFill(px,r,STONE_C),200+v));
TEX[GOLD]=[0,1,2,3].map(v=>tex((px,r)=>{stoneFill(px,r,STONE_C);cluster(px,r,[[244,203,78],[176,124,32],[255,243,170]],3)},300+v));
TEX[DIAM]=[0,1,2,3].map(v=>tex((px,r)=>{stoneFill(px,r,[92,94,106]);cluster(px,r,[[96,234,250],[28,150,196],[236,255,255]],3)},400+v));
TEX[BED]=[0,1,2,3].map(v=>tex((px,r)=>{for(let y=0;y<T;y+=2)for(let x=0;x<T;x+=2){const c=r()<.2?[60,56,68]:r()<.3?[24,22,29]:vary(BED_C,r,4);px(x,y,c);px(x+1,y,c);px(x,y+1,c);px(x+1,y+1,add(c,-4))}},500+v));
TEX[PLATE]=[0,1,2,3,4,5,6,7].map(v=>tex((px,r)=>{stoneFill(px,r,STONE_C);for(let x=2;x<14;x++)px(x,3,add(STONE_C,-17));px(2,1,add(STONE_C,-14));px(2,2,add(STONE_C,-14));px(13,1,add(STONE_C,-14));px(13,2,add(STONE_C,-14))},200+v));
function trapTex(dir){return tex((px,r)=>{const b=[86,88,98];stoneFill(px,r,b);
  for(let i=0;i<T;i++){px(i,0,add(b,18));px(0,i,add(b,14));px(i,15,add(b,-30));px(15,i,add(b,-24))}
  for(let y=4;y<12;y++)for(let x=4;x<12;x++)px(x,y,add(b,-12));
  px(6,6,[30,26,28]);px(9,6,[30,26,28]);px(7,9,[30,26,28]);px(8,9,[30,26,28]);
  const hx=dir<0?0:12;for(let y=6;y<10;y++)for(let x=hx;x<hx+4;x++)px(x,y,[12,10,12]);
},600+(dir>0?1:0))}
TEX[TRAPL]=[trapTex(-1)];TEX[TRAPR]=[trapTex(1)];
TEX[BRICK]=[0,1,2,3].map(v=>tex((px,r)=>brickFill(px,r,SAND_C,[120,92,58]),1000+v));
TEX[GLYPH]=[0,1,2,3].map(v=>tex((px,r)=>{brickFill(px,r,SAND_C,[120,92,58]);const d=[92,66,38];
  const G=[[[5,4],[6,4],[7,4],[8,5],[8,6],[7,7],[6,7],[5,6],[6,9],[6,10],[6,11],[5,10],[7,10]],
           [[4,4],[4,5],[4,6],[4,7],[5,7],[6,7],[7,7],[9,4],[10,5],[11,6],[10,7],[9,8],[9,9],[9,10]],
           [[5,4],[6,4],[7,4],[8,4],[9,4],[7,5],[7,6],[7,7],[5,9],[6,10],[7,10],[8,10],[9,9]],
           [[6,3],[7,3],[5,4],[8,4],[5,5],[8,5],[6,6],[7,6],[6,7],[7,7],[4,9],[5,9],[9,9],[10,9],[7,11]]][v];
  for(const [x,y] of G)px(x,y,d)},1100+v));
TEX[SHOPB]=[0,1,2,3].map(v=>tex((px,r)=>{brickFill(px,r,[168,112,74],[96,62,40]);if(v===0)for(let x=0;x<T;x++){px(x,7,[52,84,170]);px(x,8,[214,170,60])}},1200+v));
TEX[GRAN]=[0,1,2,3,4,5,6,7].map(v=>tex((px,r)=>{stoneFill(px,r,GRAN_C);for(let k=0;k<14;k++)px(r()*T,r()*T,r()<.5?[150,104,112]:[34,32,40]);for(let k=0;k<4;k++)px(r()*T,r()*T,[200,196,206])},1300+v));
const BG0=[0,1,2,3].map(v=>tex((px,r)=>{const b=[34,27,25];for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary(b,r,4));
  for(let k=0;k<10;k++)px(r()*T,r()*T,[26,20,19]);for(let x=0;x<T;x++)if(r()<.5)px(x,(v*5)%T,[29,23,21])},700+v));
// biome palettes: earthen (default), scorching and frozen layers share shapes but not colours
function biomeSet(dc,sc,gc,speck,seed){return {
  [DIRT]:[0,1,2,3,4,5,6,7].map(v=>tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary(dc,r,7));for(let k=0;k<22;k++)px(r()*T,r()*T,r()<.5?add(dc,-24):add(dc,20));for(let k=0;k<4;k++)px(r()*T,r()*T,speck)},seed+v)),
  [STONE]:[0,1,2,3,4,5,6,7].map(v=>tex((px,r)=>stoneFill(px,r,sc),seed+10+v)),
  [GRAN]:[0,1,2,3,4,5,6,7].map(v=>tex((px,r)=>{stoneFill(px,r,gc);for(let k=0;k<10;k++)px(r()*T,r()*T,speck);for(let k=0;k<8;k++)px(r()*T,r()*T,add(gc,-30))},seed+20+v)),
  [PLATE]:[0,1,2,3,4,5,6,7].map(v=>tex((px,r)=>{stoneFill(px,r,sc);for(let x=2;x<14;x++)px(x,3,add(sc,-17));px(2,1,add(sc,-14));px(2,2,add(sc,-14));px(13,1,add(sc,-14));px(13,2,add(sc,-14))},seed+10+v))}}
const TEXB={normal:{[DIRT]:TEX[DIRT],[STONE]:TEX[STONE],[GRAN]:TEX[GRAN],[PLATE]:TEX[PLATE]},
  hot:biomeSet([150,76,48],[98,72,68],[58,40,42],[255,150,60],2000),
  cold:biomeSet([100,98,112],[122,140,162],[72,86,108],[236,244,255],2100),
  moss:biomeSet([64,78,44],[92,108,90],[60,72,62],[150,210,90],2700),
  shroom:biomeSet([82,66,96],[92,94,120],[62,56,84],[210,150,255],2800)};
const bgSet=(b,seed)=>[0,1,2,3].map(v=>tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary(b,r,4));for(let k=0;k<10;k++)px(r()*T,r()*T,add(b,-8));for(let x=0;x<T;x++)if(r()<.5)px(x,(v*5)%T,add(b,-5))},seed+v));
TEX[ICE]=[0,1].map(v=>tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary([168,212,238],r,6));for(let k=0;k<3;k++){let x=r()*T,y=r()*T;for(let j=0;j<6;j++){px(x,y,[236,250,255]);x++;y--}}for(let k=0;k<6;k++)px(r()*T,r()*T,[120,170,214])},2200+v));
TEX[VAULT]=[0,1,2,3].map(v=>tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++){const edge=x===0||y===0,dk=x===T-1||y===T-1;px(x,y,edge?[92,98,110]:dk?[30,32,40]:vary([58,62,72],r,4))}
  for(const [x,y] of [[2,2],[13,2],[2,13],[13,13]]){px(x,y,[150,156,168]);px(x+1,y+1,[24,26,32])}if(v===1)for(let x=4;x<12;x++)px(x,8,[44,46,56])},1700+v));
TEX[VDOOR]=[0,1,2,3].map(v=>tex((px,r)=>{for(let y=0;y<T;y++)for(let x=0;x<T;x++){px(x,y,vary([74,66,52],r,4));if(x%4===0)px(x,y,[44,38,30])}
  for(let x=0;x<T;x++){px(x,0,[120,108,80]);px(x,T-1,[30,26,20])}for(let y=3;y<T;y+=6)for(let x=1;x<T;x+=4)px(x,y,[170,150,90]);px(7,7,[200,160,60]);px(8,7,[200,160,60]);px(7,8,[140,110,40]);px(8,8,[140,110,40])},1800+v));
TEX[SAND]=[0,1,2,3].map(v=>tex((px,r)=>{const b=[208,184,134];for(let y=0;y<T;y++)for(let x=0;x<T;x++)px(x,y,vary(b,r,6));for(let k=0;k<26;k++)px(r()*T,r()*T,r()<.5?[182,158,110]:[228,208,160]);for(let k=0;k<4;k++){const x=r()*T,y=r()*T;px(x,y,[150,130,96])}for(let x=0;x<T;x++)if(r()<.4)px(x,(v*4+7)%T,[196,170,122])},3300+v));
const SNOW=[0,1,2,3].map(v=>{const c=mk(T,5),g=c.getContext('2d'),r=mulberry32(2300+v);for(let x=0;x<T;x++){const h=2+(r()*3|0);for(let y=0;y<h;y++){g.fillStyle=y===0?'#ffffff':(r()<.5?'#e6f0fa':'#cfdcec');g.fillRect(x,y,1,1)}}return c});
const ASH=[0,1,2,3].map(v=>{const c=mk(T,3),g=c.getContext('2d'),r=mulberry32(2400+v);for(let x=0;x<T;x++){const h=1+(r()*2|0);for(let y=0;y<h;y++){g.fillStyle=r()<.12?'#ff8a3a':(r()<.5?'#3a2620':'#4a3028');g.fillRect(x,y,1,1)}}return c});
const BGS={normal:BG0,hot:bgSet([46,24,20],2500),cold:bgSet([24,30,42],2600),moss:bgSet([22,32,20],2900),shroom:bgSet([30,22,40],3000)};
const MOSSB=[0,1,2,3].map(v=>{const c=mk(T,6),g=c.getContext('2d'),r=mulberry32(3100+v);for(let x=0;x<T;x++){const h=3+(r()*3|0);for(let y=0;y<h;y++){g.fillStyle=y===0?'#6aa63c':(r()<.5?'#4a7a2e':'#3a6224');g.fillRect(x,y,1,1)}}return c});
const MYC=[0,1,2,3].map(v=>{const c=mk(T,4),g=c.getContext('2d'),r=mulberry32(3200+v);for(let x=0;x<T;x++){if(r()<.6){g.fillStyle=r()<.5?'#d8c8f0':'#a888d8';g.fillRect(x,0,1,1+(r()*2|0))}if(r()<.08){g.fillStyle='#f0e0ff';g.fillRect(x,0,1,1)}}return c});
const BGB=[0,1].map(v=>tex((px,r)=>brickFill(px,r,[70,52,34],[46,34,22]),1400+v));
const MOSS=[0,1,2,3].map(v=>{const c=mk(T,4),g=c.getContext('2d'),r=mulberry32(800+v);
  for(let x=0;x<T;x++){const h=1+(r()*3|0);for(let y=0;y<h;y++){g.fillStyle=y===0?'#5d7a3a':(r()<.5?'#4a6230':'#3e522a');g.fillRect(x,y,1,1)}}return c});
const GRASS=[0,1,2,3].map(v=>{const c=mk(T,6),g=c.getContext('2d'),r=mulberry32(850+v);
  for(let x=0;x<T;x++){const h=2+(r()*3|0);for(let y=0;y<h;y++){g.fillStyle=y===0?'#8ab84a':(r()<.5?'#6a9a38':'#4f7a2a');g.fillRect(x,y,1,1)}if(r()<.3){g.fillStyle='#9ac85a';g.fillRect(x,0,1,1)}}return c});
const CRACK=[1,2,3].map(st=>{const c=mk(T,T),g=c.getContext('2d'),r=mulberry32(900+st);g.fillStyle='rgba(10,8,10,.75)';
  for(let k=0;k<st*2;k++){let x=8,y=8,dx=r()<.5?-1:1,dy=r()<.5?-1:1;for(let j=0;j<3+st*2;j++){g.fillRect(x,y,1,1);x+=r()<.6?dx:0;y+=r()<.6?dy:0}}return c});
const WEB=[null,1,2,3].map(v=>{if(!v)return null;const c=mk(T,T),g=c.getContext('2d');g.strokeStyle='rgba(230,232,240,.55)';g.lineWidth=.6;
  const ox=v===2?T:0,oy=0;
  if(v===3){for(let i=0;i<5;i++){g.beginPath();g.moveTo(i*4,0);g.quadraticCurveTo(8,10,16-i*4,0);g.stroke()}g.beginPath();g.moveTo(0,4);g.quadraticCurveTo(8,14,16,4);g.stroke();g.beginPath();g.moveTo(8,0);g.lineTo(8,12);g.stroke();return c}
  for(let a=0;a<5;a++){const ang=(v===1?0:Math.PI/2)+a*Math.PI/8;g.beginPath();g.moveTo(ox,oy);g.lineTo(ox+Math.cos(ang)*17,oy+Math.sin(ang)*17);g.stroke()}
  for(let rr=4;rr<=16;rr+=4){g.beginPath();g.arc(ox,oy,rr,v===1?0:Math.PI/2,v===1?Math.PI/2:Math.PI);g.stroke()}
  return c});

/* =========================================================== icons */
function pixIcon(fn,n=16){const c=mk(n,n),g=c.getContext('2d');const p=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};fn(p,g);return c.toDataURL()}
const ICON={};
(function buildIcons(){
  const pick=(head,hl)=>p=>{for(let i=0;i<9;i++){p(3+i,13-i,1,1,'#8a5f34');p(4+i,13-i,1,1,'#5e3c1c')}
    for(const [x,y] of [[4,4],[5,3],[6,2],[7,2],[8,2],[9,3],[10,3],[11,4],[12,5],[12,6],[13,7],[13,8]])p(x,y,1,1,head);p(6,2,2,1,hl);p(12,5,1,1,hl)};
  ICON.pick=pixIcon(pick('#9aa3ad','#d6dde3'));ICON.pick2=pixIcon(pick('#43c9e6','#c8fbff'));
  const drill=(body,tip)=>p=>{p(2,6,7,5,body);p(2,6,7,1,'#c8d0d8');p(3,11,2,3,'#3a3236');p(4,8,2,1,'#d24a2e');p(9,6,2,5,tip);p(11,7,2,3,tip);p(13,8,2,1,tip);p(10,7,1,1,'#555');p(12,8,1,1,'#555')};
  ICON.drill=pixIcon(drill('#5e6670','#b9c3cc'));ICON.drill2=pixIcon(drill('#7a5a20','#f2c84b'));
  ICON.fez=pixIcon(p=>{p(5,4,6,9,'#b8322a');p(4,12,8,1,'#8a1e18');p(6,3,4,1,'#b8322a');p(10,4,1,9,'#d85a4a');p(4,4,1,6,'#1a1410');p(4,10,1,1,'#d6b04a')});
  ICON.dye=pixIcon(p=>{p(4,6,8,8,'#8a6a44');p(5,5,6,1,'#a8845a');p(6,3,4,2,'#6a4a2a');p(5,8,2,2,'#b8322a');p(8,8,2,2,'#2f4470');p(6,11,2,2,'#c99a2a');p(9,11,2,2,'#3c6a34')});
  const matIcon=(c,shape)=>pixIcon(p=>shape(p,c));
  ICON.m_fiber=pixIcon(p=>{for(let i=0;i<4;i++){p(4+i*2,3+i,1,10-i,'#5f8a40');p(5+i*2,4,1,9,'#7aa652')}p(3,11,10,2,'#c8b070')});
  ICON.m_wood=pixIcon(p=>{p(2,6,12,5,'#7a5230');p(2,6,12,1,'#9a6a3a');p(12,6,2,5,'#c49a62');p(12,7,1,3,'#8a6a44');p(4,8,5,1,'#5e3e22')});
  ICON.m_silk=pixIcon(p=>{for(let i=0;i<5;i++)p(3+i*2,3,1,10,'rgba(230,232,240,.85)');for(let j=0;j<4;j++)p(3,4+j*3,9,1,'rgba(230,232,240,.6)')});
  ICON.m_bone=pixIcon(p=>{p(4,7,8,2,'#efe8d8');p(2,6,3,2,'#efe8d8');p(2,8,3,2,'#efe8d8');p(11,6,3,2,'#efe8d8');p(11,8,3,2,'#efe8d8');p(4,9,8,1,'#c8bfa8')});
  ICON.m_scrap=pixIcon(p=>{p(3,8,6,4,'#8f99a3');p(7,5,5,4,'#6b747d');p(4,8,2,1,'#c8d0d8');p(9,10,3,2,'#a0522d');p(5,11,2,1,'#5e6670')});
  ICON.m_powder=pixIcon(p=>{p(4,9,8,4,'#d8d0c0');p(5,8,6,1,'#d8d0c0');p(6,7,4,1,'#e8e2d4');p(4,12,8,1,'#a89c86');p(7,9,1,1,'#fff')});
  ICON.m_spores=pixIcon(p=>{p(7,8,2,6,'#e8e0d0');p(4,5,8,3,'#58e0d0');p(5,4,6,1,'#7fe8d8');p(6,5,1,1,'#fff');p(3,3,1,1,'#7fe8d8');p(12,4,1,1,'#7fe8d8')});
  ICON.torch=pixIcon(p=>{p(7,7,2,8,'#5a3a20');p(6,4,4,4,'#ffb347');p(7,2,2,3,'#fff1b0')});
  ICON.ladder=pixIcon(p=>{p(4,1,2,14,'#7a5230');p(10,1,2,14,'#7a5230');for(let y=3;y<15;y+=4)p(5,y,6,2,'#9a6a3a')});
  ICON.bandage=pixIcon(p=>{p(3,5,10,6,'#efe8dc');p(3,5,10,1,'#fff');p(7,6,2,4,'#e2483d');p(6,7,4,2,'#e2483d')});
  ICON.stew=pixIcon(p=>{p(3,8,10,5,'#5e6670');p(2,7,12,2,'#7a828c');p(4,8,8,1,'#c98a4a');p(6,4,1,3,'rgba(220,220,220,.6)');p(9,3,1,3,'rgba(220,220,220,.5)')});
  ICON.meal_fried=pixIcon(p=>{p(2,9,12,3,'#5e6670');p(1,9,1,2,'#7a828c');p(14,10,2,1,'#3a3236');for(const [x,c] of [[3,'#d83a2a'],[6,'#c06a3a'],[9,'#d83a2a'],[11,'#c06a3a']]){p(x,7,3,2,c);p(x+1,6,1,1,'#efe8dc')}p(5,3,1,3,'rgba(220,220,220,.5)');p(9,2,1,3,'rgba(220,220,220,.4)')});
  ICON.meal_pie=pixIcon(p=>{p(2,8,12,5,'#c49a52');p(1,8,14,1,'#e0b870');p(3,9,10,3,'#3a3a8a');for(let x=3;x<13;x+=3)p(x,9,2,1,'#e0b870');p(4,10,1,1,'#6a6ad8');p(9,11,1,1,'#6a6ad8');p(2,13,12,1,'#8a6a3a')});
  ICON.meal_kukko=pixIcon(p=>{p(3,6,10,7,'#5a3a20');p(2,7,12,5,'#5a3a20');p(4,5,8,1,'#6b4426');p(4,6,7,1,'#8a5a30');p(5,8,3,1,'#7a4a28');p(9,10,2,1,'#7a4a28');p(3,13,10,1,'#3a2614')});
  ICON.campfireI=pixIcon(p=>{p(2,12,12,2,'#6a6c77');p(3,10,10,2,'#5a3a20');p(6,5,4,5,'#ff8a2a');p(7,3,2,3,'#ffcf5a');p(7,6,2,3,'#fff1b0')});
  ICON.coffeeI=pixIcon(p=>{p(3,6,9,8,'#3a3236');p(3,6,9,1,'#6a6470');p(12,8,2,4,'#3a3236');p(2,5,4,1,'#3a3236');p(5,2,1,3,'rgba(220,220,220,.6)');p(8,1,1,3,'rgba(220,220,220,.5)');p(5,9,5,1,'#8a5a30')});
  ICON.m_beans=pixIcon(p=>{for(const [x,y] of [[3,6],[8,4],[6,9],[10,9]]){p(x,y,4,3,'#6b3a1a');p(x+1,y+1,2,1,'#2a1408')}});
  ICON.blueprint=pixIcon(p=>{p(2,3,12,10,'#3d5fb8');p(2,3,12,1,'#6a8ad8');p(4,5,6,1,'#cfdcf0');p(4,7,4,1,'#cfdcf0');p(9,8,3,3,'#cfdcf0');p(10,9,1,1,'#3d5fb8')});
  ICON.none=pixIcon(p=>{for(let i=3;i<13;i+=2){p(i,i,1,1,'#5a4f55');p(15-i,i,1,1,'#5a4f55')}});
  ICON.whip=pixIcon((p,g)=>{g.strokeStyle='#8a5f34';g.lineWidth=1.5;g.beginPath();g.arc(9,8,4.5,0,Math.PI*1.7);g.stroke();g.beginPath();g.arc(9,8,2.2,0,Math.PI*1.8);g.stroke();p(2,11,4,2,'#4b3628');p(1,12,2,2,'#2a1e16')});
  ICON.gun=pixIcon(p=>{p(3,6,12,2,'#3d3f48');p(3,6,12,1,'#7a7e8a');p(1,7,5,4,'#7a4a24');p(1,8,2,4,'#5e3618');p(7,8,2,2,'#2a2228');p(8,8,4,1,'#3d3f48')});
  ICON.bow=pixIcon((p,g)=>{g.strokeStyle='#8a5f34';g.lineWidth=2;g.beginPath();g.arc(4,8,8,-1.2,1.2);g.stroke();g.strokeStyle='#d8d0bc';g.lineWidth=1;g.beginPath();g.moveTo(7,1);g.lineTo(7,15);g.stroke();p(3,7,11,1,'#b58b4c');p(13,6,2,3,'#b9c3cc');p(2,6,2,1,'#e6e0d0');p(2,8,2,1,'#e6e0d0')});
  ICON.xbow=pixIcon(p=>{p(1,7,12,2,'#7a4a24');p(1,8,4,4,'#5e3618');p(10,2,2,12,'#5e6670');p(10,2,2,1,'#b9c3cc');p(4,7,10,1,'#b58b4c');p(13,6,2,3,'#b9c3cc')});
  ICON.pistol=pixIcon(p=>{p(3,5,10,3,'#3d3f48');p(3,5,10,1,'#7a7e8a');p(3,8,4,6,'#5e3618');p(4,9,2,4,'#7a4a24');p(7,8,2,2,'#2a2228');p(12,4,1,1,'#7a7e8a')});
  ICON.rod=pixIcon((p,g)=>{g.strokeStyle='#8a5f34';g.lineWidth=1.3;g.beginPath();g.moveTo(2,14);g.lineTo(13,2);g.stroke();g.fillStyle='#5e6670';g.beginPath();g.arc(5,11,2,0,7);g.fill();g.strokeStyle='#d8d0bc';g.lineWidth=.6;g.beginPath();g.moveTo(13,2);g.lineTo(13,11);g.stroke();p(12,11,3,2,'#e2483d');p(12,12,3,1,'#fff')});
  ICON.arrows=pixIcon(p=>{for(let k=0;k<3;k++){for(let i=0;i<9;i++)p(3+i+k*2,13-i,1,1,'#b58b4c');p(12+k*2,3,2,2,'#b9c3cc');p(2+k*2,13,2,1,'#e6e0d0')}});
  ICON.bomb=pixIcon((p,g)=>{g.fillStyle='#1d1d24';g.beginPath();g.arc(7,9.5,5,0,7);g.fill();p(5,7,2,2,'#6b6b78');p(10,3,2,3,'#b58b4c');p(11,1,3,2,'#ffb347');p(12,1,1,1,'#fff3aa')});
  ICON.rope=pixIcon((p,g)=>{g.strokeStyle='#b58b4c';g.lineWidth=2;g.beginPath();g.ellipse(8,8,5.5,5,0,0,7);g.stroke();g.strokeStyle='#8a6532';g.lineWidth=1.4;g.beginPath();g.ellipse(8,8,2.5,2.2,0,0,7);g.stroke()});
  ICON.heart=pixIcon(p=>{const m=['.XX..XX.','XXXXXXXX','XXXXXXXX','XXXXXXXX','.XXXXXX.','..XXXX..','...XX...'];m.forEach((r,y)=>[...r].forEach((c,x)=>{if(c==='X')p(x*1.5+2,y*1.5+3,2,2,'#e2483d')}));p(4,4,2,2,'#ff9a8a')});
  ICON.fuel=pixIcon(p=>{p(3,4,10,11,'#c0392b');p(3,4,10,1,'#e8604f');p(5,2,5,2,'#7a1f16');p(11,2,2,3,'#d4d4d4');p(5,7,6,6,'#a32f22');p(6,8,4,4,'#c0392b')});
  ICON.ammo=pixIcon(p=>{for(let i=0;i<3;i++){p(3+i*4,4,3,7,'#c0392b');p(3+i*4,4,3,1,'#e8604f');p(3+i*4,11,3,3,'#d9b04a')}});
  ICON.lamp=pixIcon(p=>{p(3,7,10,4,'#e8b32c');p(2,10,12,2,'#b8861a');p(5,6,6,1,'#f3c84a');p(10,7,3,2,'#fff6c0');p(13,6,2,1,'#fff6c0');p(13,9,2,1,'#fff6c0');p(14,7,2,1,'#fff6c0')});
  ICON.spring=pixIcon(p=>{p(3,3,6,7,'#6b4426');p(3,9,10,2,'#4b2e18');for(let i=0;i<3;i++)p(4+i%2,11+i,8,1,'#b9c3cc')});
  ICON.soft=pixIcon(p=>{p(3,3,6,7,'#6b4426');p(3,9,10,2,'#4b2e18');p(2,11,12,3,'#efe8dc');p(3,11,2,1,'#fff')});
  ICON.mask=pixIcon(p=>{p(1,6,14,4,'#3d5fb8');p(3,5,4,6,'#c8f0ff');p(9,5,4,6,'#c8f0ff');p(3,5,1,1,'#fff');p(9,5,1,1,'#fff');p(7,7,2,2,'#26407e')});
  ICON.stone=pixIcon((p,g)=>{g.fillStyle='#7a7c87';g.beginPath();g.ellipse(8,9,5.5,4.5,-.3,0,7);g.fill();p(5,6,3,2,'#a8aab4');p(9,11,3,1,'#5a5c66')});
  ICON.compass=pixIcon((p,g)=>{g.fillStyle='#b8861a';g.beginPath();g.arc(8,8,6.5,0,7);g.fill();g.fillStyle='#efe4d2';g.beginPath();g.arc(8,8,5,0,7);g.fill();p(7,3,2,5,'#c0392b');p(7,8,2,5,'#3a3236');p(7,7,2,2,'#222')});
})();
