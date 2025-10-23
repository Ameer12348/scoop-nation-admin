'use client'
import { useSearchParams } from 'next/navigation'
import EditEmailTemplate from '@/components/emailTemplates/EditEmailTemplate'
import { Suspense } from 'react'

function EditEmailTemplateClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  return (
    <div>
      <EditEmailTemplate id={id || ''} />
    </div>
  )
}

export default function EditEmailTemplateWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditEmailTemplateClient />
    </Suspense>
  )
}