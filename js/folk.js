/*
  Arkeol v0.3.5 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  folk.js – talking voices, the tea-drinking philosopher, Hilda's bakery and the fish in the pools
*/
'use strict';
let fishes=[];

/* ================================================= voices: every character babbles in their own pitch */
const VOICE={coffee:{p:150,w:'square'},fisher:{p:240,w:'triangle'},harmonica:{p:185,w:'square'},knitter:{p:330,w:'triangle'},reader:{p:205,w:'sawtooth'},
  stoic:{p:118,w:'triangle'},baker:{p:390,w:'square'},reijo:{p:132,w:'sawtooth'},sabu:{p:104,w:'triangle'}};
sfx.talk=()=>{};
sfx.tea=()=>{tone(660,.25,'sine',.04,220);setTimeout(()=>tone(880,.35,'sine',.035,120),140);setTimeout(()=>noise(.5,.03,1800,'bandpass'),60)};
function blip(v){const f=v.p*(.8+Math.random()*.6);tone(f,.055,v.w,v.w==='sawtooth'?.014:.024,(Math.random()-.45)*f*.7)}
function typeInto(el,txt,vk,done){if(el._tw)clearInterval(el._tw);const v=VOICE[vk]||VOICE.coffee;let i=0;el.textContent='';
  el._tw=setInterval(()=>{const n=Math.min(txt.length,i+2);for(let k=i;k<n;k++)if(/[\p{L}\p{N}]/u.test(txt[k])&&k%3===0)blip(v);i=n;el.textContent=txt.slice(0,i);
    if(i>=txt.length){clearInterval(el._tw);el._tw=0;if(done)done()}},34)}
function showTalk(name,txt,vk){const el=$('talk');el.innerHTML=`<b>${esc(name)}</b><span></span>`;el.hidden=false;clearTimeout(talkT);
  typeInto(el.querySelector('span'),txt,vk,()=>{talkT=setTimeout(()=>el.hidden=true,2600+txt.length*40)})}
const shopKind=()=>curShop===junk?'reijo':curShop&&curShop.kind==='bake'?'baker':'sabu';
function shopSay(txt){typeInto($('sabuSay'),txt,shopKind())}

