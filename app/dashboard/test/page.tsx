"use client";

import TestClient from "./TestClient";

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-bold mb-6">GoTrade Test Panel</h1>
      <TestClient />
    </div>
  );
}
