# imgur-anonymous-uploader

Imgur anonymous image uploder. This is Simple and Easy.

## Install

I have yet to publish to npm.

```bash
npm install shinshin86/imgur-anonymous-uploader
# or
yarn add shinshin86/imgur-anonymous-uploader
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
