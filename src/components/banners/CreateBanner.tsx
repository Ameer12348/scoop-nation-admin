// Example usage in a parent component or page (e.g., app/admin/banners/page.tsx or similar)
'use client'
import { BannerForm } from '@/components/banners/BannerForm';
import { useBanners } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Define the Banner type if not already imported
interface Banner {
  id?: string | number;
  validity: { from: Date; to: Date };
  startTime: string;
  endTime: string;
  priority: number;
  linkItem?: string;
  name?: string;
  description?: string;
  branches: string[];
  appBannerImage?: File | null;
  appBannerPreview?: string;
  webBannerImage?: File | null;
  webBannerPreview?: string;
}

// Example: For creating a new banner (pass empty/undefined banner)
const initialBanner: Partial<Banner> = {}; // Or undefined for new



export default function CreateBanner() {
const {createBannerAction,createBanner:{loading:createBannerLoading}} =useBanners()
const router = useRouter()
  const handleSubmit = (data: Banner) => {
    // create banner action
    createBannerAction({
      name:data.name || '',
      description:data.description || '',
      start_date: new Date(new Date(data.validity.from).toISOString().substring(0, 10) + ' ' + data.startTime).toISOString(),
      end_date:  new Date(new Date(data.validity.to).toISOString().substring(0, 10) + ' ' + data.endTime).toISOString(),
      is_active:true,
    }).then(res=>{
        if (res.type == 'banners/createBanner/fulfilled' && res.payload) {
            router.push('/banners/edit/'+res.payload)
        }
    })
  };

  const handleCancel = () => {
    console.log('Banner form cancelled');

    // Optionally reset state or close modal
    router.push('/banners')
  };

  return (
    <div className=" py-10">
      <BannerForm
        banner={ initialBanner}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={createBannerLoading}
      />
    </div>
  );
}