import React, { useEffect, useState } from 'react';
import { getFavorites } from '../services/api';
import PropertyCard from '../components/properties/PropertyCard';
import { useFavorites } from '../contexts/FavoritesContext';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const Favorites = () => {
  const { favorites, loading, removeFavorite } = useFavorites();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Favorite Properties</h1>
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-500">You have no favorite properties yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(property => (
            <div key={property._id} className="relative group">
              <PropertyCard property={property} />
              <button
                className="absolute top-3 right-3 z-10 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
                title="Remove from Favorites"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFavorite(property._id);
                }}
              >
                <HeartIconSolid className="h-6 w-6 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 