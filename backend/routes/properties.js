const express = require('express');
const Property = require('../models/Property');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/properties
// @desc    Get all properties with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      propertyType,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      city,
      state,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    if (propertyType) {
      filter.propertyType = propertyType;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (bedrooms) {
      filter.bedrooms = { $gte: Number(bedrooms) };
    }
    
    if (bathrooms) {
      filter.bathrooms = { $gte: Number(bathrooms) };
    }
    
    if (city) {
      filter['address.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      filter['address.state'] = new RegExp(state, 'i');
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const properties = await Property.find(filter)
      .populate('seller', 'name email phone')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('seller', 'name email phone');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/properties
// @desc    Create a new property
// @access  Private (Seller only)
router.post('/', auth, authorize('seller'), async (req, res) => {
  try {
    // Debug: log images array
    console.log('Creating property with images:', req.body.images);
    const {
      title,
      description,
      price,
      propertyType,
      status,
      bedrooms,
      bathrooms,
      squareFeet,
      yearBuilt,
      address,
      location,
      amenities,
      features,
      contactInfo
    } = req.body;

    const property = new Property({
      title,
      description,
      price,
      propertyType,
      status,
      bedrooms,
      bathrooms,
      squareFeet,
      yearBuilt,
      address,
      location,
      amenities,
      features,
      contactInfo,
      seller: req.user._id,
      images: req.body.images // Make sure to save images if provided
    });

    await property.save();

    res.status(201).json({
      message: 'Property created successfully',
      property
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update a property
// @access  Private (Owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    // Debug: log images array
    console.log('Updating property with images:', req.body.images);
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('seller', 'name email phone');

    res.json({
      message: 'Property updated successfully',
      property: updatedProperty
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete a property
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/properties/user/my-properties
// @desc    Get current user's properties
// @access  Private
router.get('/user/my-properties', auth, async (req, res) => {
  try {
    const properties = await Property.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/properties/search/nearby
// @desc    Search properties by location
// @access  Public
router.get('/search/nearby', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }

    const properties = await Property.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(longitude), Number(latitude)]
          },
          $maxDistance: Number(maxDistance)
        }
      },
      isActive: true
    }).populate('seller', 'name email phone');

    res.json(properties);
  } catch (error) {
    console.error('Nearby search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/properties/:id/images
// @desc    Add images to property
// @access  Private (Owner only)
router.post('/:id/images', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { images } = req.body;

    property.images.push(...images);
    await property.save();

    res.json({
      message: 'Images added successfully',
      property
    });
  } catch (error) {
    console.error('Add images error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 