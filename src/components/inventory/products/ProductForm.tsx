'use client'
import { useEffect, useState } from 'react';
import { json, z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Assuming you have Shadcn Select
import Dropzone from '@/components/form/form-elements/DropZone';
import { Pencil, X, Plus, Trash, Loader } from 'lucide-react';
import TableContainerCard from '@/components/common/TableContainerCard';
import SearchAndPaginationWrapper from '@/components/common/SearchAndPaginationWrapper';
import { FaRegEdit } from 'react-icons/fa';
import Image from 'next/image';

// Import ImageGallery component
import ImageGallery, { ImageType } from '@/components/gallery/ImageGallery';
import { Product } from './ProductDataTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import ProductFormSkeleton from './ProductFormSkeleton';
import { fetchProductDetails } from '@/store/slices/productSlice';
import { error } from 'console';
import { BASE_URL } from '@/consts';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

// Define section interface
export interface Section {
    id: string;
    name: string;
}



// Product schema based on the provided data structure
const variantSchema = z.object({
    name: z.string().min(1, 'Variant name is required'),
    value: z.string().min(1, 'Variant value is required'),
    price: z.string().min(1, 'Price is required'),
    inStock: z.string().min(1, 'Stock is required'),
    // discountType: z.string().nullable(),
    // discountValue: z.string().nullable(),
    originalPrice: z.string().nullable(),
    // discountStartDate: z.string().nullable(),
    // discountEndDate: z.string().nullable(),
});

const productSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.string().min(1, 'Price is required'),
    categoryId: z.string().min(1, 'Category is required'),
    manufacturer: z.string().optional(),
    priority:z.string().optional(),
    is_available: z.boolean().optional(),
    // slug: z.string().optional(),
    inStock: z.string().min(1, 'Stock is required'),
    // rating: z.string().optional(),
    // discountType: z.string().nullable(),
    // discountValue: z.string().nullable(),
    originalPrice: z.string().nullable(),
    // discountStartDate: z.string().nullable(),
    // discountEndDate: z.string().nullable(),
    variants: z.array(variantSchema).min(1, 'At least one variant is required'),
    media: z.array(z.any()).optional(), 
    file:z.instanceof(File).optional()
})  .superRefine((data, ctx) => {
        if (data.file === undefined && data.media?.length === 0  ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'At least one image must be uploaded',
                path: ['file'],
            });
        }
    });

export type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
    mode: 'add' | 'edit';
    onSubmit: (data: ProductFormData) => void;
    defaultValues?: Partial<ProductFormData>;
    productId?: string | number; // Add productId prop for edit mode
    saving?:boolean,
    showDialog:boolean,
    setShowDialog: (open: boolean) => void;


}

