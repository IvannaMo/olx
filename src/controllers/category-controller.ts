import { Request, Response } from "express";
import { Category } from "../models/category-model.js";


export class CategoryController {
    static async getAll(req: Request, res: Response): Promise<any> {
        try {
            const categories = await Category.findAll();
            res.status(200).json({ categories });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async getById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json({ category });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async create(req: Request, res: Response): Promise<any> {
        try {
            const { name, imageUrl, imageColor } = req.body;

            const newCategory = await Category.create({
                name: name,
                imageUrl: imageUrl,
                imageColor: imageColor,
            });

            res.status(201).json({ message: "Category created successfully", category: newCategory });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async update(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { name, imageUrl, imageColor } = req.body;

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            await category.update({ name, imageUrl, imageColor });
            res.status(200).json({ message: "Category updated successfully", category });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            await category.destroy();
            res.status(200).json({ message: "Category deleted successfully" });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }
}