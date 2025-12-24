import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Firebase Setup
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
  { id: 1, name: "Engine Platter", price: 12500, emoji: "🍖" },
  { id: 2, name: "Diesel Burger", price: 6500, emoji: "🍔" },
  { id: 3, name: "Turbo Wings", price: 4500, emoji: "🍗" }
];

function App() {
  const [view, setView] = useState('landing');
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState('');

  const total = cart.reduce((s, i) => s + i.price, 0);

  const handlePay = () => {
    if (!email) {
      alert("Please enter your email first!");
      return;
    }

    // This calls the Paystack script we put in index.html
    if (window.PaystackPop) {
      const handler = window.PaystackPop.setup({
        key: "pk_test_94b6d06cc1036c6efbede409a9d3b4020b6e11aa",
        email: email,
        amount: total * 100,
        currency: "NGN",
        callback: async (res) => {
          await addDoc(collection(db, 'gineer_orders'), {
            items: cart.map(i => i.name),
            total,
            email,
            ref: res.reference,
            status: 'Paid',
            dbTimestamp: serverTimestamp()
          });
          setCart([]);
          setView('success');
        }
      });
      handler.openIframe();
    } else {
      alert("Payment system is loading, please try again in 2 seconds.");
    }
  };

  const s = {
    bg: { backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '30px', fontFamily: 'sans-serif' },
    hero: { fontSize: '3.5rem', fontWeight: '900', fontStyle: 'italic', margin: '40px 0', lineHeight: '0.9' },
    orange: { color: '#ea580c' },
    btn: { backgroundColor: '#fff', color: '#000', width: '100%', padding: '20px', borderRadius: '15px', fontWeight: 'bold', border: 'none', fontSize: '1.1rem', cursor: 'pointer' },
    card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '20px', backgroundColor: '#111', borderRadius: '15px', border: '1px solid #222' }
  };

  if (view === 'landing') return (
    <div style={s.bg}>
      <h1 style={s.hero}>GINEER<br/><span style={s.orange}>GRILLS.</span></h1>
      <p style={{color: '#888', marginBottom: '40px'}}>Premium Grills & Machinery</p>
      <button onClick={() => setView('menu')} style={s.btn}>ORDER NOW</button>
    </div>
  );

  if (view === 'success') return (
    <div style={{...s.bg, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
      <h1 style={{fontSize: '5rem'}}>🔥</h1>
      <h2 style={s.orange}>ORDER PLACED!</h2>
      <p>Check your email for confirmation.</p>
      <button onClick={() => setView('landing')} style={{...s.btn, marginTop: '20px'}}>BACK HOME</button>
    </div>
  );

  return (
    <div style={s.bg}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{...s.orange, margin: 0}}>MENU</h2>
        <button onClick={() => setView('landing')} style={{background: 'none', border: 'none', color: '#888'}}>Close</button>
      </div>
      
      {MENU.map(i => (
        <div key={i.id} style={s.card}>
          <div>
            <span style={{fontSize: '1.5rem', marginRight: '10px'}}>{i.emoji}</span>
            <span style={{fontWeight: 'bold'}}>{i.name}</span>
            <div style={{color: '#888', fontSize: '0.9rem'}}>₦{i.price.toLocaleString()}</div>
          </div>
          <button onClick={() => setCart([...cart, i])} style={{background: '#fff', border: 'none', padding: '8px 15px', borderRadius: '10px', fontWeight: 'bold'}}>+ ADD</button>
        </div>
      ))}

      {cart.length > 0 && (
        <div style={{marginTop: '40px', borderTop: '1px solid #222', paddingTop: '20px'}}>
           <label style={{display: 'block', marginBottom: '10px', fontSize: '0.8rem', color: '#888'}}>DELIVERY EMAIL</label>
           <input 
             type="email"
             placeholder="you@example.com" 
             style={{width: '100%', boxSizing: 'border-box', padding: '15px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #444', background: '#000', color: '#fff'}} 
             onChange={e => setEmail(e.target.value)} 
           />
           <button onClick={handlePay} style={{...s.btn, background: '#ea580c', color: '#fff'}}>
             PAY ₦{total.toLocaleString()}
           </button>
           <p style={{textAlign: 'center', fontSize: '0.7rem', color: '#444', marginTop: '10px'}}>Secure Payment by Paystack</p>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);      callback: async (res) => {
        await addDoc(collection(db, 'gineer_orders'), {
          items: cart.map(i => i.name), total, ref: res.reference, dbTimestamp: serverTimestamp()
        });
        alert("Order Received!");
        setView('landing');
      }
    });
    handler.openIframe();
  };

  const s = {
    bg: { backgroundColor: '#000', minHeight: '100vh', color: '#fff', padding: '30px', fontFamily: 'sans-serif' },
    hero: { fontSize: '3.5rem', fontWeight: '900', fontStyle: 'italic', margin: '40px 0' },
    orange: { color: '#ea580c' },
    btn: { backgroundColor: '#fff', color: '#000', width: '100%', padding: '20px', borderRadius: '15px', fontWeight: 'bold', border: 'none', fontSize: '1.1rem' }
  };

  if (view === 'landing') return (
    <div style={s.bg}>
      <h1 style={s.hero}>GINEER<br/><span style={s.orange}>GRILLS.</span></h1>
      <button onClick={() => setView('menu')} style={s.btn}>ORDER NOW</button>
    </div>
  );

  return (
    <div style={s.bg}>
      <h2 style={s.orange}>MENU</h2>
      {MENU.map(i => (
        <div key={i.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', padding: '15px', border: '1px solid #333', borderRadius: '10px'}}>
          <span>{i.name}</span>
          <button onClick={() => setCart([...cart, i])} style={{background: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px'}}>₦{i.price} +</button>
        </div>
      ))}
      {cart.length > 0 && (
        <div style={{marginTop: '30px'}}>
           <input placeholder="Your Email" style={{width: '90%', padding: '15px', marginBottom: '10px', borderRadius: '10px'}} onChange={e => setEmail(e.target.value)} />
           <button onClick={handlePay} style={{...s.btn, background: '#ea580c', color: '#fff'}}>PAY ₦{total}</button>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
