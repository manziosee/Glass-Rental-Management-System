import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import CustomerManagement from './components/CustomerManagement';
import GlasswareManagement from './components/GlasswareManagement';
import OrderManagement from './components/OrderManagement';
import InventoryOverview from './components/InventoryOverview';
import Reports from './components/Reports';
import StockManagement from './components/StockManagement';
import { Customer, Glassware, Order, DashboardStats } from './types';
import { authService } from './services/authService';
import { customerService } from './services/customerService';
import { glasswareService } from './services/glasswareService';
import { orderService } from './services/orderService';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [glassware, setGlassware] = useState<Glassware[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsLoggedIn(true);
        setUser(session.user);
        loadAllData();
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setUser(null);
        setCustomers([]);
        setGlassware([]);
        setOrders([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const session = await authService.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUser(session.user);
        await loadAllData();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [customersData, glasswareData, ordersData] = await Promise.all([
        customerService.getAll(),
        glasswareService.getAll(),
        orderService.getAll()
      ]);
      
      setCustomers(customersData);
      setGlassware(glasswareData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data. Please refresh the page.');
    }
  };

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const handleLogin = () => {
    setShowLanding(false);
    setIsLoggedIn(true);
    loadAllData();
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setIsLoggedIn(false);
      setUser(null);
      setActiveSection('dashboard');
      setCustomers([]);
      setGlassware([]);
      setOrders([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Customer CRUD operations
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    try {
      const newCustomer = await customerService.create(customerData);
      setCustomers([newCustomer, ...customers]);
    } catch (error: any) {
      console.error('Error adding customer:', error);
      alert(error.message || 'Error adding customer');
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const updatedCustomer = await customerService.update(id, updates);
      setCustomers(customers.map(customer => 
        customer.id === id ? updatedCustomer : customer
      ));
    } catch (error: any) {
      console.error('Error updating customer:', error);
      alert(error.message || 'Error updating customer');
    }
  };

  const deleteCustomer = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer? This will also delete all related orders.')) {
      try {
        await customerService.delete(id);
        setCustomers(customers.filter(customer => customer.id !== id));
        setOrders(orders.filter(order => order.customerId !== id));
      } catch (error: any) {
        console.error('Error deleting customer:', error);
        alert(error.message || 'Error deleting customer');
      }
    }
  };

  // Glassware CRUD operations
  const addGlassware = async (glasswareData: Omit<Glassware, 'id' | 'createdAt'>) => {
    try {
      const newGlassware = await glasswareService.create(glasswareData);
      setGlassware([newGlassware, ...glassware]);
    } catch (error: any) {
      console.error('Error adding glassware:', error);
      alert(error.message || 'Error adding glassware');
    }
  };

  const updateGlassware = async (id: string, updates: Partial<Glassware>) => {
    try {
      const updatedGlassware = await glasswareService.update(id, updates);
      setGlassware(glassware.map(item => 
        item.id === id ? updatedGlassware : item
      ));
    } catch (error: any) {
      console.error('Error updating glassware:', error);
      alert(error.message || 'Error updating glassware');
    }
  };

  const deleteGlassware = async (id: string) => {
    if (confirm('Are you sure you want to delete this glassware item? This will also delete all related orders.')) {
      try {
        await glasswareService.delete(id);
        setGlassware(glassware.filter(item => item.id !== id));
        setOrders(orders.filter(order => order.glasswareId !== id));
      } catch (error: any) {
        console.error('Error deleting glassware:', error);
        alert(error.message || 'Error deleting glassware');
      }
    }
  };

  // Order CRUD operations
  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'customerName' | 'glasswareType' | 'totalAmount'>) => {
    try {
      const newOrder = await orderService.create(orderData);
      setOrders([newOrder, ...orders]);
      
      // Update local glassware quantity
      const glasswareItem = glassware.find(g => g.id === orderData.glasswareId);
      if (glasswareItem) {
        const updatedGlassware = await glasswareService.getAll();
        setGlassware(updatedGlassware);
      }
    } catch (error: any) {
      console.error('Error adding order:', error);
      alert(error.message || 'Error creating order');
    }
  };

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const updatedOrder = await orderService.update(id, updates);
      setOrders(orders.map(order => 
        order.id === id ? updatedOrder : order
      ));
      
      // Refresh glassware data to reflect inventory changes
      const updatedGlassware = await glasswareService.getAll();
      setGlassware(updatedGlassware);
    } catch (error: any) {
      console.error('Error updating order:', error);
      alert(error.message || 'Error updating order');
    }
  };

  const deleteOrder = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.delete(id);
        setOrders(orders.filter(order => order.id !== id));
        
        // Refresh glassware data to reflect inventory changes
        const updatedGlassware = await glasswareService.getAll();
        setGlassware(updatedGlassware);
      } catch (error: any) {
        console.error('Error deleting order:', error);
        alert(error.message || 'Error deleting order');
      }
    }
  };

  const getDashboardStats = (): DashboardStats => {
    return {
      totalCustomers: customers.length,
      totalOrders: orders.length,
      totalGlassware: glassware.reduce((sum, item) => sum + item.quantityAvailable, 0),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (!isLoggedIn) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            stats={getDashboardStats()} 
            customers={customers}
            glassware={glassware}
            orders={orders}
            onAddCustomer={addCustomer}
            onAddGlassware={addGlassware}
            onAddOrder={addOrder}
          />
        );
      case 'inventory':
        return <InventoryOverview glassware={glassware} />;
      case 'stock':
        return <StockManagement />;
      case 'customers':
        return (
          <CustomerManagement
            customers={customers}
            onAddCustomer={addCustomer}
            onUpdateCustomer={updateCustomer}
            onDeleteCustomer={deleteCustomer}
          />
        );
      case 'glassware':
        return (
          <GlasswareManagement
            glassware={glassware}
            onAddGlassware={addGlassware}
            onUpdateGlassware={updateGlassware}
            onDeleteGlassware={deleteGlassware}
          />
        );
      case 'orders':
        return (
          <OrderManagement
            orders={orders}
            customers={customers}
            glassware={glassware}
            onAddOrder={addOrder}
            onUpdateOrder={updateOrder}
            onDeleteOrder={deleteOrder}
          />
        );
      case 'reports':
        return <Reports customers={customers} glassware={glassware} orders={orders} />;
      default:
        return <Dashboard stats={getDashboardStats()} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        userEmail={user?.email}
      />
      <div className="flex-1 overflow-auto bg-gray-50 lg:ml-0 ml-64">
        {renderActiveSection()}
      </div>
    </div>
  );
}

export default App;