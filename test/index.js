const path = require('path');
const { expect } = require('chai');
const ImgurAnonymousUploader = require('../index');

describe('index.js', () => {
  const imgurClientId = process.env.IMGUR_CLIENT_ID;
  const imagePath = path.join(__dirname, '..', 'examples', 'testimg.png');

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

  describe('upload & delete', () => {
    const uploader = new ImgurAnonymousUploader(imgurClientId);

    it('When not input file path', async () => {
      const response = await uploader.upload();

      expect(response.success).to.be.false;
      expect(response.message).to.be.equal('Not found filePath');
    });

    it('When not input deletehash', async () => {
      const response = await uploader.delete();

      expect(response.success).to.be.false;
      expect(response.message).to.be.equal('Not found deleteHash');
    });

    it('When file path and deletehash entered', async () => {
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

  describe('isValidFile', () => {
    const uploader = new ImgurAnonymousUploader(imgurClientId);

    it.only('Valid file(jpeg)', () => {
      const result = uploader.isValidFile('foo');
      console.log({ result });
    });
  });
});
