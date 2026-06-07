import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function TestPage() {
  const { data } = await supabase
    .from("trade_state")
    .select("*")
    .limit(1)
    .single();

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-bold mb-6">GoTrade Supa Test</h1>

      <pre className="mb-6 text-sm bg-gray-900 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
