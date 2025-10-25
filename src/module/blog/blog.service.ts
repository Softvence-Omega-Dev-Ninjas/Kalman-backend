import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { buildFileUrl } from 'src/helpers/urlBuilder';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

 
  // CREATE BLOG
 
  async create(createBlogDto: any, files: any, user: any) {
    const { title, description } = createBlogDto;
    const images = files?.map((file: any) => buildFileUrl(file.filename)) || [];

    const res = await this.prisma.blog.create({
      data: {
        title,
        description,
        imeges: images,
        userId: user.id,
      },
    });
    return res;
  }

 
  // READ ALL BLOGS
 
  async findAll() {
    const res = await this.prisma.blog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profile_image: true,
            role: true,
          },
        },
      },
    });
    return res;
  }




  // READ SINGLE BLOG BY ID

  async findOne(id: string) {
    if(!id){
      throw new BadRequestException("Id is required")
    }
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }



 
  // UPDATE BLOG

  async update(id: string, updateBlogDto: any, files: any, user: any) {
    const existingBlog = await this.prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    // build new image URLs if new files are uploaded
    let images = existingBlog.imeges || [];
    if (files && files.length > 0) {
      const newImages = files.map((file: any) => buildFileUrl(file.filename));
      images = [...images, ...newImages]; // append new images to existing ones
    }

    const { title, description } = updateBlogDto;

    const updatedBlog = await this.prisma.blog.update({
      where: { id },
      data: {
        title: title ?? existingBlog.title,
        description: description ?? existingBlog.description,
        imeges: images,
        userId: user.id,
      },
    });

    return {
      message: 'Blog updated successfully',
      data: updatedBlog,
    };
  }

 

  // DELETE BLOG
 
  async remove(id: string) {
    if(!id){
      throw new BadRequestException("Id is required")
    }
    const existingBlog = await this.prisma.blog.findUnique({ where: { id } });
    if (!existingBlog) {
      throw new NotFoundException('Blog not found');
    }

    await this.prisma.blog.delete({ where: { id } });
    return { message: 'Blog deleted successfully' };
  }





  //remove specific image

 async removeImage(id: string, imageIndex: number) {
  if (!id) {
    throw new BadRequestException('Id is required');
  }

  if (isNaN(imageIndex)) {
    throw new BadRequestException('Image index is required');
  }

  const existingBlog = await this.prisma.blog.findUnique({ where: { id } });

  if (!existingBlog) {
    throw new NotFoundException('Blog not found');
  }

  const images = existingBlog.imeges || [];

  if (imageIndex < 0 || imageIndex >= images.length) {
    throw new BadRequestException('Invalid image index');
  }

  const imageUrl = images[imageIndex];
  const uploadDir = join(process.cwd(), 'uploads');
  const fileName = imageUrl.split('/').pop() || '';
  const filePath = join(uploadDir, fileName);

  // Remove the image from array
  images.splice(imageIndex, 1);

  // Delete image file from storage if exists
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  // Update database
  await this.prisma.blog.update({
    where: { id },
    data: { imeges: images },
  });

  return { message: 'Image deleted successfully' };
}
}
