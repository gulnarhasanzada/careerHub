import { Request, Response } from "express";
import { LoginRequest, RegisterRequest, ApiResponse, UserRole } from "@career-hub/shared-types";
import { isValidEmail } from "@career-hub/shared-utils";
import { hashPassword, validatePassword } from "../utils/password";
import { UserService } from "../services/userService";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const login = (req: Request, res: Response) => {
    const loginData: LoginRequest = req.body;

    const response: ApiResponse = {
        status: '200',
        message: 'Login success!'
    };

    res.json(response);
}

export const register = async (req: Request, res: Response) => {
    try {
        const {email, firstName, lastName, password}: RegisterRequest = req.body;
    
        //check if all fields are not null
        if(!email || !password || !firstName || !lastName){
            const response: ApiResponse = {
                success: false,
                error: 'All fields are required!'
            };
            return res.status(400).json(response);
        }

        //check if email is valid
        if(!isValidEmail(email)){
            const response: ApiResponse = {
                success: false,
                error: 'Invalid email format!'
            };
            return res.status(400).json(response);
        }

        //check if password is valid
        const {isValid, errors} = validatePassword(password);
        if(!isValid){
            const response: ApiResponse = {
                success: false,
                error: errors.join(', ')
            };
            return res.status(400).json(response);
        }

        //check if email/user already exists
        const emailExists = await UserService.emailExists(email);
        if(emailExists){
            const response: ApiResponse = {
                success: false,
                error: 'User already exists'
            };
            return res.status(409).json(response);
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
    } catch (error) {
        console.log('Registration erroe: ', error);
        const response: ApiResponse = {
            success: false,
            error: 'Internal server error!'
        }
        res.status(500).json(response);
    }
}

export const healthCheck = (req: Request, res: Response) => {
    res.json({
        status: '200',
        service: 'user-service'
    })
}