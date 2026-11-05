// دالة إنشاء حسابات الدخول بواسطة المعلم (وإعادة تعيين كلمة المرور)
// تعمل على خادم Supabase بمفتاح الخدمة، ولا يصل المفتاح للمتصفح أبداً.
// الصلاحيات تُفحص بهوية المعلم نفسه: students.edit + الطالب داخل نطاقه.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = (Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY"))!;
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const domain = (Deno.env.get("ACCOUNT_EMAIL_DOMAIN") ?? "s.maeen.com.sa").toLowerCase();

  const caller = createClient(url, anon, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
    auth: { persistSession: false },
  });
  const { data: who } = await caller.auth.getUser();
  if (!who?.user) return json({ error: "يجب تسجيل الدخول" }, 401);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "طلب غير صالح" }, 400); }
  const action = String(body.action ?? "");
  const memberId = String(body.memberId ?? "");
  const password = String(body.password ?? "");

  const admin = createClient(url, service, { auth: { persistSession: false } });
  const { data: mem } = await admin.from("members").select("id,data").eq("id", memberId).maybeSingle();
  if (!mem) return json({ error: "العضو غير موجود" }, 404);
  const d = mem.data as Record<string, unknown>;
  const role = String(d.role ?? "");
  if (role === "director") return json({ error: "غير مسموح" }, 403);

  // الطالب: يكفي صلاحية تعديل الطلاب وأن يكون داخل نطاق المعلم. غيره: إدارة الأعضاء.
  const perm = role === "student" ? "students.edit" : "members.manage";
  const { data: ok } = await caller.rpc("has_perm", { k: perm });
  if (!ok) return json({ error: "ليست لديك صلاحية لهذا الإجراء" }, 403);
  if (role === "student") {
    const { data: inScope } = await caller.rpc("student_in_scope", { sid: memberId });
    if (!inScope) return json({ error: "هذا الطالب خارج نطاقك" }, 403);
  }
  if (password.length < 8) return json({ error: "كلمة المرور 8 أحرف على الأقل" }, 400);

  if (action === "create") {
    if (d.uid) return json({ error: "لهذا العضو حساب دخول مسبقاً" }, 409);
    const un = String(body.username ?? "").trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,30}$/.test(un)) return json({ error: "اسم المستخدم من 3 إلى 30 حرفاً إنجليزياً أو رقماً" }, 400);
    const email = `${un}@${domain}`;
    const { data: cu, error } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { name: d.name, username: un, createdBy: who.user.id },
    });
    if (error || !cu?.user) {
      const taken = /already|exists|registered/i.test(error?.message ?? "");
      return json({ error: taken ? "اسم المستخدم مستخدم، اختر غيره" : (error?.message ?? "تعذّر إنشاء الحساب") }, 400);
    }
    const nd = { ...d, uid: cu.user.id, username: un, email, status: "active", updatedAt: Date.now() };
    const { error: e2 } = await admin.from("members").update({ data: nd }).eq("id", memberId);
    if (e2) { await admin.auth.admin.deleteUser(cu.user.id); return json({ error: e2.message }, 500); }
    return json({ ok: true, username: un, email });
  }

  if (action === "reset") {
    const uid = String(d.uid ?? "");
    if (!uid) return json({ error: "لا يوجد حساب دخول لهذا العضو" }, 400);
    const em = String(d.email ?? "");
    if (!em.endsWith("@" + domain) && perm !== "members.manage")
      return json({ error: "هذا الحساب بإيميل شخصي، ويستعيد صاحبه كلمة المرور من «نسيت كلمة المرور»" }, 400);
    const { error } = await admin.auth.admin.updateUserById(uid, { password });
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  return json({ error: "إجراء غير معروف" }, 400);
});
