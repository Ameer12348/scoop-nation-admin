"use client";

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';
import Dropzone from '../form/form-elements/DropZone';
import api from '@/lib/api';
import { BASE_URL } from '@/consts';

// Constants for logo validation
const MAX_LOGO_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];

// Zod schema for form validation
const settingsSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    logo: z.string().optional(),
    file: z
      .any()
      .optional()
      .refine((v) => {
        if (!v) return true;
        const file = v instanceof File ? v : v && v.length === 1 ? v[0] : undefined;
        return file instanceof File;
      }, { message: 'Invalid file' })
      .refine((v) => {
        if (!v) return true;
        const file = v instanceof File ? v : v && v.length === 1 ? v[0] : undefined;
        if (!file) return true;
        return file.size <= MAX_LOGO_SIZE;
      }, { message: 'Logo must be 2MB or smaller' })
      .refine((v) => {
        if (!v) return true;
        const file = v instanceof File ? v : v && v.length === 1 ? v[0] : undefined;
        if (!file) return true;
        return ACCEPTED_LOGO_TYPES.includes(file.type);
      }, { message: 'Only PNG, JPG, WebP, or SVG images are allowed' }),
  })
  .superRefine((val, ctx) => {
    const hasLogoString = typeof val.logo === 'string' && val.logo.length > 0;
    const hasFile = (() => {
      const v = val.file;
      if (!v) return false;
      const file = v instanceof File ? v : v.length === 1 ? v[0] : undefined;
      return file instanceof File;
    })();

    if (!hasLogoString && !hasFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either an existing logo URL or an uploaded file is required',
        path: ['file'],
      });
    }
  });

type SettingsSchema = z.infer<typeof settingsSchema>;

export const SettingForm: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  // Form hook setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      file: undefined,
    },
  });

  // Watch file input for preview updates
  const watchedFiles = watch('file') as FileList | File | undefined;

  // Fetch company details
  const { data: companyData, isPending: fetchCompanyLoading, error: fetchCompanyError } = useQuery({
    queryKey: ['company'],
    queryFn: async () => {
      const response = await api.get('/api/admin/get-company');
      return response.data;
    },
  });

  // Update company details mutation
  const { isPending: updateCompanyLoading, mutate: updateCompany } = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/api/admin/update-company', formData, {
        headers: {
          'Content-Type': undefined,
        },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data?.message || 'Company updated successfully');
        if (data.data) {
          setValue('name', data.data.name || '');
          setValue('description', data.data.description || '');
          setValue('logo', data.data.logo || '');
          if (data.data.logo) {
            setPreview(`${BASE_URL}/${data.data.logo}`);
          }
        }
      } else {
        toast.error(data?.error || data?.message || 'Failed to update company');
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update company');
    },
  });

  // Handle file preview
  useEffect(() => {
    let file: File | undefined;
    if (!watchedFiles) {
      setPreview(null);
      return;
    }
    if (watchedFiles instanceof File) file = watchedFiles;
    else if ((watchedFiles as FileList).length !== undefined) file = (watchedFiles as FileList)[0];

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [watchedFiles]);

  // Populate form with fetched company data
  useEffect(() => {
    if (companyData?.data) {
      setValue('name', companyData.data.name || '');
      setValue('description', companyData.data.description || '');
      setValue('logo', companyData.data.logo || '');
      if (companyData.data.logo) {
        setPreview(`${BASE_URL}/${companyData.data.logo}`);
      }
    }
  }, [companyData, setValue]);

  // Handle form submission
  const onSubmit = (data: SettingsSchema) => {
    const raw = data.file as FileList | File | undefined;
    let file: File | undefined;
    if (raw instanceof File) file = raw;
    else if (raw && (raw as FileList).length !== undefined) file = (raw as FileList)[0];

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (file && !data.logo) {
      formData.append('logo', file);
    } else if (data.logo) {
      formData.append('logo', data.logo);
    }

    updateCompany(formData);
  };

  // Render skeleton loader while fetching data
  if (fetchCompanyLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  // Render error state
  if (fetchCompanyError) {
    return (
      <div className="text-destructive">
        Failed to load company data. Please try again later.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Name Input */}
      <div className="space-y-2">
        <Label htmlFor="name">Company Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter company name"
          {...register('name')}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description Input */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          placeholder="Enter company description"
          {...register('description')}
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label>Company Logo</Label>
        <Dropzone
          acceptedFiles={{
            'image/png': [],
            'image/jpeg': [],
            'image/webp': [],
            'image/svg+xml': [],
          }}
          fixedRatio={1}
          onDone={(file) => {
            setValue('file', file);
            setValue('logo', '');
          }}
        />
        {errors.file && (
          <p className="text-sm text-destructive">{errors.file.message as string}</p>
        )}
      </div>

      {/* Logo Preview */}
      {preview && (
        <div className="space-y-2">
          <Label>Logo Preview</Label>
          <img
            src={preview}
            alt="Logo preview"
            className="h-24 w-auto object-contain rounded-md border"
          />
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={updateCompanyLoading} className="w-full sm:w-auto">
        {updateCompanyLoading ? (
          <Loader className="animate-spin h-5 w-5" />
        ) : (
          'Update Company'
        )}
      </Button>
    </form>
  );
};