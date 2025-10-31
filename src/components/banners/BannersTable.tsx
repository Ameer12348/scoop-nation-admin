"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import Switch from "../form/switch/Switch";
import { Banner, deleteBanner } from "@/store/slices/bannerSlice";
import Link from "next/link";
import { BASE_URL, IMAGE_BASE_URL } from "@/consts";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Loader, Trash2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";



type BannerTableProps = {
  banners:Banner[]
}


export default function BannerTable({banners}:BannerTableProps) {
  const dispatch = useAppDispatch();
  const { deleteBanner: { loading: deleteBannerLoading } } = useAppSelector(state => state.banners);

  // Handle deleting a banner
  const handleDelete = (id: string) => {
    dispatch(deleteBanner(id));
  };

  return (
    <div className="w-full">

        {/* ✅ Scrollable on small screens */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-left text-xs md:text-sm">
              <tr>
                {/* <th className="px-3 py-2 border">APP BANNER</th> */}
                <th className="px-3 py-2 border">WEB BANNER</th>
                <th className="px-3 py-2 border">PRIORITY</th>
                <th className="px-3 py-2 border">ITEM NAME</th>
                <th className="px-3 py-2 border">ACTIVE/IN-ACTIVE</th>
                <th className="px-3 py-2 border">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* <td className="px-3 py-2 border">
                    <img
                      src={'/'}
                      alt="app banner"
                      width={90}
                      height={55}
                      className="rounded object-cover"
                    />
                  </td> */}
                  <td className="px-3 py-2 border">
                      <img
                        src={`${IMAGE_BASE_URL}/`+item.media[0].image}
                        alt="web banner"
                        width={90}
                        height={55}
                        className="rounded object-cover"
                      />
                    
                  </td>
                  <td className="px-3 py-2 border text-center">
                    {''}
                  </td>
                  <td className="px-3 py-2 border">{item.name}</td>
                  <td className="px-3 py-2 border">
                    <div className="flex items-center gap-2">
                    {/* <Switch label={item.is_active ? "Active" : "In-Active"} defaultChecked={item.is_active} onChange={(checked) => toggleActive(item.id)} /> */}
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item?.is_active == '1'
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item?.is_active == '1' ? "Active" : "In-Active"}
                    </span>
                    
                    </div>
                  </td>
                  <td className="px-3 py-2 border text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Link href={`/banners/edit?bannerId=${item.id}`}  className="inline-block p-1 text-blue-600 hover:text-blue-800">
                        <FaRegEdit className="text-lg" />
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            {
                              deleteBannerLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 size={16} />
                            }
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure you want to delete {item.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the banner
                              and remove the data from the server.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(item.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile-friendly stacked view */}
        <div className="grid gap-4 mt-6 md:hidden p-3">
          {banners.map((item, /* index*/) => (
            <div
              key={item.id}
              className="border rounded-lg p-3 shadow-sm bg-white"
            >
              <div className="flex items-center justify-between">
                <img
                  src={`${IMAGE_BASE_URL}/`+item.media[0].image}
                  alt="webbanner"
                  width={100}
                  height={60}
                  className="rounded object-cover"
                />
                <div className="flex space-x-2">
                  <Link href={`/banners/edit?bannerId=${item.id}`}  className="inline-block p-1 text-blue-600 hover:text-blue-800">
                    <FaRegEdit className="text-lg" />
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        {
                          deleteBannerLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 size={16} />
                        }
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure you want to delete {item.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the banner
                          and remove the data from the server.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="mt-2 text-sm space-y-1">
                <p>
                  <span className="font-medium">Priority:</span>{" "}
                  {/* {item.priority} */}
                </p>
                <p>
                  <span className="font-medium">Item:</span> {item.name}
                </p>
                <div className="flex items-center gap-2">
                  
                  {/* <Switch label={item.active ? "Active" : "In-Active"} defaultChecked={item.active} onChange={(  checked ) => toggleActive(item.id)} /> */}
                   <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item?.is_active == '1' 
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item?.is_active == '1' ? "Active" : "In-Active"}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
    </div>
  );
}
