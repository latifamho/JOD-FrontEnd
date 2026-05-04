import { ContentEditorPage } from "@/components/pages/content-management/content-editor-page";

type AdminContentEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminContentEditPage({
  params,
}: AdminContentEditPageProps) {
  const resolvedParams = await params;
  return <ContentEditorPage mode="edit" articleId={resolvedParams.id} />;
}
