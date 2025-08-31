// utils/requestForwarder.ts
import { Request, Response } from 'express';
import axios from 'axios';

export const forwardRequest = async (req: Request, res: Response, serviceUrl: string, path: string) => {
  try {
    console.log(`🔄 Forwarding ${req.method} ${req.originalUrl} -> ${serviceUrl}${path}`);
    console.log('Headers:', req.body);
    
    const response = await axios({
      method: req.method,
      url: `${serviceUrl}${path}`,
      data: req.body,
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json',
        // Forward auth headers if present
        ...(req.headers.authorization && { 'Authorization': req.headers.authorization }),
        // Forward user context if available (from auth middleware)
        ...(req.headers['x-user-id'] && { 'x-user-id': req.headers['x-user-id'] }),
        ...(req.headers['x-user-email'] && { 'x-user-email': req.headers['x-user-email'] })
      },
      timeout: 10000
    });

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error(`❌ Error forwarding to ${serviceUrl}:`, error.message);
    
    if (error.response) {
      // Forward the error response from the service
      res.status(error.response.status).json(error.response.data);
    } else if (error.code === 'ECONNREFUSED') {
      res.status(503).json({
        error: 'Service unavailable',
        message: `Unable to connect to service at ${serviceUrl}`
      });
    } else {
      // Network or other error
      res.status(503).json({
        error: 'Service unavailable',
        message: 'Unable to connect to backend service'
      });
    }
  }
};