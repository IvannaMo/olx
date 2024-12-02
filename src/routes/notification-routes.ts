import { Router } from "express";
import { NotificationController } from "../controllers/notification-controller.js";
import SecureService from "../services/secure-service.js";


export const notificationRoutes = Router();


// Views


// REST API
notificationRoutes.get("/notifications", NotificationController.getAll);
notificationRoutes.get("/notifications/:id", SecureService.authenticateAccessToken, NotificationController.getById);
notificationRoutes.post("/notifications", SecureService.authenticateAccessToken, NotificationController.create);
notificationRoutes.put("/notifications/:id", SecureService.authenticateAccessToken, NotificationController.update);
notificationRoutes.delete("/notifications/:id", SecureService.authenticateAccessToken, NotificationController.delete);





