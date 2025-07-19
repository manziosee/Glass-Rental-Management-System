import { supabase } from '../lib/supabase';

export interface StockItem {
  id: string;
  glassType: string;
  unitType: 'individual' | 'small_box' | 'large_box';
  glassesPerUnit: number;
  pricePerUnit: number;
  currentStock: number;
  lowStockThreshold: number;
  totalGlassesForUnitType: number;
  totalAvailableGlasses: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  updatedAt: string;
}

export interface StockAdjustment {
  id: string;
  stockItemId: string;
  adjustmentType: 'order' | 'return' | 'damage' | 'restock' | 'manual';
  quantityChange: number;
  referenceId?: string;
  reason?: string;
  createdAt: string;
}

export interface StockAlert {
  id: string;
  stockItemId: string;
  alertType: 'low_stock' | 'out_of_stock';
  isActive: boolean;
  createdAt: string;
  resolvedAt?: string;
}

export const stockService = {
  // Get all stock items with overview
  async getStockOverview(): Promise<StockItem[]> {
    const { data, error } = await supabase
      .from('stock_overview')
      .select('*')
      .order('glass_type, unit_type');

    if (error) {
      console.error('Error fetching stock overview:', error);
      throw new Error('Failed to fetch stock overview');
    }

    return data.map(item => ({
      id: item.id,
      glassType: item.glass_type,
      unitType: item.unit_type,
      glassesPerUnit: item.glasses_per_unit,
      pricePerUnit: item.price_per_unit,
      currentStock: item.current_stock,
      lowStockThreshold: item.low_stock_threshold,
      totalGlassesForUnitType: item.total_glasses_for_unit_type,
      totalAvailableGlasses: item.total_available_glasses,
      stockStatus: item.stock_status,
      updatedAt: item.updated_at,
    }));
  },

  // Get available glasses for a specific glass type
  async getAvailableGlasses(glassType: string): Promise<number> {
    const { data, error } = await supabase
      .rpc('get_total_available_glasses', { glass_type_param: glassType });

    if (error) {
      console.error('Error getting available glasses:', error);
      throw new Error('Failed to get available glasses');
    }

    return data || 0;
  },

  // Get stock items for order selection
  async getStockForOrders(): Promise<{ glassType: string; availableGlasses: number; pricePerUnit: number }[]> {
    const { data, error } = await supabase
      .from('stock_items')
      .select('glass_type, price_per_unit')
      .eq('unit_type', 'individual');

    if (error) {
      console.error('Error fetching stock for orders:', error);
      throw new Error('Failed to fetch stock for orders');
    }

    const stockWithAvailability = await Promise.all(
      data.map(async (item) => {
        const availableGlasses = await this.getAvailableGlasses(item.glass_type);
        return {
          glassType: item.glass_type,
          availableGlasses,
          pricePerUnit: item.price_per_unit,
        };
      })
    );

    return stockWithAvailability.filter(item => item.availableGlasses > 0);
  },

  // Adjust stock manually (for damages, restocking, etc.)
  async adjustStock(
    glassType: string,
    unitType: 'individual' | 'small_box' | 'large_box',
    quantityChange: number,
    adjustmentType: 'damage' | 'restock' | 'manual',
    reason?: string
  ): Promise<void> {
    try {
      // Get the stock item
      const { data: stockItem, error: fetchError } = await supabase
        .from('stock_items')
        .select('id, current_stock')
        .eq('glass_type', glassType)
        .eq('unit_type', unitType)
        .single();

      if (fetchError) {
        throw new Error('Stock item not found');
      }

      const newStock = stockItem.current_stock + quantityChange;
      if (newStock < 0) {
        throw new Error('Cannot reduce stock below zero');
      }

      // Update stock
      const { error: updateError } = await supabase
        .from('stock_items')
        .update({ 
          current_stock: newStock,
          updated_at: new Date().toISOString()
        })
        .eq('id', stockItem.id);

      if (updateError) {
        throw new Error('Failed to update stock');
      }

      // Record adjustment
      const { error: adjustmentError } = await supabase
        .from('stock_adjustments')
        .insert({
          stock_item_id: stockItem.id,
          adjustment_type: adjustmentType,
          quantity_change: quantityChange,
          reason: reason || `${adjustmentType} adjustment`,
        });

      if (adjustmentError) {
        console.error('Error recording stock adjustment:', adjustmentError);
      }
    } catch (error) {
      console.error('Error adjusting stock:', error);
      throw error;
    }
  },

  // Get stock adjustments history
  async getStockAdjustments(stockItemId?: string): Promise<StockAdjustment[]> {
    let query = supabase
      .from('stock_adjustments')
      .select('*')
      .order('created_at', { ascending: false });

    if (stockItemId) {
      query = query.eq('stock_item_id', stockItemId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching stock adjustments:', error);
      throw new Error('Failed to fetch stock adjustments');
    }

    return data.map(adjustment => ({
      id: adjustment.id,
      stockItemId: adjustment.stock_item_id,
      adjustmentType: adjustment.adjustment_type,
      quantityChange: adjustment.quantity_change,
      referenceId: adjustment.reference_id,
      reason: adjustment.reason,
      createdAt: adjustment.created_at,
    }));
  },

  // Get active stock alerts
  async getActiveStockAlerts(): Promise<StockAlert[]> {
    const { data, error } = await supabase
      .from('stock_alerts')
      .select(`
        *,
        stock_items!inner(glass_type, unit_type)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stock alerts:', error);
      throw new Error('Failed to fetch stock alerts');
    }

    return data.map(alert => ({
      id: alert.id,
      stockItemId: alert.stock_item_id,
      alertType: alert.alert_type,
      isActive: alert.is_active,
      createdAt: alert.created_at,
      resolvedAt: alert.resolved_at,
    }));
  },

  // Restock items
  async restockItem(
    glassType: string,
    unitType: 'individual' | 'small_box' | 'large_box',
    quantity: number,
    reason?: string
  ): Promise<void> {
    await this.adjustStock(glassType, unitType, quantity, 'restock', reason);
  },

  // Report damaged items
  async reportDamage(
    glassType: string,
    unitType: 'individual' | 'small_box' | 'large_box',
    quantity: number,
    reason?: string
  ): Promise<void> {
    await this.adjustStock(glassType, unitType, -quantity, 'damage', reason);
  },
};