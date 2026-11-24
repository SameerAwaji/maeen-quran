// وسيط آمن لجلب: مواقيت أم القرى (KACST)، أحاديث الدرر السنية، أذكار حصن المسلم
const NUM = /^-?\d{1,4}(\.\d{1,8})?$/;
export default async (req) => {
  const u = new URL(req.url);
  const t = u.searchParams.get("t");
  let target, ttl = 3600, ref = "";
  if (t === "umq") {
    const p = new URLSearchParams({ lang: "ar", format: "24" });
    for (const k of ["yg", "mg", "dg", "lat", "lon", "zone"]) {
      const v = u.searchParams.get(k);
      if (v === null || !NUM.test(v)) return json({ error: "bad " + k }, 400);
      p.set(k, v);
    }
    target = "https://umqserv.kacst.gov.sa/api/v1/Prayer/GetPrayers?" + p;
    ref = "https://www.ummulqura.org.sa/"; ttl = 21600;
  } else if (t === "dorar") {
    const q = (u.searchParams.get("q") || "").trim().slice(0, 80);
    if (!q) return json({ error: "q" }, 400);
    target = "https://dorar.net/dorar_api.json?skey=" + encodeURIComponent(q);
    ref = "https://dorar.net/"; ttl = 86400;
  } else if (t === "hisn") {
    const id = u.searchParams.get("id") || "index";
    if (id !== "index" && !/^\d{1,3}$/.test(id)) return json({ error: "id" }, 400);
    target = id === "index" ? "https://www.hisnmuslim.com/api/ar/husn_ar.json" : `https://www.hisnmuslim.com/api/ar/${id}.json`;
    ref = "https://www.hisnmuslim.com/"; ttl = 604800;
  } else return json({ error: "t" }, 400);
  try {
    const r = await fetch(target, { headers: { "user-agent": "Mozilla/5.0 (MaeenQuran)", referer: ref, accept: "application/json,*/*" } });
    const body = await r.text();
    return new Response(body, { status: r.ok ? 200 : 502, headers: { "content-type": "application/json; charset=utf-8", "cache-control": `public, max-age=${ttl}`, "netlify-cdn-cache-control": `public, max-age=${ttl}` } });
  } catch (e) {
    return json({ error: "upstream" }, 502);
  }
};
const json = (o, s) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json; charset=utf-8" } });
