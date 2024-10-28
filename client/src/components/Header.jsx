import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";

const Header = ({ isAuthenticated }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setAuth(true);
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      // First attempt to logout
      await axios.post(
        "http://localhost:3000/api/v1/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser?.data.accessToken}`,
          },
        }
      );
      alert("Logout Successful");
      setCurrentUser(null); // Clear current user in context
      navigate("/");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "jwt expired"
      ) {
        // Handle token refresh on token expiry
        try {
          const response = await axios.post(
            "http://localhost:3000/api/v1/users/refresh-token",
            { refreshToken: currentUser?.data.refreshToken }
          );
          const { accessToken } = response.data.data;
          // Update access token and retry logout
          currentUser.data.accessToken = accessToken;
          await handleLogout(); // Retry logout with refreshed token
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
          alert("Session expired. Please log in again.");
          setCurrentUser(null); // Clear current user and reset
          navigate("/");
        }
      } else {
        console.error("Error during logout:", error);
        alert("An error occurred during logout. Please try again.");
      }
    }
  };

  return (
    <>
      <header className="bg-dark p-3 mb-3 border-bottom">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a
              href="/"
              className="d-flex align-items-center text-white fw-bold mb-2 mb-lg-0 text-decoration-none"
            >
              LifeBahn Heaven
            </a>

            <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
              <li className="nav-item">
                <Link to={"/"} className="nav-link fw-bold" aria-current="page">
                  Home
                </Link>
              </li>

              {!currentUser ? (
                <>
                  <li className="nav-item">
                    <Link to={"/sign-up"} className="nav-link">
                      SignUp
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to={"/login"} className="nav-link">
                      Login
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to={"/memoriams"} className="nav-link px-3">
                      Memoriams
                    </Link>
                  </li>
                  {currentUser.data.roles === "sponsor" && (
                    <li className="nav-item">
                      <Link to={"/create-post"} className="nav-link fw-bold">
                        Add Rip
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>

            <form
              className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3 search__input"
              role="search"
            >
              <input
                type="search"
                className="form-control bg-dark text-white"
                placeholder="Search..."
                aria-label="Search"
              />
            </form>

            <div className="dropdown text-end">
              <a
                href="#"
                className="d-block link-body-emphasis text-decoration-none dropdown-toggle text-white"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {currentUser ? (
                  <span className="m-2">
                    <img
                      src={
                        currentUser?.data?.user?.avatar || "default-avatar-url"
                      }
                      alt="avatar"
                      width="32"
                      height="32"
                      className="rounded-circle"
                    />{" "}
                    {currentUser.data.user.userName}
                  </span>
                ) : (
                  ""
                )}
              </a>
              <ul className="dropdown-menu text-small">
                {currentUser ? (
                  <>
                    <li>
                      <Link to={"/profile"} className="dropdown-item bg-light">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item bg-light"
                        onClick={handleLogout}
                      >
                        Sign out
                      </button>
                    </li>
                  </>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
