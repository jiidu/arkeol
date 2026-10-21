/*
  Arkeol v0.3 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
/* =========================================================== input */
const KEYMAP={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',
  Space:'jump',KeyZ:'jump',KeyX:'dig',KeyJ:'dig',KeyV:'use',KeyC:'drill',KeyK:'drill',KeyF:'weapon',KeyB:'bomb',KeyL:'bomb',KeyR:'rope',KeyI:'rope',KeyE:'act',KeyQ:'cycle',KeyG:'fish',KeyT:'throw'};
const held={}, hit={};
let useSrc='key';
const mouse={x:0,y:0,seen:false,inside:false};
function press(a){if(!held[a])hit[a]=true;held[a]=true}
function release(a){held[a]=false}
function releaseAll(){for(const k in held)held[k]=false}
addEventListener('keydown',e=>{
  ensureAudio();
  const modalOpen=!$('modal').hidden;
  if(e.code==='Tab'){e.preventDefault();if(state==='play')toggleMap();return}
  if(e.code==='Escape'){e.preventDefault();if(state==='shop')closeShop();else if(modalOpen)closeModal();else if(openPanel)closePanel();else togglePause();return}
  if(e.code==='KeyP'){togglePause();e.preventDefault();return}
  if(e.code==='KeyM'){toggleMute();return}
  if(e.code==='KeyN'){toggleMusic();return}
  if(e.code==='Enter'){if(modalOpen){closeModal();e.preventDefault()}else if((state==='menu'||state==='over')&&!openPanel){newGame();e.preventDefault()}return}
  if(modalOpen&&(e.code==='KeyE'||e.code==='Space')){closeModal();e.preventDefault();return}
  if(/^Digit[1-6]$/.test(e.code)&&state==='play'){pickSlot(+e.code[5]-1);return}
  const a=KEYMAP[e.code];if(a){if(a==='use')useSrc='key';if(['dig','drill','weapon','use','fish','bomb','rope','throw'].includes(a))inputMode='key';press(a);if(state==='play')e.preventDefault()}
});
addEventListener('keyup',e=>{const a=KEYMAP[e.code];if(a)release(a)});
addEventListener('blur',releaseAll);
cv.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){inputMode='mouse';mouse.x=e.clientX;mouse.y=e.clientY;mouse.seen=true;mouse.inside=true;mouse.t=performance.now()}});
cv.addEventListener('pointerleave',()=>{mouse.inside=false});
cv.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')inputMode='mouse';
  if(e.pointerType!=='mouse')return;ensureAudio();mouse.x=e.clientX;mouse.y=e.clientY;mouse.seen=true;mouse.inside=true;
  if(state!=='play')return;e.preventDefault();
  if(e.button===0){if(clickInteract())return;press('mdig')}
  else if(e.button===2){useSrc='mouse';press('use')}
});
addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')return;if(e.button===0)release('mdig');if(e.button===2&&useSrc==='mouse')release('use')});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('wheel',e=>{if(state!=='play')return;e.preventDefault();let n=P.slot;for(let k=0;k<6;k++){n=(n+(e.deltaY>0?1:5))%6;if(slotHas(n))break}selectSlot(n)},{passive:false});
document.querySelectorAll('#touch button').forEach(b=>{
  const a=b.dataset.act;
  b.addEventListener('pointerdown',e=>{ensureAudio();e.preventDefault();try{b.setPointerCapture(e.pointerId)}catch(_){}if(a==='use')useSrc='key';press(a);b.classList.add('on')});
  const up=()=>{release(a);b.classList.remove('on')};
  b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);
  b.addEventListener('contextmenu',e=>e.preventDefault());
});
function mouseWorld(){return {x:(mouse.x*DPR+lastOx)/S,y:(mouse.y*DPR+lastOy)/S}}
