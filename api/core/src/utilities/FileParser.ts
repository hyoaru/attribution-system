import path from "path";
import fs from "fs";
import { Blob, File } from "buffer";

export class FileParser {
  static async parseMulterFile(multerFile: Express.Multer.File): Promise<File> {
    const filePath = path.resolve(multerFile.path);
    const fileBuffer = await fs.promises.readFile(filePath);

    const blob = new Blob([fileBuffer], { type: multerFile.mimetype });

    // Create a `File` using the Blob
    const parsedFile = new File([blob], multerFile.originalname, {
      type: multerFile.mimetype,
      lastModified: new Date().getTime(),
    });

    await fs.promises.unlink(multerFile.path);

    return parsedFile;
  }
}
