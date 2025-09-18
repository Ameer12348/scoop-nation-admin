'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from 'date-fns';
import { z } from 'zod';
import { CalendarIcon, ClockIcon, LinkIcon, MapPinIcon, ImageIcon, SettingsIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface Banner {
    id?: string | number;
    validity: { from: Date; to: Date };
    startTime: string;
    endTime: string;
    priority: number;
    linkItem?: string;
    branches: string[];
    appBannerImage?: File | null;
    appBannerPreview?: string;
    webBannerImage?: File | null;
    webBannerPreview?: string;
}


interface Branch {
    id: string;
    name: string;
    address: string;
}



interface Item {
    id: string;
    name: string;
}

const schema = z.object({
    validity: z.object({
        from: z.date(),
        to: z.date(),
    }),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    priority: z.number().min(1, 'Priority must be at least 1'),
    linkItem: z.string().optional(),
    branches: z.array(z.string()).min(0),
});

type FormData = z.infer<typeof schema>;

const mockBranches: Branch[] = [
    { id: '1', name: 'Globe Trotter, 100 C Gulberg', address: '31 43 92 78 166, City: Lahore' },
    { id: '2', name: 'Sandwiches Branch', address: 'Sample Address 2' },
    // Add more as needed
];



const mockItems: Item[] = [
    { id: '1', name: 'Chicken Super' },
    { id: '2', name: 'Vada Pav' },
    { id: '3', name: 'Halwa Puri' },
    { id: '4', name: 'Spicy Poori' },
    { id: '5', name: 'Chicken Kabab' },
    { id: '6', name: '5 Pieces Kabab' },
    // Add more as needed
];

export function BannerForm({ banner, onSubmit, onCancel }: {
    banner?: Partial<Banner>;
    onSubmit: (data: Banner) => void;
    onCancel: () => void;
}) {
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            validity: { from: new Date(), to: new Date() },
            startTime: '00:00',
            endTime: '00:00',
            priority: 1,
            branches: [],
            linkItem: '',
            ...banner,
        },
    });

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = form;

    const selectedBranches = watch('branches') || [];
    const selectedItem = watch('linkItem') || '';
    const validity = watch('validity');

    const [appBannerPreview, setAppBannerPreview] = React.useState<string | null>(banner?.appBannerPreview || null);
    const [webBannerPreview, setWebBannerPreview] = React.useState<string | null>(banner?.webBannerPreview || null);
    const [appFile, setAppFile] = React.useState<File | null>(null);
    const [webFile, setWebFile] = React.useState<File | null>(null);

    React.useEffect(() => {
        if (banner) {
            reset({
                ...banner,
                validity: banner.validity || { from: new Date(), to: new Date() },
                priority: banner.priority || 1,
                branches: banner.branches || [],
            } as Banner);
        }
    }, [banner, reset]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'app' | 'web') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation: size <= 300KB
        if (file.size > 400 * 1024) {
            alert('Image size should be less than or equal to 300KB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
                // const isApp = type === 'app';
                // const expectedWidth = isApp ? 800 : 1520;
                // const expectedHeight = isApp ? 362 : 460;
                // if (img.width !== expectedWidth || img.height !== expectedHeight) {
                //   alert(`Image dimensions should be ${expectedWidth}x${expectedHeight} pixels`);
                //   return;
                // }

                // Set preview
                if (type === 'app') {
                    setAppBannerPreview(e.target?.result as string);
                    setAppFile(file);
                } else {
                    setWebBannerPreview(e.target?.result as string);
                    setWebFile(file);
                }
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const onFormSubmit = (values: FormData) => {
        if (!appFile) {
            alert('App banner image is required');
            return;
        }
        onSubmit({
            ...values,
            appBannerImage: appFile,
            appBannerPreview,
            webBannerImage: webFile,
            webBannerPreview,
        } as Banner);
    };

    return (
        <div className="flex h-full flex-col space-y-6 bg-background p-4 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Create Banner</h2>
                    {/* <p className="text-sm text-muted-foreground">
                        {validity?.from && validity?.to
                            ? `${format(validity.from, 'dd/MM/yyyy')} - ${format(validity.to, 'dd/MM/yyyy')}`
                            : 'Select dates'}
                    </p> */}
                </div>
                {/* <Select defaultValue="UTC+05:00-Asia/Karachi">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="UTC+05:00-Asia/Karachi">UTC+05:00 - Asia/Karachi</SelectItem>
                    </SelectContent>
                </Select> */}
            </div>

            <Separator />

            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                {/* Banner Validity */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Banner Validity</CardTitle>
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal md:w-[300px]",
                                            !validity?.from && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {validity?.from ? (
                                            validity?.to ? (
                                                <>
                                                    {format(validity.from, "PP")} - {format(validity.to, "PP")}
                                                </>
                                            ) : (
                                                format(validity.from, "PP")
                                            )
                                        ) : (
                                            <span>Pick a date range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="range"
                                        selected={validity}
                                        onSelect={(range) => setValue('validity', range as any)}
                                        numberOfMonths={2}
                                        className="rounded-md border"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        {errors.validity && <p className="text-sm text-destructive">{errors.validity.message}</p>}
                    </CardContent>
                </Card>

                {/* Times and Priority */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <div className="relative">
                            <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                            <Input
                                id="startTime"
                                type="time"
                                {...register('startTime')}
                                className="pl-10"
                            />
                        </div>
                        {errors.startTime && <p className="text-sm text-destructive">{errors.startTime.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <div className="relative">
                            <ClockIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                            <Input
                                id="endTime"
                                type="time"
                                {...register('endTime')}
                                className="pl-10"
                            />
                        </div>
                        {errors.endTime && <p className="text-sm text-destructive">{errors.endTime.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Input
                            id="priority"
                            type="number"
                            {...register('priority', { valueAsNumber: true })}
                            className="w-full"
                        />
                        {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
                    </div>
                </div>

                {/* Link with Item */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Link with Item (optional) <span className="text-muted-foreground">For Web Only</span></CardTitle>
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Select value={selectedItem} onValueChange={(value) => setValue('linkItem', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                                {mockItems.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Branches */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Branches</CardTitle>
                        <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-48 w-full rounded-md border p-2">
                            {mockBranches.map((branch) => (
                                <div key={branch.id} className="flex items-center space-x-2 py-1">
                                    <Checkbox
                                        id={`branch-${branch.id}`}
                                        checked={selectedBranches.includes(branch.id)}
                                        onCheckedChange={(checked) => {
                                            const current = selectedBranches;
                                            if (checked) {
                                                setValue('branches', [...current, branch.id]);
                                            } else {
                                                setValue('branches', current.filter(id => id !== branch.id));
                                            }
                                        }}
                                    />
                                    <Label htmlFor={`branch-${branch.id}`} className="cursor-pointer">
                                        {branch.name}
                                    </Label>
                                </div>
                            ))}
                        </ScrollArea>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {selectedBranches.map(id => {
                                const branch = mockBranches.find(b => b.id === id);
                                return branch ? <Badge key={id} variant="secondary">{branch.name}</Badge> : null;
                            })}
                        </div>
                    </CardContent>
                </Card>


                {/* Images */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* App Banner Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center space-x-2">
                                <ImageIcon className="h-4 w-4" />
                                <span>App Banner Image <span className="text-destructive">*</span> (Required)</span>
                            </CardTitle>
                            <CardDescription>Note: Image should be equal to 800x362 pixels and Size should be less than or equal to 300KB.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input
                                id="appBanner"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'app')}
                                className="mb-4"
                            />
                            {appBannerPreview && (
                                <Image
                                    width={200}
                                    height={200}
                                    src={appBannerPreview}
                                    alt="App Banner Preview"
                                    className="h-32 w-full rounded-md object-cover"
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Web Banner Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center space-x-2">
                                <ImageIcon className="h-4 w-4" />
                                <span>Web Banner Image</span>
                            </CardTitle>
                            <CardDescription>Note: Image should be equal to 1520x460 pixels and Size should be less than or equal to 300KB.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input
                                id="webBanner"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'web')}
                                className="mb-4"
                            />
                            {webBannerPreview && (
                                <Image
                                    width={200}
                                    height={200}
                                    src={webBannerPreview}
                                    alt="Web Banner Preview"
                                    className="h-32 w-full rounded-md object-cover"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>

            {/* Support Chat Bubble */}
            <div className="fixed bottom-4 right-4">
                <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage src="/support-avatar.png" />
                    <AvatarFallback>?</AvatarFallback>
                </Avatar>
            </div>

            {/* Sidebar - Simplified for component, assume it's part of larger layout */}
            <div className="hidden md:block fixed left-4 top-1/2 transform -translate-y-1/2 space-y-2">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                    <SettingsIcon className="h-5 w-5" />
                </Button>
                {/* Add more sidebar icons */}
            </div>
        </div>
    );
}

// Usage example in a page:
// <BannerForm banner={initialBanner} onSubmit={handleSubmit} onCancel={handleCancel} />