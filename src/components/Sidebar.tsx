import React from 'react';
import { Users, Wine, ShoppingCart, FileText, BarChart3, LogOut } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'glassware', label: 'Glassware', icon: Wine },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export default function Sidebar({ activeSection, onSectionChange, onLogout }: SidebarProps) {
  return (
    <div className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wine className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Glass Rental</h1>
            <p className="text-sm text-gray-500">Management System</p>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}