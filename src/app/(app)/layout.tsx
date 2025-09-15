import { AppSidebar } from '@/components/app-sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <AppSidebar />
      <div className="flex flex-col md:ml-[calc(220px+10px)] lg:ml-[calc(280px+10px)]">
        {children}
      </div>
    </div>
  );
}
