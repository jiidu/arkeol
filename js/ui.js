/*
  Arkeol v0.3.2 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
/* =========================================================== achievements */
const ACH=[
 {id:'first_gold',n:{en:'First Nugget',fi:'Ensimmäinen hippu'},d:{en:'Pick up your first gold nugget.',fi:'Kerää ensimmäinen kultahippu.'}},
 {id:'first_gem',n:{en:'A Glint in the Dark',fi:'Kimallus pimeässä'},d:{en:'Find a diamond.',fi:'Löydä timantti.'}},
 {id:'rich5k',n:{en:'Gold Fever',fi:'Kultakuume'},d:{en:'Earn $5,000 in one expedition.',fi:'Ansaitse $5 000 yhdellä retkellä.'}},
 {id:'rich25k',n:{en:'Rich as a Pharaoh',fi:'Rikas kuin farao'},d:{en:'Earn $25,000 in one expedition.',fi:'Ansaitse $25 000 yhdellä retkellä.'}},
 {id:'depth200',n:{en:'Deeper',fi:'Syvemmälle'},d:{en:'Reach a depth of 200 m.',fi:'Saavuta 200 metrin syvyys.'}},
 {id:'depth400',n:{en:'Heart of the Shaft',fi:'Kuilun sydän'},d:{en:'Reach a depth of 400 m.',fi:'Saavuta 400 metrin syvyys.'}},
 {id:'spider10',n:{en:'Arachnophobe',fi:'Hämähäkkiallergia'},d:{en:'Kill 10 spiders in total.',fi:'Tapa yhteensä 10 hämähäkkiä.'}},
 {id:'wolf5',n:{en:'Wolf Tamer',fi:'Susien kesyttäjä'},d:{en:'Kill 5 wolves in total.',fi:'Tapa yhteensä 5 sutta.'}},
 {id:'stomp',n:{en:'Underfoot',fi:'Saappaan alla'},d:{en:'Kill an enemy by jumping on it.',fi:'Tapa vihollinen hyppäämällä sen päälle.'}},
 {id:'bomb20',n:{en:'Demolition Expert',fi:'Räjäytysmestari'},d:{en:'Detonate 20 bombs in total.',fi:'Räjäytä yhteensä 20 pommia.'}},
 {id:'dig500',n:{en:'Human Mole',fi:'Ihmismyyrä'},d:{en:'Dig 500 tiles in total.',fi:'Kaiva yhteensä 500 ruutua.'}},
 {id:'dodge',n:{en:'Close Call',fi:'Väistöliike'},d:{en:'Trigger an arrow trap and come away unscathed.',fi:'Laukaise nuoliansa ja selviä naarmuitta.'}},
 {id:'web',n:{en:'Tangled',fi:'Seittisolmu'},d:{en:'Get caught in a spider web.',fi:'Juutu hämähäkinseittiin.'}},
 {id:'shower',n:{en:'Cold Shower',fi:'Suihkussa'},d:{en:'Stand under a waterfall.',fi:'Seiso vesiputouksen alla.'}},
 {id:'diver',n:{en:'Diver',fi:'Sukeltaja'},d:{en:'Stay underwater for five seconds straight.',fi:'Ole veden alla viisi sekuntia yhtä kyytiä.'}},
 {id:'paper5',n:{en:'Archivist',fi:'Arkistonhoitaja'},d:{en:'Find 5 scraps of paper.',fi:'Löydä 5 paperinpalaa.'}},
 {id:'photos',n:{en:'Photo Album',fi:'Muistojen albumi'},d:{en:'Find all 8 photographs.',fi:'Löydä kaikki 8 valokuvaa.'}},
 {id:'relic3',n:{en:'Museum Piece',fi:'Museon helmi'},d:{en:'Find 3 different relics.',fi:'Löydä 3 erilaista relikkiä.'}},
 {id:'buy5',n:{en:'Regular Customer',fi:'Vakioasiakas'},d:{en:'Buy 5 items from Sabu.',fi:'Osta Sabulta 5 tavaraa.'}},
 {id:'pacifist',n:{en:'Peaceful Archaeologist',fi:'Rauhan arkeologi'},d:{en:'Clear layer 2 or deeper without killing anything.',fi:'Läpäise kerros 2 tai syvempi tappamatta ketään.'}},
 {id:'lastheart',n:{en:'On the Last Heart',fi:'Viimeisellä sydämellä'},d:{en:'Go through a door with one heart left.',fi:'Siirry seuraavaan kerrokseen yhdellä sydämellä.'}},
 {id:'coffee',n:{en:'Boiled Coffee',fi:'Pannukahvit'},d:{en:'Drink a cup of boiled coffee underground.',fi:'Juo kuppi pannukahvia maan alla.'}},
 {id:'talk5',n:{en:'Underground Social Life',fi:'Maanalainen seuraelämä'},d:{en:'Talk with five underground dwellers.',fi:'Juttele viiden maanalaisen asukkaan kanssa.'}},
 {id:'fish1',n:{en:'First Catch',fi:'Ensimmäinen saalis'},d:{en:'Land a fish from an underground pool.',fi:'Nosta kala maanalaisesta altaasta.'}},
 {id:'fish10',n:{en:'Shaft Angler',fi:'Kuilun kalastaja'},d:{en:'Land 10 catches in total.',fi:'Nosta yhteensä 10 saalista.'}},
 {id:'mummy3',n:{en:'Unwrapped',fi:'Kääreet auki'},d:{en:'Put three mummies to rest.',fi:'Kaada kolme muumiota.'}},
 {id:'rockplate',n:{en:'Clever Archaeologist',fi:'Ovela arkeologi'},d:{en:'Set off an arrow trap with a thrown stone.',fi:'Laukaise nuoliansa heitetyllä kivellä.'}},
 {id:'bat10',n:{en:'Night Shift',fi:'Yövuoro'},d:{en:'Take down 10 bats in total.',fi:'Kaada yhteensä 10 lepakkoa.'}},
 {id:'mimic1',n:{en:'Not a Chest',fi:'Ei mikään arkku'},d:{en:'Defeat a mimic chest.',fi:'Voita matkija-arkku.'}},
 {id:'worm1',n:{en:'Wyrm Slayer',fi:'Madonkaataja'},d:{en:'Defeat a burrowing worm.',fi:'Kaada kaivajamato.'}},
 {id:'hacker',n:{en:'Root Access',fi:'Pääkäyttäjä'},d:{en:'Crack five old computers.',fi:'Murra viisi vanhaa tietokonetta.'}},
 {id:'vault1',n:{en:'Open Sesame',fi:'Seesam aukene'},d:{en:'Open a sealed vault.',fi:'Avaa sinetöity holvi.'}},
 {id:'sniper',n:{en:'Sharpshooter',fi:'Tarkka-ampuja'},d:{en:'Take down an enemy from afar with a bow, crossbow or pistol.',fi:'Kaada vihollinen kaukaa jousella, varsijousella tai pistoolilla.'}}
];
function unlock(id){if(store.ach[id])return;const a=ACH.find(a=>a.id===id);if(!a)return;store.ach[id]=Date.now();save();sfx.ach();
  const el=document.createElement('div');el.className='achT';el.innerHTML=`<small>${esc(t('achUnlocked'))}</small><b>${esc(tr(a.n))}</b>${esc(tr(a.d))}`;$('achs').appendChild(el);setTimeout(()=>el.remove(),4200)}
function checkAch(){const s=store.stats;
  if(P){if(P.earned>=5000)unlock('rich5k');if(P.earned>=25000)unlock('rich25k')}
  if(P&&(P.maxDepth||0)>=200)unlock('depth200');if(P&&(P.maxDepth||0)>=400)unlock('depth400');
  if(s.spiders>=10)unlock('spider10');if(s.wolves>=5)unlock('wolf5');if(s.bombs>=20)unlock('bomb20');if(s.blocks>=500)unlock('dig500');if(s.buys>=5)unlock('buy5');
  const papers=Object.keys(store.lore).filter(k=>k[0]==='p').length,photos=Object.keys(store.lore).filter(k=>k[0]==='f').length;
  if(s.fish>=10)unlock('fish10');if((s.mummies||0)>=3)unlock('mummy3');if(s.talks>=5)unlock('talk5');if(papers>=5)unlock('paper5');if(photos>=PHOTOS.length)unlock('photos');if(Object.keys(store.relics).filter(k=>RELICS.some(r=>r.id===k)).length>=3)unlock('relic3')}

/* =========================================================== screens */
let openPanel=null;
function openModal(html,wide){$('modalBody').innerHTML=html;$('modalCard').classList.toggle('wide',!!wide);if(state==='play')state='modal';$('modal').hidden=false;releaseAll();setTimeout(()=>$('modalClose').focus(),30)}
function closeModal(){$('modal').hidden=true;if(state==='modal')state='play';releaseAll()}
$('modalClose').addEventListener('click',closeModal);
const loreCount=c=>Object.keys(store.lore).filter(k=>k[0]===c).length;
function paperHTML(i){const p=PAPERS[i];return `<div class="paper"><div class="meta">${esc(tr(p.who))}</div><p>${esc(tr(p.body))}</p>${p.red?`<p class="red">${esc(tr(p.red))}</p>`:''}</div>`}
function showPaper(i,found){openModal(`${found?`<p class="prog" style="text-align:center;margin:0 0 10px">${esc(t('foundPaper',loreCount('p'),PAPERS.length))}</p>`:''}${paperHTML(i)}`)}
function showPhoto(i,found){openModal(`${found?`<p class="prog" style="text-align:center;margin:0 0 10px">${esc(t('foundPhoto',loreCount('f'),PHOTOS.length))}</p>`:''}<div class="polaroid"><canvas id="phc"></canvas><div class="cap">${esc(tr(PHOTOS[i].cap))}</div></div>`);drawPhoto(PHOTOS[i].draw,$('phc'))}
function showRelic(rel,isNew,found){openModal(`<div class="relicView"><canvas id="rlc"></canvas><div><div class="era">${esc(tr(ERA))}${isNew&&found?' · '+esc(t('newFind')):''}</div><h2>${esc(tr(rel.name))}</h2><div class="val">${fmt(rel.value)}</div><p>${esc(tr(rel.desc))}</p></div></div>`);drawRelic(rel.id,$('rlc'))}
function openScreen(id){if(openPanel)$(openPanel).hidden=true;openPanel=id;
  for(const s of ['menu','pause','over'])if(!$(s).hidden){$(s).dataset.was='1';$(s).hidden=true}
  if(id==='wardrobe')renderWardrobe();if(id==='archive')renderArchive(curTab);if(id==='achv')renderAch();$(id).hidden=false;const b=$(id).querySelector('.closeScreen');if(b)setTimeout(()=>b.focus(),30)}
