"use client";

import { useEffect, useState } from "react";

type Invoice = {
  id: string;
  status: string | null;
};

export default function InvoicesList() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/billing/customer", {
        cache: "no-store",
      });
      const data = (await response.json()) as { invoices?: Invoice[] };
      setInvoices(data.invoices ?? []);
    }

    void load();
  }, []);

  return (
    <ul>
      {invoices.map((invoice) => (
        <li key={invoice.id}>
          <span>{invoice.id}</span>
          <span>{invoice.status}</span>
        </li>
      ))}
    </ul>
  );
}
