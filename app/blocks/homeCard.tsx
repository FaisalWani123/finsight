"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Finances } from "../backend/types/Finances";
import { currencyMapper } from "@/lib/currencyMapper";
import { convertCurrency } from "@/lib/currencyConverter";
import { FinanceModal } from "./modal";

interface FinanceCardProps {
  finance: Finances;
  profileCurrencyCode: string;
  onEdit: (id: string, label: string, amount: number) => void;
  onDelete: (id: string) => void;
}

export const FinanceCard: React.FC<FinanceCardProps> = ({
  finance,
  profileCurrencyCode,
  onEdit,
  onDelete,
}) => {
  const fromCurrencyCode = finance.currency ? currencyMapper(finance.currency) : "USD";
  const convertedAmount = convertCurrency(Number(finance.amount), fromCurrencyCode, profileCurrencyCode);

  return (
    <FinanceModal
      finance={finance}
      profileCurrencyCode={profileCurrencyCode}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      <Card className="border shadow-sm hover:shadow-lg transition cursor-pointer">
        <CardHeader>
          <CardTitle>{finance.label}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p>
            <span className="font-semibold">Amount:</span>{" "}
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: profileCurrencyCode,
            }).format(convertedAmount)}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(finance.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </FinanceModal>
  );
};
