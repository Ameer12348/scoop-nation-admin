import ComponentCard from "@/components/common/ComponentCard"
import { LayoutDesignForm } from "@/components/settings/LayoutDesignForm"

const page = () => {
  return (
    <div>
        <ComponentCard title="Layout Design Settings">
            <LayoutDesignForm/>
        </ComponentCard>
    </div>
  )
}

export default page
