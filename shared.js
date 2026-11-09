// Duelo de patrones v3 (torneo): utilidades, banco de retos y dibujos compartidos por la profe y los equipos.
export const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const PALETTE=['#6B2F94','#3F7414','#D9730D','#C4173F','#1F6FB5','#0F8B8D'];
export function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export const colorOf=id=>PALETTE[hash(id)%PALETTE.length];
export const initial=n=>(String(n||'?').trim()[0]||'?').toUpperCase();
export const avatar=(id,name,sz=44)=>`<span class="av" style="width:${sz}px;height:${sz}px;font-size:${sz*.46}px;background:${colorOf(id)}">${esc(initial(name))}</span>`;
export function rng(seed){let a=seed;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export function shuffle(r,a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const pick=(r,a)=>a[Math.floor(r()*a.length)];

export const TY={
  order:{n:'Ordena las piezas',e:'🧩',c:'#6B2F94',d:'Toquen las piezas en el orden correcto.'},
  mem:{n:'Memoria relámpago',e:'⚡',c:'#3F7414',d:'Se ve unos segundos, se esconde y responden de memoria.'},
  tf:{n:'Carrera V o F',e:'🏁',c:'#D9730D',d:'Seis afirmaciones: gana quien acierte más y más rápido.'},
  err:{n:'Encuentra el error',e:'🔎',c:'#C4173F',d:'Hay una línea con un fallo escondido. Tóquenla.'}};

// ---------- banco de retos (nunca se repiten dentro de un torneo) ----------
const O=(id,t,p,items,sol,dur=60)=>({id,ty:'order',t,p,items:items.map(([i,x])=>({id:i,t:x})),sol,dur});
const T=(id,t,rows,dur=60)=>({id,ty:'tf',t,p:'Toquen Verdadero o Falso en cada afirmación. ¡Rápido y sin dudar!',rows,dur});
const E=(id,t,p,lines,k,sol,dur=50)=>({id,ty:'err',t,p,lines,k,sol,dur});
const M=(id,t,kind,extra)=>Object.assign({id,ty:'mem',t,kind,showSec:10,dur:35},extra);
export const POOL=[
 O('o1','Foto antigua con esquinas oscuras','Ordenen las capas de adentro hacia afuera para armar: foto antigua, con esquinas oscuras y bien iluminada.',[['base','Foto base'],['sepia','Filtro Sepia'],['vineta','Filtro Viñeta'],['brillo','Filtro Brillo']],'De adentro hacia afuera: foto base, sepia (antigua), viñeta (esquinas) y brillo (luz).'),
 O('o2','Café con extras','Ordenen las capas de este pedido, de adentro hacia afuera: un café con leche, luego crema y por último chocolate.',[['cafe','Café'],['leche','+ Leche'],['crema','+ Crema'],['choco','+ Chocolate']],'Cada extra envuelve al anterior: café, leche, crema y al final chocolate.'),
 O('o3','Así suma una carpeta','Ordenen las líneas del método tamaño() de la Carpeta (Composite).',[['a','total = 0'],['b','para cada hijo en hijos'],['c','total = total + hijo.tamaño()'],['d','devolver total']],'La carpeta empieza en cero, recorre sus hijos, suma lo que responda cada uno y devuelve el total.'),
 O('o4','Mensaje seguro','Ordenen las capas de un mensaje: primero se comprime, luego se cifra y al final se firma.',[['msg','Mensaje'],['zip','Compresión'],['enc','Cifrado'],['firma','Firma']],'De adentro hacia afuera: mensaje, compresión, cifrado y firma. Son capas de Decorator.'),
 O('o5','Carpetas de menor a mayor peso','Ordenen las carpetas de la que menos pesa a la que más pesa (sumen sus archivos).',[['tar','📁 Tareas: 5 + 10 MB'],['fot','📁 Fotos: 10 + 20 MB'],['mus','📁 Música: 15 + 25 MB'],['vid','📁 Videos: 30 + 35 MB']],'Pesos: Tareas 15, Fotos 30, Música 40 y Videos 65. Cada carpeta suma a sus hijos: Composite.'),
 O('o6','Crear el filtro Retro','Ordenen los pasos para agregar un filtro nuevo al Decorator.',[['a','Crear la clase FiltroRetro'],['b','Que cumpla el contrato Imagen'],['c','Guardar la Imagen que va a envolver'],['d','Usarlo: new FiltroRetro(foto)']],'Clase nueva, mismo contrato, guarda lo que envuelve y se usa envolviendo la foto. Nada más cambia.'),
 M('m1','Cuántos archivos','tree',{v:0,calc:'files',ask:{k:'num',p:'¿Cuántos archivos había en total?'}}),
 M('m2','Cuántos MB pesaba','tree',{v:1,calc:'mb',ask:{k:'num',p:'¿Cuántos MB pesaba la carpeta «Proyecto» completa?'}}),
 M('m3','Cuántas carpetas había','tree',{v:2,calc:'dirs',ask:{k:'num',p:'¿Cuántas carpetas había en total, contando «Proyecto»?'}}),
 M('m4','La capa de más afuera','stack',{layers:['Brillo','Sepia','Viñeta','Foto base'],ask:{k:'opts',p:'¿Cuál era la capa de más afuera?',opts:[{id:'Brillo',t:'Brillo'},{id:'Sepia',t:'Sepia'},{id:'Viñeta',t:'Viñeta'},{id:'Foto base',t:'Foto base'}]},key:'Brillo',sol:'La capa más afuera era Brillo: es la última en envolver a las demás.'}),
 M('m5','Cuántos filtros tenía','stack',{layers:['Blanco y negro','Brillo','Sepia','Viñeta','Foto base'],ask:{k:'num',p:'¿Cuántos filtros había? (no cuenten la foto base)'},key:'4',sol:'Había 4 filtros envolviendo a la foto base.'}),
 M('m6','Quién guardaba a otro','uml',{ask:{k:'opts',p:'¿Qué clase guardaba el atributo «imagen: Imagen»?',opts:[{id:'FotoBase',t:'FotoBase'},{id:'FiltroBN',t:'FiltroBN'},{id:'Imagen',t:'Imagen'}]},key:'FiltroBN',sol:'FiltroBN guardaba la imagen que envuelve. La foto base no envuelve nada.'}),
 T('t1','Verdadero o falso: Decorator',[['Decorator agrega funciones envolviendo al objeto.','V'],['Con Decorator hace falta una clase por cada combinación de extras.','F'],['Un decorador cumple el mismo contrato que el objeto que envuelve.','V'],['Los decoradores no se pueden apilar.','F'],['El decorador guarda una referencia al objeto que envuelve.','V'],['Decorator cambia el código de la clase original.','F']]),
 T('t2','Verdadero o falso: Composite',[['Composite trata igual a una pieza suelta y a un grupo de piezas.','V'],['Una carpeta de Drive es un ejemplo de Composite.','V'],['Composite sirve para modelar árboles.','V'],['Con Composite hace falta un if para saber si un hijo es archivo o carpeta.','F'],['Un archivo (hoja) tiene una lista de hijos.','F'],['La carpeta suma lo que respondan sus hijos.','V']]),
 T('t3','Verdadero o falso: ¿qué patrón es?',[['Spotify con ecualizador y letra activados a la vez: Decorator.','V'],['Un menú con submenús es un Decorator.','F'],['Un organigrama jefe, equipos y personas es un Composite.','V'],['Un botón de «me gusta» necesita Composite.','F'],['Una pizza con extras que suman precio es un Decorator.','V'],['Escoger UNA forma de pago es un Composite.','F']]),
 T('t4','Verdadero o falso: diagramas',[['En UML, el triángulo vacío indica que una clase cumple un contrato.','V'],['El Decorator guarda una lista de objetos.','F'],['El Composite guarda una lista de hijos del tipo del contrato.','V'],['En el Decorator, FotoBase y los filtros cumplen el mismo contrato.','V'],['La clase Archivo del Composite guarda una lista de hijos.','F'],['Una interfaz en UML ya trae el código de todos sus métodos.','F']]),
 T('t5','Verdadero o falso: pensando en diseño',[['Para un filtro nuevo en Decorator solo hay que crear una clase.','V'],['Un acceso directo nuevo en Composite obliga a cambiar la clase Carpeta.','F'],['El orden de las capas en Decorator puede cambiar el resultado.','V'],['Decorator y Composite sirven siempre para lo mismo.','F'],['Un Decorator puede envolver a otro Decorator.','V'],['En Composite, una carpeta puede contener otras carpetas.','V']]),
 E('e1','Carpeta que suma mal','Una carpeta debería devolver la suma de sus hijos, pero siempre da un número raro. Toquen la línea con el error.',['int tamaño() {','  int total = 0;','  for (ArchivoNube h : hijos)','    total = h.tamaño();','  return total;','}'],3,'La línea «total = h.tamaño()» pisa el total en cada vuelta. Debe sumar: total += h.tamaño().'),
 E('e2','Filtro que no filtra','El FiltroSepia no cambia nada de la foto que envuelve. Toquen la línea con el error.',['class FiltroSepia implements Imagen {','  Imagen imagen;','  String mostrar() {','    return "sepia";','  }','}'],3,'El filtro nunca llama a imagen.mostrar(), así que ignora la capa de adentro. Debe devolver imagen.mostrar() + " sepia".'),
 E('e3','Diagrama del Decorator','Este diagrama del Decorator tiene un atributo mal puesto. Toquen la línea con el error.',['«interface» Imagen','FotoBase cumple Imagen','FiltroBN cumple Imagen','FiltroBN guarda → kb: int'],3,'El filtro debe guardar la imagen que envuelve: «imagen: Imagen», no un número.'),
 E('e4','Diagrama del Composite','Este diagrama del Composite tiene una lista mal tipada. Toquen la línea con el error.',['«interface» ArchivoNube','Archivo cumple ArchivoNube','Carpeta cumple ArchivoNube','Carpeta guarda → hijos: List<Archivo>'],3,'La lista debe ser de ArchivoNube, no de Archivo; si no, no cabrían subcarpetas.'),
 E('e5','Pedido mal armado','El cliente pidió «foto antigua con esquinas oscuras» pero el resultado no es el pedido. Toquen la capa equivocada.',['Pedido: foto antigua con esquinas oscuras','capa 1: FotoBase','capa 2: FiltroViñeta','capa 3: FiltroBlancoYNegro'],3,'Antigua es Sepia. El filtro Blanco y negro no es lo que pidieron.')
];
export const POOLBY=Object.fromEntries(POOL.map(d=>[d.id,d]));

function genTree(g,v){
  const S=[5,10,15,20,25,30,40],FN=shuffle(g,['tarea.pdf','playa.jpg','notas.docx','video.mp4','musica.mp3','logo.png','clase.pptx','datos.xlsx','resumen.pdf','foto.jpg']),DN=shuffle(g,['Fotos','Clase','Extras','Videos','Música','Tareas']);
  let i=0;const f=()=>({n:FN[i++],k:'f',s:pick(g,S)}),d=(n,c)=>({n,k:'d',c});
  return [()=>d('Proyecto',[f(),f(),d(DN[0],[f(),f(),f()])]),
          ()=>d('Proyecto',[f(),d(DN[0],[f(),f()]),d(DN[1],[f(),f()])]),
          ()=>d('Proyecto',[f(),d(DN[0],[f(),d(DN[1],[f(),f()])]),d(DN[2],[f(),f()])])][v]();
}
export const sumTree=n=>n.k==='d'?n.c.reduce((s,x)=>s+sumTree(x),0):n.s;
export const countFiles=n=>n.k==='d'?n.c.reduce((s,x)=>s+countFiles(x),0):1;
export const countDirs=n=>n.k==='d'?1+n.c.reduce((s,x)=>s+countDirs(x),0):0;

// Desafío completo a partir de la definición (determinista con el código de sala).
export function makeChallenge(def,code){
  const r=rng(hash(code+def.id)),base={id:def.id,ty:def.ty,t:def.t,dur:def.dur};
  if(def.ty==='order'){const items=shuffle(r,def.items);return{...base,p:def.p,d:{items},key:def.items.map(x=>x.id).join(','),sol:def.sol};}
  if(def.ty==='tf')return{...base,p:def.p,d:{s:def.rows.map(x=>x[0])},key:def.rows.map(x=>x[1]).join(''),sol:def.rows.map((x,i)=>(i+1)+') '+(x[1]==='V'?'Verdadero':'Falso')).join('   ')};
  if(def.ty==='err')return{...base,p:def.p,d:{lines:def.lines},key:String(def.k),sol:def.sol};
  // memoria
  let d,key=def.key,sol=def.sol;
  if(def.kind==='tree'){const t=genTree(r,def.v);d={kind:'tree',tree:t};key=String(def.calc==='files'?countFiles(t):def.calc==='mb'?sumTree(t):countDirs(t));
    sol='La respuesta era '+key+(def.calc==='mb'?' MB':'')+'. Una carpeta le pregunta a sus hijos y suma: eso es Composite.';}
  else if(def.kind==='stack')d={kind:'stack',layers:def.layers};else d={kind:'uml'};
  return{...base,p:'¡Memoricen! Se esconde cuando termine la cuenta regresiva.',d,showSec:def.showSec,ask:def.ask,key,sol};
}
export const pubOf=ch=>{const o={id:ch.id,ty:ch.ty,t:ch.t,p:ch.p,dur:ch.dur,d:JSON.stringify(ch.d)};if(ch.ty==='mem'){o.showSec=ch.showSec;o.ask=ch.ask;o.phase='show';}return o;};

// ---------- evaluación (la usa la profe) ----------
export function evalSide(ch,att){
  att=(att||[]).slice().sort((a,b)=>(a.t||0)-(b.t||0));
  if(ch.ty==='tf'){const seen={};att.forEach(x=>{const [i,v]=String(x.a).split(':');if(!(i in seen))seen[i]={v,t:x.t||0};});
    let s=0,last=0;const n=Object.keys(seen).length;for(const i in seen){if(ch.key[i]===seen[i].v)s++;last=Math.max(last,seen[i].t);}
    return{s,n,tot:ch.key.length,fin:n>=ch.key.length,t:last};}
  const ok=att.find(x=>x.a===ch.key);return{ok:!!ok,n:att.length,t:ok?(ok.t||0):0};
}
export function decide(ch,A,B,timeUp){
  if(ch.ty==='tf'){const lead=(X,Y)=>X.fin&&!Y.fin&&X.s>0&&X.s>=Y.s+(Y.tot-Y.n);if(lead(A,B))return'a';if(lead(B,A))return'b';if(!(timeUp||(A.fin&&B.fin)))return null;if(A.s!==B.s)return A.s>B.s?'a':'b';if(A.s>0&&A.fin&&B.fin&&A.t!==B.t)return A.t<B.t?'a':'b';return null;}
  if(A.ok&&B.ok)return A.t<=B.t?'a':'b';if(A.ok)return'a';if(B.ok)return'b';return null;
}

// ---------- dibujos ----------
export function treeHTML(n,root){
  if(n.k==='f')return `<span class="file">📄 ${esc(n.n)} <b>${n.s} MB</b></span>`;
  return `<div class="box ${root?'root':''}"><div class="bh">📁 ${esc(n.n)}</div>${n.c.map(x=>treeHTML(x)).join('')}</div>`;
}
const nest=(L,i)=>i>=L.length?'':`<div class="nl" style="--k:${i}"><b>${esc(L[i])}</b>${nest(L,i+1)}</div>`;
export function publicHTML(ch,phase){
  const d=typeof ch.d==='string'?JSON.parse(ch.d||'{}'):ch.d;
  if(ch.ty==='order')return `<div class="ordlist">${d.items.map(x=>`<span class="oi">${esc(x.t)}</span>`).join('')}</div>`;
  if(ch.ty==='tf')return `<ol class="tfl">${d.s.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;
  if(ch.ty==='err')return `<div class="codeb">${d.lines.map(x=>`<div class="cl">${esc(x)}</div>`).join('')}</div>`;
  if(phase==='ask')return `<div class="hide"><div class="ic">🙈</div><b>¡Ya se escondió!</b></div>`;
  if(d.kind==='tree')return treeHTML(d.tree,true);
  if(d.kind==='stack')return `<div class="stk">${nest(d.layers,0)}</div>`;
  return `<div class="umlm"><div class="ub">«interface»<br><b>Imagen</b></div><div class="ua">△ &nbsp; △</div><div class="urow"><div class="ub"><b>FotoBase</b></div><div class="ub"><b>FiltroBN</b><hr>imagen: Imagen</div></div></div>`;
}
export const ring=(id,cls='')=>`<div class="ring ${cls}" id="${id}"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" class="rb"/><circle cx="32" cy="32" r="26" class="rf" stroke-dasharray="163.4" stroke-dashoffset="0"/></svg><b>0</b></div>`;
export function setRing(id,rem,tot){const e=document.getElementById(id);if(!e)return;e.querySelector('.rf').style.strokeDashoffset=163.4*(1-Math.max(0,Math.min(1,rem/tot)));e.querySelector('b').textContent=Math.max(0,Math.ceil(rem));e.classList.toggle('low',rem<=5);}
export function confetti(n=70){const cols=PALETTE.concat(['#F3B21B']);for(let i=0;i<n;i++){const e=document.createElement('i');e.className='confetti';e.style.left=Math.random()*100+'vw';e.style.background=cols[i%cols.length];e.style.animationDelay=Math.random()*.8+'s';e.style.animationDuration=(1.6+Math.random()*1.4)+'s';e.style.borderRadius=i%3?'2px':'50%';document.body.appendChild(e);setTimeout(()=>e.remove(),4200);}}
export function podiumHTML(champ,second,semis,pairs){
  const col=(id,medal,h,big,label)=>{if(!id||!pairs[id])return '<div class="pcol"></div>';const n=pairs[id].name;return `<div class="pcol"><div class="pn">${avatar(id,n,big)}<div class="pt">${esc(n)}</div><div class="ps">${label}</div></div><div class="pbl" style="height:${h}px;background:linear-gradient(180deg,${colorOf(id)},color-mix(in srgb,${colorOf(id)} 70%,#000))">${medal}</div></div>`;};
  return `<div class="podium">${col(second,'🥈',150,52,'Subcampeón')}${col(champ,'🥇',210,70,'¡Campeón!')}${col(semis[0],'🥉',110,48,'Semifinalista')}</div>${semis[1]?`<p class="center" style="margin-top:12px"><b>También semifinalista:</b> ${esc(pairs[semis[1]]?.name||'')}</p>`:''}`;
}
