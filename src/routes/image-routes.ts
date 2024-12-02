import { Router } from "express";
import { ImageController } from "../controllers/image-controller.js";


export const imageRoutes = Router();


// Views


// REST API
imageRoutes.get("/images", ImageController.getAll);
imageRoutes.get("/images/:id", ImageController.getById);
imageRoutes.post("/images", ImageController.create);
imageRoutes.put("/images/:id", ImageController.update);
imageRoutes.delete("/images/:id", ImageController.delete);