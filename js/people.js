/*
  Arkeol v0.3.5 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  people.js – generic titles for everyone underground, the lost soldier, the traveller, the visitor from
              elsewhere, the flower philosopher, a little nature around each of them, deep warnings and
              rumours about the bottom
*/
'use strict';
/* ================================================= everyone goes by what they are, not by a name */
const NPC_TITLE={coffee:{en:'The Hermit',fi:'Erakko'},fisher:{en:'The fisher',fi:'Kalastaja'},harmonica:{en:'The musician',fi:'Soittaja'},
  knitter:{en:'The knitter',fi:'Neuloja'},reader:{en:'The reader',fi:'Lukija'},stoic:{en:'The philosopher',fi:'Filosofi'},hippie:{en:'The flower philosopher',fi:'Kukkafilosofi'},
  baker:{en:'The baker',fi:'Leipuri'},soldier:{en:'The lost soldier',fi:'Eksynyt sotilas'},traveler:{en:'The traveller',fi:'Matkailija'},alien:{en:'The visitor',fi:'Vierailija'}};
const npcTitle=n=>tr(NPC_TITLE[n.type]||{en:'Someone',fi:'Joku'});
Object.assign(STR.en,{shopTitle:"The merchant's bazaar",junkTitle:"The junk dealer",hintJunk:'E or click: the junk dealer',hintJunkT:'Act: the junk dealer',hintShop:"E or click: the merchant's shop",hintShopT:"Act: the merchant's shop",bakeTitle:'The bakery',
  lvl:(l,bn,sh,jk)=>`${bn}${sh?' · a merchant has a shop here':''}${jk?' · a junk dealer is selling scrap':''}`,drill3:'Laser drill'});
Object.assign(STR.fi,{shopTitle:'Kauppiaan basaari',junkTitle:'Romukauppias',hintJunk:'E tai klikkaa: romukauppias',hintJunkT:'Toimi: romukauppias',hintShop:'E tai klikkaa: kauppiaan kauppa',hintShopT:'Toimi: kauppiaan kauppa',bakeTitle:'Leipomo',
  lvl:(l,bn,sh,jk)=>`${bn}${sh?' · täällä on kauppias':''}${jk?' · romukauppias myy romua':''}`,drill3:'Laserpora'});
SABU.hi.en=SABU.hi.en.map(s=>s.replace('Hilda the baker','The baker'));SABU.hi.fi=SABU.hi.fi.map(s=>s.replace('Leipuri-Hilda','Leipuri'));
VOICE.soldier={p:128,w:'triangle'};VOICE.traveler={p:210,w:'square'};VOICE.alien={p:620,w:'sine'};VOICE.hippie={p:175,w:'sine'};

/* ================================================= below the fifth layer, people start asking why you go on */
const WARN={en:['Below here, people stop coming back. What are you looking for down there?','Is it gold you want? Or just the next door? There is always a next door.','I went deeper once. I came back up. Not all of me.','Whatever is down there has waited a long time. It can wait a little longer.','You could stop here. Nobody would think less of you. Least of all me.','Ask yourself: if you find it, what then?','The deeper layers do not give anything back. They only take, slowly.','Turn round while the way up still remembers you.'],
  fi:['Tämän alapuolelta ihmiset eivät enää palaa. Mitä sinä sieltä etsit?','Kultaako sinä haluat? Vai vain seuraavan oven? Aina on seuraava ovi.','Kävin kerran syvemmällä. Palasin ylös. En kokonaan.','Mikä siellä alhaalla odottaakin, se on odottanut kauan. Se jaksaa odottaa vielä vähän.','Voisit pysähtyä tähän. Kukaan ei ajattelisi sinusta huonommin. Minä vähiten.','Kysy itseltäsi: jos löydät sen, mitä sitten?','Syvemmät kerrokset eivät anna mitään takaisin. Ne vain ottavat, hitaasti.','Käänny, kun tie ylös vielä muistaa sinut.']};
/* ================================================= and everyone has heard something about the bottom */
const RUMOUR={en:['They say there is a light at the very bottom. Golden. Some say it is a way out. Some say it is a way in.','My grandmother said the world has a floor, and under the floor it is always a summer afternoon.','Fifteen layers. Everyone who counted agrees on fifteen. Nobody agrees on what is under them.','Someone told me there is no door at the bottom. Just a hole full of light.','If you ever reach the bottom, do not look for a door. Look for the glow.'],
  fi:['Sanotaan, että aivan pohjalla on valo. Kultainen. Jotkut sanovat, että se on tie ulos. Toiset, että tie sisään.','Mummoni sanoi, että maailmalla on lattia, ja lattian alla on aina kesäinen iltapäivä.','Viisitoista kerrosta. Kaikki laskeneet ovat samaa mieltä viidestätoista. Kukaan ei ole samaa mieltä siitä, mitä niiden alla on.','Joku kertoi, että pohjalla ei ole ovea. Vain valoa täynnä oleva kuoppa.','Jos joskus pääset pohjalle, älä etsi ovea. Etsi hehkua.']};
