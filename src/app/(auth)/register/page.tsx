import type { Metadata } from "next";

import { RegisterForm } from "@/app/(auth)/register/register-form";

export const metadata: Metadata = {
  title: "تسجيل منظمة جديدة | منصة جود",
  description: "نموذج تسجيل منظمة جديدة على منصة جود",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
