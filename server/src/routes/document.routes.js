import { Router } from "express";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentsByPostId,
  getAllDocumentsByUserId,
} from "../controllers/document.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.use(verifyJWT);

// router.post("/", createPost);
router.route("/").get(getAllDocuments).post(
  // upload.fields([
  //   {
  //     name: "documentFile",
  //     maxCount: 1,
  //   },
  // ]),

  upload.single("documentFile"),
  createDocument
);
router.get("/:documentId", getAllDocumentsByUserId);

router.delete("/:documentId", deleteDocument);
router.get("/post/:postId", getDocumentsByPostId);

export default router;
