/*
  Arkeol v0.3 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
/* =========================================================== audio */
let AC=null, muted=false;
let musicVol=.7,sfxVol=1,shakeOn=true;
try{const st=JSON.parse(localStorage.getItem('arkeol-settings')||'null');if(st){musicVol=st.music??.7;sfxVol=st.sfx??1;shakeOn=st.shake??true}}catch(e){}
function saveSettings(){try{localStorage.setItem('arkeol-settings',JSON.stringify({music:musicVol,sfx:sfxVol,shake:shakeOn}))}catch(e){}}
/* a tunnel echo every sound effect passes through */
const Echo={in:null,init(){if(this.in||!AC)return;this.in=AC.createGain();this.in.gain.value=.4;
  const mk2=(dt,fb,cut)=>{const d=AC.createDelay(1);d.delayTime.value=dt;const g=AC.createGain();g.gain.value=fb;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=cut;d.connect(f).connect(g).connect(d);this.in.connect(d);const o=AC.createGain();o.gain.value=.55;f.connect(o).connect(AC.destination);return o};
  mk2(.19,.36,1700);mk2(.31,.28,1100);},
  wet(v){if(this.in)this.in.gain.setTargetAtTime(v,AC.currentTime,.5)}};
function ensureAudio(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){AC=null}}if(AC&&AC.state==='suspended')AC.resume().catch(()=>{});if(AC){Music.init();Ambient.init();Echo.init()}}
function tone(f,d,type,vol,slide){if(!AC||muted)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type=type||'square';o.frequency.setValueAtTime(f,t);
  if(slide)o.frequency.linearRampToValueAtTime(Math.max(30,f+slide),t+d);g.gain.setValueAtTime(Math.max(.0001,(vol||.05)*sfxVol),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d+.02)}
let NB=null;
function noiseBuf(){if(!NB){NB=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const a=NB.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}return NB}
function noise(d,vol,freq,type){if(!AC||muted)return;const t=AC.currentTime,s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();f.type=type||'lowpass';f.frequency.value=freq||1200;
  g.gain.setValueAtTime(Math.max(.0001,vol*sfxVol),t);g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(f).connect(g).connect(AC.destination);if(Echo.in)g.connect(Echo.in);s.start(t,Math.random()*1.5);s.stop(t+d+.02)}
