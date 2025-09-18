// app/(admin)/item-management/page.tsx
import React from 'react';
import ProductDataTable from '@/components/inventory/products/ProductDataTable';

export default function ItemManagementPage() {
  return (
    <div className="p-4 md:p-6 2xl:p-10">
      <div className="mx-auto">
        <h2 className="text-2xl font-bold mb-6">Item Management</h2>
        <ProductDataTable />
      </div>
    </div>
  );
}