function extraLine(n){if(n.type==='alien'||n.type==='stoic'||n.type==='hippie')return null;if(level>=6&&Math.random()<.25)return pickR(tr(WARN));return null}

/* ================================================= the lost soldier: flowers and quiet music around him */
NPCD.soldier={names:['','',''],lines:{en:['I was told to hold this tunnel. That was a long time ago. Nobody came to relieve me, so I planted flowers instead.','I counted the days for a while. Then I started counting flowers. It is a better number.','I saw too much up there. Down here it is quiet. The flowers do not ask what I did.','If you meet anyone with a uniform, tell them the war is over. At least this one.','I used to be afraid of the dark. Now I water it.','Do not run so much. The tunnel will still be here when you get there.'],
  fi:['Minut käskettiin pitämään tämä tunneli. Siitä on kauan. Kukaan ei tullut vaihtamaan, joten istutin kukkia.','Laskin päiviä jonkin aikaa. Sitten aloin laskea kukkia. Se on parempi luku.','Näin liikaa tuolla ylhäällä. Täällä on hiljaista. Kukat eivät kysy, mitä tein.','Jos tapaat jonkun univormussa, kerro että sota on ohi. Ainakin tämä.','Pelkäsin ennen pimeää. Nyt kastelen sitä.','Älä juokse niin paljon. Tunneli on yhä täällä, kun ehdit perille.']},
  gift(){P.bombs+=3;renderHotbar();return LANG==='fi'?'Ota nämä. En halua niitä enää. Käytä niitä kiviin, älä ihmisiin. (+3 pommia)':'Take these. I do not want them any more. Use them on rocks, not on people. (+3 bombs)'}};
/* ================================================= the traveller who has been everywhere */
const PLACES={en:['Reykjavík, Zanzibar, Samarkand, Valparaíso, and a petrol station outside Oulu that I still dream about.','Timbuktu, Kyoto, Ushuaia, Lalibela, and the night train from Lviv to Odesa.','Petra, Hoi An, Ulaanbaatar, the Faroe Islands, and a very small island whose name I promised not to tell.','Marrakesh, La Paz, Tromsø, Luang Prabang, and the waiting room in Cairo where I learnt to play backgammon.','Cappadocia, Hobart, Cusco, Tbilisi, and now here. Here is the strangest of all.'],
  fi:['Reykjavík, Sansibar, Samarkand, Valparaíso, ja Oulun ulkopuolella oleva huoltoasema, josta näen yhä unia.','Timbuktu, Kioto, Ushuaia, Lalibela ja yöjuna Lvivistä Odessaan.','Petra, Hoi An, Ulaanbaatar, Färsaaret ja hyvin pieni saari, jonka nimeä lupasin olla kertomatta.','Marrakesh, La Paz, Tromssa, Luang Prabang ja Kairon odotushuone, jossa opin pelaamaan backgammonia.','Kappadokia, Hobart, Cusco, Tbilisi, ja nyt tämä. Tämä on oudoin kaikista.']};
const SOUVENIRS=[{en:'a snow globe from Reykjavík',fi:'lumisadepallo Reykjavíkista'},{en:'a spice tin from Zanzibar',fi:'maustepurkki Sansibarista'},{en:'a carved bird from Masvingo',fi:'veistetty lintu Masvingosta'},{en:'a tin of tea from Kyoto',fi:'teepurkki Kiotosta'},{en:'a postcard from Valparaíso',fi:'postikortti Valparaísosta'},{en:'a lucky coin from Petra',fi:'onnenkolikko Petrasta'}];
NPCD.traveler={names:['','',''],lines:PLACES,gift(){return ''}};
function travelerTalk(n){n.talks=(n.talks||0)+1;const pl=tr(PLACES)[(n.li++)%PLACES.en.length];
  if(n.talks===1||n.talks%3===0&&(n.given||0)<3){n.given=(n.given||0)+1;if(n.talks===1){store.stats.talks++;save()}
    const sv=tr(pickR(SOUVENIRS));let extra;const k=Math.random()<.5?randomCosmetic():null;
    if(k){setTimeout(()=>gainCosmetic(k,n.x,n.y-24),700);extra=''}else{const v=150+(Math.random()*6|0)*50;setTimeout(()=>addMoney(v,n.x,n.y-24,'#ffe08a'),600);extra=''}
    return (LANG==='fi'?'Olen käynyt: ':'I have been to ')+pl+(LANG==='fi'?` Tässä, ${sv} sinulle tuliaiseksi.`:` Here, ${sv} for you.`)+extra}
  return (LANG==='fi'?'Olen käynyt: ':'I have been to ')+pl}
