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

  getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return stats['size'];
  }

  async isValidFile(filePath) {
    const fileType = await FileType.fromFile(filePath);

    if (!fileType) return false;

    if (!validFileExtList.includes(fileType.ext)) {
      return false;
    }

    if (['jpg', 'png'].includes(fileType.ext)) {
      return this.getFileSize(filePath) < imageMaxFileSize;
    } else {
      return this.getFileSize(filePath) < animatedImageAndVideoMaxFileSize;
    }
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

      const response = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(image),
        headers: {
          Authorization: `Client-ID ${this.clientId}`,
        },
      });

      const json = await response.json();

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
