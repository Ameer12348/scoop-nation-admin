'use client'
import { EmailTemplateForm, EmailTemplateFormData } from '@/components/emailTemplates/EmailTemplateForm'
import { useEmailTemplates } from '@/store/hooks'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import api from '@/lib/api'

const initialTemplate: Partial<EmailTemplateFormData> = {}

export default function CreateEmailTemplate() {
  const router = useRouter()
  const { createEmailTemplateAction } = useEmailTemplates()

  const { isPending: createTemplateLoading, mutate: createTemplate } = useMutation({
    mutationFn: async (formData: EmailTemplateFormData) => {
      const response = await api.post('/api/email_templates/create', formData)
      return response.data
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Email Template Created successfully')
        router.push(`/email_templates/edit?id=${data.data.id}`)
      } else {
        toast.error(data.message || 'Failed to create email template')
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create email template')
    },
  })

  const handleSubmit = (data: EmailTemplateFormData) => {
    createTemplate(data)
  }

  return (
    <div className="py-10">
      <EmailTemplateForm
        isEdit={false}
        template={initialTemplate}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        loading={createTemplateLoading}
      />
    </div>
  )
}