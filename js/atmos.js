/*
  Arkeol v0.3.5 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  atmos.js – drifting fog, ground mist and dust motes; the sunken desert biome; caravan props;
             and gentler, present-minded things for everyone to say
*/
'use strict';
/* ================================================= the sunken desert */
TEXB.desert=biomeSet([164,124,76],[150,122,86],[120,90,60],[230,200,140],4100);
BGS.desert=bgSet([58,42,26],4200);
TRACKSETS.desert=['desert','desert2'];
Object.assign(STR.en,{b_desert:'Sunken desert'});Object.assign(STR.fi,{b_desert:'Hautautunut aavikko'});
BIOPAL.desert=[[70,50,30],[190,150,96],[244,214,150]];
function spawnDesertDecor(H){if(biome!=='desert'||inVoid)return;const {ri}=H;let c=0;
  for(let a=0;a<1200&&c<14;a++){const x=ri(2,MW-3),y=ri(4,MH-3);if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||!isSolid(x,y+1)||isWater(x,y)||decos.some(d=>d.tx===x&&d.ty===y))continue;
    decos.push({tx:x,ty:y,k:pickR(['cactus','bones','amphora','cactus','skullsand']),sx:0,sy:1,v:ri(0,3)});c++}}

/* ================================================= caravan, camel, cactus and other props */
function drawAtmosDeco(d){const x=d.tx*T,y=d.ty*T,v=d.v||0;
  switch(d.k){
  case 'cactus':{const g='#4f8a4a',l='#6aaa5a';R(x+6,y+3,4,13,g);R(x+7,y+3,1,13,l);if(v%2===0){R(x+2,y+7,4,2,g);R(x+2,y+4,2,4,g)}else{R(x+10,y+8,4,2,g);R(x+12,y+5,2,4,g)}
    if(v===3){R(x+7,y+2,2,1,'#ff7aa0')}for(let k=0;k<4;k++)R(x+6+(k%2)*3,y+5+k*3,1,1,'#e8f0c0');return true}
  case 'skullsand':{R(x+4,y+11,8,5,'#e8e0cc');R(x+5,y+12,2,2,'#2a2016');R(x+9,y+12,2,2,'#2a2016');R(x+2,y+15,12,1,'#c8a870');return true}
  case 'caravan':{R(x-6,y-14,40,22,'#e8dcc0');ctx.fillStyle='#e8dcc0';ctx.beginPath();ctx.ellipse(x+14,y-14,20,9,0,Math.PI,0);ctx.fill();for(let k=0;k<5;k++)R(x-4+k*9,y-20+Math.abs(2-k),1,28,'#c8b890');
    R(x-6,y+6,40,4,'#7a4a24');R(x-6,y+6,40,1,'#9a6a3a');for(const wx of [x-1,x+27]){ctx.fillStyle='#5a3a1a';ctx.beginPath();ctx.arc(wx,y+12,4,0,7);ctx.fill();R(wx-.5,y+8,1,8,'#3a2410');R(wx-4,y+11.5,8,1,'#3a2410')}
    R(x+6,y-6,10,10,'#2a1e14');R(x+7,y-5,8,8,'#c86a3a');R(x+10,y-5,2,8,'#e0b040');R(x+20,y-4,8,4,'#3d5fb8');R(x+34,y+4,8,1,'#7a4a24');return true}
  case 'camel':{const ch=(frame>>4)%2,b=Math.sin(frame*.04)*.5;R(x-6,y+3,18,7,'#c89a5a');R(x-3,y-1+b,6,4,'#c89a5a');R(x+5,y,5,4,'#c89a5a');R(x+11,y-5,3,9,'#c89a5a');R(x+11,y-8,6,4,'#c89a5a');R(x+16,y-6+ch,2,1,'#8a6a3a');R(x+14,y-7,1,1,'#2a1e14');
    for(const lx of [-5,-1,5,9])R(x+lx,y+10,2,6,'#a87a40');R(x-8,y+4,2,4,'#a87a40');R(x-2,y+2,10,2,'#c0392b');R(x,y+2,2,3,'#e0b040');return true}
  case 'lanternpost':{R(x+7,y-8,2,24,'#5a3a22');R(x+4,y-8,8,1,'#5a3a22');const f=.8+.2*Math.sin(frame*.2+d.tx);R(x+3,y-7,3,4,`rgba(255,${190+40*f|0},90,1)`);R(x+3,y-7,3,1,'#3a3236');return true}
  case 'amphora':return false}
  return false}
