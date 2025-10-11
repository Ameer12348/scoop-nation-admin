'use client';
import { useAppSelector, useBanners } from "@/store/hooks";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { BannerForm, BannerFormData } from "./BannerForm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

const EditBanner = ({ id }: { id: string }) => {
  const { currentBanner, fetchBannerById, } = useBanners();
  const router = useRouter();

  const { isPending: updateBannerLoading, mutate: updateBanner } = useMutation({
    mutationFn: async ({ formData, productId }: { formData: FormData, productId: string | number }) => {
      console.log('formData', formData);
      const res = await api.post(`/api/banners/update`, formData, {
        headers: {
          'Content-Type': undefined, // Let browser set multipart/form-data
        },
      })
      return res.data
    },
    onSuccess: (data) => {
      // Invalidate the 'todos' query to refetch the updated list
      if (data.success) {
        toast.success(data?.message || 'Product Updated successfully')
      }
      else {
        toast.error(data?.error || data?.message || 'Failed to update product')
      }
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
      toast.error(error?.message || 'Failed to update product');
    },
  });




  useEffect(() => {
    fetchBannerById(id);
  }, [id]);

  const handleUpdate = (data: BannerFormData) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', data.name || '');
    formData.append('description', data.description || '');
    formData.append('start_date', new Date(new Date(data.validity.from).toISOString().substring(0, 10) + ' ' + data.startTime).toISOString());
    formData.append('end_date', new Date(new Date(data.validity.to).toISOString().substring(0, 10) + ' ' + data.endTime).toISOString());
    formData.append('is_active', true.toString()); // New banners are inactive by default
    formData.append('priority', data.priority.toString());
    formData.append('file', data.file as File);
    formData.append('media', JSON.stringify(data.media || []));
    updateBanner({ formData, productId: id });
  }

  return (
    <div className="min-h-[70vh] relative">

      {currentBanner.loading ? (
        <div className="absolute top-0 left-0 w-full h-full bg-white/90 flex justify-center items-center">
          <Loader className="animate-spin  text-gray-500" size={40} />
        </div>
      ) : currentBanner.error ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-600">
          <svg
            className="w-12 h-12 mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
          <p className="text-sm">{currentBanner.error}</p>
        </div>
      ) : (
        <div>
          {/* banner form */}
          <BannerForm banner={{
            startTime: currentBanner.data?.start_date
              ? new Date(currentBanner.data.start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
              : undefined,
            endTime: currentBanner.data?.end_date
              ? new Date(currentBanner.data.end_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
              : undefined,
            validity: {
              from: new Date(currentBanner.data?.start_date || Date.now()),
              to: new Date(currentBanner.data?.end_date || Date.now())
            },
            name: currentBanner.data?.name || '',
            description: currentBanner.data?.description || '',
            media: currentBanner.data?.media || null,

          }}
            onSubmit={handleUpdate}
          loading={updateBannerLoading}
             />
        </div>
      )}
    </div>
  )
}

export default EditBanner