import axios from 'axios';
import { SERVICES } from '../config/services';

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy';
  responseTime?: number;
  error?: string;
}

export class HealthCheckService {
  static async checkService(serviceName: string): Promise<ServiceHealth> {
    const service = SERVICES[serviceName];
    const startTime = Date.now();

    try {
      const response = await axios.get(`${service.url}${service.healthCheck}`, {
        timeout: service.timeout
      });

      const responseTime = Date.now() - startTime;

      return {
        name: serviceName,
        status: response.status === 200 ? 'healthy' : 'unhealthy',
        responseTime
      };
    } catch (error: any) {
      return {
        name: serviceName,
        status: 'unhealthy',
        responseTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  static async checkAllServices(): Promise<ServiceHealth[]> {
    const serviceNames = Object.keys(SERVICES);
    const healthChecks = serviceNames.map(name => this.checkService(name));
    
    return Promise.all(healthChecks);
  }
}