function atmosLight(hole,glows){for(const d of decos){if(d.k==='lanternpost'){hole(d.tx*T+5,d.ty*T-5,2.6*T,.7);glows.push([d.tx*T+5,d.ty*T-5,1.8*T,'rgba(255,190,90,.22)'])}}}

/* ================================================= fog, ground mist and dust in the air */
const FOGC={normal:'205,190,165',hot:'255,150,90',cold:'205,225,255',moss:'175,220,160',shroom:'215,175,255',desert:'240,212,160',void:'130,20,40',tent:'255,220,170'};
let fogs=[],dust=[],fogSeedLv=-1;
function seedAtmos(){fogSeedLv=level+(inVoid?100:0)+(domain?200:0);fogs=[];dust=[];
  const n=inTent?0:domain?4:6+Math.min(6,level>>1);for(let i=0;i<n;i++)fogs.push({x:Math.random()*MW*T,y:(4+Math.random()*(MH-8))*T,r:(3+Math.random()*5)*T,vx:(Math.random()-.5)*.12,ph:Math.random()*9,a:.03+Math.random()*.04});
  for(let i=0;i<90;i++)dust.push({x:Math.random(),y:Math.random(),z:.4+Math.random()*.9,ph:Math.random()*9})}
function drawAtmos(x0,x1,y0,y1){if(state==='menu'&&!surf)return;const key=level+(inVoid?100:0)+(domain?200:0);if(key!==fogSeedLv)seedAtmos();
  const C=FOGC[biome]||FOGC.normal,deep=Math.min(1,level/10),pcx=P?P.x+P.w/2:0,pcy=P?P.y+P.h/2:0;
  // drifting fog banks
  for(const f of fogs){f.x+=f.vx;if(f.x<-f.r)f.x=MW*T+f.r;if(f.x>MW*T+f.r)f.x=-f.r;const fy=f.y+Math.sin(frame*.004+f.ph)*10;
    if(f.x+f.r<cam.x||f.x-f.r>cam.x+VW||fy+f.r<cam.y||fy-f.r>cam.y+VH)continue;const a=f.a*(.6+deep*.6)*(.8+.2*Math.sin(frame*.01+f.ph))*(biome==='desert'||biome==='cold'?.6:1);
    const g=ctx.createRadialGradient(f.x,fy,0,f.x,fy,f.r);g.addColorStop(0,`rgba(${C},${a.toFixed(3)})`);g.addColorStop(1,`rgba(${C},0)`);ctx.fillStyle=g;ctx.fillRect(f.x-f.r,fy-f.r*.6,f.r*2,f.r*1.2)}
  // low mist that hugs the floors
  if(!inTent){const t=frame*.02;for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(grid[idx(x,y)]!==AIR||!isSolid(x,y+1)||skyA[idx(x,y)])continue;
    const a=(.05+.04*Math.sin(t+x*.7+y*1.3))*(.7+deep*.5);ctx.fillStyle=`rgba(${C},${a.toFixed(3)})`;ctx.fillRect(x*T,y*T+10,T,6);ctx.fillStyle=`rgba(${C},${(a*.5).toFixed(3)})`;ctx.fillRect(x*T,y*T+6,T,4)}}
  // dust motes that catch the lamp light
  for(const m of dust){const wx=cam.x+((m.x*VW+frame*.08*m.z+Math.sin(frame*.01+m.ph)*6)%VW+VW)%VW,wy=cam.y+((m.y*VH+frame*.05*m.z)%VH+VH)%VH;
    const d=Math.hypot(wx-pcx,wy-pcy),lit=Math.max(0,1-d/((P?P.lampR:6)*T*.9));if(lit<=0.02&&!surf)continue;
    const a=(.15+.6*lit)*(.6+.4*Math.sin(frame*.05+m.ph));ctx.fillStyle=`rgba(${biome==='void'?'255,120,120':'255,240,210'},${a.toFixed(2)})`;ctx.fillRect(wx,wy,m.z>1?1.5:1,m.z>1?1.5:1)}
  // now and then a little dust trickles from the ceiling
  if(!surf&&!inTent&&frame%40===0&&P){const tx=Math.floor((pcx+rand(-VW/2,VW/2))/T),ty=Math.floor((pcy-rand(20,VH/2))/T);
    if(isSolid(tx,ty)&&!isSolid(tx,ty+1))for(let k=0;k<5;k++)parts.push({x:tx*T+rand(2,14),y:(ty+1)*T,vx:rand(-.05,.05),vy:rand(.2,.5),life:60,max:60,col:`rgba(${C},.6)`,g:.01,sz:1})}}

