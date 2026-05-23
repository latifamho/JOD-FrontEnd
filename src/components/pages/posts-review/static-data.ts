import type { ModerationStatus } from "@/components/shared";

export type ReviewPostType =
  | "help_request"
  | "job_opportunity"
  | "awareness"
  | "campaign_update";

export type ReviewPostItem = {
  id: string;
  title: string;
  summary: string;
  organizationName: string;
  authorName: string;
  location: string;
  submittedAt: string;
  publishedAt: string;
  status: ModerationStatus;
  type: ReviewPostType;
  reviewedBy?: string;
  rejectionReason?: string;
};

export const postTypeLabels: Record<ReviewPostType, string> = {
  help_request: "طلب مساعدة",
  job_opportunity: "فرصة عمل",
  awareness: "منشور توعوي",
  campaign_update: "تحديث حملة",
};

export const reviewStatusLabels: Record<ModerationStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مقبولة",
  rejected: "مرفوضة",
};

export const reviewPostsStaticData: ReviewPostItem[] = [
  {
    id: "POST-1001",
    title: "طلب دعم علاجي لحالة طارئة",
    summary:
      "نبحث عن متبرعين لتغطية تكاليف جلسات العلاج خلال الشهر القادم بإشراف طبي مباشر.",
    organizationName: "جمعية الخير الطبية",
    authorName: "د. آية منصور",
    location: "الرياض",
    submittedAt: "2026-02-24T08:30:00",
    publishedAt: "2026-02-20T09:00:00",
    status: "pending",
    type: "help_request",
  },
  {
    id: "POST-1002",
    title: "فرصة عمل: منسق حملات ميدانية",
    summary:
      "نبحث عن منسق حملات بخبرة لا تقل عن سنتين في إدارة المتطوعين وتنظيم الفعاليات المجتمعية.",
    organizationName: "مؤسسة عطاء الأثر",
    authorName: "خالد علي",
    location: "جدة",
    submittedAt: "2026-02-24T11:00:00",
    publishedAt: "2026-02-22T10:45:00",
    status: "pending",
    type: "job_opportunity",
  },
  {
    id: "POST-1003",
    title: "توعية حول السلامة الغذائية للأسر المحتاجة",
    summary:
      "محتوى توعوي قصير يوضح أفضل طرق حفظ الأغذية وتفادي الهدر للأسر المستفيدة من السلال الغذائية.",
    organizationName: "جمعية أمن غذائي",
    authorName: "ليان مصطفى",
    location: "الدمام",
    submittedAt: "2026-02-23T14:20:00",
    publishedAt: "2026-02-21T12:00:00",
    status: "pending",
    type: "awareness",
  },
  {
    id: "POST-1004",
    title: "تحديث تقدم حملة كسوة الشتاء",
    summary:
      "وصلنا إلى 74% من الهدف ونحتاج دعم إضافي لتغطية القرى الأبعد قبل نهاية الموسم.",
    organizationName: "منظمة دفء",
    authorName: "محمد الراشد",
    location: "الطائف",
    submittedAt: "2026-02-22T16:30:00",
    publishedAt: "2026-02-22T08:15:00",
    status: "pending",
    type: "campaign_update",
  },
  {
    id: "POST-1005",
    title: "فرصة عمل: أخصائي تواصل مجتمعي",
    summary:
      "وظيفة بدوام كامل لدعم تواصل المنظمة مع المستفيدين والشركاء وإعداد تقارير شهرية.",
    organizationName: "جمعية تمكين",
    authorName: "ريم الزهراني",
    location: "المدينة المنورة",
    submittedAt: "2026-02-22T09:40:00",
    publishedAt: "2026-02-19T15:00:00",
    status: "pending",
    type: "job_opportunity",
  },
  {
    id: "POST-1006",
    title: "إرشادات التبرع العيني بطريقة آمنة",
    summary:
      "نوضح في هذا المنشور ما المواد المقبولة وما المعايير الواجب توفرها قبل تسليم التبرعات.",
    organizationName: "جمعية أيادي",
    authorName: "سامر الحربي",
    location: "مكة",
    submittedAt: "2026-02-21T18:00:00",
    publishedAt: "2026-02-18T10:15:00",
    status: "pending",
    type: "awareness",
  },
  {
    id: "POST-1007",
    title: "طلب دعم لترميم منزل أسرة متضررة",
    summary:
      "حالة إنسانية عاجلة تتطلب ترميمًا أساسيًا لمسكن الأسرة قبل موسم الأمطار القادم.",
    organizationName: "مؤسسة سكن آمن",
    authorName: "أحمد الخالدي",
    location: "أبها",
    submittedAt: "2026-02-20T13:10:00",
    publishedAt: "2026-02-19T08:00:00",
    status: "approved",
    type: "help_request",
    reviewedBy: "فريق مراجعة المحتوى",
  },
  {
    id: "POST-1008",
    title: "تحديث حملة الأجهزة الطبية المنزلية",
    summary:
      "تم توفير 18 جهازًا حتى الآن ونعمل على استكمال الأجهزة المتبقية للحالات المنتظرة.",
    organizationName: "جمعية نبض",
    authorName: "سارة القحطاني",
    location: "حائل",
    submittedAt: "2026-02-20T09:25:00",
    publishedAt: "2026-02-20T07:55:00",
    status: "approved",
    type: "campaign_update",
    reviewedBy: "فريق مراجعة المحتوى",
  },
  {
    id: "POST-1009",
    title: "فرصة عمل: مسؤول عمليات ميدانية",
    summary:
      "مطلوب مسؤول عمليات ميدانية لمتابعة توزيع المساعدات وتوثيق التسليم بالتنسيق مع الفرق.",
    organizationName: "جمعية خطوة",
    authorName: "نورة الشمري",
    location: "تبوك",
    submittedAt: "2026-02-19T11:45:00",
    publishedAt: "2026-02-18T16:20:00",
    status: "approved",
    type: "job_opportunity",
    reviewedBy: "فريق مراجعة المحتوى",
  },
  {
    id: "POST-1010",
    title: "توعية حول التخطيط المالي للأسر",
    summary:
      "سلسلة نصائح عملية مبسطة لمساعدة الأسر المستفيدة على إدارة المصروفات الشهرية بفعالية.",
    organizationName: "مؤسسة نمو",
    authorName: "فاطمة سليمان",
    location: "الرياض",
    submittedAt: "2026-02-18T15:35:00",
    publishedAt: "2026-02-17T12:05:00",
    status: "approved",
    type: "awareness",
    reviewedBy: "فريق مراجعة المحتوى",
  },
  {
    id: "POST-1011",
    title: "طلب دعم أجهزة سمعية للأطفال",
    summary:
      "نحتاج تمويلًا لتأمين أجهزة سمعية لعدد من الأطفال بعد الانتهاء من التقييم الطبي.",
    organizationName: "جمعية أمل السمع",
    authorName: "ميس العتيبي",
    location: "القصيم",
    submittedAt: "2026-02-17T10:20:00",
    publishedAt: "2026-02-17T09:10:00",
    status: "approved",
    type: "help_request",
    reviewedBy: "فريق مراجعة المحتوى",
  },
  {
    id: "POST-1012",
    title: "إعلان فرص تطوع لدعم حملة رمضان",
    summary:
      "فتح التسجيل للمتطوعين في تنظيم السلال الرمضانية وخدمة المستفيدين في نقاط التوزيع.",
    organizationName: "مبادرة خير رمضان",
    authorName: "عبدالله العبدان",
    location: "الخبر",
    submittedAt: "2026-02-17T09:50:00",
    publishedAt: "2026-02-16T18:00:00",
    status: "approved",
    type: "job_opportunity",
    reviewedBy: "فريق مراجعة المحتوى",
  },
  {
    id: "POST-1013",
    title: "طلب مساعدة عاجل لشراء أدوية",
    summary:
      "المنشور يطلب دعمًا ماليًا دون إرفاق مستندات الحالة الطبية المطلوبة ضمن سياسة المنصة.",
    organizationName: "جمعية رحمة",
    authorName: "سهى إبراهيم",
    location: "المدينة المنورة",
    submittedAt: "2026-02-21T09:00:00",
    publishedAt: "2026-02-20T14:10:00",
    status: "rejected",
    type: "help_request",
    reviewedBy: "فريق مراجعة المحتوى",
    rejectionReason: "يرجى إرفاق التقارير الطبية والموافقة الرسمية قبل إعادة الإرسال.",
  },
  {
    id: "POST-1014",
    title: "تحديث الحملة بصياغة تسويقية مبالغ بها",
    summary:
      "النص يحتوي عبارات غير دقيقة عن النتائج الفعلية للحملة ولا يتوافق مع سياسة الشفافية.",
    organizationName: "منظمة البناء",
    authorName: "يزن العطار",
    location: "جدة",
    submittedAt: "2026-02-20T17:40:00",
    publishedAt: "2026-02-20T09:30:00",
    status: "rejected",
    type: "campaign_update",
    reviewedBy: "فريق مراجعة المحتوى",
    rejectionReason: "الرجاء تعديل صياغة النتائج لتكون دقيقة ومدعومة بأرقام موثقة.",
  },
  {
    id: "POST-1015",
    title: "إعلان وظيفة بمعلومات ناقصة",
    summary:
      "تم نشر وظيفة دون توضيح نطاق الراتب أو متطلبات الخبرة الأساسية المطلوبة للمتقدمين.",
    organizationName: "جمعية تمكين الشباب",
    authorName: "منى الشريف",
    location: "الرياض",
    submittedAt: "2026-02-19T13:15:00",
    publishedAt: "2026-02-18T11:45:00",
    status: "rejected",
    type: "job_opportunity",
    reviewedBy: "فريق مراجعة المحتوى",
    rejectionReason: "يرجى إضافة تفاصيل الراتب وشروط الخبرة لتفعيل الإعلان.",
  },
  {
    id: "POST-1016",
    title: "منشور توعوي بدون مصدر معلومة",
    summary:
      "يتضمن إرشادات صحية مهمة لكن بدون ذكر المراجع أو الجهات الطبية المعتمدة للمحتوى.",
    organizationName: "مؤسسة وعي",
    authorName: "هند الناصر",
    location: "الدمام",
    submittedAt: "2026-02-18T08:55:00",
    publishedAt: "2026-02-17T07:25:00",
    status: "rejected",
    type: "awareness",
    reviewedBy: "فريق مراجعة المحتوى",
    rejectionReason: "أضف مصدرًا رسميًا للمحتوى التوعوي قبل إعادة إرسال المنشور.",
  },
];