/* ================================================= more to say for everybody */
const MORE={
  coffeeOld:{en:['Never trust anyone who drinks lukewarm coffee. Or a wolf. Wolves do not drink coffee at all.','The grounds tell the future. These ones say: more coffee.','My brother went up for milk in 2009. I take mine black now.','Lava makes a fine stove. Just do not leave the pot too long.','The tea man down the tunnel says coffee makes you anxious. I say he has never tried it boiled properly.'],
          fi:['Älä luota keneenkään, joka juo haaleaa kahvia. Äläkä suteen. Sudet eivät juo kahvia ollenkaan.','Porot kertovat tulevaisuuden. Nämä sanovat: lisää kahvia.','Veljeni lähti ylös hakemaan maitoa vuonna 2009. Juon nykyään mustana.','Laava on hyvä liesi. Pannua ei vain saa unohtaa sinne.','Se teemies tuolla käytävässä sanoo, että kahvi hermostuttaa. Hän ei ole koskaan juonut kunnolla keitettyä.']},
  fisher:{en:['The fish down here have no eyes. They do not need them. They have patience.','Did you see them? Little silver ones in the pool. They know when you are thinking about them.','I named one of them Pertti. Then I realised they are all Pertti.','This water is older than the sea. Tastes a bit like coins.','If you fall in, keep your mouth shut. The fish are shy, not stupid.'],
          fi:['Täällä alhaalla kaloilla ei ole silmiä. Ne eivät tarvitse niitä. Niillä on kärsivällisyyttä.','Näitkö ne? Pieniä hopeisia lammessa. Ne tietävät, kun ajattelet niitä.','Nimesin yhden Pertiksi. Sitten tajusin, että ne kaikki ovat Perttejä.','Tämä vesi on vanhempaa kuin meri. Maistuu vähän kolikoilta.','Jos putoat veteen, pidä suu kiinni. Kalat ovat ujoja, eivät tyhmiä.']},
  harmonica:{en:['I only know three songs. Down here that counts as a radio station.','The bats tap along. Off the beat, but they try.','Sometimes the cave hums the tune back to me. A semitone lower. Out of politeness, I hope.','A man from Bamako taught me a song with no ending. I am still playing it.'],
          fi:['Osaan vain kolme kappaletta. Täällä alhaalla se on jo radiokanava.','Lepakot napauttelevat tahtia. Väärään kohtaan, mutta ne yrittävät.','Joskus luola hyräilee sävelen takaisin. Puolisävelaskelta alempaa. Kohteliaisuuttaan, toivon.','Bamakolainen mies opetti minulle laulun, jolla ei ole loppua. Soitan sitä yhä.']},
  knitter:{en:['This scarf is eighty metres long. I wanted to see where the shaft ends.','Purl two, knit two, ignore the noises.','The ants stole my red yarn. I have seen a little red thread going into the wall.','I knitted a sock for a scorpion once. It wanted six more.'],
          fi:['Tämä kaulahuivi on kahdeksankymmentä metriä pitkä. Halusin nähdä, mihin kuilu loppuu.','Kaksi nurin, kaksi oikein, älä välitä äänistä.','Muurahaiset varastivat punaisen lankani. Näin pienen punaisen langan katoavan seinään.','Neuloin kerran sukan skorpionille. Se halusi vielä kuusi.']},
  reader:{en:['Page six says the council approved a new bridge. I hope they built it.','There is a crossword. Fourteen across: "the deep place", seven letters. I have been stuck for nine years.','The comic strip makes me laugh every day. Same joke. Still funny.','The obituaries are the most cheerful page. Everyone in them is finally resting.'],
          fi:['Sivulla kuusi kerrotaan, että valtuusto hyväksyi uuden sillan. Toivottavasti se rakennettiin.','Tässä on ristisanatehtävä. Neljätoista vaakaan: "syvä paikka", seitsemän kirjainta. Olen jumittanut yhdeksän vuotta.','Sarjakuva naurattaa joka päivä. Sama vitsi. Yhä hauska.','Muistokirjoitukset ovat lehden iloisin sivu. Kaikki niissä saavat vihdoin levätä.']}
};
for(const k in MORE){if(!NPCD[k])continue;NPCD[k].lines.en.push(...MORE[k].en);NPCD[k].lines.fi.push(...MORE[k].fi)}
REIJO.hi.en.push("This one's from an Egyptian merchant. Well, from his bin.","Hello again! Or for the first time. I lose track down here.","The drill? Purrs like a cat. A cat with a cough.","Mind the scorpions. They never buy anything.","I tried that philosopher's tea once. Felt so calm I gave away a drill. Never again.");
REIJO.hi.fi.push('Tämä on egyptiläiseltä kauppiaalta. No, sen roskiksesta.','Terve taas! Tai ensimmäistä kertaa, mää en pysy kärryillä täällä alhaalla.','Pora? Kehrää ku kissa. Kissa jolla on yskä.','Varo skorppiooneja. Ne ei ikinä osta mittään.','Join kerran sen filosoofin teetä. Tuli niin rauhallinen olo että annoin poran ilimaseksi. Ei enää ikinä.');
REIJO.buy.en.push("Lovely. Now you look like a proper scrap professional.");REIJO.buy.fi.push('Kaunista. Nyt näytät oikealta romuammattilaiselta.');
SABU.hi.en.push('The scarab rolls the sun across the sky. Sabu rolls prices. Both are ancient work.','I have sold lamps to pharaohs and ropes to astronauts. You are somewhere in between.','Do not mind the eyes on the walls. They only watch the shoplifters.','Have you met the tea man? He gives tea away. For free. I do not understand him.','Hilda the baker buys her honey from me. Her baklava is almost as old as my recipe.');
SABU.hi.fi.push('Skarabee vierittää aurinkoa taivaan halki. Sabu vierittää hintoja. Kumpikin on ikivanhaa työtä.','Olen myynyt lamppuja faaraoille ja köysiä astronauteille. Sinä olet jossain siltä väliltä.','Älä välitä seinien silmistä. Ne vahtivat vain varkaita.','Oletko tavannut teemiehen? Hän antaa teetä. Ilmaiseksi. En ymmärrä häntä.','Leipuri-Hilda ostaa hunajansa minulta. Hänen baklavansa on melkein yhtä vanha kuin reseptini.');

