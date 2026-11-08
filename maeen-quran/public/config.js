// إعدادات الاتصال بقاعدة البيانات (Supabase)
// انسخ القيمتين من: Supabase → Project Settings → API Keys
// المفتاح هنا هو المفتاح العام (publishable / anon) فقط — آمن للنشر لأن الحماية في قواعد قاعدة البيانات.
// لا تضع هنا أبداً مفتاح "service_role".
window.APP_CONFIG = {
  supabaseUrl: "https://lbxlxdtpctivynnipjns.supabase.co",
  supabaseAnonKey: "sb_publishable_VvPyLM7CBY1BahHA2RN-Ig_k5eJ2T-m",
  // نطاق أسماء المستخدمين للطلاب الذين ينشئ المعلم حساباتهم (بدون إيميل حقيقي).
  // يجب أن يطابق ACCOUNT_EMAIL_DOMAIN في دالة create-account.
  usernameDomain: "s.maeen.com.sa"
};
