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

// Define the Product type
interface Product {
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
interface Section {
    id: string;
    name: string;
    description: string;
    priority: number;
    availableFrom: string;
    availableTo: string;
    appOnly: boolean;
    days: string[];
    image?: string;
    imageId?: string;
}

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

// Mock data for sections
const mockSections: Section[] = [
    {
        id: '1',
        name: 'Breakfast',
        description: 'Morning items',
        priority: 1,
        availableFrom: '06:00',
        availableTo: '11:00',
        appOnly: false,
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        image: '/images/sections/breakfast.jpg'
    },
    {
        id: '2',
        name: 'Lunch',
        description: 'Afternoon items',
        priority: 2,
        availableFrom: '11:00',
        availableTo: '15:00',
        appOnly: false,
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        image: '/images/sections/lunch.jpg'
    },
    {
        id: '3',
        name: 'Dinner',
        description: 'Evening items',
        priority: 3,
        availableFrom: '18:00',
        availableTo: '23:00',
        appOnly: true,
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        image: '/images/sections/dinner.jpg'
    }
];

// Define the form schema using Zod
const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
    price: z.coerce.number().min(0, 'Price must be at least 0'),
    discountPrice: z.coerce.number().min(0, 'Discount price must be at least 0').optional(),
    priority: z.coerce.number().min(1, 'Priority must be at least 1'),
    calories: z.coerce.number().min(0, 'Calories must be at least 0').optional(),
    preparationTime: z.coerce.number().min(0, 'Preparation time must be at least 0').optional(),
    stock: z.coerce.number().min(0, 'Stock must be at least 0'),
    sections: z.array(z.string()).min(1, 'Select at least one section'),
    isAvailable: z.boolean(),
    file: z.instanceof(File).optional(),
    imageId: z.string().optional(),
}).refine((data) => data.file || data.imageId, {
    message: 'An image is required',
    path: ['image'],
});

type FormData = z.infer<typeof productSchema>;

interface ProductFormProps {
    mode: 'add' | 'edit';
    onSubmit: (data: FormData) => void;
    defaultValues?: Product;
}

// Product Form Component
function ProductForm({ mode, onSubmit, defaultValues }: ProductFormProps) {
    const [preview, setPreview] = useState<string | null>(defaultValues?.image || null);
    const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Initialize form with default values
    const form = useForm<FormData>({
        resolver: zodResolver(productSchema) as Resolver<FormData>,
        defaultValues: {
            name: defaultValues?.name || '',
            description: defaultValues?.description || '',
            price: defaultValues?.price || 0,
            discountPrice: defaultValues?.discountPrice || 0,
            priority: defaultValues?.priority || 1,
            calories: defaultValues?.calories || 0,
            preparationTime: defaultValues?.preparationTime || 0,
            stock: defaultValues?.stock || 0,
            sections: defaultValues?.sections || [],
            isAvailable: defaultValues?.isAvailable ?? true,
            imageId: defaultValues?.imageId || undefined,
        },
    });

    // Handle form submission
    const handleFormSubmit = (data: FormData) => {
        onSubmit(data);
    };

    // Handle drag and drop for image upload
    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith('image/')) {
                form.setValue('file', file);
                form.setValue('imageId', undefined);
                setPreview(URL.createObjectURL(file));
            }
        },
        [form]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                    {/* --- Name Field --- */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Description Field --- */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Price Field --- */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Discount Price Field --- */}
                    <FormField
                        control={form.control}
                        name="discountPrice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Discount Price (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Priority Field --- */}
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Calories Field --- */}
                    <FormField
                        control={form.control}
                        name="calories"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Calories (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Preparation Time Field --- */}
                    <FormField
                        control={form.control}
                        name="preparationTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preparation Time (mins)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Stock Field --- */}
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Sections Checkboxes --- */}
                    <FormField
                        control={form.control}
                        name="sections"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sections</FormLabel>
                                <div className="space-y-2">
                                    {mockSections.map((section) => (
                                        <div key={section.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={section.id}
                                                checked={field.value?.includes(section.id)}
                                                onCheckedChange={(checked) => {
                                                    const newSections = checked
                                                        ? [...(field.value ?? []), section.id]
                                                        : field.value?.filter((id: string) => id !== section.id) ?? [];
                                                    field.onChange(newSections);
                                                }}
                                            />
                                            <label htmlFor={section.id}>{section.name}</label>
                                        </div>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Available Switch --- */}
                    <FormField
                        control={form.control}
                        name="isAvailable"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <FormLabel>Available</FormLabel>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* --- Image Upload --- */}
                    <FormItem>
                        <FormLabel>Image</FormLabel>
                        {preview && <Image width={140} height={140} src={preview} alt="Preview" className="mt-2 max-h-32 mx-auto" />}
                        <div className="flex space-x-4 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('product-file-upload')?.click()}
                            >
                                Browse
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => setIsGalleryOpen(true)}>
                                Select From Gallery
                            </Button>
                        </div>
                        <div
                            className={`border-2 border-dashed rounded-md p-4 text-center mt-2 ${isDragging ? 'border-primary bg-primary/10' : 'border-muted'}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <p>Drag and drop image here</p>
                        </div>
                        <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            id="product-file-upload"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    form.setValue('file', file);
                                    form.setValue('imageId', undefined);
                                    setPreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            Note: Image Resolution ≤ 400x400 px, Size ≤ 200 KB
                        </p>
                        <FormMessage />
                    </FormItem>

                    <Button type="submit">{mode === 'add' ? 'Add Product' : 'Save Changes'}</Button>
                </form>
            </Form>

            {/* Gallery Dialog */}
            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <ImageGallery
                        // onSelect={(image) => {
                        //     setSelectedImage(image);
                        //     setPreview(image.url);
                        //     form.setValue('imageId', image.id);
                        //     form.setValue('file', undefined);
                        //     setIsGalleryOpen(false);
                        // }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}

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
    const handleAdd = (data: FormData) => {
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
    const handleEdit = (data: FormData) => {
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
                <DialogContent>
                    <div className="max-h-[calc(90vh-48px)] overflow-y-auto">
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
                <DialogContent>
                    <div className="max-h-[calc(90vh-48px)] overflow-y-auto">
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