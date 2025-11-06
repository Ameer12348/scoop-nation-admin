'use client';

import React from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';


interface RevenueComparisonChartProps {
  currentRevenue: number;
  previousRevenue: number;
  currentOrders: number;
  previousOrders: number;
  percentageChange: number;
  isLoading?: boolean;
}

export default function RevenueComparisonChart({
  currentRevenue,
  previousRevenue,
  currentOrders,
  previousOrders,
  percentageChange,
  isLoading,
}: RevenueComparisonChartProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  const options: ApexOptions = {
    chart: {
      type: 'bar',
      height: 280,
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: false,
      },
    },
    colors: ['#10B981', '#6B7280'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 8,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return 'PKR ' + val.toLocaleString();
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#6b7280'],
      },
    },
    xaxis: {
      categories: ['Previous Period', 'Current Period'],
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '13px',
          fontWeight: 600,
        },
      },
      axisBorder: {
        show: true,
        color: '#e5e7eb',
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        text: 'Revenue (PKR) ',
        style: {
          color: '#6b7280',
          fontSize: '14px',
          fontWeight: 600,
        },
      },
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        },
        formatter: (value) => {
          return 'PKR ' + value.toLocaleString();
        },
      },
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (value, { seriesIndex, dataPointIndex }) => {
          const orders = dataPointIndex === 0 ? previousOrders : currentOrders;
          return `PKR ${value.toLocaleString()} (${orders} orders)`;
        },
      },
    },
    annotations: {
      points: [
        {
          x: 'Current Period',
          y: currentRevenue,
          marker: {
            size: 6,
            fillColor: percentageChange >= 0 ? '#10B981' : '#EF4444',
            strokeColor: '#fff',
            strokeWidth: 2,
          },
          label: {
            borderColor: percentageChange >= 0 ? '#10B981' : '#EF4444',
            offsetY: 0,
            style: {
              color: '#fff',
              background: percentageChange >= 0 ? '#10B981' : '#EF4444',
              fontSize: '12px',
              fontWeight: 600,
            },
            text: `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(1)}%`,
          },
        },
      ],
    },
  };

  const series = [
    {
      name: 'Revenue',
      data: [previousRevenue, currentRevenue],
    },
  ];

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={280}
      />
    </div>
  );
}