function closePanel(silent){if(!openPanel)return;$(openPanel).hidden=true;openPanel=null;
  for(const s of ['menu','pause','over']){if(!silent&&$(s).dataset.was)$(s).hidden=false;delete $(s).dataset.was}}
document.addEventListener('click',e=>{const b=e.target.closest('[data-open]');if(!b)return;ensureAudio();openScreen(b.dataset.open)});
document.querySelectorAll('.closeScreen').forEach(b=>b.addEventListener('click',()=>closePanel()));
let curTab='papers';
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{curTab=b.dataset.tab;renderArchive(curTab)}));
function renderArchive(tab){
  document.querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.tab===tab)));
  const g=$('archGrid');g.innerHTML='';
  $('archProg').textContent=t('archProg',loreCount('p'),PAPERS.length,loreCount('f'),PHOTOS.length,RELICS.filter(r=>store.relics[r.id]).length,RELICS.length);
  const mkItem=(found,title,sub,onOpen,canvasFn)=>{const b=document.createElement('button');b.type='button';b.className='aitem'+(found?'':' lock');
    if(canvasFn&&found){const c=document.createElement('canvas');canvasFn(c);b.appendChild(c)}
    const ti=document.createElement('b');ti.textContent=found?title:'???';const s=document.createElement('span');s.textContent=found?sub:t('notFound');b.append(ti,s);
    if(found)b.addEventListener('click',onOpen);else b.disabled=true;g.appendChild(b)};
  if(tab==='papers')PAPERS.forEach((p,i)=>mkItem(store.lore['p'+i],tr(p.who),tr(p.body).split('\n')[0].slice(0,40)+'…',()=>showPaper(i)));
  if(tab==='photos')PHOTOS.forEach((p,i)=>mkItem(store.lore['f'+i],tr(p.cap),t('photo'),()=>showPhoto(i),c=>drawPhoto(p.draw,c)));
  if(tab==='relics')RELICS.forEach(r=>mkItem(store.relics[r.id],tr(r.name),`${tr(ERA)} · ${fmt(r.value)}`,()=>showRelic(r),c=>drawRelic(r.id,c)));
}
function renderAch(){const g=$('achGrid');g.innerHTML='';let n=0;
  const list=[...ACH].sort((a,b)=>(store.ach[b.id]?1:0)-(store.ach[a.id]?1:0));
  for(const a of list){const got=!!store.ach[a.id];if(got)n++;const d=document.createElement('div');d.className=got?'got':'locked';d.innerHTML=got?`<b>${esc(tr(a.n))}</b>${esc(tr(a.d))}`:`<b>???</b>${esc(t('achSecret'))}`;g.appendChild(d)}
  const s=store.stats;$('achProg').textContent=t('achProg',n,ACH.length,s.blocks,s.spiders,s.wolves,s.bombs)}

