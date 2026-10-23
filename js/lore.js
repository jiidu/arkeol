/*
  Arkeol v0.3.3 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
*/
'use strict';
/* =========================================================== lore data */
const PAPERS=[
 {who:{en:'Newspaper clipping, Vaskikylä Gazette',fi:'Lehtileike, Vaskikylän Sanomat'},body:{en:'THE SILENCE SPREADS\nRadios fell quiet yesterday at 4:12. Authorities urge everyone to stay indoors and to avoid looking at the sky until…',fi:'HILJAISUUS LEVIÄÄ\nRadiot vaikenivat eilen kello 4.12. Viranomaiset kehottavat pysymään sisätiloissa ja välttämään taivaalle katsomista, kunnes…'}},
 {who:{en:'Diary, Prof. Elina Varjo',fi:'Päiväkirja, prof. Elina Varjo'},body:{en:'14.3.2009\nThere are hieroglyphs on the walls of the shaft, though we are thousands of kilometres from the Nile. Our guide refused to give his name. He only smiled.',fi:'14.3.2009\nKuilun seinissä on hieroglyfejä, vaikka olemme tuhansien kilometrien päässä Niililtä. Opas kieltäytyi kertomasta nimeään. Hän vain hymyili.'}},
 {who:{en:'Letter',fi:'Kirje'},body:{en:'Dear Grandma,\nDown here there are pretty stones that sparkle in the dark. Dad says they are diamonds but you are not allowed to eat them. Miss you.\nlove, Aino, 8',fi:'Rakas mummi.\nTäällä alhaalla on kauniita kiviä jotka kimaltaa pimeässä. Isä sanoo että ne on timantteja mutta niitä ei saa syödä. Ikävä.\nt. Aino 8 v'}},
 {who:{en:'Receipt, Vaskikylä General Store',fi:'Kuitti, Vaskikylän Kauppa'},body:{en:'AA batteries 4 pcs ...... 5.90\nRope 20 m ............. 12.50\nTinned beans 3 pcs ..... 2.85\nC90 cassette ........... 1.99\nTOTAL €23.24\nTHANK YOU FOR VISITING',fi:'Paristot AA 4 kpl ....... 5,90\nKöysi 20 m ............. 12,50\nSäilykepapu 3 kpl ....... 2,85\nC-kasetti 90 min ........ 1,99\nYHTEENSÄ 23,24 €\nKIITOS KÄYNNISTÄ'}},
 {who:{en:'Diary, Prof. Elina Varjo',fi:'Päiväkirja, prof. Elina Varjo'},body:{en:'22.3.2009\nThird layer. The spiders spit something that eats through boot leather. Lindqvist lost two fingers. The guide sold him new gloves. Where did he get them?',fi:'22.3.2009\nKolmas kerros. Hämähäkit sylkevät jotain, mikä syö saappaannahan läpi. Lindqvist menetti kaksi sormea. Opas myi hänelle uudet hanskat. Mistä hän ne sai?'}},
 {who:{en:'Shift log, mine 4',fi:'Vuoropäiväkirja, kaivos 4'},body:{en:'Shift 113.\nWe heard howling again from below the layer. Wolves do not belong here. None of this belongs here.',fi:'Vuoro 113.\nKuulimme taas ulvontaa kerroksen alta. Sudet eivät kuulu tänne. Mikään tästä ei kuulu tänne.'}},
 {who:{en:'Crumpled letter',fi:'Rypistynyt kirje'},body:{en:'…if you find this, know that I waited at the gate for as long as the lamp oil lasted.\nYours, J.',fi:'…jos löydät tämän, tiedä että odotin portilla niin kauan kuin lamppuöljyä riitti.\nSinun, J.'}},
 {who:{en:'Piece of a warning sign',fi:'Varoituskyltin pala'},body:{en:'…DO NOT STEP ON SEAMED TILES.\nI repeat: DO NOT ST—',fi:'…ÄLÄ ASTU SAUMALLISILLE LAATOILLE.\nToistan: ÄLÄ AS—'}},
 {who:{en:'School notebook, geography',fi:'Koulun vihko, maantieto'},body:{en:'Question 4. What was on the surface of the earth?\nAnswer: Sky, sea, wind and shops.',fi:'Kysymys 4. Mitä oli maan pinnalla?\nVastaus: Taivas, meri, tuuli ja kauppoja.'},red:{en:'Good! A+',fi:'Hyvä! 9+'}},
 {who:{en:'Diary, Prof. Elina Varjo',fi:'Päiväkirja, prof. Elina Varjo'},body:{en:'2.4.2009\nWe found a chamber whose bricks are older than any dynasty we know. Inside, of all things, was a cassette player. The mural shows a digger wearing a hat just like mine.',fi:'2.4.2009\nLöysimme kammion, jonka tiilet ovat vanhempia kuin yksikään tuntemamme dynastia. Sisällä oli silti kasettisoitin. Seinämaalauksessa on kaivaja, jolla on hattu kuin minulla.'}},
 {who:{en:'Train ticket',fi:'Junalippu'},body:{en:'Northern Line\nHelsinki → Vaskikylä\nDep. 12.6. 07:40\nCar 3, seat 41\nKEEP THIS TICKET FOR THE JOURNEY',fi:'Pohjoinen rata\nHelsinki → Vaskikylä\nMeno 12.6. klo 7.40\nVaunu 3, paikka 41\nTALLETA LIPPU MATKAN AJAN'}},
 {who:{en:'Diary, Prof. Elina Varjo',fi:'Päiväkirja, prof. Elina Varjo'},body:{en:'The guide says the shaft has no bottom, only the next layer. He says this cheerfully.\nI leave this note for the next digger. For you.',fi:'Opas sanoo, että kuilulla ei ole pohjaa, vain seuraava kerros. Hän sanoo tämän iloisesti.\nJätän tämän muistiinpanon seuraavalle kaivajalle. Sinulle.'}}
,
 {who:{en:'Field notebook, J.H.',fi:'Kenttämuistikirja, J.H.'},body:{en:'Day 1.\nLeft the lake town on the morning train. The ice on Kallavesi was still grey at the edges. Mother packed rye bread and told me to keep my scarf on underground. As if it is cold down there.',fi:'Päivä 1.\nLähdin kotikaupungista aamujunalla. Kallaveden jää oli vielä reunoilta harmaata. Äiti pakkasi ruisleipää ja käski pitää kaulahuivin kaulassa maan alla. Ihan kuin siellä olisi kylmä.'}},
 {who:{en:'Field notebook, J.H.',fi:'Kenttämuistikirja, J.H.'},body:{en:'Day 9.\nFrom the top of Puijo tower you can count a hundred lakes. Down here I count layers instead. Eleven so far. Elina says I am the only one who still takes photographs.',fi:'Päivä 9.\nPuijon tornista voi laskea sata järveä. Täällä alhaalla lasken kerroksia. Yksitoista tähän mennessä. Elina sanoo, että olen ainoa, joka vielä valokuvaa.'}},
 {who:{en:'Postcard with a tower on a hill',fi:'Postikortti, kuvassa torni mäellä'},body:{en:'Greetings from the market square!\nBought a kalakukko from the old lady by the clock. It is in my rucksack, wrapped in newspaper. Do NOT tell the professor, she will want half.\n– J.',fi:'Terveisiä torilta!\nOstin kalakukon kellon vierestä siltä vanhalta rouvalta. Se on repussa sanomalehteen käärittynä. ÄLÄ kerro professorille, hän haluaa puolet.\n– J.'}},
 {who:{en:"Recipe card, J.H.'s grandmother",fi:'Reseptikortti, J.H:n mummo'},body:{en:'KALAKUKKO\nVendace and a little fat pork inside a thick rye crust. Bake slowly, five or six hours, until the crust knocks like a door.\nKeeps for days. Good for long journeys.',fi:'KALAKUKKO\nMuikkuja ja vähän läskiä paksun ruiskuoren sisään. Paista hitaasti viisi kuusi tuntia, kunnes kuori kopisee kuin ovi.\nSäilyy päiviä. Hyvää pitkille matkoille.'},unlock:'kalakukko'},
 {who:{en:'Letter, J.H. to Elina Varjo',fi:'Kirje, J.H. Elina Varjolle'},body:{en:'Elina,\nthe guide asked me about my home town today. He knew the name of my street, and that the lake steamer leaves at nine. I never told him where I am from.\nI am keeping the camera loaded.',fi:'Elina,\nopas kysyi minulta tänään kotikaupungistani. Hän tiesi kotikatuni nimen, ja että laivat lähtevät satamasta yhdeksältä. En ole koskaan kertonut hänelle, mistä olen kotoisin.\nPidän kameran ladattuna.'}},
 {who:{en:'Ticket, lake steamer',fi:'Lippu, järvilaiva'},body:{en:'Passenger harbour → Rauhalahti\nSummer cruise 2007\nAdult 1 · Coffee included\nPLEASE KEEP YOUR TICKET UNTIL THE END OF THE CRUISE',fi:'Matkustajasatama → Rauhalahti\nKesäristeily 2007\nAikuinen 1 · Kahvi sisältyy\nSÄILYTÄ LIPPU RISTEILYN LOPPUUN ASTI'}},
 {who:{en:'Newspaper clipping, a local paper',fi:'Lehtileike, paikallislehti'},body:{en:'DANCE FESTIVAL FILLS THE MARKET SQUARE\nThousands gathered under the summer sky. The organisers promise even more next year, "unless the sky has other plans", joked the festival director.',fi:'TANSSIJUHLAT TÄYTTIVÄT TORIN\nTuhannet kokoontuivat kesäisen taivaan alle. Järjestäjät lupaavat ensi vuonna vielä enemmän, "ellei taivaalla ole muita suunnitelmia", vitsaili festivaalin johtaja.'}},
 {who:{en:'Field notebook, J.H. (last page)',fi:'Kenttämuistikirja, J.H. (viimeinen sivu)'},body:{en:'If you are reading this, you made it further than I did.\nTell my mother by the lake that I kept my scarf on. Tell Elina the photographs are under the third lantern.\nThe guide is not a man.',fi:'Jos luet tätä, pääsit pidemmälle kuin minä.\nKerro äidilleni järven rannalle, että pidin kaulahuivin kaulassa. Kerro Elinalle, että valokuvat ovat kolmannen lyhdyn alla.\nOpas ei ole ihminen.'}},
 {who:{en:'Scrap of paper, in pencil',fi:'Paperinpala, lyijykynällä'},body:{en:'Reijo the scrap man says he came down here to look for his lost car keys in 2008. He found the keys. He just never found the way back up. "Not that I looked very hard," he says.',fi:'Romu-Reijo sanoo tulleensa tänne etsimään hukattuja autonavaimiaan vuonna 2008. Avaimet löytyivät. Tietä takaisin ylös ei. "En kyllä kovin tosissani etsinytkään", hän sanoo.'}},
 {who:{en:'Dagbok, Dr. Ingrid Solberg (Bergen)',fi:'Dagbok, Dr. Ingrid Solberg (Bergen)'},body:{en:'Dag 6.\nTrappene fortsetter nedover. Vi har talt 4 112 trinn. Lampen til Henrik slukket i går, men han sier han fremdeles ser lys der nede.\nHan smiler hele tiden nå.',fi:'Dag 6.\nTrappene fortsetter nedover. Vi har talt 4 112 trinn. Lampen til Henrik slukket i går, men han sier han fremdeles ser lys der nede.\nHan smiler hele tiden nå.'},minLv:2},
 {who:{en:'Carnet, M. Dubois (Lyon)',fi:'Carnet, M. Dubois (Lyon)'},body:{en:"12 juin.\nLes peintures sur la paroi bougent quand on ne les regarde pas. Hier, j'ai compté trois chasseurs. Aujourd'hui, il y en a quatre.\nLe quatrième porte mon chapeau.",fi:"12 juin.\nLes peintures sur la paroi bougent quand on ne les regarde pas. Hier, j'ai compté trois chasseurs. Aujourd'hui, il y en a quatre.\nLe quatrième porte mon chapeau."},minLv:3},
 {who:{en:'Diário, Ana Lúcia Ferreira (Porto)',fi:'Diário, Ana Lúcia Ferreira (Porto)'},body:{en:'Na mesma camada de terra: uma moeda romana, um telemóvel de 2006 e uma lata de refrigerante de 2087.\nO tempo aqui em baixo não corre. Escorrega.',fi:'Na mesma camada de terra: uma moeda romana, um telemóvel de 2006 e uma lata de refrigerante de 2087.\nO tempo aqui em baixo não corre. Escorrega.'},minLv:3},
 {who:{en:'R.O., Tallinn',fi:'R.O., Tallinn'},body:{en:'Ära usalda giidi.\nTa ei maga kunagi. Ta ei söö kunagi.\nTa lihtsalt ootab, et me sügavamale läheksime.',fi:'Ära usalda giidi.\nTa ei maga kunagi. Ta ei söö kunagi.\nTa lihtsalt ootab, et me sügavamale läheksime.'},minLv:4},
 {who:{en:'E.L., Uppsala',fi:'E.L., Uppsala'},body:{en:'Vi hittade en riddarrustning här nere, fyrtio meter under en parkeringsplats.\nDen var varm inuti.',fi:'Vi hittade en riddarrustning här nere, fyrtio meter under en parkeringsplats.\nDen var varm inuti.'},minLv:4},
 {who:{en:'Feldbuch, Hans-Peter Kühn (Leipzig)',fi:'Feldbuch, Hans-Peter Kühn (Leipzig)'},body:{en:'Schicht 5.\nDie Uhr bleibt immer um 4:12 stehen. Alle Uhren. Auch die neue.\nIch höre Kinder singen. Hier unten gibt es keine Kinder.',fi:'Schicht 5.\nDie Uhr bleibt immer um 4:12 stehen. Alle Uhren. Auch die neue.\nIch höre Kinder singen. Hier unten gibt es keine Kinder.'},minLv:5},
 {who:{en:'ノート、K. 田中（大阪）',fi:'ノート、K. 田中（大阪）'},body:{en:'第七層。\n地図が合わない。昨日掘ったトンネルが、今日はない。\n誰かが壁の中から名前を呼んでいる。\n私の名前ではない。',fi:'第七層。\n地図が合わない。昨日掘ったトンネルが、今日はない。\n誰かが壁の中から名前を呼んでいる。\n私の名前ではない。'},minLv:6},
 {who:{en:'Dziennik, prof. Aleksander Nowak (Kraków)',fi:'Dziennik, prof. Aleksander Nowak (Kraków)'},body:{en:'Warstwa dziewiąta.\nŚciany są ciepłe. Coś tam oddycha, powoli, jakby spało.\nNie budźcie go.',fi:'Warstwa dziewiąta.\nŚciany są ciepłe. Coś tam oddycha, powoli, jakby spało.\nNie budźcie go.'},minLv:7},
 {who:{en:'Night shift log, mine 4',fi:'Yövuoron päiväkirja, kaivos 4'},body:{en:'Shift 140.\nThe night crew came up one man short. Nobody can remember who he was.\nHis helmet is still on the hook. It is still wet.',fi:'Vuoro 140.\nYövuoro nousi ylös yhtä miestä vajaana. Kukaan ei muista, kuka hän oli.\nHänen kypäränsä roikkuu yhä naulakossa. Se on yhä märkä.'},minLv:1},
 {who:{en:"Child's drawing, in crayon",fi:'Lapsen piirustus, vahaliiduilla'},body:{en:'A smiling man with too many teeth, standing at the bottom of a hole.\nWritten underneath:\nHE SAYS THE DARK IS WARM',fi:'Hymyilevä mies, jolla on liikaa hampaita, seisoo kuopan pohjalla.\nAlle kirjoitettu:\nHÄN SANOO ETTÄ PIMEÄ ON LÄMMIN'},minLv:2},
 {who:{en:'Note on strange smooth paper, dated 2087',fi:'Viesti oudon sileällä paperilla, päivätty 2087'},body:{en:'To whoever finds this in the past:\ndo not let them dig past the twelfth layer.\nWe did. That is why there is a 2087 and not a 2088.',fi:'Sille, joka löytää tämän menneisyydestä:\nälkää antako heidän kaivaa kahdennentoista kerroksen ohi.\nMe kaivoimme. Siksi on vuosi 2087 mutta ei vuotta 2088.'},minLv:3},
 {who:{en:'Parchment, anno 1543',fi:'Pergamentti, anno 1543'},body:{en:'In the yeare of our Lorde 1543 we didde finde a tunnell lit by glasse that burned without fyre, and a little boxe that spake in many tongues and played musick.',fi:'Herran vuonna 1543 löysimme käytävän, jota valaisi lasi joka paloi ilman tulta, sekä pienen laatikon, joka puhui monin kielin ja soitti soittoa.'},minLv:4},
 {who:{en:'Torn page, Prof. Elina Varjo',fi:'Revitty sivu, prof. Elina Varjo'},body:{en:'We stopped counting the days.\nLindqvist sleeps with his eyes open. Sometimes he answers questions nobody asked.\nThe guide brought us cake. Where did he get cake?',fi:'Lakkasimme laskemasta päiviä.\nLindqvist nukkuu silmät auki. Joskus hän vastaa kysymyksiin, joita kukaan ei kysynyt.\nOpas toi meille kakkua. Mistä hän sai kakkua?'},minLv:6},
 {who:{en:'Scratched into a tin plate',fi:'Raapustettu peltilautaseen'},body:{en:'IF THE LIGHT GOES OUT\nDO NOT ANSWER\nWHEN IT USES MY VOICE',fi:'JOS VALO SAMMUU\nÄLÄ VASTAA\nKUN SE KÄYTTÄÄ MINUN ÄÄNTÄNI'},minLv:8}
];
const PHOTOS=[
 {cap:{en:'Summer 2004, the cabin jetty',fi:'Kesä 2004, mökkilaituri'},draw:'pier'},
 {cap:{en:'The city before the silence',fi:'Kaupunki ennen hiljaisuutta'},draw:'city'},
 {cap:{en:'Musti the dog',fi:'Musti'},draw:'dog'},
 {cap:{en:'Taking the train north',fi:'Junalla pohjoiseen'},draw:'train'},
 {cap:{en:'The lighthouse, last summer',fi:'Majakka, viimeinen kesä'},draw:'lighthouse'},
 {cap:{en:'The expedition and the guide, 2009',fi:'Retkikunta ja opas, 2009'},draw:'expedition'},
 {cap:{en:'The pyramid at dawn',fi:'Pyramidi aamulla'},draw:'pyramid'},
 {cap:{en:'The fairground',fi:'Huvipuisto'},draw:'wheel'},
 {cap:{en:'Puijo tower, J.H. 2006',fi:'Puijon torni, J.H. 2006'},draw:'puijo'},
 {cap:{en:'Steamer on Kallavesi',fi:'Höyrylaiva Kallavedellä'},draw:'steamer'},
 {cap:{en:'Market square, Saturday',fi:'Kauppatori, lauantai'},draw:'market'},
 {cap:{en:'J.H. with the camera, layer 3',fi:'J.H. ja kamera, kerros 3'},draw:'jh'}
];
const ERA={en:'2000s',fi:'2000-luku'};
const RELICS=[
 {id:'cassette',name:{en:'Cassette player',fi:'Kasettisoitin'},value:1400,desc:{en:'The headphones still dangle from the cord. Side A is labelled "Summer 2003".',fi:'Korvalappukuulokkeet roikkuvat yhä johdon päässä. Kasetin A-puolelle on kirjoitettu "Kesä 2003".'}},
 {id:'landline',name:{en:'Landline phone',fi:'Lankapuhelin'},value:1200,desc:{en:'The coiled cord has stretched like a spring. Someone stood in a hallway with this for hours, talking.',fi:'Kiertynyt johto on venynyt kuin jousi. Joku seisoi tässä eteisessä tuntikausia ja puhui.'}},
 {id:'flip',name:{en:'Flip phone',fi:'Simpukkapuhelin'},value:1600,desc:{en:'Snaps open satisfyingly. One unread message is still on the screen.',fi:'Avautuu tyydyttävästi napsahtaen. Näytöllä on yhä yksi lukematon viesti.'}},
 {id:'cd',name:{en:'Home-burned CD',fi:'Kotona poltettu CD-levy'},value:800,desc:{en:'Marker on the label: "PARTY TUNES VOL. 3". The scratch is where it always skipped.',fi:'Tussilla kirjoitettu: "BILEBIISIT VOL. 3". Pinnassa on naarmu, jonka kohdalla levy hyppäsi aina.'}},
 {id:'mp3',name:{en:'MP3 player',fi:'MP3-soitin'},value:1500,desc:{en:'It held a thousand songs, and someone picked every one of them.',fi:'Siihen mahtui tuhat kappaletta, ja jokaisen niistä joku oli valinnut itse.'}},
 {id:'vhs',name:{en:'VHS tape',fi:'VHS-kasetti'},value:900,desc:{en:'The label says "Wedding 2001 – DO NOT RECORD OVER".',fi:'Tarrassa lukee "Häät 2001 – ÄLÄ NAUHOITA PÄÄLLE".'}},
 {id:'camera',name:{en:'Digital camera',fi:'Digikamera'},value:1800,desc:{en:'There are 412 photos on the memory card. The batteries died long ago.',fi:'Muistikortilla on 412 kuvaa. Paristot ovat olleet tyhjinä pitkään.'}},
 {id:'pad',name:{en:'Game controller',fi:'Peliohjain'},value:1300,desc:{en:'The thumbstick is worn smooth. Someone played a lot, and played well.',fi:'Ohjaintikku on kulunut sileäksi. Tällä pelattiin paljon ja hyvin.'}},
 {id:'pet',name:{en:'Virtual pet',fi:'Virtuaalilemmikki'},value:1000,desc:{en:'An egg-shaped keyring. The little creature on the screen has been waiting to be fed for a very long time.',fi:'Munanmuotoinen avaimenperä. Näytön pikkuolento on odottanut ruokaa hyvin kauan.'}},
 {id:'usb',name:{en:'USB stick',fi:'Muistitikku'},value:2200,desc:{en:'Eight megabytes. The lanyard says "THESIS – DO NOT LOSE".',fi:'Kahdeksan megatavua. Kaulanauhassa lukee "GRADU – ÄLÄ HUKKAA".'}}
];

