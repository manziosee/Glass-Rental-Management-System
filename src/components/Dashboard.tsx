import React from 'react';
import { Users, Wine, ShoppingCart, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { DashboardStats } from '../types';
import { formatRWF } from '../utils/csvExport';

interface DashboardProps {
  stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      change: '+12%',
      changeColor: 'text-green-600',
    },
    {
      title: 'Total Glassware Items',
      value: stats.totalGlassware,
      icon: Wine,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      change: '+8%',
      changeColor: 'text-green-600',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-r from-green-50 to-green-100',
      textColor: 'text-green-700',
      change: '+24%',
      changeColor: 'text-green-600',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-r from-orange-50 to-orange-100',
      textColor: 'text-orange-700',
      change: '-5%',
      changeColor: 'text-red-600',
    },
    {
      title: 'Total Revenue',
      value: formatRWF(stats.totalRevenue),
      icon: DollarSign,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      bgColor: 'bg-gradient-to-r from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-700',
      isRevenue: true,
      change: '+18%',
      changeColor: 'text-green-600',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last updated</p>
            <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-6">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.isRevenue ? stat.value : stat.value.toLocaleString()}
                </p>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 border border-blue-200">
              <p className="font-semibold text-blue-900">Add New Customer</p>
              <p className="text-sm text-blue-700 mt-1">Create a new customer profile</p>
            </button>
            <button className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-200 border border-purple-200">
              <p className="font-semibold text-purple-900">Add Glassware</p>
              <p className="text-sm text-purple-700 mt-1">Add new inventory items</p>
            </button>
            <button className="w-full text-left p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-200 border border-green-200">
              <p className="font-semibold text-green-900">Create Order</p>
              <p className="text-sm text-green-700 mt-1">Process a new rental order</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">System Status</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Database</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Last Backup</span>
              <span className="text-sm font-medium text-gray-900">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Active Users</span>
              <span className="text-sm font-medium text-gray-900">1 online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}