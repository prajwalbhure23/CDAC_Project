import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-center text-lg-start bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          {/* About Us */}
          <div className="col-lg-6 col-md-8 mb-4 mx-auto">
            <h5 className="text-uppercase">Event Management System</h5>
            <p>
              Plan and manage your events seamlessly with our platform.
              Experience hassle-free booking and organization.
            </p>
          </div>

          {/* Contact Us */}
          <div className="col-lg-6 col-md-8 mb-4 mx-auto">
            <h5 className="text-uppercase">Contact Us</h5>
            <p>Email: support@eventmanagement.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>

        <hr className="my-4 text-light" />

        {/* Login Button */}
        <div className="text-center">
          <p className="mb-2">Already have an account?</p>
          <Link to="/user/login">
            <button className="btn btn-outline-light">Log In</button>
          </Link>
        </div>

        <hr className="my-4 text-light" />

        {/* Copyright */}
        <div className="text-center">
          <p>© 2024 Event Management System. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
