import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  HomeIcon, 
  CalendarIcon,
  UserIcon,
  HeartIcon,
  ShareIcon,
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useFavorites } from '../contexts/FavoritesContext'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import PropertyMap from '../components/map/PropertyMap'
import { getPropertyById } from '../services/api'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

const PropertyDetail = () => {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some(fav => fav._id === id || fav._id === property?._id);
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [showOwner, setShowOwner] = useState(false)
  const [zipLatLng, setZipLatLng] = useState(null);

  useEffect(() => {
    loadProperty()
  }, [id])

  useEffect(() => {
    if (property && (!property.location || typeof property.location.lat !== 'number' || typeof property.location.lng !== 'number' || isNaN(property.location.lat) || isNaN(property.location.lng))) {
      // Geocode zip code
      const fetchLatLng = async () => {
        try {
          const zip = property.address?.zipCode;
          if (!zip) return;
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
          const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${zip}&key=${apiKey}`);
          const data = await response.json();
          if (data.results && data.results[0]) {
            const { lat, lng } = data.results[0].geometry.location;
            setZipLatLng({ lat, lng });
          }
        } catch (err) {
          setZipLatLng(null);
        }
      };
      fetchLatLng();
    }
  }, [property]);

  const loadProperty = async () => {
    try {
      setLoading(true)
      const response = await getPropertyById(id)
      setProperty(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading property:', error)
      setLoading(false)
    }
  }

  const handleFavoriteToggle = () => {
    if (!property) return;
    if (isFavorite) {
      removeFavorite(property._id);
      toast.success('Removed from favorites');
    } else {
      addFavorite(property._id);
      toast.success('Added to favorites');
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleContactSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would send the inquiry to the property owner
    toast.success('Your inquiry has been sent to the property owner!')
    setShowContactForm(false)
    setContactForm({ name: '', email: '', phone: '', message: '' })
  }

  const handleEmailClick = (email, name = '') => {
    const subject = `Inquiry about ${property.title}`
    const body = `Hello ${name ? name + ',' : ''}

I am interested in your property: ${property.title} located at ${property.address.street}, ${property.address.city}, ${property.address.state}.

Please provide more details about:
- Property availability
- Viewing arrangements
- Any additional information

Thank you!`

    // Try mailto first
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    // Create a temporary link and click it
    const link = document.createElement('a')
    link.href = mailtoLink
    link.click()
    
    // If mailto doesn't work, copy to clipboard as fallback
    setTimeout(() => {
      const emailContent = `To: ${email}\nSubject: ${subject}\n\n${body}`
      navigator.clipboard.writeText(emailContent).then(() => {
        toast.success('Email content copied to clipboard! You can paste it in your email client.')
      }).catch(() => {
        toast.error('Could not copy to clipboard. Please manually compose your email.')
      })
    }, 1000)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
          <Link to="/properties" className="btn-primary">
            Browse Properties
          </Link>
        </div>
      </div>
    )
  }

  // Debug: print images array
  console.log('Property images:', property.images);

  // Prepare images for gallery, with fallback
  let galleryImages = (property.images || []).map(img => {
    if (typeof img === 'string') {
      return { original: img, thumbnail: img };
    } else if (img && img.url) {
      return { original: img.url, thumbnail: img.url };
    }
    return null;
  }).filter(Boolean);
  if (!galleryImages.length) {
    galleryImages = [
      {
        original: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
        thumbnail: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      },
    ];
  }

  // Ensure areaSqFt is always shown if present, fallback to other possible field names
  const areaSqFt = property.areaSqFt || property.squareFeet || property.area || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/properties"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Properties</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFavoriteToggle}
                className="p-2 rounded-full hover:bg-gray-100"
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                {isFavorite ? (
                  <HeartIconSolid className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* Image Gallery - moved here above description */}
              <div className="mb-8">
                <ImageGallery
                  items={galleryImages}
                  showThumbnails={true}
                  showPlayButton={false}
                  showFullscreenButton={true}
                  showNav={true}
                  autoPlay={false}
                />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPinIcon className="h-5 w-5 mr-1" />
                    <span>
                      {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                    </span>
                  </div>
                  {/* Show map here with address */}
                  {property.location &&
                    typeof property.location.lat === 'number' &&
                    typeof property.location.lng === 'number' &&
                    !isNaN(property.location.lat) &&
                    !isNaN(property.location.lng) && (
                      <div className="my-4">
                        <PropertyMap 
                          properties={[property]} 
                          height="300px"
                        />
                      </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.areaSqFt && property.areaSqFt > 0 ? ` 9${Math.round(property.price / property.areaSqFt)}/sqft` : ''}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{areaSqFt ? areaSqFt.toLocaleString() : 'N/A'}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{property.propertyType}</div>
                  <div className="text-sm text-gray-600">Type</div>
                </div>
              </div>

              {/* Location Section */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Location</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPinIcon className="h-5 w-5 mr-1" />
                  <span>
                    {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                  </span>
                </div>
                {property.location &&
                  typeof property.location.lat === 'number' &&
                  typeof property.location.lng === 'number' &&
                  !isNaN(property.location.lat) &&
                  !isNaN(property.location.lng) && (
                    <div className="my-4">
                      <PropertyMap 
                        properties={[property]} 
                        height="300px"
                      />
                    </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Listing Details */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>Listed on {format(new Date(property.createdAt), 'MMMM dd, yyyy')}</span>
                </div>
              </div>
            </div>

            {/* Map based on property.location or zip code */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
              {(property.location && typeof property.location.lat === 'number' && typeof property.location.lng === 'number' && !isNaN(property.location.lat) && !isNaN(property.location.lng)) ? (
                <PropertyMap properties={[property]} height="400px" />
              ) : zipLatLng ? (
                <PropertyMap properties={[{ ...property, location: { lat: zipLatLng.lat, lng: zipLatLng.lng } }]} height="400px" />
              ) : (
                <div className="text-gray-500">Location map not available.</div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Property Owner</h3>
                  <p className="text-sm text-gray-600">Direct contact</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {property.seller ? (
                  <button
                    onClick={() => handleEmailClick(property.seller.email, property.seller.name)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>Send Email</span>
                  </button>
                ) : property.contactInfo && property.contactInfo.email ? (
                  <button
                    onClick={() => handleEmailClick(property.contactInfo.email)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>Send Email</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>Contact Owner</span>
                  </button>
                )}
              </div>

              <div className="text-xs text-gray-500 text-center">
                Connect directly with the property owner. No agent fees or commissions.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Contact Property Owner
            </h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  placeholder="I'm interested in this property..."
                  className="input-field"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PropertyDetail