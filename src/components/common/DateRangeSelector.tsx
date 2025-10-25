'use client';

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { DateRange } from '@/lib/analytics';

interface DateRangeOption {
  label: string;
  value: 'today' | 'this_week' | 'this_month' | 'last_30_days' | 'this_year' | 'custom';
}

const dateRangeOptions: DateRangeOption[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'this_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last 30 Days', value: 'last_30_days' },
  { label: 'This Year', value: 'this_year' },
  { label: 'Custom Range', value: 'custom' },
];

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  className?: string;
}

export default function DateRangeSelector({
  value,
  onChange,
  className = '',
}: DateRangeSelectorProps) {
  const [showCustomRange, setShowCustomRange] = useState(value.preset === 'custom');
  const [startDate, setStartDate] = useState(value.start || '');
  const [endDate, setEndDate] = useState(value.end || '');

  const handlePresetChange = (preset: DateRangeOption['value']) => {
    if (preset === 'custom') {
      setShowCustomRange(true);
      onChange({ preset, start: startDate, end: endDate });
    } else {
      setShowCustomRange(false);
      onChange({ preset });
    }
  };

  const handleCustomDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    onChange({ preset: 'custom', start, end });
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {dateRangeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handlePresetChange(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              value.preset === option.value
                ? 'bg-primary text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Custom Date Range Inputs */}
      {showCustomRange && (
        <div className="flex flex-wrap gap-3 items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Range:
            </span>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">
                From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleCustomDateChange(e.target.value, endDate)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <span className="text-gray-500 mt-5">—</span>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-600 dark:text-gray-400">
                To
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleCustomDateChange(startDate, e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
