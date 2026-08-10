import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        clerkId: true,
        email: true,
        fullName: true,
        username: true,
        title: true,
        avatarUrl: true,
        isGuest: true,
        createdAt: true,
      },
    });
  }

  async findByClerkId(clerkId: string) {
    return this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async createGuestUser() {
    return this.prisma.user.create({
      data: {
        fullName: "Guest",
        isGuest: true,
      },
    });
  }
}
