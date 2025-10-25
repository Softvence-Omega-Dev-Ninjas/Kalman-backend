import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
export const saveFile = async (file: Express.Multer.File) => {
  if (!file) throw new BadRequestException('No file uploaded');

  try {
    const fileId = uuidv4();
    const fileExt = path.extname(file.originalname);
    const filename = `${fileId}${fileExt}`;

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    const fileUrl = `${process.env.SERVER_URL}/uploads/${filename}`;

    // Save file from buffer (Multer memory storage) or temp path
    if (file.buffer) {
      fs.writeFileSync(filePath, file.buffer);
    } else if (file.path) {
      const fileBuffer = fs.readFileSync(file.path);
      fs.writeFileSync(filePath, fileBuffer);
    } else {
      throw new BadRequestException('File buffer or path missing');
    }

    return {
      filename,
      originalFilename: file.originalname,
      path: filePath,
      url: fileUrl,
      mimeType: file.mimetype,
      fileType: file.mimetype.split('/')[0],
      size: file.size,
    };
  } catch (error) {
    throw new BadRequestException('Error saving uploaded file');
  }
};
