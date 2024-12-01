import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

function Home() {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  return (
    <>
      {!currentUser ? (
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex flex-column justify-content-center">
              <h3>Welcome in</h3>
              <h1>LifeBahn Heaven</h1>
              <p>Become a member to visit the visit Memoriams</p>
              <Link to="/login">
                <button className="btn btn-primary">Become a Member</button>
              </Link>
            </div>
            <div className="col-md-6 py-12">
              <img src="/tree.png" className="w-100" alt="" />
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex flex-column justify-content-center">
              <h3>Welcome in</h3>
              <h1>LifeBahn Heaven</h1>
              <p>Become a Sponsor to Add your Rips</p>
              <Link to="/memoriams">
                <button className="btn btn-primary">Search Your Rips</button>
              </Link>
            </div>
            <div className="col-md-6 py-12">
              <img src="/tree.png" className="w-100" alt="" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
