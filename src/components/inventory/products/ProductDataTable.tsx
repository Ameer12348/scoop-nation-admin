// components/inventory/products/ProductDataTable.tsx
'use client'
import { useEffect, useState, } from 'react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Loader, X, } from 'lucide-react';
import TableContainerCard from '@/components/common/TableContainerCard';
import SearchAndPaginationWrapper from '@/components/common/SearchAndPaginationWrapper';
import { FaRegEdit } from 'react-icons/fa';
import Image from 'next/image';

// Import ImageGallery component
import ImageGallery, { ImageType } from '@/components/gallery/ImageGallery';
import ProductForm, { mockSections, ProductFormData, Section } from './ProductForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createProduct, CreateProductPayload, deleteProduct, fetchProducts } from '@/store/slices/productSlice';
import { BASE_URL } from '@/consts';
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
} from "@/components/ui/alert-dialog"
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'sonner';



// Define the Product type
export interface Product {
    id: string;
    title: string;
    slug: string;
    description: string;
    manufacturer: string;
    price: string;
    inStock: string;
    categoryId: string;
    rating?: string;
    discountType: string | null;
    discountValue: string | null;
    originalPrice: string | null;
    discountStartDate: string | null;
    discountEndDate: string | null;
    mainImage: string;
    variants: Array<{
        id?: string;
        name: string;
        value: string;
        price: string;
        inStock: string;
        discountType: string | null;
        discountValue: string | null;
        originalPrice: string | null;
        discountStartDate: string | null;
        discountEndDate: string | null;
    }>;
    media?: any[];
}






// Define the form schema using Zod


