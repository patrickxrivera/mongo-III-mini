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
      const sampleRes = {
        title: 'JS is awesome',
        text: 'I know right'
      };

      const postOne = new Post(sampleRes);
      const postTwo = new Post({
        title: 'I love coding',
        text: "Ya. It's hard as shit but rewarding."
      });

      await Promise.all([postOne.save(), postTwo.save()]);

      const route = '/posts';

      const res = await chai.request(server).get(route);

      expect(res).to.have.status(code.OK);
      expect(res.body).to.be.a('array');
      expect(res.body.length).to.equal(2);
      expect(res.body[0]).to.have.property('title');
      expect(res.body[0]).to.have.property('text');
    });
  });
});
