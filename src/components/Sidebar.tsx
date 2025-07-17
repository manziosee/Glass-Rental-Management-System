import React from 'react';
import { Users, Wine, ShoppingCart, FileText, BarChart3, LogOut, Settings, Package } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'inventory', label: 'Inventory Overview', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'glassware', label: 'Glassware', icon: Wine },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export default function Sidebar({ activeSection, onSectionChange, onLogout }: SidebarProps) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 w-64 min-h-screen shadow-xl">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Wine className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Glass Rental Pro</h1>
            <p className="text-sm text-gray-300">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-700 transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-6">
        <div className="border-t border-gray-700 pt-4 mb-4">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-400">admin@glassrental.com</p>
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}