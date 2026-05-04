# توثيق مشروع منصة جود (JOD) — الهيكل والتفاصيل

هذا الملف يشرح تفاصيل المشروع، هيكل المجلدات، الصفحات، وتقسيم الكود لتسهيل الفهم والمتابعة.

---

## 1. نظرة عامة

| البند | الوصف |
|-------|--------|
| **الاسم** | منصة جود (JOD Platform) |
| **الوصف** | واجهة أمامية لمنصة لدعم المبادرات الإنسانية والمجتمعية |
| **اللغة** | عربي، RTL |
| **الخط** | Noto Kufi Arabic (من Google Fonts) |

---

## 2. التقنيات المستخدمة (Tech Stack)

| التقنية | الاستخدام |
|---------|-----------|
| **Next.js 16** | إطار العمل، App Router، SSR/SSG |
| **React 19** | واجهة المستخدم |
| **TypeScript** | لغة البرمجة |
| **Tailwind CSS 4** | التنسيق |
| **shadcn/ui** | مكونات واجهة (زر، جدول، دايالوج، فورم...) |
| **React Hook Form + Zod** | نماذج والتحقق من المدخلات |
| **Radix UI** | مكونات أساسية لـ shadcn |
| **Lucide React** | أيقونات |
| **date-fns** | التعامل مع التواريخ |
| **class-variance-authority (cva), clsx, tailwind-merge** | دمج وتنوع الـ class names |

---

## 3. هيكل المشروع (Project Structure)

```
jod-frontend/
├── public/                     # ملفات ثابتة (صور، أيقونات)
├── src/
│   ├── app/                    # توجيه الصفحات (Next.js App Router)
│   ├── assets/                 # أصول المشروع (مثل الشعار)
│   ├── components/             # كل المكونات
│   ├── constant/               # ثوابت التطبيق
│   ├── hooks/                  # React Hooks مخصصة
│   └── lib/                    # دوال وأدوات مساعدة
├── components.json              # إعدادات shadcn
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
└── PROJECT.md                  # هذا الملف
```

---

## 4. تفصيل المجلدات

### 4.1 `src/app/` — التوجيه والصفحات

هنا تُعرَّف **المسارات** فقط. كل `page.tsx` يستدعي مكون الصفحة الفعلي من `components/pages/`.

| المسار | الملف | الوظيفة |
|--------|-------|---------|
| الجذر | `layout.tsx` | التخطيط العام: عربي، RTL، خط، TooltipProvider |
| الجذر | `page.tsx` | الصفحة الرئيسية `/` |
| الجذر | `globals.css` | الأنماط العامة |
| الداشبورد | `dashboard/layout.tsx` | تخطيط الداشبورد: SideBar + Header + AppBreadcrumb + SectionTabs + المحتوى |
| الداشبورد | `dashboard/[[...segments]]/page.tsx` | صفحة افتراضية لأي مسار غير مُعرَّف تحت `/dashboard` |

**ملاحظة:** لا يوجد مجلد `org-staff` تحت `app/dashboard`؛ مسارات موظف المنظمة معرّفة في `routes.ts` لكن الصفحات الفعلية غير منشأة بعد.

---

### 4.2 `src/components/` — المكونات

#### `base/` — هيكل التطبيق

| المكون | الوصف |
|--------|--------|
| `app-breadcrumb.tsx` | مسار التنقل (Breadcrumb) |
| `header.tsx` | الهيدر العلوي |
| `logo.tsx` | شعار المنصة |
| `section-tabs.tsx` | تابز القسم الحالي (مثل: قيد المراجعة / مقبولة / مرفوضة) |
| `side-bar.tsx` | القائمة الجانبية (تنقل حسب الدور، بحث، طيّ) |
| `index.ts` | تصدير المكونات |

#### `ui/` — مكونات الواجهة (shadcn)

