const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  propertyType: {
    type: String,
    required: true,
    enum: ['house', 'apartment', 'condo', 'villa', 'studio', 'townhouse', 'duplex', 'other']
  },
  status: {
    type: String,
    required: true,
    enum: ['for-sale', 'for-rent', 'sold', 'rented'],
    default: 'for-sale'
  },
  bedrooms: {
    type: Number,
    min: 0
  },
  bathrooms: {
    type: Number,
    min: 0
  },
  squareFeet: {
    type: Number,
    min: 0
  },
  yearBuilt: {
    type: Number
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      default: 'USA'
    }
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  amenities: [{
    type: String
  }],
  features: {
    parking: {
      type: Boolean,
      default: false
    },
    garage: {
      type: Boolean,
      default: false
    },
    pool: {
      type: Boolean,
      default: false
    },
    garden: {
      type: Boolean,
      default: false
    },
    fireplace: {
      type: Boolean,
      default: false
    },
    airConditioning: {
      type: Boolean,
      default: false
    },
    heating: {
      type: Boolean,
      default: false
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactInfo: {
    phone: String,
    email: String
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
propertySchema.index({ location: '2dsphere' });

// Create text index for search functionality
propertySchema.index({
  title: 'text',
  description: 'text',
  'address.city': 'text',
  'address.state': 'text'
});

module.exports = mongoose.model('Property', propertySchema); 