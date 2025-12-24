import './index.css';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAy9Mwvf-P1IrPgsXLqlkzl_LPetjINga0",
    authDomain: "gineer-25215.firebaseapp.com",
    projectId: "gineer-25215",
    storageBucket: "gineer-25215.firebasestorage.app",
    messagingSenderId: "688763108520",
    appId: "1:688763108520:web:fab3b058f86888b9cd969d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MENU = [
  { id: 1, name: "Engine Platter", price: 12500, emoji: "🍖", desc: "Full Ribs, Wings & Sides" },
  { id: 2, name: "Diesel Burger", price: 6500, emoji: "🍔", desc: "Double Patty & Sauce" },
  { id: 3, name: "Turbo Wings", price: 4500, emoji: "🍗", desc: "8pcs Spicy Glazed Wings" }
];

function App() {
  const [view, setView] = useState('landing');
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'gineer_orders'), orderBy('dbTimestamp', 'desc'));
    return onSnapshot(q, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const total = cart.reduce((s, i) => s + i.price, 0);

  const handlePay = () => {
    const handler = window.PaystackPop.setup({
      key: "pk_test_94b6d06cc1036c6efbede409a9d3b4020b6e11aa",
      email: form.email,
      amount: total * 100,
      callback: async (res) => {
        await addDoc(collection(db, 'gineer_orders'), {
          ...form, items: cart.map(i => i.name), total, ref: res.reference, dbTimestamp: serverTimestamp()
        });
        setCart([]); setView('receipt');
      }
    });
    handler.openIframe();
  };

  if (view === 'landing') return (
    <div className="h-screen bg-black text-white flex flex-col justify-center p-10 font-sans">
      <h1 className="text-6xl font-black italic mb-10">GINEER<br/><span className="text-orange-600">GRILLS.</span></h1>
      <button onClick={() => setView('menu')} className="bg-white text-black py-5 rounded-2xl font-black uppercase">Order Now</button>
    </div>
  );

  if (view === 'menu') return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
      <h2 className="text-2xl font-black text-orange-600 mb-8">MENU</h2>
      {MENU.map(i => (
        <div key={i.id} className="bg-zinc-900 p-6 rounded-3xl mb-4 flex justify-between items-center">
          <div><h3 className="font-bold">{i.name}</h3><p className="text-orange-500">₦{i.price}</p></div>
          <button onClick={() => setCart([...cart, i])} className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold">ADD +</button>
        </div>
      ))}
      {cart.length > 0 && (
        <button onClick={() => setView('checkout')} className="fixed bottom-6 left-6 right-6 bg-orange-600 py-5 rounded-2xl font-black">VIEW CART (₦{total})</button>
      )}
    </div>
  );

  if (view === 'checkout') return (
    <div className="min-h-screen bg-black text-white p-8">
      <h2 className="text-3xl font-black mb-8">DELIVERY</h2>
      <input placeholder="Name" className="w-full bg-zinc-900 p-4 rounded-xl mb-4" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" className="w-full bg-zinc-900 p-4 rounded-xl mb-4" onChange={e => setForm({...form, email: e.target.value})} />
      <textarea placeholder="Address" className="w-full bg-zinc-900 p-4 rounded-xl mb-8 h-32" onChange={e => setForm({...form, address: e.target.value})} />
      <button onClick={handlePay} className="w-full bg-orange-600 py-5 rounded-2xl font-black">PAY ₦{total}</button>
    </div>
  );

  if (view === 'receipt') return (
    <div className="h-screen bg-black text-white flex flex-col justify-center items-center p-10">
      <h2 className="text-4xl font-black text-green-500 mb-4">SUCCESS!</h2>
      <button onClick={() => setView('landing')} className="text-zinc-500 underline">Back to Home</button>
    </div>
  );
}

export default App;
