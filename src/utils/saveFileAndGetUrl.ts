import * as fs from 'fs';
import * as path from 'path';

export async function saveFileAndGetUrl(
  file: Express.Multer.File,
): Promise<string> {
  const uploadDir = path.join(__dirname, '../../uploads');

  // Create upload directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create unique filename
  const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
  const filePath = path.join(uploadDir, fileName);

  // Write buffer to file
  fs.writeFileSync(filePath, file.buffer);

  // Return accessible URL (relative path)
  return `${process.env.SERVER_URL}/uploads/${fileName}`;
}
