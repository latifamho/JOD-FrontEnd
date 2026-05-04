export type OrganizationStatus = "active" | "inactive";
export type OrganizationVerificationStatus = "verified" | "unverified";
export type OrganizationType = "association" | "foundation" | "initiative";

export type AdminOrganizationItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  verificationStatus: OrganizationVerificationStatus;
  status: OrganizationStatus;
  campaignsCount: number;
  postsCount: number;
  activeVolunteersCount: number;
  activityScore: number;
  createdAt: string;
  lastActiveAt: string;
  organizationType: OrganizationType;
  registrationNumber: string;
  establishmentDate: string;
  shortAddress: string;
  description: string;
  licenseDocumentName: string;
  delegationDocumentName: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerPhone: string;
  website?: string;
  socialMedia?: string;
  acceptedAt?: string;
};

export const organizationStatusLabels: Record<OrganizationStatus, string> = {
  active: "نشطة",
  inactive: "غير نشطة",
};

export const organizationVerificationLabels: Record<
  OrganizationVerificationStatus,
  string
> = {
  verified: "موثقة",
  unverified: "غير موثقة",
};

export const organizationTypeLabels: Record<OrganizationType, string> = {
  association: "جمعية",
  foundation: "مؤسسة",
  initiative: "مبادرة",
};

