import { AppSidebar } from '@/components/app-sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <AppSidebar />
      <div className="flex flex-col md:ml-[220px] lg:ml-[280px]">
        {children}
      </div>
    </div>
  );
}
