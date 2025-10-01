import EditBanner from "@/components/banners/EditBanner"

const page = ({params}:{params:{id:string}}) => {
  return (
    <div>
        <EditBanner id={params.id} />

    </div>
  )
}

export default page