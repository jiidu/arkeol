/*
  Arkeol v0.3.4 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  junk.js – Reijo the scrap dealer, scrap weapons that wear out, fishing spots,
            the opening walk and the iris wipe between layers
*/
'use strict';
let junk=null,curShop=null,tossed=[],fishSpots={},introT=0,iris=null;

/* ------------------------------------------------ Reijo's scrap stall */
const JUNK_ITEMS=[
 {id:'spistol',n:{en:'Scrap pistol',fi:'Romupistooli'},d:{en:'Welded from a bicycle frame. Fires about ten times, then falls apart. Comes with 10 rounds.',fi:'Hitsattu polkupyörän rungosta. Laukeaa kymmenisen kertaa ja hajoaa. Mukana 10 patruunaa.'},p:450,ic:'pistol',ok:()=>!P.weapons.includes('pistol'),buy:()=>{giveWeapon('pistol');P.wdur.pistol=10;P.ammo+=10}},
 {id:'sgun',n:{en:'Scrap shotgun',fi:'Romuhaulikko'},d:{en:'Two water pipes and a lot of hope. Six shots before it gives up. Comes with 6 rounds.',fi:'Kaksi vesiputkea ja paljon toivoa. Kuusi laukausta ennen kuin se luovuttaa. Mukana 6 patruunaa.'},p:700,ic:'gun',ok:()=>!P.weapons.includes('gun'),buy:()=>{giveWeapon('gun');P.wdur.gun=6;P.ammo+=6}},
 {id:'jammo',n:{en:'Box of rounds',fi:'Patruunarasia'},d:{en:'+8 rounds. Mostly the right calibre.',fi:'+8 patruunaa. Enimmäkseen oikeaa kaliiperia.'},p:280,ic:'ammo',ok:()=>true,buy:()=>{P.ammo+=8}},
 {id:'jscrap',n:{en:'Bag of scrap',fi:'Romusäkki'},d:{en:'3 scrap and 2 wood for crafting.',fi:'3 romua ja 2 puuta käsitöihin.'},p:160,ic:'m_scrap',ok:()=>true,buy:()=>{P.mats.scrap=(P.mats.scrap||0)+3;P.mats.wood=(P.mats.wood||0)+2}},
 {id:'jfuel',n:{en:'Dented jerrycan',fi:'Lommoinen kanisteri'},d:{en:'Half a tank for the drill. Smells a bit odd.',fi:'Puoli tankkia poraan. Haisee vähän oudolta.'},p:180,ic:'fuel',ok:()=>P.hasDrill&&P.fuel<100,buy:()=>{P.fuel=Math.min(100,P.fuel+50)}},
 {id:'jdrill',n:{en:'Drill',fi:'Pora'},d:{en:'Bores through rock fast. Runs on fuel; comes with a full tank.',fi:'Poraa kiven läpi nopeasti. Kulkee bensalla, tankki täynnä.'},p:900,ic:'drill',once:true,ok:()=>!P.hasDrill,buy:()=>{P.hasDrill=true;P.fuel=100;renderHotbar()}},
 {id:'jdrill2',n:{en:'Golden drill',fi:'Kultapora'},d:{en:'Drills almost twice as fast and saves fuel.',fi:'Poraa lähes kaksi kertaa nopeammin ja säästää bensaa.'},p:2200,ic:'drill2',once:true,ok:()=>P.hasDrill&&P.drill<2,buy:()=>{P.drill=2}},
 {id:'jcoffee',n:{en:'Tin of coffee',fi:'Kahvipurkki'},d:{en:'3 portions of coffee beans for pan coffee.',fi:'3 annosta kahvipapuja pannukahveihin.'},p:140,ic:'m_beans',ok:()=>true,buy:()=>{P.mats.beans=(P.mats.beans||0)+3}},
 {id:'jplank',n:{en:'Stack of planks',fi:'Lautapino'},d:{en:'6 wooden blocks for bridges and steps.',fi:'6 puupalikkaa siltoihin ja portaisiin.'},p:90,ic:'plank',ok:()=>true,buy:()=>{P.planks=(P.planks||0)+6;renderHotbar()}},
 {id:'jhat',n:{en:'Hard hat',fi:'Kypärä'},d:{en:'From a building site by the big lake, 2008. For the wardrobe.',fi:'Järvikaupungin työmaalta, 2008. Vaatekaappiin.'},p:300,ic:'m_scrap',once:true,ok:()=>!wOwn('h:hardhat'),buy:()=>gainCosmetic('h:hardhat')}
];
const REIJO={name:'Reijo',
  hi:{en:['Well hello there. Come and look, everything works. Mostly.',"Junk? This is quality scrap, friend. Hand-picked from the finest tunnels.","They say I talk too much. I don't see it myself, but they do say it."],
      fi:['No terve terve. Tule kahtomaan, kaikki toimii. Melekeen.','Romua? Tämä on laaturomua, hyvä ystävä. Käsin valittua parhaista tunneleista.','Sanovat että minä puhun liikoja. En minä sitä huomaa, mutta niin ne sanoo.']},
  buy:{en:["There you go. If it breaks, it was already broken.",'Good choice. Throw it away when it gives up, I find them again anyway.','Sold! No refunds, no returns, no questions.'],
       fi:['Kas niin. Jos se hajoaa, se oli jo valamiiks rikki.','Hyvä valinta. Heitä pois ku se luovuttaa, minä löyvän ne kuitenni uuvestaan.','Myyty! Ei palautuksia, ei vaihtoja, ei kyssymyksiä.']},
  no:{en:["Money first, friend. Even down here.","You're a bit short. Go and dig a bit more."],fi:['Raha ensin, hyvä ystävä. Täälläi alhaalla.','Vähän jää vajjaaksi. Käy kaevamassa lissee.']}};
