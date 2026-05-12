export default function StatusCard({ type, message }: any) {
  const color =
    type === "success"
      ? "border-green-600 bg-green-900/30 text-green-200"
      : "border-red-600 bg-red-900/30 text-red-200";

  return (
    <div
      className={`p-4 rounded-xl border ${color} shadow-lg shadow-black/40 backdrop-blur-sm`}
    >
      <p className="font-medium">{message}</p>
    </div>
  );
}
