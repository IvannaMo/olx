import { Request, Response } from "express";
import { Image } from "../models/image-model.js";


export class ImageController {
    static async getAll(req: Request, res: Response): Promise<any> {
        try {
            const images = await Image.findAll();
            res.status(200).json({ images });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async getById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const image = await Image.findByPk(id);
            if (!image) {
                return res.status(404).json({ message: "Image not found" });
            }

            res.status(200).json({ image });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async create(req: Request, res: Response): Promise<any> {
        try {
            const { advertisementId, imageUrl, primary } = req.body;

            const newImage = await Image.create({
                advertisementId: advertisementId,
                imageUrl: imageUrl,
                primary: primary,
            });

            res.status(201).json({ message: "Image created successfully", image: newImage });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async update(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { advertisementId, imageUrl, primary } = req.body;

            const image = await Image.findByPk(id);
            if (!image) {
                return res.status(404).json({ message: "Image not found" });
            }

            await image.update({ advertisementId, imageUrl, primary });
            res.status(200).json({ message: "Image updated successfully", image });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const image = await Image.findByPk(id);
            if (!image) {
                return res.status(404).json({ message: "Image not found" });
            }

            await image.destroy();
            res.status(200).json({ message: "Image deleted successfully" });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }
}