import BottomNav from '@/components/layout/BottomNav';

export default function TabsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen pb-20">
            {children}
            <BottomNav />
        </div>
    );
}
