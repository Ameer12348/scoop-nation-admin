'use client';
import { useAppSelector, useBanners } from "@/store/hooks";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { BannerForm } from "./BannerForm";
import { useRouter } from "next/navigation";

const EditBanner = ({ id }: { id: string }) => {
  const { currentBanner, fetchBannerById, updateBannerAction, } = useBanners();
  const {loading:updateBannerLoading} = useAppSelector(x=>x.banners.updateBanner)
  const router = useRouter();
  useEffect(() => {
    fetchBannerById(id);
  }, [id]);

  

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
          }} 
          onSubmit={(data) => {
            console.log(data);
            
            
            updateBannerAction({
              id:Number(id),
              name:data.name,
              description:data.description,
              start_date: new Date(new Date(data.validity.from).toISOString().substring(0, 10) + ' ' + data.startTime).toISOString(),
              end_date:  new Date(new Date(data.validity.to).toISOString().substring(0, 10) + ' ' + data.endTime).toISOString(),
              is_active:true,
            })
            
           }} onCancel={() => {
            router.push('/banners')
          }} />
          loading={updateBannerLoading}
        </div>
      )}
    </div>
  )
}

export default EditBanner