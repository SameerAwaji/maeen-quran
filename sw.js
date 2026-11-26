/* عامل الخدمة: يعمل الموقع بدون إنترنت، ويستقبل الإشعارات والمنصة مقفلة */
const V = "maeen-v8";
const FC = "maeen-mushaf-1"; // خطوط وصفحات المصحف والتفاسير: تبقى محفوظة حتى مع تحديث المنصة
const SHELL = ["./", "index.html", "app.js", "config.js", "vendor/supabase.js", "manifest.webmanifest", "icon-192.png"];
const NET_FIRST = /\/(index\.html|app\.js|config\.js)?$/;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== FC).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  const same = u.origin === self.location.origin;
  const cdn = u.hostname === "cdn.jsdelivr.net" || u.hostname === "fonts.gstatic.com" || u.hostname === "fonts.googleapis.com";
  if (!same && !cdn) return; // بيانات Supabase والصوتيات لا تُخزَّن هنا
  if (same && u.pathname.startsWith("/.netlify/")) return; // الوسيط (المواقيت والأحاديث والأذكار) من الشبكة دائماً
  if (same && (r.mode === "navigate" || NET_FIRST.test(u.pathname))) {
    // الشبكة أولاً للصفحة والكود حتى تصل التحديثات فوراً، والنسخة المحفوظة عند انقطاع الاتصال
    e.respondWith(fetch(r, { cache: "no-cache" }).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r.mode === "navigate" ? "./" : r, cp)); }
      return res;
    }).catch(() => caches.match(r.mode === "navigate" ? "./" : r).then(x => x || caches.match("./"))));
    return;
  }
  // الملفات الثابتة (المصحف والخطوط والمكتبات): من المحفوظ أولاً
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
    if (res.ok || res.type === "opaque") { const cp = res.clone(); caches.open(cdn ? FC : V).then(c => c.put(r, cp)); }
    return res;
  })));
});

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: "إشعار جديد", body: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.title || "إشعار جديد", {
    body: d.body || "", tag: d.tag || undefined, icon: "/icon-192.png", badge: "/icon-192.png",
    lang: "ar", dir: "rtl", data: { url: d.url || "/" }
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) { c.navigate(url).catch(() => {}); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
