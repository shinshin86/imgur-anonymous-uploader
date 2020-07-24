const ImgurAnonymousUploader = require('../index');
const path = require('path');

(async () => {
  try {
    const uploader = new ImgurAnonymousUploader(process.env.IMGUR_CLIENT_ID);
    const response = await uploader.delete('delete hash is here');

    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
