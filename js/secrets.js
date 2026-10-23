/*
  Arkeol v0.3.3 · Copyright (C) 2026 JP Hakoluoto
  Free software under the GNU GPL v3 or later, with an attribution term (see LICENSE and NOTICE).
  secrets.js – old computers with number puzzles (and the databases they unlock),
               and sealed vaults that only open with a lever or a button somewhere in the layer
*/
'use strict';
let terms=[],vaults=[],curTerm=null,termBusy=false;
store.dbs=store.dbs||{};
(function(){try{const s=JSON.parse(localStorage.getItem(SKEY)||'null');if(s&&s.dbs)store.dbs=s.dbs}catch(e){}})();

/* ------------------------------------------------ puzzles: always an integer answer */
function makePuzzle(lv){const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),d=Math.min(lv,9);
  const kinds=['arith','seq','bin','eq'];if(d>=4)kinds.push('mod','seq');if(d>=5)kinds.push('hex','fib');
  const k=pickR(kinds);let q,a;
  if(k==='arith'){const x=R(3,6+d),y=R(3,6+d),z=R(2,10+d*2),op=Math.random()<.5;q=`${x} * ${y} ${op?'+':'-'} ${z}`;a=x*y+(op?z:-z)}
  else if(k==='seq'){const t=R(0,3);
    if(t===0){const s=R(1,5),st=R(2,4);const v=[s,s*st,s*st*st,s*st**3];q=v.join(', ')+', ?';a=s*st**4}
    else if(t===1){const s=R(1,20),st=R(3,9+d);const v=[0,1,2,3].map(i=>s+i*st);q=v.join(', ')+', ?';a=s+4*st}
    else if(t===2){const c=R(0,3);const v=[1,2,3,4,5].map(n=>n*n+c);q=v.join(', ')+', ?';a=36+c}
    else{const v=[1,2,3,4].map(n=>n*(n+1)/2);q=v.join(', ')+', ?';a=15}}
  else if(k==='fib'){let x=R(1,3),y=R(2,5);const v=[x,y];for(let i=0;i<4;i++){const z=v[v.length-1]+v[v.length-2];v.push(z)}a=v[v.length-1]+v[v.length-2];q=v.join(', ')+', ?'}
  else if(k==='bin'){const n=R(5,16+d*6);q=`0b${n.toString(2)} = ? (decimal)`;a=n}
  else if(k==='hex'){const n=R(20,200);q=`0x${n.toString(16).toUpperCase()} = ? (decimal)`;a=n}
  else if(k==='mod'){const n=R(40,400),m=R(3,9);q=`${n} mod ${m} = ?`;a=n%m}
  else{const x=R(2,9+d),m=R(2,6),c=R(1,20);q=`${m}x + ${c} = ${m*x+c}   x = ?`;a=x}
  const opts=new Set([a]);while(opts.size<4){const o=a+pickR([-1,1])*R(1,Math.max(3,Math.round(Math.abs(a)*.25)+2));if(o>=0)opts.add(o)}
  return {q,a,opts:[...opts].sort(()=>Math.random()-.5)}}

