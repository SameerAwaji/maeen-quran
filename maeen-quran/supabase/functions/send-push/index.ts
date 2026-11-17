// إرسال إشعارات الجوال (Web Push) عند الأحداث المهمة.
// تستدعيها قاعدة البيانات تلقائياً، ولا يستدعيها الموقع.
// لا تحتاج أي أسرار يدوية: كلمة السر تُنشأ في قاعدة البيانات (push_settings)،
// ومفاتيح VAPID تُنشأ هنا تلقائياً عند أول استدعاء وتُحفظ في push_settings.
// انشرها مع إطفاء Verify JWT.
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

type Row = { id: string; data: Record<string, any> };
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

async function members(ids: string[]): Promise<Row[]> {
  if (!ids.length) return [];
  const { data } = await sb.from("members").select("id,data").in("id", ids);
  return (data || []) as Row[];
}
async function parentsOf(sid: string): Promise<string[]> {
  const { data } = await sb.from("members").select("id,data").eq("role", "parent").contains("data", { childIds: [sid] });
  return ((data || []) as Row[]).filter(r => r.data.status === "active").map(r => r.id);
}
async function nameOf(id: string): Promise<string> {
  const [m] = await members([id]);
  return (m && m.data.name) || "";
}
const fmt = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("ar-SA-u-ca-gregory", { timeZone: "Asia/Riyadh", weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" });
  } catch { return iso; }
};

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, apikey, authorization, x-client-info", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };
async function settings() {
  const { data } = await sb.from("push_settings").select("*").eq("id", 1).maybeSingle();
  let st: any = data || {};
  if (!st.vapid_public || !st.vapid_private) {
    const k = webpush.generateVAPIDKeys();
    await sb.from("push_settings").upsert({ id: 1, vapid_public: k.publicKey, vapid_private: k.privateKey });
    const { data: d2 } = await sb.from("push_settings").select("*").eq("id", 1).maybeSingle();
    st = d2 || { ...st, vapid_public: k.publicKey, vapid_private: k.privateKey };
  }
  return st;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const st = await settings();
  // الموقع يطلب المفتاح العام فقط (ليس سراً)
  if (req.method === "GET") return new Response(JSON.stringify({ publicKey: st.vapid_public }), { headers: { ...CORS, "Content-Type": "application/json" } });
  const secret = st.secret || "";
  if (!secret || req.headers.get("x-push-secret") !== secret) return new Response("forbidden", { status: 403 });
  const { table, op, data: d = {}, old: o } = await req.json();
  const out: { to: string[]; title: string; body: string; url: string; tag: string }[] = [];
  const studentAndParents = async (sid: string) => [sid, ...(await parentsOf(sid))];

  if (table === "messages" && op === "INSERT" && d.toId) {
    out.push({ to: [d.toId], title: "رسالة من " + (await nameOf(d.fromId)), body: String(d.body || "").slice(0, 140), url: "/#inbox", tag: "msg-" + d.fromId });
  }
  if (table === "logs" && d.studentId && (op === "INSERT" || (o && o.attendance !== d.attendance))) {
    const name = await nameOf(d.studentId);
    if (d.attendance === "absent") {
      out.push({ to: await parentsOf(d.studentId), title: "غياب", body: `سُجّل غياب ${name} اليوم`, url: "/#child", tag: "log-" + d.studentId });
    } else if (d.attendance) {
      const marks = (d.marks || []).length;
      out.push({ to: await studentAndParents(d.studentId), title: "متابعة اليوم", body: `سجّل المعلم متابعة ${name}${marks ? ` · ${marks} ملاحظة على التسميع` : ""}`, url: "/#today", tag: "log-" + d.studentId });
    }
  }
  if (table === "recits" && d.studentId) {
    if (op === "UPDATE" && d.status === "reviewed" && o && o.status !== "reviewed") {
      out.push({ to: await studentAndParents(d.studentId), title: "قُيّم التسميع الصوتي", body: `«${d.title || ""}»${d.feedback ? " · " + String(d.feedback).slice(0, 100) : ""}`, url: "/#recite", tag: "rec-" + d.studentId });
    }
    if (op === "INSERT") {
      const [s] = await members([d.studentId]);
      const to = new Set<string>();
      if (s?.data.teacherId) to.add(s.data.teacherId);
      if (s?.data.circleId) {
        const { data: c } = await sb.from("circles").select("data").eq("id", s.data.circleId).maybeSingle();
        if (c?.data?.teacherId) to.add(c.data.teacherId);
      }
      out.push({ to: [...to], title: "تسميع صوتي جديد", body: `${s?.data.name || ""}${d.title ? " · " + d.title : ""}`, url: "/#home", tag: "recq-" + d.studentId });
    }
  }
  if (table === "sessions") {
    const confirmedNow = d.status === "confirmed" && (op === "INSERT" || (o && o.status !== "confirmed"));
    if (confirmedNow) {
      let ids: string[] = d.studentIds?.length ? d.studentIds : d.studentId ? [d.studentId] : [];
      if (d.circleId) {
        const { data: st } = await sb.from("members").select("id").eq("role", "student").eq("circle_id", d.circleId);
        ids = (st || []).map((r: any) => r.id);
      }
      const to = new Set<string>();
      for (const sid of ids) for (const x of await studentAndParents(sid)) to.add(x);
      out.push({ to: [...to], title: "موعد تسميع", body: d.start ? fmt(d.start) : "", url: "/#sessions", tag: "ses-" + (d.start || "") });
    }
    if (op === "INSERT" && d.status === "requested" && d.teacherId) {
      const sid = d.studentId || (d.studentIds || [])[0];
      out.push({ to: [d.teacherId], title: "طلب موعد تسميع", body: `${sid ? await nameOf(sid) : ""}${d.start ? " · " + fmt(d.start) : ""}`, url: "/#sessions", tag: "sreq" });
    }
  }
  if ((table === "exams" || table === "certs") && op === "INSERT" && d.studentId) {
    out.push({ to: await studentAndParents(d.studentId), title: table === "exams" ? "نتيجة اختبار" : "شهادة جديدة", body: table === "exams" ? `${d.scope || ""}${d.score != null ? " · الدرجة " + d.score : ""}` : String(d.title || ""), url: "/#record", tag: table });
  }
  if (table === "members" && op === "INSERT" && d.status === "pending") {
    const { data: admins } = await sb.from("members").select("id").in("role", ["director", "admin"]).eq("status", "active");
    out.push({ to: (admins || []).map((r: any) => r.id), title: "طلب تسجيل جديد", body: String(d.name || ""), url: "/#home", tag: "reg" });
  }

  if (!out.length) return new Response("no-op");
  webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT") || "mailto:noreply@maeen.com.sa", st.vapid_public, st.vapid_private);
  const { data: cfg } = await sb.from("config").select("data").eq("id", "main").maybeSingle();
  const brand = cfg?.data?.circleName || "";
  let sent = 0;
  for (const n of out) {
    const to = [...new Set(n.to.filter(Boolean))];
    if (!to.length) continue;
    const { data: subs } = await sb.from("push_subs").select("id,data").in("member_id", to);
    for (const s of (subs || []) as Row[]) {
      try {
        await webpush.sendNotification({ endpoint: s.data.endpoint, keys: s.data.keys }, JSON.stringify({ title: brand ? `${n.title} · ${brand}` : n.title, body: n.body, url: n.url, tag: n.tag }));
        sent++;
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.statusCode === 410) await sb.from("push_subs").delete().eq("id", s.id);
      }
    }
  }
  return new Response(JSON.stringify({ sent }), { headers: { "Content-Type": "application/json" } });
});
