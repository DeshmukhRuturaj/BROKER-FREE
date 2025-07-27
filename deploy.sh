#!/bin/bash

# 🚀 Property Listing App Deployment Script
# This script helps you deploy your application to Render using Docker

set -e

echo "🏗️  Building Docker images..."
docker-compose build

echo "🧪 Testing locally..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "🔍 Health checks..."
echo "Backend health check:"
curl -f http://localhost:5000/api/properties || echo "Backend not ready yet"

echo "Frontend health check:"
curl -f http://localhost/health || echo "Frontend not ready yet"

echo "📋 Environment variables checklist:"
echo ""
echo "Backend variables needed:"
echo "✅ NODE_ENV=production"
echo "✅ PORT=5000"
echo "❓ MONGODB_URI=your_mongodb_connection_string"
echo "❓ JWT_SECRET=your_jwt_secret"
echo "❓ AWS_ACCESS_KEY_ID=your_aws_access_key"
echo "❓ AWS_SECRET_ACCESS_KEY=your_aws_secret_key"
echo "❓ AWS_REGION=your_aws_region"
echo "❓ AWS_S3_BUCKET=your_s3_bucket_name"
echo ""
echo "Frontend variables needed:"
echo "❓ VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key"
echo "❓ VITE_API_URL=https://your-backend-url.onrender.com"
echo ""

echo "📝 Next steps:"
echo "1. Set up your environment variables in Render"
echo "2. Push your code to GitHub"
echo "3. Create services in Render dashboard"
echo "4. Deploy!"
echo ""

echo "🛑 To stop local services, run: docker-compose down"
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" 