مكونات قابلة لإعادة الاستخدام: `button`, `input`, `dialog`, `sheet`, `table`, `form`, `select`, `tabs`, `badge`, `calendar`, `date-picker`, `pagination`, `breadcrumb`, `data-grid`, `password-input`, `phone-number-input`, `input-otp`, إلخ.

#### `shared/` — مكونات مشتركة بين الصفحات

| المكون | الوصف |
|--------|--------|
| `empty-state.tsx` | حالة عدم وجود بيانات |
| `pagination-controls.tsx` | تحكم بالصفحات (سابق / تالي / حجم الصفحة) |
| `review-status-badge.tsx` | شارة حالة المراجعة (قيد المراجعة / مقبول / مرفوض) |
| `index.ts` | تصدير المكونات |

#### `pages/` — منطق وصفحات كل قسم

كل مجلد = "صفحة منطقية" واحدة (أو مجموعة مرتبطة). الصفحة قد تحتوي على: جدول، فلاتر، كروت، دايالوجات، شيتات، نماذج.

| المجلد | الوصف | الملفات الرئيسية |
|--------|--------|------------------|
| `posts-review` | مراجعة المنشورات (أدمن) | `posts-review-page.tsx`, `review-post-card.tsx`, `review-toolbar.tsx`, `post-details-dialog.tsx`, `reject-post-dialog.tsx`, `static-data.ts`, `helpers.ts`, `index.ts` |
| `campaigns-review` | مراجعة الحملات (أدمن) | `campaigns-review-page.tsx`, `review-campaign-card.tsx`, `review-toolbar.tsx`, `campaign-details-dialog.tsx`, `reject-campaign-dialog.tsx`, `static-data.ts`, `helpers.ts`, `index.ts` |
| `organization-campaigns` | حملات المنظمة (مالك منظمة) | `organization-campaigns-page.tsx`, `organization-campaigns-table.tsx`, `organization-campaigns-filters.tsx`, `organization-campaign-details-page.tsx`, `campaign-form-sheet.tsx`, `close-campaign-dialog.tsx`, `delete-campaign-dialog.tsx`, `static-data.ts`, `helpers.ts`, `index.ts` |
| `organization-posts-management` | إدارة البوستات (مالك منظمة) | `posts-management-page.tsx`, `posts-table.tsx`, `posts-filters.tsx`, `post-form-sheet.tsx`, `post-details-sheet.tsx`, `delete-post-dialog.tsx`, `static-data.ts`, `helpers.ts`, `index.ts` |
| `organizations-management` | إدارة المنظمات (أدمن) | `organizations-management-page.tsx`, `organizations-table.tsx`, `organizations-filters.tsx`, `organization-form-sheet.tsx`, `organization-delete-dialog.tsx`, `static-data.ts`, `helpers.ts`, `index.ts` |
| `users-management` | إدارة المستخدمين (أدمن) | `users-management-page.tsx`, `users-table.tsx`, `user-form-sheet.tsx`, `user-delete-dialog.tsx`, `user-change-password-dialog.tsx`, `static-data.ts`, `helpers.ts`, `index.ts` |
| `notifications-management` | الإشعارات (أدمن) | `notifications-management-page.tsx`, `notifications-table.tsx`, `notifications-filters.tsx`, `create-notification-sheet.tsx`, `notification-details-sheet.tsx`, `static-data.ts`, `helpers.ts`, `index.ts` |
| `reports-management` | البلاغات (أدمن) | `reports-management-page.tsx`, `report-card.tsx`, `report-details-sheet.tsx`, `reports-toolbar.tsx`, `static-data.ts`, `helpers.ts`, `index.ts` |

**نمط مشترك في كل مجلد صفحة:**

- **`*-page.tsx`** أو **`*-management-page.tsx`**: المكون الرئيسي الذي يُستدعى من `app/.../page.tsx`.
- **`static-data.ts`**: بيانات تجريبية ثابتة (سيتم لاحقاً استبدالها بـ API).
- **`helpers.ts`**: دوال مساعدة خاصة بهذه الصفحة.
- **`index.ts`**: تصدير المكونات والأنواع والثوابت للاستخدام من خارج المجلد.

