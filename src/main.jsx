import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'
import { InvoicesProvider } from './pages/Charts/InvoiceContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <InvoicesProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </InvoicesProvider>

);
