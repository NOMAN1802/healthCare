import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { IFileUpload, TFile } from "../app/interfaces/file";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const uploadToCloudinary = async (file: TFile): Promise<IFileUpload> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      (error: Error, result: IFileUpload) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(file.buffer);
  });
};

const upload = multer({ storage });

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
