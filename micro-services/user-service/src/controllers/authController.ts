import { NextFunction, Request, Response } from "express";
import { LoginRequest, RegisterRequest, ApiResponse, UserRole, AppError } from "@career-hub/shared-types";
import { isValidEmail } from "@career-hub/shared-utils";
import { comparePasswords, hashPassword, validatePassword } from "../utils/password";
import { UserService } from "../services/userService";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { asyncHandler } from "@career-hub/shared-utils";

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body){
        throw new AppError('Request body is missing!', 400);
    }
    const {email, password}: LoginRequest = req.body;

    if(!email || !password){
        throw new AppError('Email and password are required!', 400);
    }
    
    //check if email/user exists
    const user = await UserService.findByEmail(email.trim());
    if(!user){
        throw new AppError('Invalid email or password!', 400);
    }

    // Compare plain password with stored hash
    const passwordsMatch = await comparePasswords(password, user.password);
    
    if(!passwordsMatch){
        throw new AppError('Invalid email or password!', 400);
    }

    //Generate tokens
    const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
    });

    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token to database
    await UserService.updateRefreshToken(user.id, refreshToken);

    //remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const response: ApiResponse = {
        success: true,
        data: {
            user: userResponse,
            accessToken
        }
    }

    res.status(200).json(response);

});

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body){
        throw new AppError('Request body is missing!', 400);
    }

    const {email, firstName, lastName, password}: RegisterRequest = req.body;

    //check if all fields are not null
    if(!email || !password || !firstName || !lastName){
        throw new AppError('All fields are required!', 400);
    }

    //check if email is valid
    if(!isValidEmail(email)){
        throw new AppError('Invalid email format!', 400);
    }

    //check if password is valid
    const {isValid, errors} = validatePassword(password);
    if(!isValid){
        throw new AppError(errors.join(', '), 400);
    }

    //check if email/user already exists
    const emailExists = await UserService.emailExists(email);
    if(emailExists){
        throw new AppError('Email is already registered!', 409);
    }

    //hash password and create user
    const hashedPassword = await hashPassword(password);
    const userData = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: UserRole.USER
    };

    const newUser = await UserService.createUser(userData);

    //Generate tokens
    const accessToken = generateAccessToken({
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
    });

    const refreshToken = generateRefreshToken(newUser.id);

    // Save refresh token to database
    await UserService.updateRefreshToken(newUser.id, refreshToken);

    //remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const response: ApiResponse = {
        success: true,
        data: {
            user: userResponse,
            accessToken
        }
    }

    res.status(201).json(response);
});

export const refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    
    if(!refreshToken){
        throw new AppError('Refresh token is missing!', 401);
    }

    const payload = verifyRefreshToken(refreshToken);
    if(!payload){
        throw new AppError('Invalid refresh token!', 401);
    }

    const user = await UserService.findById(payload.userId);
    if(!user){
        throw new AppError('User not found!', 404);
    }

    // Verify the refresh token matches the one stored in database
    if(!user.refreshToken || user.refreshToken !== refreshToken){
        throw new AppError('Invalid refresh token!', 401);
    }

    //Generate new access token
    const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role
    });

    // Optionally generate a new refresh token for rotation
    const newRefreshToken = generateRefreshToken(user.id);
    await UserService.updateRefreshToken(user.id, newRefreshToken);

    // Set new refresh token cookie
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const response: ApiResponse = {
        success: true,
        data: {
            accessToken
        }
    }

    res.status(200).json(response);
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    
    if(refreshToken){
        const payload = verifyRefreshToken(refreshToken);
        if(payload){
            // Remove refresh token from database
            await UserService.updateRefreshToken(payload.userId, null);
        }
    }

    // Clear the refresh token cookie
    res.clearCookie('refreshToken');

    const response: ApiResponse = {
        success: true,
        data: {
            message: 'Logged out successfully'
        }
    }

    res.status(200).json(response);
});

export const healthCheck = (req: Request, res: Response) => {
    res.json({
        status: '200',
        service: 'user-service'
    })
}