import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => void;
  error?: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-200 mb-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-tr from-sky-600 to-blue-700 w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/30 mb-4 p-4">
             {/* Simplified Bicycle Icon */}
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <circle cx="5.5" cy="17.5" r="3.5" />
               <circle cx="18.5" cy="17.5" r="3.5" />
               <path d="M15 6h-5a1 1 0 0 0-1 1v3" />
               <path d="M5.5 17.5L9 9h7l3.5 8.5" />
               <circle cx="15" cy="5" r="1" />
             </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 text-center leading-snug">
            သိန်းမြန်မာစက်ဘီး၊<br/>ဆိုင်ကယ်ပစ္စည်းဆိုင်
          </h1>
          <p className="text-slate-600 font-semibold text-sm mt-1 text-center">
            လိပ်စာ-ဈေးတောင်ဘက်၊ မိတ္ထီလာမြို့။
          </p>
          <p className="text-slate-500 text-sm mt-4">အကောင့်ဝင်ရန်</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
              အသုံးပြုသူအမည် (Username)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium"
              placeholder="Username ရိုက်ပါ"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
              စကားဝှက် (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 rounded-lg transition-all transform active:scale-[0.98] shadow-lg shadow-sky-200 mt-2"
          >
            အကောင့်ဝင်မည်
          </button>
        </form>
      </div>

      <div className="text-center space-y-2 opacity-80">
          <p className="text-slate-600 font-bold">ဦးမောင်မောင်မြင့် + ဒေါ်ထားထားမြင့်</p>
          <p className="text-slate-600 font-medium text-sm">မောင်အောင်ကိုကို + မဖြူဇာလှိုင်, သမီး ဟေသာလင်းလက်</p>
          <p className="text-slate-600 font-medium text-sm">မောင်ဟိန်းထက်</p>
      </div>
    </div>
  );
};

export default LoginScreen;