/* ================================================= the visitor: speaks in symbols, gives things from the future */
NPCD.alien={names:['','',''],lines:{en:[],fi:[]},gift(){return ''}};
const ALIEN_WORDS=['QIRR VEL OSSU','THUUN AKKA MIRR','VEL VEL XORR NAA','OSSU THUUN QIRR','AKKA NAA VEL MIRR','XORR OSSU AKKA'];
function alienTalk(n){const words=pickR(ALIEN_WORDS)+' '+pickR(ALIEN_WORDS);let gift=null;
  if(!n.gift){n.gift=true;store.stats.talks++;save();
    if(!(P.drill>2)){P.hasDrill=true;P.drill=3;P.fuel=100;gift=TL('Laser drill','Laserpora')}
    else if(!P.weapons.includes('laser')){giveWeapon('laser');gift=TL('Laser pistol','Laserase')}
    else{P.fuel=100;seen.fill(1);if(typeof drawMini==='function')drawMini();gift=TL('A map of this layer','Tämän kerroksen kartta')}
    renderHotbar();setTimeout(()=>{rareFx({r:3,n:{en:gift,fi:gift},v:0})},500)}
  const el=$('talk');el.innerHTML=`<b>${esc(npcTitle(n))}</b><img class="talkGlyph" alt="" src="${alienImg(words)}">${gift?`<i class="talkGift">${esc(TL('It hands you something: ','Se ojentaa sinulle jotain: ')+gift)}</i>`:''}`;el.hidden=false;clearTimeout(talkT);
  for(let k=0;k<8;k++)setTimeout(()=>blip(VOICE.alien),k*70);talkT=setTimeout(()=>el.hidden=true,4200);checkAch()}
/* ================================================= the flower philosopher */
NPCD.hippie={names:['','',''],lines:{en:['Man, rocks are just very slow waves.','Everything is connected. Caves especially. They are literally connected.','You do not dig the tunnel. The tunnel digs you. Think about it.','Peace is not the absence of spiders. It is being cool with the spiders.','Have you ever looked at your hands? Like, really looked? They dig, man.','The best things in life are free. Like breathing. And naps.','I gave up money. Now I am rich in mushrooms.','Blueberries, man. Blue. Berries. The universe is not even hiding it.'],
  fi:['Kivet on vaan tosi hitaita aaltoja, kamu.','Kaikki on yhteydessä. Varsinkin luolat. Ne on ihan oikeasti yhteydessä.','Et sinä kaiva tunnelia. Tunneli kaivaa sinua. Mieti sitä.','Rauha ei ole hämähäkkien puuttumista. Se on sitä, että on sinut hämähäkkien kanssa.','Ootko koskaan katsonut käsiäsi? Siis oikeasti katsonut? Ne kaivaa, kamu.','Elämän parhaat asiat on ilmaisia. Kuten hengittäminen. Ja päiväunet.','Luovuin rahasta. Nyt olen rikas sienistä.','Blueberries, kamu. Siniset. Marjat. Universumi ei edes piilottele sitä.']},
  tea:{en:['Here, some flower tea. Breathe, man. (Health restored)','Chamomile and moonlight. It is good for your aura. (Health restored)','Drink slowly. Time is a flat circle, and also a teacup. (Health restored)'],fi:['Tässä, kukkateetä. Hengitä, kamu. (Terveys palautui)','Kamomillaa ja kuunvaloa. Hyvää aurallesi. (Terveys palautui)','Juo hitaasti. Aika on litteä ympyrä, ja myös teekuppi. (Terveys palautui)']},gift(){return ''}};
const DOMAIN_HELLO={en:['Welcome to my domain. Stay as long as you like. The door will wait for you.','You found the open sky. Rest here as long as you want. Nobody is counting.'],fi:['Tervetuloa domainiini. Viivy niin pitkään kuin haluat. Ovi odottaa sinua.','Löysit avoimen taivaan. Lepää täällä niin kauan kuin haluat. Kukaan ei laske.']};
const PEOPLE_TALK={soldier:n=>{let line;if(!n.gift){n.gift=true;line=NPCD.soldier.gift();store.stats.talks++;save();n.bloom=1}else{line=extraLine(n)||tr(NPCD.soldier.lines)[n.li++%6]}showTalk(npcTitle(n),line,'soldier')},
  traveler:n=>{const x=n.talks>=1?extraLine(n):null;showTalk(npcTitle(n),x||travelerTalk(n),'traveler')},alien:alienTalk};

