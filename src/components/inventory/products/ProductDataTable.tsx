// components/inventory/products/ProductDataTable.tsx
'use client'
import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Pencil, X, Plus } from 'lucide-react';
import TableContainerCard from '@/components/common/TableContainerCard';
import SearchAndPaginationWrapper from '@/components/common/SearchAndPaginationWrapper';
import { FaRegEdit } from 'react-icons/fa';
import Image from 'next/image';

// Import ImageGallery component
import ImageGallery, { ImageType } from '@/components/gallery/ImageGallery';
import ProductForm, { mockSections, ProductFormData } from './ProductForm';
// Define the Product type
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice?: number;
    priority: number;
    calories?: number;
    preparationTime?: number;
    stock: number;
    image?: string;
    imageId?: string;
    sections: string[];
    isAvailable: boolean;
}

// Define the Section type


// Mock data for products
const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Sandwiches',
        description: 'Choices & Addons',
        price: 10.25,
        discountPrice: 9.00,
        priority: 8,
        calories: 450,
        preparationTime: 10,
        stock: 50,
        image: '/images/products/sandwich.jpg',
        sections: ['1', '3'],
        isAvailable: true
    },
    {
        id: '2',
        name: 'VADA PAO',
        description: '',
        price: 10.00,
        priority: 5,
        calories: 350,
        preparationTime: 8,
        stock: 30,
        image: '/images/products/vada-pao.jpg',
        sections: ['2'],
        isAvailable: true
    },
    {
        id: '3',
        name: 'halwa poori',
        description: 'spicy',
        price: 10.00,
        priority: 1,
        calories: 500,
        preparationTime: 15,
        stock: 20,
        image: '/images/products/halwa-poori.jpg',
        sections: ['1', '2'],
        isAvailable: true
    }
];



// Define the form schema using Zod


// Main ProductDataTable Component
export default function ProductDataTable() {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showAddFormDialog, setShowAddFormDialog] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    // Filter products based on search term
    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase())
    );

    // Handle adding a new product
    const handleAdd = (data: ProductFormData) => {
        const newProduct: Product = {
            id: Date.now().toString(),
            name: data.name,
            description: data.description,
            price: data.price,
            discountPrice: data.discountPrice,
            priority: data.priority,
            calories: data.calories,
            preparationTime: data.preparationTime,
            stock: data.stock,
            sections: data.sections,
            isAvailable: data.isAvailable,
            image: data.file ? URL.createObjectURL(data.file) : undefined,
            imageId: data.imageId,
        };
        setProducts([...products, newProduct]);
        setShowAddFormDialog(false);
    };

    // Handle editing an existing product
    const handleEdit = (data: ProductFormData) => {
        if (!editProduct) return;
        const updatedProduct: Product = {
            ...editProduct,
            name: data.name,
            description: data.description,
            price: data.price,
            discountPrice: data.discountPrice,
            priority: data.priority,
            calories: data.calories,
            preparationTime: data.preparationTime,
            stock: data.stock,
            sections: data.sections,
            isAvailable: data.isAvailable,
            image: data.file ? URL.createObjectURL(data.file) : editProduct.image,
            imageId: data.imageId || editProduct.imageId,
        };
        setProducts(products.map((p) => (p.id === editProduct.id ? updatedProduct : p)));
        setEditProduct(null);
    };

    // Handle deleting a product
    const handleDelete = (id: string) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    // Get section names for a product
    const getSectionNames = (sectionIds: string[]) => {
        return sectionIds
            .map((id) => mockSections.find((section) => section.id === id)?.name)
            .filter(Boolean)
            .join(', ');
    };

    return (
        <div className="container mx-auto p-4">
            {/* Add Product Dialog */}
            <Dialog open={showAddFormDialog} onOpenChange={() => { setShowAddFormDialog(false) }}>
                <DialogContent className='p-0  min-w-[98vw] sm:min-w-[90vw] md:min-w-[700px] lg:min-w-[900px]'>
                    <div className="max-h-[calc(90vh)] p-5 overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add Product</DialogTitle>
                        </DialogHeader>
                        <ProductForm mode="add" onSubmit={handleAdd} />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Main Table */}
            <TableContainerCard
                title="Products"
                addButton
                addButtonText="Add Product"
                addButtonAction={() => { setShowAddFormDialog(true) }}
            >
                <SearchAndPaginationWrapper
                    searchValue={search}
                    onSearchChange={(e) => setSearch(e)}
                    currentPage={page}
                    totalItems={filteredProducts.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setPage}
                    onItemsPerPageChange={() => { }}
                >
                    {/* Desktop table */}
                    <div className="overflow-x-auto hidden md:block">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100 text-left text-xs md:text-sm">
                                <tr>
                                    <th className="px-4 py-2">Image</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Description</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Discount</th>
                                    <th className="px-4 py-2">Priority</th>
                                    <th className="px-4 py-2">Stock</th>
                                    <th className="px-4 py-2">Sections</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="border-t">
                                        <td className="px-4 py-2">
                                            {product.image && (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-md object-cover"
                                                />
                                            )}
                                        </td>
                                        <td className="px-4 py-2">{product.name}</td>
                                        <td className="px-4 py-2">{product.description}</td>
                                        <td className="px-4 py-2">PKR {product.price.toFixed(2)}</td>
                                        <td className="px-4 py-2">
                                            {product.discountPrice ? `PKR ${product.discountPrice.toFixed(2)}` : '-'}
                                        </td>
                                        <td className="px-4 py-2">{product.priority}</td>
                                        <td className="px-4 py-2">{product.stock}</td>
                                        <td className="px-4 py-2">{getSectionNames(product.sections)}</td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${product.isAvailable
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {product.isAvailable ? 'Available' : 'Unavailable'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setEditProduct(product)}
                                                    className="p-1 text-blue-600 hover:text-blue-800"
                                                >
                                                    <FaRegEdit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1 text-red-600 hover:text-red-800"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile view */}
                    <div className="md:hidden space-y-4">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="border rounded-lg p-4 space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        {product.image && (
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={40}
                                                height={40}
                                                className="rounded-md object-cover"
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-medium">{product.name}</h3>
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
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-1 text-red-600 hover:text-red-800"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="font-medium">Price:</span> PKR {product.price.toFixed(2)}
                                    </div>
                                    <div>
                                        <span className="font-medium">Discount:</span>{' '}
                                        {product.discountPrice ? `PKR ${product.discountPrice.toFixed(2)}` : '-'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Priority:</span> {product.priority}
                                    </div>
                                    <div>
                                        <span className="font-medium">Stock:</span> {product.stock}
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium">Sections:</span> {getSectionNames(product.sections)}
                                    </div>
                                    <div className="col-span-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${product.isAvailable
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {product.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </SearchAndPaginationWrapper>
            </TableContainerCard>

            {/* Edit Product Dialog */}
            <Dialog open={!!editProduct} onOpenChange={() => setEditProduct(null)}>
                <DialogContent className='p-0  min-w-[98vw] sm:min-w-[90vw] md:min-w-[700px] lg:min-w-[900px]'>
                    <div className="max-h-[calc(90vh)] p-5 overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Product</DialogTitle>
                        </DialogHeader>
                        {editProduct && (
                            <ProductForm mode="edit" onSubmit={handleEdit} defaultValues={editProduct} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}