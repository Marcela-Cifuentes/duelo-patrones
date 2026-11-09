// Adaptador de base de datos: Firebase Realtime Database real, o una simulada (pruebas / demo local).
export async function initDb(){
  const cfg=window.FIREBASE_CONFIG;
  if(window.FAKE_DB||!cfg||!cfg.databaseURL) return fakeDb();
  const base='https://www.gstatic.com/firebasejs/10.12.2/';
  const [{initializeApp},{getAuth,signInAnonymously},{getDatabase,ref,set,onValue,push,get,serverTimestamp}]=await Promise.all([
    import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-database.js')]);
  const app=initializeApp(cfg),auth=getAuth(app),cred=await signInAnonymously(auth),db=getDatabase(app);
  const setp=(p,v)=>set(ref(db,p),v);
  return {fake:false,uid:cred.user.uid,
    set:setp,remove:p=>setp(p,null),
    update:async(base2,obj)=>{ // actualizacion de varias rutas relativas
      await Promise.all(Object.entries(obj).map(([k,v])=>setp(base2+'/'+k,v))); },
    push:async(p,v)=>{const r=push(ref(db,p));await set(r,v);return r.key;},
    on:(p,cb)=>onValue(ref(db,p),s=>cb(s.val())),
    get:async p=>(await get(ref(db,p))).val(),
    ts:()=>serverTimestamp()};
}
function fakeDb(){
  const K='fakedb',rd=()=>JSON.parse(localStorage.getItem(K)||'{}'),wr=o=>localStorage.setItem(K,JSON.stringify(o));
  const keys=p=>p.split('/').filter(Boolean),getAt=(o,p)=>keys(p).reduce((a,k)=>a==null?undefined:a[k],o);
  const resolve=v=>v&&typeof v==='object'?(v['.sv']==='timestamp'?Date.now():Object.fromEntries(Object.entries(v).map(([k,x])=>[k,resolve(x)]))):v;
  function setAt(o,p,v){const ks=keys(p);let a=o;ks.slice(0,-1).forEach(k=>{if(typeof a[k]!=='object'||a[k]==null)a[k]={};a=a[k];});const l=ks[ks.length-1];if(v===null||v===undefined)delete a[l];else a[l]=resolve(v);}
  const subs=[];const fire=()=>{const o=rd();subs.forEach(s=>{const v=getAt(o,s.p);const j=JSON.stringify(v===undefined?null:v);if(j!==s.last){s.last=j;s.cb(v===undefined?null:JSON.parse(j));}});};
  addEventListener('storage',e=>{if(e.key===K)fire();});
  const uid=sessionStorage.getItem('fakeuid')||('u'+Math.random().toString(36).slice(2,10));sessionStorage.setItem('fakeuid',uid);
  const setp=async(p,v)=>{const o=rd();setAt(o,p,v);wr(o);fire();};
  return {fake:true,uid,set:setp,remove:p=>setp(p,null),
    update:async(b,obj)=>{const o=rd();Object.entries(obj).forEach(([k,v])=>setAt(o,b+'/'+k,v));wr(o);fire();},
    push:async(p,v)=>{const k='k'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);await setp(p+'/'+k,v);return k;},
    on:(p,cb)=>{const s={p,cb,last:undefined};subs.push(s);setTimeout(()=>{const v=getAt(rd(),p);s.last=JSON.stringify(v===undefined?null:v);cb(v===undefined?null:JSON.parse(s.last));},0);},
    get:async p=>{const v=getAt(rd(),p);return v===undefined?null:v;},
    ts:()=>({'.sv':'timestamp'})};
}
