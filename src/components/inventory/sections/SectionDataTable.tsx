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
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { Pencil, X } from 'lucide-react';

// Import your existing ImageGallery component
import ImageGallery, { ImageType } from '@/components/gallery/ImageGallery';
import TableContainerCard from '@/components/common/TableContainerCard';
import SearchAndPaginationWrapper from '@/components/common/SearchAndPaginationWrapper';
import { FaRegEdit } from 'react-icons/fa';
import Image from 'next/image';

// ✅ FIX: make it mutable string[]
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

type FormData = z.infer<typeof baseSchema>;

interface SectionFormProps {
    mode: 'add' | 'edit';
    onSubmit: (data: FormData, selectedImage: ImageType | null) => void;
    defaultValues?: Partial<Section>;
}

function SectionForm({ mode, onSubmit, defaultValues }: SectionFormProps) {
    const form = useForm<FormData>({
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

    const handleFormSubmit = (data: FormData) => {
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

export type Section = {
    id: string;
    name: string;
    description: string;
    priority: number;
    availableFrom: string;
    availableTo: string;
    appOnly: boolean;
    days: string[];
    image?: ImageType | null;
    products?: ImageType[];
};

export default function Sections() {
    const [sections, setSections] = useState<Section[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [editSection, setEditSection] = useState<Section | null>(null);
    const [showAddFormDialog, setShowAddFormDialog] = useState(false);
    const itemsPerPage = 10;

    // Demo data
    useEffect(() => {
        const demoSections: Section[] = [
            {
                id: '1',
                name: 'Sandwich',
                description: '',
                priority: 9,
                availableFrom: '00:00',
                availableTo: '23:59',
                appOnly: false,
                days: [...daysOfWeek], // ✅ FIX here
                image: { id: '1', url: '', name: 'Sandwich', alt: 'Sandwich' },
                products: [],
            },
            {
                id: '2',
                name: 'Combo',
                description: '',
                priority: 8,
                availableFrom: '00:00',
                availableTo: '23:59',
                appOnly: false,
                days: [...daysOfWeek],
                image: { id: '2', url: '', name: 'Combo', alt: 'Combo' },
                products: [],
            },
        ];
        setSections(demoSections);
    }, []);

    const filteredSections = sections.filter((sec) =>
        sec.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredSections.length / itemsPerPage);
    const displayedSections = filteredSections.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleAdd = (data: FormData, selectedImage: ImageType | null) => {
        let image: ImageType | null = null;
        if (data.file) {
            const url = URL.createObjectURL(data.file);
            image = {
                id: Date.now().toString(),
                url,
                name: data.name,
                alt: data.description || '',
            };
        } else if (selectedImage) {
            image = selectedImage;
        }
        const newSection: Section = {
            id: Date.now().toString(),
            ...data,
            image,
            products: [],
        };
        setSections([newSection, ...sections]);
    };

    const handleEdit = (data: FormData, selectedImage: ImageType | null) => {
        if (!editSection) return;
        let image: ImageType | null = editSection.image ?? null;
        if (data.file) {
            const url = URL.createObjectURL(data.file);
            image = {
                id: Date.now().toString(),
                url,
                name: data.name,
                alt: data.description || '',
            };
        } else if (data.imageId && selectedImage) {
            image = selectedImage;
        }
        const updatedSection: Section = {
            ...editSection,
            ...data,
            image,
        };
        setSections(
            sections.map((sec) => (sec.id === editSection.id ? updatedSection : sec))
        );
        setEditSection(null);
    };

    const handleDelete = (id: string) => {
        setSections(sections.filter((sec) => sec.id !== id));
    };

    return (
        <div className="container mx-auto p-4">
            <Dialog open={showAddFormDialog} onOpenChange={() => { setShowAddFormDialog(false) }}>
                <DialogContent >
                 <div className="max-h-[calc(90vh-48px)] overflow-y-auto  ">
                 <DialogHeader>
                        <DialogTitle>Add Section</DialogTitle>
                    </DialogHeader>
                    <SectionForm mode="add" onSubmit={handleAdd} />
                 </div>
                </DialogContent>
            </Dialog>

            <TableContainerCard
                title="Sections"
                addButton
                addButtonText="Add Section"
                addButtonAction={() => { setShowAddFormDialog(true) }}
            >
                <SearchAndPaginationWrapper
                    searchValue={search}
                    onSearchChange={(e) => setSearch(e)}
                    currentPage={page}
                    totalItems={sections.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setPage}
                    onItemsPerPageChange={() => { }}
                >
                    {/* Desktop table */}
                    <div className="overflow-x-auto hidden md:block">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100 text-left text-xs md:text-sm">
                                <tr>
                                    <th className="px-3 py-2 border">IMAGE</th>
                                    <th className="px-3 py-2 border">NAME</th>
                                    <th className="px-3 py-2 border">DESCRIPTION</th>
                                    <th className="px-3 py-2 border">PRIORITY</th>
                                    <th className="px-3 py-2 border">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedSections.map((sec) => (
                                    <tr key={sec.id} className="border-b hover:bg-gray-50 transition">
                                        <td className="px-3 py-2 border">
                                            {sec.image ? (
                                                <Image
                                                    width={80}
                                                    height={80}
                                                    src={sec.image.url || ''}
                                                    alt={sec.name}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-3 py-2 border text-center">{sec.name}</td>
                                        <td className="px-3 py-2 border">{sec.description}</td>
                                        <td className="px-3 py-2 border text-center">{sec.priority}</td>
                                        <td className="px-3 py-2 border text-center">
                                            <Button variant="ghost" size="icon" onClick={() => setEditSection(sec)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sec.id)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile grid */}
                    <div className="grid gap-4 mt-6 md:hidden">
                        {sections.map((sec) => (
                            <div key={sec.id} className="border rounded-lg p-3 shadow-sm bg-white">
                                <div className="flex items-start justify-between">
                                    <Image
                                        src={sec.image?.url || ''}
                                        alt="app banner"
                                        width={100}
                                        height={60}
                                        className="rounded object-cover"
                                    />
                                    <div className="flex gap-0.5 items-center">
                                        <Button variant="ghost" size="icon" onClick={() => setEditSection(sec)}>
                                            <FaRegEdit className="text-lg text-gray-600" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(sec.id)}>
                                            <X className="text-lg text-gray-600" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm space-y-1">
                                    <p>
                                        <span className="font-medium">Priority:</span> {sec.priority}
                                    </p>
                                    <p>
                                        <span className="font-medium">Item:</span> {sec.name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </SearchAndPaginationWrapper>
            </TableContainerCard>

            {/* Edit Dialog */}
            <Dialog open={!!editSection} onOpenChange={() => setEditSection(null)}>
                <DialogContent >
                   <div className="max-h-[calc(90vh-48px)] overflow-y-auto  ">
                    <DialogHeader>
                            <DialogTitle>Edit Section</DialogTitle>
                        </DialogHeader>
                        {editSection && (
                            <SectionForm mode="edit" onSubmit={handleEdit} defaultValues={editSection} />
                        )}
                   </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
