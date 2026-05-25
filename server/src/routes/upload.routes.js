import { Router } from "express";
import { uploadProductImage } from "../controllers/upload.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/image", protect, authorize("admin", "store_owner"), upload.single("image"), uploadProductImage);

export default router;
