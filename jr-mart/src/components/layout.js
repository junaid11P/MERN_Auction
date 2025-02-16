import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom box-shadow">
            <div className="container">
                <Link className="navbar-brand" to="/">
                <img  src="/1.png" alt="..." width="30" className="me-2" />JR mart
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link text-dark" aria-current="page" to="/">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-dark" to="/link">Contact</Link>
                        </li>
                        
                    </ul>
                    <ul claaName="navbar-nav">
                    <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle text-dark" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Admin
                            </Link>
                            <ul className="dropdown-menu">
                                <li><Link className="dropdown-item" to="/action">Product</Link></li>
                                <li><Link className="dropdown-item" to="/another">Profile</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" to="/something">Logout</Link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}


export function Footer() {
    return(
        <div className="text-center p-4 bg-light border-top">
            <img src="/1.png" alt="..." width="30" className="me-2" />
            © 2025 JR mart. All rights reserved.

        </div>
    )
}