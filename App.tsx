import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_INVENTORY } from './constants';
import { BikeSection, InventoryItem, VehicleType } from './types';
import BikeVisual from './components/BikeVisual';
import InventoryCard from './components/InventoryCard';
import AddItemModal from './components/AddItemModal';
import LoginScreen from './components/LoginScreen';

const App: React.FC = () => {
  // Authentication State - Initialize from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('bikeShopAuth');
    return saved === 'true';
  });
  const [loginError, setLoginError] = useState('');

  // Inventory State - Initialize from localStorage
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('bikeShopItems');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved inventory", e);
        return INITIAL_INVENTORY;
      }
    }
    return INITIAL_INVENTORY;
  });

  // Effects for Persistence
  useEffect(() => {
    localStorage.setItem('bikeShopAuth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('bikeShopItems', JSON.stringify(items));
  }, [items]);

  const [selectedSection, setSelectedSection] = useState<BikeSection | null>(null);
  const [currentVehicleType, setCurrentVehicleType] = useState<VehicleType>('bicycle');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // --- Login Logic ---
  const handleLogin = (username: string, pass: string) => {
    if (username === 'aa' && pass === '1234') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('အသုံးပြုသူအမည် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်'); // Incorrect username or password
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginError('');
  };

  // --- Actions ---
  
  const handleAddItem = (newItem: Omit<InventoryItem, 'id'>) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString()
    };
    setItems(prev => [item, ...prev]);
  };

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    setItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
  };

  // Called when clicking trash icon
  const requestDeleteItem = (id: string) => {
    setItemToDelete(id);
  };

  // Called when confirming in modal
  const confirmDeleteItem = () => {
    if (itemToDelete) {
      setItems(prev => prev.filter(item => item.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  const handleBuyItem = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id && item.quantity > 0) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  // --- Filtering & Derived State ---

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesType = item.type === currentVehicleType;
      const matchesSection = selectedSection ? item.section === selectedSection : true;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSection && matchesSearch;
    });
  }, [items, selectedSection, searchQuery, currentVehicleType]);

  const lowStockCount = useMemo(() => {
    return items.filter(i => i.type === currentVehicleType && i.quantity <= i.minStockThreshold && i.quantity > 0).length;
  }, [items, currentVehicleType]);

  const outOfStockCount = useMemo(() => {
    return items.filter(i => i.type === currentVehicleType && i.quantity === 0).length;
  }, [items, currentVehicleType]);

  const totalValue = useMemo(() => {
     return items
      .filter(i => i.type === currentVehicleType)
      .reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  }, [items, currentVehicleType]);

  const totalItems = useMemo(() => {
     return items
      .filter(i => i.type === currentVehicleType)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  }, [items, currentVehicleType]);

  // Section labels for UI
  const sectionLabels: Record<BikeSection, string> = {
    [BikeSection.Wheels]: "ဘီးများ",
    [BikeSection.Frame]: "ကိုယ်ထည်",
    [BikeSection.Drivetrain]: "အင်ဂျင်/မောင်းနှင်",
    [BikeSection.Cockpit]: "လက်ကိုင်",
    [BikeSection.Accessories]: "အပိုပစ္စည်း"
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-gradient-to-tr from-sky-600 to-blue-700 w-10 h-10 rounded-lg flex items-center justify-center shadow-md shadow-sky-500/20 p-2">
               {/* Simplified Bicycle Icon */}
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <circle cx="5.5" cy="17.5" r="3.5" />
                 <circle cx="18.5" cy="17.5" r="3.5" />
                 <path d="M15 6h-5a1 1 0 0 0-1 1v3" />
                 <path d="M5.5 17.5L9 9h7l3.5 8.5" />
                 <circle cx="15" cy="5" r="1" />
               </svg>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight leading-tight hidden sm:block">
              သိန်းမြန်မာစက်ဘီး၊<br className="lg:hidden"/>ဆိုင်ကယ်ပစ္စည်းဆိုင်
            </h1>
            <h1 className="text-base font-bold text-slate-800 tracking-tight leading-tight sm:hidden">
              သိန်းမြန်မာ<br/>ပစ္စည်းဆိုင်
            </h1>
          </div>

          {/* Vehicle Type Toggle */}
          <div className="hidden sm:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
             <button
               onClick={() => {
                 setCurrentVehicleType('bicycle');
                 setSelectedSection(null);
               }}
               className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${currentVehicleType === 'bicycle' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
             >
               စက်ဘီး
             </button>
             <button
               onClick={() => {
                 setCurrentVehicleType('motorbike');
                 setSelectedSection(null);
               }}
               className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all ${currentVehicleType === 'motorbike' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
             >
               ဆိုင်ကယ်
             </button>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Status */}
            <div className="hidden lg:flex gap-3 text-sm font-medium text-slate-600">
               {lowStockCount > 0 && (
                 <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                   <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"/>
                   {lowStockCount} လက်ကျန်နည်း
                 </span>
               )}
               {outOfStockCount > 0 && (
                 <span className="text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                   {outOfStockCount} ပြတ်လပ်
                 </span>
               )}
            </div>
            <button
              onClick={openAddModal}
              className="bg-sky-600 hover:bg-sky-700 text-white p-2 md:px-4 md:py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-sky-200 active:scale-95 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden md:inline">ပစ္စည်းသစ်</span>
            </button>
            <button
               onClick={handleLogout}
               className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
               title="အကောင့်ထွက်မည်"
             >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
               </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Type Toggler (Moved from top bar on very small screens if needed, but keeping simple for now) */}
        <div className="sm:hidden border-t border-slate-100 p-2 bg-white flex justify-center">
             <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 w-full max-w-xs">
               <button
                 onClick={() => {
                   setCurrentVehicleType('bicycle');
                   setSelectedSection(null);
                 }}
                 className={`flex-1 py-1.5 rounded-md text-sm font-bold transition-all ${currentVehicleType === 'bicycle' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
               >
                 စက်ဘီး
               </button>
               <button
                 onClick={() => {
                   setCurrentVehicleType('motorbike');
                   setSelectedSection(null);
                 }}
                 className={`flex-1 py-1.5 rounded-md text-sm font-bold transition-all ${currentVehicleType === 'motorbike' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
               >
                 ဆိုင်ကယ်
               </button>
             </div>
        </div>
      </header>

      {/* Mobile Status Bar */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-2 flex gap-4 text-xs font-bold justify-center shadow-sm">
            {lowStockCount > 0 && (
              <span className="flex items-center gap-1 text-orange-600">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"/>
                {lowStockCount} လက်ကျန်နည်း
              </span>
            )}
            {outOfStockCount > 0 && (
              <span className="text-red-600">
                {outOfStockCount} ပစ္စည်းပြတ်နေသည်
              </span>
            )}
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive Visual */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <BikeVisual 
                selectedSection={selectedSection} 
                onSelectSection={setSelectedSection} 
                vehicleType={currentVehicleType}
              />
            </section>
            
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-800 mb-4">စာရင်းချုပ်</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                  <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">တန်ဖိုးစုစုပေါင်း</span>
                  <p className="text-xl md:text-2xl font-mono text-slate-800 truncate mt-1 font-bold">
                    {totalValue.toLocaleString()} Ks
                  </p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                   <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">ပစ္စည်းအရေအတွက်</span>
                   <p className="text-xl md:text-2xl font-mono text-slate-800 mt-1 font-bold">
                     {totalItems}
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inventory List */}
          <div className="lg:col-span-7">
            <div className="sticky top-20 z-30 bg-white/95 p-4 rounded-xl border border-slate-200 mb-6 shadow-md backdrop-blur">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  {selectedSection ? (
                    <>
                      <span className="text-sky-700">{sectionLabels[selectedSection]}</span>
                      <button 
                        onClick={() => setSelectedSection(null)}
                        className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded ml-2 border border-slate-200 font-bold"
                      >
                        အားလုံးကြည့်ရန်
                      </button>
                    </>
                  ) : (currentVehicleType === 'bicycle' ? 'စက်ဘီးပစ္စည်းများ' : 'ဆိုင်ကယ်ပစ္စည်းများ')}
                </h2>
                
                <div className="relative w-full sm:w-auto min-w-[250px]">
                  <input
                    type="text"
                    placeholder="ပစ္စည်းရှာရန်..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-slate-900 font-medium focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all placeholder:text-slate-400"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-lg text-slate-500 font-medium">ပစ္စည်းမရှိသေးပါ။</p>
                {selectedSection && (
                  <button onClick={() => setSelectedSection(null)} className="text-sky-600 mt-2 hover:underline font-bold">
                    အမျိုးအစားအားလုံး ပြန်ကြည့်ရန်
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map(item => (
                  <InventoryCard 
                    key={item.id} 
                    item={item} 
                    onBuy={handleBuyItem} 
                    onEdit={openEditModal}
                    onDelete={requestDeleteItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER with Founders Names */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-slate-700 font-bold text-lg leading-tight">ဦးမောင်မောင်မြင့် + ဒေါ်ထားထားမြင့်</h3>
            <h4 className="text-slate-600 font-medium text-base">မောင်အောင်ကိုကို + မဖြူဇာလှိုင်, သမီး ဟေသာလင်းလက်</h4>
            <p className="text-slate-600 font-medium text-base">မောင်ဟိန်းထက်</p>
          </div>
          <p className="text-slate-300 text-xs mt-8">© {new Date().getFullYear()} သိန်းမြန်မာ စက်ဘီးနှင့်ဆိုင်ကယ်ပစ္စည်းဆိုင်</p>
        </div>
      </footer>

      <AddItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
        onUpdate={handleUpdateItem}
        itemToEdit={editingItem}
      />

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
           <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl border border-slate-200 transform transition-all scale-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                 </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 text-center mb-2">ပစ္စည်းကို ဖျက်ရန် သေချာပါသလား?</h3>
              <p className="text-sm text-slate-500 text-center mb-6">ဤလုပ်ဆောင်ချက်ကို ပြန်ပြင်၍မရပါ။ (This action cannot be undone.)</p>
              
              <div className="flex gap-3">
                 <button 
                   onClick={() => setItemToDelete(null)}
                   className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors"
                 >
                   မဖျက်တော့ပါ
                 </button>
                 <button 
                   onClick={confirmDeleteItem}
                   className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                 >
                   ဖျက်မည်
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;