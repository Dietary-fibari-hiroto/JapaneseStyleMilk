import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CallConnect from './api/realTimeConnect';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CallConnect />
  </React.StrictMode>
);
