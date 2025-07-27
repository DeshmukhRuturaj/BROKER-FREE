const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3003'
];
// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // if you use cookies/sessions
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI environment variable is not set');
      return;
    }
    
    // Validate MongoDB URI format
    if (!mongoURI.startsWith('mongodb://') && !mongoURI.startsWith('mongodb+srv://')) {
      console.error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
      return;
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/upload', require('./routes/upload'));

// Serve static files from the React app (only in production)
if (process.env.NODE_ENV === 'production') {
  // Try multiple possible build paths
  const possiblePaths = [
    path.join(__dirname, '../dist'),
    path.join(__dirname, '../../dist'),
    path.join(__dirname, '../frontend/dist'),
    path.join(__dirname, '../../frontend/dist')
  ];
  
  let staticPath = null;
  for (const buildPath of possiblePaths) {
    if (require('fs').existsSync(path.join(buildPath, 'index.html'))) {
      staticPath = buildPath;
      break;
    }
  }
  
  if (staticPath) {
    app.use(express.static(staticPath));
    
    // Catch all handler: send back React's index.html file for any non-API routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(staticPath, 'index.html'));
    });
  } else {
    console.log('Frontend build not found. API-only mode.');
  }
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 