
import { Suspense, type ReactNode } from "react";
import DoctorLayout from "@/components/layouts/DoctorLayout";
import { DoctorProvider } from "@/features/doctors/DoctorProvider";

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DoctorProvider>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <p className="text-sm text-slate-600">
              Memuat halaman dokter...
            </p>
          </div>
        }
      >
        <DoctorLayout>{children}</DoctorLayout>
      </Suspense>
    </DoctorProvider>
  );
}