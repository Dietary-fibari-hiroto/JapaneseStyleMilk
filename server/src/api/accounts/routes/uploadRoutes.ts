import express from "express";
import { uploadImageController } from "../controllers/uploadController";
import upload from "../../../middlewares/upload.middleware";

const uploadRouter = express.Router();

uploadRouter.post("/images", upload.single("image"), uploadImageController);

export default uploadRouter;