/* ================================================= the stoic who brews herbal tea */
NPCD.stoic={names:['Teofilus','Aurelia','Zenobius'],
  lines:{en:["Some things are up to us, and some are not. Spend your strength only on the first kind.", "You cannot choose what happens. You can choose what you make of it.", "We suffer more in imagination than in reality.", "Before you speak, ask: is it true, is it kind, is it needed?", "Every morning, remember: today you will meet rude people. Be patient with them anyway.", "Wealth is not having many things. It is wanting few.", "Anger is a heavy stone you carry to throw at someone else.", "Do not wish for things to happen as you want. Want them to happen as they do.", "Nobody is free who is not master of himself.", "Waste no more time arguing what a good person should be. Be one.", "If someone insults you, consider whether they are right. If they are, learn. If not, smile.", "The present moment is the only one you are given. Drink your tea while it is warm.", "Fear of loss is often worse than the loss itself.", "Be kind. Everyone you meet is fighting a battle you know nothing about.", "Small daily habits make a life. Big plans only make plans.", "Blueberries. They are blue, and they are berries. Some things are exactly what they say.", "Remember that you will die. It makes the tea taste better.", "You have two ears and one mouth. Listen twice as much as you speak."],
   fi:["Jotkin asiat ovat meidän vallassamme, jotkin eivät. Käytä voimasi vain ensimmäisiin.", "Et voi valita, mitä tapahtuu. Voit valita, mitä teet sillä.", "Kärsimme enemmän mielikuvissa kuin todellisuudessa.", "Ennen kuin puhut, kysy: onko se totta, onko se ystävällistä, onko se tarpeen?", "Muista joka aamu: tänään tapaat tylyjä ihmisiä. Ole kärsivällinen heidän kanssaan silti.", "Rikkaus ei ole sitä, että omistaa paljon. Se on sitä, että haluaa vähän.", "Viha on raskas taakka, jota kannat heittääksesi sen jonkun toisen päälle.", "Älä toivo, että asiat tapahtuvat niin kuin haluat. Halua, että ne tapahtuvat niin kuin ne tapahtuvat.", "Kukaan ei ole vapaa, joka ei hallitse itseään.", "Älä tuhlaa aikaa väittelemällä siitä, millainen hyvän ihmisen pitäisi olla. Ole sellainen.", "Jos joku loukkaa sinua, mieti onko hän oikeassa. Jos on, opi. Jos ei, hymyile.", "Tämä hetki on ainoa, joka sinulle annetaan. Juo teesi, kun se on vielä lämmintä.", "Menettämisen pelko on usein pahempi kuin itse menetys.", "Ole ystävällinen. Jokainen kohtaamasi käy taistelua, josta et tiedä mitään.", "Pienet päivittäiset tavat tekevät elämän. Suuret suunnitelmat tekevät vain suunnitelmia.", "Blueberries. Ne ovat sinisiä, ja ne ovat marjoja. Jotkin asiat ovat juuri sitä, miltä kuulostavat.", "Muista, että kuolet. Se saa teen maistumaan paremmalta.", "Sinulla on kaksi korvaa ja yksi suu. Kuuntele kaksi kertaa enemmän kuin puhut."]},
  tea:{en:['Here, chamomile tea. Sit down and breathe. (Health restored)','Tea first. Thinking later. (Health restored)','Linden blossom tea. Drink slowly, the world can wait. (Health restored)','Nettle tea. It stings when picked and heals when drunk. (Health restored)','Blueberry leaf tea. Blue, and from berries. Honest tea. (Health restored)'],
       fi:['Tässä, kamomillateetä. Istu alas ja hengitä. (Terveys palautui)','Ensin tee. Ajatellaan myöhemmin. (Terveys palautui)','Lehmuksenkukkateetä. Juo hitaasti, maailma odottaa. (Terveys palautui)','Nokkosteetä. Poimiessa se polttaa, juodessa parantaa. (Terveys palautui)','Mustikanlehtiteetä. Sinistä ja marjoista. Rehellistä teetä. (Terveys palautui)']},
  gift(){return ''}};
function stoicTalk(n){const ready=!n.teaAt||frame-n.teaAt>2400;
  if(ready){n.teaAt=frame;P.maxHp=Math.max(P.maxHp,3);P.hp=Math.max(P.hp,P.maxHp);P.poison=0;P.cozy=900;sfx.tea();
    if(!n.gift){n.gift=true;store.stats.talks++;save();store.stats.teas=(store.stats.teas||0)+1}const L=tr(NPCD[n.type].tea);const tl=L[(n.ti=(n.ti||0)+1)%L.length];if(n.domain&&!n.welcomed){n.welcomed=true;return pickR(tr(DOMAIN_HELLO))+' '+tl}return tl}
  const ls=tr(NPCD[n.type].lines);const l=ls[n.li%ls.length];n.li++;return l}

/* talking replaces the old one-liner: voices, the philosopher and the bakery */
function talkTo(n){
  if(n.type==='baker'){if(!n.shop.greeted){n.shop.greeted=true}openShop(n.shop);return}
  if(PEOPLE_TALK[n.type]){PEOPLE_TALK[n.type](n);checkAch();return}
  const D=NPCD[n.type];let line;
  if(n.type==='stoic'||n.type==='hippie')line=stoicTalk(n);
  else if(!n.gift){n.gift=true;line=D.gift();if(n.type==='coffee'){P.mats.beans=(P.mats.beans||0)+2;setTimeout(()=>floatText(P.x+5,P.y-14,'+2 '+tr(MATS.beans.n),MATS.beans.c),600)}store.stats.talks++;save();
    const k=n.type==='knitter'?(['h:beanie','n:scarf','t:sweater'].find(k=>!wOwn(k))||randomCosmetic()):Math.random()<.4?randomCosmetic():null;if(k)setTimeout(()=>gainCosmetic(k,n.x,n.y-24),900)}
  else{line=extraLine(n);if(!line){const ls=tr(D.lines);line=ls[n.li%ls.length];n.li++}}
  showTalk(npcTitle(n),line,n.type);checkAch()}

