import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <>
    
          <div className="separator-animated-border"></div>
    <footer className="bg-dark text-white text-center py-3 mt-4">

      <div className="container">
        Copyright © 2025 <Link to="https://feard.vercel.app">Fear-Admin</Link>
      </div>
    </footer>
    </>
  );
};

export default Footer;