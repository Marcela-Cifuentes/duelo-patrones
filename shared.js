// Contenido, dibujos y utilidades compartidas entre la página de los equipos y la de la profe.
export const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const PALETTE=['#6B2F94','#3F7414','#D9730D','#C4173F','#1F6FB5','#0F8B8D'];
export function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export const colorOf=id=>PALETTE[hash(id)%PALETTE.length];
export const FILTERS={sepia:{n:'Sepia',css:'sepia(.9)',sw:'#B98A4A'},vineta:{n:'Viñeta',css:'',sw:'#3A2F2F'},brillo:{n:'Brillo',css:'brightness(1.4)',sw:'#FFE27A'},gris:{n:'Blanco y negro',css:'grayscale(1)',sw:'#9A9A9A'}};
export const TR={
  img:{n:'Arma la foto',d:'Mira la foto objetivo y activa los filtros para que tu foto quede igual.',c:'#6B2F94',dur:[70,70,80]},
  mem:{n:'Memoria relámpago',d:'Las carpetas aparecen 10 segundos y se esconden. ¡Respondan de memoria!',c:'#3F7414',dur:[40,40,45],showSec:10},
  det:{n:'Detective de patrones',d:'¿Es Decorator, Composite o ninguno? Lean cada caso y decidan.',c:'#D9730D',dur:[60,75,90]}};
export const QN=3;
export const mult=q=>q===QN-1?2:1;
const DET=[
 {e:'📸',t:'En Instagram pones el filtro sepia y encima otro de viñeta a la misma foto.',a:'D',w:'Filtros apilados sobre la misma foto: Decorator.'},
 {e:'☕',t:'Un café al que le agregas leche, luego crema y luego chocolate, sin cambiar el café.',a:'D',w:'Le agregas capas al mismo objeto: Decorator.'},
 {e:'🍕',t:'Una pizza base a la que le sumas ingredientes extra uno por uno, y el precio va sumando.',a:'D',w:'Cada extra envuelve a la pizza: Decorator.'},
 {e:'🔐',t:'Un mensaje al que le añades cifrado y luego compresión, sin tocar el mensaje original.',a:'D',w:'Capas añadidas sin cambiar el original: Decorator.'},
 {e:'📁',t:'Una carpeta de Google Drive con archivos y también otras carpetas con más archivos.',a:'C',w:'Cajas dentro de cajas que se tratan igual: Composite.'},
 {e:'🍔',t:'Un menú con submenús, y cada submenú puede tener más submenús y opciones.',a:'C',w:'Árbol de elementos que contienen elementos: Composite.'},
 {e:'🏢',t:'Un organigrama: el jefe tiene equipos, y cada equipo tiene personas.',a:'C',w:'Todo y partes en árbol: Composite.'},
 {e:'🎵',t:'Una lista de reproducción que puede tener canciones y también otras listas.',a:'C',w:'Listas dentro de listas: Composite.'},
 {e:'🔘',t:'Un botón que, al pulsarlo, abre una ventana.',a:'N',w:'No agrega capas ni forma un árbol: ninguno.'},
 {e:'🚦',t:'Un semáforo que cambia de color cada cierto tiempo.',a:'N',w:'Solo cambia de estado: ninguno.'},
 {e:'🧮',t:'Una calculadora que suma dos números.',a:'N',w:'Una operación simple: ninguno.'},
 {e:'🔑',t:'Un login que revisa usuario y contraseña.',a:'N',w:'Una validación simple: ninguno.'}];
