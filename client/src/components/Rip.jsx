import "./style.css";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import AddFlower from "./AddFolower";
import AddPrayer from "./AddPrayer";
import axios from "axios";
import Modal from "./Modal";
import { Link, useParams } from "react-router-dom";
import Photos from "../contributer/Photos";
import Memorablia from "../contributer/Memorablia";
import Document from "../contributer/Document";

function Rip() {
  const { currentUser } = useContext(AuthContext);
  // console.log(currentUser);

  const [fetching, setFetching] = useState(false);
  const [post, setPost] = useState(null);
  const { _id } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(""); // Track whether to show prayer or flower modal
  const [flowersData, setFlowersData] = useState([]);
  const [prayersData, setPrayersData] = useState([]);
  const [photosData, setPhotosData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);

  // console.log(currentUser);
  // console.log(_id);
  // console.log(flowersData);

  // console.log(selectedUser);
  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await axios.get(
          `https://lifebahnheaven-server.vercel.app/api/v1/posts/post/${_id}`,
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
          "https://lifebahnheaven-server.vercel.app/api/v1/users/normal",
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
          `https://lifebahnheaven-server.vercel.app/api/v1/flowers/post/${_id}`,
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

    const fetchPrayers = async () => {
      try {
        const response = await axios.get(
          `https://lifebahnheaven-server.vercel.app/api/v1/prayers/post/${_id}`, // Fetch prayers for this RIP
          {
            headers: {
              Authorization: `Bearer ${currentUser?.data.accessToken}`,
            },
          }
        );
        setPrayersData(response.data.data); // Store fetched prayers
        // console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching prayers:", error.response?.data);
      }
    };

    const fetchPhotos = async () => {
      try {
        const response = await axios.get(
          `https://lifebahnheaven-server.vercel.app/api/v1/photos/post/${_id}`, // Fetch prayers for this RIP
          {
            headers: {
              Authorization: `Bearer ${currentUser?.data.accessToken}`,
            },
          }
        );
        setPhotosData(response.data.data); // Store fetched prayers
        // console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching prayers:", error.response?.data);
      }
    };

    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `https://lifebahnheaven-server.vercel.app/api/v1/documents/post/${_id}`, // Fetch prayers for this RIP
          {
            headers: {
              Authorization: `Bearer ${currentUser?.data.accessToken}`,
            },
          }
        );
        setDocumentsData(response.data.data); // Store fetched prayers
        console.log(response.data.data);
      } catch (error) {
        console.error("Error fetching prayers:", error.response?.data);
      }
    };

    if (currentUser && _id) {
      fetchData();
      fetchUsers();
      fetchFlowers();
      fetchPrayers();
      fetchPhotos();
      fetchDocuments();
    }
  }, [currentUser, _id]);

  const handleAddContributor = async () => {
    if (!selectedUser) return; // Prevent if no user is selected

    try {
      await axios.patch(
        `https://lifebahnheaven-server.vercel.app/api/v1/users/${selectedUser}/roles`,
        { postId: _id, userId: selectedUser },
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
                {currentUser.data.user.roles === "sponsor" && (
                  <button onClick={() => setShowDropdown(!showDropdown)}>
                    Add Contributer to this rip
                  </button>
                )}

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

      {currentUser.data.user.roles === "sponsor" ||
      currentUser.data.user.roles === "contributor" ? (
        <div style={{ marginTop: "20px" }}>
          <div className="row photos_memorials_document">
            <div
              className="col-md-4 text-end"
              onClick={() => {
                setIsModalOpen(true);
                setModalContent("photo");
              }}
            >
              Photos
            </div>
            <div
              className="col-md-4 text-center"
              onClick={() => {
                setIsModalOpen(true);
                setModalContent("memorablia");
              }}
            >
              Memoreblia
            </div>
            <div
              className="col-md-4 text-start"
              onClick={() => {
                setIsModalOpen(true);
                setModalContent("document");
              }}
            >
              Document
            </div>
          </div>

          <div className="photos_memorablia_document">
            <div className="photos_section">
              {photosData.length > 0 ? (
                photosData.map((photo) => (
                  <div key={photo?._id} className="flower_card">
                    <img src={photo?.photoImg} alt="Flower" />
                    <div className="flower_card_text">
                      <h5>
                        Left By: <span>{photo?.name}</span>
                      </h5>
                      <h5>
                        On: <span>{formatDate(photo?.createdAt)}</span>
                      </h5>
                    </div>
                  </div>
                ))
              ) : (
                <h3>
                  No photo added yet. Be the <br />
                  first to leave one.
                </h3>
              )}
            </div>

            <div className="documents_section">
              {documentsData.length > 0 ? (
                documentsData.map((document) => (
                  <div key={document?._id} className="flower_card">
                    {/* <img src={document?.documentFile} alt="Document" /> */}

                    <iframe
                      src={document?.documentFile}
                      width="600"
                      height="400"
                      style={{ border: "1px solid #ccc" }}
                    />
                    <div className="flower_card_text">
                      <h5>
                        Left By: <span>{document?.name}</span>
                      </h5>
                      <h5>
                        On: <span>{formatDate(document?.createdAt)}</span>
                      </h5>
                    </div>
                  </div>
                ))
              ) : (
                <h3>
                  No photo added yet. Be the <br />
                  first to leave one.
                </h3>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p style={{ "text-align": "center", margin: "10px" }}>
          You do not have permission to view this content.
        </p>
      )}

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
        {/* {modalContent === "flower" && <AddFlower />} */}
        {modalContent === "flower" && (
          <AddFlower
            onFlowerAdded={(newFlower) => {
              setFlowersData((prevFlowers) => [newFlower, ...prevFlowers]); // Add the new flower to the beginning of the array
            }}
          />
        )}
        {modalContent === "prayer" && (
          <AddPrayer
            onPrayerAdded={(newPrayer) => {
              setPrayersData((prevPrayers) => [newPrayer, ...prevPrayers]);
            }}
          />
        )}
        {modalContent === "photo" && <Photos />}
        {modalContent === "memorablia" && <Memorablia />}
        {modalContent === "document" && <Document />}
      </Modal>

      <div className="flower__and__prayer">
        <h2>Flowers</h2>
        <div className="flowers_section">
          {flowersData.length > 0 ? (
            flowersData.map((flower) => (
              <div key={flower?._id} className="flower_card">
                <img src={flower?.flowerImg} alt="Flower" />
                <div className="flower_card_text">
                  <h5>
                    Left By: <span>{currentUser?.data?.user?.fullName}</span>
                  </h5>
                  <h5>
                    On: <span>{formatDate(flower?.createdAt)}</span>
                  </h5>
                </div>
              </div>
            ))
          ) : (
            <h3>
              No flowers added yet. Be the <br />
              first to leave one.
            </h3>
          )}
        </div>

        <div className="prayer-list">
          <h2>Prayers</h2>
          {prayersData.length > 0 ? (
            prayersData.map((prayer) => (
              <p key={prayer._id}>
                <span>Left By: {currentUser?.data?.user?.fullName}</span>
                <br />
                {prayer.prayerText}
              </p>
            ))
          ) : (
            <p>No prayers yet. Be the first to add one.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Rip;
