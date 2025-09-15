import { AppSidebar } from '@/components/app-sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <AppSidebar />
      <div className="flex flex-col md:ml-[calc(220px-30px)] lg:ml-[calc(280px-30px)]">
        {children}
      </div>
    </div>
  );
}