/* painters for photographs, relics and the merchant's portrait */
function drawPhoto(kind,c){
  const W=96,H=64;c.width=W;c.height=H;const g=c.getContext('2d');const r=mulberry32(kind.length*97+7);
  const sep=v=>{v=clamp(v,0,1);return `rgb(${43+193*v|0},${32+188*v|0},${22+160*v|0})`};
  const R=(x,y,w,h,v)=>{g.fillStyle=sep(v);g.fillRect(x,y,w,h)};
  const sky=(a,b,h)=>{for(let y=0;y<h;y++)R(0,y,W,1,a+(b-a)*y/h)};
  if(kind==='puijo'){sky(.9,.7,40);R(0,40,W,24,.5);for(let y=42;y<64;y+=3)R((y*11)%50,y,22,1,.66);
    g.fillStyle=sep(.28);g.beginPath();g.moveTo(0,44);g.quadraticCurveTo(40,14,96,40);g.lineTo(96,44);g.fill();for(let i=0;i<30;i++){const x=r()*90,y=26+r()*14;R(x,y,3,5,.18)}
    R(46,4,4,22,.12);R(43,2,10,5,.1);R(44,3,8,1,.7);R(47,0,2,2,.15)}
  if(kind==='steamer'){sky(.88,.7,30);R(0,30,W,34,.5);for(let y=32;y<64;y+=3)R((y*13)%60,y,24,1,.68);R(0,28,W,3,.3);
    R(18,36,58,8,.15);R(22,32,40,5,.85);R(24,33,36,1,.4);for(let x=26;x<58;x+=5)R(x,34,2,2,.3);R(46,20,5,13,.12);R(46,20,5,2,.6);g.fillStyle=sep(.7);for(let i=0;i<4;i++){g.beginPath();g.arc(50-i*5,14-i*3,3+i,0,7);g.fill()}R(16,44,62,2,.3)}
  if(kind==='market'){sky(.85,.68,30);R(0,30,W,34,.55);R(30,6,36,26,.3);R(34,10,8,8,.6);R(54,10,8,8,.6);R(44,0,8,8,.25);g.fillStyle=sep(.85);g.beginPath();g.arc(48,4,3,0,7);g.fill();
    for(let i=0;i<5;i++){const x=4+i*19;R(x,36,15,3,.85-(i%2)*.4);R(x+1,39,13,8,.35);R(x,39,1,9,.2);R(x+14,39,1,9,.2)}for(let i=0;i<9;i++){const x=r()*90;R(x,52+r()*6,2,6,.12);R(x,50+r()*6,2,2,.2)}}
  if(kind==='jh'){sky(.4,.25,64);g.fillStyle=sep(.75);g.beginPath();g.arc(48,30,22,0,7);g.fill();sky;R(36,40,24,24,.25);R(40,22,16,16,.68);R(38,18,20,5,.2);R(36,22,24,2,.15);
    R(42,28,4,4,.12);R(50,28,4,4,.12);R(46,34,4,2,.4);R(44,44,10,7,.1);R(47,46,4,3,.8);R(30,40,6,2,.55);R(26,42,8,14,.6)}
  if(kind==='pier'){sky(.9,.72,34);g.fillStyle=sep(.98);g.beginPath();g.arc(70,20,7,0,7);g.fill();
    for(let x=0;x<W;x+=6)R(x,26+Math.sin(x)*1.5|0,7,8,.25);R(0,34,W,30,.45);for(let y=36;y<64;y+=3)R((y*7)%40,y,18,1,.62);
    for(let i=0;i<14;i++)R(2+i*3,40+i,30-i*1.5,3,.2);R(40,52,30,3,.18);for(let x=42;x<70;x+=6)R(x,55,2,9,.12);R(58,44,4,8,.08);R(64,45,4,7,.1);R(58,41,4,4,.12);R(64,42,4,4,.12)}
  if(kind==='city'){sky(.85,.65,64);for(let i=0;i<14;i++){const w=5+r()*8|0,h=14+r()*36|0,x=i*7+(r()*3|0);R(x,64-h,w,h,.18+r()*.1);for(let y=64-h+3;y<62;y+=4)for(let xx=x+1;xx<x+w-1;xx+=3)if(r()<.5)R(xx,y,1,2,.7)}R(0,58,W,6,.12)}
  if(kind==='dog'){sky(.8,.6,40);R(0,40,W,24,.35);for(let i=0;i<60;i++)R(r()*W,40+r()*24,1,2,.25);
    g.fillStyle=sep(.15);g.beginPath();g.ellipse(46,40,16,9,0,0,7);g.fill();g.beginPath();g.arc(64,30,8,0,7);g.fill();R(66,30,9,6,.15);R(58,20,4,7,.1);R(66,21,4,6,.1);
    for(const x of [34,40,50,56])R(x,46,4,12,.13);R(28,32,3,8,.15);R(72,33,2,2,.05);R(74,35,3,4,.55);R(66,27,2,2,.9)}
  if(kind==='train'){sky(.88,.7,38);g.fillStyle=sep(.75);for(let i=0;i<5;i++){g.beginPath();g.arc(30-i*6,18-i*3,4+i*2,0,7);g.fill()}
    R(0,48,W,16,.4);for(let x=0;x<W;x+=5)R(x,52,3,2,.22);R(0,51,W,1,.15);R(0,55,W,1,.15);
    R(20,30,30,18,.12);R(44,24,10,24,.1);R(28,22,5,8,.08);R(54,34,40,14,.18);for(let x=56;x<92;x+=8)R(x,36,5,5,.6);for(const x of [24,36,48,60,74,86])R(x-3,46,6,6,.05)}
  if(kind==='lighthouse'){sky(.6,.85,44);g.fillStyle=sep(.95);g.globalAlpha=.4;g.beginPath();g.moveTo(52,14);g.lineTo(96,4);g.lineTo(96,22);g.fill();g.beginPath();g.moveTo(44,14);g.lineTo(0,6);g.lineTo(0,22);g.fill();g.globalAlpha=1;
    R(0,44,W,20,.3);for(let y=46;y<64;y+=3)R((y*13)%60,y,26,1,.5);g.fillStyle=sep(.12);g.beginPath();g.moveTo(30,64);g.lineTo(40,46);g.lineTo(62,48);g.lineTo(72,64);g.fill();
    for(let y=16;y<48;y++){const w=6+(y-16)*.18;R(48-w/2,y,w,1,((y>>2)%2)?.85:.2)}R(44,10,8,6,.95);R(43,8,10,2,.1)}
  if(kind==='expedition'){sky(.92,.78,36);R(0,36,W,28,.62);for(let i=0;i<40;i++)R(r()*W,36+r()*28,2,1,.5);
    g.fillStyle=sep(.35);g.beginPath();g.moveTo(4,44);g.lineTo(16,26);g.lineTo(28,44);g.fill();g.beginPath();g.moveTo(70,42);g.lineTo(80,28);g.lineTo(92,42);g.fill();
    const fig=(x,hat,v)=>{R(x,34,6,16,v);R(x+1,28,4,6,.55);if(hat){R(x-1,27,8,2,v);R(x+1,25,4,2,v)}R(x+1,50,1,8,v);R(x+4,50,1,8,v)};
    fig(30,1,.15);fig(40,1,.2);fig(50,0,.18);R(51,24,4,4,.2);
    R(60,34,7,16,.85);R(61,28,5,6,.4);R(59,27,9,3,.7);R(58,29,2,7,.7);R(67,29,2,7,.7);for(let y=27;y<36;y+=2){R(58,y,2,1,.3);R(67,y,2,1,.3)}R(61,50,1,8,.4);R(65,50,1,8,.4)}
  if(kind==='pyramid'){sky(.95,.7,46);g.fillStyle=sep(1);g.beginPath();g.arc(22,30,6,0,7);g.fill();
    g.fillStyle=sep(.55);g.beginPath();g.moveTo(26,46);g.lineTo(58,12);g.lineTo(90,46);g.fill();g.fillStyle=sep(.35);g.beginPath();g.moveTo(58,12);g.lineTo(90,46);g.lineTo(66,46);g.fill();
    for(let y=16;y<46;y+=4)R(58-(y-12)*.94,y,(y-12)*1.88,1,.42);R(0,46,W,18,.7);R(8,30,2,18,.15);for(let a=0;a<5;a++){g.strokeStyle=sep(.12);g.lineWidth=2;g.beginPath();g.moveTo(9,30);g.quadraticCurveTo(9+(a-2)*5,24,9+(a-2)*8,32);g.stroke()}}
  if(kind==='wheel'){sky(.4,.65,64);g.strokeStyle=sep(.12);g.lineWidth=1.5;g.beginPath();g.arc(48,28,20,0,7);g.stroke();
    for(let a=0;a<12;a++){const x=48+Math.cos(a*Math.PI/6)*20,y=28+Math.sin(a*Math.PI/6)*20;g.beginPath();g.moveTo(48,28);g.lineTo(x,y);g.stroke();R(x-2,y,4,4,.15)}
    g.beginPath();g.moveTo(40,64);g.lineTo(48,28);g.lineTo(56,64);g.stroke();R(0,58,W,6,.15);for(let x=0;x<W;x+=5)R(x,52+Math.sin(x/9)*2,1,1,.98)}
  const id=g.getImageData(0,0,W,H);for(let i=0;i<id.data.length;i+=4){const n=(r()-.5)*18;const x=(i/4)%W,y=(i/4)/W|0;const vg=1-Math.pow(Math.hypot((x-W/2)/W,(y-H/2)/H)*1.35,2)*.55;
    id.data[i]=(id.data[i]+n)*vg;id.data[i+1]=(id.data[i+1]+n)*vg;id.data[i+2]=(id.data[i+2]+n)*vg}g.putImageData(id,0,0);
  g.fillStyle='rgba(240,225,190,.35)';for(let k=0;k<3;k++)g.fillRect(r()*W,0,1,H*r());
}
function drawRelic(id,c){
  const n=24;c.width=n;c.height=n;const g=c.getContext('2d');const p=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  if(id==='cassette'){p(3,6,18,13,'#c4c8cc');p(3,6,18,1,'#e8ecef');p(5,8,14,5,'#2a2d34');p(7,9,3,3,'#e8ecef');p(14,9,3,3,'#e8ecef');p(5,15,14,2,'#8a9098');for(let i=0;i<4;i++)p(6+i*3,15,2,1,'#4a4f58');
    g.strokeStyle='#2a2a2a';g.lineWidth=1.2;g.beginPath();g.arc(12,6,8,Math.PI,0);g.stroke();p(2,3,3,5,'#d24a2e');p(19,3,3,5,'#d24a2e')}
  if(id==='landline'){p(3,13,18,8,'#c9c2b0');p(3,13,18,1,'#e6dfcc');for(let y=0;y<3;y++)for(let x=0;x<3;x++)p(8+x*3,15+y*2,2,1,'#5a5550');p(2,8,20,4,'#c9c2b0');p(2,7,4,3,'#b0a894');p(18,7,4,3,'#b0a894');
    g.strokeStyle='#8a8478';g.lineWidth=1;g.beginPath();for(let i=0;i<5;i++){g.moveTo(3.2,15+i*1.4);g.arc(2,15+i*1.4,1.2,0,Math.PI*2)}g.stroke()}
  if(id==='flip'){p(7,2,10,10,'#5a6fa8');p(8,3,8,7,'#a8d8c8');p(8,3,8,1,'#d0f0e4');p(7,12,10,1,'#3a4a78');p(7,13,10,9,'#4a5e98');for(let y=0;y<3;y++)for(let x=0;x<3;x++)p(9+x*2.4,15+y*2,1.6,1,'#c8d0e0');p(10,5,4,1,'#3a5a4a')}
  if(id==='cd'){g.fillStyle='#d8dce4';g.beginPath();g.arc(12,12,10,0,7);g.fill();const gr=g.createLinearGradient(2,2,22,22);gr.addColorStop(0,'rgba(255,120,200,.35)');gr.addColorStop(.5,'rgba(120,230,255,.35)');gr.addColorStop(1,'rgba(255,240,120,.35)');g.fillStyle=gr;g.beginPath();g.arc(12,12,10,0,7);g.fill();
    g.fillStyle='#14131a';g.beginPath();g.arc(12,12,2,0,7);g.fill();p(6,7,9,1,'#2a2a2a');p(7,9,6,1,'#2a2a2a')}
  if(id==='mp3'){p(7,3,10,18,'#efeff2');p(7,3,10,1,'#fff');p(9,5,6,5,'#5a8ac8');g.fillStyle='#c8c8cc';g.beginPath();g.arc(12,15,3.5,0,7);g.fill();g.fillStyle='#efeff2';g.beginPath();g.arc(12,15,1.5,0,7);g.fill();g.strokeStyle='#efeff2';g.lineWidth=1;g.beginPath();g.moveTo(12,21);g.quadraticCurveTo(14,24,20,22);g.stroke()}
  if(id==='vhs'){p(2,6,20,12,'#1d1d22');p(2,6,20,1,'#3a3a44');p(5,8,14,4,'#efe8dc');p(6,9,10,1,'#c0392b');p(6,11,7,1,'#5a5550');p(5,14,4,3,'#3a3a44');p(15,14,4,3,'#3a3a44')}
  if(id==='camera'){p(3,7,18,12,'#9aa0a8');p(3,7,18,1,'#c8ccd2');p(6,5,5,2,'#9aa0a8');g.fillStyle='#2a2d34';g.beginPath();g.arc(12,13,4.5,0,7);g.fill();g.fillStyle='#4a6a9a';g.beginPath();g.arc(12,13,2.5,0,7);g.fill();p(11,12,1,1,'#cfe0ff');p(17,9,2,2,'#e8ecef')}
  if(id==='pad'){g.fillStyle='#3a3a44';g.beginPath();g.ellipse(7,14,5,6,0,0,7);g.fill();g.beginPath();g.ellipse(17,14,5,6,0,0,7);g.fill();p(6,9,12,7,'#3a3a44');p(5,12,4,1,'#9aa0a8');p(6,11,1,3,'#9aa0a8');
    p(16,11,2,2,'#d24a2e');p(18,13,2,2,'#3d9fbf');p(14,13,2,2,'#f2c84b');p(16,15,2,2,'#5ab04a');g.fillStyle='#55555f';g.beginPath();g.arc(10,16,1.6,0,7);g.fill()}
  if(id==='pet'){g.fillStyle='#e87aa8';g.beginPath();g.ellipse(12,13,8,9,0,0,7);g.fill();p(8,8,8,7,'#b8c8a0');p(10,10,1,1,'#2a2d24');p(13,10,1,1,'#2a2d24');p(11,12,2,1,'#2a2d24');p(9,17,2,2,'#f3ead6');p(12,18,2,2,'#f3ead6');p(15,17,2,2,'#f3ead6');p(11,2,2,3,'#c9a043')}
  if(id==='usb'){p(5,9,12,6,'#3d5fb8');p(5,9,12,1,'#5a7ad0');p(17,10,5,4,'#c8ccd2');p(18,11,1,1,'#3a3a44');p(20,11,1,1,'#3a3a44');p(7,11,6,2,'#efe8dc');g.strokeStyle='#d24a2e';g.lineWidth=1.4;g.beginPath();g.moveTo(5,12);g.quadraticCurveTo(-2,4,6,2);g.stroke()}
}
function drawSabu(c){const g=c.getContext('2d');c.width=32;c.height=32;const p=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
  p(6,6,20,22,'#d6b04a');for(let y=8;y<28;y+=3){p(5,y,6,2,'#3d5fb8');p(21,y,6,2,'#3d5fb8')}p(8,4,16,4,'#d6b04a');for(let x=9;x<24;x+=3)p(x,4,2,4,'#3d5fb8');
  p(10,9,12,15,'#9c6a3e');p(10,9,12,2,'#b07c3a');p(11,13,4,2,'#1b120a');p(17,13,4,2,'#1b120a');p(12,13,2,1,'#f3ead6');p(18,13,2,1,'#f3ead6');p(10,14,2,1,'#1b120a');p(20,14,2,1,'#1b120a');
  p(15,16,2,3,'#7a4f2c');p(13,20,6,1,'#5a2a1a');p(14,21,4,1,'#f3ead6');p(14,23,4,5,'#2a1e16');p(8,27,16,5,'#efe8dc');p(12,27,8,2,'#d6b04a')}
