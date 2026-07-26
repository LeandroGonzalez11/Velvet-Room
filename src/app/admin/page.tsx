import { AdminDashboard } from "@/components/admin-dashboard";
import { BulkImporter } from "@/components/bulk-importer";

export const metadata = { title: "Administración" };

export default function AdminPage() {
  return <><BulkImporter /><AdminDashboard /></>;
}
