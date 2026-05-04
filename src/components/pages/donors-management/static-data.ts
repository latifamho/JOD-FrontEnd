export type DonorEntryItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  campaignTitle: string;
  amountOrType: string;
  donatedAt: string;
  /** مدينة / منطقة */
  city?: string;
  /** مصدر التسجيل (موقع، تطبيق، حملة خارجية…) */
  source?: string;
  /** وسيلة الدفع — للمتبرعين */
  paymentMethod?: string;
  /** مرجع الحملة الداخلي */
  campaignRef?: string;
  /** موظف متابعة */
  assignedTo?: string;
  /** ملاحظات داخلية للفريق */
  internalNotes?: string;
  /** للمتقدمين: نوع الطلب */
  requestType?: string;
};

export const donorsStaticData: DonorEntryItem[] = [
  {
    id: "DNR-001",
    name: "خالد علي",
    email: "khalid@example.com",
    phone: "+966501234100",
    campaignTitle: "كسوة الشتاء",
    amountOrType: "500 ر.س",
    donatedAt: "2026-02-20T14:00:00",
    city: "الرياض",
    source: "الموقع — صفحة الحملة",
    paymentMethod: "مدى (Apple Pay)",
    campaignRef: "CMP-104",
    assignedTo: "نورة العاملي",
    internalNotes: "تبرع متكرر — إرسال شكر تلقائي بعد أسبوع.",
  },
  {
    id: "DNR-002",
    name: "ليان منصور",
    email: "layan@example.com",
    phone: "+966502345200",
    campaignTitle: "دعم الأسر المحتاجة",
    amountOrType: "تبرع عيني",
    donatedAt: "2026-02-22T10:30:00",
    city: "جدة",
    source: "رابط واتساب — حملة شهرية",
    paymentMethod: "استلام ميداني (مخزن الرياض)",
    campaignRef: "CMP-088",
    assignedTo: "فريق الخدمة الميدانية",
    internalNotes: "مواد غذائية معلبة — تم التحقق من الصلاحية.",
  },
  {
    id: "DNR-003",
    name: "ناصر فهد",
    email: "nasser@example.com",
    phone: "+966503456300",
    campaignTitle: "علاج أطفال — قسم القلب",
    amountOrType: "1,200 ر.س",
    donatedAt: "2026-02-24T09:15:00",
    city: "الدمام",
    source: "بوابة التبرعات",
    paymentMethod: "تحويل بنكي (آيبان)",
    campaignRef: "CMP-112",
    assignedTo: "المالية — مراجعة يومية",
    internalNotes: "إيصال ضريبي مطلوب — أرسل للبريد المسجل.",
  },
  {
    id: "DNR-004",
    name: "ريم الزهراني",
    email: "reem@example.com",
    phone: "+966504567400",
    campaignTitle: "كسوة الشتاء",
    amountOrType: "300 ر.س",
    donatedAt: "2026-02-25T18:00:00",
    city: "الطائف",
    source: "تطبيق جود",
    paymentMethod: "مدى",
    campaignRef: "CMP-104",
    assignedTo: "—",
    internalNotes: "أول تبرع — إضافة لقائمة النشرة البريدية بموافقة ضمنية.",
  },
];

/** متقدمون — نفس السجل للجدول؛ حقول إضافية للتفاصيل */
export const applicantsStaticData: DonorEntryItem[] = [
  {
    id: "APP-101",
    name: "فاطمة السعيد",
    email: "fatima@example.com",
    phone: "+966511223344",
    campaignTitle: "توزيع إفطار صائم — الرياض",
    amountOrType: "قيد المراجعة",
    donatedAt: "2026-03-01T11:00:00",
    city: "الرياض",
    source: "نموذج التطوع على الموقع",
    requestType: "تطوع ميداني — توزيع",
    campaignRef: "VOL-44",
    assignedTo: "منسّق المتطوعين",
    internalNotes: "يفضّل أوقات ما بعد الظهر — يوجد شهادة خبرة سابقة.",
  },
  {
    id: "APP-102",
    name: "يوسف الحربي",
    email: "yousef@example.com",
    phone: "+966522334455",
    campaignTitle: "فرصة تطوع — مستشفى الأطفال",
    amountOrType: "مقبول",
    donatedAt: "2026-03-05T09:30:00",
    city: "جدة",
    source: "إحالة من موظف المنظمة",
    requestType: "تطوع صحي — استقبال",
    campaignRef: "VOL-51",
    assignedTo: "التنسيق الطبي",
    internalNotes: "تم قبوله للوردية 12 مارس — إرسال بيانات الدخول.",
  },
  {
    id: "APP-103",
    name: "مها القحطاني",
    email: "maha@example.com",
    phone: "+966533445566",
    campaignTitle: "دعم الأسر المحتاجة",
    amountOrType: "بانتظار المستندات",
    donatedAt: "2026-03-10T16:45:00",
    city: "الخبر",
    source: "الموقع العام",
    requestType: "طلب مساعدة — سلة غذائية",
    campaignRef: "AID-09",
    assignedTo: "العناية بالمستفيدين",
    internalNotes: "بانتظار رفع صورة الهوية والإثبات المالي خلال 48 ساعة.",
  },
];