function drawJunkMerchant(m){const x=Math.round(m.x),y=Math.round(m.y),b=Math.sin(frame*.04)>.92?1:0;
  // oil-drum fire beside him
  R(x+17,y+8,8,10,'#5e3a24');R(x+17,y+10,8,1,'#3a2618');R(x+17,y+15,8,1,'#3a2618');const f=Math.sin(frame*.3);
  R(x+18,y+5+f*.5,6,3,'#ff8a2a');R(x+19,y+3+f,4,3,'#ffcf5a');R(x+20,y+2+f,2,2,'#fff1b0');
  if(frame%7===0)parts.push({x:x+21,y:y+2,vx:rand(-.2,.2),vy:-.6,life:22,max:22,col:'#ffcf7a',g:-.01,sz:1});
  // Reijo: overalls, flannel, cap, grey beard, wrench
  R(x+2,y+14,4,4,'#2a3a5a');R(x+8,y+14,4,4,'#2a3a5a');R(x+1,y+17,5,1,'#1a1410');R(x+8,y+17,5,1,'#1a1410');
  R(x+1,y+6+b,12,9,'#3a5a8a');R(x+1,y+6+b,12,1,'#4a6a9a');R(x+3,y+6+b,8,3,'#a03a2a');R(x+5,y+6+b,1,3,'#7a2a1e');R(x+8,y+6+b,1,3,'#7a2a1e');
  R(x+3,y-1+b,8,7,'#e0b090');R(x+3,y+3+b,8,4,'#c8c4bc');R(x+4,y+2+b,6,1,'#c8c4bc');R(x+8,y+1+b,1,1,'#1a1410');R(x+5,y+1+b,1,1,'#1a1410');R(x+6,y+4+b,2,1,'#8a6a5a');
  R(x+2,y-3+b,10,3,'#c8a030');R(x+9,y-1+b,5,1,'#a08020');R(x+3,y-3+b,8,1,'#e0c050');
  R(x+13,y+8+b,2,5,'#e0b090');R(x+13,y+5+b,2,4,'#8f99a3');R(x+12,y+4+b,4,2,'#8f99a3')}
function drawReijoPortrait(c){const g=c.getContext('2d');c.width=32;c.height=32;const p=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  p(0,0,32,32,'#2a2026');p(4,26,24,6,'#3a5a8a');p(10,26,12,4,'#a03a2a');p(8,8,16,16,'#e0b090');p(8,17,16,8,'#c8c4bc');p(10,15,12,3,'#c8c4bc');
  p(11,12,3,2,'#1a1410');p(18,12,3,2,'#1a1410');p(14,19,4,2,'#8a6a5a');p(6,4,20,6,'#c8a030');p(6,4,20,2,'#e0c050');p(20,8,9,2,'#a08020')}
function nearJunk(cx,cy){return junk&&Math.abs(junk.merchant.x+7-cx)<3*T&&Math.abs(junk.merchant.y+9-cy)<2*T}

/* ------------------------------------------------ scrap weapons wear out and get tossed */
function wearWeapon(w){if(!P.wdur||P.wdur[w]===undefined)return;P.wdur[w]--;
  if(P.wdur[w]<=2&&P.wdur[w]>0)floatText(P.x+5,P.y-8,t('creaks'),'#c7d3d9');
  if(P.wdur[w]<=0){const at=P.weapons.indexOf(w);P.weapons=P.weapons.filter(x=>x!==w);P.wi=Math.max(0,Math.min(at,P.weapons.length-1));if(!P.weapons.length&&P.slot===1)P.slot=5;
    tossed.push({x:P.x+5,y:P.y+4,vx:-P.face*2.2,vy:-3.2,rot:0,vr:-P.face*.3,life:120,k:w});sfx.knock();setTimeout(()=>sfx.knock(),200);
    floatText(P.x+5,P.y-12,t('fellApart',tr(WPN[w].n)),'#ffb0a0');renderHotbar();showSlotName()}}
