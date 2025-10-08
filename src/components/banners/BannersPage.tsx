'use client'
import TableContainerCard from '@/components/common/TableContainerCard'
// import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import React, { useEffect, useState } from 'react'
import SearchAndPaginationWrapper from '@/components/common/SearchAndPaginationWrapper'
import BannersTable from '@/components/banners/BannersTable'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchBanners } from '@/store/slices/bannerSlice'
import { Loader } from 'lucide-react'

export default function BannersPage() {
    const dispatch = useAppDispatch()
    const { banners, loading: bannersLoading, error: bannersError, pagination } = useAppSelector((state) => state.banners)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')


    const handleFetchBanners = () => {
        const payload: { page: number, limit: number, search?: string } = {
            page: currentPage,
            limit: itemsPerPage,
        }
        if (searchTerm) {
            payload.search = searchTerm
        }

        dispatch(fetchBanners(payload))

    }
    useEffect(() => {
        handleFetchBanners()
    }, [currentPage, itemsPerPage, searchTerm])

    return (
        <div>
            {/* <PageBreadcrumb pageTitle="Banners" /> */}
            <TableContainerCard title="Banners" addButton addButtonText='Add Banner' addButtonLink='/banners/create' hasRefreshButton={true} refreshButtonAction={handleFetchBanners} >
                <SearchAndPaginationWrapper searchValue={searchTerm} onSearchChange={(text) => { setSearchTerm(text) }} currentPage={currentPage} totalItems={parseInt(pagination?.total || '0') || 0} itemsPerPage={itemsPerPage} onPageChange={(page) => { setCurrentPage(page) }} onItemsPerPageChange={(perPage) => { setItemsPerPage(perPage) }}>
                    <>
                        {
                            bannersLoading ? <div className="text-center text-gray-500 py-7 flex justify-center items-center">
                                <Loader className="h-8 w-8 animate-spin" />
                            </div> : bannersError ? <div className="text-center text-red-500">
                                {bannersError}
                            </div> :
                                banners.length > 0 ? <BannersTable banners={banners} />
                                    :
                                    <div className="text-center text-gray-500 py-7 flex justify-center items-center">
                                        No Banners found
                                    </div>
                        }
                    </>
                </SearchAndPaginationWrapper>
            </TableContainerCard>
        </div>
    )
}
