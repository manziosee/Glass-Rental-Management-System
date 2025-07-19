import React, { useState } from 'react';
import { Users, Wine, ShoppingCart, DollarSign, TrendingUp, Clock, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DashboardStats, Customer, Glassware, Order } from '../types';
import { stockService } from '../services/stockService';
import { formatRWF } from '../utils/csvExport';
import Modal from './Modal';

interface DashboardProps {
  stats: DashboardStats;
  customers: Customer[];
  glassware: Glassware[];
  orders: Order[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  onAddGlassware: (glassware: Omit<Glassware, 'id' | 'createdAt'>) => void;
  onAddOrder: (order: Omit<Order, 'id' | 'createdAt' | 'customerName' | 'glasswareType' | 'totalAmount'>) => void;
}

export default function Dashboard({ 
  stats, 
  customers, 
  glassware, 
  orders, 
  onAddCustomer, 
  onAddGlassware, 
  onAddOrder 
}: DashboardProps) {
  const [activeModal, setActiveModal] = useState<'customer' | 'glassware' | 'order' | null>(null);
  const [customerFormData, setCustomerFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventLocation: '',
    eventType: '',
  });
  const [glasswareFormData, setGlasswareFormData] = useState({
    type: '',
    description: '',
    quantityAvailable: 0,
    pricePerUnit: 0,
  });
  const [orderFormData, setOrderFormData] = useState({
    customerId: '',
    glasswareId: '',
    quantity: 1,
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    status: 'pending' as Order['status'],
  });
  const [availableStock, setAvailableStock] = useState<Record<string, number>>({});

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

  // Load available stock when order modal opens
  React.useEffect(() => {
    if (activeModal === 'order') {
      loadAvailableStock();
    }
  }, [activeModal]);

  const loadAvailableStock = async () => {
    try {
      const stockData = await stockService.getStockForOrders();
      const stockMap = stockData.reduce((acc, item) => {
        acc[item.glassType] = item.availableGlasses;
        return acc;
      }, {} as Record<string, number>);
      setAvailableStock(stockMap);
    } catch (error) {
      console.error('Error loading stock data:', error);
    }
  };

