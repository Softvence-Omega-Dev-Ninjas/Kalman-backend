import { Controller, Get, Res } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import appMetadata from './app-metadata/app-metadata';
import { Public } from './common/decorators/public.decorator';

// Dynamic last update
const lastServerUpdate = new Date();

@Controller()
export class AppController {
  @ApiOkResponse({
    description: 'Returns service health status',
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
      lastServerUpdate: lastServerUpdate.toISOString(),
    };
  }

  @ApiOkResponse({
    description: 'Returns service health status for monitoring',
  })
  @Public()
  @Get('api/health')
  async getHealthCheck(@Res() res: any) {
    const start = Date.now();

    const data = {
      status: 'ok',
      name: appMetadata.displayName,
      version: appMetadata.version,
      description: appMetadata.description,
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      lastServerUpdate: lastServerUpdate.toISOString(),
      team: {
        name: 'Dev Ninja',
        members: [
          { name: 'Milon', role: 'Backend Developer' },
          { name: 'Sujon', role: 'Backend Developer' },
        ],
      },
    };

    const responseTime = Date.now() - start;

    res.status(200).json({
      ...data,
      responseTime: `${responseTime}ms`,
    });
  }
}
