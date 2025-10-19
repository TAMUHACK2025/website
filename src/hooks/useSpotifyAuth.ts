import { useEffect } from 'react';

export function useSpotifyAuth() {
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check');
      return response.ok;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  };

  const login = () => {
    window.location.href = '/api/auth/login';
  };

  const logout = async () => {
    await fetch('/api/auth/logout');
    window.location.reload();
  };

  return { checkAuth, login, logout };
}