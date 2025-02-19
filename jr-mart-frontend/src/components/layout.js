
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom box-shadow" >
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
                            <Link className="nav-link text-dark" to="/contact">Contact</Link>
                        </li>
                        

                    </ul>
                    <ul claaName="nav-item">
                    <Link className="nav-link text-dark" to="/Login">
                    <img  src="/person-circle.svg" alt="..." width="20" className="me-2" />Login
                    </Link>
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