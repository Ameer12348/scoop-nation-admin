"use client";
import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import ComponentCard from "../../common/ComponentCard";
import { useDropzone, Accept } from "react-dropzone";
import { Cropper, CropperRef } from "react-advanced-cropper";
import 'react-advanced-cropper/dist/style.css';
import { getAbsoluteZoom, getZoomFactor } from 'advanced-cropper/extensions/absolute-zoom';
import { Modal } from "@/components/ui/modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type DropzoneProps = {
  acceptedFiles?: Accept; // react-dropzone accept map
  fixedRatio?: number; // e.g., 1 (square), 16/9, 4/3
  onCroppedImage?: (file: File) => void; // optional callback with cropped image
  onFiles?: (files: File[]) => void; // fallback when not an image or video
  onDone?: (file: File) => void; // emitted when user confirms (Done) or directly for videos
  title?:string;
  description?:string;
  showTitle?:boolean;
  showDescription?:boolean;
  className?: string;
};

const Dropzone: React.FC<DropzoneProps> = ({
  acceptedFiles,
  fixedRatio,
  onCroppedImage,
  onFiles,
  onDone,
  title,
  description,
  showTitle=true,
  showDescription=true,
  className,
}) => {
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [localAspect, setLocalAspect] = useState<number | undefined>(fixedRatio);
  const [zoom, setZoom] = useState(1);
  const cropperRef = useRef<CropperRef | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<
    { width: number; height: number; left: number; top: number } | null
  >(null);

  useEffect(() => {
    setLocalAspect(fixedRatio);
  }, [fixedRatio]);

  const onDrop = useCallback(
    (files: File[]) => {
      if (!files || files.length === 0) return;
      const first = files[0];
      if (first.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setImageSrc(reader.result as string);
          setOriginalFile(first);
          setCropModalOpen(true);
        };
        reader.readAsDataURL(first);
      } else if (first.type === "video/mp4") {
        onDone?.(first);
      } else {
        onFiles?.(files);
        console.log("Files dropped:", files);
      }
    },
    [onFiles, onDone]
  );

  const acceptConfig: Accept | undefined = useMemo(() => {
    if (acceptedFiles) return acceptedFiles;
    return {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
      "video/mp4": [],
    };
  }, [acceptedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig,
    multiple: false,
  });

  const onCropChange = useCallback((cropper: CropperRef) => {
    const state = cropper.getState();
    const settings = cropper.getSettings();
    if (state && settings) {
      const absoluteZoom = getAbsoluteZoom(state, settings);
      const calculatedZoom = 1 + absoluteZoom * 2;
      if (Math.abs(zoom - calculatedZoom) > 0.01) {
        setZoom(calculatedZoom);
      }
      setCroppedAreaPixels(cropper.getCoordinates());
    }
  }, [zoom]);

  const onZoomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = Number(e.target.value);
    setZoom(newZoom);
    if (cropperRef.current) {
      const cropper = cropperRef.current;
      const state = cropper.getState();
      const settings = cropper.getSettings();
      const targetAbsolute = (newZoom - 1) / 2;
      const factor = getZoomFactor(state, settings, targetAbsolute);
      cropper.zoomImage(factor);
    }
  }, []);

  const generateCroppedImage = useCallback(async () => {
    if (!cropperRef.current) return;
    const cropper = cropperRef.current;
    const canvas = cropper.getCanvas();
    if (!canvas) return;
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), originalFile?.type || "image/png", 0.92);
    });
    if (!blob) return;
    const file = new File([blob], originalFile?.name || "cropped.png", {
      type: blob.type,
    });
    onCroppedImage?.(file);
    onDone?.(file);
    setCropModalOpen(false);
    setImageSrc(null);
    setOriginalFile(null);
  }, [onCroppedImage, onDone, originalFile]);

  const aspectOptions = [
    { value: undefined, label: "Free" },
    { value: 1, label: "1:1 (Square)" },
    { value: 4 / 3, label: "4:3" },
    { value: 16 / 9, label: "16:9 (Landscape)" },
    { value: 9 / 16, label: "9:16 (Portrait)" },
  ];

  const isFixed = fixedRatio !== undefined;

  return (
    <>
      <div className={`transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500`}>
        <div
          {...getRootProps()}
          className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }


        ${className || ''}
      `}
          id="demo-upload"
        >
          {/* Hidden Input */}
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center m-0!">
            {/* Icon Container */}
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px]  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <svg
                  className="fill-current"
                  width="29"
                  height="28"
                  viewBox="0 0 29 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
          {
            showTitle &&
             <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
             {
              title? title : <>  {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}  </>
             }
            </h4>
          }

            {
              showDescription && <span className=" text-center mb-3 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
            { description  ? description :" Drag and drop your PNG, JPG, WebP, SVG images or MP4 videos here or browse"}
            </span>
            }
            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
          </div>
        </div>
      </div>

      {/* Cropper Modal */}
      <Dialog
        open={cropModalOpen}
        onOpenChange={(open) => {
          if (!open) {
          setCropModalOpen(false);
          setImageSrc(null);
          setOriginalFile(null);
          }
        }}
      >
        <DialogContent className="min-w-[90vw] xl:max-w-[1100px] w-[90vw]  p-0 overflow-hidden flex flex-col">
          <div className="flex flex-col max-h-[90vh] overflow-y-auto">
            <DialogHeader className="px-4 pt-4 lg:px-6 lg:pt-6 pb-2 flex-shrink-0">
              <DialogTitle>Crop Image</DialogTitle>
            </DialogHeader>

            {/* Cropper Container */}
            <div className="relative mx-2 max-w-full h-[400px] bg-gray-100 dark:bg-gray-800  rounded-xl overflow-hidden">
              {imageSrc && (
               <Cropper
                ref={cropperRef}
                src={imageSrc}
                onChange={onCropChange}
                stencilProps={{
                  aspectRatio: localAspect,
                }}
                className="cropper"
              />
              )}
            </div>

            {/* controls */}
            <div className="pb-2 px-2">
              {!isFixed && (
            <div className="mt-4 flex items-center gap-3">
              <label className="text-gray-700 dark:text-gray-400">Aspect Ratio:</label>
              <select
                value={localAspect ?? "free"}
                onChange={(e) => {
                  const val = e.target.value === "free" ? undefined : Number(e.target.value);
                  setLocalAspect(val);
                }}
                className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
              >
                {aspectOptions.map((opt) => (
                  <option key={opt.label} value={opt.value ?? "free"}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setCropModalOpen(false);
                setImageSrc(null);
                setOriginalFile(null);
              }}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white/90 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={onZoomChange}
              />
              <button
                type="button"
                onClick={generateCroppedImage}
                className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600"
              >
                Done
              </button>
            </div>
          </div>
            </div>

            
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dropzone;