Auction JR Mart Web Application

Overview
Auction JR Mart is a full-stack e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and Multer for image uploading. It allows buyers to browse, cart, and place Cash on Delivery (COD) orders for various products, including fashion, mobile, laptop, and grocery items. Sellers can manage products, view recent orders, and update the order status.

Features

Buyer Features:
View products from various categories (fashion, mobile, laptops, groceries).
Sign up, log in, and update profiles (email, phone, address).
Add products to cart and place orders using Cash on Delivery (COD).
Track orders in real-time.

Seller Features:
Sign up, log in, and manage product listings (create, update, delete).
View recent orders from buyers.
Update order status and provide tracking updates.

Technologies Used
Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
File Uploading: Multer
Payment: Cash on Delivery (COD)
Version Control: Git/GitHub

Setup Instructions
Prerequisites
Node.js and npm installed.
MongoDB running locally or via a cloud service like MongoDB Atlas.

Installation
Clone the repository:
git clone https://github.com/junaid11P/auction-jr-mart.git

Running frontend:
cd jr-mart-frontend
npm install express
npm start

Running backend:
cd jr-mart-backend
npm start


Running Locally
After setting up, open your browser and navigate to http://localhost:3000 to view the front-end,
and the back-end will run on http://localhost:3001 (or your configured port).

Deployment
For deployment, you can use Heroku or AWS for the backend and Netlify for the frontend. Ensure to set up environment variables on the platform for MongoDB and JWT.

Usage
Buyers: Browse products, create an account, log in, add products to cart, and place COD orders. Track order status in the dashboard.
Sellers: Sign up, log in, and manage products in the seller dashboard. View orders and update tracking status.

Contributions
Contributions are welcome! Feel free to fork the repository and create a pull request.