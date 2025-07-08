import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Change if your backend runs elsewhere
  withCredentials: false, // Set to true if you use cookies for auth
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors (optional: redirect to login on 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getCurrentUser = () => api.get("/auth/me");
export const updateProfile = (data) => api.put("/auth/profile", data);

// Properties API
export const getProperties = (params) => api.get("/properties", { params });
export const getPropertyById = (id) => api.get(`/properties/${id}`);
export const createProperty = (data) => api.post("/properties", data);
export const updateProperty = (id, data) => api.put(`/properties/${id}`, data);
export const deleteProperty = (id) => api.delete(`/properties/${id}`);
export const getMyProperties = () => api.get("/properties/user/my-properties");
export const searchNearbyProperties = (params) => api.get("/properties/search/nearby", { params });

// Favorites API
export const addFavorite = (propertyId) => api.post(`/auth/favorites/${propertyId}`);
export const removeFavorite = (propertyId) => api.delete(`/auth/favorites/${propertyId}`);
export const getFavorites = () => api.get("/auth/favorites");

// Image Upload API
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/upload/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadImages = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));
  return api.post("/upload/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export default api;