const chai = require('chai');
const chaiHttp = require('chai-http');

const code = require('../api/utils/statusCodes');
const Post = require('../api/models/post');
const Comment = require('../api/models/comment');
const server = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('ROUTES', () => {
  describe('GET /posts/:id', () => {
    it('should return the post for the given id', async () => {
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

      const route = `/posts/${postOne._id}`;

      const res = await chai.request(server).get(route);

      expect(res).to.have.status(code.OK);
      expect(res.body).to.be.a('object');
      expect(res.body).to.include(sampleRes);
    });

    it('should return an error when given an invalid id', async () => {
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

      const route = '/posts/i-am-invalid';

      const res = await chai.request(server).get(route);

      expect(res).to.have.status(code.USER_ERROR);
      expect(res.body).to.be.a('object');
      expect(res.body.error).to.equal(
        'ID is invalid. Please search for another blog post'
      );
    });
  });
});