---

### 4.3 `src/constant/` — الثوابت

| الملف | الوصف |
|-------|--------|
| `routes.ts` | كل مسارات التطبيق، تسميات الأدوار، روابط السايدبار والتابز، دوال: `resolveRoute`, `isRouteActive`, `getRoleFromPath`, `getRoleLinks`, `getTabsForPath`, `getPageTitle`, `getSegmentLabel` |
| `icons.ts` | أسماء الأيقونات المستخدمة في التنقل وغيره |
| `events.ts` | أحداث مخصصة (مثل `SIDEBAR_TOGGLE_EVENT`) |
| `pagination.ts` | إعدادات الـ pagination (حجم الصفحة الافتراضي، الخيارات) |

---

### 4.4 `src/hooks/` — الهوكس

| الملف | الوصف |
|-------|--------|
| `use-pagination.ts` | إدارة رقم الصفحة الحالية، حجم الصفحة، وعدد الصفحات (لجداول وقوائم) |
| `use-app-navigation.ts` | مساعدات للتنقل داخل التطبيق |

---

### 4.5 `src/lib/` — الأدوات

| الملف | الوصف |
|-------|--------|
| `utils.ts` | دالة `cn()` لدمج class names (clsx + tailwind-merge) |
| `date.ts` | دوال للتعامل مع التواريخ (مثل `toUtcTimestamp`) |
| `text.ts` | دوال للنصوص |

---

## 5. المسارات الكاملة (Routes)

يتم تعريف كل المسارات في `src/constant/routes.ts`. الأدوار الثلاثة:

- **admin** — لوحة الأدمن
- **organization_owner** — لوحة مالك المنظمة
- **organization_staff** — لوحة موظف المنظمة

### 5.1 الصفحة الرئيسية

| المسار | الوصف |
|--------|--------|
| `/` | الصفحة الرئيسية (حالياً بدون محتوى) |

### 5.2 لوحة الأدمن `/dashboard/admin/...`

| المسار | الوصف |
|--------|--------|
| `/dashboard/admin` | نظرة عامة |
| `/dashboard/admin/posts/review` | مراجعة المنشورات — قيد المراجعة |
| `/dashboard/admin/posts/approved` | مراجعة المنشورات — مقبولة |
| `/dashboard/admin/posts/rejected` | مراجعة المنشورات — مرفوضة |
| `/dashboard/admin/campaigns/review` | مراجعة الحملات — قيد المراجعة |
| `/dashboard/admin/campaigns/approved` | مراجعة الحملات — مقبولة |
| `/dashboard/admin/campaigns/rejected` | مراجعة الحملات — مرفوضة |
| `/dashboard/admin/reports` | إدارة البلاغات |
| `/dashboard/admin/reports/new` | بلاغات جديدة |
| `/dashboard/admin/reports/in-progress` | بلاغات قيد المعالجة |
| `/dashboard/admin/reports/waiting-response` | بلاغات بانتظار الرد |
| `/dashboard/admin/reports/closed` | بلاغات مغلقة |
| `/dashboard/admin/users` | إدارة المستخدمين |
| `/dashboard/admin/organizations` | إدارة المنظمات |
| `/dashboard/admin/notifications` | الإشعارات |
| `/dashboard/admin/notifications/inbox` | الإشعارات — الوارد |
| `/dashboard/admin/notifications/sent` | الإشعارات — المرسل |

### 5.3 لوحة مالك المنظمة `/dashboard/org-owner/...`

