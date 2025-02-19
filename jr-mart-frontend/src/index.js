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

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    
                    {/* Buyer Routes */}
                    <Route path="/buyer/dashboard" element={<BDashboard />} />
                    <Route path="/buyer/Cart" element={<Cart />} />
                    
                    {/* Seller Routes */}
                    <Route path="/seller/dashboard" element={<SDashboard />} />
                    <Route path="/seller/CreateProduct" element={<CreateProduct />} />
                    <Route path="/seller/EditProduct/:id" element={<EditProduct />} />
                    
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


