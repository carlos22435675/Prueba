import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthContext'; // Importa el AuthProvider
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Envuelve la aplicación con el AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Si deseas medir el rendimiento, puedes dejar esto
reportWebVitals();