| المسار | الوصف |
|--------|--------|
| `/dashboard/org-owner` | نظرة عامة |
| `/dashboard/org-owner/campaigns` | الحملات — الكل |
| `/dashboard/org-owner/campaigns/draft` | الحملات — مسودات |
| `/dashboard/org-owner/campaigns/active` | الحملات — نشطة |
| `/dashboard/org-owner/campaigns/closed` | الحملات — مغلقة |
| `/dashboard/org-owner/campaigns/[id]` | تفاصيل حملة (معرّف ديناميكي) |
| `/dashboard/org-owner/posts` | إدارة البوستات — الكل |
| `/dashboard/org-owner/posts/draft` | البوستات — مسودات |
| `/dashboard/org-owner/posts/pending` | البوستات — قيد المراجعة |
| `/dashboard/org-owner/posts/published` | البوستات — منشور |
| `/dashboard/org-owner/posts/rejected` | البوستات — مرفوض |
| `/dashboard/org-owner/posts/archived` | البوستات — مؤرشف |

### 5.4 لوحة موظف المنظمة `/dashboard/org-staff/...`

المسارات معرّفة في `routes.ts` (سايدبار وتابز)، لكن **لا توجد مجلدات أو صفحات تحت `app/dashboard/org-staff`**؛ الطلبات تذهب إلى الصفحة الافتراضية `[[...segments]]`.

---

## 6. تدفق الكود (كيف تعمل الصفحة)

1. **المستخدم يفتح مساراً** مثل `/dashboard/admin/posts/review`.
2. **Next.js يطابق** `src/app/dashboard/admin/posts/review/page.tsx`.
3. **الـ page.tsx** يستورد مكون الصفحة ويُمرر الـ props:
   ```tsx
   import { PostsReviewPage } from "@/components/pages/posts-review";
   export default function AdminPostsReviewPage() {
     return <PostsReviewPage status="pending" />;
   }
   ```
4. **مكون الصفحة** (مثل `PostsReviewPage`) يعرض الواجهة ويستخدم:
   - بيانات من `static-data.ts` (حالياً).
   - مكونات من `ui/` و `shared/`.
   - هوك `usePagination` وغيره.
5. **السايدبار والتابز** يحددان الدور من المسار الحالي (`getRoleFromPath(pathname)`) ويعرضان الروابط المناسبة من `routes.ts`.

---

## 7. البيانات والـ API

- **حالياً:** كل الصفحات تعتمد على **بيانات ثابتة** في ملفات `static-data.ts` داخل كل مجلد في `components/pages/`.
- **للمستقبل:** استبدال هذه البيانات بطلبات إلى الـ API (مثلاً عبر `fetch` أو مكتبات مثل React Query / SWR) وربط النماذج (إنشاء/تعديل/حذف) بنقاط النهاية المناسبة.

---

## 8. إضافة صفحة جديدة (نمط مقترح)

1. **إضافة المسار في** `src/constant/routes.ts` (في الـ scope المناسب: admin أو org-owner أو org-staff).
2. **إنشاء مجلد الصفحة** تحت `src/app/dashboard/...` مع `page.tsx` يستدعي المكون من `components/pages/`.
3. **إنشاء مجلد المكون** تحت `src/components/pages/اسم-الصفحة` مع:
   - مكون الصفحة الرئيسي.
   - إن لزم: `static-data.ts`, `helpers.ts`, `index.ts`.
4. **إضافة الرابط في** `routes.ts` ضمن `adminLinks` أو `organizationOwnerLinks` أو `organizationStaffLinks` حتى يظهر في السايدبار والتابز.

---

## 9. أوامر التشغيل

```bash
npm install    # تثبيت الاعتماديات
npm run dev    # تشغيل وضع التطوير
npm run build  # بناء للإنتاج
npm run start  # تشغيل نسخة الإنتاج
npm run lint   # فحص ESLint
```

---

## 10. ملخص سريع

