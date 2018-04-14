const chai = require('chai');
const chaiHttp = require('chai-http');

const code = require('../api/utils/statusCodes');
const Post = require('../api/models/post');
const Comment = require('../api/models/comment');
const server = require('../server');
const initTestSetup = require('./testSetup');

initTestSetup();

chai.use(chaiHttp);
const expect = chai.expect;

describe('ROUTES', () => {
  describe('POST /posts', () => {
    it('should create a post', async () => {
      const oldCount = await Post.count();

      const body = {
        title: 'My first blog post',
        text: "Don't mind me, I'm just a test"
      };

      const route = '/posts';

      const res = await chai
        .request(server)
        .post(route)
        .send(body);

      const newCount = await Post.count();

      expect(res).to.have.status(code.CREATED);
      expect(newCount).to.equal(oldCount + 1);
      expect(res.body).to.include(body);
    });

    it('should return an error if the post is invalid', async () => {
      const oldCount = await Post.count();

      const body = {
        title: '',
        text: "Don't mind me, I'm just a test"
      };

      const route = '/posts';

      const res = await chai
        .request(server)
        .post(route)
        .send(body);

      const newCount = await Post.count();

      expect(res).to.have.status(code.USER_ERROR);
      expect(newCount).to.equal(oldCount);
      expect(res.body.error).to.equal(
        'You must include both a title and text.'
      );
    });
  });
});
