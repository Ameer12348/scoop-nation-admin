'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface OrdersStatusChartProps {
  data: {
    status: string;
    count: number;
    total_amount: number;
  }[];
  isLoading?: boolean;
  type?: 'donut' | 'bar';
}

const statusColorMap: Record<string, string> = {
  pending: '#F59E0B',
  processing: '#3B82F6',
  completed: '#10B981',
  delivered: '#8B5CF6',
  cancelled: '#EF4444',
  refunded: '#6B7280',
};

export default function OrdersStatusChart({ 
  data, 
  isLoading, 
  type = 'donut' 
}: OrdersStatusChartProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
        No order data available for this period
      </div>
    );
  }

  const labels = data.map(item => 
    item.status.charAt(0).toUpperCase() + item.status.slice(1)
  );
  const counts = data.map(item => item.count);
  const colors = data.map(item => statusColorMap[item.status.toLowerCase()] || '#6B7280');

  if (type === 'donut') {
    const donutOptions: ApexOptions = {
      chart: {
        type: 'donut',
        fontFamily: 'Inter, sans-serif',
      },
      labels: labels,
      colors: colors,
      dataLabels: {
        enabled: true,
        formatter: (val: number) => {
          return Math.round(val) + '%';
        },
        style: {
          fontSize: '14px',
          fontWeight: 600,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Orders',
                fontSize: '16px',
                fontWeight: 600,
                color: '#6b7280',
                formatter: () => {
                  const total = counts.reduce((acc, val) => acc + val, 0);
                  return total.toString();
                },
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 700,
                color: '#111827',
              },
            },
          },
        },
      },
      legend: {
        position: 'bottom',
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
        theme: 'light',
        y: {
          formatter: (value) => {
            return value.toString() + ' orders';
          },
        },
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
          },
        },
      ],
    };

    return (
      <div className="w-full">
        <ReactApexChart
          options={donutOptions}
          series={counts}
          type="donut"
          height={350}
        />
      </div>
    );
  }

  // Bar chart
  const barOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      fontFamily: 'Inter, sans-serif',
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
      },
    },
    colors: colors,
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: '60%',
        distributed: true,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => {
        return val.toString();
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#6b7280'],
      },
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px',
        },
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
    yaxis: {
      title: {
        text: 'Number of Orders',
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
        formatter: (value, { dataPointIndex }) => {
          const amount = data[dataPointIndex].total_amount;
          return `${value} orders ($${amount.toLocaleString()})`;
        },
      },
    },
  };

  const barSeries = [
    {
      name: 'Orders',
      data: counts,
    },
  ];

  return (
    <div className="w-full">
      <ReactApexChart
        options={barOptions}
        series={barSeries}
        type="bar"
        height={350}
      />
    </div>
  );
}
