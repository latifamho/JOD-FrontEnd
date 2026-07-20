"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared";
import { routePaths } from "@/constant/routes";
import {
  formatUtcDateOrDash,
  formatUtcDateTime,
  formatUtcDateTimeOrDash,
} from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  getDisplayOrganizationStatus,
  getDisplayVerificationStatus,
  getOrganizationStatusBadgeClass,
  getOrganizationVerificationBadgeClass,
} from "@/components/pages/organizations-management/helpers";
import {
  organizationStatusLabels,
  organizationTypeLabels,
  organizationVerificationLabels,
} from "@/components/pages/organizations-management/organizations-management.types";
import { AppIcons } from "@/constant/icons";
import {
  useAdminOrganizationDetail,
  useAcceptOrganization,
} from "@/features/admin/organizations/admin.organizations.query";

type OrganizationDetailsPageProps = {
  organizationId: string;
};

const SOCIAL_MEDIA_LABELS = {
  facebook: "فيسبوك",
  twitter: "إكس (تويتر)",
  instagram: "إنستغرام",
} as const;

export function OrganizationDetailsPage({
  organizationId,
}: OrganizationDetailsPageProps) {
  const { data, isLoading, isError, refetch, isFetching } =
    useAdminOrganizationDetail(organizationId);
  const acceptMutation = useAcceptOrganization();

  const organization = data?.data;

  if (isLoading) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <div className="h-24 rounded-md border border-border bg-muted animate-pulse" />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-48 rounded-md border border-border bg-muted animate-pulse" />
          <div className="h-48 rounded-md border border-border bg-muted animate-pulse" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="organizations"
          title="تعذّر تحميل المنظمة"
          description="حدث خطأ أثناء جلب بيانات المنظمة. حاول مرة أخرى."
        />
        <div className="flex justify-start gap-2">
          <Button type="button" variant="outline" onClick={() => refetch()}>
            إعادة المحاولة
          </Button>
          <Button asChild variant="outline">
            <Link href={routePaths.adminScope.organizations}>
              الرجوع إلى إدارة المنظمات
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  if (!organization) {
    return (
      <section className="flex flex-1 flex-col gap-4">
        <EmptyState
          icon="organizations"
          title="المنظمة غير موجودة"
          description="تعذر العثور على بيانات المنظمة المطلوبة."
        />
        <div className="flex justify-start">
          <Button asChild variant="outline">
            <Link href={routePaths.adminScope.organizations}>
              الرجوع إلى إدارة المنظمات
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  const displayVerification = getDisplayVerificationStatus(organization);
  const displayStatus = getDisplayOrganizationStatus(organization);
  const isAccepted = displayVerification === "verified";
  const socialMediaEntries = organization.socialMedia
    ? (
        Object.entries(organization.socialMedia) as [
          keyof typeof SOCIAL_MEDIA_LABELS,
          string | undefined,
        ][]
      ).filter(([, value]) => !!value)
    : [];

  return (
    <section className="relative flex flex-1 flex-col gap-4">
      {isFetching && (
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-b-md bg-muted px-3 py-1 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            جاري التحديث...
          </span>
        </div>
      )}

      <div className="rounded-md border border-border bg-background p-4 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={getOrganizationVerificationBadgeClass(displayVerification)}
              >
                {organizationVerificationLabels[displayVerification]}
              </Badge>
              <Badge
                variant="outline"
                className={getOrganizationStatusBadgeClass(displayStatus)}
              >
                {organizationStatusLabels[displayStatus]}
              </Badge>
              <Badge variant="outline">{organization.id}</Badge>
            </div>

            <h2 className="text-xl font-semibold text-foreground">
              {displayOrDash(organization.name)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {displayOrDash(organization.description)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link href={routePaths.adminScope.organizations}>
                الرجوع إلى إدارة المنظمات
              </Link>
            </Button>
            <Button
              type="button"
              onClick={() => acceptMutation.mutate(organization.id)}
              disabled={isAccepted || acceptMutation.isPending}
            >
              {acceptMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              <AppIcons.verification className="size-4" />
              {isAccepted ? "تم قبول المنظمة" : "قبول المنظمة"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-background p-4 shadow-xs">
          <h3 className="text-sm font-semibold text-foreground">بيانات التسجيل</h3>
          <div className="mt-3 grid gap-3 text-sm">
            <p className="text-muted-foreground">
              نوع المنظمة:{" "}
              <span className="font-semibold text-foreground">
                {organizationTypeLabels[organization.organizationType] ??
                  displayOrDash(organization.organizationType)}
              </span>
            </p>
            <p className="text-muted-foreground">
              رقم السجل/الترخيص:{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(organization.registrationNumber)}
              </span>
            </p>
            <p className="text-muted-foreground">
              تاريخ التأسيس:{" "}
              <span className="font-semibold text-foreground">
                {formatUtcDateOrDash(organization.establishmentDate)}
              </span>
            </p>
            <p className="text-muted-foreground">
              العنوان المختصر:{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(organization.shortAddress)}
              </span>
            </p>
            <p className="text-muted-foreground">
              المدينة:{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(organization.location)}
              </span>
            </p>
            <p className="text-muted-foreground">
              تاريخ الإنشاء:{" "}
              <span className="font-semibold text-foreground">
                {formatUtcDateTime(organization.createdAt)}
              </span>
            </p>
            <p className="text-muted-foreground">
              آخر نشاط:{" "}
              <span className="font-semibold text-foreground">
                {formatUtcDateTime(organization.lastActiveAt)}
              </span>
            </p>
            <p className="text-muted-foreground">
              تاريخ القبول:{" "}
              <span className="font-semibold text-foreground">
                {formatUtcDateTimeOrDash(organization.acceptedAt ?? null)}
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-md border border-border bg-background p-4 shadow-xs">
          <h3 className="text-sm font-semibold text-foreground">بيانات مسؤول المنظمة</h3>
          <div className="mt-3 grid gap-3 text-sm">
            <p className="text-muted-foreground">
              الاسم:{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(organization.ownerFullName)}
              </span>
            </p>
            <p className="text-muted-foreground">
              البريد:{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(organization.ownerEmail)}
              </span>
            </p>
            <p className="text-muted-foreground">
              الجوال:{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(organization.ownerPhone)}
              </span>
            </p>
          </div>

          <h3 className="mt-5 text-sm font-semibold text-foreground">قنوات التواصل</h3>
          <div className="mt-3 grid gap-3 text-sm">
            <p className="text-muted-foreground">
              البريد الرسمي:{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(organization.email)}
              </span>
            </p>
            <p className="text-muted-foreground">
              الهاتف الرسمي:{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(organization.phone)}
              </span>
            </p>
            <p className="text-muted-foreground">
              الموقع الإلكتروني:{" "}
              <span className="font-semibold text-foreground">
                {displayOrDash(organization.website)}
              </span>
            </p>
            <p className="text-muted-foreground">
              حسابات التواصل:{" "}
              {socialMediaEntries.length > 0 ? (
                <span className="font-semibold text-foreground">
                  {socialMediaEntries
                    .map(([key, value]) => `${SOCIAL_MEDIA_LABELS[key]}: ${value}`)
                    .join(" · ")}
                </span>
              ) : (
                <span className="font-semibold text-foreground">
                  {displayOrDash(null)}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-background p-4 shadow-xs">
        <h3 className="text-sm font-semibold text-foreground">مرفقات التسجيل</h3>
        <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-muted-foreground">
            وثيقة الترخيص:{" "}
            <span className="font-semibold text-foreground">
              {displayOrDash(organization.licenseDocumentName)}
            </span>
          </p>
          <p className="rounded-md border border-border bg-muted/30 px-3 py-2 text-muted-foreground">
            وثيقة التفويض:{" "}
            <span className="font-semibold text-foreground">
              {displayOrDash(organization.delegationDocumentName)}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
