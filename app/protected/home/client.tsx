import Dashboard from '@/app/blocks/dashboard'
import React from 'react'

interface HomeClientProps {
  userId: string;
  profileCurrency: number;
}

export default function HomeClient({userId, profileCurrency}: HomeClientProps) {
  return (
    <>
      <Dashboard userId={userId} profileCurrency={profileCurrency}/>
    </>
  )
}