/* ------------------------------------------------ what the databases hold */
const DBS=[
 {id:'recipes',f:'recipes.db',kind:'recipe'},{id:'survey',f:'survey_layer.db',kind:'map'},{id:'facility',f:'facility_doors.db',kind:'vault'},{id:'wallet',f:'wallet.dat',kind:'cash'},
 {id:'cat',f:'IMG_0042.txt',kind:'art',art:` /\\_/\\\n( o.o )   "the office cat, 2006"\n > ^ <    (he ran the whole department)`},
 {id:'puijo',f:'puijo_tower.txt',kind:'art',art:`        |\n       _|_\n      |___|\n       | |      PUIJO\n       | |      view: ~100 lakes\n  _____| |_____\n ~~~~~~~~~~~~~~~ Kallavesi ~~~~`},
 {id:'kukko',f:'kalakukko.txt',kind:'art',art:`   ___________\n  /  o   o    \\    KALAKUKKO\n |   RYE CRUST |   fish inside, as tradition demands\n  \\___________/    bake 6 h. knock. if it sounds like\n                   a door, it is done.`,learn:'kalakukko'},
 {id:'rocket',f:'launch_2009.txt',kind:'art',art:`     /\\\n    /  \\\n   | () |\n   |    |    "launch postponed:\n  /|    |\\    sky busy"\n /_|____|_\\\n    /||\\`},
 {id:'m1',f:'meme_001.jpg.txt',kind:'meme',en:'ME: just one more block\nALSO ME, 400 METRES LATER:\n"where exactly was the surface"',fi:'MINÄ: vielä yksi palikka\nMYÖS MINÄ 400 METRIÄ MYÖHEMMIN:\n"missä se pinta oikein olikaan"'},
 {id:'m2',f:'meme_002.jpg.txt',kind:'meme',en:'SPIDER: *swells up*\nME, WITH ZERO ROPES:\n[ visible panic ]',fi:'HÄMÄHÄKKI: *turpoaa*\nMINÄ, NOLLA KÖYTTÄ:\n[ näkyvää paniikkia ]'},
 {id:'m3',f:'meme_003.jpg.txt',kind:'meme',en:'There are 10 kinds of diggers:\nthose who read binary\nand those who don\'t.',fi:'Kaivajia on 10 lajia:\nne jotka osaavat binääriä\nja ne jotka eivät.'},
 {id:'m4',f:'meme_004.jpg.txt',kind:'meme',en:'HAVE YOU TRIED TURNING\nTHE PYRAMID\nOFF AND ON AGAIN?',fi:'OLETKO KOKEILLUT SAMMUTTAA\nPYRAMIDIN\nJA KÄYNNISTÄÄ UUDELLEEN?'},
 {id:'m5',f:'meme_005.jpg.txt',kind:'meme',en:'ERROR 404\nSURFACE NOT FOUND',fi:'VIRHE 404\nPINTAA EI LÖYTYNYT'},
 {id:'m6',f:'meme_006.jpg.txt',kind:'meme',en:'SABU: "A deal is a deal."\nALSO SABU:\n*sells one rope for 350*',fi:'SABU: "Kauppa on kauppa."\nMYÖS SABU:\n*myy yhden köyden 350:llä*'},
 {id:'m7',f:'meme_007.jpg.txt',kind:'meme',en:'WOLF: grrr…\nME: i respect your\nboundaries',fi:'SUSI: grrr…\nMINÄ: kunnioitan\nrajojasi'},
 {id:'m8',f:'meme_008.jpg.txt',kind:'meme',en:'REIJO: "everything works"\nTHE SCRAP PISTOL, SHOT 9:\n*creak*',fi:'REIJO: "kaikki toimii"\nROMUPISTOOLI, 9. LAUKAUS:\n*narsk*'},
 {id:'fact',f:'facts_savo.txt',kind:'meme',en:'FACT: the lake town has a tower on a hill,\na lake in every direction and an\nalarming number of fish pasties.',fi:'FAKTA: järvikaupungissa on torni mäellä,\njärvi joka suunnassa ja hälyttävän\nmonta kalakukkoa.'}
];
function pickDb(){const v=vaults.find(q=>!q.open);const pool=DBS.filter(d=>!store.dbs[d.id]&&(d.kind!=='vault'||v)&&(d.kind!=='recipe'||lockedRecipes().length));
  if(pool.length)return pickR(pool);return v&&Math.random()<.5?DBS.find(d=>d.kind==='vault'):DBS.find(d=>d.kind==='cash')}