const sfx={
  jump:()=>tone(420,.09,'square',.035,260), dig:()=>noise(.06,.12,1600), brk:()=>{noise(.14,.16,800);tone(110,.1,'triangle',.05,-40)},
  gold:()=>{tone(988,.06,'triangle',.06);setTimeout(()=>tone(1319,.1,'triangle',.06),55)},
  gem:()=>{tone(1319,.07,'triangle',.07);setTimeout(()=>tone(1760,.08,'triangle',.06),60);setTimeout(()=>tone(2637,.14,'sine',.05),120)},
  relic:()=>{[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.35,'triangle',.06),i*110))},
  page:()=>{noise(.25,.06,3500,'highpass');setTimeout(()=>noise(.15,.04,4000,'highpass'),120)},
  hurt:()=>{tone(200,.22,'sawtooth',.08,-130);noise(.1,.1,600)}, boom:()=>{noise(.8,.45,380);tone(70,.5,'sine',.2,-40)},
  spit:()=>tone(330,.14,'sawtooth',.03,-220), hiss:()=>noise(.25,.05,3000), arrow:()=>{tone(1500,.03,'square',.04);noise(.12,.08,4000)},
  thunk:()=>noise(.05,.1,700), rope:()=>tone(220,.18,'triangle',.05,220), door:()=>{tone(330,.12,'triangle',.06);setTimeout(()=>tone(494,.12,'triangle',.06),110);setTimeout(()=>tone(659,.2,'triangle',.06),220)},
  drill:()=>noise(.05,.05,2600), crate:()=>{tone(523,.07,'square',.04);setTimeout(()=>tone(784,.1,'square',.04),70)},
  squish:()=>{noise(.12,.1,900);tone(160,.12,'square',.04,-80)}, fuse:()=>noise(.02,.02,5000), click:()=>tone(1800,.03,'square',.035),
  bow:()=>{tone(220,.12,'triangle',.05,-120);noise(.06,.06,3000,'highpass')}, xbow:()=>{tone(140,.08,'square',.05,-60);noise(.1,.1,2500)}, pistol:()=>{noise(.18,.28,2000);tone(160,.1,'square',.06,-90)},
  plop:()=>tone(300,.12,'sine',.07,-180), cast:()=>{noise(.15,.05,5000,'highpass');tone(900,.12,'sine',.02,-500)}, reel:()=>{for(let i=0;i<4;i++)setTimeout(()=>tone(1200,.02,'square',.02),i*45)}, talk:()=>{tone(520,.06,'triangle',.03);setTimeout(()=>tone(440,.08,'triangle',.03),70)},
  pot:()=>{noise(.18,.14,2200);tone(700,.05,'square',.03,-300)}, cut:()=>noise(.08,.06,5000,'highpass'), whip:()=>{noise(.07,.12,5000,'highpass');tone(1200,.05,'square',.02,-800)},
  shot:()=>{noise(.35,.35,1400);tone(90,.2,'square',.08,-50)}, splash:()=>noise(.3,.09,1100,'bandpass'), buy:()=>{tone(784,.08,'triangle',.06);setTimeout(()=>tone(1175,.16,'triangle',.06),80)},
  nope:()=>tone(160,.15,'square',.04), ach:()=>{[659,880,1175].forEach((f,i)=>setTimeout(()=>tone(f,.22,'triangle',.05),i*90))},
  growl:()=>{tone(90,.35,'sawtooth',.06,30);noise(.3,.05,500)}, bubble:()=>tone(600+Math.random()*400,.06,'sine',.02,300), land:()=>{noise(.18,.14,500);tone(80,.12,'sine',.08,-30)},
  howl:()=>{if(!AC||muted)return;const t=AC.currentTime,o=AC.createOscillator(),v=AC.createOscillator(),vg=AC.createGain(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(360,t);o.frequency.linearRampToValueAtTime(620,t+.5);o.frequency.linearRampToValueAtTime(540,t+1.3);o.frequency.linearRampToValueAtTime(420,t+1.7);
    v.frequency.value=6;vg.gain.value=9;v.connect(vg).connect(o.frequency);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.05*sfxVol+.0001,t+.3);g.gain.linearRampToValueAtTime(.0001,t+1.8);o.connect(g).connect(AC.destination);if(Music.rev)g.connect(Music.rev);o.start(t);v.start(t);o.stop(t+1.9);v.stop(t+1.9)},
  groan:(vv=1)=>{if(!AC||muted)return;const t0=AC.currentTime,g=AC.createGain(),f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=4;f.frequency.setValueAtTime(380,t0);f.frequency.linearRampToValueAtTime(720,t0+.6);f.frequency.linearRampToValueAtTime(280,t0+1.6);
    g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(.14*vv*sfxVol+.0001,t0+.25);g.gain.linearRampToValueAtTime(.0001,t0+1.8);f.connect(g);g.connect(AC.destination);if(Music.rev)g.connect(Music.rev);
    for(const [fr,d] of [[68,0],[71,8],[102,-6]]){const o=AC.createOscillator();o.type='sawtooth';o.frequency.setValueAtTime(fr,t0);o.frequency.linearRampToValueAtTime(fr*.8,t0+1.7);o.detune.value=d;const lfo=AC.createOscillator(),lg=AC.createGain();lfo.frequency.value=7;lg.gain.value=22;lfo.connect(lg).connect(o.detune);o.connect(f);o.start(t0);lfo.start(t0);o.stop(t0+1.9);lfo.stop(t0+1.9)}
    const s=AC.createBufferSource();s.buffer=noiseBuf();const nf=AC.createBiquadFilter();nf.type='bandpass';nf.frequency.value=900;const ng=AC.createGain();ng.gain.setValueAtTime(.05*vv*sfxVol+.0001,t0);ng.gain.linearRampToValueAtTime(.0001,t0+1.6);s.connect(nf).connect(ng).connect(AC.destination);s.start(t0);s.stop(t0+1.7)},
  snakeHiss:()=>{noise(.7,.09,5200,'highpass');noise(.5,.04,2600,'bandpass')}, whoosh:()=>{noise(.25,.07,900,'bandpass');tone(180,.2,'triangle',.03,140)},
  step:(ft)=>{if(!AC||muted)return;const t0=AC.currentTime,s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();f.type='bandpass';
    const soft=ft===DIRT,ice=ft===ICE,brick=ft===BRICK||ft===GLYPH||ft===SHOPB;f.frequency.value=(ice?3200:soft?520:brick?1500:1100)*(.9+Math.random()*.2);f.Q.value=soft?.8:1.7;
    g.gain.setValueAtTime((soft?.09:.12)*sfxVol+.0001,t0);g.gain.exponentialRampToValueAtTime(.0001,t0+(soft?.09:.06));s.connect(f).connect(g);g.connect(AC.destination);if(Echo.in)g.connect(Echo.in);s.start(t0,Math.random()*1.5);s.stop(t0+.12);
    const o=AC.createOscillator(),og=AC.createGain();o.type='sine';o.frequency.setValueAtTime(soft?90:150,t0);o.frequency.exponentialRampToValueAtTime(48,t0+.07);og.gain.setValueAtTime(.05*sfxVol+.0001,t0);og.gain.exponentialRampToValueAtTime(.0001,t0+.08);o.connect(og);og.connect(AC.destination);if(Echo.in)og.connect(Echo.in);o.start(t0);o.stop(t0+.1)},
  spiderCharge:()=>{tone(420,.55,'sawtooth',.014,520);for(let i=0;i<5;i++)setTimeout(()=>noise(.02,.03,4200,'highpass'),i*90)},
  heartbeat:()=>{tone(62,.16,'sine',.16,-14);setTimeout(()=>tone(56,.2,'sine',.12,-12),170)},
  ambDrip:()=>{const n=1+(Math.random()*3|0);for(let i=0;i<n;i++)setTimeout(()=>tone(1500+Math.random()*500,.09,'sine',.03,-700),i*(600+Math.random()*700))},
  ambRumble:()=>{noise(2.6,.09,120);noise(1.8,.04,260);shake=Math.max(shake,2.5);if(P)for(let k=0;k<10;k++)parts.push({x:cam.x+Math.random()*VW,y:cam.y+rand(0,VH*.3),vx:0,vy:rand(.2,.6),life:80,max:80,col:'#8a7a6a',g:.04,sz:1})},
  ambPebbles:()=>{const n=4+(Math.random()*5|0);let tt=0;for(let i=0;i<n;i++){tt+=40+Math.random()*120;setTimeout(()=>tone(500+Math.random()*700,.03,'square',.012,-200),tt)}},
  ambGust:()=>{if(!AC||muted)return;const t0=AC.currentTime,s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();s.loop=true;f.type='bandpass';f.Q.value=6;f.frequency.setValueAtTime(260,t0);f.frequency.linearRampToValueAtTime(620,t0+1.4);f.frequency.linearRampToValueAtTime(300,t0+3);g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(.06*sfxVol+.0001,t0+1.2);g.gain.linearRampToValueAtTime(.0001,t0+3.1);s.connect(f).connect(g).connect(AC.destination);if(Echo.in)g.connect(Echo.in);s.start(t0);s.stop(t0+3.2)},
  ambWhisper:()=>{if(!AC||muted)return;const t0=AC.currentTime;for(let i=0;i<3;i++){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();f.type='bandpass';f.Q.value=9;const st=t0+i*.35;f.frequency.setValueAtTime(900+Math.random()*1200,st);f.frequency.linearRampToValueAtTime(600+Math.random()*900,st+.3);g.gain.setValueAtTime(.0001,st);g.gain.linearRampToValueAtTime(.05*sfxVol+.0001,st+.08);g.gain.linearRampToValueAtTime(.0001,st+.34);s.connect(f).connect(g).connect(AC.destination);if(Echo.in)g.connect(Echo.in);s.start(st,Math.random());s.stop(st+.4)}},
  ambLava:()=>{for(let i=0;i<4;i++)setTimeout(()=>tone(90+Math.random()*60,.12,'sine',.05,60),i*(120+Math.random()*160))},
  ambIce:()=>{noise(.08,.1,6000,'highpass');tone(2400,.15,'triangle',.02,-1600);setTimeout(()=>noise(.4,.03,3000,'highpass'),90)},
  eat:()=>{tone(300,.08,'square',.03,-80);setTimeout(()=>tone(260,.08,'square',.03,-60),90)}, buzz:()=>{tone(210,.5,'sawtooth',.006,15)},
  sandLand:()=>noise(.12,.03,900),
  creak:()=>{tone(85,.45,'sawtooth',.035,35);noise(.35,.05,700)}, crash:()=>{noise(.35,.2,1500);tone(140,.15,'triangle',.06,-60)}, pickup:()=>{tone(520,.05,'square',.035);setTimeout(()=>tone(700,.05,'square',.03),40)}, throwS:()=>noise(.08,.07,3500,'highpass'), knock:()=>{tone(260,.05,'square',.04,-120);noise(.05,.08,1200)}, sizzle:()=>noise(.4,.08,2400,'highpass')
};

