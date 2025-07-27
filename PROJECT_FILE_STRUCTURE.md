# 📁 Project File Structure & Purpose Guide

## 🏠 **Property Listing Application** - File-by-File Breakdown

---

## 📋 **Root Directory Files**

### **Configuration Files** ⚙️
- **`package.json`** 📦 - Frontend dependencies and scripts (React, Vite, Tailwind)
- **`package-lock.json`** 🔒 - Locked dependency versions for frontend
- **`vite.config.js`** ⚡ - Vite build tool configuration
- **`tailwind.config.js`** 🎨 - Tailwind CSS configuration
- **`postcss.config.js`** 🎯 - PostCSS configuration for Tailwind
- **`index.html`** 🌐 - Main HTML entry point for the React app

---

## 🎨 **Frontend Structure (`src/`)**

### **📁 `src/App.jsx`** - Main Application Component
**Purpose:** 🎯 Root component that sets up routing, context providers, and global layout
**What it does:**
- Sets up React Router for navigation
- Wraps app with AuthProvider and FavoritesProvider
- Defines all application routes
- Includes global toast notifications
- Handles protected routes with authentication

### **📁 `src/main.jsx`** - Application Entry Point
**Purpose:** 🚀 Renders the React app into the DOM
**What it does:**
- Imports React and ReactDOM
- Renders the App component
- Sets up global CSS imports

### **📁 `src/index.css`** - Global Styles
**Purpose:** 🎨 Global CSS styles and Tailwind imports
**What it does:**
- Imports Tailwind CSS utilities
- Defines custom global styles
- Sets up base styling for the app

---

## 🧩 **Components Directory (`src/components/`)**

### **📁 `src/components/auth/`** - Authentication Components
- **`ProtectedRoute.jsx`** 🔒 - Route protection component
  - **Purpose:** Prevents unauthorized access to protected pages
  - **What it does:** Checks if user is authenticated, redirects to login if not

### **📁 `src/components/layout/`** - Layout Components
- **`Navbar.jsx`** 🧭 - Navigation bar component
  - **Purpose:** Main navigation menu
  - **What it does:** Shows login/logout, user menu, navigation links
- **`Footer.jsx`** 🦶 - Footer component
  - **Purpose:** Site footer with links and information
  - **What it does:** Displays contact info, social links, copyright

### **📁 `src/components/map/`** - Map Components
- **`PropertyMap.jsx`** 🗺️ - Google Maps integration
  - **Purpose:** Displays property locations on interactive map
  - **What it does:** Shows property markers, handles map interactions

### **📁 `src/components/properties/`** - Property Components
- **`PropertyCard.jsx`** 🏠 - Individual property display card
  - **Purpose:** Reusable component for displaying property information
  - **What it does:** Shows property image, price, details, favorite button
- **`PropertyFilters.jsx`** 🔍 - Property search and filter component
  - **Purpose:** Allows users to filter and search properties
  - **What it does:** Price range, property type, location, amenities filters

---

## 🧠 **Contexts Directory (`src/contexts/`)**

### **📁 `src/contexts/AuthContext.jsx`** - Authentication State Management
**Purpose:** 🔐 Manages user authentication state across the app
**What it does:**
- Stores current user information
- Handles login/logout functionality
- Manages JWT tokens in localStorage
- Provides authentication status to all components
- Auto-checks authentication status on app load

### **📁 `src/contexts/FavoritesContext.jsx`** - Favorites State Management
**Purpose:** ❤️ Manages user's favorite properties
**What it does:**
- Stores list of favorite property IDs
- Handles adding/removing favorites
- Syncs with localStorage for persistence
- Provides favorites data to components

---

## 📄 **Pages Directory (`src/pages/`)**

### **📁 `src/pages/Home.jsx`** - Landing Page
**Purpose:** 🏠 Main landing page with hero section and featured properties
**What it does:** Displays welcome message, search functionality, featured listings