/* ------------------------------------------------ generation */
function spawnSecrets(lv,H){const {ri,r,airFloor,far,sy,freeRect,protRect}=H;terms=[];vaults=[];
  // a sealed vault
  if(lv>=2&&r()<.5){for(let a=0;a<400;a++){const w=9,h=5,x0=ri(4,MW-w-4),y0=ri(Math.max(sy+3,9),MH-h-4);if(!freeRect(x0,y0,w,h))continue;
      const side=r()<.5?-1:1,dx=side<0?x0:x0+w-1;
      for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++){const wall=y===y0||y===y0+h-1||x===x0||x===x0+w-1;grid[idx(x,y)]=wall?VAULT:AIR}
      const door=[];for(const dy of [h-3,h-2]){grid[idx(dx,y0+dy)]=VDOOR;door.push([dx,y0+dy])}
      for(let k=1;k<=3;k++){const xx=dx+side*k;for(const dy of [h-3,h-2])if(grid[idx(xx,y0+dy)]!==BED)grid[idx(xx,y0+dy)]=AIR;if(!isSolid(xx,y0+h-1))grid[idx(xx,y0+h-1)]=STONE}
      protRect(x0-1,y0-1,x0+w,y0+h);
      const v={x0,y0,w,h,side,door,open:false,opening:0,lever:null};vaults.push(v);
      // treasure inside
      const fy=y0+h-2,cx=x0+Math.floor(w/2);crates.push({x:cx*T+2,y:(fy+1)*T-11.001,w:12,h:11});
      for(let k=0;k<3;k++)pickups.push({x:(x0+2+k*2)*T+5,y:(fy+1)*T-5.001,w:6,h:5,vx:0,vy:0,kind:'gold',value:120+ri(0,6)*20,t:99,still:true});
      if(r()<.6){const rel=chooseRelic();pickups.push({x:(cx+2)*T+4,y:(fy+1)*T-8.001,w:8,h:8,vx:0,vy:0,kind:'relic',rid:rel.id,value:rel.value,t:99,still:true})}
      if(r()<.5)pickups.push({x:(cx-2)*T+4,y:(fy+1)*T-6.001,w:7,h:6,vx:0,vy:0,kind:'gem',value:500,t:99,still:true});
      {const lk=lockedRecipes();if(lk.length)pickups.push({x:(x0+1)*T+4,y:(fy+1)*T-6.001,w:8,h:6,vx:0,vy:0,kind:'recipe',rid:pickR(lk).id,value:0,t:99,still:true})}
      // the lever or button that opens it, somewhere else in the layer
      for(let b=0;b<3000&&!v.lever;b++){const x=ri(2,MW-3),y=ri(sy,MH-3);const dd=Math.hypot(x-dx,y-(y0+h-2));if(dd<7||dd>24)continue;
        if(grid[idx(x,y)]!==AIR||prot[idx(x,y)]||isWater(x,y))continue;
        if(airFloor(x,y)&&grid[idx(x,y-1)]===AIR&&r()<.6){v.lever={tx:x,ty:y,k:'lever'};decos.push({tx:x,ty:y,k:'lever',sx:0,sy:1,on:0})}
        else{const s=isSolid(x-1,y)?-1:isSolid(x+1,y)?1:0;if(s&&isSolid(x,y+1)){v.lever={tx:x,ty:y,k:'wbutton'};decos.push({tx:x,ty:y,k:'wbutton',sx:s,sy:0,on:0})}}}
      if(!v.lever){vaults.pop()}   // no lever spot found: leave it sealed forever? no – drop it
      break}}
  // old computers
  const nT=lv>=2?(r()<.65?1:0)+(lv>=5&&r()<.35?1:0):0;
  for(let a=0;a<1500&&terms.length<nT;a++){const x=ri(3,MW-4),y=ri(sy+2,MH-3);
    if(!airFloor(x,y)||!airFloor(x+1,y)||grid[idx(x,y-1)]!==AIR||grid[idx(x+1,y-1)]!==AIR||!far(x,y,8)||isWater(x,y))continue;
    if(decos.some(d=>Math.abs(d.tx-x)<2&&d.ty===y))continue;
    terms.push({tx:x,ty:y,solved:false,tries:3,locked:false,puz:null});decos.push({tx:x,ty:y,k:'terminal',sx:0,sy:1})}
}

/* ------------------------------------------------ interaction */
function secretsHint(p,cx){const cy=p.y+p.h/2;
  for(const tm of terms){if(Math.abs(tm.tx*T+16-cx)<1.6*T&&Math.abs(tm.ty*T+8-cy)<1.3*T){if(hit.act)openTerm(tm);return tm.locked?t('termDead'):tm.solved?t('termDone'):coarse?t('hintTermT'):t('hintTerm')}}
  for(const v of vaults){const L=v.lever;if(L&&Math.abs(L.tx*T+8-cx)<1.3*T&&Math.abs(L.ty*T+8-cy)<1.3*T){if(hit.act)pullLever(v);return v.open?t('leverDone'):L.k==='lever'?t('hintLever'):t('hintButton')}
    if(!v.open){for(const [x,y] of v.door)if(Math.abs(x*T+8-cx)<2*T&&Math.abs(y*T+8-cy)<1.5*T)return t('vaultLocked')}}
  return ''}
function secretsClick(m,cx){
  for(const tm of terms)if(m.x>tm.tx*T&&m.x<tm.tx*T+2*T&&m.y>tm.ty*T-4&&m.y<tm.ty*T+T&&Math.hypot(tm.tx*T+16-cx,tm.ty*T-P.y)<4*T){openTerm(tm);return true}
  for(const v of vaults){const L=v.lever;if(L&&Math.abs(m.x-(L.tx*T+8))<10&&Math.abs(m.y-(L.ty*T+8))<10&&Math.hypot(L.tx*T+8-cx,L.ty*T-P.y)<3*T){pullLever(v);return true}}
  return false}
