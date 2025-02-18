import React from 'react';

import ReactDOM from 'react-dom/client';
import Navbar, { Footer } from './components/layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductList from './pages/admin/products/ProductList';


function App(){
  return(
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


