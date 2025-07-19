import { supabase } from '../lib/supabase';
import { Order } from '../types';
import { stockService } from './stockService';

export const orderService = {
  // Get all orders with customer and glassware details
  async getAll(): Promise<Order[]> {
    const { data, error } = await supabase
      .from('order_details')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }

    return data.map(order => ({
      id: order.id,
      customerId: order.customer_id,
      customerName: order.customer_name,
      glasswareId: order.glassware_id,
      glasswareType: order.glassware_type,
      quantity: order.quantity,
      orderDate: order.order_date,
      deliveryDate: order.delivery_date,
      status: order.status,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
    }));
  },

  // Create a new order
  async create(orderData: Omit<Order, 'id' | 'createdAt' | 'customerName' | 'glasswareType' | 'totalAmount'>): Promise<Order> {
    try {
      // Check stock availability before creating order
      const { data: glasswareData, error: glasswareError } = await supabase
        .from('glassware')
        .select('type')
        .eq('id', orderData.glasswareId)
        .single();

      if (glasswareError) {
        throw new Error('Glassware not found');
      }

      const availableGlasses = await stockService.getAvailableGlasses(glasswareData.type);
      if (availableGlasses < orderData.quantity) {
        throw new Error(`Insufficient inventory. Only ${availableGlasses} glasses available for ${glasswareData.type}`);
      }

      const { data, error } = await supabase
        .from('orders')
        .insert({
          customer_id: orderData.customerId,
          glassware_id: orderData.glasswareId,
          quantity: orderData.quantity,
          order_date: orderData.orderDate,
          delivery_date: orderData.deliveryDate,
          status: orderData.status,
        })
        .select()
        .single();

      if (error) {
        if (error.message.includes('Insufficient inventory')) {
          throw new Error(error.message);
        }
        throw new Error('Failed to create order');
      }

      // Fetch the complete order details
      const { data: orderDetails, error: detailsError } = await supabase
        .from('order_details')
        .select('*')
        .eq('id', data.id)
        .single();

      if (detailsError) {
        console.error('Error fetching order details:', detailsError);
        throw new Error('Failed to fetch order details');
      }

      return {
        id: orderDetails.id,
        customerId: orderDetails.customer_id,
        customerName: orderDetails.customer_name,
        glasswareId: orderDetails.glassware_id,
        glasswareType: orderDetails.glassware_type,
        quantity: orderDetails.quantity,
        orderDate: orderDetails.order_date,
        deliveryDate: orderDetails.delivery_date,
        status: orderDetails.status,
        totalAmount: orderDetails.total_amount,
        createdAt: orderDetails.created_at,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update an order
  async update(id: string, updates: Partial<Order>): Promise<Order> {
    try {
      const updateData: any = {};
      
      if (updates.customerId) updateData.customer_id = updates.customerId;
      if (updates.glasswareId) updateData.glassware_id = updates.glasswareId;
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.orderDate) updateData.order_date = updates.orderDate;
      if (updates.deliveryDate) updateData.delivery_date = updates.deliveryDate;
      if (updates.status) updateData.status = updates.status;

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.message.includes('Insufficient inventory')) {
          throw new Error(error.message);
        }
        throw new Error('Failed to update order');
      }

      // Fetch the complete order details
      const { data: orderDetails, error: detailsError } = await supabase
        .from('order_details')
        .select('*')
        .eq('id', data.id)
        .single();

      if (detailsError) {
        console.error('Error fetching order details:', detailsError);
        throw new Error('Failed to fetch order details');
      }

      return {
        id: orderDetails.id,
        customerId: orderDetails.customer_id,
        customerName: orderDetails.customer_name,
        glasswareId: orderDetails.glassware_id,
        glasswareType: orderDetails.glassware_type,
        quantity: orderDetails.quantity,
        orderDate: orderDetails.order_date,
        deliveryDate: orderDetails.delivery_date,
        status: orderDetails.status,
        totalAmount: orderDetails.total_amount,
        createdAt: orderDetails.created_at,
      };
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  // Delete an order
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },
};