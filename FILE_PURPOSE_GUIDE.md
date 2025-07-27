# 📁 Project Files - What Each File Does

## 🏠 **Property Listing Application** - File Purpose Guide

---

## 📋 **Root Directory Files**

| File | Purpose | What It Does |
|------|---------|--------------|
| `package.json` | 📦 Frontend dependencies | Lists React, Vite, Tailwind CSS packages and scripts |
| `vite.config.js` | ⚡ Build configuration | Configures Vite for fast development and building |
| `tailwind.config.js` | 🎨 CSS framework setup | Configures Tailwind CSS utilities and theme |
| `index.html` | 🌐 Main HTML file | Entry point for the React application |

---

## ⚛️ **Frontend Files (`src/`)**

### **Core Application Files**
| File | Purpose | What It Does |
|------|---------|--------------|
| `src/App.jsx` | 🎯 Main app component | Sets up routing, context providers, and all routes |
| `src/main.jsx` | 🚀 App entry point | Renders React app into the DOM |
| `src/index.css` | 🎨 Global styles | Imports Tailwind CSS and custom styles |

### **Context Files (State Management)**
| File | Purpose | What It Does |
|------|---------|--------------|
| `src/contexts/AuthContext.jsx` | 🔐 User authentication | Manages login/logout, user data, JWT tokens |
| `src/contexts/FavoritesContext.jsx` | ❤️ Favorite properties | Manages user's saved properties list |

### **Service Files**
| File | Purpose | What It Does |
|------|---------|--------------|
| `src/services/api.js` | 🌐 API communication | Handles all backend API calls (auth, properties, uploads) |

### **Page Components**
| File | Purpose | What It Does |
|------|---------|--------------|
| `src/pages/Home.jsx` | 🏠 Landing page | Welcome page with hero section and featured properties |
| `src/pages/Properties.jsx` | 📋 Property listings | Shows all properties with search and filters |
| `src/pages/PropertyDetail.jsx` | 🏠 Property details | Detailed view of a single property |
| `src/pages/CreateListing.jsx` | ➕ Create property | Form to add new property listings |
| `src/pages/Dashboard.jsx` | 📊 User dashboard | User's personal dashboard and account info |
| `src/pages/Login.jsx` | 🔑 Login form | User login page |
| `src/pages/Register.jsx` | 📝 Registration form | New user signup page |
| `src/pages/Favorites.jsx` | ❤️ Saved properties | Shows user's favorite properties |
| `src/pages/AboutUs.jsx` | ℹ️ About page | Company information page |
| `src/pages/Contact.jsx` | 📞 Contact page | Contact information and form |
| `src/pages/EditProperty.jsx` | ✏️ Edit property | Form to edit existing properties |

### **Reusable Components**
| File | Purpose | What It Does |
|------|---------|--------------|
| `src/components/auth/ProtectedRoute.jsx` | 🔒 Route protection | Prevents unauthorized access to pages |
| `src/components/layout/Navbar.jsx` | 🧭 Navigation bar | Main site navigation menu |
| `src/components/layout/Footer.jsx` | 🦶 Footer | Site footer with links and info |
| `src/components/map/PropertyMap.jsx` | 🗺️ Google Maps | Interactive map showing property locations |
| `src/components/properties/PropertyCard.jsx` | 🏠 Property card | Reusable component for property display |
| `src/components/properties/PropertyFilters.jsx` | 🔍 Search filters | Property search and filtering interface |

---

## 🖥️ **Backend Files (`backend/`)**

### **Core Server Files**
| File | Purpose | What It Does |
|------|---------|--------------|
| `backend/server.js` | 🚀 Main server | Express server setup, routes, database connection |
| `backend/package.json` | 📦 Backend dependencies | Lists Node.js packages (Express, MongoDB, AWS) |

### **API Routes**
| File | Purpose | What It Does |
|------|---------|--------------|
| `backend/routes/auth.js` | 🔐 Authentication API | User login, register, profile, favorites |
| `backend/routes/properties.js` | 🏠 Property API | CRUD operations for property listings |
| `backend/routes/upload.js` | 📁 File upload API | Image upload to AWS S3 |

### **Database Models**
| File | Purpose | What It Does |
|------|---------|--------------|
| `backend/models/User.js` | 👤 User data model | Defines user schema and password handling |
| `backend/models/Property.js` | 🏠 Property data model | Defines property schema with all details |

### **Middleware & Config**
| File | Purpose | What It Does |
|------|---------|--------------|
| `backend/middleware/auth.js` | 🔒 Authentication middleware | Protects routes, verifies JWT tokens |
| `backend/config/s3.js` | ☁️ AWS S3 setup | Configures file upload to cloud storage |

---

## 🎯 **Key File Relationships**

### **Authentication Flow** 🔐
```
Login Page → AuthContext → API Service → Auth Routes → User Model → Database
```

### **Property Management Flow** 🏠
```
Property Pages → Property Components → API Service → Property Routes → Property Model → Database
```

### **File Upload Flow** 📁
```
Upload Form → API Service → Upload Routes → S3 Config → AWS S3
```

---

## 📊 **File Categories by Function**

### **🔐 Authentication & Security**
- `src/contexts/AuthContext.jsx` - Frontend auth state
- `backend/routes/auth.js` - Backend auth endpoints
- `backend/middleware/auth.js` - Route protection
- `backend/models/User.js` - User data

### **🏠 Property Management**
- `src/pages/Properties.jsx` - Property listing
- `src/pages/PropertyDetail.jsx` - Property details
- `src/pages/CreateListing.jsx` - Create property
- `src/pages/EditProperty.jsx` - Edit property
- `backend/routes/properties.js` - Property API
- `backend/models/Property.js` - Property data

### **🗺️ Maps & Location**
- `src/components/map/PropertyMap.jsx` - Google Maps integration

### **📁 File Uploads**
- `backend/routes/upload.js` - Upload endpoints
- `backend/config/s3.js` - AWS S3 configuration

### **❤️ Favorites System**
- `src/contexts/FavoritesContext.jsx` - Favorites state
- `src/pages/Favorites.jsx` - Favorites page

### **🎨 User Interface**
- `src/components/layout/Navbar.jsx` - Navigation
- `src/components/layout/Footer.jsx` - Footer
- `src/components/properties/PropertyCard.jsx` - Property cards
- `src/components/properties/PropertyFilters.jsx` - Search/filter

---

## 🚀 **Quick Reference**

### **To Add a New Page:**
1. Create file in `src/pages/`
2. Add route in `src/App.jsx`
3. Create API endpoint in `backend/routes/` (if needed)

### **To Add a New Component:**
1. Create file in `src/components/`
2. Import and use in pages

### **To Add a New API Endpoint:**
1. Add route in `backend/routes/`
2. Create API function in `src/services/api.js`
3. Use in components/pages

### **To Add Database Field:**
1. Update model in `backend/models/`
2. Update API routes if needed
3. Update frontend forms/components

---

*This guide shows exactly what each file does in your Property Listing Application! 🏠✨* 