function ProductForm({ mode, onSubmit, defaultValues,productId ,saving, showDialog, setShowDialog }: ProductFormProps) {
    const [mediaFiles, setMediaFiles] = useState<File | null>(null);
    const [mainImage, setMainImage] = useState<File | null>(null);
    const {detailsLoading,productDetails,detailsError} = useAppSelector(state=>state.products)
    const dispatch = useAppDispatch()
    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: defaultValues?.title || '',
            // slug: defaultValues?.slug || '',
            description: defaultValues?.description || '',
            manufacturer: defaultValues?.manufacturer || '',
            priority: defaultValues?.priority || '0',
            price: defaultValues?.price || '',
            inStock: defaultValues?.inStock || '',
            categoryId: defaultValues?.categoryId || '',
            is_available: defaultValues?.is_available || true,
            // rating: defaultValues?.rating || '0',
            // discountType: defaultValues?.discountType || null,
            // discountValue: defaultValues?.discountValue || null,
            originalPrice: defaultValues?.originalPrice || null,
            // discountStartDate: defaultValues?.discountStartDate || null,
            // discountEndDate: defaultValues?.discountEndDate || null,
            variants: defaultValues?.variants || [{
                name: 'size',
                value: '',
                price: '',
                inStock: '',
                // discountType: null,
                // discountValue: null,
                originalPrice: null,
                // discountStartDate: null,
                // discountEndDate: null,
            }],
            media: [],
            file:undefined
        },
    });

    // Fetch categories
    const { data: categoriesData, isLoading, refetch: refetchCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/api/admin/categories', {
                params: {
                    page: 1,
                    limit: 1000000,
                },
            });
            return res.data;
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "variants"
    });

    // Watch media field to trigger re-renders when it changes
    const mediaWatch = form.watch('media');

    const handleMediaUpload = (file: File) => {
        console.log('Uploaded file:', file);
        const newFiles = file;
        setMediaFiles(file);
        form.setValue('file', newFiles); // Sync to form (as URLs for now)
    };

    const removeMedia = () => {
        // const newFiles = mediaFiles.filter((_, i) => i !== index);
        setMediaFiles(null);
        // form.setValue('media', newFiles.map(f => URL.createObjectURL(f)));
        form.reset({file:undefined});
    };

    const handleSubmit = (data: ProductFormData) => {
        // Here you would typically handle the file uploads first (e.g., to a server)
        // Then combine the form data with the uploaded file URLs
        onSubmit(data);
    };

    const addVariant = () => {
        append({
            name: '',
            value: '',
            price: '',
            inStock: '',
            // discountType: null,
            // discountValue: null,
            originalPrice: null,
            // discountStartDate: null,
            // discountEndDate: null,
        });
    };


    useEffect(()=>{  
        if (mode == 'edit' && productDetails){
            form.reset({
                title: productDetails?.title || '',
                // slug: productDetails?.slug || '',
                description: productDetails?.description || '',
                manufacturer: productDetails?.manufacturer || '',
                price: productDetails?.price || '',
                priority: productDetails?.priority as string || '0',
                inStock: productDetails?.inStock || '',
                categoryId: productDetails?.categoryId || '',
                // rating: productDetails?.rating || '0',
                // discountType: productDetails?.discountType || null,
                // discountValue: productDetails?.discountValue || null,
                originalPrice: productDetails?.originalPrice || null,
                is_available: typeof productDetails?.is_available === 'boolean' ? productDetails?.is_available : productDetails?.is_available == 1 ? true : false,
                // discountStartDate: productDetails?.discountStartDate || null,
                // discountEndDate: productDetails?.discountEndDate || null,
                variants: productDetails?.variants.length > 0 ? productDetails?.variants.map(variant => ({
                    name: variant?.name || '',
                    value: variant?.value || '',
                    price: variant?.price || '',
                    inStock: variant?.inStock || '',
                    discountType: variant?.discountType || null,
                    discountValue: variant?.discountValue || null,
                    originalPrice: variant?.originalPrice || null,
                    discountStartDate: variant?.discountStartDate || null,
                    discountEndDate: variant?.discountEndDate || null,
                })) : [{
                    name: 'size',
                    value: '',
                    price: '',
                    inStock: '',
                    discountType: null,
                    discountValue: null,
                    originalPrice: null,
                    discountStartDate: null,
                    discountEndDate: null,
                }],
                media: productDetails?.media || []
            }
            );
        }
    },[productDetails])

    useEffect(()=>{
        if (mode == 'edit' && productId){
            dispatch(fetchProductDetails(productId))
        }
    },[productId,mode]);


    if (mode == 'edit' && detailsLoading){
        return <ProductFormSkeleton />
    }
    if (mode == 'edit' && detailsError){
        return <div>Error loading product details: {detailsError}</div>
    }
    
    return (
        <ConfirmDialog title={mode =='add' ? 'Add Product' :'Edit Product'} open={showDialog} setOpen={setShowDialog} loading={saving} onConfirm={form.handleSubmit(handleSubmit)}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    {/* Basic Information */}
                    <div className="space-y-4 grid grid-cols-2 gap-2">
                        <h3 className="text-lg font-semibold col-span-full">Basic Information</h3>
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug (Optional)</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

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

                        <FormField
                            control={form.control}
                            name="manufacturer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manufacturer (Optional)</FormLabel>
                                    <FormControl>
                                        <Input type='text' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Priority (Optional)</FormLabel>
                                    <FormControl>
                                        <Input type='number' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categoriesData?.data?.map((section) => (
                                                <SelectItem key={section?.id} value={section?.id}>
                                                    {section?.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating (optional)</FormLabel>
                                    <FormControl>
                                        <Input  type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                    </div>

                    {/* Main Product Details */}
                    <div className="space-y-4   grid grid-cols-2 sm:grid-cols-3  gap-2">
                        <h3 className="text-lg font-semibold col-span-full">Pricing and Stock</h3>
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="inStock"
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

                        {/* Nullable Discount Fields for Product */}
                        {/* <FormField
                            control={form.control}
                            name="discountType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Type (optional)</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        {/* <FormField
                            control={form.control}
                            name="discountValue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Value (optional)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        <FormField
                            control={form.control}
                            name="originalPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Original Price (optional)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
    {/* 
                        <FormField
                            control={form.control}
                            name="discountStartDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount Start Date (optional)</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}

                        {/* <FormField
                            control={form.control}
                            name="discountEndDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Discount End Date (optional)</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                        <FormField
                            control={form.control}
                            name="is_available"
                            render={({ field }) => (
                                <FormItem className="col-span-full">
                                    <FormLabel>Available</FormLabel>
                                    <FormControl>
                                        <label className="inline-flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={!!field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                                className="h-4 w-4 rounded"
                                            />
                                            <span className="text-sm">Is available</span>
                                        </label>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Variants Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Variants</h3>
                            <Button type="button" variant="outline" onClick={addVariant}>
                                <Plus size={16} className="mr-2" /> Add Variant
                            </Button>
                        </div>
                        {fields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-lg space-y-4  grid grid-cols-2 sm:grid-cols-3  gap-2 relative">
                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash size={16} />
                                    </Button>
                                )}
                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Name (e.g., size, color)</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Value (e.g., small, red)</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.price`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.inStock`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Stock</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Nullable Discount Fields for Variant */}
                                {/* <FormField
                                    control={form.control}
                                    name={`variants.${index}.discountType`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Discount Type (optional)</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}

                                {/* <FormField
                                    control={form.control}
                                    name={`variants.${index}.discountValue`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Discount Value (optional)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}

                                <FormField
                                    control={form.control}
                                    name={`variants.${index}.originalPrice`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Original Price (optional)</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* <FormField
                                    control={form.control}
                                    name={`variants.${index}.discountStartDate`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Discount Start Date (optional)</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}

                                {/* <FormField
                                    control={form.control}
                                    name={`variants.${index}.discountEndDate`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variant Discount End Date (optional)</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value || null)} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                            </div>
                        ))}
                    </div>

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Images</h3>
                        

                        <div>
                            <h4 className="text-md font-medium mb-2">Additional Images</h4>
                            <Dropzone
                                acceptedFiles={{
                                    'image/png': [],
                                    'image/jpeg': [],
                                    'image/webp': [],
                                    'video/mp4': [],
                                }}
                                onDone={handleMediaUpload}
                            />
                            {form.formState.errors.file && (
                                <p className="text-sm text-red-600 mt-1">{form.formState.errors.file.message}</p>
                            )}
                            <div className="mt-2 flex items-center flex-wrap gap-2">

                                {mediaFiles && (
                                    <div className='relative'>
                                        {mediaFiles.type.startsWith('image/') ? (
                                            <img
                                                src={URL.createObjectURL(mediaFiles)}
                                                alt={`Media files`}
                                                width={250}
                                                height={250}
                                                className="rounded-lg aspect-square object-contain"
                                            />
                                        ) : mediaFiles.type.startsWith('video/') ? (
                                            <video
                                                src={URL.createObjectURL(mediaFiles)}
                                                width={250}
                                                height={250}
                                                className="rounded-lg aspect-square object-contain"
                                                controls
                                            />
                                        ) : null}
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2"
                                            onClick={() => removeMedia()}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                )}

                                {
                                    mediaWatch && mediaWatch?.map((med, index) => {
                                    if (med?.mime_type?.startsWith('image/')) {
                                        return  <div key={index} className='relative' >
                                            <img
                                                src={`${BASE_URL}/`+med.image}
                                                alt={`Media ${index + 1}`}
                                                width={250 }
                                                height={250}
                                                className="rounded-lg aspect-square object-contain"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={() => {    
                                                const newMedia = form.getValues('media')?.filter((medf) => medf.imageID  !== med.imageID ); 
                                                    form.setValue('media', newMedia, { shouldValidate: true, shouldDirty: true })
                                                }}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    }
                                    else if (med?.mime_type?.startsWith('video/')) {
                                        return  <div key={index} className='relative' >
                                            <video
                                                src={`${BASE_URL}/`+med.image}
                                                width={250 }
                                                height={250}
                                                className="rounded-lg aspect-square object-contain"
                                                controls
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={() => {    
                                                    const newMedia = form.getValues('media')?.filter((medf) => medf.imageID  !== med.imageID ); 
                                                    form.setValue('media', newMedia, { shouldValidate: true, shouldDirty: true })
                                                }}
                                            >
                                                <X size={16} />
                                            </Button>
                                        </div>
                                    }
                                    
                                    
                                    else{
                                        <></>
                                    }
    })
                                }

                            </div>

                        </div>
                    </div>

                    {/* <Button type="submit">
                    {  saving ? <><Loader className=' animate-spin'  /></> :  <>{mode === 'add' ? 'Add Product' : 'Update Product'}</>}
                    </Button> */}
                </form>
            </Form>
        </ConfirmDialog>

    );
}

export default ProductForm;