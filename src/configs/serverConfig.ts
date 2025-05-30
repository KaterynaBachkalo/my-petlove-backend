import dotenv from "dotenv";
dotenv.config();

const serverConfig = {
  mongoUrl: process.env.MONGO_URL ?? "mongodb://localhost:27017",
  PORT: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET ?? "secret-phrase",
  jwtExpires: process.env.JWT_EXPIRES ?? "20h",
  baseUrl: process.env.BASE_URL ?? "http://localhost:4000",
  cloudinaryName: process.env.CLOUDINARY_NAME ?? "cloudinaryName",
  cloudinaryKey: process.env.CLOUDINARY_KEY ?? "12345",
  cloudinarySecret: process.env.CLOUDINARY_SECRET ?? "cloudinarySecret",
};

export default serverConfig;
