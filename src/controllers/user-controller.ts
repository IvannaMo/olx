import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import SecureService from "../services/secure-service.js";
import { Request, Response } from "express";
import { User, UserStatus, UserType } from "../models/user-model.js";
import { RefreshToken } from "../models/refresh-token-model.js";
import { Advertisement } from "../models/advertisement-model.js";
import { Notification } from "../models/notification-model.js";
import { Image } from "../models/image-model.js";


export class UserController {
    static async register(req: Request, res: Response): Promise<any> {
        try {
            if (!req.body.email || !req.body.password || (typeof req.body.newsletterSubscription === "undefined")) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const { email, password, newsletterSubscription } = req.body;
            
            const user = await User.findOne({ where: { email } });
            if (user) {
                return res.status(409).json({ message: "User already exists" });
            }

            const name = email.split("@")[0];                
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
                newsletterSubscription: newsletterSubscription,
                status: UserStatus.ONLINE,
            });

            const accessToken = SecureService.generateAccessToken(newUser.userId);
            const refreshToken = SecureService.generateRefreshToken(newUser.userId);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + parseInt(process.env.REFRESH_TOKEN_TIME || "7"));

            await RefreshToken.create({ 
                userId: newUser.userId, 
                token: refreshToken, 
                expiryDate: expiryDate,
            });

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 3600 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 3600 * 1000,
            });

            res.status(201).json({ message: "User registered successfully", user: newUser });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async login(req: Request, res: Response): Promise<any> {
        try {
            if (!req.body.email || !req.body.password) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (!await bcrypt.compare(password, user.password)) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const accessToken = SecureService.generateAccessToken(user.userId);
            const refreshToken = SecureService.generateRefreshToken(user.userId);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + parseInt(process.env.REFRESH_TOKEN_TIME || "7"));

            await RefreshToken.create({ 
                userId: user.userId, 
                token: refreshToken, 
                expiryDate: expiryDate,
            });

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 3600 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 3600 * 1000,
            });

            await user.update({ status: UserStatus.ONLINE });
            res.status(200).json({ accessToken, refreshToken, user });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async logout(req: Request, res: Response): Promise<any> {
        try {
            const refreshToken = req.cookies.refreshToken;
            const result = await RefreshToken.destroy({ where: { token: refreshToken } });

            if (!result) {
                return res.status(400).json({ message: "Invalid refresh token" });
            }

            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            res.status(200).json({ message: "Logged out successfully" });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async forgotPassword(req: any, res: Response): Promise<any> {
        try {
            if (!req.body.email) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const { email } = req.body;
            
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const resetPasswordToken = SecureService.generateResetPasswordToken(user.userId);
            res.cookie("resetPasswordToken", resetPasswordToken, {
                httpOnly: true,
                maxAge: 3600 * 1000,
            });

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const resetPasswordLink = `${req.protocol}://${req.get("host")}/reset-password?token=${resetPasswordToken}`;
            const mailOptions = {
                from: `OLX Support <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Відновлення пароля на OLX",
                text: `Для відновлення пароля перейдіть за посиланням: ${resetPasswordLink}`,
                html: `<p>Для відновлення пароля, будь ласка, перейдіть за наступним посиланням:</p><a href="${resetPasswordLink}">Змінити пароль</a>`,
            };
            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: "Password reset link sent to email" });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async resetPassword(req: any, res: Response): Promise<any> {
        try {
            if (!req.user) {
                return res.status(404).json({ message: "User not found" });
            }
            const user = req.user;

            if (!req.body.password) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const { password } = req.body;

            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            await user.update({ password: hashedPassword });

            res.status(200).json({ message: "Password updated successfully" });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async get(req: any, res: Response): Promise<any> {
        res.status(200).json({ user: req.user });
    }

    static async delete(req: any, res: Response): Promise<any> {
        try {
            if (!req.user) {
                return res.status(404).json({ message: "User not found" });
            }
            const user = req.user;
            
            const advertisements = await Advertisement.findAll({ where: { userId: user.userId } });
            for (const advertisement of advertisements) {
                await Image.destroy({ where: { advertisementId: advertisement.advertisementId } });
            }

            await Advertisement.destroy({ where: { userId: user.userId } });
            await Notification.destroy({ where: { senderId: user.userId } });
            await RefreshToken.destroy({ where: { userId: user.userId } });

            await user.destroy();
            res.status(200).json({ message: "Account deleted successfully" });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }


    static async adminCreate(req: Request, res: Response): Promise<any> {
        try {
            if (!req.body.email || !req.body.password) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const { email, password, name, phone, profileImageUrl, location, type, rating, newsletterSubscription } = req.body;

            const user = await User.findOne({ where: { email } });
            if (user) {
                return res.status(409).json({ message: "User already exists" });
            }

            if (type && !Object.values(UserType).includes(type)) {
                return res.status(400).json({ message: `Invalid type. Allowed values: ${Object.values(UserType).join(", ")}` });
            }
            if (rating && ((typeof rating !== "number") || (rating < 0) || (rating > 5)))  {
                return res.status(400).json({ message: "Invalid rating. Must be a number between 0 and 5" });
            }
           
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const newUser = await User.create({
                name: name ?? email.split("@")[0],
                email: email,
                phone: phone ?? null,
                password: hashedPassword,
                profileImageUrl: profileImageUrl ?? null,
                location: location ?? null,
                type: type ?? UserType.USER,
                status: UserStatus.OFFLINE,
                rating: rating ?? null,
                newsletterSubscription: newsletterSubscription ?? false,
            });

            const refreshToken = SecureService.generateRefreshToken(newUser.userId);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + parseInt(process.env.REFRESH_TOKEN_TIME || "7"));

            await RefreshToken.create({ 
                userId: newUser.userId, 
                token: refreshToken, 
                expiryDate: expiryDate,
            });

            res.status(201).json({ message: "User registered successfully", user: newUser });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }

    static async adminUpdate(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { name, email, phone, profileImageUrl, location, type, status, rating, newsletterSubscription } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (email && (email !== user.email)) {
                const emailExists = await User.findOne({ where: { email } });
                if (emailExists) {
                    return res.status(409).json({ message: "Email already in use" });
                }
                user.email = email;
            }

            user.name = name || user.name;
            user.email = email || user.email;
            user.phone = phone || user.phone;
            user.profileImageUrl = profileImageUrl || user.profileImageUrl;
            user.location = location || user.location;
            user.newsletterSubscription = newsletterSubscription || user.newsletterSubscription;

            if (type) {
                if (!Object.values(UserType).includes(type)) {
                    return res.status(400).json({ message: `Invalid type. Allowed values: ${Object.values(UserType).join(", ")}` });
                }
                user.type = type;
            }
            if (status) {
                if (!Object.values(UserStatus).includes(status)) {
                    return res.status(400).json({ message: `Invalid status. Allowed values: ${Object.values(UserStatus).join(", ")}` });
                }
                user.status = status;
            }
            if (rating && ((typeof rating !== "number") || (rating < 0) || (rating > 5)))  {
                return res.status(400).json({ message: "Invalid rating. Must be a number between 0 and 5" });
            }

            await user.save();
            return res.status(200).json({ message: "User updated successfully", user });
        }
        catch (err) {
            res.status(500).json({ message: "Server error", err });
        }
    }
}