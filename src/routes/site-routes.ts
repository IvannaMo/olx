import { Router } from "express";
import { Category } from "../models/category-model.js";
import { Advertisement } from "../models/advertisement-model.js";
import { Image } from "../models/image-model.js";
import { clientRedis } from "../config/redis-config.js";


export const siteRoutes = Router();


siteRoutes.get("/", async (req, res) => {
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

    const vipAdvertisements = await Advertisement.findAll({
        where: { isVip: true },
        include: [{ model: Image, attributes: ["imageUrl", "primary"] }],
    });
    const vipAdvertisementsJson = vipAdvertisements.map(vipAdvertisement => vipAdvertisement.toJSON());
   
    res.render("home", { layout: "main", title: "Оголошення OLX.UA", showNavbar: true, categories: categoriesJson, vipAdvertisements: vipAdvertisementsJson });    
});