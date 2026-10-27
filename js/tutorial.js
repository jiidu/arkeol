/*
  Arkeol v0.3.5 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  tutorial.js – the first steps of every run, written into the archaeologist's field notes.
                Each note waits until you have actually done the thing. It can be turned off in Settings.
*/
'use strict';
let tut=null;
const tutOn=()=>{try{return localStorage.getItem('arkeol-tutorial')!=='off'}catch(e){return true}};
function setTutOn(v){try{localStorage.setItem('arkeol-tutorial',v?'on':'off')}catch(e){}}
Object.assign(STR.en,{tutOpt:'Tutorial at the start of a run',tutKick:'Field notes',tutSkip:'Skip'});
Object.assign(STR.fi,{tutOpt:'Opastus pelin alussa',tutKick:'Kenttämuistiinpanot',tutSkip:'Ohita'});

const K=s=>`<kbd>${s}</kbd>`;
/* every step: text for keyboard and for touch, and a test that says when it is done */
const TUT=[
 {id:'move',en:()=>coarse?'Walk with the ◀ ▶ buttons.':`Walk with ${K('A')} ${K('D')} or ${K('←')} ${K('→')}.`,fi:()=>coarse?'Kävele ◀ ▶ -napeilla.':`Kävele ${K('A')} ${K('D')} tai ${K('←')} ${K('→')}.`,
  init:s=>{s.x0=P.x},done:s=>Math.abs(P.x-s.x0)>2.5*T},
 {id:'jump',en:()=>coarse?'Tap Jump to hop over things.':`${K('Space')} jumps. Hop over something.`,fi:()=>coarse?'Hyppää Hyppy-napilla.':`${K('Välilyönti')} hyppää. Hyppää jonkin yli.`,
  done:s=>!P.onGround&&P.vy<-2},
 {id:'shaft',en:()=>coarse?'Head to the shaft and climb down the ladder.':`Go to the shaft and climb down the ladder with ${K('S')} / ${K('↓')}.`,fi:()=>coarse?'Mene kuilulle ja kiipeä tikkaita alas.':`Mene kuilulle ja kiipeä tikkaita alas ${K('S')} / ${K('↓')}.`,
  done:()=>!surf||P.y>(surf.ground+3)*T},
 {id:'dig',en:()=>coarse?'Tap Pick to swing the pickaxe and dig.':`Swing the pickaxe with the ${K('left mouse button')} or ${K('X')}. It digs toward the cursor.`,fi:()=>coarse?'Hakku-nappi heilauttaa hakkua.':`Heilauta hakkua ${K('hiiren vasemmalla')} tai ${K('X')}. Se kaivaa kohti osoitinta.`,
  init:s=>{s.b0=store.stats.blocks||0},done:s=>(store.stats.blocks||0)>s.b0},
 {id:'loot',en:()=>'Gold, gems and old things are worth money. Walk over them to pick them up.',fi:()=>'Kulta, jalokivet ja vanhat esineet ovat rahan arvoisia. Kävele niiden yli poimiaksesi ne.',
  init:s=>{s.m0=P.money},done:s=>P.money>s.m0,wait:900},
 {id:'use',en:()=>coarse?'Use fires or places the item chosen in the bar at the bottom.':`${K('Right mouse button')} or ${K('V')} uses the item in your hotbar. ${K('1')}–${K('9')} or the wheel picks one.`,fi:()=>coarse?'Käytä-nappi käyttää alapalkista valitun esineen.':`${K('Hiiren oikea')} tai ${K('V')} käyttää pikapalkin esinettä. ${K('1')}–${K('9')} tai rulla valitsee.`,
  done:()=>hit.use,wait:480},
 {id:'act',en:()=>coarse?'Act talks to people, trades and opens doors.':`${K('E')} talks to people, trades and opens doors.`,fi:()=>coarse?'Toimi-nappi juttelee, käy kauppaa ja avaa ovia.':`${K('E')} juttelee, käy kauppaa ja avaa ovia.`,
  done:()=>hit.act,wait:420},
 {id:'craft',en:()=>coarse?'The Craft button turns what you gather into ropes, torches and more.':`${K('Q')} opens crafting. Vines, bones and wood become ropes, torches and more.`,fi:()=>coarse?'Käsityö-nappi tekee kerätystä köysiä, soihtuja ja muuta.':`${K('Q')} avaa käsityön. Köynnöksistä, luista ja puusta syntyy köysiä, soihtuja ja muuta.`,
  done:()=>state==='craft',wait:600},
 {id:'door',en:()=>coarse?'Find the glowing door to go deeper. Good luck down there.':`Find the glowing door to go deeper. ${K('Tab')} shows the map, ${K('P')} pauses. Good luck down there.`,fi:()=>coarse?'Etsi hehkuva ovi päästäksesi syvemmälle. Onnea matkaan.':`Etsi hehkuva ovi päästäksesi syvemmälle. ${K('Tab')} näyttää kartan, ${K('P')} pysäyttää. Onnea matkaan.`,
  done:()=>level>=2}
];
function tutEl(){let el=$('tut');if(el)return el;el=document.createElement('div');el.id='tut';el.setAttribute('aria-live','polite');
  el.innerHTML='<div class="tKick"><span id="tutKick"></span><button type="button" id="tutSkip"></button></div><p id="tutText"></p><div class="tBar"><i id="tutBar"></i></div>';
  document.body.appendChild(el);$('tutSkip').addEventListener('click',e=>{e.stopPropagation();endTutorial()});return el}