### **📁 `src/pages/Properties.jsx`** - Property Listing Page
**Purpose:** 📋 Displays all properties with filtering and pagination
**What it does:** Shows property grid, handles search/filtering, pagination

### **📁 `src/pages/PropertyDetail.jsx`** - Individual Property Page
**Purpose:** 🏠 Detailed view of a single property
**What it does:** Shows full property details, images, map, contact info

### **📁 `src/pages/CreateListing.jsx`** - Create Property Form
**Purpose:** ➕ Form for creating new property listings
**What it does:** Multi-step form with image upload, validation, submission

### **📁 `src/pages/Dashboard.jsx`** - User Dashboard
**Purpose:** 📊 User's personal dashboard
**What it does:** Shows user's properties, account info, quick actions

### **📁 `src/pages/Login.jsx`** - Login Page
**Purpose:** 🔑 User login form
**What it does:** Email/password login, form validation, error handling

### **📁 `src/pages/Register.jsx`** - Registration Page
**Purpose:** 📝 User registration form
**What it does:** New user signup, form validation, role selection

### **📁 `src/pages/Favorites.jsx`** - Favorites Page
**Purpose:** ❤️ User's favorite properties
**What it does:** Displays saved properties, remove from favorites

### **📁 `src/pages/AboutUs.jsx`** - About Page
**Purpose:** ℹ️ Information about the company/service
**What it does:** Displays company information, mission, team

### **📁 `src/pages/Contact.jsx`** - Contact Page
**Purpose:** 📞 Contact information and form
**What it does:** Shows contact details, contact form

### **📁 `src/pages/EditProperty.jsx`** - Edit Property Page
**Purpose:** ✏️ Edit existing property listings
**What it does:** Pre-filled form for editing property details

---

## 🔌 **Services Directory (`src/services/`)**

### **📁 `src/services/api.js`** - API Service Layer
**Purpose:** 🌐 Centralized API communication with backend
**What it does:**
- Sets up Axios instance with base URL
- Adds JWT token to requests automatically
- Handles authentication errors (401 redirects)
- Provides functions for all API calls:
  - **Auth:** register, login, getCurrentUser, updateProfile
  - **Properties:** CRUD operations, search, user properties
  - **Favorites:** add, remove, get favorites
  - **Upload:** image upload to AWS S3

---

## 🖼️ **Assets Directory (`src/assets/`)**

### **📁 `src/assets/landing_page.jpg`** - Landing Page Image
**Purpose:** 🖼️ Hero image for the landing page
**What it does:** Provides visual appeal to the home page

---

## 🖥️ **Backend Structure (`backend/`)**

### **📁 `backend/package.json`** - Backend Dependencies
**Purpose:** 📦 Backend Node.js dependencies and scripts
**What it does:** Lists all backend packages (Express, MongoDB, AWS SDK, etc.)

### **📁 `backend/package-lock.json`** - Backend Lock File
**Purpose:** 🔒 Locked backend dependency versions

### **📁 `backend/server.js`** - Main Server File
**Purpose:** 🚀 Express server entry point
**What it does:**
- Sets up Express app with middleware
- Connects to MongoDB database
- Configures CORS for frontend communication
- Sets up API routes
- Serves React app for production
- Starts the server on specified port

---

## 🛣️ **Backend Routes (`backend/routes/`)**

### **📁 `backend/routes/auth.js`** - Authentication Routes
**Purpose:** 🔐 Handles user authentication and authorization
**What it does:**
- **POST /register** - User registration
- **POST /login** - User login
- **GET /me** - Get current user info
- **PUT /profile** - Update user profile
- **POST /favorites/:id** - Add property to favorites
- **DELETE /favorites/:id** - Remove from favorites
- **GET /favorites** - Get user's favorites