function pullLever(v){if(v.open||v.opening)return;const d=decos.find(q=>q.tx===v.lever.tx&&q.ty===v.lever.ty&&(q.k==='lever'||q.k==='wbutton'));if(d)d.on=1;
  sfx.knock();setTimeout(()=>{sfx.rumble();shake=Math.max(shake,5)},250);v.opening=1;
  const [x,y]=v.door[0],far2=Math.hypot(x*T-P.x,y*T-P.y)>8*T;floatText(P.x+5,P.y-10,far2?t('doorFar'):t('doorNear'),'#ffe7a8');unlock('vault1')}
function updSecrets(){for(const v of vaults){if(!v.opening||v.open)continue;v.opening++;
  if(v.opening%14===0){const c=v.door.find(([x,y])=>grid[idx(x,y)]===VDOOR);if(c){grid[idx(c[0],c[1])]=AIR;particle(c[0]*T+8,c[1]*T+8,['#5e6670','#3a3236','#c8a030'],10,1.6,30,.15,1.5);sfx.knock();shake=Math.max(shake,2)}else{v.open=true;sfx.relic()}}}}

/* ------------------------------------------------ the console */
function openTerm(tm){if(state!=='play')return;curTerm=tm;state='term';releaseAll();$('term').hidden=false;$('termOut').textContent='';$('termOpts').innerHTML='';$('termInput').value='';
  if(tm.locked){termPrint([`arkeol-os login: guest`,``,`Kernel panic - not syncing: too many wrong answers`,`[ the screen flickers and goes dark ]`],()=>{})}
  else if(tm.solved){termPrint([`arkeol-os login: guest`,`$ ls /var/archive`,`${tm.db.f}  (decrypted)`,``,...dbLines(tm.db)],()=>{})}
  else{if(!tm.puz)tm.puz=makePuzzle(level);
    termPrint([`ARKEOL-OS 2.6.18 (tty1)`,``,`arkeol-os login: guest`,`Last login: ${pickR(['Mon Mar 14 04:12','Fri Jun 12 07:40','Tue Apr  2 23:59'])} 2009 on tty1`,`$ ./decrypt /var/archive/*.db`,``,t('termLocked'),t('termSolve',tm.tries),``,`    ${tm.puz.q}`,``],()=>showAnswer(tm))}}
function showAnswer(tm){const o=$('termOpts');o.innerHTML='';tm.puz.opts.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='termBtn';b.textContent=`[${i+1}] ${v}`;b.addEventListener('click',()=>answerTerm(v));o.append(b)});
  const inp=$('termInput');inp.disabled=false;setTimeout(()=>inp.focus(),20)}
function answerTerm(v){const tm=curTerm;if(!tm||termBusy||tm.solved||tm.locked)return;$('termOpts').innerHTML='';$('termInput').value='';
  if(+v===tm.puz.a){tm.solved=true;tm.db=pickDb();store.dbs[tm.db.id]=1;store.stats.hacks=(store.stats.hacks||0)+1;save();if(store.stats.hacks>=5)unlock('hacker');sfx.relic();
    termPrint([`> ${v}`,``,'ACCESS GRANTED',`decrypting ${tm.db.f} ... OK`,``,...dbLines(tm.db,true)],()=>{})}
  else{tm.tries--;sfx.nope();if(tm.tries<=0){tm.locked=true;termPrint([`> ${v}`,'ACCESS DENIED','',`Kernel panic - not syncing: too many wrong answers`],()=>{});particle(tm.tx*T+16,tm.ty*T+4,['#fff1b0','#ffb347'],14,2,24,.15,1)}
    else{tm.puz=makePuzzle(level);termPrint([`> ${v}`,'ACCESS DENIED',t('termSolve',tm.tries),``,`    ${tm.puz.q}`,``],()=>showAnswer(tm))}}}
