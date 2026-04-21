import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // Pehle ye install karna padega: npm install @supabase/supabase-js
import { ShoppingBag, Lock, Trash2, Upload, Loader2, CheckCircle } from 'lucide-react';

// ✅ APNI SUPABASE DETAILS YAHAN DALO
const supabase = createClient('https://bqgxzaakpplrnmjnqrlm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxZ3h6YWFrcHBscm5tam5xcmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3ODU2NjQsImV4cCI6MjA5MjM2MTY2NH0.w1FeFEHo4LmMxd2QAarMnptg9cBZNjMSrCuYEiIQZXs');
const IMGBB_API_KEY = "93d17c4b7b555d6d06f3d05276243a0c";

export default function App() {
  const [products, setProducts] = useState([]);
  const [currentView, setCurrentView] = useState('store');
  const [isUploading, setIsUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Rings', price: '', image: '' });

  // ✅ Database se products fetch karna
  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Database mein product save karna
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('products').insert([newProduct]);
    if (!error) {
      setNewProduct({ name: '', category: 'Rings', price: '', image: '' });
      fetchProducts();
    }
  };

  // ✅ Database se delete karna
  const handleDelete = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const handleAutoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData });
    const data = await res.json();
    if (data.success) setNewProduct({ ...newProduct, image: data.data.url });
    setIsUploading(false);
  };

  const handleWhatsAppBuy = (p) => {
    const text = encodeURIComponent(`Hi Levixa Store! I want to order:\n*Product:* ${p.name}\n*Price:* ₹${p.price}`);
    window.open(`https://wa.me/919694141867?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* --- STOREFRONT --- */}
      {currentView === 'store' && (
        <div className="animate-in fade-in duration-700">
          <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md px-6 py-5 flex justify-between items-center border-b">
            <h1 className="text-3xl font-serif font-bold tracking-widest text-[#B8860B]">LEVIXA STORE</h1>
            <ShoppingBag className="w-7 h-7 text-[#B8860B]" />
          </nav>

          <header className="py-16 text-center bg-[#FAF9F6]">
            <h2 className="text-5xl font-serif italic mb-4">Elegant Ornaments</h2>
            <p className="text-gray-500 text-sm">Affordable luxury for everyone.</p>
          </header>

          <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map(p => (
              <div key={p.id} className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition">
                <img src={p.image} className="w-full aspect-square object-cover" />
                <div className="p-6 text-center space-y-3">
                  <h3 className="text-xl font-medium">{p.name}</h3>
                  <p className="text-2xl font-bold text-[#B8860B]">₹{p.price}</p>
                  <button onClick={() => handleWhatsAppBuy(p)} className="w-full bg-[#B8860B] text-white py-3 rounded-xl font-bold">BUY NOW</button>
                </div>
              </div>
            ))}
          </main>
          
          <footer className="py-10 flex justify-center opacity-10 hover:opacity-100 transition">
             <Lock className="w-5 h-5 cursor-pointer" onClick={() => setCurrentView('login')} />
          </footer>
        </div>
      )}

      {/* --- ADMIN DASHBOARD --- */}
      {currentView === 'admin' && (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-lg">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#B8860B]">Inventory Control</h2>
              <button onClick={() => setCurrentView('store')} className="bg-black text-white px-6 py-2 rounded-lg">Logout</button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-6 mb-10">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Product Name" className="p-4 bg-gray-50 rounded-xl outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                <input placeholder="Price" className="p-4 bg-gray-50 rounded-xl outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
              </div>
              <div className="relative h-32 border-2 border-dashed rounded-xl flex items-center justify-center bg-gray-50">
                {isUploading ? <Loader2 className="animate-spin" /> : newProduct.image ? <CheckCircle className="text-green-500" /> : <p className="text-gray-400">Upload Image</p>}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleAutoUpload} />
              </div>
              <button type="submit" className="w-full bg-[#B8860B] text-white py-4 rounded-xl font-bold uppercase tracking-widest shadow-lg">Cloud Save Product</button>
            </form>

            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <img src={p.image} className="w-12 h-12 rounded object-cover" />
                    <div><p className="font-bold">{p.name}</p><p className="text-xs text-[#B8860B]">₹{p.price}</p></div>
                  </div>
                  <button onClick={() => handleDelete(p.id)} className="text-red-400"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- LOGIN --- */}
      {currentView === 'login' && (
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <form onSubmit={(e) => { e.preventDefault(); setCurrentView('admin'); }} className="bg-white p-12 rounded-3xl shadow-xl w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold mb-8">Admin Access</h2>
            <button className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest">Login</button>
          </form>
        </div>
      )}
    </div>
  );
}