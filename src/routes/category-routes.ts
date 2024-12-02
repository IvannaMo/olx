import { Router } from "express";
import { CategoryController } from "../controllers/category-controller.js";
import { Category } from "../models/category-model.js";
import { clientRedis } from "../config/redis-config.js";
import { Advertisement } from "../models/advertisement-model.js";
import { Image } from "../models/image-model.js";
import { Op } from "sequelize";
import SecureService from "../services/secure-service.js";


export const categoryRoutes = Router();


// Views
categoryRoutes.get("/category/:id", SecureService.authenticateAccessTokenOptional, async (req: any, res: any) => {
    const { id } = req.params;
    const searchQuery = Array.isArray(req.query.search) ? req.query.search[0] || "" : req.query.search || "";
    const sortBy = req.query.sort || "newest";

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

    const category = await Category.findByPk(id);
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }

    let order: [string, string] = ["publishDate", "DESC"];
    if (sortBy === "cheap") {
        order = ["price", "ASC"];
    } 
    else if (sortBy === "expensive") {
        order = ["price", "DESC"];
    }

    const advertisements = await Advertisement.findAll({
        where: {
            categoryId: id,
            title: {
                [Op.like]: `%${searchQuery}%`,
            },
        },
        include: [{ model: Image, attributes: ["imageUrl", "primary"] }],
        order: [order],
    });
    const advertisementsJson = advertisements.map(advertisement => advertisement.toJSON());

    res.render("category", { layout: "main", title: `${category.name}: оголошення OLX.UA`, showNavbar: true, category: category.toJSON(), categories: categoriesJson, advertisements: advertisementsJson, searchQuery, sortBy });
});


// REST API
categoryRoutes.get("/categories", CategoryController.getAll);
categoryRoutes.get("/categories/:id", CategoryController.getById);
categoryRoutes.post("/categories", CategoryController.create);
categoryRoutes.put("/categories/:id", CategoryController.update);
categoryRoutes.delete("/categories/:id", CategoryController.delete);