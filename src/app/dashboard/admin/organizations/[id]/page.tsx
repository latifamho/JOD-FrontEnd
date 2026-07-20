import { OrganizationDetailsPage } from "@/components/pages/organizations-management";

type AdminOrganizationDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrganizationDetailsPage({
  params,
}: AdminOrganizationDetailsPageProps) {
  const resolvedParams = await params;
  const organizationId = decodeURIComponent(resolvedParams.id);
  return <OrganizationDetailsPage organizationId={organizationId} />;
}
