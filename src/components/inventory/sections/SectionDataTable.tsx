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
import { Pencil, Trash2, } from 'lucide-react';

// Import your existing ImageGallery component
import ImageGallery, { ImageType } from '@/components/gallery/ImageGallery';
import TableContainerCard from '@/components/common/TableContainerCard';
import SearchAndPaginationWrapper from '@/components/common/SearchAndPaginationWrapper';
import { FaRegEdit } from 'react-icons/fa';
import Image from 'next/image';
import SectionForm, { SectionFormData } from './SectionForm';
import api from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BASE_URL, IMAGE_BASE_URL } from '@/consts';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    priority: string;
    mainImage: string;
    branch_id?: number;
};

export default function Sections() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [editSection, setEditSection] = useState<Section | null>(null);
    const [showAddFormDialog, setShowAddFormDialog] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);
    const [itemsPerPage, setitemsPerPage] = useState(5)
    // Fetch categories
    const { data: categoriesData, isLoading, refetch: refetchCategories } = useQuery({
        queryKey: ['categories', page, itemsPerPage, search],
        queryFn: async () => {
            const res = await api.get('/api/admin/categories', {
                params: {
                    page,
                    limit: itemsPerPage,
                    search: search || undefined,
                },
            });
            return res.data;
        },
    });

    // Create category mutation
    const { mutate: createCategory, isPending: isCreating } = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await api.post('/api/admin/categories/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data?.message || 'Category created successfully');
                // queryClient.invalidateQueries({ queryKey: ['categories'] });
                refetchCategories();
                setShowAddFormDialog(false);
            } else {
                toast.error(data?.error || data?.message || 'Failed to create category');
            }
        },
        onError: (error: any) => {
            console.error('Mutation failed:', error);
            toast.error(error?.message || 'Failed to create category');
        },
    });

    // Update category mutation
    const { mutate: updateCategory, isPending: isUpdating } = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await api.post('/api/admin/categories/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data?.message || 'Category updated successfully');
                // queryClient.invalidateQueries({ queryKey: ['categories'] });
                refetchCategories();
                setEditSection(null);
            } else {
                toast.error(data?.error || data?.message || 'Failed to update category');
            }
        },
        onError: (error: any) => {
            console.error('Mutation failed:', error);
            toast.error(error?.message || 'Failed to update category');
        },
    });

    // Delete category mutation
    const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
        mutationFn: async (id: string) => {
            const res = await api.post('/api/admin/categories/delete', { id });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data?.message || 'Category deleted successfully');
                // queryClient.invalidateQueries({ queryKey: ['categories'] });
                refetchCategories();
                setDeleteDialogOpen(false);
                setSectionToDelete(null);
            } else {
                toast.error(data?.error || data?.message || 'Failed to delete category');
            }
        },
        onError: (error: any) => {
            console.error('Mutation failed:', error);
            toast.error(error?.message || 'Failed to delete category');
        },
    });

    const handleAdd = (data: SectionFormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        if (data?.priority) {
            formData.append('priority', data.priority);
        }
        if (data.file) {
            formData.append('file', data.file);
        }
        createCategory(formData);
    };

    const handleEdit = (data: SectionFormData) => {
        if (!editSection) return;
        const formData = new FormData();
        formData.append('id', editSection.id);
        formData.append('name', data.name);
        if (data?.priority) {
            formData.append('priority', data.priority);
        }
        if (data.file) {
            formData.append('file', data.file);
        }
        updateCategory(formData);
    };

    const handleDelete = (section: Section) => {
        setSectionToDelete(section);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (sectionToDelete) {
            deleteCategory(sectionToDelete.id);
        }
    };

    const sections = categoriesData?.data || [];
    const totalItems = categoriesData?.pagination?.total || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div className=" ">

            <SectionForm showDialog={showAddFormDialog} setShowDialog={() => { setShowAddFormDialog(false) }} mode="add" onSubmit={handleAdd} loading={isCreating} />


            <TableContainerCard
                title="Categories"
                addButton
                addButtonText="Add Category"
                addButtonAction={() => { setShowAddFormDialog(true) }}
                 refreshButtonAction={()=>{refetchCategories()}}
                 hasRefreshButton={true}
            >
                <SearchAndPaginationWrapper
                    searchValue={search}
                    onSearchChange={(e) => {setSearch(e) ;setPage(1)}}
                    currentPage={page}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setPage}
                    onItemsPerPageChange={(perPage) => { setitemsPerPage(perPage) ;setPage(1)}}
                >
                    {/* Desktop table */}
                    <div className="overflow-x-auto hidden md:block">
                        <table className="min-w-full border text-sm">
                            <thead className="bg-gray-100 text-left text-xs md:text-sm">
                                <tr>
                                    <th className="px-3 py-2 border">IMAGE</th>
                                    <th className="px-3 py-2 border">NAME</th>
                                    <th className="px-3 py-2 border">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={3} className="px-3 py-4 text-center">Loading...</td>
                                    </tr>
                                ) : sections.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-3 py-4 text-center">No categories found</td>
                                    </tr>
                                ) : (
                                    sections.map((sec: Section) => (
                                        <tr key={sec.id} className="border-b hover:bg-gray-50 transition">
                                            <td className="px-3 py-2 border">
                                                {sec.mainImage ? (
                                                    <img
                                                        width={80}
                                                        height={80}
                                                        src={`${IMAGE_BASE_URL}/${sec.mainImage}`}
                                                        alt={sec.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                ) : (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 border text-center">{sec.name}</td>
                                            <td className="px-3 py-2 border text-center">
                                                <Button variant="ghost" size="icon" onClick={() => setEditSection(sec)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(sec)}>
                                                    <Trash2 className="h-4 w-4 text-red-700" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile grid */}
                    <div className="grid gap-4 mt-6 md:hidden">
                        {isLoading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : sections.length === 0 ? (
                            <div className="text-center py-4">No categories found</div>
                        ) : (
                            sections.map((sec: Section) => (
                                <div key={sec.id} className="border rounded-lg p-3 shadow-sm bg-white">
                                    <div className="flex items-start justify-between">
                                        <img
                                            src={`${IMAGE_BASE_URL}/${sec.mainImage}`}
                                            alt={sec.name}
                                            width={100}
                                            height={60}
                                            className="rounded object-cover"
                                        />
                                        <div className="flex gap-0.5 items-center">
                                            <Button variant="ghost" size="icon" onClick={() => setEditSection(sec)}>
                                                <FaRegEdit className="text-lg text-gray-600" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(sec)}>
                                                <Trash2 className="text-lg text-red-700" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm space-y-1">
                                        <p>
                                            <span className="font-medium">Name:</span> {sec.name}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </SearchAndPaginationWrapper>
            </TableContainerCard>

            {/* Edit Dialog */}

            {editSection && (
                <SectionForm showDialog={!!editSection} setShowDialog={() => setEditSection(null)} mode="edit" onSubmit={handleEdit} defaultValues={editSection} loading={isUpdating} />
            )}


            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the category &quot;{sectionToDelete?.name}&quot;. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSectionToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
