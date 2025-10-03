import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { Role, Status } from '@prisma/client';
import { PrismaService } from 'src/module/prisma/prisma.service';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger(SeederService.name);

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL as string;
    const adminPassword = process.env.ADMIN_PASSWORD as string;
    const admin_phone = process.env.ADMIN_PHONE as string;

    const supperAdmin = await this.prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });

    if (supperAdmin) {
      this.logger.log('Admin is already exists, skipping seeding.');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await this.prisma.user.create({
      data: {
        Phone:admin_phone,
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
        verification:Status.COMPLETE
      },
    });

    this.logger.log(`Default super admin created: ${adminEmail}`);
  }
}