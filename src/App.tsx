import React, { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import CustomerManagement from './components/CustomerManagement';
import GlasswareManagement from './components/GlasswareManagement';
import OrderManagement from './components/OrderManagement';
import InventoryOverview from './components/InventoryOverview';
import Reports from './components/Reports';
import { Customer, Glassware, Order, DashboardStats } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const [customers, setCustomers] = useLocalStorage<Customer[]>('glass-rental-customers', []);
  const [glassware, setGlassware] = useLocalStorage<Glassware[]>('glass-rental-glassware', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('glass-rental-orders', []);

  // Initialize with sample data if empty
  useEffect(() => {
    if (customers.length === 0) {
      const sampleCustomers: Customer[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '+1 (555) 123-4567',
          eventDate: '2024-02-14',
          eventLocation: 'Grand Hotel Ballroom',
          eventType: 'Wedding',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Michael Corporation',
          email: 'events@michael-corp.com',
          phone: '+1 (555) 987-6543',
          eventDate: '2024-02-20',
          eventLocation: 'Corporate Center',
          eventType: 'Corporate Event',
          createdAt: new Date().toISOString(),
        },
      ];
      setCustomers(sampleCustomers);
    }

    if (glassware.length === 0) {
      const sampleGlassware: Glassware[] = [
        {
          id: '1',
          type: 'Beer Glass',
          description: 'Premium beer glasses - Individual rental',
          quantityAvailable: 240,
          pricePerUnit: 400,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          type: 'Wine Glass',
          description: 'Elegant wine glasses - Individual rental',
          quantityAvailable: 144,
          pricePerUnit: 450,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          type: 'Cocktail Glass',
          description: 'Stylish cocktail glasses - Individual rental',
          quantityAvailable: 144,
          pricePerUnit: 500,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          type: 'Beer Glass Small Box',
          description: 'Beer glasses small box (6 glasses)',
          quantityAvailable: 40,
          pricePerUnit: 2400,
          createdAt: new Date().toISOString(),
        },
        {
          id: '5',
          type: 'Beer Glass Large Box',
          description: 'Beer glasses large box (48 glasses = 8 small boxes)',
          quantityAvailable: 5,
          pricePerUnit: 19200,
          createdAt: new Date().toISOString(),
        },
        {
          id: '6',
          type: 'Wine Glass Small Box',
          description: 'Wine glasses small box (6 glasses)',
          quantityAvailable: 24,
          pricePerUnit: 2700,
          createdAt: new Date().toISOString(),
        },
        {
          id: '7',
          type: 'Wine Glass Large Box',
          description: 'Wine glasses large box (48 glasses = 8 small boxes)',
          quantityAvailable: 3,
          pricePerUnit: 21600,
          createdAt: new Date().toISOString(),
        },
        {
          id: '8',
          type: 'Cocktail Glass Small Box',
          description: 'Cocktail glasses small box (6 glasses)',
          quantityAvailable: 24,
          pricePerUnit: 4000,
          createdAt: new Date().toISOString(),
        },
        {
          id: '9',
          type: 'Cocktail Glass Large Box',
          description: 'Cocktail glasses large box (48 glasses = 8 small boxes)',
          quantityAvailable: 3,
          pricePerUnit: 32000,
          createdAt: new Date().toISOString(),
        },
        {
          id: '10',
          type: 'Champagne Glass',
          description: 'Premium champagne flutes - Individual rental',
          quantityAvailable: 96,
          pricePerUnit: 450,
          createdAt: new Date().toISOString(),
        },
        {
          id: '11',
          type: 'Champagne Glass Small Box',
          description: 'Champagne glasses small box (6 glasses)',
          quantityAvailable: 16,
          pricePerUnit: 2700,
          createdAt: new Date().toISOString(),
        },
        {
          id: '12',
          type: 'Champagne Glass Large Box',
          description: 'Champagne glasses large box (48 glasses = 8 small boxes)',
          quantityAvailable: 2,
          pricePerUnit: 21600,
          createdAt: new Date().toISOString(),
        },
      ];
      setGlassware(sampleGlassware);
    }
  }, [customers.length, glassware.length, setCustomers, setGlassware]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('dashboard');
  };

  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
  };

  const deleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(customer => customer.id !== id));
      // Also delete related orders
      setOrders(orders.filter(order => order.customerId !== id));
    }
  };

  const addGlassware = (glasswareData: Omit<Glassware, 'id' | 'createdAt'>) => {
    const newGlassware: Glassware = {
      ...glasswareData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setGlassware([...glassware, newGlassware]);
  };

  const updateGlassware = (id: string, updates: Partial<Glassware>) => {
    setGlassware(glassware.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteGlassware = (id: string) => {
    if (confirm('Are you sure you want to delete this glassware item?')) {
      setGlassware(glassware.filter(item => item.id !== id));
      // Also delete related orders
      setOrders(orders.filter(order => order.glasswareId !== id));
    }
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'customerName' | 'glasswareType' | 'totalAmount'>) => {
    const customer = customers.find(c => c.id === orderData.customerId);
    const glasswareItem = glassware.find(g => g.id === orderData.glasswareId);
    
    if (!customer || !glasswareItem) {
      alert('Customer or glassware not found');
      return;
    }

    if (glasswareItem.quantityAvailable < orderData.quantity) {
      alert('Not enough stock available');
      return;
    }

    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      customerName: customer.name,
      glasswareType: glasswareItem.type,
      totalAmount: glasswareItem.pricePerUnit * orderData.quantity,
      createdAt: new Date().toISOString(),
    };

    setOrders([...orders, newOrder]);
    
    // Update glassware quantity
    updateGlassware(orderData.glasswareId, {
      quantityAvailable: glasswareItem.quantityAvailable - orderData.quantity
    });
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    // If quantity is being updated, adjust stock accordingly
    if (updates.quantity && updates.quantity !== order.quantity) {
      const glasswareItem = glassware.find(g => g.id === order.glasswareId);
      if (glasswareItem) {
        const quantityDiff = order.quantity - updates.quantity;
        updateGlassware(order.glasswareId, {
          quantityAvailable: glasswareItem.quantityAvailable + quantityDiff
        });
      }
    }

    // Recalculate total amount if quantity changed
    if (updates.quantity) {
      const glasswareItem = glassware.find(g => g.id === order.glasswareId);
      if (glasswareItem) {
        updates.totalAmount = glasswareItem.pricePerUnit * updates.quantity;
      }
    }

    setOrders(orders.map(order => 
      order.id === id ? { ...order, ...updates } : order
    ));
  };

  const deleteOrder = (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      const order = orders.find(o => o.id === id);
      if (order) {
        // Return stock to inventory
        const glasswareItem = glassware.find(g => g.id === order.glasswareId);
        if (glasswareItem) {
          updateGlassware(order.glasswareId, {
            quantityAvailable: glasswareItem.quantityAvailable + order.quantity
          });
        }
      }
      setOrders(orders.filter(order => order.id !== id));
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

  if (!isLoggedIn) {
    return <AuthForm onLogin={handleLogin} />;
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard stats={getDashboardStats()} />;
      case 'inventory':
        return <InventoryOverview glassware={glassware} />;
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
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
      <div className="flex-1 overflow-auto bg-gray-50">
        {renderActiveSection()}
      </div>
    </div>
  );
}

export default App;