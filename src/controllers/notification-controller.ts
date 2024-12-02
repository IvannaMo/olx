import { Request, Response } from "express";
import { Notification } from "../models/notification-model.js";
import { User } from "../models/user-model.js";


export class NotificationController {
    static async getAll(req: Request, res: Response): Promise<any> {
        try {
            const notifications = await Notification.findAll({
                include: [
                    { model: User, as: "sender", attributes: ["name", "email"] },
                    { model: User, as: "receiver", attributes: ["name", "email"] }
                ]
            });
            res.status(200).json({ notifications });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async getById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const notification = await Notification.findByPk(id, {
                include: [
                    { model: User, as: "sender", attributes: ["name", "email"] },
                    { model: User, as: "receiver", attributes: ["name", "email"] }
                ]
            });
            if (!notification) {
                return res.status(404).json({ message: "Notification not found" });
            }

            res.status(200).json({ notification });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async create(req: any, res: Response): Promise<any> {
        try {
            if (!req.user) {
                return res.status(404).json({ message: "User not found" });
            }
            const user = req.user;

            if (!req.body.receiverId || !req.body.message) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const { receiverId, message } = req.body;

            const newNotification = await Notification.create({
                senderId: user.userId,
                receiverId: receiverId,
                message: message,
            });

            res.status(201).json({ message: "Notification created successfully", notification: newNotification });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async update(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { senderId, receiverId, message, isRead } = req.body;

            const notification = await Notification.findByPk(id);
            if (!notification) {
                return res.status(404).json({ message: "Notification not found" });
            }

            await notification.update({ senderId, receiverId, message, isRead });
            res.status(200).json({ message: "Notification updated successfully", notification });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const notification = await Notification.findByPk(id);
            if (!notification) {
                return res.status(404).json({ message: "Notification not found" });
            }

            await notification.destroy();
            res.status(200).json({ message: "Notification deleted successfully" });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }
}