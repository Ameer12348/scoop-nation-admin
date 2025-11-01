"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import api from '@/lib/api';

// Layout options with descriptions
const layoutOptions = [
  {
    value: 'TWO_ROWS',
    label: 'Two Rows Layout',
    description: 'Display products in two rows per section',
    image: '/images/layouts/two-rows.png', // You can add actual preview images
  },
  {
    value: 'THREE_ROWS',
    label: 'Three Rows Layout',
    description: 'Display products in three rows per section',
    image: '/images/layouts/three-rows.png',
  },
  {
    value: 'SECTIONS_PRODUCTS',
    label: 'Sections Products Layout',
    description: 'Display products grouped by sections',
    image: '/images/layouts/sections-products.png',
  },
];

// Zod schema for form validation
const layoutDesignSchema = z.object({
  products_layout: z.enum(['TWO_ROWS', 'THREE_ROWS', 'SECTIONS_PRODUCTS']),
});

type LayoutDesignSchema = z.infer<typeof layoutDesignSchema>;

export const LayoutDesignForm: React.FC = () => {
  // Form hook setup
  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LayoutDesignSchema>({
    resolver: zodResolver(layoutDesignSchema),
    defaultValues: {
      products_layout: 'TWO_ROWS',
    },
  });

  const selectedLayout = watch('products_layout');

  // Fetch layout design
  const { 
    data: layoutData, 
    isPending: fetchLayoutLoading, 
    error: fetchLayoutError 
  } = useQuery({
    queryKey: ['layout-design'],
    queryFn: async () => {
      const response = await api.get('/api/admin/get-layout-design');
      return response.data;
    },
  });

  // Update layout design mutation
  const { 
    isPending: updateLayoutLoading, 
    mutate: updateLayout 
  } = useMutation({
    mutationFn: async (data: LayoutDesignSchema) => {
      const res = await api.post('/api/admin/update-layout-design', data);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data?.message || 'Layout design updated successfully');
        if (data.data) {
          setValue('products_layout', data.data.products_layout);
        }
      } else {
        toast.error(data?.error || data?.message || 'Failed to update layout design');
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update layout design');
    },
  });

  // Populate form with fetched layout data
  useEffect(() => {
    if (layoutData?.data) {
      setValue('products_layout', layoutData.data.products_layout || 'TWO_ROWS');
    }
  }, [layoutData, setValue]);

  // Handle form submission
  const onSubmit = (data: LayoutDesignSchema) => {
    updateLayout(data);
  };

  // Render skeleton loader while fetching data
  if (fetchLayoutLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  // Render error state
  if (fetchLayoutError) {
    return (
      <div className="text-destructive py-5">
        Failed to load layout design data. Please try again later.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Layout Options */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Select Products Layout</Label>
        <div className="grid gap-4">
          {layoutOptions.map((option) => (
            <div
              key={option.value}
              className={`relative flex items-start space-x-4 rounded-lg border-2 p-4 transition-all cursor-pointer hover:border-primary/50 ${
                selectedLayout === option.value
                  ? 'border-primary bg-primary/5'
                  : 'border-muted'
              }`}
              onClick={() => setValue('products_layout', option.value as any)}
            >
              {/* Custom Radio Button */}
              <div className="flex items-center justify-center mt-1">
                <input
                  type="radio"
                  id={option.value}
                  name="products_layout"
                  value={option.value}
                  checked={selectedLayout === option.value}
                  onChange={(e) => setValue('products_layout', e.target.value as any)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label
                  htmlFor={option.value}
                  className="text-base font-medium cursor-pointer flex items-center gap-2"
                >
                  {option.label}
                  {selectedLayout === option.value && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
                
                {/* Preview Image Placeholder */}
                <div className="mt-3 rounded-md border bg-muted/30 p-4 flex items-center justify-center min-h-[120px]">
                  {option.value === 'TWO_ROWS' && (
                    <div className="space-y-2 w-full">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 bg-primary/20 rounded"></div>
                        <div className="h-12 bg-primary/20 rounded"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-12 bg-primary/20 rounded"></div>
                        <div className="h-12 bg-primary/20 rounded"></div>
                      </div>
                    </div>
                  )}
                  
                  {option.value === 'THREE_ROWS' && (
                    <div className="space-y-2 w-full">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-10 bg-primary/20 rounded"></div>
                        <div className="h-10 bg-primary/20 rounded"></div>
                        <div className="h-10 bg-primary/20 rounded"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-10 bg-primary/20 rounded"></div>
                        <div className="h-10 bg-primary/20 rounded"></div>
                        <div className="h-10 bg-primary/20 rounded"></div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-10 bg-primary/20 rounded"></div>
                        <div className="h-10 bg-primary/20 rounded"></div>
                        <div className="h-10 bg-primary/20 rounded"></div>
                      </div>
                    </div>
                  )}
                  
                  {option.value === 'SECTIONS_PRODUCTS' && (
                    <div className="space-y-3 w-full">
                      <div className="space-y-1">
                        <div className="h-6 w-32 bg-primary/30 rounded"></div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-10 bg-primary/20 rounded"></div>
                          <div className="h-10 bg-primary/20 rounded"></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-6 w-32 bg-primary/30 rounded"></div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-10 bg-primary/20 rounded"></div>
                          <div className="h-10 bg-primary/20 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {errors.products_layout && (
          <p className="text-sm text-destructive">
            {errors.products_layout.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={updateLayoutLoading} 
        className="w-full sm:w-auto"
      >
        {updateLayoutLoading ? (
          <>
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Updating...
          </>
        ) : (
          'Update Layout'
        )}
      </Button>
    </form>
  );
};
