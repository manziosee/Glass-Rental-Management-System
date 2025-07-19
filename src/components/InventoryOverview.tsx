import React from 'react';
import { Package, Box, Archive } from 'lucide-react';
import { Glassware } from '../types';
import { formatRWF } from '../utils/csvExport';

interface InventoryOverviewProps {
  glassware: Glassware[];
}

interface InventoryCategory {
  name: string;
  individual: Glassware | undefined;
  smallBox: Glassware | undefined;
  largeBox: Glassware | undefined;
  totalGlasses: number;
  color: string;
  bgColor: string;
  textColor: string;
}

export default function InventoryOverview({ glassware }: InventoryOverviewProps) {
  // Hardcoded values for the "Individual Glass" category as per user request
  const hardcodedCategory: InventoryCategory = {
    name: 'Individual Glass',
    individual: {
      type: 'Individual Glass',
      quantityAvailable: 96,
      pricePerUnit: 450,
    } as Glassware,
    smallBox: {
      type: 'Individual Glass Small Box',
      quantityAvailable: 16,
      pricePerUnit: 2700,
    } as Glassware,
    largeBox: {
      type: 'Individual Glass Large Box',
      quantityAvailable: 3, // updated from 2 to 3
      pricePerUnit: 21600,
    } as Glassware,
    totalGlasses: 96,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  };

  const getInventoryCategories = (): InventoryCategory[] => {
    const categories = [
      hardcodedCategory,
      {
        name: 'Beer Glasses',
        individual: glassware.find(g => g.type === 'Beer Glass'),
        smallBox: glassware.find(g => g.type === 'Beer Glass Small Box'),
        largeBox: glassware.find(g => g.type === 'Beer Glass Large Box'),
        totalGlasses: 240,
        color: 'bg-amber-500',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-700',
      },
      {
        name: 'Wine Glasses',
        individual: glassware.find(g => g.type === 'Wine Glass'),
        smallBox: glassware.find(g => g.type === 'Wine Glass Small Box'),
        largeBox: glassware.find(g => g.type === 'Wine Glass Large Box'),
        totalGlasses: 144,
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
      },
      {
        name: 'Cocktail Glasses',
        individual: glassware.find(g => g.type === 'Cocktail Glass'),
        smallBox: glassware.find(g => g.type === 'Cocktail Glass Small Box'),
        largeBox: glassware.find(g => g.type === 'Cocktail Glass Large Box'),
        totalGlasses: 144,
        color: 'bg-purple-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
      },
      {
        name: 'Champagne Glasses',
        individual: glassware.find(g => g.type === 'Champagne Glass'),
        smallBox: glassware.find(g => g.type === 'Champagne Glass Small Box'),
        largeBox: glassware.find(g => g.type === 'Champagne Glass Large Box'),
        totalGlasses: 96,
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
      },
    ];

    return categories;
  };

  const categories = getInventoryCategories();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventory Overview</h1>
        <p className="text-gray-600">Complete breakdown of glass rental inventory and pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={`${category.bgColor} p-3 rounded-lg`}>
                <Package className={`h-6 w-6 ${category.textColor}`} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600">Total Capacity: {category.totalGlasses} glasses</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Individual Glass */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900">Individual Glass</p>
                    <p className="text-sm text-gray-600">
                      Available: {category.individual?.quantityAvailable || 0}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatRWF(category.individual?.pricePerUnit || 0)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">per glass</p>
                </div>
              </div>

              {/* Small Box */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Box className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900">Small Box (6 glasses)</p>
                    <p className="text-sm text-gray-600">
                      Available: {category.smallBox?.quantityAvailable || 0} boxes
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatRWF(category.smallBox?.pricePerUnit || 0)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">per box</p>
                </div>
              </div>

              {/* Large Box */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Archive className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900">Large Box (48 glasses)</p>
                    <p className="text-sm text-gray-600">
                      Available: {category.largeBox?.quantityAvailable || 0} boxes
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatRWF(category.largeBox?.pricePerUnit || 0)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">per box</p>
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Pricing Summary</h4>
              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                <p>• 1 Glass = {formatRWF(category.individual?.pricePerUnit || 0)}</p>
                <p>• 6 Glasses (Small Box) = {formatRWF(category.smallBox?.pricePerUnit || 0)}</p>
                <p>• 48 Glasses (Large Box) = {formatRWF(category.largeBox?.pricePerUnit || 0)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Inventory Summary */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Total Inventory Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <div key={index} className="text-center">
              <div className={`${category.bgColor} p-3 rounded-lg mx-auto w-fit mb-2`}>
                <Package className={`h-5 w-5 ${category.textColor}`} />
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{category.totalGlasses}</p>
              <p className="text-sm text-gray-600">{category.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <p className="text-center text-base sm:text-lg font-bold text-gray-900">
            Total Glasses Available: 624 glasses
          </p>
        </div>
      </div>
    </div>
  );
}