  // Prepare chart data
  const glasswareData = [
    { name: 'Beer', quantity: glassware.filter(g => g.type.includes('Beer')).reduce((sum, g) => sum + g.quantityAvailable, 0), fill: '#f59e0b' },
    { name: 'Wine', quantity: glassware.filter(g => g.type.includes('Wine')).reduce((sum, g) => sum + g.quantityAvailable, 0), fill: '#dc2626' },
    { name: 'Cocktail', quantity: glassware.filter(g => g.type.includes('Cocktail')).reduce((sum, g) => sum + g.quantityAvailable, 0), fill: '#7c3aed' },
    { name: 'Champagne', quantity: glassware.filter(g => g.type.includes('Champagne')).reduce((sum, g) => sum + g.quantityAvailable, 0), fill: '#eab308' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onAddCustomer(customerFormData);
      setActiveModal(null);
      setCustomerFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventLocation: '',
        eventType: '',
      });
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Error adding customer. Please try again.');
    }
  };

  const handleGlasswareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onAddGlassware(glasswareFormData);
      setActiveModal(null);
      setGlasswareFormData({
        type: '',
        description: '',
        quantityAvailable: 0,
        pricePerUnit: 0,
      });
    } catch (error) {
      console.error('Error adding glassware:', error);
      alert('Error adding glassware. Please try again.');
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      onAddOrder(orderFormData);
      setActiveModal(null);
      setOrderFormData({
        customerId: '',
        glasswareId: '',
        quantity: 1,
        orderDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        status: 'pending',
      });
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Error creating order. Please try again.');
    }
  };

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
            <p className="text-sm font-medium text-gray-900">{new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: true
            })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
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
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {stat.isRevenue ? stat.value : stat.value.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [formatRWF(Number(value)), 'Revenue']} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Inventory Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={glasswareData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="quantity"
                label={({ name, quantity }) => `${name}: ${quantity}`}
              >
                {glasswareData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveModal('customer')}
              className="w-full text-left p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 border border-blue-200"
            >
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-900">Add New Customer</p>
                  <p className="text-sm text-blue-700 mt-1">Create a new customer profile</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => setActiveModal('glassware')}
              className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-200 border border-purple-200"
            >
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-purple-900">Add Glassware</p>
                  <p className="text-sm text-purple-700 mt-1">Add new inventory items</p>
                </div>
              </div>
            </button>
            <button 
              onClick={() => setActiveModal('order')}
              className="w-full text-left p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-200 border border-green-200"
            >
              <div className="flex items-center gap-3">
                <Plus className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">Create Order</p>
                  <p className="text-sm text-green-700 mt-1">Process a new rental order</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
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

      {/* Customer Modal */}
      <Modal
        isOpen={activeModal === 'customer'}
        onClose={() => setActiveModal(null)}
        title="Add New Customer"
      >
        <form onSubmit={handleCustomerSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={customerFormData.name}
                onChange={(e) => setCustomerFormData({ ...customerFormData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={customerFormData.email}
                onChange={(e) => setCustomerFormData({ ...customerFormData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={customerFormData.phone}
                onChange={(e) => setCustomerFormData({ ...customerFormData, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={customerFormData.eventDate}
                onChange={(e) => setCustomerFormData({ ...customerFormData, eventDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Location
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={customerFormData.eventLocation}
              onChange={(e) => setCustomerFormData({ ...customerFormData, eventLocation: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Type
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={customerFormData.eventType}
              onChange={(e) => setCustomerFormData({ ...customerFormData, eventType: e.target.value })}
            >
              <option value="">Select event type</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Graduation">Graduation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Customer
            </button>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Glassware Modal */}
      <Modal
        isOpen={activeModal === 'glassware'}
        onClose={() => setActiveModal(null)}
        title="Add New Glassware"
      >
        <form onSubmit={handleGlasswareSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Glass Type
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={glasswareFormData.type}
              onChange={(e) => setGlasswareFormData({ ...glasswareFormData, type: e.target.value })}
              placeholder="e.g., Wine Glass, Champagne Flute"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={glasswareFormData.description}
              onChange={(e) => setGlasswareFormData({ ...glasswareFormData, description: e.target.value })}
              placeholder="Detailed description of the glassware"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Available
              </label>
              <input
                type="number"
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={glasswareFormData.quantityAvailable}
                onChange={(e) => setGlasswareFormData({ ...glasswareFormData, quantityAvailable: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Unit (RWF)
              </label>
              <input
                type="number"
                required
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={glasswareFormData.pricePerUnit}
                onChange={(e) => setGlasswareFormData({ ...glasswareFormData, pricePerUnit: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Glassware
            </button>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Order Modal */}
      <Modal
        isOpen={activeModal === 'order'}
        onClose={() => setActiveModal(null)}
        title="Create New Order"
      >
        <form onSubmit={handleOrderSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={orderFormData.customerId}
              onChange={(e) => setOrderFormData({ ...orderFormData, customerId: e.target.value })}
            >
              <option value="">Select a customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.eventType}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Glassware
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={orderFormData.glasswareId}
              onChange={(e) => setOrderFormData({ ...orderFormData, glasswareId: e.target.value })}
            >
              <option value="">Select glassware</option>
              {glassware.filter(item => availableStock[item.type] > 0).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.type} - {formatRWF(item.pricePerUnit)} ({availableStock[item.type] || 0} glasses available)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={orderFormData.quantity}
                onChange={(e) => setOrderFormData({ ...orderFormData, quantity: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={orderFormData.status}
                onChange={(e) => setOrderFormData({ ...orderFormData, status: e.target.value as Order['status'] })}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={orderFormData.orderDate}
                onChange={(e) => setOrderFormData({ ...orderFormData, orderDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Date
              </label>
              <input
                type="date"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={orderFormData.deliveryDate}
                onChange={(e) => setOrderFormData({ ...orderFormData, deliveryDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Order
            </button>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}