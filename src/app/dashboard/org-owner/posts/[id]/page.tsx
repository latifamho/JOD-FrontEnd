import { OrganizationPostDetailsPage } from "@/components/pages/organization-posts-management";

type OrganizationOwnerPostDetailsRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function OrganizationOwnerPostDetailsRoute({
  params,
}: OrganizationOwnerPostDetailsRouteProps) {
  const resolvedParams = await params;

  return <OrganizationPostDetailsPage postId={resolvedParams.id} scope="owner" />;
}
