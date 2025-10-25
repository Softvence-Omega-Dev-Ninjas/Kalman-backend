import { Controller, Get, Res } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import appMetadata from './app-metadata/app-metadata';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @ApiOkResponse({
    description: 'Returns service health status',
    example: 'hello',
  })
  @Get()
  @Public()
  async getHealth() {
    return {
      status: 'ok',
      version: appMetadata.version,
      name: appMetadata.displayName,
      description: appMetadata.description,
      timestamp: new Date().toISOString(),
    };
  }

  @ApiOkResponse({
    description: 'Returns service health status for monitoring',
    schema: {
      example: {
        status: 'healthy',
        timestamp: '2025-05-27T12:00:00.000Z',
        version: '0.3.1',
        uptime: 3600,
      },
    },
  })
    @Public()
  @Get('api/health')
  @Public()
  async getHealthCheck(@Res() res:any) {
    res.status(200).json({
      status: 'ok',
      name: appMetadata.displayName,
      version: appMetadata.version,
      description: appMetadata.description,
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      // memory: process.memoryUsage(),
      // cpu: process.cpuUsage(),
      team: {
        name: 'Dev Ninja',
        leader: 'Niloy',
        members: [
          {
            name: 'Milon',
            role: 'Backend Developer',
          },
          {
            name: 'Sujon',
            role: 'Backend Developer',
          },
        ],
      },
    });
  }
}
