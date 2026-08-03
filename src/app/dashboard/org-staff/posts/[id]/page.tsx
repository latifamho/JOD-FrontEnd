import { OrganizationPostDetailsPage } from "@/components/pages/organization-posts-management";

type OrganizationStaffPostDetailsRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function OrganizationStaffPostDetailsRoute({
  params,
}: OrganizationStaffPostDetailsRouteProps) {
  const resolvedParams = await params;

  return <OrganizationPostDetailsPage postId={resolvedParams.id} scope="staff" />;
}
