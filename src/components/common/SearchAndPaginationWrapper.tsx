'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface SearchAndPaginationWrapperProps {
  children: React.ReactNode
  // Search props
  searchValue: string
  onSearchChange: (value: string) => void
  // Pagination props
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (size: number) => void
}

export default function SearchAndPaginationWrapper({
  children,
  searchValue,
  onSearchChange,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: SearchAndPaginationWrapperProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  const rangeText = `${startItem}-${endItem} of ${totalItems}`

  return (
    <div className="flex flex-col space-y-6">
      {/* Top: Search - responsive positioning and width */}
      <div className="p-4 flex justify-center md:justify-end">
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full max-w-md dark:text-white"
        />
      </div>

      {/* Center: Content */}
      <div className="flex-1">{children}</div>

      {/* Bottom: Items per page, range, and pagination - responsive layout */}
      {totalItems > 0 && (
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
            <span className="text-center sm:text-left whitespace-nowrap dark:text-white">{rangeText}</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
              
            >
              <SelectTrigger className="w-full sm:w-[100px] dark:bg-[#101828] dark:text-white">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent className='bg-white dark:bg-[#101828] dark:text-white'>
                <SelectItem className='cursor-pointer' value="5">5 per page</SelectItem>
                <SelectItem className='cursor-pointer' value="10">10 per page</SelectItem>
                <SelectItem className='cursor-pointer' value="20">20 per page</SelectItem>
                <SelectItem className='cursor-pointer' value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination className="justify-center sm:justify-end dark:text-white">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              <PaginationItem>
               <span className='font-bold '>
                {currentPage}
               </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}