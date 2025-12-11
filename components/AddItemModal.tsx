import React, { useState, useEffect } from 'react';
import { BikeSection, InventoryItem, VehicleType } from '../types';
import { generateItemDetails } from '../services/geminiService';
import { toBurmese, fromBurmese } from '../utils';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<InventoryItem, 'id'>) => void;
  onUpdate: (item: InventoryItem) => void;
  itemToEdit?: InventoryItem | null;
}

const sectionLabels: Record<BikeSection, string> = {
  [BikeSection.Wheels]: "ဘီးများ",
  [BikeSection.Frame]: "ကိုယ်ထည်",
  [BikeSection.Drivetrain]: "အင်ဂျင်/မောင်းနှင်",
  [BikeSection.Cockpit]: "လက်ကိုင်",
  [BikeSection.Accessories]: "အပိုပစ္စည်း"
};

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd, onUpdate, itemToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'bicycle' as VehicleType,
    section: BikeSection.Accessories,
    price: '',
    quantity: '',
    description: '',
    minStockThreshold: '3' // Store as string to handle burmese input
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Populate form when itemToEdit changes
  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name,
        type: itemToEdit.type,
        section: itemToEdit.section,
        price: toBurmese(itemToEdit.price), // Show existing values in Burmese
        quantity: toBurmese(itemToEdit.quantity),
        description: itemToEdit.description || '',
        minStockThreshold: toBurmese(itemToEdit.minStockThreshold)
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        type: 'bicycle',
        section: BikeSection.Accessories,
        price: '',
        quantity: '',
        description: '',
        minStockThreshold: toBurmese(3)
      });
    }
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleGenerateAI = async () => {
    if (!formData.name) return;
    setIsGenerating(true);
    const result = await generateItemDetails(formData.name, formData.section);
    if (result) {
      setFormData(prev => ({
        ...prev,
        description: result.suggestedDescription + (result.technicalSpecs.length > 0 ? `\nSpecs: ${result.technicalSpecs.join(', ')}` : '')
      }));
    }
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = {
      name: formData.name,
      type: formData.type,
      section: formData.section,
      price: fromBurmese(formData.price), // Convert back to number
      quantity: fromBurmese(formData.quantity),
      description: formData.description,
      minStockThreshold: fromBurmese(formData.minStockThreshold)
    };

    if (itemToEdit) {
      onUpdate({ ...itemData, id: itemToEdit.id });
    } else {
      onAdd(itemData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {itemToEdit ? 'ပစ္စည်းအချက်အလက် ပြင်ဆင်ရန်' : 'ပစ္စည်းအသစ်ထည့်ရန်'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 bg-white rounded-full p-1.5 hover:bg-slate-200 transition-colors border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="flex gap-4 p-1.5 bg-slate-100 rounded-lg border border-slate-200">
             <button
               type="button"
               onClick={() => setFormData({...formData, type: 'bicycle'})}
               className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all shadow-sm ${formData.type === 'bicycle' ? 'bg-white text-sky-700' : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'}`}
             >
               စက်ဘီး
             </button>
             <button
               type="button"
               onClick={() => setFormData({...formData, type: 'motorbike'})}
               className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all shadow-sm ${formData.type === 'motorbike' ? 'bg-white text-sky-700' : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'}`}
             >
               ဆိုင်ကယ်
             </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">ပစ္စည်းအမည်</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                placeholder="ဥပမာ - တာယာ"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">အစိတ်အပိုင်း</label>
              <select
                value={formData.section}
                onChange={e => setFormData({...formData, section: e.target.value as BikeSection})}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all appearance-none"
              >
                {Object.values(BikeSection).map(s => (
                  <option key={s} value={s}>{sectionLabels[s]}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase">အကြောင်းအရာ (Optional)</label>
                <button 
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !formData.name}
                  className="text-xs text-sky-700 hover:text-sky-800 flex items-center gap-1 disabled:opacity-50 font-bold bg-sky-50 px-2 py-0.5 rounded-full"
                >
                  {isGenerating ? (
                    <span className="animate-pulse">စဉ်းစားနေသည်...</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI အကူအညီ
                    </>
                  )}
                </button>
             </div>
             <textarea
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-400"
                placeholder="မထည့်လည်းရပါသည်..."
             />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">စျေးနှုန်း (Ks)</label>
              <input
                required
                type="text"
                inputMode="numeric"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                placeholder="၁၀၀၀"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">အရေအတွက်</label>
              <input
                required
                type="text"
                inputMode="numeric"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                placeholder="၁၀"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">သတိပေးချက်</label>
              <input
                required
                type="text"
                inputMode="numeric"
                value={formData.minStockThreshold}
                onChange={e => setFormData({...formData, minStockThreshold: e.target.value})}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                placeholder="၃"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 rounded-lg transition-all transform active:scale-[0.98] shadow-md shadow-sky-200 mt-2"
          >
            {itemToEdit ? 'ပြင်ဆင်မှုသိမ်းဆည်းမည်' : 'စာရင်းသွင်းမည်'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;