| العنصر | الموقع |
|--------|--------|
| تعريف المسارات والتنقل | `src/constant/routes.ts` |
| تخطيط الداشبورد | `src/app/dashboard/layout.tsx` + `src/components/base/` |
| منطق وصفحات كل قسم | `src/components/pages/<اسم القسم>/` |
| مكونات واجهة عامة | `src/components/ui/` |
| مكونات مشتركة | `src/components/shared/` |
| بيانات تجريبية | `static-data.ts` داخل كل مجلد صفحة |
| هوكس مشتركة | `src/hooks/` |
| أدوات | `src/lib/` |

إذا احتجت توسيع توثيق جزء معيّن (مثلاً صفحة واحدة أو ثوابت الروابط)، يمكن إضافة قسم إضافي في هذا الملف أو إنشاء ملفات `docs/` منفصلة.

---

## 11. صفحات مقترحة حسب مواصفات المنصة (من ملف المواصفات)

ضمن الـ structure الحالي يمكن إضافة الصفحات التالية، مرتّبة حسب الأولوية والمنطق.

### 11.1 صفحات عامة (خارج الداشبورد) — للمستخدم الفردي والزوار

| المسار المقترح | الوصف | ملاحظة |
|----------------|--------|--------|
| `/login` أو `/auth/login` | تسجيل دخول / إنشاء حساب (رقم هاتف + تحقق SMS) | أساسي لكل الأدوار |
| `/` (تحسين الصفحة الرئيسية) | عرض المنشورات والحملات حسب الفئة (طلب / عرض / حملة) | الصفحة الحالية فارغة |
| `/posts/new` | نموذج إنشاء منشور جديد (طلب أو عرض) — يذهب للمراجعة | للمستخدم الفردي والمؤسسة |
| `/posts/[id]` | تفاصيل المنشور + الحالة + زر "بدء التواصل" + معلومات | واجهة عامة أو بعد الدخول |
| `/map` | خريطة الأنشطة القريبة (منشورات وحملات حسب الموقع) | يتطلب دعم خرائط (مثل Mapbox/Leaflet) |
| `/campaigns` | قائمة الحملات العامة (موثقة) مع شريط التقدم | عرض الحملات للمتبرعين |
| `/campaigns/[id]` | تفاصيل حملة + شريط تقدم + تفاصيل التحويل البنكي للمؤسسة | |
| `/profile` أو `/user/[id]` | الملف الشخصي: الشارات، المنشورات، الحالة | للمستخدم الفردي |
| `/org/[id]` | صفحة المؤسسة: بياناتها، حملاتها، توثيقها | للمؤسسات الموثقة |
| `/blog` | قسم المدونة / المقالات التوعوية | قائمة المقالات |
| `/blog/[slug]` | صفحة مقال واحد | محتوى توعوي، قصص نجاح، إرشادات |

**البنية المقترحة في الكود:**  
- إنشاء مجلدات تحت `src/app/` مثل: `(auth)/login/`, `posts/[id]/`, `map/`, `campaigns/`, `profile/`, `org/[id]/`, `blog/`.  
- مكونات الصفحات في `src/components/pages/` بأسماء واضحة (مثل `public-home`, `post-details`, `campaign-public`, `blog-list`, `blog-article`).

---

### 11.2 لوحة الأدمن — صفحات إضافية (المسارات موجودة في `routes.ts`)

| المسار (موجود في routes) | الوصف | الحالة الحالية |
|--------------------------|--------|-----------------|
| `/dashboard/admin` | نظرة عامة + **إحصائيات** (عدد المستخدمين، المنشورات، الحملات، البلاغات) | صفحة افتراضية بسيطة — يُقترح إضافة بطاقات إحصائيات |
| `/dashboard/admin/rewards` | إدارة الشارات والمكافآت الرمزية للمستخدمين | مسار معرّف — لا توجد صفحة بعد |
| `/dashboard/admin/content` | إدارة المحتوى: نشر/تعديل المقالات التوعوية (للمدونة) | مسار معرّف — لا توجد صفحة بعد |
| `/dashboard/admin/analytics` | إحصائيات وتحليلات عامة للمنصة | مسار معرّف — لا توجد صفحة بعد |
| `/dashboard/admin/settings` | الإعدادات العامة للمنصة | مسار معرّف — لا توجد صفحة بعد |
| `/dashboard/admin/organizations/verification` | مراجعة وثائق المؤسسات (قبول/رفض التوثيق) | يمكن دمجه مع إدارة المنظمات أو صفحة مستقلة |

