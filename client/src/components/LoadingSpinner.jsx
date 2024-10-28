import React from "react";

const LoadingSpinner = () => {
  return (
    <center>
      <div
        className="spinner-border text-success spinner"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <h5>Loading...</h5>
    </center>
  );
};

export default LoadingSpinner;