/* ================================================= Hilda's bakery: pastries that change you for the rest of the run */
const BAKER={hi:{en:['Fresh from the oven! Well, from the lava. Same thing, really.','Every pastry changes you a little. For the better. That is what pastries are for.','My sourdough starter is older than the pyramids. Sabu insists it is the other way round.','Mind the crumbs, the ants are listening.','The philosopher comes by for a cinnamon bun every Tuesday. Or what he calls Tuesday.','Butter, flour, patience. And a pinch of something from layer nine. Do not ask.'],
                 fi:['Tuoretta uunista! No, laavasta. Sama asia oikeastaan.','Jokainen leivos muuttaa sinua vähän. Parempaan suuntaan. Sitä varten leivokset ovat.','Juureni on vanhempi kuin pyramidit. Sabu väittää, että toisin päin.','Varo murusia, muurahaiset kuuntelevat.','Filosofi käy hakemassa korvapuustin joka tiistai. Tai sen, mitä hän kutsuu tiistaiksi.','Voita, jauhoja, kärsivällisyyttä. Ja hyppysellinen jotain kerrokselta yhdeksän. Älä kysy.']},
  buy:{en:['Eat it while it is warm!','There, you look stronger already.','Crumbs on your chin. No, the other side.','That one is my favourite. Do not tell the others.'],fi:['Syö lämpimänä!','Kas noin, näytät jo vahvemmalta.','Muruja leuassa. Ei, toisella puolella.','Tuo on minun suosikkini. Älä kerro muille.']},
  no:{en:['Oh dear, a little short. Have a free sniff instead.','Come back with a bit more gold, sweetheart.'],fi:['Voi voi, vähän jää vajaaksi. Ota ilmainen nuuhkaisu.','Tule takaisin, kun on vähän enemmän kultaa, kultaseni.']}};
const BAKE_ITEMS=[
 {id:'b_bun',n:{en:'Cinnamon bun',fi:'Korvapuusti'},d:{en:'+1 heart for the rest of the run.',fi:'+1 sydän loppumatkaksi.'},p:600,ic:'b_bun',once:true,ok:()=>!P.bake.b_bun,buy:()=>{P.bake.b_bun=1;P.maxHp++;P.hp++}},
 {id:'b_donut',n:{en:'Jam doughnut',fi:'Hillomunkki'},d:{en:'Sugar on your nose, light in your eyes: your lamp reaches further.',fi:'Sokeria nenässä, valoa silmissä: lamppusi valaisee kauemmas.'},p:450,ic:'b_donut',once:true,ok:()=>!P.bake.b_donut,buy:()=>{P.bake.b_donut=1;P.lampR+=1.3}},
 {id:'b_butter',n:{en:'Butter-eye bun',fi:'Voisilmäpulla'},d:{en:'Your pickaxe swings a fifth faster.',fi:'Hakkusi heilahtaa viidenneksen nopeammin.'},p:650,ic:'b_butter',once:true,ok:()=>!P.bake.b_butter,buy:()=>{P.bake.b_butter=1;P.digK=.8}},
 {id:'b_crois',n:{en:'Croissant',fi:'Voisarvi'},d:{en:'Light as air: you jump higher.',fi:'Kevyt kuin ilma: hyppäät korkeammalle.'},p:500,ic:'b_crois',once:true,ok:()=>!P.bake.b_crois,buy:()=>{P.bake.b_crois=1;P.jumpV+=.55}},
 {id:'b_pie',n:{en:'Karelian pie',fi:'Karjalanpiirakka'},d:{en:'Sturdy legs: you can fall three tiles further unhurt.',fi:'Tukevat jalat: voit pudota kolme ruutua pidemmälle satuttamatta itseäsi.'},p:400,ic:'b_pie',once:true,ok:()=>!P.bake.b_pie,buy:()=>{P.bake.b_pie=1;P.fallPlus=3}},
 {id:'b_bakl',n:{en:'Honey baklava',fi:'Hunajabaklava'},d:{en:'Everything you find is worth 15 % more.',fi:'Kaikki löytämäsi on 15 % arvokkaampaa.'},p:900,ic:'b_bakl',once:true,ok:()=>!P.bake.b_bakl,buy:()=>{P.bake.b_bakl=1;P.goldK=1.15}},
 {id:'b_mac',n:{en:'Lavender macaron',fi:'Laventelimacaron'},d:{en:'Poison wears off twice as fast.',fi:'Myrkky haihtuu kaksi kertaa nopeammin.'},p:350,ic:'b_mac',once:true,ok:()=>!P.bake.b_mac,buy:()=>{P.bake.b_mac=1;P.poisonK=.5}},
 {id:'b_blue',n:{en:'Blueberry pie',fi:'Mustikkapiirakka'},d:{en:'Blue, and berries. You can hold your breath twice as long.',fi:'Sinistä ja marjoja. Pidätät hengitystä kaksi kertaa pidempään.'},p:380,ic:'b_blue',once:true,ok:()=>!P.bake.b_blue,buy:()=>{P.bake.b_blue=1;P.maxBreath=200;P.breath=200}}
];
(function bakeIcons(){
  ICON.b_bun=pixIcon(p=>{p(3,6,10,7,'#b8743a');p(4,5,8,1,'#c8844a');p(5,7,6,4,'#8a4a1e');p(6,8,4,2,'#c8844a');p(7,8,2,1,'#6a3410');for(const [x,y] of [[4,6],[9,5],[11,8],[5,11]])p(x,y,1,1,'#fff6e0')});
  ICON.b_donut=pixIcon(p=>{p(3,5,10,7,'#c8884a');p(4,4,8,1,'#c8884a');p(4,4,8,5,'#ff8ab0');p(3,6,10,2,'#ff8ab0');p(7,7,2,2,'#2a2026');p(5,5,1,1,'#fff');p(10,6,1,1,'#7fe8ff');p(6,8,1,1,'#ffe08a');p(4,11,8,1,'#a86a30')});
  ICON.b_butter=pixIcon(p=>{p(3,6,10,7,'#c8884a');p(4,5,8,1,'#d8985a');p(6,7,4,3,'#ffe08a');p(7,7,2,1,'#fff6c0');for(const [x,y] of [[4,7],[11,9],[5,11],[10,6]])p(x,y,1,1,'#fff')});
  ICON.b_crois=pixIcon(p=>{p(2,9,3,3,'#c07a34');p(4,7,3,5,'#d8944a');p(7,6,3,6,'#e0a454');p(10,7,3,5,'#d8944a');p(12,9,2,3,'#c07a34');p(5,8,1,3,'#a86020');p(9,7,1,4,'#a86020');p(8,6,2,1,'#f0c070')});
  ICON.b_pie=pixIcon(p=>{p(2,6,12,6,'#8a5a34');p(3,5,10,1,'#8a5a34');p(4,6,8,4,'#ffd060');p(5,7,3,2,'#fff0a0');for(let i=0;i<5;i++)p(2+i*3,11,2,1,'#6a3a1a')});
  ICON.b_bakl=pixIcon(p=>{p(3,5,10,8,'#d8a040');for(let k=0;k<4;k++)p(3,6+k*2,10,1,'#b07a20');p(6,4,4,1,'#5a8a3a');p(7,3,2,1,'#7aaa4a');p(4,5,8,1,'#f0c860')});
  ICON.b_mac=pixIcon(p=>{p(4,4,8,3,'#b08ad8');p(3,5,10,1,'#b08ad8');p(4,7,8,2,'#f3ead8');p(4,9,8,3,'#b08ad8');p(3,10,10,1,'#b08ad8');p(5,4,2,1,'#d0b0f0')});
  ICON.b_blue=pixIcon(p=>{p(2,7,12,6,'#c8884a');p(3,6,10,1,'#d8985a');p(4,7,8,4,'#3a4aa8');for(const [x,y] of [[5,8],[8,7],[10,9],[6,10]])p(x,y,1,1,'#7a8aff');p(2,12,12,1,'#a86a30')});
})();
function drawBakerPortrait(c){const g=c.getContext('2d');c.width=32;c.height=32;const p=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  p(0,0,32,32,'#3a2418');p(4,25,24,7,'#f3ead8');p(12,25,8,7,'#e8d8c0');p(8,9,16,15,'#ecc49a');p(9,18,4,3,'#f0a0a0');p(19,18,4,3,'#f0a0a0');
  p(11,14,3,2,'#2a1a10');p(18,14,3,2,'#2a1a10');p(14,20,4,1,'#a04a3a');p(7,8,18,3,'#8a4a2a');p(8,1,16,8,'#ffffff');p(6,6,20,3,'#f3ead8');p(10,2,3,2,'#e8e2d0');p(19,3,2,2,'#e8e2d0');p(22,12,2,2,'#fff')}

