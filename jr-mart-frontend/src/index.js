import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar, { Footer } from './components/layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductList from './pages/seller/ProductList';
import CreateProduct from './pages/seller/CreateProduct';
import EditProduct from './pages/seller/EditProduct';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BDashboard from './pages/buyer/BDashboard';
import SDashboard from './pages/seller/SDashboard';
import Cart from './pages/buyer/Cart';
import BProfile from './pages/buyer/BProfile';
import SProfile from './pages/seller/SProfile';
import Checkout from './pages/buyer/checkout';  // Updated import path

const API_URL = 'http://localhost:3001/api';

// Example fetch call:
fetch(`${API_URL}/products`)
    .then(res => res.json())
    .then(data => {
        // Handle response
    });

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* Buyer Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/buyer/dashboard" element={<BDashboard />} />
                    <Route path="/buyer/Cart" element={<Cart />} />
                    <Route path="/buyer/profile" element={<BProfile />} />
                    <Route path="/buyer/checkout" element={<Checkout />} />
                    
                    {/* Seller Routes */}
                    <Route path="/seller/dashboard" element={<SDashboard />} />
                    <Route path="/seller/CreateProduct" element={<CreateProduct />} />
                    <Route path="/seller/ProductList" element={<ProductList />} />
                    <Route path="/seller/EditProduct/:id" element={<EditProduct />} />
                    <Route path="/seller/profile" element={<SProfile />} />
                    
                    <Route path="*" element={<NotFound />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


