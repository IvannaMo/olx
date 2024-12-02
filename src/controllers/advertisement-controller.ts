import { Request, Response } from "express";
import { Advertisement, AdvertisementStatus } from "../models/advertisement-model.js";
import { Image } from "../models/image-model.js";
import { User } from "../models/user-model.js";
import { Category } from "../models/category-model.js";


export class AdvertisementController {
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const advertisements = await Advertisement.findAll({
                include: [
                    { model: User },
                    { model: Image },
                    { model: Category },
                ],
            });
            res.status(200).json({ advertisements });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async getById(req: Request, res: any): Promise<void> {
        try {
            const { id } = req.params;

            const advertisement = await Advertisement.findByPk(id, {
                include: [
                    { model: User },
                    { model: Image },
                    { model: Category },
                ],
            });
            if (!advertisement) {
                return res.status(404).json({ message: "Advertisement not found" });
            }

            const sortedImages = advertisement.images
                .map((image) => image.toJSON())
                .sort((picture1, picture2) => (picture2.primary ? 1 : 0) - (picture1.primary ? 1 : 0));

            res.status(200).json({ advertisement: { ...advertisement.toJSON(), images: sortedImages } });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async create(req: any, res: Response): Promise<any> {
        try {
            if (
                !req.body.userId ||
                !req.body.categoryId || 
                !req.body.title || 
                !req.body.description || 
                !req.body.price || 
                !req.body.location || 
                !req.files || req.files.length === 0
            ) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const { userId, categoryId, title, description, price, location } = req.body;

            const newAdvertisement = await Advertisement.create({
                userId: userId,
                categoryId: categoryId,
                title: title,
                description: description,
                price: price,
                location: location,
            });

            await Promise.all(
                req.files.map((file: any, index: any) =>
                    Image.create({
                        advertisementId: newAdvertisement.advertisementId,
                        imageUrl: `/advertisement-images/${file.filename}`,
                        primary: index === 0,
                    })
                )
            );

            res.status(201).json({ message: "Advertisement created successfully", advertisement: newAdvertisement });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async update(req: any, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { categoryId, title, description, price, location } = req.body;

            const advertisement = await Advertisement.findByPk(id, {
                include: [
                    { model: User },
                    { model: Image },
                    { model: Category },
                ],
            });
            if (!advertisement) {
                return res.status(404).json({ message: "Advertisement not found" });
            }

            advertisement.categoryId = categoryId || advertisement.categoryId;
            advertisement.title = title || advertisement.title;
            advertisement.description = description || advertisement.description;
            advertisement.price = price || advertisement.price;
            advertisement.location = location || advertisement.location;
            await advertisement.save();

            if (req.files && req.files.length > 0) {
                await Promise.all(
                    advertisement.images.map(async (image) => {
                        Image.destroy({ where: { imageId: image.imageId } })
                    })
                );

                await Promise.all(
                    req.files.map((file: any, index: any) =>
                        Image.create({
                            advertisementId: advertisement.advertisementId,
                            imageUrl: `/advertisement-images/${file.filename}`,
                            primary: index === 0,
                        })
                    )
                );
            }

            res.status(200).json({ message: "Advertisement updated successfully", advertisement });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const advertisement = await Advertisement.findByPk(id, {
                include: [
                    { model: User },
                    { model: Image },
                    { model: Category },
                ],
            });
            if (!advertisement) {
                return res.status(404).json({ message: "Advertisement not found" });
            }

            if (advertisement.images && advertisement.images.length > 0) {
                await Promise.all(
                    advertisement.images.map(async (image) => {
                        Image.destroy({ where: { imageId: image.imageId } })
                    })
                );
            }

            await advertisement.destroy();
            res.status(200).json({ message: "Advertisement deleted successfully" });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }


    static async adminUpdateStatus(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const advertisement = await Advertisement.findByPk(id);
            if (!advertisement) {
                return res.status(404).json({ message: "Advertisement not found" });
            }

            if (!req.body.status) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const { status } = req.body;

            if (!Object.values(AdvertisementStatus).includes(status)) {
                return res.status(400).json({ message: `Invalid status. Allowed values: ${Object.values(AdvertisementStatus).join(", ")}` });
            }
            advertisement.status = status;

            await advertisement.save();
            return res.status(200).json({ message: "Status updated successfully", advertisement });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }
}