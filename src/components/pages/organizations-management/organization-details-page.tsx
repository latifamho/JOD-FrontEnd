"use client";

import * as React from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared";
import { routePaths } from "@/constant/routes";
import {
  formatUtcDate,
  formatUtcDateOrDash,
  formatUtcDateTime,
  formatUtcDateTimeOrDash,
} from "@/lib/date";
import { displayOrDash } from "@/lib/text";
import {
  getOrganizationStatusBadgeClass,
  getOrganizationVerificationBadgeClass,
} from "@/components/pages/organizations-management/helpers";
import {
  organizationsStaticData,
  organizationStatusLabels,
  organizationTypeLabels,
  organizationVerificationLabels,
  type OrganizationStatus,
  type OrganizationVerificationStatus,
} from "@/components/pages/organizations-management/static-data";
import { AppIcons } from "@/constant/icons";

type OrganizationDetailsPageProps = {
  organizationId: string;
};

export function OrganizationDetailsPage({
  organizationId,
}: OrganizationDetailsPageProps) {
  const organization = organizationsStaticData.find(
    (candidate) => candidate.id === organizationId,
  );

  const [status, setStatus] = React.useState<OrganizationStatus>(
    organization?.status ?? "inactive",
  );
  const [verificationStatus, setVerificationStatus] =
    React.useState<OrganizationVerificationStatus>(
      organization?.verificationStatus ?? "unverified",
    );
  const [acceptedAt, setAcceptedAt] = React.useState<string | null>(
    organization?.acceptedAt ?? null,
  );

  React.useEffect(() => {
    if (!organization) {
      return;
    }

    setStatus(organization.status);
    setVerificationStatus(organization.verificationStatus);
    setAcceptedAt(organization.acceptedAt ?? null);
  }, [organization]);

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

  const handleAcceptOrganization = () => {
    setStatus("active");
    setVerificationStatus("verified");
    setAcceptedAt(new Date().toISOString());
  };

  const isAccepted = verificationStatus === "verified";

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className="rounded-md border border-border bg-background p-4 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={getOrganizationVerificationBadgeClass(verificationStatus)}
              >
                {organizationVerificationLabels[verificationStatus]}
              </Badge>
              <Badge
                variant="outline"
                className={getOrganizationStatusBadgeClass(status)}
              >
                {organizationStatusLabels[status]}
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
              onClick={handleAcceptOrganization}
              disabled={isAccepted}
            >
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
                {organizationTypeLabels[organization.organizationType]}
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
                {formatUtcDateTimeOrDash(acceptedAt)}
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
              <span className="font-semibold text-foreground">
                {displayOrDash(organization.socialMedia)}
              </span>
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
