// src/components/banners/EditBannerClient.tsx
'use client'

import { useSearchParams } from 'next/navigation';
import EditBanner from '@/components/banners/EditBanner';
import { Suspense } from 'react';

function EditBannerClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <div>
      <EditBanner id={id || ''} />
    </div>
  );
}

export default function EditBannerWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditBannerClient />
    </Suspense>
  );
}