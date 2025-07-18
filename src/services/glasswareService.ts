import { supabase } from '../lib/supabase';
import { Glassware } from '../types';

export const glasswareService = {
  // Get all glassware
  async getAll(): Promise<Glassware[]> {
    const { data, error } = await supabase
      .from('glassware')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching glassware:', error);
      throw new Error('Failed to fetch glassware');
    }

    return data.map(item => ({
      id: item.id,
      type: item.type,
      description: item.description,
      quantityAvailable: item.quantity_available,
      pricePerUnit: item.price_per_unit,
      createdAt: item.created_at,
    }));
  },

  // Create new glassware
  async create(glasswareData: Omit<Glassware, 'id' | 'createdAt'>): Promise<Glassware> {
    try {
      const { data, error } = await supabase
        .from('glassware')
        .insert({
          type: glasswareData.type,
          description: glasswareData.description,
          quantity_available: glasswareData.quantityAvailable,
          price_per_unit: glasswareData.pricePerUnit,
        })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to create glassware');
      }

      return {
        id: data.id,
        type: data.type,
        description: data.description,
        quantityAvailable: data.quantity_available,
        pricePerUnit: data.price_per_unit,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error creating glassware:', error);
      throw error;
    }
  },

  // Update glassware
  async update(id: string, updates: Partial<Glassware>): Promise<Glassware> {
    try {
      const updateData: Partial<{
        type: string;
        description: string;
        quantity_available: number;
        price_per_unit: number;
      }> = {};
      
      if (updates.type) updateData.type = updates.type;
      if (updates.description) updateData.description = updates.description;
      if (updates.quantityAvailable !== undefined) updateData.quantity_available = updates.quantityAvailable;
      if (updates.pricePerUnit !== undefined) updateData.price_per_unit = updates.pricePerUnit;

      const { data, error } = await supabase
        .from('glassware')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error('Failed to update glassware');
      }

      return {
        id: data.id,
        type: data.type,
        description: data.description,
        quantityAvailable: data.quantity_available,
        pricePerUnit: data.price_per_unit,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Error updating glassware:', error);
      throw error;
    }
  },

  // Delete glassware
  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('glassware')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error('Failed to delete glassware');
      }
    } catch (error) {
      console.error('Error deleting glassware:', error);
      throw error;
    }
  },
};