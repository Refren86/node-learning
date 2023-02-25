const S3 = require('aws-sdk/clients/s3');
const {
  S3_REGION,
  S3_BUCKET_NAME,
  S3_ACCESS_KEY,
  S3_SECRET_ACCESS_KEY,
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

module.exports = {
  uploadPublicFile,
};
