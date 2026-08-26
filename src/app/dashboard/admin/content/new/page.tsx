import { redirect } from "next/navigation";

export default function AdminContentCreatePage() {
  redirect("/dashboard/admin/content?modal=content-form&modalMode=create");
}
