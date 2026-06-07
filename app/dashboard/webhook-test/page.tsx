"use client";

import { useEffect, useState } from "react";

export default function WebhookTestPage() {
  const [data, setData] = useState<any>(null);

  async function load() {
    const res = await fetch("/api/webhook-test");
    const json = await res.json();
    setData(json);
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-10 text-white bg-black min-h-screen">
      <h1 className="text-2xl mb-6">Webhook Test Monitor</h1>

      <pre className="bg-gray-900 p-4 rounded text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
