import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon, 
  HomeIcon, 
  MapPinIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import PropertyCard from '../components/properties/PropertyCard'
import PropertyMap from '../components/map/PropertyMap'
import { getProperties } from '../services/api'
import landingPageImg from '../assets/landing_page.jpg'; // Adjust path if needed

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Load featured properties (latest 3)
    getProperties({ limit: 3, sortBy: 'createdAt', sortOrder: 'desc' })
      .then(res => setFeaturedProperties(res.data.properties))
      .catch(() => setFeaturedProperties([]))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    // Navigate to properties page with search term
    window.location.href = `/properties?search=${encodeURIComponent(searchTerm)}`
  }

  const features = [
    {
      icon: HomeIcon,
      title: 'Direct Owner Contact',
      description: 'Connect directly with property owners without any intermediaries or agent fees.'
    },
    {
      icon: MapPinIcon,
      title: 'Interactive Maps',
      description: 'Explore properties with detailed maps and neighborhood information.'
    },
    {
      icon: UserGroupIcon,
      title: 'Verified Listings',
      description: 'All listings are verified to ensure authenticity and accuracy.'
    },
    {
      icon: CheckCircleIcon,
      title: 'Easy Listing',
      description: 'List your property in minutes with our simple and intuitive interface.'
    }
  ]

  const stats = [
    { number: '10,000+', label: 'Properties Listed' },
    { number: '5,000+', label: 'Happy Customers' },
    { number: '50+', label: 'Cities Covered' },
    { number: '99%', label: 'Satisfaction Rate' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-24 px-4"
        style={{
          backgroundImage: `url(${landingPageImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-blue-900 bg-opacity-60 z-0" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Find Your Dream Home</h1>
          <p className="text-xl text-white mb-8 font-medium max-w-xl mx-auto drop-shadow">
            Connect directly with property owners. No agents, no fees, just simple property transactions.
          </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-slide-up">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location, city, or property type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-32 py-4 text-gray-900 rounded-lg text-lg focus:ring-4 focus:ring-primary-300 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/properties"
                className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Browse Properties</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/create-listing"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                List Your Property
              </Link>
            </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PropertyHub?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make property transactions simple, transparent, and direct.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Properties
              </h2>
              <p className="text-gray-600">
                Discover the latest and most popular listings
              </p>
            </div>
            <Link
              to="/properties"
              className="btn-primary flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          {/* Map Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Explore Properties on Map
            </h3>
            <PropertyMap 
              properties={featuredProperties} 
              height="500px"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-primary-100">
              Join our growing community of property owners and buyers
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Whether you're looking to buy or sell, we're here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary text-lg py-3 px-8"
            >
              Sign Up Today
            </Link>
            <Link
              to="/properties"
              className="btn-secondary text-lg py-3 px-8"
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home