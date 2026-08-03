import { OrganizationCampaignEditPage } from "@/components/pages/organization-campaigns";

type OrganizationOwnerCampaignEditRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function OrganizationOwnerCampaignEditRoute({
  params,
}: OrganizationOwnerCampaignEditRouteProps) {
  const resolvedParams = await params;

  return <OrganizationCampaignEditPage campaignId={resolvedParams.id} scope="owner" />;
}