// Main ProductDataTable Component
export default function ProductDataTable() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showAddFormDialog, setShowAddFormDialog] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const { products, pagination, loading: productsFetchloading, error: productsFetcherror, deleteProduct: { loading: deleteProductLoading } } = useAppSelector(x => x.products)
    const dispatch = useAppDispatch()


    // create product 
    const { isPending: addProductLoading, mutate: addProduct } = useMutation({
        mutationFn: async (formData: FormData) => {
            console.log('formData', formData);
            const res = await api.post('/api/admin/products', formData, {
                headers: {
                    'Content-Type': undefined, // Let browser set multipart/form-data
                },
            })
            return res.data
        },
        onSuccess: (data) => {
            // Invalidate the 'todos' query to refetch the updated list
            if (data.success) {
                toast.success(data?.message || 'Product added successfully')
                setShowAddFormDialog(false);
                setEditProduct(data.data || null)
                handleFetchProducts()
            }
            else {
                toast.error(data?.error || data?.message || 'Failed to add product')
            }
        },
        onError: (error) => {
            console.error('Mutation failed:', error);
            toast.error(error?.message || 'Failed to add product');
        },
    });
    //update product
    const { isPending: updateProductLoading, mutate: updateProduct } = useMutation({
        mutationFn: async ({formData,productId}:{formData: FormData,productId:string|number}) => {
            console.log('formData', formData);
            const res = await api.post(`/api/admin/products/update?productId=${productId}`, formData, {
                headers: {
                    'Content-Type': undefined, // Let browser set multipart/form-data
                },
            })
            return res.data
        },
        onSuccess: (data) => {
            // Invalidate the 'todos' query to refetch the updated list
            if (data.success) {
                toast.success(data?.message || 'Product Updated successfully')
                setEditProduct(data.data || null)
                setEditProduct(null)
                handleFetchProducts()
            }
            else {
                toast.error(data?.error || data?.message || 'Failed to update product')
            }
        },
        onError: (error) => {
            console.error('Mutation failed:', error);
            toast.error(error?.message || 'Failed to update product');
        },
    });



    // Handle adding a new product
    const handleAdd = (data: ProductFormData) => {
        console.log('handle add',data);
        
        const formData = new FormData();
        for (const key in data) {
            const value = data[key as keyof ProductFormData];
            if (key === 'variants' && value && Array.isArray(value) && value.length > 0) {
                formData.append('variants', JSON.stringify(value));
            } else if (key === 'file' && value) {
                formData.append('file', data.file as File);
            } else if (value !== undefined && value !== null) {
                formData.append(key, value as any);
            }
        }
        addProduct(formData)
        // dispatch(createProduct(data as CreateProductPayload)).then((res) => {
        //     console.log('res', res);
        //     if (res.meta.requestStatus === 'fulfilled') {
        //         setShowAddFormDialog(false)
        //     }
        // })
    };

    // Handle editing an existing product
    const handleEdit = (data: ProductFormData) => {
   const formData = new FormData();
        for (const key in data) {
            const value = data[key as keyof ProductFormData];
            if (key === 'variants' && value && Array.isArray(value) && value.length > 0) {
                formData.append('variants', JSON.stringify(value));
            } else if (key === 'file' && value) {
                formData.append('file', data.file as File);
            }
            else if (key === 'media' && value) {
                formData.append('media', JSON.stringify(data.media));
            }
            else if (value !== undefined && value !== null) {
                formData.append(key, value as any);
            }
        }
        updateProduct({formData,productId:editProduct?.id as string})
    };

    // Handle deleting a product
    const handleDelete = (id: string) => {
        dispatch(deleteProduct(id)).then((res) => {
            if (res.meta.requestStatus === 'fulfilled') {
                handleFetchProducts()
            }
        })
    };


    const handleFetchProducts = () => {
        const payload: { search?: string, page?: number, limit?: number } = { page, limit: itemsPerPage, }
        if (search) {
            payload.search = search
        }
        dispatch(fetchProducts(payload))
    }
    useEffect(() => {
        handleFetchProducts()
    }, [search, page, itemsPerPage])



    return (
        <div className="">
            {/* Add Product Dialog */}
            <Dialog open={showAddFormDialog} onOpenChange={() => { setShowAddFormDialog(false) }}>
                <DialogContent className='p-0  min-w-[98vw] sm:min-w-[90vw] md:min-w-[700px] lg:min-w-[900px]'>
                    <div className="max-h-[calc(90vh)] p-5 overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add Product</DialogTitle>
                        </DialogHeader>
                        <ProductForm saving={addProductLoading} mode="add" onSubmit={handleAdd} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Main Table */}
            <TableContainerCard
                title="Products"
                addButton
                addButtonText="Add Product"
                addButtonAction={() => { setShowAddFormDialog(true) }}
                hasRefreshButton={true}
                refreshButtonAction={handleFetchProducts}
            >
                <SearchAndPaginationWrapper
                    searchValue={search}
                    onSearchChange={(e) => { setSearch(e); }}
                    currentPage={page}
                    totalItems={pagination?.total ? parseInt(pagination.total) : 0}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setPage}
                    onItemsPerPageChange={(perPage) => { setItemsPerPage(perPage) }}
                >


                    {
                        productsFetchloading ? <div className="text-center text-gray-500 py-7 flex justify-center items-center">
                            <Loader className="h-8 w-8 animate-spin" />
                        </div> : productsFetcherror ? <div className="text-center text-red-500">
                            {productsFetcherror}
                        </div> :
                            products.length > 0 ?



                                (<>
                                    {/* Desktop table */}
                                    <div className="overflow-x-auto hidden md:block">
                                        <table className="min-w-full border text-sm">
                                            <thead className="bg-gray-100 text-left text-xs md:text-sm">
                                                <tr>
                                                    <th className="px-4 py-2">Image</th>
                                                    <th className="px-4 py-2">Title</th>
                                                    <th className="px-4 py-2">Description</th>
                                                    <th className="px-4 py-2">Price</th>
                                                    <th className="px-4 py-2">Stock</th>
                                                    <th className="px-4 py-2">Manufacturer</th>
                                                    <th className="px-4 py-2">Rating</th>
                                                    <th className="px-4 py-2">Variants</th>
                                                    <th className="px-4 py-2">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.map((product) => (
                                                    <tr key={product.id} className="border-t">
                                                        <td className="px-4 py-2">
                                                            {product.mainImage && (
                                                                <img
                                                                    src={`${BASE_URL}/` + product.mainImage}
                                                                    alt={product.title}
                                                                    width={40}
                                                                    height={40}
                                                                    className="rounded-md object-cover"
                                                                />
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-2">{product.title}</td>
                                                        <td className="px-4 py-2">{product.description}</td>
                                                        <td className="px-4 py-2">PKR {product.price}</td>
                                                        <td className="px-4 py-2">{product.inStock}</td>
                                                        <td className="px-4 py-2">{product.manufacturer}</td>
                                                        <td className="px-4 py-2">{product.rating || '-'}</td>
                                                        <td className="px-4 py-2">
                                                            {product.variants.map(v => v.value).join(', ')}
                                                        </td>
                                                        <td className="px-4 py-2">
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => setEditProduct(product)}
                                                                    className="p-1 text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <FaRegEdit size={16} />
                                                                </button>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger asChild>
                                                                        <button
                                                                            className="p-1 text-red-600 hover:text-red-800"
                                                                        >
                                                                            {
                                                                                deleteProductLoading ? <Loader className={`h-4 w-4 animate-spin `} /> : <X size={16} />
                                                                            }
                                                                        </button>
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle>Are you absolutely sure You Want to Delete {product.title} ?</AlertDialogTitle>
                                                                            {/* <AlertDialogDescription>
                                                                                This action cannot be undone. This will permanently delete your
                                                                                account and remove your data from our servers.
                                                                            </AlertDialogDescription> */}
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                            <AlertDialogAction onClick={() => handleDelete(product.id)}
                                                                            >Continue</AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile view */}
                                    <div className="md:hidden space-y-4">
                                        {products.map((product) => (
                                            <div key={product.id} className="border rounded-lg p-4 space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-3">
                                                        {product.mainImage && (
                                                            <img
                                                                src={`${BASE_URL}/` + product.mainImage}
                                                                alt={product.title}
                                                                width={40}
                                                                height={40}
                                                                className="rounded-md object-cover"
                                                            />
                                                        )}
                                                        <div>
                                                            <h3 className="font-medium">{product.title}</h3>
                                                            <p className="text-sm text-gray-500">{product.description}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => setEditProduct(product)}
                                                            className="p-1 text-blue-600 hover:text-blue-800"
                                                        >
                                                            <FaRegEdit size={16} />
                                                        </button>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <button
                                                                    className="p-1 text-red-600 hover:text-red-800"
                                                                >
                                                                    {
                                                                        deleteProductLoading ? <Loader className={`h-4 w-4 animate-spin `} /> : <X size={16} />
                                                                    }


                                                                </button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure You Want to Delete {product.title} ?</AlertDialogTitle>
                                                                    {/* <AlertDialogDescription>
                                                                                This action cannot be undone. This will permanently delete your
                                                                                account and remove your data from our servers.
                                                                            </AlertDialogDescription> */}
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(product.id)}
                                                                    >Continue</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="font-medium">Price:</span> PKR {product.price}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Stock:</span> {product.inStock}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Manufacturer:</span> {product.manufacturer}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Rating:</span> {product.rating || '-'}
                                                    </div>
                                                    {product.variants.length > 0 && (
                                                        <div className="col-span-2">
                                                            <span className="font-medium">Variants:</span>{' '}
                                                            {product.variants.map(v => v.value).join(', ')}
                                                        </div>
                                                    )}
                                                    {product.discountValue && (
                                                        <div className="col-span-2">
                                                            <span className="font-medium">Discount:</span>{' '}
                                                            {product.discountType === 'percentage' ? `${product.discountValue}%` : `PKR ${product.discountValue}`}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>)
                                :
                                <div className="text-center text-gray-500 py-7 flex justify-center items-center">
                                    No Products found
                                </div>
                    }
                </SearchAndPaginationWrapper>
            </TableContainerCard>

            {/* Edit Product Dialog */}
            <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
                <DialogContent className='p-0  min-w-[98vw] sm:min-w-[90vw] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1100px]'>
                    <div className="max-h-[calc(90vh)] p-5 overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        {editProduct && (
                            <ProductForm mode="edit" onSubmit={handleEdit} saving={updateProductLoading} productId={editProduct.id} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}