/* =========================================================== shop */
const SHOP_ITEMS=[
 {id:'heart',n:{en:'Heart',fi:'Sydän'},d:{en:'+1 life (max 8).',fi:'+1 elämä (enintään 8).'},p:900,ic:'heart',ok:()=>P.hp<8,buy:()=>{P.hp++;P.maxHp=Math.max(P.maxHp,P.hp)}},
 {id:'fuel',n:{en:'Jerrycan',fi:'Bensakanisteri'},d:{en:'Fills the drill tank.',fi:'Täyttää poran tankin.'},p:350,ic:'fuel',ok:()=>P.hasDrill&&P.fuel<100,buy:()=>{P.fuel=100;P.fuelWarn=false}},
 {id:'bombs',n:{en:'Bomb bag',fi:'Pommipussi'},d:{en:'3 bombs.',fi:'3 pommia.'},p:500,ic:'bomb',ok:()=>true,buy:()=>{P.bombs+=3}},
 {id:'ropes',n:{en:'Coil of rope',fi:'Köysikerä'},d:{en:'3 ropes.',fi:'3 köyttä.'},p:350,ic:'rope',ok:()=>true,buy:()=>{P.ropes+=3}},
 {id:'pick',n:{en:'Diamond pickaxe',fi:'Timanttihakku'},d:{en:'Hits twice as hard and swings faster.',fi:'Iskee kaksi kertaa kovempaa ja heiluu nopeammin.'},p:1600,ic:'pick2',once:true,ok:()=>P.pick<2,buy:()=>{P.pick=2}},
 {id:'drill0',n:{en:'Drill',fi:'Pora'},d:{en:'Bores through rock fast. Runs on fuel; comes with a full tank.',fi:'Poraa kiven läpi nopeasti. Kulkee bensalla, tankki täynnä.'},p:900,ic:'drill',once:true,ok:()=>!P.hasDrill,buy:()=>{P.hasDrill=true;P.fuel=100;P.slot=0}},
 {id:'bow',n:{en:'Bow',fi:'Jousipyssy'},d:{en:'A quiet ranged weapon. Comes with 10 arrows.',fi:'Hiljainen kaukoase. Mukana 10 nuolta.'},p:900,ic:'bow',once:true,ok:()=>!P.weapons.includes('bow'),buy:()=>{giveWeapon('bow');P.arrows+=10}},
 {id:'drill',n:{en:'Golden drill',fi:'Kultapora'},d:{en:'Drills almost twice as fast and saves fuel.',fi:'Poraa lähes kaksi kertaa nopeammin ja säästää bensaa.'},p:2200,ic:'drill2',once:true,ok:()=>P.hasDrill&&P.drill<2,buy:()=>{P.drill=2}},
 {id:'rod',n:{en:'Fishing rod',fi:'Onki'},d:{en:'Fish in underground pools. Catches are sold on the spot.',fi:'Kalasta maanalaisista altaista. Saaliin myyt saman tien.'},p:600,ic:'rod',once:true,ok:()=>!P.rod,buy:()=>{P.rod=true}},
 {id:'whip',n:{en:'Whip',fi:'Ruoska'},d:{en:'A quick melee weapon that cuts through webs.',fi:'Nopea lähiase, joka leikkaa seitit.'},p:700,ic:'whip',once:true,ok:()=>!P.weapons.includes('whip'),buy:()=>giveWeapon('whip')},
 {id:'xbow',n:{en:'Crossbow',fi:'Varsijousi'},d:{en:'Slow to draw, but the bolt flies straight and drops a wolf. Comes with 6 arrows.',fi:'Hidas virittää, mutta pultti lentää suoraan ja kaataa suden. Mukana 6 nuolta.'},p:2400,ic:'xbow',once:true,ok:()=>!P.weapons.includes('xbow'),buy:()=>{giveWeapon('xbow');P.arrows+=6}},
 {id:'pistol',n:{en:'Pistol',fi:'Pistooli'},d:{en:'Quick and accurate. Comes with 10 rounds.',fi:'Nopea ja tarkka. Mukana 10 patruunaa.'},p:1800,ic:'pistol',once:true,ok:()=>!P.weapons.includes('pistol'),buy:()=>{giveWeapon('pistol');P.ammo+=10}},
 {id:'gun',n:{en:'Shotgun',fi:'Haulikko'},d:{en:'Six pellets per shot. Comes with 8 rounds.',fi:'Kuusi haulia kerralla. Mukana 8 patruunaa.'},p:3200,ic:'gun',once:true,ok:()=>!P.weapons.includes('gun'),buy:()=>{giveWeapon('gun');P.ammo+=8}},
 {id:'arrows',n:{en:'Bundle of arrows',fi:'Nuolinippu'},d:{en:'+10 arrows for the bow and crossbow.',fi:'+10 nuolta jousipyssyyn ja varsijouseen.'},p:300,ic:'arrows',ok:()=>true,buy:()=>{P.arrows+=10}},
 {id:'ammo',n:{en:'Box of rounds',fi:'Patruunarasia'},d:{en:'+10 rounds for the pistol and shotgun.',fi:'+10 patruunaa pistooliin ja haulikkoon.'},p:400,ic:'ammo',ok:()=>P.weapons.includes('pistol')||P.weapons.includes('gun'),buy:()=>{P.ammo+=10}},
 {id:'lamp',n:{en:'Bright headlamp',fi:'Kirkas otsalamppu'},d:{en:'Your light reaches much further.',fi:'Valo kantaa selvästi kauemmas.'},p:1200,ic:'lamp',once:true,ok:()=>P.lampR<9,buy:()=>{P.lampR=9.6}},
 {id:'spring',n:{en:'Spring boots',fi:'Jousisaappaat'},d:{en:'You jump higher.',fi:'Hyppäät korkeammalle.'},p:1800,ic:'spring',once:true,ok:()=>P.jumpV<6,buy:()=>{P.jumpV=6.25}},
 {id:'soft',n:{en:'Soft soles',fi:'Pehmeät pohjat'},d:{en:'Falling no longer hurts.',fi:'Putoaminen ei enää satu.'},p:1400,ic:'soft',once:true,ok:()=>!P.softBoots,buy:()=>{P.softBoots=true}},
 {id:'mask',n:{en:'Diving mask',fi:'Sukellusmaski'},d:{en:'Twice the air underwater.',fi:'Kaksinkertainen happi veden alla.'},p:900,ic:'mask',once:true,ok:()=>P.maxBreath<200,buy:()=>{P.maxBreath=200;P.breath=200}},
 {id:'fez',n:{en:'Fez',fi:'Fez'},d:{en:"A hat from Sabu's own collection. Only one in stock.",fi:'Hattu Sabun omasta kokoelmasta. Vain yksi varastossa.'},p:600,ic:'fez',once:true,ok:()=>!wOwn('h:fez'),buy:()=>gainCosmetic('h:fez')},
 {id:'dye',n:{en:'Dye pouch',fi:'Väripussi'},d:{en:'A new colour for your clothes.',fi:'Uusi väri vaatteillesi.'},p:450,ic:'dye',ok:()=>!!randomCosmetic('d'),buy:()=>gainCosmetic(randomCosmetic('d'))},
 {id:'blueprint',n:{en:'Old blueprint',fi:'Vanha piirustus'},d:{en:'Teaches you a crafting recipe you do not know yet.',fi:'Opettaa käsityöreseptin, jota et vielä osaa.'},p:500,ic:'blueprint',ok:()=>lockedRecipes().length>0,buy:()=>learnRecipe(pickR(lockedRecipes()).id)},
 {id:'compass',n:{en:"Sabu's compass",fi:'Sabun kompassi'},d:{en:'An arrow points toward the door of the layer.',fi:'Nuoli osoittaa kerroksen oven suuntaan.'},p:1000,ic:'compass',once:true,ok:()=>!P.compass,buy:()=>{P.compass=true}}
];
const SABU={hi:{en:['Welcome, digger. Sabu has traded in these tunnels longer than anyone remembers.','The sand remembers everything. So do I, especially debts.','Ah, an archaeologist! The last one of you bought a rope. He never came back, but it was a good rope.','Gold? Good. The pharaohs accepted gold, and so do I.','Professor Varjo always said my prices were too steep. She was right.'],fi:['Tervetuloa, kaivaja. Sabu on käynyt kauppaa näissä käytävissä kauemmin kuin kukaan muistaa.','Hiekka muistaa kaiken. Niin muistan minäkin, erityisesti velat.','Ah, arkeologi! Viimeinen teistä osti köyden. Hän ei palannut, mutta köysi oli hyvä.','Kultaa? Hyvä. Faaraot hyväksyivät kultaa, ja niin hyväksyn minäkin.','Professori Varjo sanoi aina, että hinnat ovat liian kovat. Hän oli oikeassa.']},
  buy:{en:['A wise choice.','That will serve you well, at least until the next layer.','A deal is a deal. Ra sees all.','Thank you. Your gold is safe with me.'],fi:['Viisas valinta.','Tuo palvelee sinua hyvin, ainakin seuraavaan kerrokseen asti.','Kauppa on kauppa. Ra näkee kaiken.','Kiitos. Kultasi on minulla turvassa.']},
  no:{en:['Your pockets are lighter than your judgement.','Come back when you have dug a little more.','Sabu does not give credit. Not for three thousand years.'],fi:['Taskusi ovat kevyemmät kuin harkintasi.','Tule takaisin, kun olet kaivanut enemmän.','Sabu ei anna velaksi. Ei ole antanut kolmeen tuhanteen vuoteen.']}};