/* ================================================= kinder, present-minded things to say */
const SAY={
 fisher:{en:['Shh. Listen to the water. It is never in a hurry.','The fish do not worry about tomorrow. I am learning from them.','Some days I catch nothing. Those are good days too.','Sit for a while. The best things come to those who wait quietly.','I named one of the fish Pertti. Then I realised they are all Pertti.','A calm line catches more than a nervous one. Same with people.'],
         fi:['Hys. Kuuntele vettä. Sillä ei ole koskaan kiire.','Kalat eivät murehdi huomista. Minä opettelen niiltä.','Joinain päivinä en saa mitään. Nekin ovat hyviä päiviä.','Istu hetki. Parhaat asiat tulevat niille, jotka odottavat hiljaa.','Nimesin yhden kalan Pertiksi. Sitten tajusin, että ne kaikki ovat Perttejä.','Rauhallinen siima saa enemmän kuin hermostunut. Sama pätee ihmisiin.']},
 harmonica:{en:['Every tune is only now. That is what makes it beautiful.','I only know three songs. That is plenty, if you play them with your heart.','Music does not need a reason. Neither does a good day.','The echo plays along with me. Nobody is ever really alone.','Hum with me. Worry cannot keep time.'],
         fi:['Jokainen sävel on vain nyt. Siksi se on kaunis.','Osaan vain kolme kappaletta. Se riittää, jos ne soittaa sydämellä.','Musiikki ei tarvitse syytä. Eikä hyvä päiväkään.','Kaiku soittaa mukana. Kukaan ei ole koskaan oikeasti yksin.','Hyräile mukana. Huoli ei pysy tahdissa.']},
 knitter:{en:['One stitch at a time. That is how everything gets done.','Mistakes are just a new pattern you did not plan.','Warm socks and a kind word. What else do you need?','I do not rush. The yarn knows when I am in a hurry, and it tangles.','Be gentle with yourself today. Tomorrow too.'],
         fi:['Silmukka kerrallaan. Niin kaikki valmistuu.','Virheet ovat vain uusi kuvio, jota et suunnitellut.','Lämpimät sukat ja ystävällinen sana. Mitä muuta tarvitaan?','En kiirehdi. Lanka tietää, kun minulla on kiire, ja menee solmuun.','Ole tänään lempeä itsellesi. Huomennakin.']},
 reader:{en:['The paper is old, but this moment is brand new. I read it slowly.','The good news is always on page three. You just have to keep reading.','I read the same story every day. I notice something new every time.','Today the weather forecast says: whatever comes. I like that forecast.','A slow morning is not a wasted morning.'],
         fi:['Lehti on vanha, mutta tämä hetki on aivan uusi. Luen sen hitaasti.','Hyvät uutiset ovat aina sivulla kolme. Lukemista pitää vain jatkaa.','Luen saman tarinan joka päivä. Huomaan joka kerta jotain uutta.','Tänään sääennuste sanoo: mitä ikinä tuleekaan. Pidän siitä ennusteesta.','Hidas aamu ei ole hukattu aamu.']},
 soldier:{en:['I spent years waiting for the next order. Now I just watch the flowers open.','Peace is not far away. It is right here, if you sit still long enough.','Every flower here was a bad day once. Now look at them.','Breathe in. Breathe out. That is the only drill I keep.','Be kind to the next person you meet. You never know what they carry.'],
         fi:['Odotin vuosia seuraavaa käskyä. Nyt katselen vain kukkien aukeamista.','Rauha ei ole kaukana. Se on tässä, jos istuu tarpeeksi kauan hiljaa.','Jokainen kukka täällä oli joskus huono päivä. Katso niitä nyt.','Hengitä sisään. Hengitä ulos. Se on ainoa harjoitus, jota vielä teen.','Ole ystävällinen seuraavalle, jonka tapaat. Et koskaan tiedä, mitä hän kantaa.']},
 hippie:{en:['Right now is the only now, man. It is a pretty good one.','Everything is connected. You, me, the moss, the tea.','Peace is not the absence of spiders. It is being cool with the spiders.','The best things in life are free. Like breathing. And naps.','Smile at a stranger today. Even a bat. Especially a bat.','Blueberries, man. Blue. Berries. The universe is not even hiding it.','Let go of what you cannot carry. Your shoulders will thank you.'],
         fi:['Juuri nyt on ainoa nyt, kamu. Ja se on aika hyvä.','Kaikki on yhteydessä. Sinä, minä, sammal, tee.','Rauha ei ole hämähäkkien puuttumista. Se on sitä, että on sinut hämähäkkien kanssa.','Elämän parhaat asiat on ilmaisia. Kuten hengittäminen. Ja päiväunet.','Hymyile tänään vieraalle. Vaikka lepakolle. Varsinkin lepakolle.','Blueberries, kamu. Siniset. Marjat. Universumi ei edes piilottele sitä.','Päästä irti siitä, mitä et jaksa kantaa. Olkapääsi kiittävät.']},
 coffee:{en:['Coffee has to boil up three times. Good things take a little patience.','My dog is called Rusty. He found me, not the other way round.','Rusty sleeps eighteen hours a day. He has life figured out.','The best cup is the one you drink slowly, with someone.','If Rusty barks at the dark, I put the kettle on. Coffee makes everything less frightening.','Rusty once chased a bat for an hour. Then they both took a nap. No hard feelings.','Every morning is a fresh pot. Yesterday is already drunk.'],
         fi:['Kahvin pitää kuohahtaa kolmesti. Hyvät asiat vaativat vähän kärsivällisyyttä.','Koirani nimi on Ruoste. Se löysi minut, ei toisin päin.','Ruoste nukkuu kahdeksantoista tuntia päivässä. Se on keksinyt elämän.','Paras kuppi on se, jonka juo hitaasti, jonkun kanssa.','Jos Ruoste haukkuu pimeälle, laitan pannun tulelle. Kahvi tekee kaikesta vähemmän pelottavaa.','Ruoste jahtasi kerran lepakkoa tunnin. Sitten ne molemmat ottivat päiväunet. Ei kaunaa.','Joka aamu on uusi pannullinen. Eilinen on jo juotu.']}
};
for(const k in SAY)if(NPCD[k])NPCD[k].lines=SAY[k];
REIJO.no={en:["Money first, friend. Even down here.","A little short. Come back when the pockets are fuller. No hurry."],fi:['Raha ensin, hyvä ystävä. Täälläi alhaalla.','Vähän jää vajjaaksi. Tule takas ku taskut on täyvemmät. Ei kiirettä.']};
SABU.no={en:['Your pockets are lighter than your judgement.','Come back later. The goods will wait, and so will I.','Sabu does not give credit. Not for three thousand years.'],fi:['Taskusi ovat kevyemmät kuin harkintasi.','Tule myöhemmin takaisin. Tavarat odottavat, ja niin minäkin.','Sabu ei anna velaksi. Ei ole antanut kolmeen tuhanteen vuoteen.']};

// a stoic word about gold
NPCD.stoic.lines.en.push('Gold is heavy. Carry only as much of it as you can bear.');NPCD.stoic.lines.fi.push('Kulta on painavaa. Kanna sitä vain sen verran kuin jaksat kantaa.');
