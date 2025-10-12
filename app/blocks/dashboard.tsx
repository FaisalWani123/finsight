"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Finances } from "../backend/types/Finances";
import { fetchUserFinances, deleteFinanceEntryById, updateFinanceEntryById } from "../backend/finances/clientActions";
import { currencyMapper } from "@/lib/currencyMapper";
import { FinanceCard } from "./homeCard";
import { toastCenter } from "@/lib/toastCenter";
import { createClient } from "@/lib/supabase/client";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty"; // Shadcn Empty component
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface DashboardProps {
  userId: string;
  profileCurrency: number; // 1 = USD, 2 = EUR, 3 = HUF
}

export default function Dashboard({ userId, profileCurrency }: DashboardProps) {
  const supabase = createClient();
  const router = useRouter();
  const [finances, setFinances] = useState<Finances[]>([]);
  const [loading, setLoading] = useState(true);
  const profileCurrencyCode = currencyMapper(profileCurrency);

  // Fetch fresh data
  const loadFinances = async () => {
    setLoading(true);
    const res = await fetchUserFinances(userId);
    if (res.success && res.data) setFinances(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadFinances();

    // Realtime subscription
    const financeChannel = supabase
      .channel("finance-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "finances", filter: `userId=eq.${userId}` },
        () => {
          loadFinances(); // refetch on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(financeChannel);
    };
  }, [userId]);

  if (loading) return <Spinner className="mx-auto mt-20" />;

  const filterByType = (type: number) => finances.filter(f => f.type === type);

  const handleEditFinance = async (id: string, label: string, amount: number) => {
    const response = await updateFinanceEntryById(id, label, amount);
    toastCenter(response);
    loadFinances();
  };

  const handleDeleteFinance = async (id: string) => {
    const response = await deleteFinanceEntryById(id);
    toastCenter(response);
    loadFinances();
  };

  const renderSection = (title: string, type: number) => {
    const items = filterByType(type);

    if (!items.length)
      return (
        <Empty className="my-6">
          <EmptyTitle>No {title} yet</EmptyTitle>
          <EmptyDescription>
            <Button onClick={() => router.push("/protected/finances")}> Add {title}</Button>
          </EmptyDescription>
        </Empty>
      );

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