/* =========================================================== music: four generative pieces
   theme    – title screen: an original heroic march (brass-like lead, strings, timpani, snare)
   cave     – A minor ambient: pads, sparse pentatonic plucks through delay
   desert   – D hijaz: drone, oud-like plucks and a frame-drum groove
   campfire – D major lullaby: music-box arpeggios and soft bass
   In-game tracks add a heartbeat layer when enemies are close. */
const mtof=m=>440*Math.pow(2,(m-69)/12);
const TRACKS={
  theme:{bpm:72,step(t,b,M){const E=M.eighth;
      // D minor, two bars per chord: Dm · Bb · Gm · A
      const CH=[[50,57,62,65],[46,53,58,62],[43,50,55,58],[45,52,57,61]];
      const ci=Math.floor(b/16)%4,pos=b%16;
      if(pos===0){M.pad(t,CH[ci],E*16,'sawtooth',.009,900);M.pad(t,CH[ci].slice(1).map(n=>n+12),E*16,'sine',.012,2200);M.bassN(t,CH[ci][0]-12,E*16,.06,true)}
      if(b%64===0)M.bassN(t,26,E*64,.04,true);
      if(b%64===56)for(let k=0;k<8;k++)M.timp(t+k*E/2,38,.02+k*.012);
      if(pos===0&&ci===0)M.timp(t,38,.14);
      const arp=[0,1,2,3,2,3,1,2];if(Math.random()<.55)M.harp(t,CH[ci][arp[b%8]]+12+(b%16>=8?12:0));
      if(b%32===0)M.wind(t,E*30);
      // the ocarina melody plays every other pass, leaving room for the harp to breathe
      const MEL=[[62,4],[65,2],[69,2],[70,6],[69,2],[67,4],[65,2],[64,2],[62,8],[0,4],[57,2],[60,2],[62,4],[65,4],[64,6],[60,2],[62,8]];
      if(Math.floor(b/64)%2===0){let acc=0;for(const [n,d] of MEL){if(b%64===acc&&n)M.flute(t,n+(Math.floor(b/128)%2?0:12),E*d*.96);acc+=d}}
      if(Math.random()<.015)M.bell(t,pickR([86,89,93]))},
    tension:false},
  cave:{bpm:68,step(t,b,M){const E=M.eighth;
      const CH=[[57,64,71,72,76],[53,60,67,69,76],[50,57,65,69,72],[52,59,67,71,74]],BASS=[33,29,26,28];
      if(b%32===0){const ci=(b/32)%4;M.pad(t,CH[ci].slice(1),E*32,'triangle',.022,900+M.tension*1400);M.bassN(t,BASS[ci]+12,E*32,.06,true)}
      if(b%2===0&&Math.random()<.28+M.tension*.4)M.pluck(t,[69,72,74,76,79,81,84],'triangle',.045,1.5);
      if(Math.random()<.02)M.bell(t,pickR([81,84,88]))},
    tension:true},
  desert:{bpm:84,step(t,b,M){const E=M.eighth;
      const CH=[[50,54,57,62],[51,55,58,63],[50,54,57,62],[48,51,55,60]];
      if(b%32===0){const ci=(b/32)%4;M.pad(t,CH[ci],E*32,'triangle',.016,800+M.tension*1000);M.bassN(t,38,E*32,.05,true)}
      const p=b%8;if(p===0||p===5)M.doum(t,.16);if(p===3||p===6||(p===7&&Math.random()<.5))M.tek(t,.05);
      const HJ=[62,63,66,67,69,70,72,74,75,78];
      if(b%16===0){M.motif=[];let i=2+(Math.random()*3|0);for(let k=0;k<8;k++){i=clamp(i+(Math.random()*5|0)-2,0,HJ.length-1);M.motif.push(Math.random()<.7?HJ[i]:0)}}
      if(b%2===0&&M.motif){const n=M.motif[(b%16)/2];if(n&&Math.random()<.7+M.tension*.2)M.oud(t,n)}},
    tension:true},
  frost:{bpm:56,step(t,b,M){const E=M.eighth;
      const CH=[[52,59,64,66,71],[48,55,60,64,67],[50,57,62,66,69],[47,54,59,62,66]];
      if(b%32===0){const ci=(b/32)%4;M.pad(t,CH[ci].slice(1).map(n=>n+12),E*32,'sine',.018,2400);M.bassN(t,CH[ci][0],E*32,.05,true)}
      if(b%2===0&&Math.random()<.22+M.tension*.4)M.pluck(t,[76,79,81,83,86,88,91],'sine',.035,2.2);
      if(Math.random()<.05)M.bell(t,pickR([88,91,93,95]))},
    tension:true},
  grove:{bpm:64,step(t,b,M){const E=M.eighth;
      const CH=[[52,59,62,66,71],[45,52,57,61,64],[52,59,62,66,69],[50,57,62,66,69]];
      if(b%32===0){const ci=(b/32)%4;M.pad(t,CH[ci].slice(1),E*32,'triangle',.018,1100);M.bassN(t,CH[ci][0],E*32,.05,true)}
      if(b%2===0&&Math.random()<.3+M.tension*.35)M.pluck(t,[64,66,67,69,71,73,74,76],'triangle',.04,1.3);
      if(b%8===4&&Math.random()<.4)M.harp(t,pickR([76,78,81,83]))},
    tension:true},
  spore:{bpm:54,step(t,b,M){const E=M.eighth;
      const CH=[[53,60,64,69,71],[50,57,62,64,69],[55,62,66,69,74],[52,59,64,67,71]];
      if(b%32===0){const ci=(b/32)%4;M.pad(t,CH[ci].slice(1).map(n=>n+12),E*32,'sine',.02,1800);M.bassN(t,CH[ci][0],E*32,.045,true)}
      if(b%2===0&&Math.random()<.32+M.tension*.3)M.box(t,pickR([77,79,81,83,84,86,88]));
      if(Math.random()<.03)M.bell(t,pickR([89,91,95]))},
    tension:true},
  // ---- run start: an original heroic march, played once (~17 s) before the level music
  hero:{bpm:112,step(t,b,M){const E=M.eighth;if(b>=72)return;
      // D · D · G · A · D · Bb · A · D – a fanfare motif stated twice, the second time climbing to the high D
      const CH=[[50,57,62,66],[50,57,62,66],[43,55,59,62],[45,52,57,61],[50,57,62,66],[46,53,58,62],[45,52,57,61],[50,57,62,66]];
      const bar=Math.floor(b/8),p=b%8;
      if(bar<8){const c=CH[bar];
        if(p===0){M.pad(t,c.slice(1).map(n=>n+12),E*8,'triangle',.011,1500);M.pad(t,c,E*8,'sawtooth',.004,900);M.timp(t,c[0]-12+(c[0]<48?12:0),.12)}
        if(p===0||p===4)M.bassN(t,c[0]-12,E*3.5,.07,false);if(p===2||p===6)M.bassN(t,c[0]-5,E*1.5,.045,false);
        if(p===2||p===6)M.snare(t,.06);if(p===3&&Math.random()<.5)M.snare(t+E/2,.03);
        if(p===7&&bar%2===1){M.snare(t,.03);M.snare(t+E/3,.04);M.snare(t+E*2/3,.055)}
        if(p%2===1)M.harp(t,c[1+((p>>1)%3)]+24);
      }
      // melody with sub-beat timing (quarter-note triplets in bar 2)
      if(!M.heroMel){const T3=4/3;const raw=[[74,2],[74,1],[74,1],[81,4], [79,T3],[78,T3],[79,T3],[81,4], [83,3],[81,1],[79,2],[74,2], [76,6],[69,1],[73,1],
          [74,2],[74,1],[74,1],[81,4], [86,3],[84,1],[82,2],[77,2], [81,3],[83,1],[85,4], [86,8]];let acc=0;M.heroMel=raw.map(([n,d])=>{const o={n,d,at:acc};acc+=d;return o})}
      for(const m of M.heroMel){if(m.at>=b&&m.at<b+1){const tt=t+(m.at-b)*E,dur=E*m.d*.9,bar2=Math.floor(m.at/8);
        M.brass(tt,m.n-12,dur);M.flute(tt,m.n,dur);
        if(m.d>=3){const c=CH[Math.min(7,bar2)],below=[...c,...c.map(x=>x+12)].filter(x=>x<m.n-12-2).pop();if(below)M.brass(tt,below,dur*.95)}}}
      if(b===0)M.cymbal(t,.05);if(b===56){M.cymbal(t,.08);for(let k=0;k<6;k++)M.timp(t+E*2+k*E/3,38,.03+k*.015)}
      if(b===64){M.timp(t,38,.16);M.cymbal(t,.07);M.pad(t,[62,66,69,74],E*7,'triangle',.014,1400);M.bassN(t,38,E*6,.07,true)}},
    tension:false},
  // ---- alternative level pieces so a run does not always sound the same
  cave2:{bpm:76,step(t,b,M){const E=M.eighth; // E dorian, walking bass and a marimba-like figure
      const CH=[[52,59,62,67],[45,57,61,64],[50,57,62,66],[47,55,59,62]],ci=Math.floor(b/32)%4;
      if(b%32===0)M.pad(t,CH[ci].slice(1),E*32,'triangle',.016,900+M.tension*1200);
      if(b%4===0){const w=[0,2,3,5,7,5,3,2][(b/4)%8];M.bassN(t,CH[ci][0]-12+w,E*3.6,.055,false)}
      if(b%2===0&&Math.random()<.45+M.tension*.3){const sc=[64,66,67,69,71,74,76];M.box(t,sc[(b/2+ci*2)%sc.length]-12)}
      if(Math.random()<.012)M.bell(t,pickR([83,86,88]))},
    tension:true},
  cave3:{bpm:58,step(t,b,M){const E=M.eighth; // F lydian, slow flute phrases over a warm drone
      const CH=[[53,60,64,67,71],[55,62,67,71,74],[50,57,62,65,69],[48,55,60,64,67]],ci=Math.floor(b/32)%4;
      if(b%32===0){M.pad(t,CH[ci].slice(1),E*32,'sine',.02,1400);M.bassN(t,CH[ci][0]-12,E*32,.05,true)}
      M.fmel(t,b,[65,67,69,71,72,74,76,77],.5+M.tension*.3);
      if(b%8===6&&Math.random()<.3)M.harp(t,pickR([77,79,81,84]))},
    tension:true},
  desert2:{bpm:98,step(t,b,M){const E=M.eighth; // A phrygian dominant, faster groove and a ney-like flute
      if(b%32===0){M.pad(t,[45,52,57,61],E*32,'triangle',.013,900+M.tension*900);M.bassN(t,33,E*32,.05,true)}
      const p=b%8;if(p===0||p===3||p===6)M.doum(t,.14);if(p===2||p===5||(p===7&&Math.random()<.6))M.tek(t,.045);if(p===4&&Math.random()<.5)M.tek(t,.03);
      M.fmel(t,b,[69,70,73,74,76,77,79,81,82],.55+M.tension*.3);
      if(b%16===12&&Math.random()<.5)M.oud(t,pickR([57,58,61,64]))},
    tension:true},
  frost2:{bpm:50,step(t,b,M){const E=M.eighth; // C# minor, glassy bells and a high music box
      const CH=[[49,56,61,64,68],[45,52,57,61,64],[42,54,57,61,66],[44,56,59,63,68]],ci=Math.floor(b/32)%4;
      if(b%32===0){M.pad(t,CH[ci].slice(1).map(n=>n+12),E*32,'sine',.017,2600);M.bassN(t,CH[ci][0],E*32,.045,true)}
      if(b%4===0&&Math.random()<.5)M.box(t,CH[ci][1+((b/4)%4)]+24);
      if(Math.random()<.07)M.bell(t,pickR([85,88,92,97]))},
    tension:true},
  grove2:{bpm:72,step(t,b,M){const E=M.eighth; // G mixolydian, rolling harp and a pastoral flute
      const CH=[[43,55,59,62,67],[41,53,57,60,65],[48,55,60,64,67],[43,55,59,62,65]],ci=Math.floor(b/32)%4;
      if(b%32===0){M.pad(t,CH[ci].slice(1),E*32,'triangle',.015,1200);M.bassN(t,CH[ci][0],E*32,.05,true)}
      const arp=[1,2,3,4,3,2];if(Math.random()<.7)M.harp(t,CH[ci][arp[b%6]]+12);
      M.fmel(t,b,[67,69,71,72,74,76,77,79],.4+M.tension*.3)},
    tension:true},
  spore2:{bpm:56,step(t,b,M){const E=M.eighth; // whole-tone dream with drifting bells
      const WT=[60,62,64,66,68,70,72,74,76,78];
      if(b%32===0){const r=pickR([0,2,4]);M.pad(t,[48+r,60+r,64+r,68+r],E*32,'sine',.018,1600);M.bassN(t,36+r,E*32,.04,true)}
      if(b%2===0&&Math.random()<.35+M.tension*.3)M.box(t,pickR(WT)+12);
      if(b%16===8&&Math.random()<.5)M.flute(t,pickR(WT),E*6);
      if(Math.random()<.03)M.bell(t,pickR([86,90,94]))},
    tension:true},
  campfire:{bpm:62,step(t,b,M){const E=M.eighth;
      const CH=[[50,57,61,66],[55,59,62,66],[47,54,57,62],[45,52,57,61]];
      const ci=Math.floor(b/16)%4;if(b%16===0){M.pad(t,CH[ci],E*16,'sine',.02,1200);M.bassN(t,CH[ci][0]-12,E*16,.05,true)}
      const arp=[0,1,2,3,2,1,3,2];if(Math.random()<.78)M.box(t,CH[ci][arp[b%8]]+12+(b%16>=8&&b%8===3?12:0));
      if(Math.random()<.05)M.crackle(t)},
    tension:true}
};
const Music={enabled:true,started:false,tension:0,target:0,next:0,beat:0,last:3,track:'theme',want:'theme',bus:null,eighth:.3,
  init(){if(this.started||!AC)return;this.started=true;
    const m=this.master=AC.createGain();m.gain.value=0;m.connect(AC.destination);m.gain.setTargetAtTime(this.enabled?.7*musicVol:0,AC.currentTime+.1,1.5);
    const len=AC.sampleRate*3.4|0,ir=AC.createBuffer(2,len,AC.sampleRate);
    for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.8)}
    const rv=this.rev=AC.createConvolver();rv.buffer=ir;const rg=AC.createGain();rg.gain.value=.55;rv.connect(rg).connect(m);
    const dl=this.delay=AC.createDelay(2);dl.delayTime.value=.66;const fb=AC.createGain();fb.gain.value=.36;const dlf=AC.createBiquadFilter();dlf.type='lowpass';dlf.frequency.value=2000;
    dl.connect(dlf).connect(fb).connect(dl);const dg=AC.createGain();dg.gain.value=.4;dlf.connect(dg);dg.connect(m);dg.connect(rv);
    this.tb=AC.createGain();this.tb.gain.value=1;this.tb.connect(m);
    this.switchTo(this.want,true);setInterval(()=>this.tick(),90)},
  lockUntil:0,
  play(name){this.want=name;if(this.started&&AC&&AC.currentTime<this.lockUntil)return;if(this.started&&name!==this.track)this.switchTo(name)},
  hero(after){this.want=after;if(!this.started){this.want='hero';this.afterHero=after;return}this.switchTo('hero');this.lockUntil=AC.currentTime+72*this.eighth+.4},
  switchTo(name,first){const old=this.bus;if(old){old.gain.setTargetAtTime(0,AC.currentTime,.7);setTimeout(()=>{try{old.disconnect()}catch(e){}},5000)}
    const bus=AC.createGain();bus.gain.value=first?1:0;bus.connect(this.master);if(!first)bus.gain.setTargetAtTime(1,AC.currentTime+.4,.8);
    this.bus=bus;this.track=name;this.beat=0;this.fRest=0;this.heroMel=null;this.mi=null;this.motif=null;this.eighth=60/TRACKS[name].bpm/2;this.delay.delayTime.setTargetAtTime(this.eighth*3,AC.currentTime,.1);this.next=AC.currentTime+.25},
  setEnabled(v){this.enabled=v;this.applyVol()},
  applyVol(){if(this.master)this.master.gain.setTargetAtTime(this.enabled?.7*musicVol:0,AC.currentTime,.3)},
  tick(){if(!AC||!this.started)return;if(this.lockUntil&&AC.currentTime>=this.lockUntil){this.lockUntil=0;if(this.want!==this.track)this.switchTo(this.want)}
    if(this.afterHero&&this.track==='hero'&&!this.lockUntil){this.lockUntil=AC.currentTime+72*this.eighth;this.want=this.afterHero;this.afterHero=null}if(this.next<AC.currentTime-1)this.next=AC.currentTime+.05;
    while(this.next<AC.currentTime+.35){if(this.enabled){const tr=TRACKS[this.track];tr.step(this.next,this.beat,this);if(tr.tension&&this.tension>.1){const b=this.beat;if(b%4===0||b%8===3)this.thump(this.next,this.tension);if(b%2===1)this.hat(this.next,this.tension)}}
      this.next+=this.eighth;this.beat++}},
  env(t,peak,att,dur,rel){const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(peak,t+att);g.gain.setValueAtTime(peak,t+Math.max(att,dur-.05));g.gain.linearRampToValueAtTime(.0001,t+dur+rel);return g},
  pad(t,notes,dur,type,vol,cut){const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=cut;const g=this.env(t,vol,Math.min(2.4,dur*.3),dur,2.5);f.connect(g);g.connect(this.bus);g.connect(this.rev);
    for(const n of notes)for(const d of [-7,7]){const o=AC.createOscillator();o.type=type;o.frequency.value=mtof(n);o.detune.value=d;o.connect(f);o.start(t);o.stop(t+dur+2.7)}},
  bassN(t,n,dur,vol,slow){const o=AC.createOscillator(),g=this.env(t,vol,slow?1.2:.02,dur,slow?1:.15);o.type='sine';o.frequency.value=mtof(n);o.connect(g).connect(this.bus);o.start(t);o.stop(t+dur+1.2)},
  pluck(t,scale,type,vol,dec){this.last=clamp(this.last+Math.floor(Math.random()*5)-2,0,scale.length-1);const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=mtof(scale[this.last]);
    g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(vol,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+dec);o.connect(g);g.connect(this.bus);g.connect(this.delay);g.connect(this.rev);o.start(t);o.stop(t+dec+.1)},
  bell(t,n){const f=mtof(n);for(const [m,v] of [[1,.03],[2.76,.012],[5.4,.006]]){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=f*m;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+3.5);o.connect(g);g.connect(this.rev);g.connect(this.bus);o.start(t);o.stop(t+3.6)}},
  brass(t,n,dur){const f=AC.createBiquadFilter();f.type='lowpass';f.Q.value=2;f.frequency.setValueAtTime(420,t);f.frequency.linearRampToValueAtTime(1900,t+.07);f.frequency.linearRampToValueAtTime(1100,t+.35);
    const g=this.env(t,.042,.05,dur,.22);f.connect(g);g.connect(this.bus);g.connect(this.rev);
    for(const d of [-6,0,6]){const o=AC.createOscillator();o.type='sawtooth';o.frequency.value=mtof(n);o.detune.value=d;const vib=AC.createOscillator(),vg=AC.createGain();vib.frequency.value=5.5;vg.gain.value=dur>.6?4:0;vib.connect(vg).connect(o.detune);o.connect(f);o.start(t);vib.start(t);o.stop(t+dur+.25);vib.stop(t+dur+.25)}},
  timp(t,n,vol){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(mtof(n)*1.05,t);o.frequency.exponentialRampToValueAtTime(mtof(n),t+.1);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+1.2);o.connect(g);g.connect(this.bus);g.connect(this.rev);o.start(t);o.stop(t+1.25)},
  snare(t,vol){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();f.type='bandpass';f.frequency.value=2200;f.Q.value=.8;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.12);s.connect(f).connect(g);g.connect(this.bus);g.connect(this.rev);s.start(t,Math.random());s.stop(t+.14)},
  doum(t,vol){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(52,t+.25);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.4);o.connect(g);g.connect(this.bus);o.start(t);o.stop(t+.45)},
  tek(t,vol){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();f.type='bandpass';f.frequency.value=3200;f.Q.value=3;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.06);s.connect(f).connect(g);g.connect(this.bus);g.connect(this.rev);s.start(t,Math.random());s.stop(t+.08)},
  oud(t,n){const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(2400,t);f.frequency.exponentialRampToValueAtTime(700,t+.4);const g=AC.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.05,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+.9);
    f.connect(g);g.connect(this.bus);g.connect(this.delay);g.connect(this.rev);
    for(const m of [1,2]){const o=AC.createOscillator();o.type=m===1?'sawtooth':'triangle';o.frequency.setValueAtTime(mtof(n)*m*1.012,t);o.frequency.exponentialRampToValueAtTime(mtof(n)*m,t+.05);o.connect(f);o.start(t);o.stop(t+1)}},
  flute(t,n,dur){const f=mtof(n),g=this.env(t,.042,.09,dur,.35);g.connect(this.bus);g.connect(this.rev);g.connect(this.delay);
    const o=AC.createOscillator(),o2=AC.createOscillator(),vib=AC.createOscillator(),vg=AC.createGain(),g2=AC.createGain();o.type='sine';o2.type='triangle';o.frequency.value=f;o2.frequency.value=f*2;g2.gain.value=.18;
    vib.frequency.value=5.2;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(dur>.6?9:2,t+Math.min(.5,dur*.6));vib.connect(vg);vg.connect(o.detune);vg.connect(o2.detune);
    o.connect(g);o2.connect(g2).connect(g);o.start(t);o2.start(t);vib.start(t);o.stop(t+dur+.4);o2.stop(t+dur+.4);vib.stop(t+dur+.4);
    const s=AC.createBufferSource(),bf=AC.createBiquadFilter(),bg=AC.createGain();s.buffer=noiseBuf();bf.type='bandpass';bf.frequency.value=f*2;bf.Q.value=2;bg.gain.setValueAtTime(.012,t);bg.gain.exponentialRampToValueAtTime(.0001,t+.25);s.connect(bf).connect(bg).connect(this.bus);s.start(t,Math.random());s.stop(t+.3)},
  harp(t,n){for(const [m,ty,v] of [[1,'triangle',.022],[2,'sine',.006]]){const o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.value=mtof(n)*m;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+2.2);o.connect(g);g.connect(this.bus);g.connect(this.rev);o.start(t);o.stop(t+2.3)}},
  wind(t,dur){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=this.env(t,.02,dur*.4,dur*.6,dur*.4);s.buffer=noiseBuf();s.loop=true;f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(300,t);f.frequency.linearRampToValueAtTime(700,t+dur*.5);f.frequency.linearRampToValueAtTime(350,t+dur);s.connect(f).connect(g);g.connect(this.bus);g.connect(this.rev);s.start(t);s.stop(t+dur+.1)},
  box(t,n){for(const [m,v] of [[1,.03],[4,.006]]){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=mtof(n)*m;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+(m===1?1.6:.3));o.connect(g);g.connect(this.bus);g.connect(this.rev);o.start(t);o.stop(t+1.7)}},
  crackle(t){for(let i=0;i<3;i++){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();f.type='highpass';f.frequency.value=3000;const tt=t+i*.05*Math.random();g.gain.setValueAtTime(.02,tt);g.gain.exponentialRampToValueAtTime(.0001,tt+.02);s.connect(f).connect(g).connect(this.bus);s.start(tt,Math.random());s.stop(tt+.03)}},
  cymbal(t,vol){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();f.type='highpass';f.frequency.value=5000;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+1.6);s.connect(f).connect(g);g.connect(this.bus);g.connect(this.rev);s.start(t,Math.random());s.stop(t+1.7)},
  fmel(t,b,scale,prob){if(this.fRest>b)return;if(Math.random()>prob*.35){this.fRest=b+1;return}
    this.fi=clamp((this.fi??3)+pickR([-2,-1,-1,1,1,2,0]),0,scale.length-1);const d=pickR([2,2,3,4,6]);this.flute(t,scale[this.fi],this.eighth*d*.95);this.fRest=b+d+(Math.random()<.3?4:0)},
  thump(t,ten){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(95,t);o.frequency.exponentialRampToValueAtTime(42,t+.3);g.gain.setValueAtTime(.2*ten,t);g.gain.exponentialRampToValueAtTime(.0001,t+.35);o.connect(g).connect(this.tb);o.start(t);o.stop(t+.4)},
  hat(t,ten){const s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=noiseBuf();f.type='highpass';f.frequency.value=7000;g.gain.setValueAtTime(.025*ten,t);g.gain.exponentialRampToValueAtTime(.0001,t+.05);s.connect(f).connect(g).connect(this.tb);s.start(t,Math.random());s.stop(t+.06)}
};
const Ambient={g:null,init(){if(this.g||!AC)return;const s=AC.createBufferSource();s.buffer=noiseBuf();s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=900;f.Q.value=.5;this.g=AC.createGain();this.g.gain.value=0;s.connect(f).connect(this.g).connect(AC.destination);s.start()},
  set(v){if(this.g)this.g.gain.setTargetAtTime(muted?0:v*sfxVol,AC.currentTime,.25)}};
const TRACKSETS={normal:['cave','cave2','cave3'],hot:['desert','desert2'],cold:['frost','frost2'],moss:['grove','grove2'],shroom:['spore','spore2']};
let levelMusic=null,lastLevelMusic=null;
function pickLevelMusic(){const L=TRACKSETS[biome]||TRACKSETS.normal,opts=L.filter(n=>n!==lastLevelMusic);levelMusic=pickR(opts.length?opts:L);lastLevelMusic=levelMusic}
const levelTrack=()=>levelMusic||(TRACKSETS[biome]||TRACKSETS.normal)[0];
