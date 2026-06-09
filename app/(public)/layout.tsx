// app\(public)\layout.tsx

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050509] text-slate-100">
      <main>{children}</main>
    </div>
  );
}
