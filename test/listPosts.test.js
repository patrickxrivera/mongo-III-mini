const chai = require('chai');
const chaiHttp = require('chai-http');

const code = require('../api/utils/statusCodes');
const Post = require('../api/models/post');
const Comment = require('../api/models/comment');
const server = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('ROUTES', () => {
  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const route = '/posts';

      const res = await chai.request(server).get(route);

      expect(res).to.have.status(code.CREATED);
      expect(res.body).to.be.a('array');
    });
  });
});
