import React from 'react';
import { InventoryItem, BikeSection } from '../types';

interface InventoryCardProps {
  item: InventoryItem;
  onBuy: (id: string) => void;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

const sectionLabels: Record<BikeSection, string> = {
  [BikeSection.Wheels]: "ဘီးများ",
  [BikeSection.Frame]: "ကိုယ်ထည်",
  [BikeSection.Drivetrain]: "အင်ဂျင်/မောင်းနှင်",
  [BikeSection.Cockpit]: "လက်ကိုင်",
  [BikeSection.Accessories]: "အပိုပစ္စည်း"
};

const InventoryCard: React.FC<InventoryCardProps> = ({ item, onBuy, onEdit, onDelete }) => {
  const isLowStock = item.quantity <= item.minStockThreshold;
  const isOutOfStock = item.quantity === 0;

  // Formatter for Myanmar currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MM').format(amount) + ' Ks';
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Directly trigger parent handler, letting App.tsx handle the confirmation modal
    onDelete(item.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(item);
  };

  return (
    <div className={`
      relative flex flex-col justify-between p-4 rounded-xl border transition-all duration-200
      ${isOutOfStock 
        ? 'bg-slate-100 border-slate-300 opacity-70' 
        : isLowStock 
          ? 'bg-white border-red-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
          : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-lg'
      }
    `}>
      <div>
        {/* Header Row: Title on left, Actions on right */}
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate leading-tight mb-1">{item.name}</h3>
            <span className={`
              inline-block text-[11px] uppercase font-bold px-2 py-0.5 rounded-full border
              ${item.section === BikeSection.Wheels ? 'border-orange-200 text-orange-700 bg-orange-50' : ''}
              ${item.section === BikeSection.Frame ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
              ${item.section === BikeSection.Cockpit ? 'border-purple-200 text-purple-700 bg-purple-50' : ''}
              ${item.section === BikeSection.Drivetrain ? 'border-green-200 text-green-700 bg-green-50' : ''}
              ${item.section === BikeSection.Accessories ? 'border-gray-200 text-gray-700 bg-gray-50' : ''}
            `}>
              {sectionLabels[item.section]}
            </span>
          </div>

          {/* Action Buttons Container - Added relative and z-index to ensure it sits on top */}
          <div className="relative z-30 flex items-center gap-1 shrink-0 bg-slate-50 p-1 rounded-lg border border-slate-100">
            <button 
               type="button"
               onClick={handleEditClick}
               className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-100 rounded-md transition-colors cursor-pointer"
               title="ပြင်ဆင်ရန်"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <div className="w-px h-4 bg-slate-200 mx-0.5"></div>
            <button 
               type="button"
               onClick={handleDeleteClick}
               className="p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors cursor-pointer"
               title="ဖျက်မည်"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Description - Increased contrast */}
        <p className="text-sm text-slate-600 font-medium mb-3 line-clamp-2 min-h-[2.5rem]">
          {item.description || <span className="text-slate-400 italic">အကြောင်းအရာ မထည့်ထားပါ</span>}
        </p>

        {/* Price and Stock Grid - Increased contrast */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-50 p-2 rounded text-center border border-slate-200">
            <span className="block text-xs text-slate-500 uppercase font-bold tracking-wide">စျေးနှုန်း</span>
            <span className="font-mono text-lg text-sky-700 font-bold">{formatCurrency(item.price)}</span>
          </div>
          <div className={`p-2 rounded text-center border ${isLowStock ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
            <span className="block text-xs text-slate-500 uppercase font-bold tracking-wide">လက်ကျန်</span>
            <span className={`font-mono text-lg font-bold ${isLowStock ? 'text-red-600' : 'text-slate-800'}`}>
              {item.quantity}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onBuy(item.id)}
        disabled={isOutOfStock}
        className={`
          w-full py-2.5 px-4 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm
          ${isOutOfStock 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-sky-600 hover:bg-sky-700 text-white active:transform active:scale-95'
          }
        `}
      >
        {isOutOfStock ? (
          <span>ပစ္စည်းပြတ်နေသည်</span>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            ရောင်းမည် / လျှော့မည်
          </>
        )}
      </button>
      
      {isLowStock && !isOutOfStock && (
        <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-bounce shadow-md z-10">
          လက်ကျန်နည်း
        </div>
      )}
    </div>
  );
};

export default InventoryCard;