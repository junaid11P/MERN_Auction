import React from 'react';

import ReactDOM from 'react-dom/client';
import Navbar, { Footer } from './components/layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductList from './pages/admin/products/ProductList';
import CreateProduct from './pages/admin/products/CreateProduct';
import EditProduct from './pages/admin/products/EditProduct';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BDashboard from './pages/buyer/BDashboard';
import SDashboard from './pages/seller/SDashboard';

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
                    
                    {/* Seller Routes */}
                    <Route path="/seller/dashboard" element={<SDashboard />} />
                    <Route path="/seller/products/create" element={<CreateProduct />} />
                    <Route path="/seller/products/edit/:id" element={<EditProduct />} />
                    
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


