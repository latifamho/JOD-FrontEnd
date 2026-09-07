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
  status?: "pending" | "accepted" | "contacting" | "agreed" | "completed" | "cancelled" | string | null;
  amount?: number | string | null;
  requestedAmount?: number | null;
  confirmedAmount?: number | null;
  contactMethod?: string | null;
  paymentMethod?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  acceptedAt?: string | null;
  contactedAt?: string | null;
  agreedAt?: string | null;
  completedAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  can?: { accept?: boolean; contact?: boolean; agree?: boolean; complete?: boolean; cancel?: boolean; reject?: boolean };
  applicantStatus?: string | null;
  requestType?: string | null;
  appliedAt?: string | null;
  /** Donors only. Publicly anonymous — staff keep the contact details but must not publish the identity. */
  isAnonymous?: boolean;
};

export const applicantStatusOptions = [
  { label: "قيد الانتظار", value: "pending" },
  { label: "قيد المراجعة", value: "under_review" },
  { label: "تم القبول", value: "accepted" },
  { label: "جاري التواصل", value: "contacting" },
  { label: "اكتملت المشاركة", value: "completed" },
  { label: "مرفوض", value: "rejected" },
  { label: "منسحب", value: "withdrawn" },
] as const;

export const applicantStatusLabels: Record<string, string> = Object.fromEntries(
  applicantStatusOptions.map((option) => [option.value, option.label]),
);

// Retained exports for compatibility with older imports; active pages use API data.
export const donorsStaticData: DonorEntryItem[] = [];
export const applicantsStaticData: DonorEntryItem[] = [];
