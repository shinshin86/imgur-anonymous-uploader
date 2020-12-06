# imgur-anonymous-uploader

[![npm version](https://badge.fury.io/js/imgur-anonymous-uploader.svg)](https://badge.fury.io/js/imgur-anonymous-uploader)

Imgur anonymous image uploder. This is Simple and Easy.

## Install

```bash
npm install imgur-anonymous-uploader
# or
yarn add imgur-anonymous-uploader
```

## Usage

```js
const ImgurAnonymousUploader = require('imgur-anonymous-uploader');

(async () => {
  try {
    const uploader = new ImgurAnonymousUploader('Your imgur client id');
    const uploadResponse = await uploader.upload('upload file path');
    console.log(uploadResponse);
    /*
      {
        success: true,
        status: 200,
        url: 'uploaded imgur url',
        deleteHash: 'delete hash'
      }
    */

    const deleteResponse = await uploader.delete('delete hash is here');
    console.log(deleteResponse);
    // { success: true, status: 200 }
  } catch (error) {
    console.error(error);
  }
})();
```

## Examples

### Test image upload

`./examples/testimg.png` will be uploaded.

If you want to upload your file, please modify the source code.

```bash
IMGUR_CLIENT_ID={your imgur client id} node examples/upload.js
```

### Test image buffer upload

**If you want to upload an image buffer, see the example here.**

`./examples/testimg.base64` will be uploaded.

If you want to upload your file, please modify the source code.

```bash
IMGUR_CLIENT_ID={your imgur client id} node examples/upload-buffer.js
```

### Delete uploaded image

Add `deletehash` to the source code before running it.

```bash
IMGUR_CLIENT_ID={your imgur client id} node examples/delete.js
```

## Test

Use imgur client id.

```bash
IMGUR_CLIENT_ID={Your imgur client id} npm run test
```



## Supported Files

### Supported file extensions

- [x] JPEG
- [x] PNG
- [x] GIF
- [x] APNG
- [x] TIFF
- [x] MP4
- [x] MPEG
- [x] AVI
- [x] WEBM
- [x] quicktime
- [x] x-matroska
- [x] x-flv
- [x] x-msvideo
- [x] x-ms-wmv

### The maximum file size

* The maximum file size for non-animated images is 10MB
* The maximum file size for animated images (like GIFs) and video is 200MB.

### Reference(imgur - help)

[What files can I upload? What is the size limit? - imgur help](https://help.imgur.com/hc/en-us/articles/115000083326-What-files-can-I-upload-What-is-the-size-limit-)

[Imgur API - POST Image Upload](https://apidocs.imgur.com/#c85c9dfc-7487-4de2-9ecd-66f727cf3139)