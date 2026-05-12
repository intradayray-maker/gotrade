import Header from "@/components/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050509] text-slate-100">
      <Header variant="public" user={null} isAdmin={false} homeHref="/" />
      <main>{children}</main>
    </div>
  );
}
