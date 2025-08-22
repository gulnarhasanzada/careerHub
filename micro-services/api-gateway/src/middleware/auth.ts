import { ApiResponse } from "@career-hub/shared-types";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request{
    user?:{
        userId: string,
        email: string,
        role: string;
    }
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; //Bearer Token

    if(!token){
        const response: ApiResponse = {
            success: false,
            error: 'Authorization required!'
        };
        res.status(401).json(response);
    }

    try {
        const decoded = jwt.verify(token!, process.env.JWT_SECRET!) as any;
        req.user = decoded;
        next();
    } catch (error) {
        const response: ApiResponse = {
            success: false,
            error: 'Invalid or expired token'
        };
        return res.status(403).json(response);
    }
}

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1]; //Bearer Token

    if(token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            req.user = decoded;
        } catch (error) {
            console.log('Invalid token provided, continuing without auth');
        }
    }
    next();
}