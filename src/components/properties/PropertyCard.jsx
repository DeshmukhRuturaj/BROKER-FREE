import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  HomeIcon, 
  BanknotesIcon,
  CalendarIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useFavorites } from '../../contexts/FavoritesContext'
import { format } from 'date-fns'

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some(fav => fav._id === property._id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(property._id);
    } else {
      addFavorite(property._id);
    }
  };

  return (
    <Link to={`/properties/${property._id}`} className="block">
      <div className="property-card group">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images && property.images.length > 0 && property.images[0]?.url ? property.images[0].url : 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              {property.propertyType}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex items-center space-x-2 z-10">
            <span className="bg-white text-gray-900 px-2 py-1 rounded-full text-xs font-bold shadow-sm">
              {formatPrice(property.price)}
            </span>
            <button
              className="ml-2 bg-white rounded-full p-1 shadow hover:bg-red-100 transition"
              title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              onClick={handleFavoriteClick}
            >
              {isFavorite ? (
                <HeartIconSolid className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {property.title}
          </h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {property.location.city}, {property.location.state}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {property.description}
          </p>

          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <HomeIcon className="h-4 w-4 mr-1" />
                {property.bedrooms} bed
              </span>
              <span>{property.bathrooms} bath</span>
              <span>{property.areaSqFt} sqft</span>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center text-xs text-gray-400">
            <CalendarIcon className="h-3 w-3 mr-1" />
            <span>Listed {format(new Date(property.createdAt), 'MMM dd, yyyy')}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default PropertyCard