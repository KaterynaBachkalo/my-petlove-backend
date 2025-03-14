import multer, { FileFilterCallback } from "multer";
import { HttpError } from "../utils";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { Jimp } from "jimp";
import { ObjectId } from "mongodb";
import serverConfig from "../configs/serverConfig";

interface CustomUser {
  _id: ObjectId;
  email: string;
  name: string;
  favorites: string[];
  avatar: string;
  phone: number;
}

const tempDir = path.join(__dirname, "../", "tmp");

const multerStorage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new HttpError(400, "Please, upload images only!!"));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const avatarDir = path.join(__dirname, "../", "public", "images");

if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}

const createAvatar = async (user: CustomUser, file: Express.Multer.File) => {
  const { path: tempUpload, originalname } = file;
  const filename = `${user._id}_${originalname}`;

  const resultUpload = path.join(avatarDir, filename);

  try {
    const newAvatar = await Jimp.read(tempUpload);

    const width = newAvatar.width;
    const height = newAvatar.height;

    const minSide = Math.min(width, height);

    const x = (width - minSide) / 2;
    const y = (height - minSide) / 2;

    newAvatar
      .crop({ x, y, h: minSide, w: minSide })
      .resize({ h: 150, w: 150 })
      .write(`./src/public/images/${filename}`);

    fs.renameSync(tempUpload, resultUpload);

    const avatar = path
      .join(`${serverConfig.baseUrl}/images/${filename}`)
      .replace(/\\/g, "/")
      .replace("http:/", "http://");

    return avatar;
  } catch (error) {
    console.error("Error processing image:", error);
    return null;
  }
};

const createPetAvatar = async (
  userId: string,
  file: Express.Multer.File | null
) => {
  if (!file) {
    return null;
  }

  const { path: tempUpload, originalname } = file;

  const filename = `${userId}_${originalname}`;

  const safeDir = process.env.NODE_ENV === "production" ? "/tmp/" : avatarDir;

  const resultUpload = path.join(safeDir, filename);

  try {
    const newAvatar = await Jimp.read(tempUpload);

    const width = newAvatar.width;
    const height = newAvatar.height;

    const minSide = Math.min(width, height);

    const x = (width - minSide) / 2;
    const y = (height - minSide) / 2;

    newAvatar
      .crop({ x, y, h: minSide, w: minSide })
      .resize({ h: 150, w: 150 })
      .write(`./src/public/images/${filename}`);

    await fs.promises.rename(tempUpload, resultUpload);

    const avatar = path
      .join(`${serverConfig.baseUrl}/images/${filename}`)
      .replace(/\\/g, "/")
      .replace("http:/", "http://");

    return avatar;
  } catch (error) {
    console.error("Error processing image:", error);
    return null;
  }
};

export { upload, createAvatar, createPetAvatar };
