import jwt from "jsonwebtoken";
import { User, UserType } from "../models/user-model.js";
import { RefreshToken } from "../models/refresh-token-model.js";
import { NextFunction, Request, Response } from "express";


class SecureService {
    static generateAccessToken(userId: string) {
        return jwt.sign({ userId }, process.env.JWT_ACCESS_KEY || "jwt_access_key", {
            expiresIn: process.env.ACCESS_TOKEN_TIME || "1h"
        });
    }

    static generateRefreshToken(userId: string) {
        return jwt.sign({ userId }, process.env.JWT_REFRESH_KEY || "jwt_refresh_key", {
            expiresIn: process.env.REFRESH_TOKEN_TIME || "7d"
        });
    }

    static generateResetPasswordToken(userId: string) {
        return jwt.sign({ userId }, process.env.JWT_RESET_PASSWORD_KEY || "jwt_reset_password_key", { 
            expiresIn: process.env.RESET_PASSWORD_TOKEN_TIME || "1h" 
        });
    }


    static authenticateAccessToken(req: any, res: any, next: NextFunction) {
        const token = req.cookies.accessToken;
        if (!token) {
            if (req.accepts("html")) {
                const error: any = new Error("Access token required");
                error.status = 401;

                return next(error);
            }
            return res.status(401).json({ message: "Access token required" });
        }

        jwt.verify(token, process.env.JWT_ACCESS_KEY || "jwt_access_key", async (err: any, payload: any) => {
            if (err) {
                if (req.accepts("html")) {
                    const error: any = new Error("Invalid or expired access token");
                    error.status = 403;
                    
                    return next(error);
                }
                return res.status(403).json({ message: "Invalid or expired access token" });
            }

            const user = await User.findByPk(payload.userId);
            if (!user) {
                if (req.accepts("html")) {
                    const error: any = new Error("User not found");
                    error.status = 404;

                    return next(error);
                }
                return res.status(404).json({ message: "User not found" });
            }

            req.user = user;
            next();
        });
    }

    static authenticateAccessTokenOptional(req: any, res: Response, next: NextFunction) {
        const token = req.cookies.accessToken;
        if (!token) {
            req.user = null;
            return next();
        }

        jwt.verify(token, process.env.JWT_ACCESS_KEY || "jwt_access_key", async (err: any, payload: any) => {
            if (err) {
                req.user = null;
                return next();
            }

            const user = await User.findByPk(payload.userId);
            req.user = user || null;
            next();
        });
    }

    static authenticateRefreshToken(req: any, res: Response, next: NextFunction) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh token required" });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY || "jwt_refresh_key", async (err: any, payload: any) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }

            const token = await RefreshToken.findOne({ where: { token: refreshToken } });
            if (!token) {
                return res.status(403).json({ message: "Refresh token not valid" });
            }

            const user = await User.findByPk(payload.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            req.user = user;
            next();
        });
    }

    static authenticateResetPasswordToken(req: any, res: any, next: NextFunction) {
        const token = req.cookies.resetPasswordToken;
        if (!token) {
            if (req.accepts("html")) {
                const error: any = new Error("Reset password token required");
                error.status = 401;

                return next(error);
            }
            return res.status(401).json({ message: "Reset password token required" });
        }
        
        jwt.verify(token, process.env.JWT_RESET_PASSWORD_KEY || "jwt_reset_password_key", async (err: any, payload: any) => {
            if (err) {
                if (req.accepts("html")) {
                    const error: any = new Error("Invalid or expired reset password token");
                    error.status = 403;

                    return next(error);
                }
                return res.status(403).json({ message: "Invalid or expired reset password token" });
            }

            const user = await User.findByPk(payload.userId);
            if (!user) {
                if (req.accepts("html")) {
                    const error: any = new Error("User not found");
                    error.status = 404;

                    return next(error);
                }
                return res.status(404).json({ message: "User not found" });
            }

            req.user = user;
            next();
        });
    }

    static authenticateAdmin(req: any, res: any, next: NextFunction) {
        const user = req.user;
        if (!user || user.type !== UserType.ADMIN) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    }    
}

export default SecureService;