import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function SideBar({ isAuthenticated }) {
  const [auth, setAuth] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      setAuth(true);
    }
  }, []);

  return (
    <>
      <div
        className="d-flex flex-column flex-shrink-0 p-3 bg-body-dark sidebar"
        style={{ width: "320px" }}
      >
        <Link
          to={"/"}
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto  text-decoration-none"
        >
          <div className="fs-4 ">
            <img className="logo" src="/logo.png" alt="" />
          </div>
        </Link>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to={"/"} className="nav-link  fw-bold " aria-current="page">
              <svg className="bi pe-none me-2" width="16" height="16">
                <use xlinkHref="#home"></use>
              </svg>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to={"/create-post"} className="nav-link fw-bold  ">
              <svg className="bi pe-none me-2" width="16" height="16">
                <use xlinkHref="#speedometer2"></use>
              </svg>
              Create Post
            </Link>
          </li>

          {!currentUser ? (
            <>
              <li className="nav-item">
                <Link to={"/sign-up"} className="nav-link ">
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#table"></use>
                  </svg>
                  SignUp
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/login"} className="nav-link ">
                  <svg className="bi pe-none me-2" width="16" height="16">
                    <use xlinkHref="#grid"></use>
                  </svg>
                  Login
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/" className="nav-link ">
                <svg className="bi pe-none me-2" width="16" height="16">
                  <use xlinkHref="#people-circle"></use>
                </svg>
                Market Place
              </Link>
            </li>
          )}
        </ul>
        <hr />
      </div>
    </>
  );
}

export default SideBar;
