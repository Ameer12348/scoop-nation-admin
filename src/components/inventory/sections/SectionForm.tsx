// components/SectionForm.tsx
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Section } from './SectionDataTable';
import Dropzone from '@/components/form/form-elements/DropZone';
import { BASE_URL, IMAGE_BASE_URL } from '@/consts';
import { X } from 'lucide-react';
import ConfirmDialog from '@/components/common/ConfirmDialog';

const baseSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    priority: z.string().optional(),
    file: z.instanceof(File).optional(),
});

export type SectionFormData = z.infer<typeof baseSchema>;

interface SectionFormProps {
    mode: 'add' | 'edit';
    onSubmit: (data: SectionFormData) => void;
    defaultValues?: Partial<Section>;
    loading?: boolean;
    showDialog:boolean,
    setShowDialog: (open: boolean) => void;
}

function SectionForm({ mode, onSubmit, defaultValues, loading, showDialog, setShowDialog }: SectionFormProps) {

    const defaultValuesObj = {
            name: defaultValues?.name ?? '',
            file: undefined,
            priority: defaultValues?.priority 
        };
    const form = useForm<SectionFormData>({
        resolver: zodResolver(baseSchema),
        defaultValues: defaultValuesObj,
    });

    const [preview, setPreview] = useState<string | null>(
        defaultValues?.mainImage ? `${IMAGE_BASE_URL}/${defaultValues.mainImage}` : null
    );
    const [mediaFile, setMediaFile] = useState<File | null>(null);

    useEffect(() => {
        if (defaultValues) {
            form.reset({
                name: defaultValues.name ?? '',
                file: undefined,
                priority: defaultValues.priority
            });
            setPreview(defaultValues.mainImage ? `${IMAGE_BASE_URL}/${defaultValues.mainImage}` : null);
        }
    }, [defaultValues, form]);

    const handleFormSubmit = (data: SectionFormData) => {
        onSubmit(data);
    };

    const handleMediaUpload = (file: File) => {
        console.log('Uploaded file:', file);
        setMediaFile(file);
        setPreview(URL.createObjectURL(file));
        form.setValue('file', file, { shouldValidate: true });
    };

    const removeMedia = () => {
        setMediaFile(null);
        setPreview(defaultValues?.mainImage ? `${IMAGE_BASE_URL}/${defaultValues.mainImage}` : null);
        form.setValue('file', undefined, { shouldValidate: true });
    };
    useEffect(()=>{
        if (mode == 'add' && showDialog) {
            form.reset(defaultValuesObj);
        }
    },[mode,showDialog]);

    return (
       <ConfirmDialog open={showDialog} setOpen={setShowDialog} loading={loading} title={mode === 'add' ? 'Add Category' : 'Edit Category'} onConfirm={form.handleSubmit(handleFormSubmit)}>
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
                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <FormControl>
                                <Input type='number' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* --- Image Upload --- */}
                <FormItem>
                    <FormLabel>Category Image</FormLabel>
                    <Dropzone
                        acceptedFiles={{
                            'image/png': [],
                            'image/jpeg': [],
                            'image/webp': [],
                        }}
                        fixedRatio={1148/327}
                        onDone={handleMediaUpload}
                        showDescription={false}
                        title='Drag & Drop Category Image'
                    />
                    {form.formState.errors.file && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.file.message}</p>
                    )}
                </FormItem>

                {/* Preview */}
                {preview && (
                    <div className="mt-2">
                        <FormLabel className='mb-2'>Preview</FormLabel>
                        <div className='relative inline-block'>
                            <img
                                src={preview}
                                alt="Category preview"
                                width={200}
                                height={200}
                                className="rounded-lg aspect-square object-cover"
                            />
                            {mediaFile && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={removeMedia}
                                >
                                    <X size={16} />
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {/* <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : mode === 'add' ? 'Add Category' : 'Save Changes'}
                </Button> */}
            </form>
        </Form>
       </ConfirmDialog>
    );
}

export default SectionForm