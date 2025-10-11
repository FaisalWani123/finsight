"use client"

import { FinanceForm } from '@/app/blocks/forms/financeForm'
import React from 'react'

interface FinancesClientProps {
    onSubmit: () => void;
}
export default function FinancesClient({onSubmit}: FinancesClientProps) {
  return (
    <>
        <FinanceForm onSubmit={onSubmit}/>
    </>
  )
}
