import { redirect } from "next/navigation";

export default function AdminHomePage() {
  redirect("/app/admin/dashboard");
}
