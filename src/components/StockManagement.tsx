import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Minus, RefreshCw, History } from 'lucide-react';
import { stockService, StockItem, StockAdjustment } from '../services/stockService';
import { formatRWF, formatDate } from '../utils/csvExport';
import Modal from './Modal';

export default function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<StockItem | null>(null);
  const [adjustmentForm, setAdjustmentForm] = useState({
    adjustmentType: 'restock' as 'damage' | 'restock' | 'manual',
    quantity: 0,
    reason: '',
  });

  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = async () => {
    try {
      setLoading(true);
      const [stockData, adjustmentsData] = await Promise.all([
        stockService.getStockOverview(),
        stockService.getStockAdjustments(),
      ]);
      setStockItems(stockData);
      setStockAdjustments(adjustmentsData);
    } catch (error) {
      console.error('Error loading stock data:', error);
      alert('Error loading stock data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStockItem) return;

    try {
      const quantityChange = adjustmentForm.adjustmentType === 'damage' 
        ? -Math.abs(adjustmentForm.quantity)
        : Math.abs(adjustmentForm.quantity);

      await stockService.adjustStock(
        selectedStockItem.glassType,
        selectedStockItem.unitType,
        quantityChange,
        adjustmentForm.adjustmentType,
        adjustmentForm.reason
      );

      await loadStockData();
      setIsAdjustmentModalOpen(false);
      setSelectedStockItem(null);
      setAdjustmentForm({
        adjustmentType: 'restock',
        quantity: 0,
        reason: '',
      });
    } catch (error: any) {
      console.error('Error adjusting stock:', error);
      alert(error.message || 'Error adjusting stock');
    }
  };

  const openAdjustmentModal = (stockItem: StockItem) => {
    setSelectedStockItem(stockItem);
    setIsAdjustmentModalOpen(true);
  };

  const getStockStatusBadge = (status: string) => {
    const styles = {
      in_stock: 'bg-green-100 text-green-800',
      low_stock: 'bg-yellow-100 text-yellow-800',
      out_of_stock: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || styles.in_stock;
  };

  const getUnitTypeLabel = (unitType: string) => {
    const labels = {
      individual: 'Individual Glass',
      small_box: 'Small Box (6 glasses)',
      large_box: 'Large Box (48 glasses)',
    };
    return labels[unitType as keyof typeof labels] || unitType;
  };

  const groupedStock = stockItems.reduce((acc, item) => {
    if (!acc[item.glassType]) {
      acc[item.glassType] = [];
    }
    acc[item.glassType].push(item);
    return acc;
  }, {} as Record<string, StockItem[]>);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stock data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stock Management</h1>
          <p className="text-gray-600">Monitor and adjust inventory levels</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <History className="h-4 w-4" />
            View History
          </button>
          <button
            onClick={loadStockData}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stock Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groupedStock).map(([glassType, items]) => {
          const totalAvailable = items[0]?.totalAvailableGlasses || 0;
          const hasLowStock = items.some(item => item.stockStatus === 'low_stock');
          const hasOutOfStock = items.some(item => item.stockStatus === 'out_of_stock');
          
          return (
            <div key={glassType} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{glassType}</h3>
                    <p className="text-sm text-gray-600">
                      Total Available: {totalAvailable} glasses
                    </p>
                  </div>
                </div>
                {(hasLowStock || hasOutOfStock) && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {hasOutOfStock ? 'Out of Stock' : 'Low Stock'}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {getUnitTypeLabel(item.unitType)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatusBadge(item.stockStatus)}`}>
                          {item.stockStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Stock: {item.currentStock} units</span>
                        <span>{formatRWF(item.pricePerUnit)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => openAdjustmentModal(item)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                        title="Adjust Stock"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={isAdjustmentModalOpen}
        onClose={() => {
          setIsAdjustmentModalOpen(false);
          setSelectedStockItem(null);
        }}
        title={`Adjust Stock - ${selectedStockItem?.glassType} (${getUnitTypeLabel(selectedStockItem?.unitType || '')})`}
      >
        <form onSubmit={handleAdjustStock} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjustment Type
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={adjustmentForm.adjustmentType}
              onChange={(e) => setAdjustmentForm({ 
                ...adjustmentForm, 
                adjustmentType: e.target.value as 'damage' | 'restock' | 'manual'
              })}
            >
              <option value="restock">Restock (Add)</option>
              <option value="damage">Damage (Remove)</option>
              <option value="manual">Manual Adjustment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={adjustmentForm.quantity}
              onChange={(e) => setAdjustmentForm({ 
                ...adjustmentForm, 
                quantity: parseInt(e.target.value) || 0
              })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={adjustmentForm.reason}
              onChange={(e) => setAdjustmentForm({ 
                ...adjustmentForm, 
                reason: e.target.value
              })}
              placeholder="Enter reason for adjustment..."
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              Current Stock: {selectedStockItem?.currentStock} units
            </p>
            <p className="text-sm text-gray-600">
              After Adjustment: {
                selectedStockItem ? 
                (adjustmentForm.adjustmentType === 'damage' 
                  ? selectedStockItem.currentStock - adjustmentForm.quantity
                  : selectedStockItem.currentStock + adjustmentForm.quantity
                ) : 0
              } units
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply Adjustment
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdjustmentModalOpen(false);
                setSelectedStockItem(null);
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Stock History Modal */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title="Stock Adjustment History"
      >
        <div className="max-h-96 overflow-y-auto">
          {stockAdjustments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No stock adjustments found</p>
          ) : (
            <div className="space-y-3">
              {stockAdjustments.map((adjustment) => (
                <div key={adjustment.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      adjustment.adjustmentType === 'damage' ? 'bg-red-100 text-red-800' :
                      adjustment.adjustmentType === 'restock' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {adjustment.adjustmentType}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(adjustment.createdAt)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      Quantity Change: {adjustment.quantityChange > 0 ? '+' : ''}{adjustment.quantityChange}
                    </p>
                    {adjustment.reason && (
                      <p className="text-gray-600 mt-1">{adjustment.reason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}