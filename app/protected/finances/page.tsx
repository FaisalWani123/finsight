import React from 'react'
import FinancesClient from './client'
import { getAuthUser } from '@/app/backend/redirects/checkUser'
import { getUserByIdFromServer } from '@/app/backend/user/serverActions'
import { redirect } from 'next/navigation';

export default async function FinancesPage() {
  const authUser = await getAuthUser(); 
  const user = await getUserByIdFromServer(authUser.id)

  if (!user.data) {
    redirect("/protected/home")
  }

  return (
    <>
        <FinancesClient userId={user.data?.userId} currency={user.data.currency}/>
    </>
  )
}
