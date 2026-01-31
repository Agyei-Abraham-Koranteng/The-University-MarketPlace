
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Signal that the application has successfully mounted
const loader = document.getElementById('loading-overlay');
if (loader) {
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 500);
}
