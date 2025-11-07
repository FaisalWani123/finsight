"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Finances } from "../backend/types/Finances";

interface FinanceModalProps {
  finance: Finances;
  profileCurrencyCode: string;
  onEdit: (id: string, label: string, amount: number) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode; // Card trigger
}

export const FinanceModal: React.FC<FinanceModalProps> = ({
  finance,
  onEdit,
  onDelete,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(finance.label);
  const [amount, setAmount] = useState(finance.amount);

  useEffect(() => {
    setLabel(finance.label);
    setAmount(finance.amount);
  }, [finance]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Finance Entry</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label"
          />
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            placeholder="Amount"
          />
        </div>
        <DialogFooter className="flex justify-between mt-4">
          <Button variant="destructive" onClick={() => {onDelete(finance.id); setOpen(false)}}>
            Delete
          </Button>
          <Button
            onClick={() => {
              onEdit(finance.id, label, amount);
              setOpen(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
