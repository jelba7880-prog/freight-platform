"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Input } from "@freight/ui";
import type { CustomerSummary } from "@freight/database";

import { searchCustomers } from "./actions";

// Debounced client-side email search against `searchCustomers` (a server
// action re-checking auth itself) — kept local to this form rather than a
// general-purpose combobox, since @freight/ui deliberately has no picker
// component yet (see packages/ui/src/index.ts).
export function CustomerPicker() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CustomerSummary[]>([]);
  const [selected, setSelected] = useState<CustomerSummary | null>(null);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (selected || !query.trim()) {
      return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const matches = await searchCustomers(query);
        setResults(matches);
      });
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query, selected]);

  if (selected) {
    return (
      <div className="flex flex-col gap-tight">
        <span className="font-sans text-sm font-medium text-foreground">Customer</span>
        <div className="flex items-center justify-between gap-cozy rounded-sm border border-border bg-surface px-cozy py-snug">
          <span className="text-sm text-foreground">
            {selected.name ? `${selected.name} — ${selected.email}` : selected.email}
          </span>
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setQuery("");
              setResults([]);
            }}
            className="font-sans text-xs text-muted hover:text-foreground"
          >
            Clear
          </button>
        </div>
        <input type="hidden" name="customerId" value={selected.id} />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-tight">
      <Input
        id="customerEmail"
        label="Customer (optional)"
        placeholder="Search by email"
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          if (!value.trim()) {
            setResults([]);
          }
        }}
        autoComplete="off"
      />
      {isPending ? <p className="font-sans text-xs text-muted">Searching…</p> : null}
      {results.length > 0 ? (
        <ul className="flex flex-col gap-tight rounded-sm border border-border bg-surface p-tight">
          {results.map((customer) => (
            <li key={customer.id}>
              <button
                type="button"
                onClick={() => {
                  setSelected(customer);
                  setResults([]);
                }}
                className="w-full rounded-sm px-cozy py-snug text-left text-sm text-foreground hover:bg-border/40"
              >
                {customer.name ? `${customer.name} — ${customer.email}` : customer.email}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {!isPending && query.trim() && results.length === 0 ? (
        <p className="font-sans text-xs text-muted">No matching customers.</p>
      ) : null}
    </div>
  );
}
