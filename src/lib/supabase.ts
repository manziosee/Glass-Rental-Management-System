import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set up your Supabase project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (generated from schema)
export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          event_date: string;
          event_location: string;
          event_type: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          event_date: string;
          event_location: string;
          event_type: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          event_date?: string;
          event_location?: string;
          event_type?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      glassware: {
        Row: {
          id: string;
          type: string;
          description: string;
          quantity_available: number;
          price_per_unit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          description: string;
          quantity_available?: number;
          price_per_unit: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          description?: string;
          quantity_available?: number;
          price_per_unit?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_id: string;
          glassware_id: string;
          quantity: number;
          order_date: string;
          delivery_date: string;
          status: 'pending' | 'confirmed' | 'delivered' | 'returned' | 'cancelled';
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          glassware_id: string;
          quantity: number;
          order_date: string;
          delivery_date: string;
          status?: 'pending' | 'confirmed' | 'delivered' | 'returned' | 'cancelled';
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          glassware_id?: string;
          quantity?: number;
          order_date?: string;
          delivery_date?: string;
          status?: 'pending' | 'confirmed' | 'delivered' | 'returned' | 'cancelled';
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      order_details: {
        Row: {
          id: string;
          customer_id: string;
          customer_name: string;
          customer_email: string;
          event_type: string;
          customer_event_date: string;
          glassware_id: string;
          glassware_type: string;
          glassware_description: string;
          price_per_unit: number;
          quantity: number;
          order_date: string;
          delivery_date: string;
          status: 'pending' | 'confirmed' | 'delivered' | 'returned' | 'cancelled';
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}