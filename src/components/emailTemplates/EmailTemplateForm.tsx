'use client'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader } from 'lucide-react'
import dynamic from 'next/dynamic'
// import 'jodit/build/jodit.min.css'
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

interface EmailTemplate {
  id?: string | number
  name: string
  slug: string
  subject: string
  body_html: string
  variables?: string
  is_active: boolean
}

type NewType = {
  name: string
  slug: string
  subject: string
  body_html: string
  variables?: string
  is_active: boolean
}

export type EmailTemplateFormData = NewType

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  subject: z.string().min(1, 'Subject is required'),
  body_html: z.string().min(1, 'Body HTML is required'),
  variables: z.string().optional(),
  is_active: z.boolean(),
})

export function EmailTemplateForm({
  template,
  onSubmit,
  onCancel,
  loading,
  isEdit
}: {
  template?: Partial<EmailTemplate>
  onSubmit: (data: EmailTemplateFormData) => void
  onCancel: () => void
  loading?: boolean
  isEdit?:boolean
}) {
  const form = useForm<EmailTemplateFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      slug: '',
      subject: '',
      body_html: '',
      variables: '',
      is_active: true,
      ...template,
    },
  })

  const { register, handleSubmit, formState: { errors }, setValue, reset } = form

  React.useEffect(() => {
    if (template) {
      reset({
        ...template,
        is_active: template.is_active ?? true,
      } as EmailTemplateFormData)
    }
  }, [template, reset])

  const onFormSubmit = (values: EmailTemplateFormData) => {
    onSubmit(values)
  }

  return (
    <div className="flex h-full flex-col space-y-6 bg-background p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{isEdit ? 'Edit Email Template' : 'Create Email Template'}</h2>
        </div>
      </div>

      <Separator />

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Template Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {
              !isEdit && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" {...register('slug')} />
                    {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
                  </div></>
              )
            }
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input id="subject" {...register('subject')} />
              {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="body_html">Body HTML</Label>
              <JoditEditor
                value={form.watch('body_html')}
                onBlur={(newContent) => setValue('body_html', newContent, { shouldValidate: true })}
                onChange={(newContent) => { }}
                config={{
                  readonly: false,
                  placeholder: 'Enter email content...',
                  height: 400,
                }}
                className='w-full'
              />
              {errors.body_html && <p className="text-sm text-destructive">{errors.body_html.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="variables">Variables (JSON format, optional)</Label>
              <Input readOnly={isEdit} id="variables" {...register('variables')} placeholder='e.g., {"name": "User Name"}' />
              {errors.variables && <p className="text-sm text-destructive">{errors.variables.message}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={form.watch('is_active')}
                onCheckedChange={(checked) => setValue('is_active', checked as boolean)}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active Template
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}