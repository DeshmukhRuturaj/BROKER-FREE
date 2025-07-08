# 🏡 Broker-Free – Modern Real Estate Platform

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)
![AWS S3](https://img.shields.io/badge/AWS-S3-orange.svg)
![Responsive](https://img.shields.io/badge/Responsive-Mobile%20First-blueviolet.svg)

> A modern, full-stack real estate platform built with **React**, **Node.js**, **MongoDB**, and **AWS S3**, allowing users to list, search, and manage properties — broker-free, no hidden fees.

---

## 🌟 Features

- 🔐 **User Authentication** – Signup/signin using email, secure JWT-based auth
- 🏠 **Property Listings** – Create, edit, and manage listings with multiple image uploads (stored on AWS S3)
- 🔍 **Advanced Search** – Filter properties by type, price, city, state, zip, and more
- ❤️ **Favorites** – Save and manage favorite listings
- ✏️ **Owner Permissions** – Only the listing owner can edit or delete their properties
- 📱 **Responsive Design** – Mobile-first, clean UI with Tailwind CSS

---



## 🛠️ Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router DOM
- React Hot Toast
- Heroicons

### Backend
- Node.js & Express
- MongoDB (Mongoose)
- JWT for Authentication

### Storage
- AWS S3 (for image hosting)

### Other
- Google Maps API *(optional)*

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/broker-free.git
cd broker-free

### 2. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../
npm install

## 3. Configure Environment Variables

### 📦 Backend `.env`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_S3_BUCKET=your_bucket_name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 🌐 Frontend `.env`

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

---

## 4. Run the Application

```bash
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
cd ../
npm run dev
```

---

## ☁️ AWS S3 Setup

### 1. Create a Bucket

* Go to AWS S3 and create a new bucket (e.g., `broker-free-bucket`)

### 2. Set Public Read Policy

* Go to **Permissions > Bucket Policy** and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::broker-free-bucket/*"
    }
  ]
}
```

### 3. Configure CORS

* Go to **Permissions > CORS Configuration** and paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

### 4. Create IAM User

* Go to **IAM > Users > Add User**
* Enable **Programmatic Access**
* Attach the policy: `AmazonS3FullAccess`
* Copy the **Access Key ID** and **Secret Access Key** into your backend `.env`

---

## 📁 Project Structure

```bash
broker-free/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   └── App.jsx
├── public/
│   └── assets/
└── .env
```

---

## 🔐 Data Models

### 👤 User

```json
{
  "name": "String",
  "email": "String",
  "password": "Hashed",
  "favorites": ["PropertyID"],
  "role": "user"
}
```

### 🏠 Property

```json
{
  "title": "String",
  "description": "String",
  "price": "Number",
  "propertyType": "String",
  "status": "Available/Sold/Rented",
  "bedrooms": "Number",
  "bathrooms": "Number",
  "squareFeet": "Number",
  "address": "String",
  "location": "Geo",
  "images": [
    { "url": "String" }
  ],
  "seller": "UserID"
}
```

---

## 📱 Mobile Friendly

* Responsive layouts with Tailwind CSS
* Touch-optimized buttons and modals
* Clean navigation across all screen sizes

---

## 🔄 Integrations

* **AWS S3** – secure image upload and public hosting
* **Google Maps API** (optional) – display and search property locations

---

## 🛡️ Security

* JWT-based authentication for protected routes
* Role-based access: Only property owners can edit/delete listings
* Environment variables for secret keys and API credentials

---

## 🤝 Contributing

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Open a pull request

---

## 📄 License

Licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for more details.

---

## 👤 Author

**Ruturaj Deshmukh**

> Happy house hunting — broker-free! 🏡