/* run the reward (once) and describe it */
function dbLines(db,first){const L=[];
  if(db.kind==='recipe'){if(first){const lk=lockedRecipes();if(lk.length){const r=pickR(lk);learnRecipe(r.id);db.got=tr(r.n)}}L.push(t('dbRecipe',db.got||'—'))}
  else if(db.kind==='map'){if(first){seen.fill(1);if(!mapOn)toggleMap();else drawMini()}L.push(t('dbMap'))}
  else if(db.kind==='vault'){const v=vaults.find(q=>!q.open)||vaults[0];if(v&&v.lever){if(first){const{tx,ty}=v.lever;for(let y=ty-2;y<=ty+2;y++)for(let x=tx-2;x<=tx+2;x++)if(x>=0&&y>=0&&x<MW&&y<MH)seen[idx(x,y)]=1;for(const [x,y] of v.door)seen[idx(x,y)]=1;if(!mapOn)toggleMap();else drawMini()}
      const dx=v.lever.tx-Math.floor((P.x+5)/T),dy=v.lever.ty-Math.floor((P.y+8)/T);L.push(t('dbVault',Math.abs(dx),dx<0?t('west'):t('east'),Math.abs(dy),dy<0?t('up'):t('down')))}else L.push(t('dbVaultNone'))}
  else if(db.kind==='cash'){const v=300+level*60;if(first)addMoney(v,P.x+5,P.y-6,'#9ff0a0');L.push(t('dbCash',fmt(v)))}
  else if(db.kind==='art'){L.push(...db.art.split('\n'));if(db.learn&&first)setTimeout(()=>learnRecipe(db.learn),400)}
  else{const box=tr(db).split('\n'),w=Math.max(...box.map(s=>s.length));L.push('+'+'-'.repeat(w+2)+'+',...box.map(s=>'| '+s.padEnd(w)+' |'),'+'+'-'.repeat(w+2)+'+')}
  return L}
function termPrint(lines,done){termBusy=true;$('termInput').disabled=true;const out=$('termOut'),base=out.textContent.replace(/█$/,''),txt=lines.join('\n')+'\n';let i=0;
  const step=()=>{if(state!=='term'){termBusy=false;return}i=Math.min(txt.length,i+3);out.textContent=base+txt.slice(0,i)+(i<txt.length?'█':'');out.scrollTop=out.scrollHeight;
    if(i<txt.length)setTimeout(step,14);else{termBusy=false;done&&done()}};step()}
function closeTerm(){$('term').hidden=true;if(state==='term')state='play';curTerm=null;releaseAll()}
$('termClose').addEventListener('click',closeTerm);
$('termInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const v=e.target.value.trim();if(v!==''&&!isNaN(+v))answerTerm(+v)}});

/* ------------------------------------------------ drawing */
function drawTerminal(d){const x=d.tx*T,y=d.ty*T,tm=terms.find(q=>q.tx===d.tx&&q.ty===d.ty);
  R(x,y+9,30,2,'#6b4426');R(x+1,y+11,2,5,'#4b2e18');R(x+27,y+11,2,5,'#4b2e18');R(x,y+9,30,1,'#8a5a32');
  R(x+4,y-6,18,15,'#c8bea0');R(x+4,y-6,18,1,'#e0d8bc');R(x+21,y-6,1,15,'#9a9078');R(x+6,y-4,14,10,'#0a140c');
  const on=tm&&!tm.locked,fl=(frame>>2)%9===0?.7:1;
  if(on){ctx.globalAlpha=fl;R(x+7,y-3,8,1,'#33ff66');R(x+7,y-1,5,1,'#33ff66');R(x+7,y+1,tm.solved?3:9,1,'#33ff66');if(!tm.solved&&(frame>>4)%2)R(x+7,y+3,2,1,'#33ff66');if(tm.solved)R(x+7,y+3,6,1,'#9ff0a0');ctx.globalAlpha=1}
  else{R(x+12,y,2,1,'#2a3a2a')}
  R(x+23,y+5,6,4,'#d8d0b4');R(x+23,y+5,6,1,'#efe8d0');R(x+5,y+8,14,1,'#a89c80')}
function drawLever(d){const x=d.tx*T,y=d.ty*T;R(x+4,y+13,8,3,'#5e6670');R(x+4,y+13,8,1,'#8f99a3');ctx.save();ctx.translate(x+8,y+14);ctx.rotate(d.on?.7:-.7);R(-1,-10,2,10,'#3a3236');R(-2,-12,4,3,'#c0392b');R(-1,-12,1,1,'#ff8a7a');ctx.restore()}
function drawWButton(d){const x=d.tx*T+(d.sx<0?0:12),y=d.ty*T+5;R(x,y,4,7,'#5e6670');R(x+(d.sx<0?1:0),y+2,3,3,d.on?'#5a8a3a':'#c0392b');if(!d.on&&(frame>>5)%2)R(x+(d.sx<0?2:1),y+3,1,1,'#ff8a7a')}
function secretsLight(hole,glows){for(const tm of terms){if(tm.locked)continue;const x=tm.tx*T+13,y=tm.ty*T+1;hole(x,y,2.4*T,.75);glows.push([x,y,1.6*T,'rgba(60,255,120,.14)'])}}
