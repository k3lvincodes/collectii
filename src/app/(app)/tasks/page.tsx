import { AppHeader } from "@/components/app-header";
import { TaskPrioritizer } from "@/components/task-prioritizer";

export default function TasksPage() {
  return (
    <>
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="container px-0">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl font-headline">Tasks</h1>
          </div>
          <div className="mt-6">
            <TaskPrioritizer />
          </div>
        </div>
      </main>
    </>
  );
}
