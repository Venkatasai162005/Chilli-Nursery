import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a2a1e',
                color: '#f0fdf4',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 500,
              },
              success: { iconTheme: { primary: '#40916c', secondary: '#f0fdf4' } },
              error:   { iconTheme: { primary: '#e63946', secondary: '#f0fdf4' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
