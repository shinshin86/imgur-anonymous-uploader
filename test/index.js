const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const ImgurAnonymousUploader = require('../index');

describe('index.js', () => {
  const imgurClientId = process.env.IMGUR_CLIENT_ID;
  const imagePath = path.join(__dirname, '..', 'examples', 'testimg.png');
  const imageBase64String = fs.readFileSync(
    path.join(__dirname, '..', 'examples', 'testimg.base64'),
    'utf8'
  );
  const imageBase64 = Buffer.from(imageBase64String, 'base64');
  describe('initialize', () => {
    it('When not imgur client id', () => {
      expect(function () {
        new ImgurAnonymousUploader();
      }).to.throw('clientId is required');
    });

    it('When imgur clinet id entered', () => {
      const uploader = new ImgurAnonymousUploader(imgurClientId);
      expect(uploader).to.be.ok;
    });
  });

  describe('upload & delete (using upload() method)', () => {
    const uploader = new ImgurAnonymousUploader(imgurClientId);

    it('When no input file path was provided', async () => {
      const response = await uploader.upload();

      expect(response.success).to.be.false;
      expect(response.message).to.be.equal('Not found filePath');
    });

    it('When no deletehash was provided', async () => {
      const response = await uploader.delete();

      expect(response.success).to.be.false;
      expect(response.message).to.be.equal('Not found deleteHash');
    });

    it('When file path and deletehash are provided', async () => {
      const uploadResponse = await uploader.upload(imagePath);

      const deleteHash = uploadResponse.deleteHash;

      expect(uploadResponse.success).to.be.true;
      expect(uploadResponse.status).to.be.equal(200);
      expect(uploadResponse.url).to.be.ok;
      expect(uploadResponse.deleteHash).to.be.ok;

      const deleteResponse = await uploader.delete(deleteHash);

      expect(deleteResponse.success).to.be.true;
      expect(deleteResponse.status).to.be.equal(200);
    });
  });

  describe('upload & delete (using original uploadFile() method)', () => {
    const uploader = new ImgurAnonymousUploader(imgurClientId);

    it('When no input file path was provided', async () => {
      const response = await uploader.uploadFile();

      expect(response.success).to.be.false;
      expect(response.message).to.be.equal('Not found filePath');
    });

    it('When no deletehash was provided', async () => {
      const response = await uploader.delete();

      expect(response.success).to.be.false;
      expect(response.message).to.be.equal('Not found deleteHash');
    });

    it('When file path and deletehash are provided', async () => {
      const uploadResponse = await uploader.uploadFile(imagePath);

      const deleteHash = uploadResponse.deleteHash;

      expect(uploadResponse.success).to.be.true;
      expect(uploadResponse.status).to.be.equal(200);
      expect(uploadResponse.url).to.be.ok;
      expect(uploadResponse.deleteHash).to.be.ok;

      const deleteResponse = await uploader.delete(deleteHash);

      expect(deleteResponse.success).to.be.true;
      expect(deleteResponse.status).to.be.equal(200);
    });
  });
  describe('upload and delete of a buffer (using uploadBuffer() method)', () => {
    const uploader = new ImgurAnonymousUploader(imgurClientId);

    it('When no input buffer was provided', async () => {
      const response = await uploader.uploadBuffer('notabuffer');

      expect(response.success).to.be.false;
      expect(response.message).to.be.equal('Expected a buffer.');
    });

    it('When buffer has been provided', async () => {
      const uploadResponse = await uploader.uploadBuffer(imageBase64);

      const deleteHash = uploadResponse.deleteHash;

      expect(uploadResponse.success).to.be.true;
      expect(uploadResponse.status).to.be.equal(200);
      expect(uploadResponse.url).to.be.ok;
      expect(uploadResponse.deleteHash).to.be.ok;

      const deleteResponse = await uploader.delete(deleteHash);

      expect(deleteResponse.success).to.be.true;
      expect(deleteResponse.status).to.be.equal(200);
    });
  });
  describe('isValidFile', () => {
    const uploader = new ImgurAnonymousUploader(imgurClientId);

    it('Invalid file(txt)', async () => {
      const result = await uploader.isValidFile('./test-images/testimg.txt');
      expect(result).to.be.false;
    });

    it('Valid file(jpeg)', async () => {
      const result = await uploader.isValidFile('./test-images/testimg.jpeg');
      expect(result).to.be.true;
    });

    it('Valid file(jpg)', async () => {
      const result = await uploader.isValidFile('./test-images/testimg.jpg');
      expect(result).to.be.true;
    });

    it('Valid file(png)', async () => {
      const result = await uploader.isValidFile('./test-images/testimg.png');
      expect(result).to.be.true;
    });

    it('Valid file(gif)', async () => {
      const result = await uploader.isValidFile('./test-images/testimg.gif');
      expect(result).to.be.true;
    });

    it('Valid file(tif)', async () => {
      const result = await uploader.isValidFile('./test-images/testimg.tif');
      expect(result).to.be.true;
    });

    it('Valid file(mov)', async () => {
      const result = await uploader.isValidFile('./test-images/testimg.mov');
      expect(result).to.be.true;
    });
    it('Valid file(base64)', async () => {
      const result = await uploader.isValidFile(imageBase64);
      expect(result).to.be.true;
    });
  });
});
