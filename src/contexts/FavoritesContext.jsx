import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFavorites, addFavorite as apiAddFavorite, removeFavorite as apiRemoveFavorite } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refreshFavorites = async () => {
    setLoading(true);
    try {
      const res = await getFavorites();
      setFavorites(res.data || []);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      refreshFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const addFavorite = async (propertyId) => {
    await apiAddFavorite(propertyId);
    await refreshFavorites();
  };

  const removeFavorite = async (propertyId) => {
    await apiRemoveFavorite(propertyId);
    await refreshFavorites();
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      count: favorites.length,
      loading,
      refreshFavorites,
      addFavorite,
      removeFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}; 