function makeStock(){const base=['heart','bombs','ropes',...(P.hasDrill?['fuel']:[]),P.weapons.length?'arrows':'bow'];if(!P.rod)base.push('rod');const extras=SHOP_ITEMS.filter(i=>(i.once||i.id==='ammo'||i.id==='dye'||i.id==='blueprint')&&!base.includes(i.id)).map(i=>i.id).sort(()=>Math.random()-.5).slice(0,5);return {ids:[...base,...extras],sold:{}}}
for(const id of ['pistol','gun','ammo','drill0','drill']){const i=SHOP_ITEMS.findIndex(x=>x.id===id);if(i>=0)SHOP_ITEMS.splice(i,1)}
const shopTalk=()=>curShop===junk?REIJO:SABU;
function openShop(which){const S=which||shop;if(!S||state!=='play')return;curShop=S;if(!S.stock)S.stock=S===junk?{ids:JUNK_ITEMS.map(i=>i.id),sold:{}}:makeStock();state='shop';releaseAll();$('sabuSay').textContent=pickR(tr(shopTalk().hi));if(S===junk)drawReijoPortrait($('sabu'));else drawSabu($('sabu'));
  document.querySelector('#shop h2').textContent=S===junk?t('junkTitle'):t('shopTitle');$('shop').classList.toggle('junkShop',S===junk);renderShop();$('shop').hidden=false;setTimeout(()=>$('shopClose').focus(),30)}
