const { IMAGE_MAX_SIZE, IMAGE_MIMETYPES } = require("../config/fileUpload.config");
const { ApiError } = require("../error/api.error")

module.exports = {
  checkUploadImage: async (req, res, next) => {
    try {
      // req.files = object with objects
      if (!req.files) {
        throw new ApiError('No file provided', 400);
      }

      const imagesToUpload = Object.values(req.files); // all files as objects from form data

      for (img of imagesToUpload) {
        const { name, size, mimetype } = img;

        if (size > IMAGE_MAX_SIZE) {
          throw new ApiError(`File ${name} size is too big`, 400);
        }

        if (!IMAGE_MIMETYPES.includes(mimetype)) {
          throw new ApiError(`File ${name} has invalid format`, 400);
        }
      }

      next();
    } catch (error) {
      next(error)
    }
  }
}