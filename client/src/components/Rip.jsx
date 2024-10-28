import "./style.css";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import AddFlower from "./AddFolower";
import AddPrayer from "./AddPrayer";
import axios from "axios";
import Modal from "./Modal";
import { Link, useParams } from "react-router-dom";

function Rip() {
  const { currentUser } = useContext(AuthContext);

  const [fetching, setFetching] = useState(false);
  const [post, setPost] = useState(null);
  const { _id } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(""); // Track whether to show prayer or flower modal
  const [flowersData, setFlowersData] = useState([]);

  // console.log(currentUser.data.user);
  // console.log(_id);
  // console.log(flowersData);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/posts/post/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.data.accessToken}`, // Use access token
            },
          }
        );

        const jsonData = response.data.data;
        // console.log(jsonData);
        setPost(jsonData); // Store the fetched data in the state
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setFetching(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/users/normal",
          {
            headers: {
              Authorization: `Bearer ${currentUser?.data.accessToken}`,
            },
          }
        );
        // console.log("Fetched Users:", response.data.data); // Log the response
        setUsers(response.data.data); // Check if this is setting the correct users
      } catch (error) {
        console.error("User fetch error:", error);
      }
    };

    const fetchFlowers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/flowers",
          {
            headers: {
              Authorization: `Bearer ${currentUser?.data.accessToken}`,
            },
          }
        );
        // console.log("Fetched flowers:", response.data.data); // Log the response
        setFlowersData(response.data.data);
      } catch (error) {
        console.error("Flowers fetch error:", error);
      }
    };

    if (currentUser && _id) {
      fetchData();
      fetchUsers();
      fetchFlowers();
    }
  }, [currentUser, _id]);

  const handleAddContributor = async () => {
    if (!selectedUser) return; // Prevent if no user is selected

    try {
      await axios.patch(
        `http://localhost:3000/api/v1/users/${selectedUser}/roles`,
        { roles: "contributor" }, // Changing role to contributor
        {
          headers: {
            Authorization: `Bearer ${currentUser?.data.accessToken}`,
          },
        }
      );
      alert("User role updated successfully!");
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update user role.");
    }
  };

  // Helper function to format the date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="container mt-5">
        <div className="card bg-dark text-light p-4">
          <div className="row">
            <div className="col-md-3">
              <img
                src={post?.postImg}
                alt="George Washington"
                className="img-fluid"
              />
            </div>
            <div className="col-md-9">
              {/* Display the title dynamically */}
              <div className="add_contributer_btn_N_heading">
                <h1 className="card-title">{post?.title || "Loading..."}</h1>
                <button onClick={() => setShowDropdown(!showDropdown)}>
                  Add Contributer to this rip
                </button>
                {showDropdown && (
                  <div>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                    >
                      <option value="">Select a User</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.fullName}
                        </option>
                      ))}
                    </select>
                    <button onClick={handleAddContributor}>Confirm</button>
                  </div>
                )}
              </div>
              <div className="card-body">
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {post?.dateOfBirth
                    ? formatDate(post.dateOfBirth)
                    : "Loading..."}
                </p>
                <p>
                  <strong>Birth Place:</strong> {post?.birthPlace}
                </p>
                <p>
                  <strong>Death:</strong>{" "}
                  {post?.deathDate ? formatDate(post.deathDate) : "Loading..."}
                </p>
                <p>
                  <strong>Description:</strong> {post?.description}
                </p>
                <p>
                  <strong>Burial:</strong>{" "}
                  <a href="#" className="text-decoration-none">
                    {post?.burial}
                  </a>
                </p>
                <p>
                  <strong>Plot:</strong> {post?.plot}
                </p>
                <p>
                  <strong>Memorial ID:</strong> 1075 •{" "}
                  <a href="#" className="text-decoration-none">
                    View Source
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <div className="row photos_memorials_document">
          <div className="col-md-4 text-end">Photos</div>
          <div className="col-md-4 text-center">Memoreblia</div>
          <div className="col-md-4 text-start">Document</div>
        </div>
      </div>

      <div className="flower_sec_btn">
        <button
          className="leave_flower"
          onClick={() => {
            setIsModalOpen(true);
            setModalContent("flower");
          }}
        >
          Leave A Flower
        </button>
        <button
          className="say_a_prayer"
          onClick={() => {
            setIsModalOpen(true);
            setModalContent("prayer");
          }}
        >
          Say A Prayer
        </button>
      </div>

      {/* Modal for AddFlower or AddPrayer */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent === "flower" && <AddFlower />}
        {modalContent === "prayer" && <AddPrayer />}
      </Modal>

      <div className="test">
        <div className="flowers_section">
          {flowersData.map((flower) => (
            <div key={flower?.id} className="flower_card">
              <img src={flower?.flowerImg} alt="Flower" />
              <div className="flower_card_text">
                <h5>Left By: {flower?.name}</h5>
                <h5>On: {formatDate(flower.leftOn)}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Rip;
