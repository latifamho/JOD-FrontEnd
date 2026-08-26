import { redirect } from "next/navigation";

type AdminContentEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminContentEditPage({ params }: AdminContentEditPageProps) {
  const { id } = await params;
  redirect(`/dashboard/admin/content?modal=content-form&modalMode=edit&modalId=${encodeURIComponent(id)}`);
}
