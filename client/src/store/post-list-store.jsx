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

// Photo Store Context creation with default values
export const PhotoStore = createContext({
  photoList: [],
  addPhoto: () => {},
  addInitialPhotos: () => {},
  deletePhoto: () => {},
});

// Document Store Context creation with default values
export const DocumentStore = createContext({
  documentList: [],
  addDocument: () => {},
  addInitialDocuements: () => {},
  deleteDocument: () => {},
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

// Prayer Store Reducer
const PhotoStoreReducer = (currPhotoList, action) => {
  let newPhotoList = currPhotoList;
  if (action.type === "DELETE_PHOTO") {
    newPhotoList = currPhotoList.filter(
      (photo) => photo.id !== action.payload.photoId
    );
  } else if (action.type === "ADD_INITIAL_PHOTOS") {
    newPhotoList = action.payload.photos;
  } else if (action.type === "ADD_PHOTO") {
    newPhotoList = [action.payload, ...currPhotoList];
  }

  return newPhotoList;
};

// Document Store Reducer
const DocumentStoreReducer = (currDocumentList, action) => {
  let newDocumentList = currDocumentList;
  if (action.type === "DELETE_DOCUMENT") {
    newDocumentList = currDocumentList.filter(
      (document) => document.id !== action.payload.documentId
    );
  } else if (action.type === "ADD_INITIAL_DOCUMENTS") {
    newDocumentList = action.payload.documents;
  } else if (action.type === "ADD_DOCUMENT") {
    newDocumentList = [action.payload, ...currDocumentList];
  }

  return newDocumentList;
};
const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(postListReducer, []);
  const [flowerList, dispatchFlowerList] = useReducer(flowerStoreReducer, []);
  const [prayerList, dispatchPrayerList] = useReducer(prayerStoreReducer, []);
  const [photoList, dispatchPhotoList] = useReducer(PhotoStoreReducer, []);
  const [documentList, dispatchDocumentList] = useReducer(
    DocumentStoreReducer,
    []
  );

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

  // Photo Store Functions
  const addPhoto = (name, photoImg) => {
    dispatchPhotoList({
      type: "ADD_Photo",
      payload: {
        id: Date.now(),
        name: name,
        image: photoImg, //// needs to add some more fields
      },
    });
  };

  const addInitialPhotos = (photos) => {
    dispatchPhotoList({
      type: "ADD_INITIAL_PHOTOS",
      payload: {
        photos,
      },
    });
  };

  const deletePhoto = (photoId) => {
    dispatchPhotoList({
      type: "DELETE_PHOTO",
      payload: {
        photoId,
      },
    });
  };

  // Document store functions

  const addDocument = (name, documentFile, postId) => {
    dispatchDocumentList({
      type: "ADD_DOCUMENT",
      payload: {
        id: Date.now(), // Unique identifier for the document
        name: name, // Document name
        documentFile: documentFile, // Actual file or its reference
        postId: postId, // Associated post ID
      },
    });
  };

  const addInitialDocuments = (documents) => {
    dispatchDocumentList({
      type: "ADD_INITIAL_DOCUMENTS",
      payload: {
        documents, // Array of initial documents
      },
    });
  };

  const deleteDocument = (documentId) => {
    dispatchDocumentList({
      type: "DELETE_DOCUMENT",
      payload: {
        documentId, // ID of the document to delete
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
          <PhotoStore.Provider
            value={{ photoList, addPhoto, deletePhoto, addInitialPhotos }}
          >
            <DocumentStore.Provider
              value={{
                documentList,
                addDocument,
                deleteDocument,
                addInitialDocuments,
              }}
            >
              {children}
            </DocumentStore.Provider>
          </PhotoStore.Provider>
        </PrayerStore.Provider>
      </FlowerStore.Provider>
    </PostList.Provider>
  );
};

export default PostListProvider;
