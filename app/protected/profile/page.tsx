import React from 'react'
import ProfileClient from './client'
import { getUserByIdFromServer } from '@/app/backend/user/serverActions'
import { getAuthUser } from '@/app/backend/redirects/checkUser'
import { toastCenter } from '@/lib/toastCenter';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const authUser = await getAuthUser();
    const response = await getUserByIdFromServer(authUser.id);
    if (!response.success || !response.data){
        toastCenter(response);
        return redirect("/protected/home");
    }
  return (
    <>
        <ProfileClient user={response.data}/>
    </>
  )
}
