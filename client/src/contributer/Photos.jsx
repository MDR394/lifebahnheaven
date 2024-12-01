import React, { useContext, useState } from "react";
import { PhotoStore } from "../store/post-list-store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useParams } from "react-router-dom";

const Photos = () => {
  const { _id } = useParams(); // Retrieve RIP ID from route parameters
  const { currentUser } = useContext(AuthContext);
  const { addPhoto } = useContext(PhotoStore); // Adjust according to your context structure
  const [formData, setFormData] = useState({
    photoImg: null,
  });
  const navigate = useNavigate();

  // console.log(currentUser);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    setFormData({
      ...formData,
      photoImg: files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    data.append("photoImg", formData.photoImg);
    data.append("postId", _id); // Pass the RIP ID (from useParams)

    try {
      const response = await axios.post(
        "https://lifebahnheaven-server.vercel.app/api/v1/photos",
        data,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.data.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Photo Has Been Added Successfully");

      // Navigate to another route if necessary
      // navigate("/flowers"); // Example route
    } catch (error) {
      console.error("Error during Photo Adding:", error.response?.data);
      alert("Error Adding Photo, please try again.");
    }

    // Call addFlower to update your context/store if needed
    addPhoto(formData.name, formData.photoImg);
  };

  return (
    <div className="create__flower">
      <form className="form create_flower__form" onSubmit={handleSubmit}>
        <h1 className="text-center bg-transparent">Add Photo</h1>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Your Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            defaultValue={currentUser?.data?.user?.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="photoImg" className="form-label">
            Choose photo to upload
          </label>
          <input
            type="file"
            className="form-control"
            id="photoImg"
            name="photoImg"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-secondary">
          Add Photo
        </button>
      </form>
    </div>
  );
};

export default Photos;
