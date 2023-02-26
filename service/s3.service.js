const S3 = require('aws-sdk/clients/s3');
const {
  S3_REGION,
  S3_BUCKET_NAME,
  S3_ACCESS_KEY,
  S3_SECRET_ACCESS_KEY,
  S3_BUCKET_URL,
} = require('../config/config');
const { buildFileName } = require('../helpers/files');

const s3bucket = new S3({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

async function uploadPublicFile(fileToUpload, itemType, itemId) {
  return s3bucket
    .upload({
      // access control list
      ACL: 'public-read', // for public url of the file (права доступу)
      Body: fileToUpload.data, // content
      Bucket: S3_BUCKET_NAME,
      ContentType: fileToUpload.mimetype,
      Key: buildFileName(fileToUpload.name, itemType, itemId), // file path + file name
    })
    .promise();
}

async function updatePublicFile(fileUrl, fileToUpload) {
  return s3bucket
    .putObject({
      ACL: 'public-read',
      Body: fileToUpload.data, // content
      ContentType: fileToUpload.mimetype,
      Bucket: S3_BUCKET_NAME,
      Key: fileUrl.split(S3_BUCKET_URL).pop(),
    })
    .promise();
}

async function deletePublicFile(fileUrl) {
  console.log(fileUrl.split(S3_BUCKET_URL).pop());
  return s3bucket
    .deleteObject({
      Bucket: S3_BUCKET_NAME,
      Key: fileUrl.split(S3_BUCKET_URL).pop(),
    })
    .promise();
}

module.exports = {
  updatePublicFile,
  uploadPublicFile,
  deletePublicFile,
};
