import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
  { id: 1, name: "Engine Platter", price: 12500 },
  { id: 2, name: "Diesel Burger", price: 6500 },
  { id: 3, name: "Turbo Wings", price: 4500 }
];

export default function App() {
  const [view, setView] = useState('landing');
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });

  const total = cart.reduce((s, i) => s + i.price, 0);

  const handlePay = () => {
    const handler = window.PaystackPop.setup({
      key: "pk_test_94b6d06cc1036c6efbede409a9d3b4020b6e11aa",
      email: form.email,
      amount: total * 100,
      currency: "NGN",
      callback: async (res) => {
        await addDoc(collection(db, 'gineer_orders'), {
          ...form, items: cart.map(i => i.name), total, ref: res.reference, dbTimestamp: serverTimestamp()
        });
        setView('receipt');
      }
    });
    handler.openIframe();
  };

  const style = {
    bg: { backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' },
    orange: { color: '#ea580c' },
    btn: { backgroundColor: '#fff', color: '#000', width: '100%', padding: '20px', borderRadius: '12px', fontWeight: 'bold', border: 'none', marginTop: '20px' }
  };

  if (view === 'landing') return (
    <div style={style.bg}>
      <h1 style={{fontSize: '3rem', fontStyle: 'italic', fontWeight: '900'}}>GINEER<br/><span style={style.orange}>GRILLS.</span></h1>
      <button onClick={() => setView('menu')} style={style.btn}>ORDER NOW</button>
    </div>
  );

  if (view === 'menu') return (
    <div style={style.bg}>
      <h2 style={style.orange}>MENU</h2>
      {MENU.map(i => (
        <div key={i.id} style={{display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#111', marginBottom: '10px', borderRadius: '10px'}}>
          <span>{i.name}</span>
          <button onClick={() => setCart([...cart, i])} style={{background: '#fff', border: 'none', borderRadius: '5px'}}>₦{i.price} +</button>
        </div>
      ))}
      {cart.length > 0 && <button onClick={() => setView('checkout')} style={{...style.btn, background: '#ea580c', color: '#fff'}}>PROCEED (₦{total})</button>}
    </div>
  );

  return (
    <div style={style.bg}>
      <h2>CHECKOUT</h2>
      <input placeholder="Email" style={{width: '100%', padding: '10px', marginBottom: '10px'}} onChange={e => setForm({...form, email: e.target.value})} />
      <button onClick={handlePay} style={style.btn}>PAY NOW</button>
    </div>
  );
}      key: "pk_test_94b6d06cc1036c6efbede409a9d3b4020b6e11aa",
      email: form.email,
      amount: total * 100,
      currency: "NGN",
      callback: async (res) => {
        await addDoc(collection(db, 'gineer_orders'), {
          ...form, 
          items: cart.map(i => i.name), 
          total, 
          ref: res.reference, 
          status: 'paid',
          dbTimestamp: serverTimestamp()
        });
        setCart([]); 
        setView('receipt');
      }
    });
    handler.openIframe();
  };

  // --- STYLES ---
  const s = {
    page: { backgroundColor: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif', padding: '20px' },
    hero: { fontSize: '4rem', fontWeight: '900', fontStyle: 'italic', lineHeight: '0.9', margin: '60px 0' },
    orange: { color: '#ea580c' },
    btnPrimary: { backgroundColor: '#fff', color: '#000', width: '100%', padding: '20px', borderRadius: '16px', fontWeight: '900', border: 'none', fontSize: '1.2rem' },
    btnOrange: { backgroundColor: '#ea580c', color: '#fff', width: '100%', padding: '20px', borderRadius: '16px', fontWeight: '900', border: 'none', position: 'fixed', bottom: '20px', left: '0' },
    card: { backgroundColor: '#18181b', padding: '20px', borderRadius: '24px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    input: { backgroundColor: '#18181b', color: '#fff', border: 'none', width: '100%', padding: '15px', borderRadius: '12px', marginBottom: '10px' }
  };

  if (view === 'landing') return (
    <div style={{...s.page, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <h1 style={s.hero}>GINEER<br/><span style={s.orange}>GRILLS.</span></h1>
      <button onClick={() => setView('menu')} style={s.btnPrimary}>ORDER NOW</button>
    </div>
  );

  if (view === 'menu') return (
    <div style={s.page}>
      <h2 style={{...s.orange, fontSize: '1.5rem', fontWeight: '900', marginBottom: '20px'}}>MENU</h2>
      {MENU.map(i => (
        <div key={i.id} style={s.card}>
          <div>
            <div style={{fontWeight: 'bold'}}>{i.name}</div>
            <div style={s.orange}>₦{i.price.toLocaleString()}</div>
          </div>
          <button onClick={() => setCart([...cart, i])} style={{backgroundColor: '#fff', border: 'none', borderRadius: '20px', padding: '8px 15px', fontWeight: 'bold'}}>ADD +</button>
        </div>
      ))}
      {cart.length > 0 && (
        <div style={{padding: '0 20px'}}>
          <button onClick={() => setView('checkout')} style={s.btnOrange}>VIEW CART (₦{total.toLocaleString()})</button>
        </div>
      )}
    </div>
  );

  if (view === 'checkout') return (
    <div style={s.page}>
      <h2 style={{fontSize: '2rem', fontWeight: '900', marginBottom: '20px'}}>DETAILS</h2>
      <input placeholder="Full Name" style={s.input} onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Email Address" style={s.input} onChange={e => setForm({...form, email: e.target.value})} />
      <input placeholder="Phone Number" style={s.input} onChange={e => setForm({...form, phone: e.target.value})} />
      <textarea placeholder="Delivery Address" style={{...s.input, height: '100px'}} onChange={e => setForm({...form, address: e.target.value})} />
      
      <div style={{marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
          <span>Total</span>
          <span style={s.orange}>₦{total.toLocaleString()}</span>
        </div>
        <button onClick={handlePay} style={{...s.btnPrimary, backgroundColor: '#ea580c', color: '#fff'}}>PROCEED TO PAY</button>
      </div>
    </div>
  );

  if (view === 'receipt') return (
    <div style={{...s.page, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <div style={{fontSize: '4rem'}}>🔥</div>
      <h2 style={{fontSize: '2rem', fontWeight: '900', margin: '20px 0'}}>ORDER PLACED!</h2>
      <p style={{color: '#888', marginBottom: '40px'}}>We are preparing your engine platter.</p>
      <button onClick={() => setView('landing')} style={s.btnPrimary}>BACK HOME</button>
    </div>
  );
}

export default App;  const total = cart.reduce((s, i) => s + i.price, 0);

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
