"use client"

import { insertFinancesFromFormFromClient } from '@/app/backend/finances/clientActions';
import { FinanceForm, FinanceFormData } from '@/app/blocks/forms/financeForm'
import { toastCenter } from '@/lib/toastCenter'
import React from 'react'

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
        <FinanceForm onSubmit={onSubmit}/>
    </>
  )
}
