export const API_ERROR_MESSAGES = {
  network: "تعذّر الاتصال بالخادم. تحقق من الاتصال وحاول مجددًا.",
  timeout: "استغرق الطلب وقتًا أطول من المتوقع. حاول مجددًا.",
  badRequest: "تعذّر تنفيذ الطلب. يرجى التحقق من البيانات.",
  invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  sessionExpired: "انتهت الجلسة، يرجى تسجيل الدخول مجددًا.",
  forbidden: "لا تملك الصلاحية لتنفيذ هذه العملية.",
  notFound: "العنصر المطلوب غير موجود.",
  conflict: "توجد بيانات مستخدمة مسبقًا أو متعارضة مع هذا الطلب.",
  validation: "يرجى التحقق من البيانات المدخلة.",
  tooManyRequests: "تم إرسال عدد كبير من الطلبات. حاول لاحقًا.",
  serverError: "حدث خطأ في الخادم. حاول مجددًا لاحقًا.",
  serviceUnavailable: "الخدمة غير متاحة حاليًا. حاول لاحقًا.",
  cancelled: "تم إلغاء الطلب.",
  unknown: "حدث خطأ غير متوقع.",
} as const;

export type ApiErrorMessageKey = keyof typeof API_ERROR_MESSAGES;
