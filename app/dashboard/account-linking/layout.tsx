export default function AccountLinkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>

      <main className="p-6">
        {children}
      </main>
    </>
  );
}
