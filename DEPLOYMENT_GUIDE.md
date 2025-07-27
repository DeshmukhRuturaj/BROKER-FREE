# 🚀 Deployment Guide: Docker + Render

This guide will walk you through deploying your property listing application using Docker and Render.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas** - Set up a MongoDB cluster
4. **AWS S3** - Configure S3 bucket for file uploads
5. **Google Maps API** - Get API key for maps functionality

## 🔧 Environment Variables Setup

### Backend Environment Variables
Create these in your Render backend service:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-here
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
```

### Frontend Environment Variables
Create these in your Render frontend service:

```
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_API_URL=https://your-backend-service-name.onrender.com
```

## 🐳 Docker Deployment Steps

### Step 1: Local Docker Testing

1. **Build and test locally**:
   ```bash
   # Build the images
   docker-compose build
   
   # Run the services
   docker-compose up -d
   
   # Check logs
   docker-compose logs -f
   
   # Test the application
   curl http://localhost/health
   ```

2. **Stop services**:
   ```bash
   docker-compose down
   ```

### Step 2: Push to GitHub

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add Docker configuration"
   git push origin main
   ```

## 🌐 Render Deployment

### Step 3: Deploy Backend

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in to your account

2. **Create Backend Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `property-listing-backend`
     - **Root Directory**: `backend`
     - **Runtime**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables**
   - Go to "Environment" tab
   - Add all backend environment variables listed above
   - Make sure to set `NODE_ENV=production`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://property-listing-backend.onrender.com`)

### Step 4: Deploy Frontend

1. **Create Frontend Service**
   - Click "New +" → "Static Site"
   - Connect the same GitHub repository
   - Configure:
     - **Name**: `property-listing-frontend`
     - **Root Directory**: `/` (root)
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `dist`
     - **Plan**: Free

2. **Add Environment Variables**
   - Add `VITE_GOOGLE_MAPS_API_KEY`
   - Add `VITE_API_URL` pointing to your backend URL

3. **Configure Routes**
   - Add a rewrite rule: `/*` → `/index.html`
   - This ensures React Router works properly

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment

## 🔍 Verification Steps

### Step 5: Test Your Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-backend-url.onrender.com/api/properties
   ```

2. **Frontend Health Check**:
   ```bash
   curl https://your-frontend-url.onrender.com/health
   ```

3. **Test Features**:
   - ✅ User registration/login
   - ✅ Property listing creation
   - ✅ File uploads
   - ✅ Google Maps integration
   - ✅ Search and filtering

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Render dashboard
   - Verify all dependencies are in package.json
   - Ensure environment variables are set

2. **CORS Errors**
   - Update backend CORS settings to include your frontend domain
   - Check the `allowedOrigins` array in `backend/server.js`

3. **Database Connection Issues**
   - Verify MongoDB Atlas network access
   - Check connection string format
   - Ensure IP whitelist includes Render's IPs

4. **File Upload Issues**
   - Verify AWS S3 bucket permissions
   - Check CORS settings on S3 bucket
   - Ensure AWS credentials are correct

### Debug Commands

```bash
# Check backend logs
docker-compose logs backend

# Check frontend logs
docker-compose logs frontend

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up --build -d
```

## 🔄 Continuous Deployment

### Automatic Deployments
- Render automatically deploys when you push to your main branch
- Set up branch protection rules in GitHub
- Use feature branches for development

### Environment Management
- Use different environment variables for staging/production
- Set up separate Render services for testing
- Use Render's environment variable management

## 📊 Monitoring

### Render Dashboard
- Monitor service health in Render dashboard
- Check logs for errors
- Monitor resource usage

### Health Checks
- Backend: `/api/properties`
- Frontend: `/health`
- Set up external monitoring if needed

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use Render's secure environment variable storage
   - Rotate secrets regularly

2. **CORS Configuration**
   - Only allow necessary origins
   - Use HTTPS in production
   - Implement proper authentication

3. **Database Security**
   - Use MongoDB Atlas security features
   - Enable network access controls
   - Use strong passwords

## 🚀 Next Steps

1. **Custom Domain**
   - Configure custom domain in Render
   - Set up SSL certificates
   - Update DNS records

2. **CDN Setup**
   - Configure Cloudflare or similar
   - Enable caching for static assets
   - Optimize performance

3. **Monitoring**
   - Set up error tracking (Sentry)
   - Configure uptime monitoring
   - Set up performance monitoring

## 📞 Support

If you encounter issues:
1. Check Render's documentation
2. Review application logs
3. Test locally with Docker first
4. Verify all environment variables are set correctly

---

**🎉 Congratulations!** Your property listing application is now deployed and accessible online! 