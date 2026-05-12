"use client";

import { useEffect, useState } from "react";

import ApiKeyModal from "@/components/ApiKeyModal";
import type { Tables } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

export default function BrokerClient() {
  const supabase = createClient();
  const [connections, setConnections] = useState<Tables<"broker_connections">[]>(
    []
  );
  const [modalBroker, setModalBroker] = useState<string | null>(null);

  useEffect(() => {
    void loadConnections();
  }, []);

  async function loadConnections() {
    const { data } = await supabase.from("broker_connections").select("*");
    setConnections(data || []);
  }

  const brokers = ["Alpaca"];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Broker Accounts</h1>
        <p className="text-neutral-400 mt-1">
          Connect your broker to enable automated trading.
        </p>
      </div>

      <div className="space-y-6">
        {brokers.map((broker) => {
          const existing = connections.find(
            (connection) => connection.broker === broker.toLowerCase()
          );

          return (
            <div
              key={broker}
              className="bg-neutral-900 border border-white/10 rounded-xl p-6 flex items-center justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{broker}</h2>
                <p className="text-neutral-400 text-sm">
                  {existing ? "Connected" : "Not connected"}
                </p>
              </div>

              <button
                onClick={() => setModalBroker(broker)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  existing
                    ? "bg-neutral-700 hover:bg-neutral-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {existing ? "Update Keys" : "Connect"}
              </button>
            </div>
          );
        })}
      </div>

      {modalBroker && (
        <ApiKeyModal
          broker={modalBroker}
          onClose={() => {
            setModalBroker(null);
            void loadConnections();
          }}
        />
      )}
    </div>
  );
}