function spawnBakery(lv,H){const {ri,r,freeRect,protRect}=H;if(inVoid||(!(DBG&&DBG.bake)&&(lv<2||r()>.4)))return;
  for(let a=0;a<300;a++){const w=9,h=5,x0=ri(3,MW-w-3),y0=ri(9,MH-h-6);if(!freeRect(x0,y0,w,h))continue;
    if(shop&&Math.abs(x0-shop.x0)<18&&Math.abs(y0-shop.y0)<10)continue;if(junk&&Math.abs(x0-junk.x0)<16&&Math.abs(y0-junk.y0)<10)continue;
    for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const wall=y===y0||y===y0+h-1||x===x0||x===x0+w-1;grid[idx(x,y)]=wall?(y===y0+h-1?BRICK:DIRT):AIR}
    for(const dx of [0,w-1])for(const dy of [h-3,h-2])grid[idx(x0+dx,y0+dy)]=AIR;
    for(let k=1;k<=3;k++)for(const dy of [h-3,h-2]){for(const xx of [x0-k,x0+w-1+k])if(grid[idx(xx,y0+dy)]!==BED&&!prot[idx(xx,y0+dy)])grid[idx(xx,y0+dy)]=AIR}
    for(let k=1;k<=3;k++){for(const xx of [x0-k,x0+w-1+k]){const yy=y0+h-1;if(grid[idx(xx,yy)]===AIR)grid[idx(xx,yy)]=STONE}}
    protRect(x0-4,y0-1,x0+w+3,y0+h);
    const bx=x0+3,fy=y0+h-1;
    npcs.push({type:'baker',name:'Hilda',x:bx*T+8,y:fy*T,face:1,gift:true,li:0,anim:0,wx:0,wy:0,shop:{kind:'bake',stock:null,greeted:false,x0,y0}});
    decos.push({tx:x0+5,ty:fy-1,k:'oven',sx:0,sy:1},{tx:x0+1,ty:y0+1,k:'breadshelf',sx:0,sy:-1},{tx:x0+2,ty:fy-1,k:'flourbag',sx:0,sy:1});
    break}}

