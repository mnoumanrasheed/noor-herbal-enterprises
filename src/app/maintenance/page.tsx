import { redirect } from "next/navigation";

export default function MaintenancePage() {
  // Send old maintenance links back to the restored storefront.
  redirect("/");
}