function rng(seed){let a=seed;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
function shuffle(r,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export const sumTree=n=>n.k==='d'?n.c.reduce((s,x)=>s+sumTree(x),0):n.s;
export const countFiles=n=>n.k==='d'?n.c.reduce((s,x)=>s+countFiles(x),0):1;
export const countDirs=n=>n.k==='d'?1+n.c.reduce((s,x)=>s+countDirs(x),0):0;
const IMGQ=[['sepia','vineta'],['gris','brillo'],['gris','brillo','vineta']];
const MQ=[{k:'files',p:'¿Cuántos archivos había en total?'},{k:'mb',p:'¿Cuántos MB pesaba la carpeta «Proyecto» completa?'},{k:'dirs',p:'¿Cuántas carpetas había en total, contando «Proyecto»?'}];
function genTree(g,q){
  const S=[5,10,15,20,25,30,40],FN=shuffle(g,['tarea.pdf','playa.jpg','notas.docx','video.mp4','musica.mp3','logo.png','clase.pptx','datos.xlsx','resumen.pdf','foto.jpg']),DN=shuffle(g,['Fotos','Clase','Extras','Videos','Música','Tareas']);
  let i=0;const f=()=>({n:FN[i++],k:'f',s:pick(g,S)}),d=(n,c)=>({n,k:'d',c});
  const R=[()=>d('Proyecto',[f(),f(),d(DN[0],[f(),f(),f()])]),
           ()=>d('Proyecto',[f(),d(DN[0],[f(),f()]),d(DN[1],[f(),f()])]),
           ()=>d('Proyecto',[f(),d(DN[0],[f(),d(DN[1],[f(),f()])]),d(DN[2],[f(),f()])])];
  return R[q]();
}
// Desafío completo. Solo la profe debería usar key/solText.
export function makeChallenge(g,q,code){
  const T=TR[g],gr=rng(hash(code+g)),base={dur:T.dur[q],mult:mult(q),title:T.n};
  if(g==='img'){const s=IMGQ[q];return{...base,prompt:'Mira la foto objetivo. Activa los filtros que necesitas para que tu foto quede igual.',pub:{target:s,pieces:Object.keys(FILTERS)},key:s.slice().sort().join(','),solText:'Los filtros eran: '+s.map(k=>FILTERS[k].n).join(' + ')+'. Cada filtro es un Decorator que envuelve a la foto.'};}
  if(g==='mem'){const t=genTree(rng(hash(code+'m'+q)),q),m=MQ[q];
    const key=m.k==='files'?countFiles(t):m.k==='mb'?sumTree(t):countDirs(t);
    return{...base,phase:'show',showSec:T.showSec,prompt:'¡Memoricen! Las carpetas se esconden cuando termine la cuenta regresiva.',askPrompt:m.p,pub:{tree:t},key:String(key),solText:'La respuesta era '+key+(m.k==='mb'?' MB':'')+'. Una carpeta le pregunta a sus hijos y suma: eso es Composite.'};}
  const sh=shuffle(gr,DET),sl=[sh.slice(0,3),sh.slice(3,7),sh.slice(7,12)][q];
  return{...base,prompt:'Lean cada caso y decidan: ¿Decorator, Composite o ninguno? Acierten todos.',pub:{cases:sl.map(x=>({e:x.e,t:x.t}))},key:sl.map(x=>x.a).join(''),solText:sl.map((x,i)=>(i+1)+') '+({D:'Decorator',C:'Composite',N:'Ninguno'}[x.a])+': '+x.w).join('  ')};
}
// ---------- dibujos ----------
export const ICON={
 img:`<svg viewBox="0 0 64 64"><rect x="6" y="10" width="52" height="40" rx="8" fill="#fff" opacity=".95"/><rect x="11" y="15" width="42" height="30" rx="4" fill="#8EC9F0"/><circle cx="43" cy="24" r="5" fill="#FFD84A"/><path d="M11 40Q24 28 34 37T53 35V45H11Z" fill="#5FAE3C"/><path d="M50 4l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#FFD84A"/></svg>`,
 mem:`<svg viewBox="0 0 64 64"><path d="M6 20a5 5 0 015-5h14l6 6h22a5 5 0 015 5v22a5 5 0 01-5 5H11a5 5 0 01-5-5z" fill="#FFD36B"/><path d="M6 28h52v19a5 5 0 01-5 5H11a5 5 0 01-5-5z" fill="#FFB938"/><circle cx="46" cy="14" r="10" fill="#fff"/><path d="M46 9v6l4 3" stroke="#3F7414" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
 det:`<svg viewBox="0 0 64 64"><circle cx="27" cy="27" r="16" fill="#fff" opacity=".95"/><circle cx="27" cy="27" r="11" fill="#CFE8FA"/><path d="M39 39l16 16" stroke="#fff" stroke-width="7" stroke-linecap="round"/><text x="27" y="33" text-anchor="middle" font-size="16" font-weight="800" fill="#D9730D" font-family="Arial">?</text></svg>`};
export const initial=n=>(String(n||'?').trim()[0]||'?').toUpperCase();
export const avatar=(id,name,sz=44)=>`<span class="av" style="width:${sz}px;height:${sz}px;font-size:${sz*.46}px;background:${colorOf(id)}">${esc(initial(name))}</span>`;
export function photoHTML(stack,cls=''){
  const f=stack.map(k=>FILTERS[k].css).filter(Boolean).join(' ');
  return `<div class="photo ${cls}"><svg viewBox="0 0 300 200" style="filter:${f||'none'}"><rect width="300" height="200" fill="#8EC9F0"/><circle cx="235" cy="45" r="22" fill="#FFD84A"/><path d="M0 140Q80 90 150 130T300 120V200H0Z" fill="#5FAE3C"/><rect x="60" y="105" width="55" height="40" fill="#E9604C"/><path d="M52 107L87 80L123 107Z" fill="#8B3A2B"/><rect x="80" y="122" width="14" height="23" fill="#FFF3D6"/><circle cx="200" cy="150" r="9" fill="#2F7D32"/><rect x="198" y="150" width="4" height="14" fill="#6B4226"/></svg><div class="vig" style="opacity:${stack.includes('vineta')?1:0}"></div></div>`;
}
export function treeHTML(n,root){
  if(n.k==='f')return `<span class="file">📄 ${esc(n.n)} <b>${n.s} MB</b></span>`;
  return `<div class="box ${root?'root':''}"><div class="bh">📁 ${esc(n.n)}</div>${n.c.map(x=>treeHTML(x)).join('')}</div>`;
}
export const ring=id=>`<div class="ring" id="${id}"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" class="rb"/><circle cx="32" cy="32" r="26" class="rf" stroke-dasharray="163.4" stroke-dashoffset="0"/></svg><b>0</b></div>`;
export function setRing(id,rem,tot){const e=document.getElementById(id);if(!e)return;e.querySelector('.rf').style.strokeDashoffset=163.4*(1-Math.max(0,Math.min(1,rem/tot)));e.querySelector('b').textContent=Math.max(0,Math.ceil(rem));e.classList.toggle('low',rem<=5);}
export function confetti(n=70){const cols=PALETTE.concat(['#F3B21B']);for(let i=0;i<n;i++){const e=document.createElement('i');e.className='confetti';e.style.left=Math.random()*100+'vw';e.style.background=cols[i%cols.length];e.style.animationDelay=Math.random()*.8+'s';e.style.animationDuration=(1.6+Math.random()*1.4)+'s';e.style.borderRadius=i%3?'2px':'50%';document.body.appendChild(e);setTimeout(()=>e.remove(),4200);}}
const sorted=(pairs,scores)=>Object.entries(pairs||{}).map(([id,p])=>({id,n:p.name,s:(scores||{})[id]||0})).sort((x,y)=>y.s-x.s);
export function rankList(pairs,scores,meId){
  const a=sorted(pairs,scores),mx=Math.max(1,...a.map(x=>x.s));
  return a.map((x,i)=>`<div class="rk ${x.id===meId?'me':''}"><span class="pos">${['🥇','🥈','🥉'][i]||(i+1)}</span>${avatar(x.id,x.n,34)}<span class="rn">${esc(x.n)}</span><span class="rbar"><span style="width:${x.s/mx*100}%;background:${colorOf(x.id)}"></span></span><b>${x.s}</b></div>`).join('')||'<i>Aún no hay equipos</i>';
}
export function podiumHTML(pairs,scores){
  const a=sorted(pairs,scores),H=[150,205,115],ord=[1,0,2];
  const col=i=>{const x=a[i];if(!x)return '<div class="pcol"></div>';return `<div class="pcol"><div class="pn">${avatar(x.id,x.n,i===0?64:52)}<div class="pt">${esc(x.n)}</div><div class="ps">${x.s} pts</div></div><div class="pbl" style="height:${H[i]}px;background:linear-gradient(180deg,${colorOf(x.id)},color-mix(in srgb,${colorOf(x.id)} 70%,#000))">${['🥇','🥈','🥉'][i]}</div></div>`;};
  const rest=a.slice(3).map((x,i)=>`<div class="rk"><span class="pos">${i+4}</span>${avatar(x.id,x.n,30)}<span class="rn">${esc(x.n)}</span><b>${x.s}</b></div>`).join('');
  return `<div class="podium">${ord.map(col).join('')}</div>${rest?`<div style="max-width:520px;margin:14px auto 0">${rest}</div>`:''}`;
}
