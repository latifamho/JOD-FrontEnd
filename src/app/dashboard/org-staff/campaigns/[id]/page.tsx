import { OrganizationCampaignDetailsPage } from "@/components/pages/organization-campaigns";

type CampaignDetailsRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default async function OrgStaffCampaignDetailsPage({
  params,
}: CampaignDetailsRoutePageProps) {
  const resolvedParams = await params;
  return <OrganizationCampaignDetailsPage campaignId={resolvedParams.id} />;
}
