import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import App from './App';
import './index.css';

const ui = localStorage.getItem("ems-ui");

if (ui) {
  try {
    const dark = JSON.parse(ui).state.dark;

    if (dark) {
      document.documentElement.classList.add("dark");
    }
  } catch {}
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
    position="top-right"
    reverseOrder={false}
  />
    </BrowserRouter>
  </React.StrictMode>,
);
