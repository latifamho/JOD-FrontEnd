import { OrganizationCampaignEditPage } from "@/components/pages/organization-campaigns";

type OrganizationStaffCampaignEditRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function OrganizationStaffCampaignEditRoute({
  params,
}: OrganizationStaffCampaignEditRouteProps) {
  const resolvedParams = await params;

  return <OrganizationCampaignEditPage campaignId={resolvedParams.id} scope="staff" />;
}
