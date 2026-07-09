import { LearnSidebar } from "@/components/learn/learn-sidebar";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden  bg-[#D9A956] p-3 text-slate-900">
      <div className="flex h-full w-full  max-w-screen-2xl mx-auto overflow-hidden rounded-3xl bg-[#121212]">
        <LearnSidebar />
        <main className="my-3 mr-3 flex-1 overflow-y-auto overflow-x-hidden rounded-3xl bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}
