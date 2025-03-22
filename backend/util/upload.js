import cloudinary from 'cloudinary';
import fs from 'fs/promises'; // Use promises version for async/await
import dotenv from 'dotenv';

const { v2: cloudinaryV2 } = cloudinary;

dotenv.config();

cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Utility function to delete the local file
const deleteLocalFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Successfully deleted local file: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting local file: ${filePath}`, error);
  }
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error('No file path provided for upload.');
      return null;
    }

    // Upload to Cloudinary
    const response = await cloudinaryV2.uploader.upload(localFilePath, { resource_type: 'auto' });

    // Log success and delete the local file
    console.log('File has been uploaded successfully:', response.secure_url);
    await deleteLocalFile(localFilePath); // Clean up local file after upload
    return response;
  } catch (err) {
    console.error('Error uploading to Cloudinary:', err.message);
    
    // Attempt to delete the local file even if an error occurs
    if (localFilePath) {
      await deleteLocalFile(localFilePath);
    }
    return null;
  }
};

export default uploadOnCloudinary;
