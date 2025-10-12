"use client"

import Dashboard from '@/app/blocks/dashboard';
import Ratios from '@/app/blocks/ratios';
import React, { useEffect, useState } from 'react';
import { Finances } from '@/app/backend/types/Finances';
import { BackendResponse } from '@/app/backend/types/General';
import { ClassStatisticRepsonse } from '@/app/backend/types/Finances';
import { getLiabilitiesFromClient, getTotalAssetsFromClient, getTotalInflowFromClient, getTotalOutflowFromClient } from '@/app/backend/finances/clientActions';

interface HomeClientProps {
  userId: string;
  profileCurrency: number;
}

export default function HomeClient({ userId, profileCurrency }: HomeClientProps) {
  const [inflows, setInflows] = useState<Finances[]>([]);
  const [inflowTotal, setInflowTotal] = useState(0);

  const [outflows, setOutflows] = useState<Finances[]>([]);
  const [outflowTotal, setOutflowTotal] = useState(0);

  const [assets, setAssets] = useState<Finances[]>([]);
  const [assetsTotal, setAssetsTotal] = useState(0);

  const [liabilities, setLiabilities] = useState<Finances[]>([]);
  const [liabilitiesTotal, setLiabilitiesTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFinancialData() {
      setLoading(true);

      const inflowRes: BackendResponse<ClassStatisticRepsonse> = await getTotalInflowFromClient(userId, profileCurrency);
      const outflowRes: BackendResponse<ClassStatisticRepsonse> = await getTotalOutflowFromClient(userId, profileCurrency);
      const assetsRes: BackendResponse<ClassStatisticRepsonse> = await getTotalAssetsFromClient(userId, profileCurrency);
      const liabilitiesRes: BackendResponse<ClassStatisticRepsonse> = await getLiabilitiesFromClient(userId, profileCurrency);

      if (inflowRes.success) {
        setInflows(inflowRes.data?.records || []);
        setInflowTotal(inflowRes.data?.total || 0);
      }

      if (outflowRes.success) {
        setOutflows(outflowRes.data?.records || []);
        setOutflowTotal(outflowRes.data?.total || 0);
      }

      if (assetsRes.success) {
        setAssets(assetsRes.data?.records || []);
        setAssetsTotal(assetsRes.data?.total || 0);
      }

      if (liabilitiesRes.success) {
        setLiabilities(liabilitiesRes.data?.records || []);
        setLiabilitiesTotal(liabilitiesRes.data?.total || 0);
      }

      setLoading(false);
    }

    fetchFinancialData();
  }, [userId, profileCurrency]);

  if (loading) return <p className="p-6">Loading financial data...</p>;

  return (
    <div className="space-y-8">
      <Ratios
        inflowTotal={inflowTotal}
        inflows={inflows}
        outflowTotal={outflowTotal}
        outflows={outflows}
        assetsTotal={assetsTotal}
        assets={assets}
        liabilitiesTotal={liabilitiesTotal}
        liabilities={liabilities} profileCurrency={profileCurrency}      />
      <Dashboard userId={userId} profileCurrency={profileCurrency} />
    </div>
  );
}
