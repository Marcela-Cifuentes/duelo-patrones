// Contenido y utilidades compartidas entre la página de las parejas y la de la profe.
export const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const FILTERS={sepia:{n:'Sepia',css:'sepia(.9)'},vineta:{n:'Viñeta (esquinas oscuras)',css:''},brillo:{n:'Brillo (más luz)',css:'brightness(1.4)'},gris:{n:'Blanco y negro',css:'grayscale(1)'}};
export const LAYERS={grave:'Grave (sonido bajito y profundo)',agudo:'Agudo (sonido alto y brillante)',rapido:'Rápido (notas extra y veloces)',eco:'Eco (el sonido se repite)'};
export const ROUNDS=[
 {type:'img',title:'Arma el filtro',dur:75,mult:1,i:0},
 {type:'mus',title:'Escucha las capas',dur:75,mult:1},
 {type:'tree',title:'Pesa la carpeta',dur:90,mult:1},
 {type:'det',title:'Detective de patrones',dur:80,mult:1},
 {type:'img',title:'Final: arma el filtro',dur:90,mult:2,i:1}];
const IMG=[
 {p:'Quiero una foto antigua y con las esquinas oscuras. Pon los filtros en ese orden.',s:['sepia','vineta'],t:'Foto antigua = Sepia, esquinas oscuras = Viñeta.'},
 {p:'Quiero una foto en blanco y negro, bien luminosa y con las esquinas oscuras. Pon los filtros en ese orden.',s:['gris','brillo','vineta'],t:'Blanco y negro = Gris, luminosa = Brillo, esquinas oscuras = Viñeta. Cada filtro envuelve al anterior.'}];
