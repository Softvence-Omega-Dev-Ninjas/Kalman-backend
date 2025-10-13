import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PrismaService } from '../prisma/prisma.service';
import { buildFileUrl } from 'src/helpers/urlBuilder';

@Injectable()
export class BlogService {
  constructor(private prisma:PrismaService){}

  // create blog service
  async create(createBlogDto:any,files:any,user:any) {
    const {title,description}=createBlogDto
    const images=files.map((file:any)=>buildFileUrl(file.filename))
    const res=await this.prisma.blog.create({
      data:{
        title,
        description,
        imeges:images,
        userId:user.id
      }
    })
    return res
  }


  // read all blog
 async findAll() {
    const res=await this.prisma.blog.findMany({
      orderBy:{
        createdAt:"desc"
      }
    })
    return res
  }


// read on blog by it's id
  async findOne(id:string) {
    const res=await this.prisma.blog.findFirst({
      where:{
        id
      }
    })
    return res
  }

  
// delete blog by id
 async remove(id: string) {
    const res=await this.prisma.blog.delete({
      where:{
        id
      }
    })
    return{
      message:"Blog deleted successfully"
    }
  }
}
