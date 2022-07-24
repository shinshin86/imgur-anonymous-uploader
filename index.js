const fs = require('fs');
const fetch = require('node-fetch');
const FileType = require('file-type');

const URL = 'https://api.imgur.com/3/image';

const validFileExtList = [
  'jpg',
  'png',
  'gif',
  'apng',
  'tif',
  'mp4',
  'mpg',
  'avi',
  'webm',
  'mov',
  'mkv',
  'flv',
  'avi',
  'wmv',
];

const imageMaxFileSize = 10000000;
const animatedImageAndVideoMaxFileSize = 200000000;

class ImgurAnonymousUploader {
  constructor(clientId) {
    if (!clientId) {
      throw new Error('clientId is required');
    }

    this.clientId = clientId;
  }

  async getFileSize(filePathOrBuffer) {
    try {
      if (Buffer.isBuffer(filePathOrBuffer)) {
        return filePathOrBuffer.length;
      } else {
        const stats = fs.statSync(filePathOrBuffer);
        return stats['size'];
      }
    } catch (error) {
      console.log(`Error in getFileSize: ${error.message}`);
    }
  }

  async isValidFile(filePathOrBuffer) {
    const fileType = Buffer.isBuffer(filePathOrBuffer)
      ? await FileType.fromBuffer(filePathOrBuffer)
      : await FileType.fromFile(filePathOrBuffer);

    if (!fileType) {
      return false;
    }
    if (!validFileExtList.includes(fileType.ext)) {
      return false;
    }

    if (['jpg', 'png'].includes(fileType.ext)) {
      return (await this.getFileSize(filePathOrBuffer)) < imageMaxFileSize;
    } else {
      return (
        (await this.getFileSize(filePathOrBuffer)) <
        animatedImageAndVideoMaxFileSize
      );
    }
  }

  async __upload(obj) {
    try {
      const image = Buffer.isBuffer(obj) ? obj.toString('base64') : obj;

      const response = await fetch(URL, {
        method: 'POST',
        body: image,
        headers: {
          Authorization: `Client-ID ${this.clientId}`,
        },
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(`ERROR: ${error}`);
      return { success: false, message: error.message };
    }
  }

  async uploadBuffer(buffer) {
    try {
      if (!Buffer.isBuffer(buffer)) {
        return {
          success: false,
          message: 'Expected a buffer.',
        };
      }
      const isValidFile = await this.isValidFile(buffer);
      if (!isValidFile) {
        return {
          success: false,
          message: 'Not a valid file.',
        };
      }
      const json = await this.__upload(buffer);
      // console.log(JSON.stringify(json));
      return {
        success: json.success,
        status: json.status,
        url: json.data.link,
        deleteHash: json.data.deletehash,
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  async uploadFile(filePath) {
    return await this.upload(filePath);
  }

  async upload(filePath) {
    if (!filePath) {
      return { success: false, message: 'Not found filePath' };
    }

    const isValidFile = await this.isValidFile(filePath);
    if (!isValidFile) {
      return {
        success: false,
        message:
          "It's invalid file. A valid file can be found here: https://help.imgur.com/hc/en-us/articles/115000083326-What-files-can-I-upload-What-is-the-size-limit-",
      };
    }

    try {
      const image = fs.readFileSync(filePath, 'base64');

      const json = await this.__upload(image);

      return {
        success: json.success,
        status: json.status,
        url: json.data.link,
        deleteHash: json.data.deletehash,
      };
    } catch (error) {
      return { success: false, message: error.message, filePath };
    }
  }

  async delete(deleteHash) {
    if (!deleteHash) {
      return { success: false, message: 'Not found deleteHash' };
    }

    try {
      const response = await fetch(`${URL}/${deleteHash}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Client-ID ${this.clientId}`,
        },
      });

      const json = await response.json();

      return { success: json.success, status: json.status };
    } catch (error) {
      return { success: false, message: error.message, deleteHash };
    }
  }
}

module.exports = ImgurAnonymousUploader;
