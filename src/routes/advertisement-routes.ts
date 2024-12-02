import SecureService from "../services/secure-service.js";
import AuthenticateUtil from "../utils/authenticate-util.js";
import { clientRedis } from "../config/redis-config.js";
import { Router } from "express";
import { AdvertisementController } from "../controllers/advertisement-controller.js";
import { upload } from "../config/multer-config.js";
import { Category } from "../models/category-model.js";
import { Advertisement } from "../models/advertisement-model.js";
import { User } from "../models/user-model.js";
import { Image } from "../models/image-model.js";


export const advertisementRoutes = Router();


// Views
advertisementRoutes.get("/advertisement/:id", SecureService.authenticateAccessTokenOptional, async (req: any, res: any) => {
    const { id } = req.params;

    const advertisement = await Advertisement.findByPk(id, {
        include: [
            { model: User },
            { model: Image },
            { model: Category },
        ],
    });
    if (!advertisement) {
        return res.status(404).send("Advertisement not found");
    }

    const sortedImages = advertisement.images
        .map((image) => image.toJSON())
        .sort((picture1, picture2) => (picture2.primary ? 1 : 0) - (picture1.primary ? 1 : 0));

    const isAuthenticated = req.user ? true : false;

    res.render("advertisement", { layout: "main", title: `${advertisement.title} ${advertisement.price} грн.`, showNavbar: true, advertisement: { ...advertisement.toJSON(), images: sortedImages }, isAuthenticated });
});

advertisementRoutes.get("/post-advertisement", AuthenticateUtil.accessTokenRedirect, async (req: any, res) => {
    const categoriesRedis = await clientRedis.get("categories");

    let categoriesJson;
    if (categoriesRedis) {
        categoriesJson = JSON.parse(categoriesRedis);
    }
    else {
        const categories = await Category.findAll();
        categoriesJson = categories.map(category => category.toJSON());
        await clientRedis.set("categories", JSON.stringify(categories), { EX: 60 });
    }

    const userJson = req.user.toJSON();

    res.render("post-advertisement", { layout: "main", title: "Оголошення OLX.UA", showNavbar: true, user: userJson, categories: categoriesJson });
});

advertisementRoutes.get("/edit-advertisement/:id", AuthenticateUtil.accessTokenRedirect, async (req: any, res: any) => {
    const { id } = req.params;

    const advertisement = await Advertisement.findByPk(id, {
        include: [
            { model: User },
            { model: Image },
            { model: Category },
        ],
    });
    if (!advertisement) {
        return res.status(404).send("Advertisement not found");
    }

    const categoriesRedis = await clientRedis.get("categories");

    let categoriesJson;
    if (categoriesRedis) {
        categoriesJson = JSON.parse(categoriesRedis);
    }
    else {
        const categories = await Category.findAll();
        categoriesJson = categories.map(category => category.toJSON());
        await clientRedis.set("categories", JSON.stringify(categories), { EX: 60 });
    }

    const userJson = req.user.toJSON();

    res.render("edit-advertisement", { layout: "main", title: "Оголошення OLX.UA", showNavbar: true, user: userJson, advertisement: advertisement.toJSON(), categories: categoriesJson });
});


// REST API
advertisementRoutes.get("/advertisements", AdvertisementController.getAll);
advertisementRoutes.get("/advertisements/:id", AdvertisementController.getById);
advertisementRoutes.post("/advertisements", SecureService.authenticateAccessToken, upload.array("images", 8), AdvertisementController.create);
advertisementRoutes.put("/advertisements/:id", SecureService.authenticateAccessToken, upload.array("images", 8), AdvertisementController.update);
advertisementRoutes.delete("/advertisements/:id", SecureService.authenticateAccessToken, AdvertisementController.delete);

advertisementRoutes.put("/admin/advertisements/:id/status", SecureService.authenticateAccessToken, SecureService.authenticateAdmin, AdvertisementController.adminUpdateStatus);