export const organizationsStaticData: AdminOrganizationItem[] = [
  {
    id: "ORG-1001",
    name: "مؤسسة عطاء الأثر",
    email: "contact@ataa.sa",
    phone: "+966500010001",
    location: "جدة",
    verificationStatus: "verified",
    status: "active",
    campaignsCount: 6,
    postsCount: 14,
    activeVolunteersCount: 22,
    activityScore: 92,
    createdAt: "2026-01-10T09:00:00",
    lastActiveAt: "2026-02-28T12:20:00",
    organizationType: "foundation",
    registrationNumber: "REG-2026-1001",
    establishmentDate: "2021-09-14",
    shortAddress: "جدة - حي الروضة - شارع الأمير سلطان",
    description: "مؤسسة تعمل على برامج التعليم والصحة والتنمية المجتمعية.",
    licenseDocumentName: "license-ataa.pdf",
    delegationDocumentName: "delegation-ataa.pdf",
    ownerFullName: "خالد الحربي",
    ownerEmail: "owner@ataa.sa",
    ownerPhone: "+966500110001",
    website: "https://ataa.sa",
    socialMedia: "X: @ataa_org",
    acceptedAt: "2026-01-12T09:00:00",
  },
  {
    id: "ORG-1002",
    name: "جمعية الخير الطبية",
    email: "info@khair-med.sa",
    phone: "+966500010002",
    location: "الرياض",
    verificationStatus: "verified",
    status: "active",
    campaignsCount: 8,
    postsCount: 11,
    activeVolunteersCount: 30,
    activityScore: 96,
    createdAt: "2026-01-12T10:30:00",
    lastActiveAt: "2026-02-27T18:45:00",
    organizationType: "association",
    registrationNumber: "REG-2026-1002",
    establishmentDate: "2020-05-21",
    shortAddress: "الرياض - حي التعاون - طريق عثمان بن عفان",
    description: "جمعية متخصصة في المبادرات الطبية ودعم الحالات الإنسانية.",
    licenseDocumentName: "license-khair-med.pdf",
    delegationDocumentName: "delegation-khair-med.pdf",
    ownerFullName: "سارة السبيعي",
    ownerEmail: "owner@khair-med.sa",
    ownerPhone: "+966500110002",
    website: "https://khair-med.sa",
    socialMedia: "Instagram: @khair.med",
    acceptedAt: "2026-01-13T11:15:00",
  },
  {
    id: "ORG-1003",
    name: "منظمة دفء",
    email: "team@dafae.sa",
    phone: "+966500010003",
    location: "الطائف",
    verificationStatus: "unverified",
    status: "active",
    campaignsCount: 3,
    postsCount: 6,
    activeVolunteersCount: 12,
    activityScore: 68,
    createdAt: "2026-01-18T14:20:00",
    lastActiveAt: "2026-02-25T09:55:00",
    organizationType: "initiative",
    registrationNumber: "REG-2026-1003",
    establishmentDate: "2022-02-03",
    shortAddress: "الطائف - حي الحوية - شارع الملك فيصل",
    description: "مبادرة تطوعية لتوفير الدعم الإنساني للأسر المحتاجة في الشتاء.",
    licenseDocumentName: "license-dafae.pdf",
    delegationDocumentName: "delegation-dafae.pdf",
    ownerFullName: "عبدالله القحطاني",
    ownerEmail: "owner@dafae.sa",
    ownerPhone: "+966500110003",
    socialMedia: "X: @dafae_org",
  },
  {
    id: "ORG-1004",
    name: "جمعية تمكين",
    email: "hello@tamkeen.sa",
    phone: "+966500010004",
    location: "المدينة المنورة",
    verificationStatus: "verified",
    status: "inactive",
    campaignsCount: 2,
    postsCount: 4,
    activeVolunteersCount: 5,
    activityScore: 43,
    createdAt: "2026-01-22T08:40:00",
    lastActiveAt: "2026-02-20T15:12:00",
    organizationType: "association",
    registrationNumber: "REG-2026-1004",
    establishmentDate: "2019-11-18",
    shortAddress: "المدينة المنورة - حي العزيزية - طريق قباء",
    description: "جمعية لتمكين الأسر المنتجة وبرامج التدريب المهني.",
    licenseDocumentName: "license-tamkeen.pdf",
    delegationDocumentName: "delegation-tamkeen.pdf",
    ownerFullName: "فهد الجهني",
    ownerEmail: "owner@tamkeen.sa",
    ownerPhone: "+966500110004",
    website: "https://tamkeen.sa",
    acceptedAt: "2026-01-25T08:20:00",
  },
  {
    id: "ORG-1005",
    name: "مبادرة إنقاذ",
    email: "support@enqath.sa",
    phone: "+966500010005",
    location: "الدمام",
    verificationStatus: "unverified",
    status: "active",
    campaignsCount: 4,
    postsCount: 9,
    activeVolunteersCount: 15,
    activityScore: 74,
    createdAt: "2026-01-25T11:15:00",
    lastActiveAt: "2026-02-26T20:20:00",
    organizationType: "initiative",
    registrationNumber: "REG-2026-1005",
    establishmentDate: "2023-01-09",
    shortAddress: "الدمام - حي المزروعية - شارع الخليج",
    description: "مبادرة إنقاذ واستجابة طارئة للحالات ذات الأولوية.",
    licenseDocumentName: "license-enqath.pdf",
    delegationDocumentName: "delegation-enqath.pdf",
    ownerFullName: "نورة القحطاني",
    ownerEmail: "owner@enqath.sa",
    ownerPhone: "+966500110005",
    socialMedia: "X: @enqath_org",
  },
  {
    id: "ORG-1006",
    name: "جمعية خطوة",
    email: "info@khotwa.sa",
    phone: "+966500010006",
    location: "مكة",
    verificationStatus: "verified",
    status: "active",
    campaignsCount: 5,
    postsCount: 10,
    activeVolunteersCount: 18,
    activityScore: 84,
    createdAt: "2026-02-01T09:10:00",
    lastActiveAt: "2026-02-28T07:40:00",
    organizationType: "association",
    registrationNumber: "REG-2026-1006",
    establishmentDate: "2018-07-30",
    shortAddress: "مكة - حي الزاهر - طريق الملك عبدالعزيز",
    description: "جمعية تنموية تركّز على التعليم المجتمعي وتمكين الشباب.",
    licenseDocumentName: "license-khotwa.pdf",
    delegationDocumentName: "delegation-khotwa.pdf",
    ownerFullName: "ريم العتيبي",
    ownerEmail: "owner@khotwa.sa",
    ownerPhone: "+966500110006",
    website: "https://khotwa.sa",
    acceptedAt: "2026-02-02T12:00:00",
  },
  {
    id: "ORG-1007",
    name: "مركز سواعد",
    email: "admin@sawaed.sa",
    phone: "+966500010007",
    location: "أبها",
    verificationStatus: "unverified",
    status: "inactive",
    campaignsCount: 1,
    postsCount: 2,
    activeVolunteersCount: 3,
    activityScore: 21,
    createdAt: "2026-02-04T13:50:00",
    lastActiveAt: "2026-02-18T10:05:00",
    organizationType: "foundation",
    registrationNumber: "REG-2026-1007",
    establishmentDate: "2022-10-12",
    shortAddress: "أبها - حي المنسك - شارع الملك فهد",
    description: "مركز مجتمعي لدعم برامج التطوع والتأهيل.",
    licenseDocumentName: "license-sawaed.pdf",
    delegationDocumentName: "delegation-sawaed.pdf",
    ownerFullName: "سلمان العمري",
    ownerEmail: "owner@sawaed.sa",
    ownerPhone: "+966500110007",
    socialMedia: "Instagram: @sawaed_center",
  },
  {
    id: "ORG-1008",
    name: "مؤسسة نبض الحياة",
    email: "contact@nabd.sa",
    phone: "+966500010008",
    location: "الرياض",
    verificationStatus: "verified",
    status: "active",
    campaignsCount: 7,
    postsCount: 12,
    activeVolunteersCount: 25,
    activityScore: 90,
    createdAt: "2026-02-06T16:00:00",
    lastActiveAt: "2026-02-28T11:00:00",
    organizationType: "foundation",
    registrationNumber: "REG-2026-1008",
    establishmentDate: "2017-03-07",
    shortAddress: "الرياض - حي الياسمين - طريق أنس بن مالك",
    description: "مؤسسة متخصصة بالمبادرات الصحية والاجتماعية طويلة الأثر.",
    licenseDocumentName: "license-nabd.pdf",
    delegationDocumentName: "delegation-nabd.pdf",
    ownerFullName: "منى الشمري",
    ownerEmail: "owner@nabd.sa",
    ownerPhone: "+966500110008",
    website: "https://nabd.sa",
    acceptedAt: "2026-02-08T10:30:00",
  },
];