const MUS=[['grave','rapido'],['agudo','eco'],['grave','eco'],['rapido','agudo']];
const MUSN={grave:'grave',agudo:'agudo',rapido:'rápido',eco:'eco'};
export const DET=[
 {t:'En Instagram pones el filtro sepia y encima otro de viñeta a la misma foto.',a:'D',w:'Filtros que se apilan sobre la misma foto: Decorator.'},
 {t:'Un café al que le agregas leche, luego crema y luego chocolate, sin cambiar el café.',a:'D',w:'Le agregas capas al mismo objeto: Decorator.'},
 {t:'Una pizza base a la que le sumas ingredientes extra uno por uno, y el precio va sumando.',a:'D',w:'Cada extra envuelve a la pizza y suma al precio: Decorator.'},
 {t:'Un mensaje al que le añades cifrado y luego compresión, sin tocar el mensaje original.',a:'D',w:'Capas añadidas sin cambiar el original: Decorator.'},
 {t:'Una carpeta de Google Drive que tiene archivos y también otras carpetas con más archivos.',a:'C',w:'Cajas dentro de cajas, y se tratan igual: Composite.'},
 {t:'Un menú con submenús, y cada submenú puede tener más submenús y opciones.',a:'C',w:'Un árbol de elementos que contienen elementos: Composite.'},
 {t:'Un organigrama: el jefe tiene equipos, y cada equipo tiene personas.',a:'C',w:'Estructura en árbol de todo y partes: Composite.'},
 {t:'Una lista de reproducción que puede contener canciones y también otras listas.',a:'C',w:'Listas dentro de listas: Composite.'},
 {t:'Un botón que, al pulsarlo, abre una ventana.',a:'N',w:'No agrega capas ni forma un árbol: ninguno de los dos.'},
 {t:'Un semáforo que cambia de color cada cierto tiempo.',a:'N',w:'Solo cambia de estado: ninguno de los dos.'},
 {t:'Una calculadora que suma dos números.',a:'N',w:'Una operación simple: ninguno de los dos.'},
 {t:'Un login que revisa usuario y contraseña.',a:'N',w:'Una validación simple: ninguno de los dos.'}];
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function rng(seed){let a=seed;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const pick=(r,a)=>a[Math.floor(r()*a.length)];
function shuffle(r,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function sumTree(n){return n.k==='d'?n.c.reduce((s,x)=>s+sumTree(x),0):n.s;}
// Devuelve el desafío completo (solo la profe debería usar key/solText).
export function makeChallenge(r,code){
  const R=ROUNDS[r],g=rng(hash(code+'#'+r)),S=[5,10,15,20,25,30,40];
  if(R.type==='img'){const c=IMG[R.i];return{prompt:c.p,pub:{pieces:Object.keys(FILTERS)},key:c.s.join(','),solText:'Orden correcto: '+c.s.map(k=>FILTERS[k].n.split(' (')[0]).join(' → ')+'. '+c.t};}
  if(R.type==='mus'){const s=pick(g,MUS);return{prompt:'A la melodía base le pusieron capas. ¿Cuáles escuchas? Marca todas las que oigas.',pub:{layers:Object.keys(LAYERS)},key:s.slice().sort().join(','),solText:'La melodía tenía las capas: '+s.map(k=>MUSN[k]).join(' y ')+'. Cada capa es un Decorator que envuelve a la anterior.',set:s};}
  if(R.type==='tree'){const f=(n)=>({n,k:'f',s:pick(g,S)});
    const t={n:'Proyecto',k:'d',c:[f('tarea.pdf'),{n:'Fotos',k:'d',c:[f('playa.jpg'),f('grupo.jpg'),f('clase.jpg')]},{n:'Clase',k:'d',c:[f('notas.docx'),{n:'Extras',k:'d',c:[f('video.mp4'),f('musica.mp3')]}]}]};
    const tot=sumTree(t);return{prompt:'¿Cuántos MB pesa la carpeta «Proyecto» completa, contando todo lo que tiene dentro?',pub:{tree:t},key:String(tot),solText:'Se suman todos los archivos de todas las cajas: '+tot+' MB. El Composite deja pedirle el tamaño a la carpeta raíz y ella pregunta a sus hijos.'};}
  const D=DET.filter(x=>x.a==='D'),C=DET.filter(x=>x.a==='C'),N=DET.filter(x=>x.a==='N');
  const cs=shuffle(g,[pick(g,D),pick(g,C),pick(g,N)]);
  return{prompt:'Lee cada caso y decide: ¿Decorator, Composite o Ninguno? Acierta los 3.',pub:{cases:cs.map(x=>x.t)},key:cs.map(x=>x.a).join(''),solText:cs.map((x,i)=>(i+1)+') '+({D:'Decorator',C:'Composite',N:'Ninguno'}[x.a])+': '+x.w).join('  ')};
}
export function photoHTML(stack){
  const f=stack.map(k=>FILTERS[k].css).filter(Boolean).join(' ');
  return `<div class="photo"><svg viewBox="0 0 300 200" style="filter:${f||'none'}"><rect width="300" height="200" fill="#8EC9F0"/><circle cx="235" cy="45" r="22" fill="#FFD84A"/><path d="M0 140Q80 90 150 130T300 120V200H0Z" fill="#5FAE3C"/><rect x="60" y="105" width="55" height="40" fill="#E9604C"/><path d="M52 107L87 80L123 107Z" fill="#8B3A2B"/><rect x="80" y="122" width="14" height="23" fill="#FFF3D6"/></svg><div class="vig" style="opacity:${stack.includes('vineta')?1:0}"></div></div>`;
}
export function treeHTML(n,root){
  if(n.k==='f')return `<span class="file">📄 ${esc(n.n)} · ${n.s} MB</span>`;
  return `<div class="box ${root?'root':''}"><div class="bh">📁 ${esc(n.n)}</div>${n.c.map(x=>treeHTML(x)).join('')}</div>`;
}
export function confetti(n=70){const cols=['#6B2F94','#4E8A1A','#C86A06','#C4173F','#F3B21B'];for(let i=0;i<n;i++){const e=document.createElement('i');e.className='confetti';e.style.left=Math.random()*100+'vw';e.style.background=cols[i%5];e.style.animationDelay=Math.random()*.8+'s';e.style.animationDuration=(1.6+Math.random()*1.4)+'s';document.body.appendChild(e);setTimeout(()=>e.remove(),4000);}}
export function rankList(pairs,scores,meId){
  const a=Object.entries(pairs||{}).map(([id,p])=>({id,n:p.name,s:(scores||{})[id]||0})).sort((x,y)=>y.s-x.s);
  const mx=Math.max(1,...a.map(x=>x.s));
  return a.map((x,i)=>`<div style="display:flex;align-items:center;gap:8px;margin:6px 0;${x.id===meId?'font-weight:800;color:var(--c)':''}"><span style="width:26px">${['🥇','🥈','🥉'][i]||(i+1)+'.'}</span><span style="flex:0 0 36%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(x.n)}</span><span style="flex:1;background:#eee;border-radius:8px;height:14px"><span style="display:block;height:100%;width:${x.s/mx*100}%;background:var(--c);border-radius:8px;transition:width .6s"></span></span><b>${x.s}</b></div>`).join('')||'<i>Aún no hay parejas</i>';
}
