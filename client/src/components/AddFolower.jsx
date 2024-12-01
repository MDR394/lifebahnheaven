import React, { useContext, useState } from "react";
import { FlowerStore } from "../store/post-list-store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useParams } from "react-router-dom";

const AddFlower = ({ onFlowerAdded }) => {
  const { _id } = useParams(); // Retrieve RIP ID from route parameters
  const { currentUser } = useContext(AuthContext);
  const { addFlower } = useContext(FlowerStore); // Adjust according to your context structure
  const [formData, setFormData] = useState({
    flowerImg: null,
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
      flowerImg: files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    // data.append("name", formData.name);
    data.append("flowerImg", formData.flowerImg);
    data.append("postId", _id); // Pass the RIP ID (from useParams)

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/flowers",
        data,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.data.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Notify parent component about the newly added flower
      if (onFlowerAdded) {
        onFlowerAdded(response.data.data); // Pass the new flower data to parent
      }
      alert("Flower Added Successfully");

      // Navigate to another route if necessary
      // navigate("/flowers"); // Example route
    } catch (error) {
      console.error("Error during flower creation:", error.response?.data);
      alert("Error creating flower, please try again.");
    }

    // Call addFlower to update your context/store if needed
    addFlower(formData.name, formData.flowerImg);
  };

  return (
    <div className="create__flower">
      <form className="form create_flower__form" onSubmit={handleSubmit}>
        <h1 className="text-center bg-transparent">Add Flower</h1>

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
          <label htmlFor="flowerImg" className="form-label">
            Choose Flower Image
          </label>
          <input
            type="file"
            className="form-control"
            id="flowerImg"
            name="flowerImg"
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-secondary">
          Add Flower
        </button>
      </form>
    </div>
  );
};

export default AddFlower;
