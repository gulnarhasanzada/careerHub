interface ServiceConfig {
    name: string,
    url: string,
    healthCheck: string,
    timeout: number
}

export const SERVICES: Record<string, ServiceConfig> = {
    'user-service':{
        name: 'user-service',
        url: process.env.USER_SERVICE_URL || 'http://localhost:4001',
        healthCheck: '/health',
        timeout: 5000
    }
};

export const ROUTE_MAPPINGS = {
  '/api/auth': 'user-service',
  '/api/users': 'user-service',
};