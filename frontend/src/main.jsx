// src/main.jsx
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';

import App from './App.jsx';
import Signup from './components/Signup.jsx';
import HomePage from './components/HomePage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import DonationHistory from './components/DonationHistory.jsx';
import CreateDonation from './components/CreateDonation.jsx';
import Login from './components/Login.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<HomePage />}>
        <Route index element={<Navigate to="donation-history" replace />} />
        <Route path="donation-history" element={<DonationHistory />} />
        <Route path="create-donation" element={<CreateDonation />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
