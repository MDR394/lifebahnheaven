import React, { useContext, useEffect, useState } from "react";
import Post from "./Post";
import { PostList as PostListData } from "../store/post-list-store";
import WelcomeMessage from "./WelcomeMessage";
import LoadingSpinner from "./LoadingSpinner";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";

function PostList() {
  const { postList, addInitialPosts } = useContext(PostListData);
  const [fetching, setFetching] = useState(false);
  const { currentUser, setCurrentUser } = useContext(AuthContext);

  console.log(currentUser.data.roles);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const response = await axios.get("http://localhost:3000/api/v1/posts", {
          headers: {
            Authorization: `Bearer ${currentUser?.data.accessToken}`, // Use access token
          },
        });

        const jsonData = response.data;

        addInitialPosts(jsonData.data);

        setFetching(false);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [currentUser]);

  //  Sponser Functionality

  const becomeSponsor = async () => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/v1/users/become-sponsor",
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser?.data.accessToken}`, // Use access token
          },
        }
      );

      // Update the user role in the AuthContext
      setCurrentUser((prevUser) => ({
        ...prevUser,
        data: {
          ...prevUser.data,
          roles: "sponsor",
        },
      }));

      alert("You are now a sponsor!");
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update your role. Please try again.");
    }
  };

  return (
    <>
      <div className="sponser_btn">
        {/* <button onClick={becomeSponsor}>Become sponser to Add the Rip's</button> */}
        {currentUser.data.roles === "sponsor" ? (
          <Link to="/create-post">
            <button>Add Rips</button>
          </Link>
        ) : (
          <button onClick={becomeSponsor}>
            Become sponser to Add the Rip's
          </button>
        )}
      </div>
      <div className="post__List ">
        {fetching && <LoadingSpinner />}
        {!fetching && postList.length === 0 && <WelcomeMessage />}
        {!fetching &&
          postList.map((post) => <Post key={post._id} post={post} />)}
      </div>
    </>
  );
}

export default PostList;