### **📁 `backend/routes/properties.js`** - Property Routes
**Purpose:** 🏠 Handles all property-related operations
**What it does:**
- **GET /** - Get all properties with filtering/pagination
- **GET /:id** - Get specific property by ID
- **POST /** - Create new property (seller only)
- **PUT /:id** - Update property (owner only)
- **DELETE /:id** - Delete property (owner only)
- **GET /user/my-properties** - Get user's own properties
- **GET /search/nearby** - Search properties by location

### **📁 `backend/routes/upload.js`** - File Upload Routes
**Purpose:** 📁 Handles image uploads to AWS S3
**What it does:**
- **POST /image** - Upload single image
- **POST /images** - Upload multiple images
- Generates presigned URLs for direct S3 uploads
- Handles file validation and error checking

---

## 🗄️ **Backend Models (`backend/models/`)**

### **📁 `backend/models/User.js`** - User Database Model
**Purpose:** 👤 Defines user data structure and methods
**What it does:**
- User schema with name, email, password, role
- Password hashing with bcrypt
- Password comparison method
- Favorites array for saved properties

### **📁 `backend/models/Property.js`** - Property Database Model
**Purpose:** 🏠 Defines property data structure
**What it does:**
- Comprehensive property schema
- Address and location data
- Images array with captions
- Features and amenities
- Geospatial indexing for location queries
- Text indexing for search functionality

---

## 🔧 **Backend Middleware (`backend/middleware/`)**

### **📁 `backend/middleware/auth.js`** - Authentication Middleware
**Purpose:** 🔒 Protects routes and verifies user authentication
**What it does:**
- Verifies JWT tokens from request headers
- Adds user data to request object
- Handles authorization for different user roles
- Redirects unauthorized requests

---

## ⚙️ **Backend Configuration (`backend/config/`)**

### **📁 `backend/config/s3.js`** - AWS S3 Configuration
**Purpose:** ☁️ Sets up AWS S3 client for file uploads
**What it does:**
- Configures AWS SDK with credentials
- Sets up S3 client for image storage
- Handles bucket configuration
- Provides upload utilities

---

## 🎯 **Key File Relationships**

### **Frontend Flow** 🔄
```
main.jsx → App.jsx → Pages → Components → Services → API
```

### **Backend Flow** 🔄
```
server.js → Routes → Models → Database
```

### **Data Flow** 📊
```
User Action → Component → Context → API Service → Backend Route → Database
```

---

## 🚀 **Deployment Files**

### **Frontend Deployment** ⚛️
- **`vite.config.js`** - Build configuration for Vercel/Render
- **`index.html`** - Entry point for static hosting

### **Backend Deployment** 🖥️
- **`backend/server.js`** - Production server setup
- **Environment variables** - Database and AWS credentials

---

## 📝 **Summary by Function**

### **🔐 Authentication Files**
- `src/contexts/AuthContext.jsx` - Frontend auth state
- `backend/routes/auth.js` - Backend auth endpoints
- `backend/middleware/auth.js` - Route protection
- `backend/models/User.js` - User data model

### **🏠 Property Management Files**
- `src/pages/Properties.jsx` - Property listing
- `src/pages/PropertyDetail.jsx` - Property details
- `src/pages/CreateListing.jsx` - Create property
- `src/pages/EditProperty.jsx` - Edit property
- `backend/routes/properties.js` - Property API
- `backend/models/Property.js` - Property data model

### **🗺️ Map Integration Files**
- `src/components/map/PropertyMap.jsx` - Google Maps component

### **📁 File Upload Files**
- `backend/routes/upload.js` - Upload endpoints
- `backend/config/s3.js` - AWS S3 setup

### **❤️ Favorites System Files**
- `src/contexts/FavoritesContext.jsx` - Favorites state
- `src/pages/Favorites.jsx` - Favorites page
- Favorites endpoints in `backend/routes/auth.js`

### **🎨 UI/UX Files**
- `src/components/layout/Navbar.jsx` - Navigation
- `src/components/layout/Footer.jsx` - Footer
- `src/components/properties/PropertyCard.jsx` - Property cards
- `src/components/properties/PropertyFilters.jsx` - Search/filter

---

*This breakdown shows how each file contributes to the overall functionality of your Property Listing Application! 🏠✨* 