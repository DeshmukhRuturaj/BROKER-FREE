import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  ViewColumnsIcon, 
  MapIcon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline'
import PropertyCard from '../components/properties/PropertyCard'
import PropertyFilters from '../components/properties/PropertyFilters'
import PropertyMap from '../components/map/PropertyMap'
import { getProperties } from '../services/api'

const Properties = () => {
  const [searchParams] = useSearchParams()
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'map'
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [filters, setFilters] = useState({
    propertyType: 'All',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    location: '',
    searchTerm: ''
  })

  useEffect(() => {
    loadProperties()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [properties, filters])

  useEffect(() => {
    // Handle search from URL params
    const searchTerm = searchParams.get('search')
    if (searchTerm) {
      setFilters(prev => ({ ...prev, searchTerm }))
    }
  }, [searchParams])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const response = await getProperties()
      setProperties(response.data.properties)
      setLoading(false)
    } catch (error) {
      console.error('Error loading properties:', error)
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...properties]

    // Property type filter
    if (filters.propertyType !== 'All') {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType)
    }

    // Price range filter
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(filters.maxPrice))
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      filtered = filtered.filter(p => p.bedrooms >= parseInt(filters.bedrooms))
    }

    // Bathrooms filter
    if (filters.bathrooms) {
      filtered = filtered.filter(p => p.bathrooms >= parseInt(filters.bathrooms))
    }

    // Location filter
    if (filters.location) {
      const locationLower = (filters.location || '').toLowerCase()
      filtered = filtered.filter(p => 
        ((p.location && p.location.city) ? p.location.city.toLowerCase() : '').includes(locationLower) ||
        ((p.location && p.location.state) ? p.location.state.toLowerCase() : '').includes(locationLower) ||
        ((p.location && p.location.address) ? p.location.address.toLowerCase() : '').includes(locationLower) ||
        ((p.address && p.address.zipCode) ? p.address.zipCode.toLowerCase() : '').includes(locationLower)
      )
    }

    // Search term filter
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(property =>
        (property.title || '').toLowerCase().includes(searchLower) ||
        (property.description || '').toLowerCase().includes(searchLower) ||
        ((property.location && property.location.city) ? property.location.city.toLowerCase() : '').includes(searchLower) ||
        ((property.location && property.location.state) ? property.location.state.toLowerCase() : '').includes(searchLower) ||
        ((property.location && property.location.address) ? property.location.address.toLowerCase() : '').includes(searchLower) ||
        ((property.address && property.address.zipCode) ? property.address.zipCode.toLowerCase() : '').includes(searchLower) ||
        (property.propertyType || '').toLowerCase().includes(searchLower)
      )
    }

    setFilteredProperties(filtered)
  }

  const handlePropertySelect = (property) => {
    setSelectedProperty(property)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Properties for Sale
          </h1>
          <p className="text-gray-600">
            {filteredProperties.length} properties found
          </p>
        </div>

        {/* Filters */}
        <PropertyFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg ${
                viewMode === 'map'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MapIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2">
              <PropertyMap
                properties={filteredProperties}
                selectedProperty={selectedProperty}
                onPropertySelect={handlePropertySelect}
                height="600px"
              />
            </div>
            
            {/* Property List */}
            <div className="space-y-4 max-h-96 lg:max-h-full overflow-y-auto">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  className={`card p-4 cursor-pointer transition-all duration-200 ${
                    selectedProperty?._id === property._id
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handlePropertySelect(property)}
                >
                  <div className="flex space-x-3">
                    <img
                      src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
                      alt={property.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {property.location.city}, {property.location.state}
                      </p>
                      <p className="font-bold text-primary-600">
                        ${property.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AdjustmentsHorizontalIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={() => setFilters({
                propertyType: 'All',
                minPrice: '',
                maxPrice: '',
                bedrooms: '',
                bathrooms: '',
                location: '',
                searchTerm: ''
              })}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Properties