/* ================================================= future tech from the visitor */
Object.assign(WPN,{laser:{n:{en:'Laser pistol',fi:'Laserase'},ic:'laser',cd:12}});
ICON.laser=pixIcon(p=>{p(2,6,9,4,'#c8d0dc');p(2,6,9,1,'#fff');p(3,9,3,5,'#6a7488');p(11,7,3,2,'#7ff0ff');p(5,7,4,1,'#3a8aff');p(14,7,1,2,'#fff')});
ICON.drill3=pixIcon(p=>{p(2,6,7,5,'#c8d0dc');p(2,6,7,1,'#fff');p(3,11,2,3,'#6a7488');p(4,8,2,1,'#3a8aff');p(9,7,6,3,'#7ff0ff');p(9,8,7,1,'#fff')});
sfx.laser=()=>{tone(1800,.12,'square',.02,-1400);tone(2600,.08,'sine',.015,-1800)};
DEMON_FIRE.laser=(a,cx)=>{const p=P,ca=Math.cos(a.ang),sa=Math.sin(a.ang);p.wcd=WPN.laser.cd;shots.push({x:cx+ca*9,y:p.y+6+sa*9,vx:ca*13,vy:sa*13,g:0,dmg:3,k:'laser',life:45});sfx.laser();flashes.push({x:cx+ca*9,y:p.y+6+sa*9,life:4,max:4,r:2*T})};
const _drawShot0=drawDemonShot;
drawDemonShot=function(s){if(s.k==='laser'){ctx.strokeStyle='rgba(127,240,255,.9)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.vx*.9,s.y-s.vy*.9);ctx.stroke();R(s.x-1,s.y-1,2,2,'#fff');return true}return _drawShot0(s)};

/* ================================================= peaceful music near the soldier */
TRACKS.peace={bpm:60,step(t,b,M){const E=M.eighth;const CH=[[52,59,64,68],[50,57,62,66],[47,54,59,62],[49,56,61,64]];const ci=Math.floor(b/16)%4;
  if(b%16===0){M.pad(t,CH[ci],E*16,'sine',.02,1000);M.bassN(t,CH[ci][0]-12,E*16,.035,true)}
  if(b%4===0&&Math.random()<.8)M.harp(t,CH[ci][(b/4|0)%4]+12);if(b%8===6&&Math.random()<.5)M.box(t,CH[ci][1]+24)},tension:false};
const nearPeace=()=>P&&npcs.some(n=>n.type==='soldier'&&Math.hypot(n.x-(P.x+P.w/2),n.y-(P.y+P.h))<8*T);

/* ================================================= a bit of their own world around each person */
const NPC_NATURE={coffee:['sack','sack','sprout'],fisher:['reeds','reeds','reeds'],harmonica:['glowflower','mush','glowflower'],knitter:['yarn','yarn','fern'],reader:['papers','papers','candle'],
  stoic:['herb','herb','fern'],hippie:['flowers','flowers','mush','flowers'],soldier:['flowers','flowers','flowers','flowers','flowers'],traveler:['suitcase','globe','sprout'],alien:['crystal','crystal','saucer'],baker:[]};
function decorateNpc(n){giveDog(n);const kinds=NPC_NATURE[n.type];if(!kinds||n.decorated)return;n.decorated=true;const tx=Math.floor(n.x/T),ty=Math.round(n.y/T)-1;let i=0;
  for(const dx of [-2,2,-3,3,-4,4,-5,5,-1,1]){if(i>=kinds.length)break;const x=tx+dx;if(x<1||x>=MW-1)continue;
    if(grid[idx(x,ty)]!==AIR||!isSolid(x,ty+1)||decos.some(d=>d.tx===x&&d.ty===ty))continue;decos.push({tx:x,ty,k:kinds[i],sx:0,sy:1,v:(x*7+ty)%4,born:frame});i++}}
function decorateAllNpcs(){for(const n of npcs)decorateNpc(n)}
function drawPeopleDeco(d){const x=d.tx*T,y=d.ty*T,v=d.v||0;
  switch(d.k){
  case 'flowers':{const grow=d.born!==undefined?Math.min(1,(frame-d.born)/240+.35):1,sw=Math.sin(frame*.03+d.tx);const C=['#ff7aa0','#ffd24a','#a07aff','#ff8a4a','#7ad0ff'];
    for(let i=0;i<4;i++){const fx=x+2+i*4,h=Math.round((5+((i+v)%3)*2)*grow),tx2=Math.round(fx+sw*(i%2?1:-1)*.6);R(fx,y+16-h,1,h,'#4f8a3a');if(i%2)R(fx+1,y+13,2,1,'#5f9a44');
      const c=C[(i+v)%5];R(tx2-1,y+15-h,3,2,c);R(tx2,y+14-h,1,1,c);R(tx2,y+15-h,1,1,'#fff6c0')}return true}
  case 'sack':{R(x+3,y+7,10,9,'#8a6a40');R(x+4,y+6,8,1,'#a8845a');R(x+6,y+5,4,1,'#6a4a2a');R(x+5,y+10,6,3,'#5a3a1a');R(x+6,y+5,1,1,'#3a2410');return true}
  case 'reeds':{const sw=Math.sin(frame*.025+d.tx)*.8;for(let i=0;i<4;i++){const rx=x+3+i*3;R(rx,y+6+i%2,1,10-i%2,'#6a8a3a');R(Math.round(rx+sw),y+4+i%2,2,3,'#7a5a30')}return true}
  case 'yarn':{const C=['#c0392b','#3d5fb8','#e0b040','#7a3a8a'][v];ctx.fillStyle=C;ctx.beginPath();ctx.arc(x+8,y+12,4,0,7);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=.6;ctx.beginPath();ctx.arc(x+8,y+12,2.6,.3,2.6);ctx.stroke();R(x+11,y+15,4,1,C);return true}
  case 'papers':{for(let i=0;i<4;i++)R(x+3+(i%2),y+14-i*2,10,2,i%2?'#e8dcc0':'#d8ccb0');R(x+5,y+8,6,1,'#8a7a5a');return true}
  case 'candle':{R(x+6,y+10,3,6,'#efe8dc');const fl=Math.sin(frame*.4+d.tx)*.5;R(x+7,y+8+fl,1,2,'#ffcf5a');return true}
  case 'herb':{const sw=Math.sin(frame*.03+d.tx)*.7;R(x+4,y+12,8,4,'#8a5a3a');R(x+4,y+12,8,1,'#a8744a');for(let i=0;i<3;i++){R(Math.round(x+5+i*2+sw),y+7+i%2,2,5,'#5f9a44');R(Math.round(x+5+i*2+sw),y+6+i%2,1,1,'#e8f0c0')}return true}
  case 'suitcase':{R(x+2,y+8,12,8,'#7a3a2a');R(x+2,y+8,12,1,'#9a5a3a');R(x+6,y+6,4,2,'#3a2416');R(x+4,y+10,3,3,'#3d5fb8');R(x+9,y+11,3,2,'#e0b040');R(x+7,y+12,2,2,'#c0392b');return true}
  case 'globe':{R(x+7,y+13,2,3,'#5a3a22');R(x+5,y+15,6,1,'#5a3a22');ctx.fillStyle='#3a6ab0';ctx.beginPath();ctx.arc(x+8,y+9,4,0,7);ctx.fill();R(x+6,y+7,2,2,'#5a9a44');R(x+9,y+9,2,2,'#5a9a44');return true}
  case 'crystal':{const g=.6+.4*Math.sin(frame*.05+d.tx);ctx.fillStyle=`rgba(127,240,255,${g})`;ctx.beginPath();ctx.moveTo(x+6,y+16);ctx.lineTo(x+8,y+5);ctx.lineTo(x+10,y+16);ctx.fill();ctx.beginPath();ctx.moveTo(x+10,y+16);ctx.lineTo(x+13,y+9);ctx.lineTo(x+14,y+16);ctx.fill();R(x+8,y+7,1,4,'#fff');return true}
  case 'saucer':{R(x-2,y+11,20,3,'#8f99a3');R(x+2,y+9,12,2,'#b9c3cc');ctx.fillStyle='rgba(127,240,255,.5)';ctx.beginPath();ctx.ellipse(x+8,y+9,4,3,0,Math.PI,0);ctx.fill();for(let k=0;k<4;k++)R(x+k*5,y+12,1,1,(frame>>3)%4===k?'#7ff0ff':'#3a4a5a');R(x+12,y+14,6,2,'#5e6670');return true}}
  return false}
function peopleLight(hole,glows){for(const d of decos){if(d.k==='crystal'){hole(d.tx*T+9,d.ty*T+10,1.6*T,.5);glows.push([d.tx*T+9,d.ty*T+10,T,'rgba(127,240,255,.2)'])}else if(d.k==='candle'){hole(d.tx*T+8,d.ty*T+9,1.4*T,.6)}}
  for(const n of npcs)if(n.type==='alien'){hole(n.x,n.y-12,2.6*T,.7);glows.push([n.x,n.y-12,1.6*T,'rgba(140,255,200,.18)'])}}
function updPeople(){for(const n of npcs){if(Math.abs(n.x-(P.x+P.w/2))>VW)continue;updDog(n);
  if(n.type==='soldier'&&frame%90===0){const tx=Math.floor(n.x/T)+((Math.random()*9|0)-4),ty=Math.round(n.y/T)-1;if(grid[idx(tx,ty)]===AIR&&isSolid(tx,ty+1)&&!decos.some(d=>d.tx===tx&&d.ty===ty)&&decos.filter(d=>d.k==='flowers').length<40)decos.push({tx,ty,k:'flowers',sx:0,sy:1,v:(tx*3)%4,born:frame})}
  if(n.type==='alien'&&frame%6===0)parts.push({x:n.x+rand(-4,4),y:n.y-2,vx:0,vy:-.3,life:30,max:30,col:'rgba(140,255,200,.5)',g:-.003,sz:1})}}

/* ================================================= how they look */
Object.assign(FOLK_DRAW,{
  soldier(n){const x=Math.round(n.x),y=Math.round(n.y),f=n.face,b=Math.sin(n.anim*.03)>.95?1:0;R(x-6,y-6,12,6,'#5a4a2a');R(x-6,y-6,12,1,'#7a6a3a');R(x-4,y-4,2,1,'#3a2a14');
    ctx.save();ctx.translate(x,y-6);if(f<0)ctx.scale(-1,1);R(-4,-3,8,3,'#4a5a34');R(3,-3,2,6,'#4a5a34');R(4,2,4,1,'#2a1e16');
    R(-4,-10-b,8,7,'#5a6a3e');R(-1,-9-b,1,5,'#3a4a24');R(-3,-7-b,2,2,'#c8a030');
    R(-3,-14-b,6,4,'#c99f78');R(1,-13-b,1,1,'#1a1410');R(-1,-11-b,3,1,'#8a6a5a');R(-4,-16-b,8,2,'#4a5a34');R(-5,-15-b,10,1,'#3a4a24');
    R(3,-8,3,2,'#c99f78');R(5,-9,1,1,'#ff7aa0');R(5,-10,1,1,'#5f9a44');ctx.restore()},
  traveler(n){const x=Math.round(n.x),y=Math.round(n.y),f=n.face,b=Math.sin(n.anim*.05)>.92?1:0;
    ctx.save();ctx.translate(x,y-4);if(f<0)ctx.scale(-1,1);R(-3,-3,3,3,'#3a4a68');R(1,-3,3,3,'#3a4a68');R(-4,0,4,1,'#2a1e16');R(1,0,4,1,'#2a1e16');
    R(-8,-13-b,5,9,'#7a3a2a');R(-8,-12-b,5,1,'#9a5a3a');R(-7,-10-b,2,2,'#3d5fb8');R(-6,-7-b,2,2,'#e0b040');R(-7,-15-b,3,2,'#5a8a3a');
    R(-4,-11-b,8,8,'#c9a043');R(-4,-11-b,8,1,'#e0c060');R(-3,-15-b,6,4,'#d8a47a');R(1,-14-b,1,1,'#1a1410');R(-5,-17-b,10,2,'#8a6a40');R(-3,-19-b,6,2,'#8a6a40');R(-3,-17-b,6,1,'#c0392b');
    R(4,-9,4,5,'#efe4c8');R(5,-8,2,1,'#8a7a5a');R(5,-6,2,1,'#3d5fb8');ctx.restore()},
  alien(n){const x=Math.round(n.x),y=Math.round(n.y)-3+Math.sin(frame*.05+n.anim)*1.5,f=n.face,blink=(frame+n.anim*9|0)%240<6;
    ctx.save();ctx.translate(x,y);if(f<0)ctx.scale(-1,1);ctx.fillStyle='rgba(140,255,200,.12)';ctx.beginPath();ctx.ellipse(0,-8,9,12,0,0,7);ctx.fill();
    R(-2,-7,4,7,'#8aa898');R(-3,-6,1,4,'#8aa898');R(2,-6,1,4,'#8aa898');R(-2,0,1,2,'#6a8878');R(1,0,1,2,'#6a8878');
    ctx.fillStyle='#a8c8b8';ctx.beginPath();ctx.ellipse(0,-12,5,5,0,0,7);ctx.fill();
    if(blink){R(-3,-12,2,1,'#101418');R(1,-12,2,1,'#101418')}else{ctx.fillStyle='#101418';ctx.beginPath();ctx.ellipse(-2,-12,1.6,2.4,-.3,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(2,-12,1.6,2.4,.3,0,7);ctx.fill();R(-2,-13,1,1,'#7ff0ff');R(2,-13,1,1,'#7ff0ff')}
    R(0,-19,1,3,'#8aa898');R(-1,-20,3,1,(frame>>4)%2?'#7ff0ff':'#3a8aff');ctx.restore()},
  hippie(n){const x=Math.round(n.x),y=Math.round(n.y),f=n.face,b=Math.sin(n.anim*.03)>.95?1:0;R(x-7,y-4,14,4,'#6a6c77');R(x-7,y-4,14,1,'#8a8c96');
    ctx.save();ctx.translate(x,y-4);if(f<0)ctx.scale(-1,1);R(-5,-3,11,3,'#4a6aa8');R(4,-3,3,3,'#4a6aa8');R(5,0,3,1,'#6b4426');
    const TD=['#ff7aa0','#ffd24a','#7ad0ff','#a07aff','#7ae07a'];for(let i=0;i<8;i++)R(-4+i,-11-b,1,8,TD[(i+(frame>>4))%5]);
    R(-6,-15-b,3,9,'#8a5a2a');R(3,-15-b,2,7,'#8a5a2a');R(-3,-16-b,7,5,'#d8a47a');R(1,-14-b,1,1,'#1a1410');R(-1,-12-b,3,1,'#a05a4a');
    R(-4,-16-b,9,1,'#c0392b');R(-3,-18-b,1,1,'#ffd24a');R(0,-18-b,1,1,'#ff7aa0');R(3,-18-b,1,1,'#7ad0ff');
    const sip=(n.anim%420)<50,cy=sip?-13:-7;R(4,cy-b,3,3,'#f3ead8');R(4,cy-b,3,1,'#7ae07a');R(3,cy+2-b,2,2,'#d8a47a');
    ctx.restore()}
});

/* ================================================= notes that wonder about the bottom */
PAPERS.push(
 {who:{en:'Torn page, K. Tanaka',fi:'Revitty sivu, K. Tanaka'},body:{en:'Everyone who gets past the eleventh layer says the same thing: a faint golden glow somewhere below, never closer, never further.',fi:'Jokainen, joka pääsee yhdennentoista kerroksen ohi, sanoo saman: heikko kultainen hehku jossain alempana, ei koskaan lähempänä, ei koskaan kauempana.'},minLv:6},
 {who:{en:'Postcard, no sender',fi:'Postikortti, ei lähettäjää'},body:{en:'If you ever get to the bottom, do not look for a door.\nLook for the light.',fi:'Jos joskus pääset pohjalle, älä etsi ovea.\nEtsi valoa.'},minLv:4},
 {who:{en:'Diary, Prof. Elina Varjo',fi:'Päiväkirja, prof. Elina Varjo'},body:{en:'The guide says the bottom is not a floor but a door. When I asked a door to where, he only smiled and sold me a rope.',fi:'Opas sanoo, että pohja ei ole lattia vaan ovi. Kun kysyin, ovi minne, hän vain hymyili ja myi minulle köyden.'},minLv:5},
 {who:{en:"Child's note, in pencil",fi:'Lapsen lappu, lyijykynällä'},body:{en:'grandpa says at the bottom of the world there is a golden room where everybody you lost is having coffee and nobody is in a hurry',fi:'pappa sanoo että maailman pohjalla on kultainen huone jossa kaikki jotka on kadonneet juo kahvia eikä kenelläkään ole kiire'},minLv:3},
 {who:{en:'Note, Prof. Aleksander Nowak',fi:'Muistiinpano, prof. Aleksander Nowak'},body:{en:'Fifteen layers. Always fifteen. Every expedition that kept count agreed on the number, and on nothing else.',fi:'Viisitoista kerrosta. Aina viisitoista. Jokainen laskua pitänyt retkikunta oli samaa mieltä luvusta, eikä mistään muusta.'},minLv:7},
 {who:{en:'Scribbled in a margin',fi:'Raapustettu marginaaliin'},body:{en:'What if the treasure at the bottom is just the way home?',fi:'Entä jos aarre pohjalla onkin vain tie kotiin?'},minLv:8},
 {who:{en:'Field log, Survey Unit 7',fi:'Kartoitusloki, yksikkö 7'},body:{en:'Deep scan: a cavity at the bottom of the column. Temperature: a summer afternoon. Light level: impossible.',fi:'Syväluotaus: ontelo pylvään pohjalla. Lämpötila: kesäinen iltapäivä. Valon määrä: mahdoton.'},minLv:9},
 {who:{en:'Letter, unsigned',fi:'Kirje, allekirjoittamaton'},body:{en:'Why do you keep going down? Write the answer here, before you go any deeper. If you cannot, go back up.\n\n____________________',fi:'Miksi jatkat alaspäin? Kirjoita vastaus tähän ennen kuin menet syvemmälle. Jos et pysty, palaa ylös.\n\n____________________'},minLv:6}
);

/* ================================================= the hermit talks about coffee and his dog; the dog is orange */
NPCD.coffee.lines={en:['Coffee has to boil up three times, or it is just brown water.','My dog is called Rusty. He found me, not the other way round.','Rusty sleeps eighteen hours a day. The other six he spends looking for my socks.','Dark roast in the morning, light roast in the evening. Rusty does not care, he just wants the crusts.','I came down here to be alone. Then Rusty arrived. Now we are alone together.','If Rusty barks at the dark, I put the kettle on. Coffee makes everything less frightening.','The trick is to grind the beans just before brewing. And to give the dog a biscuit, or he sulks.','Rusty once chased a bat for an hour. Then they both took a nap.'],
  fi:['Kahvi pitää antaa kuohahtaa kolmesti, muuten se on pelkkää ruskeaa vettä.','Koirani nimi on Ruoste. Se löysi minut, ei toisin päin.','Ruoste nukkuu kahdeksantoista tuntia päivässä. Loput kuusi se etsii sukkiani.','Tumma paahto aamulla, vaalea illalla. Ruostetta ei kiinnosta, se haluaa vain kannikat.','Tulin tänne ollakseni yksin. Sitten Ruoste tuli. Nyt olemme yksin yhdessä.','Jos Ruoste haukkuu pimeälle, laitan pannun tulelle. Kahvi tekee kaikesta vähemmän pelottavaa.','Salaisuus on jauhaa pavut juuri ennen keittämistä. Ja antaa koiralle keksi, muuten se murjottaa.','Ruoste jahtasi kerran lepakkoa tunnin. Sitten ne molemmat ottivat päiväunet.']};
NPCD.coffee.names=['','',''];
function giveDog(n){if(n.dog||n.type!=='coffee')return;n.dog={x:n.x+(Math.random()<.5?-20:20),y:n.y,vx:0,face:1,st:'walk',t:Math.random()*200|0,home:n.x}}
function updDog(n){const d=n.dog;if(!d)return;d.t++;
  if(d.st==='sleep'){d.vx=0;if(d.t>600+Math.random()*400){d.st='walk';d.t=0}}
  else{if(d.t%140===0)d.face=Math.random()<.5?-1:1;if(Math.abs(d.x-d.home)>4*T)d.face=Math.sign(d.home-d.x);
    const nx=d.x+d.face*.45,tx=Math.floor((nx+d.face*6)/T),ty=Math.floor((d.y-4)/T);
    if(isSolid(tx,ty)||!isSolid(tx,ty+1))d.face*=-1;else d.x=nx;
    if(d.t>500&&Math.random()<.004){d.st='sleep';d.t=0}}
  if(d.st==='sleep'&&frame%70===0)texts.push({x:d.x+4,y:d.y-10,txt:'z',col:'#c8d0dc',life:50})}
function drawDog(d){const x=Math.round(d.x),y=Math.round(d.y),O='#e07a2a',D='#a8541a',L='#f4a860';ctx.save();ctx.translate(x,y);if(d.face<0)ctx.scale(-1,1);
  if(d.st==='sleep'){R(-7,-4,13,4,O);R(-7,-4,13,1,L);R(4,-5,4,4,O);R(6,-4,1,1,'#2a1a10');R(-9,-3,3,2,O);R(5,-6,2,1,D);ctx.restore();return}
  const step=(frame>>3)%2,wag=Math.sin(frame*.4)*1.5;
  R(-6,-8,11,5,O);R(-6,-8,11,1,L);R(-5+step,-3,2,3,D);R(2-step,-3,2,3,D);R(-3-step,-3,2,3,O);R(4+step,-3,2,3,O);
  R(4,-11,5,5,O);R(8,-9,2,2,L);R(9,-9,1,1,'#2a1a10');R(6,-10,1,1,'#2a1a10');R(4,-12,2,2,D);R(-9,-9+Math.round(wag),3,2,O);
  ctx.restore()}
function drawDogs(){for(const n of npcs)if(n.dog&&inViewWorld(n.dog.x,n.dog.y))drawDog(n.dog)}
const inViewWorld=(x,y)=>x>cam.x-30&&x<cam.x+VW+30&&y>cam.y-30&&y<cam.y+VH+30;

/* ================================================= sitting by a fire mends you */
function updFireRest(){if(!P||P.dead||P.hp>=P.maxHp||frame%24)return;const cx=P.x+P.w/2,cy=P.y+P.h/2;
  const near=decos.some(d=>!d.dead&&d.k==='campfire'&&Math.abs(d.tx*T+8-cx)<1.8*T&&Math.abs(d.ty*T+8-cy)<1.6*T)||npcs.some(n=>n.type==='coffee'&&Math.abs(n.x+n.face*13-cx)<1.8*T&&Math.abs(n.y-8-cy)<1.6*T);
  if(!near)return;P.hp=Math.min(P.maxHp,P.hp+1);P.poison=0;sfx.pickup&&sfx.pickup();particle(cx,P.y+2,['#ff8a7a','#ffcf7a'],6,1,22,-.02,1);floatText(cx,P.y-8,'+1 ♥','#ff8a7a')}

/* ================================================= no enemies right next to people or old computers */
function clearFriendsArea(){const safe=[...npcs.map(n=>[n.x,n.y-8]),...terms.map(t=>[t.tx*T+16,t.ty*T+8])];
  for(const s of [shop,junk])if(s&&s.merchant)safe.push([s.merchant.x+7,s.merchant.y+9]);
  if(!safe.length)return;foes=foes.filter(f=>!safe.some(([x,y])=>Math.hypot(f.x+f.w/2-x,f.y+f.h/2-y)<7*T))}
