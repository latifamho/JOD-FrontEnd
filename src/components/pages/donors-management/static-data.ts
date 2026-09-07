export type DonorEntryItem = {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  city?: string | null;
  campaignId?: string | null;
  postId?: string | null;
  targetType?: "campaign" | "post" | "manual" | null;
  targetId?: string | null;
  source?: string | null;
  campaignTitle?: string | null;
  status?: string | null;
  applicantStatus?: string | null;
  requestType?: string | null;
  appliedAt?: string | null;
  /** Donors only. Publicly anonymous — staff keep the contact details but must not publish the identity. */
  isAnonymous?: boolean;
};

export const applicantStatusOptions = [
  { label: "قيد الانتظار", value: "pending" },
  { label: "قيد المراجعة", value: "under_review" },
  { label: "مقبول", value: "accepted" },
  { label: "مرفوض", value: "rejected" },
] as const;

export const applicantStatusLabels: Record<string, string> = Object.fromEntries(
  applicantStatusOptions.map((option) => [option.value, option.label]),
);

// Retained exports for compatibility with older imports; active pages use API data.
export const donorsStaticData: DonorEntryItem[] = [];
export const applicantsStaticData: DonorEntryItem[] = [];
