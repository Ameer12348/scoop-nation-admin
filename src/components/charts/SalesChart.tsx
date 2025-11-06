'use client';

import React from 'react';
import { ApexOptions } from 'apexcharts';
import { format } from 'date-fns';
import ReactApexChart from 'react-apexcharts';


interface SalesChartProps {
  data: {
    total_orders: number;
    total_sales: number;
    average_order_value: number;
    order_date: string;
  }[];
  isLoading?: boolean;
}

export default function SalesChart({ data, isLoading }: SalesChartProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  // Sort data by date
  const sortedData = [...data].sort((a, b) => 
    new Date(a.order_date).getTime() - new Date(b.order_date).getTime()
  );

  // Prepare chart data
  const categories = sortedData.map(item => 
    format(new Date(item.order_date), 'MMM dd')
  );
  
  const salesData = sortedData.map(item => item.total_sales);
  const ordersData = sortedData.map(item => item.total_orders);

  const options: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: true,
        tools: {
          download: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
      },
    },
    colors: ['#10B981', '#3B82F6'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        },
        rotate: -45,
        rotateAlways: false,
      },
      axisBorder: {
        show: true,
        color: '#e5e7eb',
      },
      axisTicks: {
        show: true,
        color: '#e5e7eb',
      },
    },
    yaxis: [
      {
        title: {
          text: 'Sales (PKR) ',
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
      {
        opposite: true,
        title: {
          text: 'Orders',
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
            return Math.round(value).toString();
          },
        },
      },
    ],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '14px',
      fontWeight: 500,
      labels: {
        colors: '#6b7280',
      },
      markers: {
        size: 6,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'light',
      x: {
        show: true,
      },
      y: [
        {
          formatter: (value) => {
            return 'PKR ' + value.toLocaleString();
          },
        },
        {
          formatter: (value) => {
            return value.toString() + ' orders';
          },
        },
      ],
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: 'bottom',
          },
          xaxis: {
            labels: {
              rotate: -90,
            },
          },
        },
      },
    ],
  };

  const series = [
    {
      name: 'Sales',
      data: salesData,
    },
    {
      name: 'Orders',
      data: ordersData,
    },
  ];

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
        No sales data available for this period
      </div>
    );
  }

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
}
