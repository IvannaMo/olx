import SecureService from "../services/secure-service.js";
import AuthenticateUtil from "../utils/authenticate-util.js";
import { Router } from "express";
import { UserController } from "../controllers/user-controller.js";
import { Advertisement } from "../models/advertisement-model.js";
import { Image } from "../models/image-model.js";
import { User } from "../models/user-model.js";
import { Notification } from "../models/notification-model.js";


export const userRoutes = Router();


// Views
userRoutes.get("/login", (req, res) => {
    res.render("login", { layout: "main", title: "OLX.UA - Увійти", showNavbar: false });
});

userRoutes.get("/register", (req, res) => {
    res.render("register", { layout: "main", title: "OLX.UA - Зареєструватися", showNavbar: false });
});

userRoutes.get("/forgot-password", (req, res) => {
    res.render("forgot-password", { layout: "main", title: "OLX.UA - Забули пароль?", showNavbar: false });
});

userRoutes.get("/forgot-password-success", AuthenticateUtil.resetPasswordTokenRedirect, (req, res) => {
    res.render("forgot-password-success", { layout: "main", title: "OLX.UA - Код підтвердження", showNavbar: false });
});

userRoutes.get("/reset-password", (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).redirect("/forgot-password");
    }

    res.render("reset-password", { token });
});

userRoutes.get("/reset-password-success", (req, res) => {
    res.render("reset-password-success", { layout: "main", title: "OLX.UA - Ваш пароль змінено", showNavbar: false });
});

userRoutes.get("/profile-advertisements", AuthenticateUtil.accessTokenRedirect, async (req: any, res) => {
    const userId = req.user.userId;
    
    const advertisements = await Advertisement.findAll({
        where: { userId: userId },
        include: [{ model: Image, attributes: ["imageUrl", "primary"] }],
    });
    const advertisementsJson = advertisements.map(advertisement => advertisement.toJSON());

    res.render("profile-advertisements", { layout: "main", title: "Оголошення OLX.UA", showNavbar: true, advertisements: advertisementsJson });
});

userRoutes.get("/profile-notifications", AuthenticateUtil.accessTokenRedirect, async (req: any, res) => {
    const userId = req.user.userId;

    const notifications = await Notification.findAll({
        where: { receiverId: userId },
        order: [["sendDate", "DESC"]],
        include: [{ model: User, as: "sender", attributes: ["name", "profileImageUrl"] }],
    });
    const notificationsJson = notifications.map((notification) => notification.toJSON());

    res.render("profile-notifications", { layout: "main", title: "Повідомлення OLX.UA", showNavbar: true, notifications: notificationsJson });
});

userRoutes.get("/profile", AuthenticateUtil.accessTokenRedirect, (req, res) => {
    res.render("profile", { layout: "main", title: "Мій профіль OLX.UA", showNavbar: true });
});

userRoutes.get("/profile-settings", AuthenticateUtil.accessTokenRedirect, (req: any, res) => {
    const userJson = req.user.toJSON();
    res.render("profile-settings", { layout: "main", title: "Мій профіль OLX.UA", showNavbar: true, user: userJson });
});


// REST API
userRoutes.post("/users/register", UserController.register);
userRoutes.post("/users/login", UserController.login);
userRoutes.post("/users/logout", SecureService.authenticateAccessToken, UserController.logout);

userRoutes.post("/users/forgot-password", UserController.forgotPassword);
userRoutes.put("/users/reset-password", SecureService.authenticateResetPasswordToken, UserController.resetPassword);

userRoutes.get("/users/profile", SecureService.authenticateAccessToken, UserController.get);
userRoutes.delete("/users/profile", SecureService.authenticateAccessToken, UserController.delete);

userRoutes.post("/admin/users", SecureService.authenticateAccessToken, SecureService.authenticateAdmin, UserController.adminCreate);
userRoutes.put("/admin/users/:id", SecureService.authenticateAccessToken, SecureService.authenticateAdmin, UserController.adminUpdate);