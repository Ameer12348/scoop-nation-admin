"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import Switch from "../form/switch/Switch";
import { Banner } from "@/store/slices/bannerSlice";
import Link from "next/link";



type BannerTableProps = {
  banners:Banner[]
}


export default function BannerTable({banners}:BannerTableProps) {



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
                    <Image
                      src={'/'}
                      alt="app banner"
                      width={90}
                      height={55}
                      className="rounded object-cover"
                    />
                  </td> */}
                  <td className="px-3 py-2 border">
                      <Image
                        src={'/'}
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
                        item.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.is_active ? "Active" : "In-Active"}
                    </span>
                    
                    </div>
                  </td>
                  <td className="px-3 py-2 border text-center">
                    <Link href={'/banners/edit/'+item.id}  className="inline-block "  onClick={()=>{}}>
                      <FaRegEdit className="text-lg text-gray-600" />
                    </Link>
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
                <Image
                  src={'/'}
                  alt="webbanner"
                  width={100}
                  height={60}
                  className="rounded object-cover"
                />
                    <Link href={'/banners/edit/'+item.id}  className="inline-block "  onClick={()=>{}}>
                      <FaRegEdit className="text-lg text-gray-600" />
                </Link>
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
                        item.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.is_active ? "Active" : "In-Active"}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
    </div>
  );
}
