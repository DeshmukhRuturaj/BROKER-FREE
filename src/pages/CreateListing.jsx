import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  PhotoIcon, 
  MapPinIcon, 
  XMarkIcon,
  PlusIcon 
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { createProperty } from '../services/api'
import axios from 'axios'

const CreateListing = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const propertyTypes = [
    'House',
    'Apartment',
    'Condo',
    'Villa',
    'Studio',
    'Townhouse',
    'Duplex',
    'Other'
  ]

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }))
    
    setImages(prev => [...prev, ...newImages].slice(0, 10)) // Max 10 images
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files)
    }
  }

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId))
  }

  // Helper to upload images to S3
  async function uploadImagesToS3(files) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const token = localStorage.getItem('token'); // Get JWT token from localStorage

    const response = await axios.post('http://localhost:5000/api/upload/images', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` }) // Add Authorization header if token exists
      },
      withCredentials: true // if you use cookies for auth
    });
    return response.data.images.map(img => img.url); // array of S3 URLs
  }

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please add at least one image')
      return
    }
  
    setLoading(true)
  
    try {
      // Upload images to S3 and get URLs
      const s3Urls = await uploadImagesToS3(images.map(img => img.file));
      const payload = {
        ...data,
        squareFeet: data.areaSqFt, // Map areaSqFt to squareFeet for backend
        propertyType: data.propertyType.toLowerCase(),
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        },
        images: s3Urls.map(url => ({ url })),
        location: {
          type: "Point",
          coordinates: [0, 0] // <-- dummy coordinates, replace with real values if available
        }
      }
      await createProperty(payload)
      toast.success('Property listed successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to create listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Create New Listing</h1>
            <p className="text-gray-600 mt-1">Fill in the details to list your property</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="input-field"
                    placeholder="e.g., Beautiful 3BR Home in Downtown"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    {...register('description', { required: 'Description is required' })}
                    className="input-field"
                    placeholder="Describe your property in detail..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    {...register('propertyType', { required: 'Property type is required' })}
                    className="input-field"
                  >
                    <option value="">Select type</option>
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.propertyType && (
                    <p className="text-red-500 text-sm mt-1">{errors.propertyType.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 1, message: 'Price must be greater than 0' }
                    })}
                    className="input-field"
                    placeholder="450000"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    {...register('bedrooms', { 
                      required: 'Bedrooms is required',
                      min: { value: 0, message: 'Must be 0 or more' }
                    })}
                    className="input-field"
                    placeholder="3"
                  />
                  {errors.bedrooms && (
                    <p className="text-red-500 text-sm mt-1">{errors.bedrooms.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    {...register('bathrooms', { 
                      required: 'Bathrooms is required',
                      min: { value: 0, message: 'Must be 0 or more' }
                    })}
                    className="input-field"
                    placeholder="2"
                  />
                  {errors.bathrooms && (
                    <p className="text-red-500 text-sm mt-1">{errors.bathrooms.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    {...register('areaSqFt', { 
                      required: 'Area is required',
                      min: { value: 1, message: 'Must be greater than 0' }
                    })}
                    className="input-field"
                    placeholder="1200"
                  />
                  {errors.areaSqFt && (
                    <p className="text-red-500 text-sm mt-1">{errors.areaSqFt.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    {...register('street', { required: 'Address is required' })}
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    {...register('city', { required: 'City is required' })}
                    className="input-field"
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    {...register('state', { required: 'State is required' })}
                    className="input-field"
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    {...register('zipCode', { required: 'ZIP code is required' })}
                    className="input-field"
                    placeholder="10001"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    {...register('country', { required: 'Country is required' })}
                    className="input-field"
                    placeholder="USA"
                    defaultValue="USA"
                  />
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>
              
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Upload Property Images
                </p>
                <p className="text-gray-600 mb-4">
                  Drag and drop images here, or click to select files
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="btn-primary cursor-pointer inline-flex items-center space-x-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Choose Images</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Maximum 10 images, up to 5MB each
                </p>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Uploaded Images ({images.length}/10)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.preview}
                          alt="Property"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Creating Listing...</span>
                  </>
                ) : (
                  <>
                    <span>Create Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateListing