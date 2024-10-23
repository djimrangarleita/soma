import { Request } from 'express';
import fs from 'fs';
import multer, { StorageEngine } from 'multer';
import path from 'path';

const mediaDirName = 'media';

const mediaDir = path.join(mediaDirName);
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir);
}

const storage: StorageEngine = multer.diskStorage({
  destination: (
    req: Request,
    file: any,
    cb: (error: Error | null, destination: string) => void
  ) => {
    const dirParam = (req.query.dir as string) || 'uploads';
    const directory = path.join(mediaDir, dirParam);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    cb(null, directory);
  },
  filename: (
    req: Request,
    file: any,
    cb: (error: Error | null, filename: string) => void
  ) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });
