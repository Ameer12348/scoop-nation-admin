'use client'
import TableContainerCard from '@/components/common/TableContainerCard'
// import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React from 'react'
import SearchAndPaginationWrapper from '@/components/common/SearchAndPaginationWrapper'
import BannersTable from '@/components/banners/BannersTable'

export default function page() {
  return (
    <div>
        {/* <PageBreadcrumb pageTitle="Banners" /> */}
        <TableContainerCard title="Banners" addButton addButtonText='Add Banner' addButtonLink='/banners/create' >
            <SearchAndPaginationWrapper searchValue='' onSearchChange={()=>{}} currentPage={1} totalItems={10} itemsPerPage={10} onPageChange={()=>{}} onItemsPerPageChange={()=>{}}>
                <>
                <BannersTable />
                </>
            </SearchAndPaginationWrapper>
        </TableContainerCard>
    </div>
  )
}
