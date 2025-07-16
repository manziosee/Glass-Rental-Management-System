export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  eventLocation: string;
  eventType: string;
  createdAt: string;
}

export interface Glassware {
  id: string;
  type: string;
  description: string;
  quantityAvailable: number;
  pricePerUnit: number;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  glasswareId: string;
  glasswareType: string;
  quantity: number;
  orderDate: string;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'returned' | 'cancelled';
  totalAmount: number;
  createdAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalGlassware: number;
  pendingOrders: number;
  totalRevenue: number;
}