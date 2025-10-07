'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
export default function ProductFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-6 w-48 col-span-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full col-span-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Pricing and Stock */}
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-6 w-48 col-span-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Button variant="outline" disabled>
            <Plus size={16} className="mr-2" /> Add Variant
          </Button>
        </div>
        <div className="p-4 border rounded-lg grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-24 w-24 rounded-lg" />
          <Skeleton className="h-24 w-24 rounded-lg" />
        </div>
      </div>

      <Skeleton className="h-10 w-32" />
    </div>
  );
}