function closeShop(){$('shop').hidden=true;if(state==='shop')state='play';releaseAll();renderHotbar()}
$('shopClose').addEventListener('click',closeShop);
function renderShop(){const g=$('shopGrid');g.innerHTML='';$('shopMoney').textContent=t('wallet',fmt(P.money));
  const pr=it=>Math.round(it.p*(1+(level-2)*.06)/10)*10;
  const LIST=curShop===junk?JUNK_ITEMS:SHOP_ITEMS;
  for(const id of curShop.stock.ids){const it=LIST.find(x=>x.id===id);if(!it)continue;const sold=curShop.stock.sold[id]||(it.once&&!it.ok());
    const d=document.createElement('div');d.className='sitem'+(sold?' sold':'');
    d.innerHTML=`<img alt="" src="${ICON[it.ic]}"><div><b>${esc(tr(it.n))}</b><span>${esc(tr(it.d))}</span></div>`;
    const b=document.createElement('button');b.type='button';b.textContent=sold?t('sold'):fmt(pr(it));b.disabled=sold||!it.ok();
    b.addEventListener('click',()=>{const price=pr(it);if(P.money<price){sfx.nope();$('sabuSay').textContent=pickR(tr(shopTalk().no));return}
      P.money-=price;it.buy();if(it.once)curShop.stock.sold[id]=true;store.stats.buys++;save();sfx.buy();$('sabuSay').textContent=pickR(tr(shopTalk().buy));checkAch();renderShop();renderHotbar()});
    d.appendChild(b);g.appendChild(d)}}
