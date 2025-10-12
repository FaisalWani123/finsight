import React from 'react'
import HomeClient from './client'
import { getAuthUser } from '@/app/backend/redirects/checkUser'
import { getUserByIdFromServer } from '@/app/backend/user/serverActions';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const authUser = await getAuthUser(); 
  const user = await getUserByIdFromServer(authUser.id);
  if (!user.data) {
    return redirect("/protected/home")
  }
  return (
    <>
        <HomeClient userId={user.data?.userId} profileCurrency={user.data.currency}/>
    </>
  )
}
