import { supabase } from '../lib/supabase';
import { Customer } from '../types';

export const customerService = {
  // Get all customers
  async getAll(): Promise<Customer[]> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      throw new Error('Failed to fetch customers');
    }

    return data.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      eventDate: customer.event_date,
      eventLocation: customer.event_location,
      eventType: customer.event_type,
      createdAt: customer.created_at,
    }));
  },

  // Create a new customer
  async create(customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          event_date: customerData.eventDate,
          event_location: customerData.eventLocation,
          event_type: customerData.eventType,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('A customer with this email already exists');
        }
        throw new Error('Failed to create customer');
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.event_date,
        eventLocation: data.event_location,
        eventType: data.event_type,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  // Update a customer
  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    try {
      const updateData: Record<string, unknown> = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.email) updateData.email = updates.email;
      if (updates.phone) updateData.phone = updates.phone;
      if (updates.eventDate) updateData.event_date = updates.eventDate;
      if (updates.eventLocation) updateData.event_location = updates.eventLocation;
      if (updates.eventType) updateData.event_type = updates.eventType;

      const { data, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('A customer with this email already exists');
        }
        throw new Error('Failed to update customer');
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        eventDate: data.event_date,
        eventLocation: data.event_location,
        eventType: data.event_type,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete a customer
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error('Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },
};