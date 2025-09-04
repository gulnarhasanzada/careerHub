import { NextFunction, Request, Response } from "express";
import { LoginRequest, RegisterRequest, ApiResponse, UserRole, AppError } from "@career-hub/shared-types";
import { isValidEmail } from "@career-hub/shared-utils";
import { comparePasswords, hashPassword, validatePassword } from "../utils/password";
import { UserService } from "../services/userService";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
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

    //remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    const response: ApiResponse = {
        success: true,
        data: {
            user: userResponse,
            accessToken,
            refreshToken
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

    //remove password from response
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    const response: ApiResponse = {
        success: true,
        data: {
            user: userResponse,
            accessToken,
            refreshToken
        }
    }

    res.status(201).json(response);
});

export const healthCheck = (req: Request, res: Response) => {
    res.json({
        status: '200',
        service: 'user-service'
    })
}