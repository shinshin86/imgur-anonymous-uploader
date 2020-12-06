const ImgurAnonymousUploader = require('../index');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    const imageBase64String = fs.readFileSync(path.join(__dirname, 'testimg.base64'), 'utf8');
    const imageBase64 = Buffer.from(imageBase64String, 'base64');

    const uploader = new ImgurAnonymousUploader(process.env.IMGUR_CLIENT_ID);
    const response = await uploader.uploadBuffer(imageBase64);

    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
