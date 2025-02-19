import { Link } from "react-router-dom";

export default function Contact() {
    return (
        <div className="container my-4">
            <h2>Contact Us</h2>
            <br />
            <Link href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=CllgCJlKFmVnzLnDqwlVhjJWdLsvTFgZLJFhWMPwzWCsNXXpHHpnwLLSfPKdWRmGTCZRPDsXWpL" target="_blank" rel="noopener noreferrer"> <img src="/EmailLogo.svg" alt="..." width="30" className="me-2" />JRcontact@gmail.com </Link><br />
            <br/>
            <Link href="https://www.instagram.com/junaid11_" target="_blank" rel="noopener noreferrer"><img src="/instagramLogo.svg" alt="..." width="30" className="me-2" />Junaid11_</Link><br /> 
            <center><img src="/call center.jpg" alt="..." width="500px" className="me-2" /></center>
        </div>
        
        
        
    )   
}