/* ================================================= drawing: the philosopher, the baker, the oven */
const FOLK_DRAW={
  stoic(n){const x=Math.round(n.x),y=Math.round(n.y),f=n.face,b=Math.sin(n.anim*.03)>.95?1:0,sip=(n.anim%420)<50;
    // a flat stone seat and the teapot beside it
    R(x-7,y-4,14,4,'#6a6c77');R(x-7,y-4,14,1,'#8a8c96');
    const tx=x-f*12;R(tx-3,y-5,7,5,'#c8d8d0');R(tx-2,y-6,5,1,'#a8c0b8');R(tx-1,y-7,3,1,'#5a7a70');R(tx+(f>0?-5:4),y-4,2,1,'#a8c0b8');R(tx+(f>0?4:-4),y-4,1,3,'#a8c0b8');R(tx-3,y-3,7,1,'#7a9a90');
    ctx.save();ctx.translate(x,y-4);if(f<0)ctx.scale(-1,1);
    // robe, folded legs, sash
    R(-5,-3,11,3,'#e8e0cc');R(4,-3,3,3,'#d8d0bc');R(5,0,3,1,'#6b4426');
    R(-4,-11-b,8,8,'#efe8d6');R(-4,-11-b,1,8,'#d8d0bc');R(-3,-10-b,2,7,'#5a7aa8');R(-1,-6-b,3,1,'#5a7aa8');
    // head: bald, laurel, long grey beard, closed calm eyes
    R(-3,-16-b,7,5,'#d8a47a');R(-3,-17-b,6,1,'#d8a47a');R(-4,-16-b,1,2,'#5a8a3a');R(3,-16-b,2,1,'#5a8a3a');R(-3,-17-b,1,1,'#7aaa4a');R(1,-17-b,2,1,'#7aaa4a');
    R(1,-14-b,2,1,'#3a2a20');R(-1,-12-b,6,4,'#d8d4cc');R(0,-8-b,4,2,'#c8c4bc');R(1,-6-b,2,1,'#c8c4bc');
    // the cup: lifted to the lips now and then
    const cy=sip?-13:-7;R(4,cy-b,3,3,'#f3ead8');R(4,cy-b,3,1,'#c08a4a');R(7,cy+1-b,1,1,'#f3ead8');R(3,cy+2-b,2,2,'#d8a47a');
    ctx.restore()},
  baker(n){const x=Math.round(n.x),y=Math.round(n.y),b=Math.sin(n.anim*.05)>.92?1:0,roll=Math.sin(frame*.12)*2;
    // counter with bread
    R(x+6,y-8,14,8,'#8a5a34');R(x+6,y-8,14,1,'#b07a48');R(x+8,y-11,5,3,'#c8884a');R(x+9,y-12,3,1,'#d8a05a');R(x+14,y-10,4,2,'#d8b070');R(x+15,y-11,2,1,'#e8c890');
    ctx.save();ctx.translate(x,y-4);
    R(-3,-3,3,3,'#4a3a48');R(1,-3,3,3,'#4a3a48');R(-4,0,4,1,'#2a1e16');R(1,0,4,1,'#2a1e16');
    R(-5,-11-b,10,8,'#c86a6a');R(-4,-11-b,8,8,'#f3ead8');R(-4,-11-b,8,1,'#fff');
    R(-3,-16-b,7,5,'#ecc49a');R(2,-14-b,1,1,'#2a1a10');R(-1,-14-b,1,1,'#2a1a10');R(-2,-13-b,1,1,'#f0a0a0');R(3,-13-b,1,1,'#f0a0a0');R(0,-12-b,2,1,'#a04a3a');
    R(-4,-17-b,9,2,'#f3ead8');R(-3,-22-b,7,5,'#ffffff');R(-4,-21-b,1,3,'#f3ead8');R(4,-21-b,1,3,'#f3ead8');
    R(4,-8+roll*.3-b,7,2,'#c8a070');R(4,-8+roll*.3-b,1,2,'#8a6a40');R(10,-8+roll*.3-b,1,2,'#8a6a40');
    ctx.restore();
    if(frame%30===0)parts.push({x:x+10,y:y-12,vx:rand(-.1,.1),vy:-.25,life:50,max:50,col:'rgba(255,240,220,.35)',g:-.002,sz:1})}
};
function drawFolkDeco(d){const x=d.tx*T,y=d.ty*T;if(drawTentDeco(d)||drawEraDeco(d)||drawPeopleDeco(d)||drawAtmosDeco(d))return true;if(d.k==='vent'){drawVent(d);return true}if(d.k==='goldhole')return drawGoldHole(d);if(d.k==='ddoor'){drawDebugDoor(d);return true}
  if(d.k==='oven'){R(x-2,y-6,22,22,'#8a4a34');ctx.fillStyle='#9a5a3e';ctx.beginPath();ctx.arc(x+9,y+2,11,Math.PI,0);ctx.fill();R(x-2,y+2,22,14,'#9a5a3e');
    for(let k=0;k<4;k++)R(x-2,y+3+k*4,22,1,'#7a3a28');for(let k=0;k<3;k++)R(x+2+k*6,y-4,1,6,'#7a3a28');
    R(x+3,y+5,12,9,'#1a0c08');const fl=Math.sin(frame*.25)*.6+.8;ctx.fillStyle=`rgba(255,140,40,${.7*fl})`;ctx.fillRect(x+4,y+10,10,4);ctx.fillStyle=`rgba(255,220,120,${.8*fl})`;ctx.fillRect(x+6,y+12,6,2);
    R(x+5,y+7,8,2,'#c8884a');R(x+6,y+6,6,1,'#d8a05a');R(x+12,y-14,4,8,'#6a3a28');
    if(frame%14===0)parts.push({x:x+14,y:y-14,vx:rand(-.1,.1),vy:-.35,life:80,max:80,col:'rgba(200,190,180,.35)',g:-.002,sz:2});return true}
  if(d.k==='breadshelf'){R(x,y+9,30,2,'#6b4426');R(x,y+9,30,1,'#8a5a32');R(x+2,y+5,7,4,'#c8884a');R(x+3,y+4,5,1,'#d8a05a');R(x+11,y+6,5,3,'#b06a30');R(x+18,y+4,4,5,'#d8b070');R(x+23,y+6,6,3,'#c07a34');R(x+24,y+5,4,1,'#e0a454');
    ctx.font='5px "Pixelify Sans", monospace';ctx.fillStyle='#f3dfb0';ctx.textAlign='center';ctx.fillText(LANG==='fi'?'LEIPOMO':'BAKERY',x+15,y+16);ctx.textAlign='left';return true}
  if(d.k==='flourbag'){R(x+3,y+7,10,9,'#e8e2d0');R(x+4,y+6,8,1,'#d8d0bc');R(x+6,y+5,4,1,'#c8a070');R(x+5,y+10,6,3,'#c8b090');return true}
  return false}
