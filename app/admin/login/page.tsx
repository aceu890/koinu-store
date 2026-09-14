import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/login-form";
import { isAdminSession, isDefaultAdminPassword } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (await isAdminSession()) redirect("/admin");

  return (
    <Suspense>
      <AdminLoginForm usingDefault={isDefaultAdminPassword()} />
    </Suspense>
  );
}