**البنية:**  
- نفس النمط: `src/app/dashboard/admin/rewards/page.tsx` يستدعي مكوناً من `src/components/pages/rewards-management/` (أو `content-management`, `analytics-dashboard`, `platform-settings`).

---

### 11.3 لوحة مالك المنظمة — صفحات إضافية

| المسار (موجود في routes) | الوصف | الحالة الحالية |
|--------------------------|--------|-----------------|
| `/dashboard/org-owner/donors` | المتبرعون والمتقدمون للحملات | مسار في القائمة — لا توجد صفحة بعد |
| `/dashboard/org-owner/staff` | الموظفون والصلاحيات داخل المنظمة | مسار في القائمة — لا توجد صفحة بعد |
| `/dashboard/org-owner/profile` | الملف الشخصي للمنظمة (بيانات المؤسسة، الشارات) | مسار معرّف — لا توجد صفحة بعد |
| `/dashboard/org-owner/settings` | إعدادات الحساب (مثلاً: تفاصيل الحساب البنكي للتبرعات) | مسار معرّف — لا توجد صفحة بعد |

**ملاحظة من المواصفات:** عرض تفاصيل الحساب البنكي للمؤسسة (للتبرعات) يمكن أن يكون ضمن إعدادات المنظمة أو ضمن صفحة الحملة.

---

### 11.4 لوحة موظف المنظمة (org-staff)

كل المسارات معرّفة في `routes.ts` والسايدبار، لكن **لا توجد مجلدات أو صفحات** تحت `src/app/dashboard/org-staff/`. يُقترح إنشاء الصفحات التالية بنفس نمط org-owner (مع تقييد صلاحيات حسب الدور):

- `/dashboard/org-staff` — نظرة عامة  
- `/dashboard/org-staff/campaigns`، `campaigns/active`, `campaigns/closed`, `campaigns/[id]`  
- `/dashboard/org-staff/posts` (عرض/إدارة حسب الصلاحيات)  
- `/dashboard/org-staff/donors`  
- `/dashboard/org-staff/notifications`  
- `/dashboard/org-staff/profile`, `settings`  

مكونات الصفحات يمكن مشاركتها مع org-owner (نفس الجداول/الفورمات) مع اختلاف الصلاحيات من الـ API أو السياق.

---

### 11.5 أولوية التنفيذ المقترحة (ضمن الـ structure الحالي)

1. **أساسي:** تسجيل الدخول `/login` (أو `/auth/login`) + تحسين الصفحة الرئيسية `/` بعرض المنشورات والحملات.  
2. **أدمن:** صفحة الإحصائيات على `/dashboard/admin` + إدارة الشارات `rewards` + إدارة المحتوى `content`.  
3. **عامة:** صفحة تفاصيل المنشور `/posts/[id]` + صفحة إنشاء منشور `/posts/new`.  
4. **عامة:** قائمة وتفاصيل الحملات للجمهور `/campaigns`, `/campaigns/[id]`.  
5. **أدمن:** الإعدادات `settings` والتحليلات `analytics`.  
6. **مالك منظمة:** صفحات المتبرعين `donors` والموظفين `staff` والملف الشخصي والإعدادات.  
7. **موظف منظمة:** إنشاء كل صفحات `org-staff` كما في القسم 11.4.  
8. **لاحقاً:** خريطة الأنشطة `/map`، المدونة `/blog`, `/blog/[slug]`، والملف الشخصي العام `/profile`.
