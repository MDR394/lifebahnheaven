import React from "react";

const Footer = () => {
  return (
    <>
      <div className="container ">
        <footer className="py-3 my-4">
          <ul className="nav bg-dark justify-content-center border-bottom pb-3 mb-3">
            <li className="nav-item">
              <a href="#" className="nav-link px-2 ">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link px-2 ">
                Features
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link px-2 ">
                Pricing
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link px-2 y">
                FAQs
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link px-2 ">
                About
              </a>
            </li>
          </ul>
          <p className="text-center ">© 2024 Company, Inc</p>
        </footer>
      </div>
    </>
  );
};

export default Footer;
