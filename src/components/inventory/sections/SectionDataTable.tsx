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
import SectionForm, { SectionFormData } from './SectionForm';

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

    const handleAdd = (data: SectionFormData, selectedImage: ImageType | null) => {
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

    const handleEdit = (data: SectionFormData, selectedImage: ImageType | null) => {
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
        <div className=" ">
            <Dialog open={showAddFormDialog}   onOpenChange={() => { setShowAddFormDialog(false) }}>
                <DialogContent className='p-0 min-w-[98vw] sm:min-w-[90vw] md:min-w-[700px] lg:min-w-[900px] ' >
                 <div className="max-h-[calc(90vh)] p-5 overflow-y-auto  ">
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
                <DialogContent className='p-0  min-w-[98vw] sm:min-w-[90vw] md:min-w-[700px] lg:min-w-[900px]' >
                   <div className="max-h-[calc(90vh)] p-5 overflow-y-auto  ">
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
