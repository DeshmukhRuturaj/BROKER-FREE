# Environment Variables Setup Guide

## For Backend Service (property-listing-backend)

Set these environment variables in your Render backend service:

### Required Variables:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
```

### Optional Variables (for file uploads):
```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
```

## For Frontend Service (property-listing-frontend)

Set these environment variables in your Render frontend service:

### Required Variables:
```
VITE_API_URL=https://your-backend-service-name.onrender.com
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (free tier)
3. Create a database user
4. Get your connection string
5. Replace `username`, `password`, `cluster`, and `database-name` in the MONGODB_URI

Example MONGODB_URI:
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/property-listing?retryWrites=true&w=majority
```

## JWT Secret

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the API key to your domain 