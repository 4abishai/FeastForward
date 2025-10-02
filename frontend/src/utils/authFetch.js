// src/utils/authFetch.js

import { handleSignout } from './handleSignout';

export const authFetch = async (url, options = {}, navigate) => {
  const enhancedOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      donor_id: localStorage.getItem('donor_id'),
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  };

  const response = await fetch(url, enhancedOptions);

  if (response.status === 401) {
    handleSignout(navigate);
    throw new Error('Unauthorized');
  }

  return response;
};
