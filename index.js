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

class ImgurAnonymousUploader {
  constructor(clientId) {
    if (!clientId) {
      throw new Error('clientId is required');
    }

    this.clientId = clientId;
  }

  async isValidFile(filePath) {
    const { ext } = await FileType.fromFile(filePath);
    return validFileExtList.includes(ext);
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
