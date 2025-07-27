const { S3Client, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Create S3 client (v3) - only if AWS credentials are provided
let s3Client = null;

if (process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });
} else {
  console.log('AWS credentials not provided. S3 functionality will be disabled.');
}

// Function to delete file from S3
const deleteFileFromS3 = async (key) => {
  if (!s3Client) {
    console.log('S3 client not available. File deletion skipped.');
    return true;
  }
  try {
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    }));
    return true;
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return false;
  }
};

// Function to get signed URL for private files
const getS3SignedUrl = async (key, expiresIn = 3600) => {
  if (!s3Client) {
    console.log('S3 client not available. Signed URL generation skipped.');
    return null;
  }
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    });
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

module.exports = {
  s3Client,
  deleteFileFromS3,
  getS3SignedUrl
};