import { OrganizationCampaignDetailsPage } from "@/components/pages/organization-campaigns";

type CampaignDetailsRoutePageProps = {
  params: Promise<{ id: string }>;
};

export default async function CampaignDetailsRoutePage({
  params,
}: CampaignDetailsRoutePageProps) {
  const resolvedParams = await params;

  return <OrganizationCampaignDetailsPage campaignId={resolvedParams.id} scope="owner" />;
}
