
import AdminLayout from "@/components/admin/Layout/page";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
