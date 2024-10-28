import { Router } from "express";
import {
  createFlower,
  getAllFlower,
  getAllFlowerById,
  deleteFlower,
} from "../controllers/flower.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.use(verifyJWT);

// router.post("/", createPost);
router
  .route("/")
  .get(getAllFlower)
  .post(
    upload.fields([
      {
        name: "flowerImg",
        maxCount: 1,
      },
    ]),

    createFlower
  );
router.get("/:flowerId", getAllFlowerById);
// router.route("/:postId").delete(deletePost).patch(updatePost);

router.get("/flower/:flowerId", getAllFlowerById);
// router.patch("/:postId", updatePost);
router.delete("/:flowerId", deleteFlower);

export default router;
