import { CanActivate, ExecutionContext, Injectable, HttpException } from '@nestjs/common';

import { Role } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    
    const path = request.path;

    const allowedRoutes = [
      '/auth/admin-login', 
      '/admin/login',
      '/admin/system-activity',
    ];

    const isWhitelisted =
      allowedRoutes.some((route) => path.startsWith(route)) ||
      path.startsWith('/docs') ||
      path.startsWith('/swagger');

    if (isWhitelisted) {
      return true;
    }

    const system = await this.prisma.admin_activity.findFirst();

    if (!system?.maintenance_mode) {
      return true;
    }
    const user = request.user;
    if (user && (user as any).role === Role.ADMIN) {
      return true;
    }
    throw new HttpException(
      'System is currently under maintenance. Please try again later.',
      503,
    );
  }
}
