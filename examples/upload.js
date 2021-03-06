const ImgurAnonymousUploader = require('../index');
const path = require('path');

(async () => {
  try {
    const imagePath = path.join(__dirname, 'testimg.png');

    const uploader = new ImgurAnonymousUploader(process.env.IMGUR_CLIENT_ID);
    const response = await uploader.upload(imagePath);

    /**
     * or use uploadFile() method (which just calls upload()).
     * This was added for method name consistency.
     */
    // const response = await uploader.uploadFile(imagePath);

    console.log(response);
  } catch (error) {
    console.error(error);
  }
})();
