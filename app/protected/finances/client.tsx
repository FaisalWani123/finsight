"use client"

import { insertFinancesFromFormFromClient } from '@/app/backend/finances/clientActions';
import { FinanceFormData } from '@/app/backend/types/Finances';
import ExcelImporter from '@/app/blocks/excel/excelImporter';
import { FinanceForm } from '@/app/blocks/forms/financeForm';
import { toastCenter } from '@/lib/toastCenter'
import React from 'react'
import toast from 'react-hot-toast';

interface FinancesClientProps {
  userId: string;
  currency: number;
}
export default function FinancesClient({userId, currency}: FinancesClientProps) {

  const onSubmit = async (formData: FinanceFormData) => {
    const response = await insertFinancesFromFormFromClient(userId, formData, currency)
    toastCenter(response);
  }
  
  return (
    <>
      <ExcelImporter userId={userId} currency={currency} onImport={(success, msg) => {
    if (success) {
      toast.success(msg || "Import successful");
    } else {
      toast.error(msg || "Import failed");
    }
  }} />
      <FinanceForm onSubmit={onSubmit}/>
    </>
  )
}
