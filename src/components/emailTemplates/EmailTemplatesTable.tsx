'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { EmailTemplate, deleteEmailTemplate } from '@/store/slices/emailTemplateSlice'
import Link from 'next/link'
import { FaRegEdit } from 'react-icons/fa'
import { Loader, X } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

type EmailTemplatesTableProps = {
  emailTemplates: EmailTemplate[]
}

export default function EmailTemplatesTable({ emailTemplates }: EmailTemplatesTableProps) {
  const dispatch = useAppDispatch()
  const { deleteEmailTemplate: { loading: deleteTemplateLoading } } = useAppSelector(state => state.emailTemplates)

  // const handleDelete = (id: string) => {
  //   dispatch(deleteEmailTemplate(id))
  // }

  return (
    <div className="w-full">
      {/* Desktop view */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left text-xs md:text-sm">
            <tr>
              {/* <th className="px-3 py-2 border">Name</th> */}
              <th className="px-3 py-2 border">Trigger Event</th>
              <th className="px-3 py-2 border">Email Subject</th>
              <th className="px-3 py-2 border">Active</th>
              <th className="px-3 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {emailTemplates.map((template) => (
              <tr key={template.id} className="border-b hover:bg-gray-50 transition">
                {/* <td className="px-3 py-2 border">{template.name}</td> */}
                <td className="px-3 py-2 border">{template.slug}</td>
                <td className="px-3 py-2 border">{template.subject}</td>
                <td className="px-3 py-2 border">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      template.is_active === '1'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {template.is_active === '1' ? 'Active' : 'In-Active'}
                  </span>
                </td>
                <td className="px-3 py-2 border text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Link href={`/email_templates/edit?id=${template.id}`} className="inline-block p-1 text-blue-600 hover:text-blue-800">
                      <FaRegEdit className="text-lg" />
                    </Link>
                    {/* <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="p-1 text-red-600 hover:text-red-800">
                          {deleteTemplateLoading ? <Loader className="h-4 w-4 animate-spin" /> : <X size={16} />}
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to delete {template.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the email template.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(template.id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="grid gap-4 mt-6 md:hidden p-3">
        {emailTemplates.map((template) => (
          <div key={template.id} className="border rounded-lg p-3 shadow-sm bg-white">
            <div className="flex items-center justify-between">
              {/* <div className="text-sm font-medium">{template.name}</div> */}
              <div className="flex space-x-2">
                <Link href={`/email_templates/edit?id=${template.id}`} className="inline-block p-1 text-blue-600 hover:text-blue-800">
                  <FaRegEdit className="text-lg" />
                </Link>
                {/* <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      {deleteTemplateLoading ? <Loader className="h-4 w-4 animate-spin" /> : <X size={16} />}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete {template.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the email template.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(template.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog> */}
              </div>
            </div>
            <div className="mt-2 text-sm space-y-1">
              <p><span className="font-medium">Slug:</span> {template.slug}</p>
              <p><span className="font-medium">Subject:</span> {template.subject}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    template.is_active === '1'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {template.is_active === '1' ? 'Active' : 'In-Active'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}