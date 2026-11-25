const CACHE="revisions-v6";
const CORE=["./","index.html","manifest.json","icon-192.png","icon-512.png","icon-maskable.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  // pages : réseau d'abord (pour recevoir les nouvelles leçons), cache si hors ligne
  if(r.mode==="navigate"||u.pathname.endsWith(".html")){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));return}
  // le reste (icônes, polices) : cache d'abord
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const c=res.clone();caches.open(CACHE).then(ca=>ca.put(r,c))}return res})))});