function folkLight(hole,glows){tentLight(hole,glows);atmosLight(hole,glows);bottomLight(hole,glows);peopleLight(hole,glows);for(const d of decos)if(d.k==='oven'){const fl=1+Math.sin(frame*.25)*.06;hole(d.tx*T+9,d.ty*T+8,4.4*T*fl,.9);glows.push([d.tx*T+9,d.ty*T+10,3*T,'rgba(255,150,60,.25)'])}
  for(const f of fishes)if(f.glow)glows.push([f.x,f.y,10,'rgba(120,240,220,.35)']);
  if(P&&P.cozy>0){const k=Math.min(1,P.cozy/120);hole(P.x+P.w/2,P.y,(P.lampR+3)*T*k,.55*k);glows.push([P.x+P.w/2,P.y,6*T*k,`rgba(255,180,110,${.18*k})`])}}
function folkOverlay(){if(!P||!(P.cozy>0))return;const k=Math.min(1,P.cozy/120);
  ctx.save();ctx.globalCompositeOperation='soft-light';ctx.fillStyle=`rgba(255,170,90,${.55*k})`;ctx.fillRect(0,0,cv.width,cv.height);
  ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.height*.1,cv.width/2,cv.height/2,cv.height*.8);
  g.addColorStop(0,`rgba(255,200,140,${.16*k})`);g.addColorStop(1,`rgba(255,120,90,${.05*k})`);ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);ctx.restore()}

/* ================================================= fish you can see in the water */
function spawnAmbientFish(){fishes=[];const cells=[];
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++)if(grid[idx(x,y)]===WATER&&(isWater(x-1,y)||isWater(x+1,y)))cells.push([x,y]);
  const n=cells.length<4?0:Math.min(18,Math.max(1,Math.floor(cells.length/6)));
  for(let k=0;k<n;k++){const [x,y]=cells[Math.random()*cells.length|0];const r=Math.random();
    const kind=r<.06?'gold':r<.16&&level>=3?'glow':r<.5?'perch':'silver';
    fishes.push({x:x*T+8,y:y*T+8,dir:Math.random()<.5?-1:1,sp:.25+Math.random()*.3,ty:y*T+8,t:Math.random()*99,kind,glow:kind==='glow',
      c:{gold:'#f2a84b',glow:'#7ff0d8',perch:'#8aa86a',silver:'#c8d0dc'}[kind],len:kind==='glow'?7:kind==='gold'?4:5})}}
