// src/common/guards/roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
  user?: {
    role?: string; 

  };
}

export const ROLES_KEY = 'roles';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as AuthenticatedRequest;
    if (!request.user || !request.user.role) {
      return false;
    }
    const userRole = request.user.role.toLowerCase();

    const normalizedRequiredRoles = requiredRoles.map(role => role.toLowerCase());
    return normalizedRequiredRoles.includes(userRole);
  }
}