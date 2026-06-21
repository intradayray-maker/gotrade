import GTCard from "@/components/ui/GTCard";

export default async function MasterDashboard() {
  return (
    <GTCard className="space-y-4">
      <h2 className="text-xl font-semibold text-white">
        Legacy Dashboard Preview
      </h2>
      <p className="max-w-2xl text-sm text-white/60">
        This helper component is now just a safe placeholder so the codebase
        keeps building while the new single-user forex dashboard takes shape.
      </p>
    </GTCard>
  );
}
