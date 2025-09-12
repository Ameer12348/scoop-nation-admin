"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import Switch from "../form/switch/Switch";

interface BannerItem {
  id: number;
  appBanner: string;
  webBanner?: string;
  priority: number;
  itemName: string;
  active: boolean;
}

const initialData: BannerItem[] = [
  {
    id: 1,
    appBanner: "/images/carousel/carousel-01.png",
    webBanner: "/images/carousel/carousel-02.png",
    priority: 1,
    itemName: "Shawarma 1",
    active: true,
  },
  {
    id: 2,
    appBanner: "/images/carousel/carousel-03.png",
    webBanner: "/images/carousel/carousel-04.png",
    priority: 2,
    itemName: "Shawarma 2",
    active: false,
  },
  {
    id: 3,
    appBanner: "/images/carousel/carousel-03.png",
    webBanner: "/images/carousel/carousel-04.png",
    priority: 3,
    itemName: "Shawarma 3",
    active: false,
  },
  {
    id: 4,
    appBanner: "/images/carousel/carousel-01.png",
    webBanner: "/images/carousel/carousel-02.png",
    priority: 4,
    itemName: "Shawarma 4",
    active: false,
  },
];

export default function BannerTable() {
  const [data, setData] = useState(initialData);

  const toggleActive = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  return (
    <div className="w-full">

        {/* ✅ Scrollable on small screens */}
        <div className="overflow-x-auto hidden md:block">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-left text-xs md:text-sm">
              <tr>
                <th className="px-3 py-2 border">APP BANNER</th>
                <th className="px-3 py-2 border">WEB BANNER</th>
                <th className="px-3 py-2 border">PRIORITY</th>
                <th className="px-3 py-2 border">ITEM NAME</th>
                <th className="px-3 py-2 border">ACTIVE/IN-ACTIVE</th>
                <th className="px-3 py-2 border">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-3 py-2 border">
                    <Image
                      src={item.appBanner}
                      alt="app banner"
                      width={90}
                      height={55}
                      className="rounded object-cover"
                    />
                  </td>
                  <td className="px-3 py-2 border">
                    {item.webBanner ? (
                      <Image
                        src={item.webBanner}
                        alt="web banner"
                        width={90}
                        height={55}
                        className="rounded object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 border text-center">
                    {item.priority}
                  </td>
                  <td className="px-3 py-2 border">{item.itemName}</td>
                  <td className="px-3 py-2 border">
                    <div className="flex items-center gap-2">
                    <Switch label={item.active ? "Active" : "In-Active"} defaultChecked={item.active} onChange={(checked) => toggleActive(item.id)} />

                    </div>
                  </td>
                  <td className="px-3 py-2 border text-center">
                    <Button variant="ghost" size="icon">
                      <FaRegEdit className="text-lg text-gray-600" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile-friendly stacked view */}
        <div className="grid gap-4 mt-6 md:hidden">
          {data.map((item,index) => (
            <div
              key={item.id}
              className="border rounded-lg p-3 shadow-sm bg-white"
            >
              <div className="flex items-center justify-between">
                <Image
                  src={item.appBanner}
                  alt="app banner"
                  width={100}
                  height={60}
                  className="rounded object-cover"
                />
                <Button variant="ghost" size="icon">
                  <FaRegEdit className="text-lg text-gray-600" />
                </Button>
              </div>
              <div className="mt-2 text-sm space-y-1">
                <p>
                  <span className="font-medium">Priority:</span>{" "}
                  {item.priority}
                </p>
                <p>
                  <span className="font-medium">Item:</span> {item.itemName}
                </p>
                <div className="flex items-center gap-2">
                  
                  <Switch label={item.active ? "Active" : "In-Active"} defaultChecked={item.active} onChange={(checked) => toggleActive(item.id)} />
                </div>
              </div>
            </div>
          ))}
        </div>
        
    </div>
  );
}
