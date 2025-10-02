// src/utils/handleSignout.js

export const handleSignout = (navigate) => {
  localStorage.clear();
  document.cookie = 'refresh_token=; Max-Age=0; path=/; secure; samesite=strict';
  navigate('/login');
};