// Example usage in a parent component or page (e.g., app/admin/banners/page.tsx or similar)
'use client'
import { BannerForm, BannerFormData } from '@/components/banners/BannerForm';
import api from '@/lib/api';
import { useBanners } from '@/store/hooks';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

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
  const router = useRouter()
  // create product 
  const { isPending: addBannerLoading, mutate: addBanner } = useMutation({
    mutationFn: async (formData: FormData) => {
      console.log('formData', formData);
      const res = await api.post('/api/banners/create', formData, {
        headers: {
          'Content-Type': undefined, // Let browser set multipart/form-data
        },
      })
      return res.data
    },
    onSuccess: (data) => {
      // Invalidate the 'todos' query to refetch the updated list
      if (data.success) {
        toast.success(data?.message || 'Banner Campaign Added successfully')
        router.push(`/banners/edit/${data.data}`)
      }
      else {
        toast.error(data?.error || data?.message || 'Failed to add Banner Campaign')
      }
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
      toast.error(error?.message || 'Failed to add product');
    },
  });

  const handleSubmit = (data: BannerFormData) => {
   const bannerFormData = new FormData();
    bannerFormData.append('name', data.name || '');
    bannerFormData.append('description', data.description || '');
    bannerFormData.append('start_date', new Date(new Date(data.validity.from).toISOString().substring(0, 10) + ' ' + data.startTime).toISOString());
    bannerFormData.append('end_date', new Date(new Date(data.validity.to).toISOString().substring(0, 10) + ' ' + data.endTime).toISOString());
    bannerFormData.append('is_active', data.active ? '1' : '0'); // New banners are inactive by default
    bannerFormData.append('priority', data.priority.toString());
    bannerFormData.append('file', data.file as File);
    addBanner(bannerFormData);
  };



  return (
    <div className=" py-10">
      <BannerForm
        banner={initialBanner}
        onSubmit={handleSubmit}
        onCancel={()=>{router.back()}}
        loading={addBannerLoading}
      />
    </div>
  );
}