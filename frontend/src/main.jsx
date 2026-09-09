import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Handle stale chunk errors automatically when new builds are deployed
window.addEventListener('error', (e) => {
  const msg = (e && e.message) ? e.message.toLowerCase() : '';
  if (msg.includes('dynamically imported module') || msg.includes('loading chunk') || msg.includes('failed to fetch')) {
    console.warn('Refreshing page due to stale module chunk...');
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
