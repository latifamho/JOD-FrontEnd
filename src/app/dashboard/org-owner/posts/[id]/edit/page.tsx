import { OrganizationPostEditPage } from "@/components/pages/organization-posts-management";

type OrganizationOwnerPostEditRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function OrganizationOwnerPostEditRoute({
  params,
}: OrganizationOwnerPostEditRouteProps) {
  const resolvedParams = await params;

  return <OrganizationPostEditPage postId={resolvedParams.id} scope="owner" />;
}
