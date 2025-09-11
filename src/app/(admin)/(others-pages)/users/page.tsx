import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import UsersDataTable from '@/components/users/UsersDataTable'
import React from 'react'
  
const page = () => {
  return (
    <div>
        <PageBreadcrumb pageTitle="Users"/>
        <UsersDataTable/>
    </div>
  )
}

export default page