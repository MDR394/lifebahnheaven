import React, { useContext, useState } from "react";
import { DocumentStore } from "../store/post-list-store";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const Document = () => {
  const { _id } = useParams(); // Retrieve the post ID from route parameters
  const { currentUser } = useContext(AuthContext);
  // const [documentFile, setDocumentFile] = useState(null);
  const { addDocument } = useContext(DocumentStore);

  const [formData, setFormData] = useState({
    name: currentUser?.data?.user?.fullName || "",
    documentFile: null,
  });
  const navigate = useNavigate();

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
      documentFile: files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.documentFile) {
      alert("Please select a document to upload.");
      return;
    }

    const data = new FormData();
    data.append("documentFile", formData.documentFile);
    data.append("postId", _id); // Attach the post ID
    data.append("name", formData.name);

    try {
      const response = await axios.post(
        "https://lifebahnheaven-server.vercel.app/api/v1/documents", // Adjust endpoint if necessary
        data,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.data.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Document uploaded successfully");
      navigate("/"); // Redirect if needed
      // console.log(response);
    } catch (error) {
      console.error("Error uploading document:", error.response?.data);
      alert("Error uploading document, please try again.");
    }

    // Call addFlower to update your context/store if needed
    addDocument(formData.name, formData.documentFile, _id);
  };

  return (
    <div className="create__document">
      <form className="form create_document__form" onSubmit={handleSubmit}>
        <h1 className="text-center bg-transparent">Add Document</h1>

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
          <label htmlFor="documentFile" className="form-label">
            Select Document
          </label>
          <input
            type="file"
            className="form-control"
            id="documentFile"
            name="documentFile"
            accept=".pdf,.doc,.docx" // Limit to specific document formats
            onChange={handleFileChange}
          />
        </div>

        <button type="submit" className="btn btn-secondary">
          Upload Document
        </button>
      </form>
    </div>
  );
};

export default Document;
