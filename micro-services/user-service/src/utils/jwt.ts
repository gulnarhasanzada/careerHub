import jwt from "jsonwebtoken";
import { JWTPayload } from "@career-hub/shared-types";

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';

export const generateAccessToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string=>{
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '30s' });
}

export const generateRefreshToken = (userId: string): string=>{
    return jwt.sign({userId}, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export const verifyAccessToken = (token: string): JWTPayload => {
    try{
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    }catch (error) {
        throw new Error('Invalid access token.')
    }
}

export const verifyRefreshToken = (token: string): {userId: string} => {
    try {
        return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
    } catch (error) {
        throw new Error('Invalid refresh token.');
    }
}

