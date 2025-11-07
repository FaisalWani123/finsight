import React from 'react'
import HomeClient from './client'
import { getAuthUser } from '@/app/backend/redirects/checkUser'
import { getUserByIdFromServer } from '@/app/backend/user/serverActions';
import { redirect } from 'next/navigation';

import { getIncomeStreamInsightFromServer } from '@/app/backend/insights/serverActions';
import { getOutflowInsightFromServer, getAssetInsightFromServer, getLiabilityInsightFromServer } from '@/app/backend/insights/serverActions';
import { InsightResponse } from '@/app/backend/types/Insight';

export default async function HomePage() {
  const authUser = await getAuthUser(); 
  const user = await getUserByIdFromServer(authUser.id);
  if (!user.data) return redirect("/protected/home");

  // Run each function in serial (make parallel if you want faster load)
  const insights: InsightResponse[] = [];

  const inflow = await getIncomeStreamInsightFromServer(user.data.userId, user.data.currency);
  const outflow = await getOutflowInsightFromServer(user.data.userId);
  const asset = await getAssetInsightFromServer(user.data.userId);
  const liability = await getLiabilityInsightFromServer(user.data.userId);

  if (inflow.data) insights.push({ ...inflow.data, type: 1 });
  if (outflow.data) insights.push({ ...outflow.data, type: 2 });
  if (asset.data) insights.push({ ...asset.data, type: 3 });
  if (liability.data) insights.push({ ...liability.data, type: 4 });

  return (
    <>
      <HomeClient userId={user.data.userId} profileCurrency={user.data.currency} insights={insights} />
    </>
  )
}
