/*
  Arkeol v0.2 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
/* =========================================================== constants */
const T=16, MW=58, MH=54;
const AIR=0,DIRT=1,STONE=2,BED=3,GOLD=4,DIAM=5,PLATE=6,TRAPL=7,TRAPR=8,WATER=9,BRICK=10,GLYPH=11,SHOPB=12,GRAN=13,LAVA=14,ICE=15,SAND=16;
const HP=[0,2,4,Infinity,5,7,4,6,6,0,9,9,Infinity,7,0,3,1];
const SOL=[0,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1];
const LIQ=[0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0];
const $=id=>document.getElementById(id);
const cv=$('game'), ctx=cv.getContext('2d');
const lc=document.createElement('canvas'), lx=lc.getContext('2d');
let S=3, VW=320, VH=200, DPR=1, lastOx=0, lastOy=0;
const coarse=matchMedia('(pointer:coarse)').matches;
function resize(){
  DPR=Math.min(window.devicePixelRatio||1,3);
  const w=innerWidth,h=innerHeight;
  cv.width=Math.round(w*DPR); cv.height=Math.round(h*DPR);
  cv.style.width=w+'px'; cv.style.height=h+'px';
  lc.width=Math.ceil(cv.width/4); lc.height=Math.ceil(cv.height/4);
  S=Math.max(2,Math.round(Math.min(cv.width,cv.height)/(T*14)));
  VW=cv.width/S; VH=cv.height/S;
}
addEventListener('resize',resize); resize();

/* =========================================================== utils */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const hash=(x,y)=>{let h=Math.imul(x,374761393)+Math.imul(y,668265263)|0;h=Math.imul(h^(h>>>13),1274126177);return (h^(h>>>16))>>>0};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const rand=(a,b)=>a+Math.random()*(b-a);
const pickR=a=>a[Math.floor(Math.random()*a.length)];
const fmt=n=>'$'+Math.round(n).toLocaleString(LANG==='fi'?'fi-FI':'en-US');
function makeNoise(r){const N=64,v=new Float32Array(N*N);for(let i=0;i<v.length;i++)v[i]=r();const s=t=>t*t*(3-2*t);
  return (x,y)=>{const xi=Math.floor(x),yi=Math.floor(y),u=s(x-xi),w=s(y-yi);const g=(a,b)=>v[(b&63)*N+(a&63)];
    const a=g(xi,yi)+(g(xi+1,yi)-g(xi,yi))*u, b=g(xi,yi+1)+(g(xi+1,yi+1)-g(xi,yi+1))*u; return a+(b-a)*w}}
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* =========================================================== persistent store */
const SKEY='arkeol-v1';
let store={best:0,bestDepth:0,runs:0,ach:{},lore:{},relics:{},stats:{spiders:0,wolves:0,bombs:0,blocks:0,buys:0,fish:0,talks:0,mummies:0}};
try{const s=JSON.parse(localStorage.getItem(SKEY)||'null');if(s){store.best=s.best||0;store.bestDepth=s.bestDepth||0;store.runs=s.runs||0;store.ach=s.ach||{};store.lore=s.lore||{};store.relics=s.relics||{};Object.assign(store.stats,s.stats||{})}}catch(e){}
function save(){try{localStorage.setItem(SKEY,JSON.stringify(store))}catch(e){}}
