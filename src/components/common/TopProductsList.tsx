'use client';

import React from 'react';
import Image from 'next/image';
import { TopProduct } from '@/lib/analytics';
import { Package, TrendingUp } from 'lucide-react';
import { BASE_URL } from '@/consts';

interface TopProductsListProps {
  products: TopProduct[];
  isLoading?: boolean;
}

export default function TopProductsList({ products, isLoading }: TopProductsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg animate-pulse"
          >
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-600 dark:text-gray-400">
          No products found for this period
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          {/* Rank */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
            {index + 1}
          </div>
          {/* Product Image */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {product.mainImage ? (
              <img
                src={`${BASE_URL}/` +product.mainImage}
                alt={product.title}
                className="object-cover object-contan"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
              {product.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {product.category_name}
            </p>
          </div>

          {/* Stats */}
          <div className="text-right">
            <div className="flex items-center gap-1 text-green-600 dark:text-green-500 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">
                {product.total_quantity}
              </span>
              <span className="text-xs">sold</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              PKR {product.total_revenue.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
