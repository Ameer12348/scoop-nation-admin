import ComponentCard from "@/components/common/ComponentCard"
import { SettingForm } from "@/components/settings/SettingForm"
import { Card } from "@/components/ui/card"

const page = () => {
  return (
    <div>
        <ComponentCard title="Company Settings">
            <SettingForm/>
        </ComponentCard>
    </div>
  )
}

export default page