// components/Sections.tsx
'use client'
import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,

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

// Import your existing ImageGallery component
import  { ImageType } from '@/components/gallery/ImageGallery';
import Image from 'next/image';
import { Section } from './SectionDataTable';

const daysOfWeek: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];


const baseSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
    priority: z.number().min(1, 'Priority must be at least 1'),
    availableFrom: z.string(),
    availableTo: z.string(),
    appOnly: z.boolean(),
    days: z.array(z.string()).min(1, 'Select at least one day'),
    file: z.instanceof(File).optional(),
    imageId: z.string().optional(),
}).refine((data) => data.file || data.imageId, {
    message: 'An image is required',
    path: ['image'],
});

export type SectionFormData = z.infer<typeof baseSchema>;

interface SectionFormProps {
    mode: 'add' | 'edit';
    onSubmit: (data: SectionFormData, selectedImage: ImageType | null) => void;
    defaultValues?: Partial<Section>;
}

function SectionForm({ mode, onSubmit, defaultValues }: SectionFormProps) {
    const form = useForm<SectionFormData>({
        resolver: zodResolver(baseSchema),
        defaultValues: {
            name: defaultValues?.name ?? '',
            description: defaultValues?.description ?? '',
            priority: defaultValues?.priority ?? 1,
            availableFrom: defaultValues?.availableFrom ?? '00:00',
            availableTo: defaultValues?.availableTo ?? '23:59',
            appOnly: defaultValues?.appOnly ?? false,
            days: defaultValues?.days ?? [],
            file: undefined,
            imageId: defaultValues?.image?.id ?? undefined,
        },
    });

    const [preview, setPreview] = useState<string | null>(defaultValues?.image?.url ?? null);
    const [selectedImage, setSelectedImage] = useState<ImageType | null>(defaultValues?.image ?? null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith('image/')) {
                form.setValue('file', file);
                setPreview(URL.createObjectURL(file));
                setSelectedImage(null);
                form.setValue('imageId', undefined);
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

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'file' && value.file) {
                setPreview(URL.createObjectURL(value.file));
                setSelectedImage(null);
                form.setValue('imageId', undefined);
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const handleFormSubmit = (data: SectionFormData) => {
        onSubmit(data, selectedImage);
        setPreview(null);
        setSelectedImage(null);
    };

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

                    {/* --- Available From Field --- */}
                    <FormField
                        control={form.control}
                        name="availableFrom"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Available From</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Available To Field --- */}
                    <FormField
                        control={form.control}
                        name="availableTo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Available To</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- App Only Switch --- */}
                    <FormField
                        control={form.control}
                        name="appOnly"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <FormLabel>App Only</FormLabel>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* --- Days Checkboxes --- */}
                    <FormField
                        control={form.control}
                        name="days"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Days</FormLabel>
                                <div className="space-y-2">
                                    {daysOfWeek.map((day) => (
                                        <div key={day} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={day}
                                                checked={field.value?.includes(day)}
                                                onCheckedChange={(checked) => {
                                                    const newDays = checked
                                                        ? [...(field.value ?? []), day]
                                                        : field.value?.filter((d: string) => d !== day) ?? [];
                                                    field.onChange(newDays);
                                                }}
                                            />
                                            <label htmlFor={day}>{day}</label>
                                        </div>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* --- Image Upload --- */}
                    <FormItem>
                        <FormLabel>Image</FormLabel>
                        {preview && <Image width={140} height={140} src={preview || ''} alt="Preview" className="mt-2 max-h-32 mx-auto" />}
                        <div className="flex space-x-4 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('section-file-upload')?.click()}
                            >
                                Browse
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => setIsGalleryOpen(true)}>
                                Select From Gallery
                            </Button>
                        </div>
                        <div
                            className={`border-2 border-dashed rounded-md p-4 text-center mt-2 ${isDragging ? 'border-primary bg-primary/10' : 'border-muted'
                                }`}
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
                            id="section-file-upload"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    form.setValue('file', file);
                                }
                            }}
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                            Note: Image Resolution ≤ 400x400 px, Size ≤ 200 KB
                        </p>
                        <FormMessage />
                    </FormItem>

                    <Button type="submit">{mode === 'add' ? 'Add Section' : 'Save Changes'}</Button>
                </form>
            </Form>

            {/* Gallery Dialog */}
            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    {/* Uncomment when gallery ready */}
                    {/* <ImageGallery
                        onSelect={(image) => {
                            setSelectedImage(image);
                            setPreview(image.url);
                            form.setValue('imageId', image.id);
                            form.setValue('file', undefined);
                            setIsGalleryOpen(false);
                        }}
                    /> */}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default SectionForm