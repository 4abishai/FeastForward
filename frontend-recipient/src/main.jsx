// src/main.jsx
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';

import HomePage from './components/HomePage.jsx';
import Inventory from './components/Inventory.jsx';
import AddRecipient from './components/AddRecipient.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path='/add-recipient' element={<AddRecipient />} />
      <Route path="/home" element={<HomePage />}>
        <Route index element={<Navigate to="inventory" replace />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
  </BrowserRouter>
);