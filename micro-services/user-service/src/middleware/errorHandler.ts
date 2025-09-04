import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = 500;
    let message = 'Internal server error';

    // Check for custom error properties
    if (err && typeof err.statusCode === 'number') {
        statusCode = err.statusCode;
        message = err.message || 'An error occurred';
    } else if (err instanceof Error) {
        message = err.message;
        
        // Common error types
        if (err.name === 'ValidationError') statusCode = 400;
        if (err.name === 'UnauthorizedError') statusCode = 401;
        if (err.name === 'CastError') statusCode = 400;
    }

    console.error('❌ Error:', {
        message,
        statusCode,
        url: req.url,
        method: req.method,
        stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined
    });

    res.status(statusCode).json({
        success: false,
        error: message
    });
};