import React from 'react';
import { Download, FileText, Users, Wine, ShoppingCart, TrendingUp } from 'lucide-react';
import { Customer, Glassware, Order } from '../types';
import { downloadCSV, formatRWF, formatDate } from '../utils/csvExport';

interface ReportsProps {
  customers: Customer[];
  glassware: Glassware[];
  orders: Order[];
}

export default function Reports({ customers, glassware, orders }: ReportsProps) {
  const handleDownloadCustomers = () => {
    const data = customers.map(customer => ({
      Name: customer.name,
      Email: customer.email,
      Phone: customer.phone,
      'Event Type': customer.eventType,
      'Event Date': formatDate(customer.eventDate),
      'Event Location': customer.eventLocation,
      'Created At': formatDate(customer.createdAt),
    }));
    downloadCSV(data, 'customers-report');
  };

  const handleDownloadGlassware = () => {
    const data = glassware.map(item => ({
      Type: item.type,
      Description: item.description,
      'Quantity Available': item.quantityAvailable,
      'Price per Unit': item.pricePerUnit,
      'Total Value': item.quantityAvailable * item.pricePerUnit,
      'Created At': formatDate(item.createdAt),
    }));
    downloadCSV(data, 'inventory-report');
  };

  const handleDownloadOrders = () => {
    const data = orders.map(order => ({
      'Order ID': order.id,
      'Customer Name': order.customerName,
      'Glassware Type': order.glasswareType,
      Quantity: order.quantity,
      'Order Date': formatDate(order.orderDate),
      'Delivery Date': formatDate(order.deliveryDate),
      Status: order.status,
      'Total Amount': order.totalAmount,
      'Created At': formatDate(order.createdAt),
    }));
    downloadCSV(data, 'orders-report');
  };

  const totalInventoryValue = glassware.reduce((sum, item) => 
    sum + (item.quantityAvailable * item.pricePerUnit), 0
  );

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  const reportCards = [
    {
      title: 'Customer Report',
      description: 'Complete list of all customers with event details',
      icon: Users,
      count: customers.length,
      action: handleDownloadCustomers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Inventory Report',
      description: 'Current stock levels and pricing information',
      icon: Wine,
      count: glassware.length,
      action: handleDownloadGlassware,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      subtext: `Total Value: ${formatRWF(totalInventoryValue)}`,
    },
    {
      title: 'Orders Report',
      description: 'Complete order history with status and amounts',
      icon: ShoppingCart,
      count: orders.length,
      action: handleDownloadOrders,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      subtext: `Total Revenue: ${formatRWF(totalRevenue)}`,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Download comprehensive reports for your business analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {reportCards.map((report, index) => {
          const Icon = report.icon;
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className={`${report.bgColor} p-3 rounded-lg w-fit mb-4`}>
                <Icon className={`h-6 w-6 ${report.textColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{report.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">{report.count}</span>
                  <span className="text-gray-500 ml-1">records</span>
                  {report.subtext && (
                    <p className="text-sm text-gray-600 mt-1">{report.subtext}</p>
                  )}
                </div>
              </div>
              <button
                onClick={report.action}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 ${report.color} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                <Download className="h-4 w-4" />
                Download CSV
              </button>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Quick Stats
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Customers</span>
              <span className="font-semibold text-gray-900">{customers.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Glassware Items</span>
              <span className="font-semibold text-gray-900">{glassware.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Orders</span>
              <span className="font-semibold text-gray-900">{orders.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Orders</span>
              <span className="font-semibold text-orange-600">
                {orders.filter(order => order.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-bold text-green-600">{formatRWF(totalRevenue)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Report Information
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Customer Report</h4>
              <p className="text-gray-600">
                Includes customer contact information, event details, and registration dates.
                Perfect for marketing and follow-up communications.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Inventory Report</h4>
              <p className="text-gray-600">
                Complete inventory listing with stock levels, pricing, and total values.
                Use for inventory management and financial planning.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Orders Report</h4>
              <p className="text-gray-600">
                Comprehensive order history with customer details, order status, and revenue tracking.
                Essential for business analysis and tax reporting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}