import React, { useState, useEffect } from 'react';
import { ShoppingBag, Lock, Trash2, Plus, Upload, Loader2, CheckCircle } from 'lucide-react';

export default function App() {
  const IMGBB_API_KEY = "93d17c4b7b555d6d06f3d05276243a0c"; 

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('levixa_inventory');
    return saved ? JSON.parse(saved) : []; 
  });

  const [currentView, setCurrentView] = useState('store'); 
  const [activeCategory, setActiveCategory] = useState('All'); 
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Rings', price: '', image: '' });

  useEffect(() => {
    localStorage.setItem('levixa_inventory', JSON.stringify(products));
    // Browser tab ka naam change karne ke liye
    document.title = "Levixa Store | Premium Jewelry";
  }, [products]);

  const handleAutoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) setNewProduct({ ...newProduct, image: data.data.url });
    } catch (err) {
      alert("Network Error!");
    } finally { setIsUploading(false); }
  };

  const handleWhatsAppBuy = (p) => {
    const text = encodeURIComponent(`Hi Levixa Store! I want to order this:\n\n*Product:* ${p.name}\n*Price:* ₹${p.price}\n\nPlease share payment details.`);
    window.open(`https://wa.me/919694141867?text=${text}`, '_blank');
  };

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const categories = ['All', 'Rings', 'Earrings', 'Bracelet', 'Necklace', 'Nosering'];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1a1a1a] font-sans selection:bg-[#B8860B]/20">
      
      {/* --- PREMIUM NAV --- */}
      {currentView === 'store' && (
        <div className="animate-in fade-in duration-700">
          <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md px-6 py-5 flex justify-between items-center border-b border-gray-100">
            {/* ✅ Brand Name Updated */}
            <h1 className="text-3xl font-serif font-bold tracking-widest text-[#B8860B]">LEVIXA STORE</h1>
            <div className="relative">
                <ShoppingBag className="w-7 h-7 text-[#B8860B]" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{products.length}</span>
            </div>
          </nav>

          {/* Hero Section */}
          <header className="py-16 text-center px-4 bg-[#FAF9F6]">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#B8860B] font-bold mb-4">The Official Store</p>
            <h2 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900 italic">Elegant Ornaments</h2>
            <div className="w-20 h-[2px] bg-[#B8860B] mx-auto mb-6"></div>
            <p className="max-w-xl mx-auto text-gray-500 font-light mb-10 text-sm">Affordable luxury delivered straight to your doorstep.</p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 mt-8 max-w-4xl mx-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest transition-all duration-300 border ${
                    activeCategory === cat 
                    ? 'bg-[#B8860B] text-white border-[#B8860B] shadow-lg' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-[#B8860B] hover:text-[#B8860B]'
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </header>

          {/* Products Grid */}
          <main className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-white group border border-gray-50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-square overflow-hidden bg-gray-50">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-1000" alt="" />
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-[10px] font-bold text-[#B8860B] uppercase tracking-widest">{p.category}</p>
                    <h3 className="text-xl font-medium tracking-tight text-gray-800 h-14 line-clamp-2">{p.name}</h3>
                    <p className="text-2xl font-bold text-black">₹{p.price}</p>
                    <button 
                      onClick={() => handleWhatsAppBuy(p)}
                      className="w-full bg-[#B8860B] text-white text-sm font-bold py-4 rounded-xl hover:bg-black transition-all duration-300 shadow-lg"
                    >
                      BUY NOW
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-40 border-2 border-dashed border-gray-100 rounded-2xl">
                <p className="text-gray-300 italic">Is category mein abhi koi jewelry nahi hai.</p>
              </div>
            )}
          </main>
          
          <footer className="py-16 bg-[#1a1a1a] text-white text-center">
             <p className="text-[10px] tracking-[0.3em] opacity-30 mb-4">© 2026 LEVIXA STORE | ALL RIGHTS RESERVED</p>
             <Lock className="w-4 h-4 mx-auto opacity-10 cursor-pointer hover:opacity-100 transition" onClick={() => setCurrentView('login')} />
          </footer>
        </div>
      )}

      {/* --- ADMIN DASHBOARD --- */}
      {currentView === 'admin' && (
        <div className="min-h-screen bg-[#FDFCFB] p-8 md:p-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-12 border-b border-gray-200 pb-6">
               <h2 className="text-2xl font-serif italic font-bold text-[#B8860B]">Levixa Inventory</h2>
               <button onClick={() => setCurrentView('store')} className="bg-black text-white px-6 py-2 rounded-lg font-bold">Back to Store</button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-12">
               <form onSubmit={(e) => { e.preventDefault(); setProducts([...products, {...newProduct, id: Date.now()}]); setNewProduct({name:'', category:'Rings', price:'', image:''}); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <input placeholder="Product Name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name:e.target.value})} required />
                     <input placeholder="Price (₹)" type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price:e.target.value})} required />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                      {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="relative h-14 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-[#FDFCFB] cursor-pointer">
                      {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-[#B8860B]" /> : newProduct.image ? <CheckCircle className="w-6 h-6 text-green-500" /> : <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center px-2">Upload Photo</p>}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAutoUpload} />
                    </div>
                  </div>
                  
                  <button type="submit" disabled={isUploading || !newProduct.image} className="w-full bg-[#B8860B] text-white py-4 rounded-xl font-bold tracking-widest shadow-xl disabled:opacity-30 uppercase">Add Product to Store</button>
               </form>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {products.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-xl flex justify-between items-center border border-gray-100 shadow-sm">
                     <div className="flex items-center gap-6">
                        <img src={p.image} className="w-16 h-16 rounded-lg object-cover" alt="" />
                        <div><p className="font-bold text-gray-800">{p.name}</p><p className="text-[#B8860B] font-bold">₹{p.price} | {p.category}</p></div>
                     </div>
                     <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="p-3 text-red-400 hover:text-red-600 transition"><Trash2 className="w-5 h-5" /></button>
                  </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {/* --- LOGIN --- */}
      {currentView === 'login' && (
        <div className="h-screen flex items-center justify-center bg-[#FAF9F6]">
          <form onSubmit={(e) => { e.preventDefault(); setCurrentView('admin'); }} className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-sm text-center border-t-4 border-[#B8860B]">
            <h2 className="text-2xl font-serif italic font-bold mb-8 text-[#B8860B]">Admin Login</h2>
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-xs tracking-widest uppercase">Go to Dashboard</button>
          </form>
        </div>
      )}
    </div>
  );
}