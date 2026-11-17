// إعدادات الاتصال بقاعدة البيانات (Supabase)
// انسخ القيمتين من: Supabase → Project Settings → API Keys
// المفتاح هنا هو المفتاح العام (publishable / anon) فقط — آمن للنشر لأن الحماية في قواعد قاعدة البيانات.
// لا تضع هنا أبداً مفتاح "service_role".
window.APP_CONFIG = {
  supabaseUrl: "https://lbxlxdtpctivynnipjns.supabase.co",
  supabaseAnonKey: "sb_publishable_VvPyLM7CBY1BahHA2RN-Ig_k5eJ2T-m",
  // نطاق أسماء المستخدمين للطلاب الذين ينشئ المعلم حساباتهم (بدون إيميل حقيقي).
  // يجب أن يطابق ACCOUNT_EMAIL_DOMAIN في دالة create-account.
  usernameDomain: "s.maeen.com.sa",
  // (اختياري) إشعارات الجوال والمنصة مقفلة: المفتاح العام VAPID (انظر README)
  vapidPublicKey: "BGguBmXsHJ2N07Id78uxvtzRE15ToYa8MQjB316NOLEKIvCnRL6IR4dWddVAkZCUAyMWpJNm6Ed9Jsh8c8Hojlo",
  // (لنسخ الجهات فقط) ربط النسخة بلوحة المالك: يُنسخ من «لوحة المالك ← إعدادات الربط»
  // license: { server: "", anonKey: "", key: "" },
};
