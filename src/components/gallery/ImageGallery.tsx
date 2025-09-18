// components/ImageGallery.tsx
'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Pencil, Trash } from 'lucide-react';
import Image from 'next/image';

// Sub-component: ImageForm (used for both add and edit popups)
const addSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  alt: z.string().min(1, 'Alt text is required'),
  file: z.instanceof(File).refine((file) => file.size > 0, 'File is required'),
});

const editSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  alt: z.string().min(1, 'Alt text is required'),
});

type AddFormData = z.infer<typeof addSchema>;
type EditFormData = z.infer<typeof editSchema>;

interface ImageFormProps {
  mode: 'add' | 'edit';
  onSubmit: (data: AddFormData | EditFormData) => void;
  defaultValues?: { name: string; alt: string };
}

function ImageForm({ mode, onSubmit, defaultValues }: ImageFormProps) {
  const schema = mode === 'add' ? addSchema : editSchema;
  const form = useForm<AddFormData | EditFormData>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === 'add'
        ? { name: '', alt: '', file: undefined }
        : { name: defaultValues?.name ?? '', alt: defaultValues?.alt ?? '' },
  });

  const [preview, setPreview] = useState<string | null>(null);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="alt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alt Text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode === 'add' && (
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Image</FormLabel>
                <FormControl>
                  <div
                    className={`border-2 border-dashed rounded-md p-4 text-center ${
                      isDragging ? 'border-primary bg-primary/10' : 'border-muted'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <p>Drag and drop image here or click to select</p>
                    </label>
                    {preview && <Image width={140} height={140} src={preview} alt="Preview" className="mt-2 max-h-32 mx-auto" />}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">{mode === 'add' ? 'Add Image' : 'Save Changes'}</Button>
      </form>
    </Form>
  );
}

// Sub-component: ImageCard
export interface ImageType {
  id: string;
  url: string;
  name: string;
  alt: string;
}

interface ImageCardProps {
  image: ImageType;
  onOpenEdit: (image: ImageType) => void;
  onDelete: (id: string) => void;
  className?:string
}

function ImageCard({ image, onOpenEdit, onDelete ,className}: ImageCardProps) {
  return (
    <div className={`relative flex flex-col items-center border rounded-lg p-2 shadow-sm ${className}`}>
      <Image width={140} height={140} src={image.url} alt={image.alt} className="w-full h-32 object-cover mb-2" />
      <p className="text-center font-medium">{image.name}</p>
      <div className="absolute top-2 right-2 flex gap-1 pt-1 pe-1">
        <button className='bg-transparent  text-sm border-none' onClick={() => onOpenEdit(image)}>
          <Pencil className='h-4 w-4' />
        </button>
        <button className='bg-transparent text-sm border-none' onClick={() => onDelete(image.id)}>
          <Trash className='h-4 w-4 text-red-800' />
        </button>
      </div>
    </div>
  );
}

// Main component: ImageGallery
export default function ImageGallery() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [search, setSearch] = useState('');
  const [displayedImages, setDisplayedImages] = useState<ImageType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [editImage, setEditImage] = useState<ImageType | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // Demo data (replace with your actual project images)
  useEffect(() => {
    const demoImages: ImageType[] = Array.from({ length: 50 }, (_, i) => ({
      id: i.toString(),
      url: `https://placehold.co/200x200?text=Image${i + 1}`,
      name: `Image ${i + 1}`,
      alt: `Alt text for image ${i + 1}`,
    }));
    setImages(demoImages);
  }, []);

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const itemsPerPage = 10;
    setDisplayedImages(filteredImages.slice(0, itemsPerPage));
    setPage(1);
    setHasMore(filteredImages.length > itemsPerPage);
  }, [search, images]);

  const loadMore = () => {
    if (!hasMore) return;
    const itemsPerPage = 10;
    const nextPage = page + 1;
    const newDisplayed = filteredImages.slice(0, nextPage * itemsPerPage);
    setDisplayedImages(newDisplayed);
    setPage(nextPage);
    setHasMore(newDisplayed.length < filteredImages.length);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    const currentRef = observerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, page]);

  const handleAdd = (data: AddFormData | EditFormData) => {
    const addData = data as AddFormData;
    const url = URL.createObjectURL(addData.file);
    const newImage: ImageType = {
      id: Date.now().toString(),
      url,
      name: addData.name,
      alt: addData.alt,
    };
    setImages([newImage, ...images]);
  };

  const handleEdit = (data: AddFormData | EditFormData) => {
    if (!editImage) return;
    const editData = data as EditFormData;
    setImages(
      images.map((img) =>
        img.id === editImage.id ? { ...img, name: editData.name, alt: editData.alt } : img
      )
    );
    setEditImage(null);
  };

  const handleDelete = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Input
          placeholder="Search images..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Image</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Image</DialogTitle>
            </DialogHeader>
            <ImageForm mode="add" onSubmit={handleAdd} />
          </DialogContent>
        </Dialog>
      </div>
      <div className=" flex justify-center flex-wrap  items-start gap-4">
        {displayedImages.map((img) => (
          <ImageCard key={img.id} image={img} onOpenEdit={setEditImage} onDelete={handleDelete} className='max-w-[300px]' />
        ))}
      </div>
      <div ref={observerRef} className="h-10 mt-4 flex justify-center items-center">
        {hasMore && <p className="text-muted-foreground">Loading more images...</p>}
        {!hasMore && displayedImages.length > 0 && (
          <p className="text-muted-foreground">No more images</p>
        )}
      </div>

      {/* Edit Dialog (opened when editImage is set) */}
      <Dialog open={!!editImage} onOpenChange={() => setEditImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
          </DialogHeader>
          {editImage && (
            <ImageForm
              mode="edit"
              onSubmit={handleEdit}
              defaultValues={{ name: editImage.name, alt: editImage.alt }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}