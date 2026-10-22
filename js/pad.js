/*
  Arkeol v0.3.2 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  pad.js – Xbox-style controller support (standard gamepad mapping)
*/
'use strict';
const PAD={on:false,prev:[],held:{},aim:null,nav:0};
function padToast(txt){const el=document.createElement('div');el.className='achT';el.innerHTML=`<small>🎮︎</small><b>${esc(txt)}</b>`;$('achs').appendChild(el);setTimeout(()=>el.remove(),2600)}
addEventListener('gamepadconnected',()=>{PAD.on=true;padToast(t('padOn'))});
addEventListener('gamepaddisconnected',()=>{PAD.on=false;for(const a in PAD.held)if(PAD.held[a])release(a);PAD.held={};PAD.aim=null;padToast(t('padOff'))});
function padFocusables(){const scr=[...document.querySelectorAll('.screen:not([hidden])')].pop();if(!scr)return [];
  return [...scr.querySelectorAll('button,input,[tabindex]')].filter(el=>!el.disabled&&el.offsetParent!==null&&!el.closest('[hidden]'))}
function padNav(d){const els=padFocusables();if(!els.length)return;let i=els.indexOf(document.activeElement);i=i<0?0:(i+d+els.length)%els.length;els[i].focus()}
function pollPad(){
  const gps=navigator.getGamepads?navigator.getGamepads():[];let gp=null;for(const g of gps)if(g&&g.connected){gp=g;break}
  if(gp){
    const B=i=>!!(gp.buttons[i]&&(gp.buttons[i].pressed||gp.buttons[i].value>.5)),E=i=>B(i)&&!PAD.prev[i];
    const ax=gp.axes[0]||0,ay=gp.axes[1]||0,rx=gp.axes[2]||0,ry=gp.axes[3]||0,dz=.35;
    const L=B(14)||ax<-dz,Rt=B(15)||ax>dz,U=B(12)||ay<-.55,D=B(13)||ay>.55;
    if(Math.hypot(rx,ry)>.45)PAD.aim=Math.atan2(ry,rx);else PAD.aim=null;
    if(state==='play'){
      if(gp.buttons.some(b=>b&&b.pressed)||Math.hypot(ax,ay)>dz){inputMode='key';useSrc='key'}
      const map={left:L,right:Rt,up:U,down:D,jump:B(0),act:B(1),dig:B(2),use:B(3)||B(7),bomb:B(6),rope:B(11)};
      for(const [a,v] of Object.entries(map)){if(v&&!PAD.held[a]){ensureAudio();press(a)}else if(!v&&PAD.held[a])release(a);PAD.held[a]=v}
      if(E(4))stepSlot(-1);if(E(5))stepSlot(1);if(E(10))toggleMap();if(E(8))openCraft();if(E(9))togglePause();
    }else{
      for(const a in PAD.held)if(PAD.held[a]){release(a);PAD.held[a]=false}
      const ud=U?-1:D?1:L?-1:Rt?1:0;
      if(ud){if(PAD.nav<=0){padNav(ud);PAD.nav=PAD.nav<0?7:16}else PAD.nav--}else PAD.nav=-1;
      if(E(0)){ensureAudio();const a=document.activeElement;if(a&&a!==document.body&&a.click)a.click();else if(state==='menu')newGame();else padNav(1)}
      if(E(1))dispatchEvent(new KeyboardEvent('keydown',{code:'Escape',key:'Escape'}));
      if(E(9)){if(state==='menu'&&!openPanel)newGame();else if(state==='pause')togglePause();else if(state==='over')newGame()}
      if(E(8)&&state==='craft')closeCraft();
    }
    PAD.prev=gp.buttons.map(b=>!!(b&&(b.pressed||b.value>.5)));
  }
  requestAnimationFrame(pollPad)}
requestAnimationFrame(pollPad);
