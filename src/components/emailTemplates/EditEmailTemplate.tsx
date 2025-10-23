'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import api from '@/lib/api'
import { EmailTemplateForm, EmailTemplateFormData } from '@/components/emailTemplates/EmailTemplateForm'
import { useAppSelector, useEmailTemplates } from '@/store/hooks'
import { Loader } from 'lucide-react'

export default function EditEmailTemplate({ id }: { id: string }) {
  const router = useRouter()
  const { currentEmailTemplate, fetchEmailTemplateById } = useEmailTemplates()

  const { isPending: updateTemplateLoading, mutate: updateTemplate } = useMutation({
    mutationFn: async (templateData: EmailTemplateFormData & { id: string | number }) => {
      const response = await api.post('/api/email_templates/update', templateData)
      return response.data
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Email Template Updated successfully')
        fetchEmailTemplateById(id)
      } else {
        toast.error(data.message || 'Failed to update email template')
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update email template')
    },
  })

  useEffect(() => {
    fetchEmailTemplateById(id)
  }, [id])

  const handleUpdate = (data: EmailTemplateFormData) => {
    updateTemplate({ ...data, id })
  }

  return (
    <div className="min-h-[70vh] relative">
      {currentEmailTemplate.loading ? (
        <div className="absolute top-0 left-0 w-full h-full bg-white/90 flex justify-center items-center">
          <Loader className="animate-spin text-gray-500" size={40} />
        </div>
      ) : currentEmailTemplate.error ? (
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
          <p className="text-sm">{currentEmailTemplate.error}</p>
        </div>
      ) : (
        <EmailTemplateForm
        isEdit={true}
          template={{
            name: currentEmailTemplate.data?.name || '',
            slug: currentEmailTemplate.data?.slug || '',
            subject: currentEmailTemplate.data?.subject || '',
            body_html: currentEmailTemplate.data?.body_html || '',
            variables: currentEmailTemplate.data?.variables || '',
            is_active: currentEmailTemplate.data?.is_active === '1',
          }}
          onSubmit={handleUpdate}
          onCancel={() => router.back()}
          loading={updateTemplateLoading}
        />
      )}
    </div>
  )
}