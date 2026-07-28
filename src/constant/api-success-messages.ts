export const API_SUCCESS_MESSAGES = {
  loginSuccess: "تم تسجيل الدخول بنجاح.",
  created: "تمت الإضافة بنجاح.",
  updated: "تم التحديث بنجاح.",
  deleted: "تم الحذف بنجاح.",
  completed: "تمت العملية بنجاح.",
  approved: "تمت الموافقة بنجاح.",
  rejected: "تم الرفض بنجاح.",
  accepted: "تم القبول بنجاح.",
  claimed: "تم استلام البلاغ بنجاح.",
  infoRequested: "تم طلب المعلومات بنجاح.",
  closed: "تم الإغلاق بنجاح.",
  resent: "تمت إعادة الإرسال بنجاح.",
  sent: "تم الإرسال بنجاح.",
  statusUpdated: "تم تحديث الحالة بنجاح.",
  passwordUpdated: "تم تحديث كلمة المرور بنجاح.",
  settingsUpdated: "تم حفظ الإعدادات بنجاح.",
} as const;

export type ApiSuccessMessageKey = keyof typeof API_SUCCESS_MESSAGES;
