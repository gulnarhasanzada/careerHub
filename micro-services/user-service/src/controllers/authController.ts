import { Request, Response } from "express";
import { LoginRequest, RegisterRequest, ApiResponse } from "@career-hub/shared-types";

export const login = (req: Request, res: Response) => {
    const loginData: LoginRequest = req.body;

    const response: ApiResponse = {
        status: '200',
        message: 'Login success!'
    };

    res.json(response);
}

export const register = (req: Request, res: Response) => {
    const registerData: RegisterRequest = req.body;

    const response: ApiResponse = {
        status: '200',
        message: 'Register success!'
    }

    res.json(response);
}

export const healthCheck = (req: Request, res: Response) => {
    res.json({
        status: '200',
        service: 'user-service'
    })
}