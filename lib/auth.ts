import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const auth = cookieStore.get("admin-auth");
  if (!auth?.value || auth.value !== "true") {
    redirect("/admin/login");
  }
}
