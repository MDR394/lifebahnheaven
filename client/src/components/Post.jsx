import React, { useContext } from "react";
import { FcLike } from "react-icons/fc";
import { PostList as PostListData } from "../store/post-list-store";
import { useNavigate } from "react-router-dom";

const Post = ({ post }) => {
  // Log post object to debug
  // console.log(post);
  const navigate = useNavigate(); // Hook for navigation
  // Ensure post.tags is an array before mapping
  const tags = Array.isArray(post.tags) ? post.tags : [];

  const handleClick = () => {
    navigate(`/post/${post._id}`); // Navigate to the detailed post page
    // console.log("clicked");
  };

  return (
    <div
      onClick={handleClick}
      className="card post-card"
      style={{ width: "20rem", margin: "2rem 0rem", cursor: "pointer" }}
    >
      <img src={post.postImg} className="card-img-top" alt="..." />
      <div className="card-body ">
        <h5 className="card-title text-white">{post.title}</h5>
        <p className="card-text text-white">{post.description}</p>
        {tags.map((tag) => (
          <span key={tag} className="badge text-bg-primary hashtag">
            {tag}
          </span>
        ))}
        <div className="alert alert-info" role="alert">
          <FcLike className="likeIcon" />
          {`this Rip has been flowered by ${post.reactions} people!`}
        </div>
      </div>
    </div>
  );
};

export default Post;
