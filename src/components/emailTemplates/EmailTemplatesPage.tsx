'use client'
import TableContainerCard from '@/components/common/TableContainerCard'
import React, { useEffect, useState } from 'react'
import SearchAndPaginationWrapper from '@/components/common/SearchAndPaginationWrapper'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchEmailTemplates } from '@/store/slices/emailTemplateSlice'
import { Loader } from 'lucide-react'
import EmailTemplatesTable from './EmailTemplatesTable'

export default function EmailTemplatesPage() {
  const dispatch = useAppDispatch()
  const { emailTemplates, loading: templatesLoading, error: templatesError, pagination } = useAppSelector((state) => state.emailTemplates)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')

  const handleFetchEmailTemplates = () => {
    const payload: { page: number, limit: number, search?: string } = {
      page: currentPage,
      limit: itemsPerPage,
    }
    if (searchTerm) {
      payload.search = searchTerm
    }

    dispatch(fetchEmailTemplates(payload))
  }

  useEffect(() => {
    handleFetchEmailTemplates()
  }, [currentPage, itemsPerPage, searchTerm])

  return (
    <div>
      <TableContainerCard 
        title="Email Templates" 
        addButton 
        addButtonText='Add Email Template' 
        addButtonLink='/email_templates/create' 
        hasRefreshButton={true} 
        refreshButtonAction={handleFetchEmailTemplates}
      >
        <SearchAndPaginationWrapper 
          searchValue={searchTerm} 
          onSearchChange={(text) => setSearchTerm(text)} 
          currentPage={currentPage} 
          totalItems={parseInt(pagination?.total || '0') || 0} 
          itemsPerPage={itemsPerPage} 
          onPageChange={(page) => setCurrentPage(page)} 
          onItemsPerPageChange={(perPage) => setItemsPerPage(perPage)}
        >
          <>
            {templatesLoading ? (
              <div className="text-center text-gray-500 py-7 flex justify-center items-center">
                <Loader className="h-8 w-8 animate-spin" />
              </div>
            ) : templatesError ? (
              <div className="text-center text-red-500">
                {templatesError}
              </div>
            ) : emailTemplates.length > 0 ? (
              <EmailTemplatesTable emailTemplates={emailTemplates} />
            ) : (
              <div className="text-center text-gray-500 py-7 flex justify-center items-center">
                No Email Templates found
              </div>
            )}
          </>
        </SearchAndPaginationWrapper>
      </TableContainerCard>
    </div>
  )
}