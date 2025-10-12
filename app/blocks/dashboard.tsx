"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Finances } from "../backend/types/Finances";
import { fetchUserFinances } from "../backend/finances/clientActions";
import { currencyMapper } from "@/lib/currencyMapper";
import { FinanceCard } from "./homeCard";

interface DashboardProps {
  userId: string;
  profileCurrency: number; // 1 = USD, 2 = EUR, 3 = HUF
}

export default function Dashboard({ userId, profileCurrency }: DashboardProps) {
  const [finances, setFinances] = useState<Finances[]>([]);
  const [loading, setLoading] = useState(true);

  // Map numeric currency to string
  const profileCurrencyCode = currencyMapper(profileCurrency);

  useEffect(() => {
    async function loadFinances() {
      setLoading(true);
      const res = await fetchUserFinances(userId);
      if (res.success && res.data) setFinances(res.data);
      setLoading(false);
    }
    loadFinances();
  }, [userId]);

  if (loading) return <Spinner className="mx-auto mt-20" />;

  const filterByType = (type: number) => finances.filter(f => f.type === type);

  // Example functions to pass to the card/modal
  const handleEditFinance = (id: string, label: string, amount: number) => {
    console.log("Edit", { id, label, amount });
    // Update logic here
  };

  const handleDeleteFinance = (id: string) => {
    console.log("Delete", id);
    // Delete logic here
  };

  const renderSection = (title: string, type: number) => {
    const items = filterByType(type);
    if (items.length === 0) return null;

    return (
      <div className="space-y-2">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(f => (
            <FinanceCard
              key={f.id}
              finance={f}
              profileCurrencyCode={profileCurrencyCode}
              onEdit={handleEditFinance}
              onDelete={handleDeleteFinance}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-8">
      {renderSection("Assets", 4)}
      {renderSection("Liabilities", 3)}
      {renderSection("Inflows", 1)}
      {renderSection("Outflows", 2)}
    </div>
  );
}