function updFish(){if(!fishes.length)return;const pcx=P.x+P.w/2,pcy=P.y+P.h/2;
  for(const f of fishes){f.t++;const tx=Math.floor(f.x/T),ty=Math.floor(f.y/T);
    if(!isWater(tx,ty)){if(isWater(tx,ty+1)){f.y+=1.5;continue}f.dead=true;particle(f.x,f.y,f.c,4,1.2,18,.2,1);continue}
    const d=Math.hypot(pcx-f.x,pcy-f.y),scared=d<2.6*T&&P.inWater;
    if(scared){f.dir=f.x<pcx?-1:1;f.fast=30}
    const sp=f.sp*(f.fast>0?3:1);if(f.fast>0)f.fast--;
    const nx=f.x+f.dir*(sp+3);if(!isWater(Math.floor(nx/T),ty)){f.dir*=-1}else f.x+=f.dir*sp;
    if(f.t%90===0||Math.abs(f.ty-f.y)<.5&&Math.random()<.01){const cand=f.y+rand(-12,12);if(isWater(tx,Math.floor(cand/T)))f.ty=cand}
    f.y+=(f.ty-f.y)*.02+Math.sin(f.t*.08)*.05;
    if(Math.random()<.002)f.dir*=-1}
  fishes=fishes.filter(f=>!f.dead)}
function drawFish(){for(const f of fishes){if(Math.abs(f.x-cam.x-VW/2)>VW||Math.abs(f.y-cam.y-VH/2)>VH)continue;
  const x=Math.round(f.x),y=Math.round(f.y),w=Math.sin(f.t*(f.fast>0?.6:.25)),L=f.len;
  ctx.save();ctx.translate(x,y);if(f.dir<0)ctx.scale(-1,1);ctx.globalAlpha=.85;
  ctx.fillStyle=f.c;ctx.beginPath();ctx.ellipse(0,0,L*.6,f.kind==='glow'?1:1.6,0,0,7);ctx.fill();
  ctx.beginPath();ctx.moveTo(-L*.5,0);ctx.lineTo(-L*.5-3,-1.6+w);ctx.lineTo(-L*.5-3,1.6+w);ctx.fill();
  if(f.kind==='perch'){ctx.fillStyle='#4a6a3a';ctx.fillRect(-1,-1.5,1,3);ctx.fillRect(1,-1.5,1,3)}
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(-1,-1,3,1);ctx.fillStyle='#101418';ctx.fillRect(Math.round(L*.35),-1,1,1);
  ctx.restore()}ctx.globalAlpha=1}

/* ================================================= per-frame */
function updFolk(){if(!P)return;if(P.cozy>0)P.cozy--;if(frame%20===0)updCraftTip();
  for(const n of npcs){if(n.type!=='stoic'||Math.abs(n.x-P.x)>VW)continue;if(frame%11===0){const f=n.face,sip=(n.anim%420)<50;parts.push({x:n.x+f*(sip?6:6),y:n.y-(sip?18:12),vx:rand(-.1,.1),vy:-.3,life:45,max:45,col:'rgba(235,235,235,.4)',g:-.002,sz:1})}
    if(frame%13===0)parts.push({x:n.x-n.face*12,y:n.y-12,vx:-n.face*.15,vy:-.25,life:40,max:40,col:'rgba(235,235,235,.35)',g:-.002,sz:1})}
  updFish();updVents();updPeople();updDomain();updTutorial();updFireRest()}

Object.assign(STR.en,{bakeTitle:"Hilda's Bakery",fireS:'Campfire (Use: place)',torchS:'Torch (Use: place)',discT:'A disc from the computer',dbUnlock:'WARDROBE DATA: a new piece of clothing is yours.',craftHint:'You can craft something · Q'});
Object.assign(STR.fi,{bakeTitle:'Hildan leipomo',fireS:'Nuotio (Käytä: aseta)',torchS:'Soihtu (Käytä: aseta)',discT:'Romppu tietokoneesta',dbUnlock:'VAATEKAAPPIDATA: uusi vaate on nyt sinun.',craftHint:'Voit askarrella jotain · Q'});

/* ================================================= a small crafting reminder beside the hotbar */
function updCraftTip(){let el=$('craftTip');if(!el){el=document.createElement('button');el.id='craftTip';el.type='button';el.addEventListener('pointerdown',e=>{e.stopPropagation();e.preventDefault();ensureAudio();if(state==='play')openCraft()});$('hud').appendChild(el)}
  const hb=$('hotbar');if(!P||state!=='play'||!hb||!hb.offsetParent){el.hidden=true;return}el.hidden=false;
  const at=nearStation(),ready=RECIPES.filter(r=>knowsRecipe(r.id)&&Object.entries(r.need).every(([m,n])=>(P.mats[m]||0)>=n)&&(!r.station||at)&&(r.meal||!r.ok||r.ok())).length;
  if(!ready){el.hidden=true;return}const html=esc(coarse?t('craftHint').replace(' · Q',''):t('craftHint'));
  if(el._h!==html){el._h=html;el.innerHTML=html}el.classList.toggle('ready',ready>0);
  const r=hb.getBoundingClientRect(),hr=$('hud').getBoundingClientRect();el.style.left=(r.right-hr.left+(hb.children.length&&r.width>4?40:-60))+'px';el.style.top=(r.bottom-hr.top-el.offsetHeight)+'px'}
