import { createContext, useReducer } from "react";

// Post List Context creation with default values
export const PostList = createContext({
  postList: [],
  addPost: () => {},
  addInitialPosts: () => {},
  deletePost: () => {},
});

// Flower Store Context creation with default values
export const FlowerStore = createContext({
  flowerList: [],
  addFlower: () => {},
  addInitialFlowers: () => {},
  deleteFlower: () => {},
});

// Prayer Store Context creation with default values
export const PrayerStore = createContext({
  prayerList: [],
  addPrayer: () => {},
  addInitialPrayers: () => {},
  deletePrayers: () => {},
});

// Post List Reducer
const postListReducer = (currPostList, action) => {
  let newPostList = currPostList;
  if (action.type === "DELETE_POST") {
    newPostList = currPostList.filter(
      (post) => post.id !== action.payload.postId
    );
  } else if (action.type === "ADD_INITIAL_POSTS") {
    newPostList = action.payload.posts;
  } else if (action.type === "ADD_POST") {
    newPostList = [action.payload, ...currPostList];
  }

  return newPostList;
};

// Flower Store Reducer
const flowerStoreReducer = (currFlowerList, action) => {
  let newFlowerList = currFlowerList;
  if (action.type === "DELETE_FLOWER") {
    newFlowerList = currFlowerList.filter(
      (flower) => flower.id !== action.payload.flowerId
    );
  } else if (action.type === "ADD_INITIAL_FLOWERS") {
    newFlowerList = action.payload.flowers;
  } else if (action.type === "ADD_FLOWER") {
    newFlowerList = [action.payload, ...currFlowerList];
  }

  return newFlowerList;
};

// Prayer Store Reducer
const prayerStoreReducer = (currPrayerList, action) => {
  let newPrayerList = currPrayerList;
  if (action.type === "DELETE_PRAYER") {
    newPrayerList = currPrayerList.filter(
      (flower) => flower.id !== action.payload.flowerId
    );
  } else if (action.type === "ADD_INITIAL_PRAYERS") {
    newPrayerList = action.payload.prayers;
  } else if (action.type === "ADD_PRAYER") {
    newPrayerList = [action.payload, ...currPrayerList];
  }

  return newPrayerList;
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);
  const [flowerList, dispatchFlowerList] = useReducer(flowerStoreReducer, []);
  const [prayerList, dispatchPrayerList] = useReducer(prayerStoreReducer, []);

  // Post List Functions
  const addPost = (userId, postTitle, reactions, postBody, tags) => {
    dispatchPostList({
      type: "ADD_POST",
      payload: {
        id: Date.now(),
        title: postTitle,
        body: postBody,
        reactions: reactions,
        userID: userId,
        tags: tags,
      },
    });
  };

  const addInitialPosts = (posts) => {
    dispatchPostList({
      type: "ADD_INITIAL_POSTS",
      payload: {
        posts,
      },
    });
  };

  const deletePost = (postId) => {
    dispatchPostList({
      type: "DELETE_POST",
      payload: {
        postId,
      },
    });
  };

  // Flower Store Functions
  const addFlower = (flowerName, flowerPrice, flowerImage) => {
    dispatchFlowerList({
      type: "ADD_FLOWER",
      payload: {
        id: Date.now(),
        name: flowerName,
        price: flowerPrice,
        image: flowerImage,
      },
    });
  };

  const addInitialFlowers = (flowers) => {
    dispatchFlowerList({
      type: "ADD_INITIAL_FLOWERS",
      payload: {
        flowers,
      },
    });
  };

  const deleteFlower = (flowerId) => {
    dispatchFlowerList({
      type: "DELETE_FLOWER",
      payload: {
        flowerId,
      },
    });
  };

  // Prayer Store Functions
  const addPrayer = (prayerText) => {
    dispatchPrayerList({
      type: "ADD_PRAYER",
      payload: {
        id: Date.now(),
        prayerText: prayerText,
      },
    });
  };

  const addInitialPrayers = (prayers) => {
    dispatchFlowerList({
      type: "ADD_INITIAL_PRAYERS",
      payload: {
        prayers,
      },
    });
  };

  const deletePrayer = (prayerId) => {
    dispatchPrayerList({
      type: "DELETE_PRAYER",
      payload: {
        prayerId,
      },
    });
  };

  return (
    <PostList.Provider
      value={{ postList, addPost, deletePost, addInitialPosts }}
    >
      <FlowerStore.Provider
        value={{ flowerList, addFlower, deleteFlower, addInitialFlowers }}
      >
        <PrayerStore.Provider
          value={{ prayerList, addPrayer, deletePrayer, addInitialPrayers }}
        >
          {children}
        </PrayerStore.Provider>
      </FlowerStore.Provider>
    </PostList.Provider>
  );
};

export default PostListProvider;
