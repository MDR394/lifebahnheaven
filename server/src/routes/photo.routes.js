import { Router } from "express";
import {
  createPhoto,
  getAllPhoto,
  getAllPhotoById,
  getPhotosByRipId,
} from "../controllers/photo.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.use(verifyJWT);

// router.post("/", createPost);
router
  .route("/")
  .get(getAllPhoto)
  .post(
    upload.fields([
      {
        name: "photoImg",
        maxCount: 1,
      },
    ]),

    createPhoto
  );
router.get("/:photoId", getAllPhotoById);
// router.route("/:postId").delete(deletePost).patch(updatePost);

// router.get("/photo/:photoId", getAllPhotoById);
// router.patch("/:postId", updatePost);
// router.delete("/:photoId", delete);
router.get("/post/:postId", getPhotosByRipId);

export default router;
