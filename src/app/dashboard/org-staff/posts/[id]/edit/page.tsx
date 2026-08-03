import { OrganizationPostEditPage } from "@/components/pages/organization-posts-management";

type OrganizationStaffPostEditRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function OrganizationStaffPostEditRoute({
  params,
}: OrganizationStaffPostEditRouteProps) {
  const resolvedParams = await params;

  return <OrganizationPostEditPage postId={resolvedParams.id} scope="staff" />;
}