function updTossed(){for(const o of tossed){o.vy=Math.min(o.vy+.25,6);o.x+=o.vx;o.y+=o.vy;o.rot+=o.vr;o.life--;
  if(isSolid(Math.floor(o.x/T),Math.floor((o.y+2)/T))){o.vy*=-.35;o.vx*=.6;o.vr*=.5;o.y-=2}}tossed=tossed.filter(o=>o.life>0)}
function drawTossed(){for(const o of tossed){ctx.save();ctx.globalAlpha=Math.min(1,o.life/30);ctx.translate(o.x,o.y);ctx.rotate(o.rot);
  if(o.k==='pistol'){R(-3,-1,7,2,'#5e6670');R(-3,0,2,3,'#6b4426')}else{R(-6,-1,11,2,'#5e6670');R(-6,0,4,3,'#6b4426')}ctx.restore()}ctx.globalAlpha=1}

/* ------------------------------------------------ fishing spots run out after a few fish */
const spotKey=(x,y)=>Math.floor(x/(4*T))+','+Math.floor(y/(3*T));
function spotLeft(x,y){const k=spotKey(x,y);if(!fishSpots[k])fishSpots[k]={n:0,max:2+Math.floor(Math.random()*3)};return fishSpots[k].max-fishSpots[k].n}
function spotCaught(x,y){spotLeft(x,y);const s=fishSpots[spotKey(x,y)];s.n++;if(s.n>=s.max)setTimeout(()=>floatText(P.x+5,P.y-10,t('fishGone'),'#c7d3d9'),700)}

/* ------------------------------------------------ opening walk: out of the tent and into the shaft */
function startAtTent(){if(!surf||!shaft)return;const tx=shaft.x-4;P.x=tx*T+3;P.y=surf.top[tx]*T-P.h-.01;P.vx=0;P.vy=0;P.face=1;P.safeFall=true;P.safeShaft=true;introT=0;cam.x=P.x-VW/2;cam.y=P.y-VH/2}
function introInput(){if(!introT)return false;introT++;for(const k in held)held[k]=false;for(const k in hit)hit[k]=false;
  const tx=(shaft.x+1)*T;
  if(introT===30)floatText(P.x+5,P.y-8,t('introSay'),'#efe4d2');
  if(introT>70&&P.x+P.w/2<tx){held.right=true;if(P.onGround&&Math.abs(P.vx)<.2&&introT>80&&introT%20===0)hit.jump=held.jump=true}
  if(P.y>surf.ground*T+2*T||introT>420)introT=0;
  return true}
function skipIntro(){if(!introT)return;introT=0;P.x=shaft.x*T+T-P.w/2;P.y=surf.ground*T+2;P.vx=0;P.vy=.5;releaseAll()}

/* ------------------------------------------------ iris wipe (a shrinking/growing circle around the hero) */
function screenPos(wx,wy){const r=cv.getBoundingClientRect(),k=r.width/VW;return {x:r.left+(wx-cam.x)*k,y:r.top+(wy-cam.y)*k}}
function irisRun(from,to,frames,wx,wy,done){iris={from,to,frames,f:0,wx,wy,done};const el=$('fade');el.classList.add('iris');
  const tick=()=>{if(!iris)return;iris.f++;const k=Math.min(1,iris.f/iris.frames),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2,r=iris.from+(iris.to-iris.from)*e;
    const p=screenPos(iris.wx,iris.wy);el.style.background=`radial-gradient(circle at ${p.x}px ${p.y}px, transparent ${Math.max(0,r)}px, #000 ${Math.max(0,r)+1.5}px)`;el.style.opacity=1;
    if(k<1)requestAnimationFrame(tick);else{const d=iris.done;iris=null;if(to>0){el.style.transition='none';el.style.opacity='0';el.classList.remove('iris');el.style.background='transparent';requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.background='';el.style.transition='';el.style.opacity=''}))}if(d)d()}};requestAnimationFrame(tick)}
const irisMax=()=>Math.hypot(innerWidth,innerHeight);
function irisClose(wx,wy,frames,done){irisRun(irisMax(),0,frames,wx,wy,done)}
function irisOpen(wx,wy,frames,done){irisRun(0,irisMax(),frames,wx,wy,done)}
