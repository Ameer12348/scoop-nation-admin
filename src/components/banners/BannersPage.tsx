'use client'
import TableContainerCard from '@/components/common/TableContainerCard'
// import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect } from 'react'
import SearchAndPaginationWrapper from '@/components/common/SearchAndPaginationWrapper'
import BannersTable from '@/components/banners/BannersTable'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchBanners } from '@/store/slices/bannerSlice'

export default function BannersPage() {
    const dispatch  = useAppDispatch()
    const banners = useAppSelector((state) => state.banners.banners)
    useEffect(()=>{
        dispatch(fetchBanners())
    },[])
  return (
    <div>
        {/* <PageBreadcrumb pageTitle="Banners" /> */}
        <TableContainerCard title="Banners" addButton addButtonText='Add Banner' addButtonLink='/banners/create' >
            <SearchAndPaginationWrapper searchValue='' onSearchChange={()=>{}} currentPage={1} totalItems={10} itemsPerPage={10} onPageChange={()=>{}} onItemsPerPageChange={()=>{}}>
                <>
                <BannersTable banners={banners} />
                </>
            </SearchAndPaginationWrapper>
        </TableContainerCard>
    </div>
  )
}
