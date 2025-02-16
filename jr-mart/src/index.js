import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Navbar, { Footer } from './components/layout';

function App(){
  return(
    <Router>
      <div className="App">
        <Navbar />
        <Footer />
      </div>
    </Router>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


