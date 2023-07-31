import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/bootstrap5.min.css';
import './assets/css/vars.scss';
import './assets/css/utils.scss';
import './assets/css/globals.scss';
import App from './pages/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
