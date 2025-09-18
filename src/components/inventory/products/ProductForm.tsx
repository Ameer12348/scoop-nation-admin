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
import { Product } from './ProductDataTable';

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
// Mock data for sections
export const mockSections: Section[] = [
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

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
    mode: 'add' | 'edit';
    onSubmit: (data: ProductFormData) => void;
    defaultValues?: Product;
}

// Product Form Component
function ProductForm({ mode, onSubmit, defaultValues }: ProductFormProps) {
    const [preview, setPreview] = useState<string | null>(defaultValues?.image || null);
    const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Initialize form with default values
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema) as Resolver<ProductFormData>,
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
    const handleFormSubmit = (data: ProductFormData) => {
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
                <DialogContent  className="max-w-4xl max-h-[80vh] overflow-y-auto className='p-0  min-w-[98vw] sm:min-w-[90vw] md:min-w-[700px] lg:min-w-[900px]'">
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


export default ProductForm