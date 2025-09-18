// Example usage in a parent component or page (e.g., app/admin/banners/page.tsx or similar)
'use client'
import { BannerForm } from '@/components/banners/BannerForm';
import { useState } from 'react';

// Define the Banner type if not already imported
interface Banner {
  id?: string | number;
  validity: { from: Date; to: Date };
  startTime: string;
  endTime: string;
  priority: number;
  linkItem?: string;
  branches: string[];
  appBannerImage?: File | null;
  appBannerPreview?: string;
  webBannerImage?: File | null;
  webBannerPreview?: string;
}

// Example: For creating a new banner (pass empty/undefined banner)
const initialBanner: Partial<Banner> = {}; // Or undefined for new

// Example: For editing an existing banner
const existingBanner: Partial<Banner> = {
  id: 'banner-123',
  validity: { from: new Date('2025-09-13'), to: new Date('2025-09-20') },
  startTime: '09:00',
  endTime: '18:00',
  priority: 2,
  linkItem: '1', // e.g., item ID
  branches: ['1', '2'],
  appBannerPreview: '/path/to/preview-app.jpg', // Base64 or URL for preview
  webBannerPreview: '/path/to/preview-web.jpg',
};

export default function BannerPage() {
  const [isEditing,/* setIsEditing*/] = useState(false); // Toggle between create/edit

  const handleSubmit = (data: Banner) => {
    console.log('Banner submitted:', data);
    // Here: API call to save/update banner
    // e.g., await api.banners.create(data) or update(data)
    alert('Banner saved successfully!');
    // Optionally close modal or redirect
  };

  const handleCancel = () => {
    console.log('Banner form cancelled');
    // Optionally reset state or close modal
  };

  return (
    <div className=" py-10">
      <BannerForm
        banner={isEditing ? existingBanner : initialBanner}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}