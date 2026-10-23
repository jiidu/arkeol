/*
  Arkeol v0.3.3 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
/* =========================================================== language switch */
function applyLang(){
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.innerHTML=t(el.dataset.i18n)});
  document.querySelectorAll('[data-wave]').forEach(el=>{const txt=el.textContent;el.setAttribute('aria-label',txt);el.innerHTML='';[...txt].forEach((c,i)=>{const sp=document.createElement('span');sp.textContent=c===' '?'\u00a0':c;sp.style.setProperty('--i',i);sp.setAttribute('aria-hidden','true');el.append(sp)})});
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===LANG)));
  updateBest();hudCache='';hbCache='';if(P)renderHotbar();
  if(openPanel==='archive')renderArchive(curTab);if(openPanel==='achv')renderAch();if(openPanel==='wardrobe')renderWardrobe();
}
function setLang(l){LANG=l;try{localStorage.setItem('arkeol-lang',l)}catch(e){}applyLang()}
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{ensureAudio();setLang(b.dataset.lang)}));

/* =========================================================== loop */
function step(){
  frame++;
  updSurface();
  if(state==='play'){introInput();updatePlayer();updateWorld();updTossed();updSecrets();updDeep();updVoid();if(frame%30===0)checkAch()}
  else if(state==='dead'){P.vy=Math.min(P.vy+.33,7.5);move(P);if(P.hitY)P.vy=0;P.vx*=.9;updateWorld()}
  else if(state==='menu'||state==='over'){updateWorld()}
  Music.tension+=((state==='play'?Music.target:0)-Music.tension)*.01;
  for(const k in hit)hit[k]=false;
}
let last=performance.now(),acc=0;
function loop(now){
  acc+=Math.min(100,now-last);last=now;
  const frozen=state==='pause'||state==='modal'||state==='shop'||state==='craft'||state==='term';
  try{
    if(!frozen){while(acc>=1000/60){step();acc-=1000/60}}else acc=0;
    document.body.classList.toggle('inMenu',state==='menu');
    render();if(P&&state!=='menu')hud();
  }catch(err){acc=0;if(!loop.warned){loop.warned=true;console.error(err)}try{ctx.setTransform(1,0,0,1,0,0);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}catch(e){}}
  requestAnimationFrame(loop);
}
function togglePause(){
  if(state==='play'){state='pause';$('pause').hidden=false;$('resumeBtn').focus()}
  else if(state==='pause'&&!openPanel){state='play';$('pause').hidden=true;releaseAll()}
}
function toggleMute(){muted=!muted;$('muteBtn').setAttribute('aria-pressed',String(!muted));if(muted)Ambient.set(0)}
function toggleMusic(){ensureAudio();Music.setEnabled(!Music.enabled);$('musicBtn').setAttribute('aria-pressed',String(Music.enabled))}
function toMenu(){closePanel(true);for(const id of ['over','pause','modal','shop','howto','settings','credits','license'])$(id).hidden=true;state='menu';P=newPlayer();level=1;buildLevel();$('toast').classList.remove('on');$('hint').hidden=true;$('talk').hidden=true;$('menu').hidden=false;updateBest();Music.lockUntil=0;Music.afterHero=null;Music.play('camp')}
function updateBest(){const rc=$('records');if(!store.runs){rc.hidden=true;return}rc.hidden=false;const it=(v,l)=>`<span class="rc"><b${v.length>7?' class="long"':''}>${esc(v)}</b><small>${esc(t(l))}</small></span>`;rc.innerHTML=it(store.best>0?fmt(store.best):'—','recBest')+it(store.bestDepth?store.bestDepth+' m':'—','recDepth')+it(String(store.runs),'recRuns')}
$('startBtn').addEventListener('click',newGame);
$('againBtn').addEventListener('click',newGame);
$('toMenuBtn').addEventListener('click',toMenu);
$('quitBtn').addEventListener('click',()=>{if(P)recordRun();toMenu()});
$('resumeBtn').addEventListener('click',togglePause);
$('pauseBtn').addEventListener('click',e=>{togglePause();e.currentTarget.blur()});
$('muteBtn').addEventListener('click',e=>{ensureAudio();toggleMute();e.currentTarget.blur()});
$('musicBtn').addEventListener('click',e=>{toggleMusic();e.currentTarget.blur()});
$('craftBtn').addEventListener('click',e=>{if(P&&state==='play')openCraft();else if(state==='craft')closeCraft();e.currentTarget.blur()});
$('craftClose').addEventListener('click',closeCraft);
$('mapBtn').addEventListener('click',e=>{if(P&&state==='play')toggleMap();e.currentTarget.blur()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play')togglePause()});
document.getElementById('menu').addEventListener('pointerdown',()=>ensureAudio());
$('musicVol').value=Math.round(musicVol*100);$('sfxVol').value=Math.round(sfxVol*100);$('shakeOpt').checked=shakeOn;
$('musicVol').addEventListener('input',e=>{ensureAudio();musicVol=e.target.value/100;Music.applyVol();saveSettings()});
$('sfxVol').addEventListener('input',e=>{ensureAudio();sfxVol=e.target.value/100;saveSettings();sfx.pickup()});
$('shakeOpt').addEventListener('change',e=>{shakeOn=e.target.checked;saveSettings()});

function start(data){
  P=newPlayer();level=1;buildLevel();$('toast').classList.remove('on');applyLang();
  cam.x=shaft.x*T-VW/2;cam.y=(surf?surf.ground*T:0)-VH*.45;clampCam();
  if(data&&data.alive&&data.P){newGame();level=data.level||1;Object.assign(P,data.P,{climb:null,dead:false,line:null});gemsTotal=data.gems||0;buildLevel();renderHotbar()}
  requestAnimationFrame(tt=>{last=tt;loop(tt)});
}
window.claude?.hot?.snapshot?.(()=>{const p=P?Object.assign({},P,{climb:null,line:null}):null;return {level,alive:(state==='play'||state==='pause'),P:p,gems:gemsTotal}});
const hot=window.claude?.hot;
hot?.ready?hot.ready(start):start(hot?.data??{});