function startTutorial(){if(!tutOn()){endTutorial();return}tut={i:-1,s:{},t:0,doneAt:0,delay:220}}
function nextTutStep(){if(!tut)return;tut.i++;if(tut.i>=TUT.length){endTutorial();return}const st=TUT[tut.i];tut.s={};tut.t=0;tut.doneAt=0;if(st.init)st.init(tut.s);
  const el=tutEl();el.classList.remove('done');$('tutKick').textContent=`${t('tutKick')} · ${tut.i+1}/${TUT.length}`;$('tutSkip').textContent=t('tutSkip');
  $('tutText').innerHTML=(LANG==='fi'?st.fi:st.en)();$('tutBar').style.width=(tut.i/TUT.length*100)+'%';el.classList.remove('on');void el.offsetWidth;el.classList.add('on')}
function endTutorial(){tut=null;const el=$('tut');if(el){el.classList.remove('on')}}
function updTutorial(){if(!tut)return;if(tut.delay>0){if(--tut.delay===0)nextTutStep();return}const el=$('tut');if(el)el.classList.toggle('hide',state!=='play'&&state!=='craft');
  const st=TUT[tut.i];if(!st)return;tut.t++;
  if(!tut.doneAt){if(st.done(tut.s)||(st.wait&&tut.t>st.wait)){tut.doneAt=frame;el.classList.add('done');$('tutBar').style.width=((tut.i+1)/TUT.length*100)+'%';sfx.page&&sfx.page()}}
  else if(frame-tut.doneAt>50)nextTutStep()}
/* settings: a checkbox to turn the notes off (or back on) */
function syncTutOpt(){const c=$('tutOpt');if(c)c.checked=tutOn()}
(function(){const c=$('tutOpt');if(!c)return;syncTutOpt();c.addEventListener('change',()=>{setTutOn(c.checked);if(!c.checked)endTutorial()})})();
let tutCrafted=false;
{const _oc=openCraft;openCraft=function(){tutCrafted=true;return _oc.apply(this,arguments)}}
TUT.find(s=>s.id==='craft').init=()=>{tutCrafted=false};TUT.find(s=>s.id==='craft').done=()=>tutCrafted;
setInterval(()=>{const el=$('tut');if(el)el.classList.toggle('hide',!tut||!(state==='play'||state==='trans'))},150);
