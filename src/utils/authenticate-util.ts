import { NextFunction, Request, Response } from "express";
import SecureService from "../services/secure-service.js";


class AuthenticateUtil {
    static accessTokenRedirect(req: Request, res: Response, next: NextFunction) {
        SecureService.authenticateAccessToken(req, res, (err) => {
            if (err) {
                return res.redirect("/login");
            }
    
            next();
        });
    }
    
    static resetPasswordTokenRedirect(req: Request, res: Response, next: NextFunction) {
        SecureService.authenticateResetPasswordToken(req, res, (err) => {
            if (err) {
                return res.redirect("/forgot-password");
            }
    
            next();
        });
    }
}

export default AuthenticateUtil;