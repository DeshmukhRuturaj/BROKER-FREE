import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  HomeIcon, 
  PlusIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { useFavorites } from '../../contexts/FavoritesContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { count } = useFavorites();
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <HomeIcon className="h-8 w-8 text-primary-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">PropertyHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 sm:space-x-8">
            <Link 
              to="/properties" 
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 text-base sm:text-lg"
            >
              Browse Properties
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/create-listing" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>List Property</span>
                </Link>
                <Link 
                  to="/dashboard" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/favorites"
                  className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                  title="Favorites"
                >
                  <HeartIcon className="h-4 w-4" />
                  {count > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                      {count}
                    </span>
                  )}
                  <span className="hidden md:inline">Favorites</span>
                </Link>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Hi, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600 p-2 rounded"
              aria-label="Open menu"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-7 w-7" />
              ) : (
                <Bars3Icon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation with backdrop */}
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setIsMenuOpen(false)} />
            <div className="md:hidden py-4 border-t border-gray-200 bg-white z-50 relative">
              <div className="flex flex-col space-y-4 px-4">
                <Link 
                  to="/properties" 
                  className="text-gray-700 hover:text-primary-600 font-medium text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Properties
                </Link>
                
                {user ? (
                  <>
                    <Link 
                      to="/create-listing" 
                      className="text-gray-700 hover:text-primary-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      List Property
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="text-gray-700 hover:text-primary-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/favorites"
                      className="text-gray-700 hover:text-primary-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Favorites
                    </Link>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-2">Hi, {user.name}</p>
                      <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-gray-700 hover:text-primary-600 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn-primary inline-block text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar