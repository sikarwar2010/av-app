import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </div>
    );
}
