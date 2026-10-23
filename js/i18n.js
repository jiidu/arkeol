/*
  Arkeol v0.3.3 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
const VERSION='0.3.3';
/* =========================================================== language */
let LANG='en';try{const l=localStorage.getItem('arkeol-lang');if(l==='fi'||l==='en')LANG=l}catch(e){}
const STR={
 en:{
  kicker:'An archaeological expedition',newExp:'New Expedition',howto:'How to Play',archive:'Archive',achievements:'Achievements',language:'Language',
  credit:'Arkeol v0.3.3 · © 2026 JP Hakoluoto · free software under the GPL-3.0',
  best:(b,a,at,l,lt)=>`Achievements ${a}/${at} · Archive ${l}/${lt}`,recTitle:'Your records',recBest:'Best haul',recDepth:'Deepest',recRuns:'Expeditions',newRecord:'New record!',
  howtoTitle:'How to Play',close:'Close',
  howtoBody:`<p class="sub">You are an archaeologist. The remains of a bygone world lie buried below: letters, photographs and objects nobody remembers using any more. Dig through earth, stone and granite, avoid spiders, wolves and traps, and find the door down to the next layer. On the way you will meet the people who live underground, brewing coffee over a fire or fishing in the pools. Sabu the merchant waits deeper down.</p>
<dl class="keys only-keys">
<dt><kbd>A</kbd> <kbd>D</kbd> · <kbd>Space</kbd></dt><dd>Move · jump (swim in water)</dd>
<dt>Left mouse button</dt><dd>Always swings the pickaxe toward the cursor</dd>
<dt>Right mouse button</dt><dd>Uses the selected toolbar item: drill, weapon, fishing rod, bomb, rope or stone</dd>
<dt><kbd>1</kbd>–<kbd>6</kbd> / wheel</dt><dd>Select from the toolbar. Press <kbd>2</kbd> again or <kbd>Q</kbd> to switch weapon</dd>
<dt><kbd>X</kbd> · <kbd>V</kbd></dt><dd>Pickaxe · use the selected item from the keyboard (<kbd>W</kbd>/<kbd>S</kbd> aims up/down)</dd>
<dt><kbd>C</kbd> <kbd>F</kbd> <kbd>G</kbd> <kbd>B</kbd> <kbd>R</kbd></dt><dd>Shortcuts: drill, weapon, fishing rod, bomb, rope (<kbd>S</kbd>+<kbd>R</kbd> lowers a rope over a ledge)</dd>
<dt><kbd>T</kbd></dt><dd>Throw a stone. Pick stones up from the ground with <kbd>E</kbd> or a click</dd>
<dt><kbd>E</kbd> / <kbd>W</kbd></dt><dd>Open doors, talk, trade, climb ropes</dd><dt>🎮︎</dt><dd>Controller: stick/D-pad move, A jump, X dig, Y use, B interact, LB/RB switch item, LT bomb, RT use, right stick aim, View crafting, Menu pause, L3 map, R3 rope</dd><dt><kbd>H</kbd></dt><dd>Crafting: hit vines, bones, webs and old gear with the pickaxe to collect materials</dd>
<dt><kbd>Tab</kbd> · <kbd>P</kbd> · <kbd>N</kbd> · <kbd>M</kbd></dt><dd>Map · pause · music · sound</dd>
</dl>
<dl class="keys only-touch">
<dt>Left pad</dt><dd>Move, climb, aim up and down</dd>
<dt>Right pad</dt><dd>Jump, pickaxe, use the selected item, bomb, act</dd>
<dt>Toolbar</dt><dd>Tap to select. Tap the weapon again to switch weapon</dd>
</dl>
<div class="tips">
<div><b>Pressure plates</b> look almost like ordinary stone. A thin seam gives them away.</div>
<div><b>Diamonds</b> glint even in the dark. So do wolves' eyes.</div>
<div><b>Webs</b> slow you down. Cut them with the pickaxe or burn them with a bomb.</div>
<div><b>You start with only a pickaxe.</b> Everything else is bought from Sabu or found in crates and from the people living underground.</div>
<div><b>Mushrooms and berries</b> can be eaten. The colour decides what happens, so remember what each one did.</div>
<div><b>Fishing:</b> cast into a pool and wait. When the float bobs, reel in at once.</div>
<div><b>Stalactites</b> tremble before they fall. A thrown stone can set off a pressure plate from a safe distance.</div>
<div><b>Mummies</b> shuffle about aimlessly until they notice you. Then run.</div>
<div><b>Snakes and spiders</b> are venomous. Poison blurs your sight for a while.</div>
</div>`,
  craft:'Crafting',btnCraft:'Craft',atFire:'By the campfire: every recipe can be made here.',noFire:'Small things can be made anywhere. Recipes marked with a flame need a campfire.',fireTag:'campfire',make:'Make',recipeLocked:'Find old notes or buy a blueprint from Sabu to learn this.',recipesKnown:(a,b)=>`Recipes known: ${a}/${b} · open with H`,place_torch:n=>`Place a torch (${n})`,place_ladder:n=>`Place a ladder (${n})`,cantPlace:'No room here',newRecipe:'New recipe!',newRecipeHint:'Find it in Crafting (H).',lblMoney:'Money',lblDrill:'Drill',lblDepth:'Depth',btnMap:'Map',btnMusic:'Music',btnSound:'Sound',btnPause:'Pause',
  tDig:'Pick',tUse:'Use',tJump:'Jump',tAct:'Act',tBomb:'Bomb',
  overTitle:'In Memoriam',
  epitaphs:['Here rests an archaeologist who went one layer too deep.','They dug for the past and became part of it.','The shaft keeps what it is given.','Gone below, where the radios fell silent.','Somewhere far beneath Vaskikylä, a lantern went out.','Every layer has a bottom. This one was theirs.'],
  recap:(d)=>{const pl=(n,a,b)=>`${n} ${n===1?a:b}`;const k=[];if(d.k.spider)k.push(pl(d.k.spider,'spider','spiders'));if(d.k.wolf)k.push(pl(d.k.wolf,'wolf','wolves'));if(d.k.snake)k.push(pl(d.k.snake,'snake','snakes'));if(d.k.mummy)k.push(pl(d.k.mummy,'mummy','mummies'));if(d.k.dragon)k.push(pl(d.k.dragon,'dragon','dragons'));if(d.k.frog)k.push(pl(d.k.frog,'frog','frogs'));if(d.k.bat)k.push(pl(d.k.bat,'bat','bats'));if(d.k.mimic)k.push(pl(d.k.mimic,'mimic','mimics'));if(d.k.worm)k.push(pl(d.k.worm,'worm','worms'));if(d.k.wisp)k.push(pl(d.k.wisp,'wisp','wisps'));
    const finds=d.earned?[d.money]:[];if(d.gems)finds.push(pl(d.gems,'diamond','diamonds'));if(d.relics)finds.push(pl(d.relics,'relic','relics'));if(d.lore)finds.push(pl(d.lore,'lost memory','lost memories'));
    const lst=a=>a.length>1?a.slice(0,-1).join(', ')+' and '+a[a.length-1]:a[0];
    return `Chapter ${d.ch}, “${d.chName}”. Descended ${d.depth} metres${finds.length?` and brought back ${lst(finds)}`:', empty-handed'}. ${k.length?`Fought off ${lst(k)}.`:'Harmed no living thing.'} Taken at last by ${d.cause}.`},
  chapterN:n=>`Chapter ${n}`,sDepth:'Depth',sEarned:'Earned',sGems:'Diamonds',sRelics:'Relics',sBest:'Best',toMenu:'Main Menu',
  pauseTitle:'Paused',pauseHint:'Press P or Esc to continue.',resume:'Resume',quit:'End Expedition',continue:'Continue',
  tabPapers:'Paper Scraps',tabPhotos:'Photographs',tabRelics:'Relics',lblLevel:'Layer',plankS:'Wooden blocks',hintRift:'E / W: step through the rift',hintRiftT:'Act: step through the rift',hintBack:'E / W: go back',hintBackT:'Act: go back',hintDemon:'E: open the demon chest',hintDemonT:'Act: open the demon chest',voidTitle:'The Other Side',voidSub:'Find what waits here. There is no other way out.',voidKick:'Beyond the rift',voidOpen:'A way back opens…',voidBack:'Back. The rift closes behind you.',b_void:'The other side',sky_spring:'Spring',sky_summer:'Summer',sky_autumn:'Autumn',sky_winter:'Winter',tod_morning:'morning',tod_day:'day',tod_evening:'evening',tod_night:'night',wx_rain:'Rain',wx_storm:'Thunderstorm',wx_snow:'Snowfall',wx_fog:'Fog',wx_cloudy:'Overcast',tabItems:'Keepsakes',rareFind:r=>`${r} find!`,dragonWakes:'Something huge wakes up…',cDragon:'a dragon',era_stone:'Echoes of the Stone Age',era_roman:'Roman ruins, out of place',era_medieval:'A medieval hall, somehow',era_future:'Fragments of the future',place_fire:n=>`Build a campfire (${n})`,notFound:'Not found yet',photo:'Photograph',
  archProg:(p,pt,f,ft,r,rt)=>`Paper scraps ${p}/${pt} · photographs ${f}/${ft} · relics ${r}/${rt}`,
  achSecret:'Secret achievement. Keep exploring.',
  achProg:(n,tot,b,s,w,bo)=>`${n} / ${tot} unlocked · dug ${b} tiles · spiders ${s} · wolves ${w} · bombs ${bo}`,
  achUnlocked:'Achievement unlocked',
  shopTitle:"Sabu's Bazaar",wallet:m=>`Your money: ${m}`,leaveShop:'Leave the shop',escCloses:'Esc closes',sold:'Sold',
  layerN:l=>`Layer ${l}`,lvl:(l,bn,sh,jk)=>`${bn}${sh?' · Sabu has a shop here':''}${jk?' · Reijo is selling scrap':''}`,junkTitle:"Reijo's Scrap",hintJunk:"E or click: Reijo's scrap",hintJunkT:"Act: Reijo's scrap",junkHi:'Well hello there!',usesLeft:n=>`${n} uses left`,creaks:'Creak…',fellApart:n=>`${n} fell apart!`,noBites:'Nothing bites here any more.',fishGone:'That was the last fish here.',fxBlue:'Blueberries! +1',introSay:'Right. Down we go.',eatMeal:(n,c)=>`Eat: ${n} (${c})`,wBody:'Character',bodyM:'Man',bodyF:'Woman',wHairC:'Hair colour',
  hintDoor:'E / W: next layer',hintDoorT:'Act: next layer',hintShop:"E or click: Sabu's shop",hintShopT:"Act: Sabu's shop",hintTalk:n=>`E: talk (${n})`,hintTalkT:n=>`Act: talk (${n})`,
  noFuel:'Out of drill fuel',noArrows:'No arrows',noAmmo:'No rounds',noRod:'You have no fishing rod',noWater:'Missed the water',bait:'The fish took the bait',heavy:'Something heavy!',
  spider:'Spider!',plus1Bomb:'+1 bomb',plus2Bombs:'+2 bombs',plus2Ropes:'+2 ropes',fuel50:'+50% fuel',plus5Arrows:'+5 arrows',plus4Ammo:'+4 rounds',plusHeart:'+1 heart',plusArrow:'+1 arrow',
  welcome:'Welcome, digger!',howl:'Awooo!',
  cFall:'a long fall',cBomb:'your own bomb',cBite:'a spider bite',cAcid:'corrosive slime',cTrap:'an arrow trap',cWolf:'a wolf bite',cDrown:'drowning',
  pick:'Pickaxe',pick2:'Diamond pickaxe',drill:'Drill',drill2:'Golden drill',noWeapon:'No weapon',rod:'Fishing rod',noRodS:'No fishing rod',bomb:'Bomb',rope:'Rope',arrowsW:'arrows',ammoW:'rounds',
  newGame:'New Game',wardrobe:'Wardrobe',wHat:'Hat',wHatC:'Hat colour',wTop:'Top',wTopC:'Top colour',wPants:'Trousers',wNeck:'Neckwear',wNeckC:'Neckwear colour',wProg:(a,b)=>`Clothes and dyes found: ${a}/${b}. More are hidden in chests, pots and with the people of the deep.`,wLocked:'Not found yet',newClothes:'New clothes!',wHint:'Try it on in the Wardrobe.',wDyeSuffix:'dye',recLine:(b,d,r)=>`Best\u00a0haul\u00a0${b} · Deepest\u00a0${d} · ${r}\u00a0expeditions`,settings:'Settings',credits:'Credits',license:'License',musicVol:'Music volume',sfxVol:'Sound effects',shakeOpt:'Screen shake',
  creditsBody:`<p class="byline" data-wave>Arkeol by JP Hakoluoto</p><dl class="credits"><dt>Typefaces</dt><dd>Silkscreen, Pixelify Sans and VT323 via Google Fonts (SIL Open Font License)</dd><dt>Inspired by</dt><dd>Spelunky and Minecraft</dd></dl><p class="sub">v0.3.3 · <button class="linkBtn" type="button" data-open="license">License</button></p><p class="fine">AI was used as an aid in developing this game.</p>`,
  licenseBody:`<p class="sub">Arkeol is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License or (at your option) any later version. It is distributed without any warranty.</p><p class="sub"><b>Additional term under GPL-3.0 section 7(b):</b> every copy, modified version or work based on Arkeol must keep the copyright and licence notices and must visibly credit the original project: "Based on Arkeol by JP Hakoluoto".</p><p class="sub"><a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener">Read the full GNU GPL version 3</a></p><p class="sub">Copyright © 2026 JP Hakoluoto</p>`,
  noDrill:'You have no drill',noDrillS:'No drill',foundDrill:'Found a drill!',foundBow:'Found a bow!',
  hintEat:n=>`E: eat ${n}`,hintEatT:n=>`Act: eat ${n}`,fxHaste:'Digging frenzy!',fxTrip:'The walls are breathing…',fxBitter:'Bitter!',cBerry:'poisonous berries',stHaste:'Frenzy',stTrip:'Visions',stPoison:'Poison',
  hintRock:'E: pick up the stone',hintRockT:'Act: pick up the stone',plusStone:'+1 stone',stone:'Stone',
  b_normal:'Earthen caves',b_hot:'Scorching depths',b_cold:'Frozen halls',b_moss:'Mossy grotto',b_shroom:'Mushroom hollows',cFire:'a fireball',cBat:'a bat bite',hintTerm:'E or click: use the computer',hintTermT:'Act: use the computer',termDone:'The computer hums contentedly.',termDead:'The computer is dead.',termLocked:'Archive is encrypted. Solve the challenge to decrypt.',termSolve:n=>`Type the answer and press Enter (${n} ${n===1?'try':'tries'} left):`,hintLever:'E or click: pull the lever',hintButton:'E or click: press the button',leverDone:'It has already been used.',vaultLocked:'A sealed door.',doorFar:'Somewhere, a heavy door grinds open…',doorNear:'The door is opening!',dbRecipe:n=>`RECIPE FOUND: ${n}`,dbMap:'SURVEY DATA LOADED. The map of this layer is now complete.',dbVault:(dx,ew,dy,ud)=>`DOOR CONTROL: lever is about ${dx} m ${ew} and ${dy} m ${ud} of here. Marked on your map.`,dbVaultNone:'DOOR CONTROL: no doors in this layer.',dbCash:v=>`wallet.dat: 0.5 BTC (mined in 2009). Converted: ${v}`,west:'west',east:'east',up:'up',down:'down',cFrog:'a leaping frog',padOn:'Controller connected',padOff:'Controller disconnected',cMimic:'a mimic chest',cWorm:'a burrowing worm',lightStolen:'Your light was stolen!',cSnake:'a snake bite',growl:'Grrr…',poisoned:'Poisoned!',
  cMummy:'a mummy',cStal:'a falling stalactite',cLava:'lava',
  lmb:'LMB',rmb:'RMB',
  foundPaper:(n,t)=>`You found a scrap of paper · archive ${n}/${t}`,foundPhoto:(n,t)=>`You found a photograph · archive ${n}/${t}`,newFind:'new find'
 },
 fi:{
  kicker:'Arkeologinen tutkimusmatka',newExp:'Uusi retki',howto:'Pelaaminen',archive:'Arkisto',achievements:'Saavutukset',language:'Kieli',
  credit:'Arkeol v0.3.3 · © 2026 JP Hakoluoto · vapaa ohjelmisto GPL-3.0-lisenssillä',
  best:(b,a,at,l,lt)=>`Saavutuksia ${a}/${at} · Arkistossa ${l}/${lt}`,recTitle:'Ennätyksesi',recBest:'Paras saalis',recDepth:'Syvin',recRuns:'Retkiä',newRecord:'Uusi ennätys!',
  howtoTitle:'Pelaaminen',close:'Sulje',
  howtoBody:`<p class="sub">Olet arkeologi. Maan alle on hautautunut menneen maailman jäänteitä: kirjeitä, valokuvia ja esineitä, joita kukaan ei enää muista käyttäneensä. Kaiva tiesi läpi maan, kiven ja graniitin, väistä hämähäkkejä, susia ja ansoja, ja etsi ovi seuraavaan kerrokseen. Matkalla tapaat maanalaisia asukkaita, jotka keittävät pannukahvia nuotiolla tai kalastavat altailla. Kauppias Sabu odottaa syvemmällä.</p>
<dl class="keys only-keys">
<dt><kbd>A</kbd> <kbd>D</kbd> · <kbd>Välilyönti</kbd></dt><dd>Liiku · hyppää (vedessä ui)</dd>
<dt>Hiiren vasen</dt><dd>Lyö aina hakulla osoittimen suuntaan</dd>
<dt>Hiiren oikea</dt><dd>Käyttää työkaluriviltä valittua: pora, ase, onki, pommi, köysi tai kivi</dd>
<dt><kbd>1</kbd>–<kbd>6</kbd> / rulla</dt><dd>Valitse työkaluriviltä. <kbd>2</kbd> uudelleen tai <kbd>Q</kbd> vaihtaa asetta</dd>
<dt><kbd>X</kbd> · <kbd>V</kbd></dt><dd>Hakku · käytä valittua näppäimistöltä (<kbd>W</kbd>/<kbd>S</kbd> tähtää ylös/alas)</dd>
<dt><kbd>C</kbd> <kbd>F</kbd> <kbd>G</kbd> <kbd>B</kbd> <kbd>R</kbd></dt><dd>Pikanäppäimet: pora, ase, onki, pommi, köysi (<kbd>S</kbd>+<kbd>R</kbd> laskee köyden reunalta)</dd>
<dt><kbd>T</kbd></dt><dd>Heitä kivi. Poimi kiviä maasta <kbd>E</kbd>:llä tai klikkaamalla</dd>
<dt><kbd>E</kbd> / <kbd>W</kbd></dt><dd>Avaa ovi, juttele, käy kauppaa, kiipeä köyttä</dd><dt>🎮︎</dt><dd>Ohjain: tikku/ristiohjain liike, A hyppy, X kaiva, Y käytä, B toimi, LB/RB vaihda esinettä, LT pommi, RT käytä, oikea tikku tähtäys, View käsityö, Menu tauko, L3 kartta, R3 köysi</dd><dt><kbd>H</kbd></dt><dd>Käsityö: lyö köynnöksiä, luita, seittejä ja vanhoja tarvikkeita hakulla kerätäksesi materiaaleja</dd>
<dt><kbd>Tab</kbd> · <kbd>P</kbd> · <kbd>N</kbd> · <kbd>M</kbd></dt><dd>Kartta · tauko · musiikki · äänet</dd>
</dl>
<dl class="keys only-touch">
<dt>Vasen pädi</dt><dd>Liiku, kiipeä, tähtää ylös ja alas</dd>
<dt>Oikea pädi</dt><dd>Hyppy, hakku, käytä valittua, pommi, toimi</dd>
<dt>Työkalurivi</dt><dd>Napauta valitaksesi. Napauta asetta uudelleen vaihtaaksesi aseen</dd>
</dl>
<div class="tips">
<div><b>Painelaatat</b> näyttävät melkein tavalliselta kiveltä. Ohut sauma pinnassa paljastaa ne.</div>
<div><b>Timantit</b> kimaltavat pimeässäkin. Suden silmät myös.</div>
<div><b>Seitit</b> hidastavat. Leikkaa ne hakulla tai polta pommilla.</div>
<div><b>Aluksi sinulla on vain hakku.</b> Kaikki muu ostetaan Sabulta tai löydetään laatikoista ja maanalaisilta asukkailta.</div>
<div><b>Sieniä ja marjoja</b> voi syödä. Väri ratkaisee vaikutuksen, joten muista mitä mikin teki.</div>
<div><b>Kalastus:</b> heitä onki veteen ja odota. Kun koho nykäisee, vedä heti.</div>
<div><b>Tippukivet</b> värisevät ennen kuin putoavat. Heitetty kivi laukaisee painelaatan turvallisen matkan päästä.</div>
<div><b>Muumiot</b> laahustavat päämäärättä, kunnes huomaavat sinut. Silloin juokse.</div>
<div><b>Käärmeet ja hämähäkit</b> ovat myrkyllisiä. Myrkytys sumentaa näön hetkeksi.</div>
</div>`,
  craft:'Käsityö',btnCraft:'Käsityö',atFire:'Nuotiolla: kaikki reseptit onnistuvat täällä.',noFire:'Pienet esineet voi tehdä missä vain. Liekillä merkityt reseptit vaativat nuotion.',fireTag:'nuotio',make:'Tee',recipeLocked:'Löydä vanhoja muistiinpanoja tai osta piirustus Sabulta.',recipesKnown:(a,b)=>`Reseptejä osattu: ${a}/${b} · avaa H-näppäimellä`,place_torch:n=>`Aseta soihtu (${n})`,place_ladder:n=>`Aseta tikkaat (${n})`,cantPlace:'Ei tilaa tässä',newRecipe:'Uusi resepti!',newRecipeHint:'Löydät sen käsityöstä (H).',lblMoney:'Rahat',lblDrill:'Pora',lblDepth:'Syvyys',btnMap:'Kartta',btnMusic:'Musiikki',btnSound:'Äänet',btnPause:'Tauko',
  tDig:'Hakku',tUse:'Käytä',tJump:'Hyppy',tAct:'Toimi',tBomb:'Pommi',
  overTitle:'Muistolle',
  epitaphs:['Tässä lepää arkeologi, joka kaivoi yhden kerroksen liian syvälle.','Hän kaivoi menneisyyttä ja muuttui osaksi sitä.','Kuilu pitää sen, minkä se saa.','Mennyt alas, sinne missä radiot vaikenivat.','Jossain syvällä Vaskikylän alla sammui lyhty.','Jokaisella kerroksella on pohjansa. Tämä oli hänen.'],
  recap:(d)=>{const pl=(n,a,b)=>`${n} ${n===1?a:b}`;const k=[];if(d.k.spider)k.push(pl(d.k.spider,'hämähäkki','hämähäkkiä'));if(d.k.wolf)k.push(pl(d.k.wolf,'susi','sutta'));if(d.k.snake)k.push(pl(d.k.snake,'käärme','käärmettä'));if(d.k.mummy)k.push(pl(d.k.mummy,'muumio','muumiota'));if(d.k.dragon)k.push(pl(d.k.dragon,'lohikäärme','lohikäärmettä'));if(d.k.frog)k.push(pl(d.k.frog,'sammakko','sammakkoa'));if(d.k.bat)k.push(pl(d.k.bat,'lepakko','lepakkoa'));if(d.k.mimic)k.push(pl(d.k.mimic,'matkija-arkku','matkija-arkkua'));if(d.k.worm)k.push(pl(d.k.worm,'kaivajamato','kaivajamatoa'));if(d.k.wisp)k.push(pl(d.k.wisp,'virvatuli','virvatulta'));
    const finds=d.earned?[d.money]:[];if(d.gems)finds.push(pl(d.gems,'timantti','timanttia'));if(d.relics)finds.push(pl(d.relics,'relikki','relikkiä'));if(d.lore)finds.push(pl(d.lore,'kadonnut muisto','kadonnutta muistoa'));
    const lst=a=>a.length>1?a.slice(0,-1).join(', ')+' ja '+a[a.length-1]:a[0];
    return `Luku ${d.ch}, ”${d.chName}”. Laskeutui ${d.depth} metrin syvyyteen${finds.length?` ja toi mukanaan ${lst(finds)}`:' tyhjin käsin'}. ${k.length?`Voitti matkalla ${lst(k)}.`:'Ei vahingoittanut ketään.'} Kohtalona lopulta ${d.cause}.`},
  chapterN:n=>`Luku ${n}`,sDepth:'Syvyys',sEarned:'Ansaittu',sGems:'Timantteja',sRelics:'Relikkejä',sBest:'Ennätys',toMenu:'Valikkoon',
  pauseTitle:'Tauko',pauseHint:'Paina P tai Esc jatkaaksesi.',resume:'Jatka',quit:'Lopeta retki',continue:'Jatka',
  tabPapers:'Paperinpalat',tabPhotos:'Valokuvat',tabRelics:'Relikit',lblLevel:'Kerros',plankS:'Puupalikat',hintRift:'E / W: astu repeämän läpi',hintRiftT:'Toimi: astu repeämän läpi',hintBack:'E / W: palaa takaisin',hintBackT:'Toimi: palaa takaisin',hintDemon:'E: avaa demoniarkku',hintDemonT:'Toimi: avaa demoniarkku',voidTitle:'Toinen puoli',voidSub:'Löydä se, mikä täällä odottaa. Muuta tietä ulos ei ole.',voidKick:'Repeämän takana',voidOpen:'Tie takaisin aukeaa…',voidBack:'Takaisin. Repeämä sulkeutuu takanasi.',b_void:'Toinen puoli',sky_spring:'Kevät',sky_summer:'Kesä',sky_autumn:'Syys',sky_winter:'Talvi',tod_morning:'aamu',tod_day:'päivä',tod_evening:'ilta',tod_night:'yö',wx_rain:'Sadetta',wx_storm:'Ukkosta',wx_snow:'Lumisadetta',wx_fog:'Sumua',wx_cloudy:'Pilvistä',tabItems:'Muistoesineet',rareFind:r=>`${r} löytö!`,dragonWakes:'Jokin valtava herää…',cDragon:'lohikäärme',era_stone:'Kivikauden kaikuja',era_roman:'Roomalaisraunioita, väärässä paikassa',era_medieval:'Keskiaikainen sali, jotenkin',era_future:'Palasia tulevaisuudesta',place_fire:n=>`Rakenna nuotio (${n})`,notFound:'Ei vielä löydetty',photo:'Valokuva',
  archProg:(p,pt,f,ft,r,rt)=>`Paperinpaloja ${p}/${pt} · valokuvia ${f}/${ft} · relikkejä ${r}/${rt}`,
  achSecret:'Salainen saavutus. Jatka tutkimista.',
  achProg:(n,tot,b,s,w,bo)=>`${n} / ${tot} avattu · kaivettu ${b} ruutua · hämähäkkejä ${s} · susia ${w} · pommeja ${bo}`,
  achUnlocked:'Saavutus avattu',
  shopTitle:'Sabun kauppa',wallet:m=>`Rahasi: ${m}`,leaveShop:'Poistu kaupasta',escCloses:'Esc sulkee',sold:'Myyty',
  layerN:l=>`Kerros ${l}`,lvl:(l,bn,sh,jk)=>`${bn}${sh?' · Sabun kauppa on täällä':''}${jk?' · Reijo myy romua':''}`,junkTitle:'Reijon romu',hintJunk:'E tai klikkaa: Reijon romu',hintJunkT:'Toimi: Reijon romu',junkHi:'No terve terve!',usesLeft:n=>`kestää ${n}`,creaks:'Narsk…',fellApart:n=>`${n} hajosi!`,noBites:'Täällä ei enää syö.',fishGone:'Se oli tämän paikan viimeinen kala.',fxBlue:'Mustikoita! +1',introSay:'No niin. Alas mennään.',eatMeal:(n,c)=>`Syö: ${n} (${c})`,wBody:'Hahmo',bodyM:'Mies',bodyF:'Nainen',wHairC:'Hiusten väri',
  hintDoor:'E / W: seuraava kerros',hintDoorT:'Toimi: seuraava kerros',hintShop:'E tai klikkaa: Sabun kauppa',hintShopT:'Toimi: Sabun kauppa',hintTalk:n=>`E: juttele (${n})`,hintTalkT:n=>`Toimi: juttele (${n})`,
  noFuel:'Poran polttoaine loppu',noArrows:'Ei nuolia',noAmmo:'Ei patruunoita',noRod:'Sinulla ei ole onkea',noWater:'Ei osunut veteen',bait:'Kala vei syötin',heavy:'Jotain painavaa!',
  spider:'Hämähäkki!',plus1Bomb:'+1 pommi',plus2Bombs:'+2 pommia',plus2Ropes:'+2 köyttä',fuel50:'+50 % polttoainetta',plus5Arrows:'+5 nuolta',plus4Ammo:'+4 patruunaa',plusHeart:'+1 sydän',plusArrow:'+1 nuoli',
  welcome:'Tervetuloa, kaivaja!',howl:'Auuuu!',
  cFall:'putoaminen',cBomb:'oma pommi',cBite:'hämähäkin purema',cAcid:'syövyttävä mönjä',cTrap:'nuoliansa',cWolf:'suden purema',cDrown:'hukkuminen',
  pick:'Hakku',pick2:'Timanttihakku',drill:'Pora',drill2:'Kultapora',noWeapon:'Ei asetta',rod:'Onki',noRodS:'Ei onkea',bomb:'Pommi',rope:'Köysi',arrowsW:'nuolia',ammoW:'patruunoita',
  newGame:'Uusi peli',wardrobe:'Vaatekaappi',wHat:'Hattu',wHatC:'Hatun väri',wTop:'Yläosa',wTopC:'Yläosan väri',wPants:'Housut',wNeck:'Kaulassa',wNeckC:'Kaulaliinan väri',wProg:(a,b)=>`Vaatteita ja värejä löydetty: ${a}/${b}. Lisää löytyy arkuista, ruukuista ja syvyyksien asukkailta.`,wLocked:'Ei vielä löydetty',newClothes:'Uusia vaatteita!',wHint:'Kokeile sitä vaatekaapissa.',wDyeSuffix:'väri',recLine:(b,d,r)=>`Paras\u00a0saalis\u00a0${b} · Syvin\u00a0${d} · ${r}\u00a0retkeä`,settings:'Asetukset',credits:'Tekijät',license:'Lisenssi',musicVol:'Musiikin voimakkuus',sfxVol:'Äänitehosteet',shakeOpt:'Ruudun tärinä',
  creditsBody:`<p class="byline" data-wave>Arkeol by JP Hakoluoto</p><dl class="credits"><dt>Kirjasinlajit</dt><dd>Silkscreen, Pixelify Sans ja VT323 Google Fontsista (SIL Open Font License)</dd><dt>Innoittajat</dt><dd>Spelunky ja Minecraft</dd></dl><p class="sub">v0.3.3 · <button class="linkBtn" type="button" data-open="license">Lisenssi</button></p><p class="fine">Pelin kehityksessä on käytetty apuna tekoälyä.</p>`,
  licenseBody:`<p class="sub">Arkeol on vapaa ohjelmisto. Sitä saa jakaa ja muokata Free Software Foundationin julkaiseman GNU General Public License -lisenssin version 3 tai (valintasi mukaan) minkä tahansa myöhemmän version ehdoilla. Ohjelmalla ei ole mitään takuuta.</p><p class="sub"><b>Lisäehto GPL-3.0:n kohdan 7(b) nojalla:</b> jokaisessa kopiossa, muokatussa versiossa ja Arkeoliin perustuvassa työssä on säilytettävä tekijänoikeus- ja lisenssimerkinnät, ja alkuperäinen projekti on mainittava näkyvästi: "Perustuu JP Hakoluodon Arkeol-peliin".</p><p class="sub"><a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank" rel="noopener">Lue koko GNU GPL -lisenssin versio 3</a></p><p class="sub">Copyright © 2026 JP Hakoluoto</p>`,
  noDrill:'Sinulla ei ole poraa',noDrillS:'Ei poraa',foundDrill:'Löysit poran!',foundBow:'Löysit jousen!',
  hintEat:n=>`E: syö ${n}`,hintEatT:n=>`Toimi: syö ${n}`,fxHaste:'Kaivuuvimma!',fxTrip:'Seinät hengittävät…',fxBitter:'Kitkerää!',cBerry:'myrkylliset marjat',stHaste:'Vimma',stTrip:'Näyt',stPoison:'Myrkky',
  hintRock:'E: poimi kivi',hintRockT:'Toimi: poimi kivi',plusStone:'+1 kivi',stone:'Kivi',
  b_normal:'Multaluolat',b_hot:'Hehkuvat syvyydet',b_cold:'Jäiset salit',b_moss:'Sammalluola',b_shroom:'Sienionkalot',cFire:'tulipallo',cBat:'lepakon purema',hintTerm:'E tai klikkaa: käytä tietokonetta',hintTermT:'Toimi: käytä tietokonetta',termDone:'Tietokone hurisee tyytyväisenä.',termDead:'Tietokone on kuollut.',termLocked:'Arkisto on salattu. Ratkaise tehtävä purkaaksesi sen.',termSolve:n=>`Kirjoita vastaus ja paina Enter (${n} yritys${n===1?'':'tä'} jäljellä):`,hintLever:'E tai klikkaa: käännä vipua',hintButton:'E tai klikkaa: paina nappia',leverDone:'Sitä on jo käytetty.',vaultLocked:'Sinetöity ovi.',doorFar:'Jossain raskas ovi aukeaa narisemalla…',doorNear:'Ovi aukeaa!',dbRecipe:n=>`RESEPTI LÖYTYI: ${n}`,dbMap:'KARTOITUSDATA LADATTU. Tämän kerroksen kartta on nyt valmis.',dbVault:(dx,ew,dy,ud)=>`OVIOHJAUS: vipu on noin ${dx} m ${ew} ja ${dy} m ${ud}. Merkitty karttaan.`,dbVaultNone:'OVIOHJAUS: tässä kerroksessa ei ole ovia.',dbCash:v=>`wallet.dat: 0,5 BTC (louhittu 2009). Vaihdettu: ${v}`,west:'länteen',east:'itään',up:'ylöspäin',down:'alaspäin',cFrog:'loikkiva sammakko',padOn:'Ohjain yhdistetty',padOff:'Ohjain irrotettu',cMimic:'matkija-arkku',cWorm:'kaivajamato',lightStolen:'Valosi varastettiin!',cSnake:'käärmeen purema',growl:'Grrr…',poisoned:'Myrkytys!',
  cMummy:'muumio',cStal:'putoava tippukivi',cLava:'laava',
  lmb:'VASEN',rmb:'OIKEA',
  foundPaper:(n,t)=>`Löysit paperinpalan · arkistossa ${n}/${t}`,foundPhoto:(n,t)=>`Löysit valokuvan · arkistossa ${n}/${t}`,newFind:'uusi löytö'
 }
};
const t=(k,...a)=>{const s=STR[LANG][k]??STR.en[k]??k;return typeof s==='function'?s(...a):s};
const tr=v=>v&&typeof v==='object'&&!Array.isArray(v)?(v[LANG]??v.en):v;
