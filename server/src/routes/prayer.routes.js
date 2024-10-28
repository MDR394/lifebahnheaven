import { Router } from "express";
import {
  createPrayer,
  deletePrayer,
  getAllPrayerById,
  getAllPrayer,
} from "../controllers/prayer.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
// import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.use(verifyJWT);

// router.post("/", createPost);
router.route("/").get(getAllPrayer).post(createPrayer);
router.get("/:prayerId", getAllPrayer);
// router.route("/:postId").delete(deletePost).patch(updatePost);

router.get("/prayer/:prayerId", getAllPrayerById);
// router.patch("/:postId", updatePost);
router.delete("/:prayerId", deletePrayer);

export default router;
