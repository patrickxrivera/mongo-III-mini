const chai = require('chai');
const chaiHttp = require('chai-http');

const code = require('../api/utils/statusCodes');
const Post = require('../api/models/post');
const Comment = require('../api/models/comment');
const server = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('ROUTES', () => {
  describe('POST /posts/:id/comments', () => {
    it('should create a new comment', async () => {
      const sampleRes = { text: "I'm a troll mwahahaha" };

      const postOne = new Post({
        title: 'JS is awesome',
        text: 'I know right'
      });
      const postTwo = new Post({
        title: 'I love coding',
        text: "Ya. It's hard as shit but rewarding."
      });

      const comment = new Comment(sampleRes);
      comment._parent = postOne;

      await Promise.all([postOne.save(), postTwo.save()]);

      const route = `/posts/${postTwo._id}/comments`;

      const res = await chai
        .request(server)
        .post(route)
        .send(comment);

      expect(res).to.have.status(code.CREATED);
      expect(res.body).to.be.a('object');
      expect(res.body.text).to.be.a('string');
      expect(res.body._parent.title).to.equal(postOne.title);
    });

    it('should return an error if the comment is invalid', async () => {
      const postOne = new Post({
        title: 'JS is awesome',
        text: 'I know right'
      });
      const postTwo = new Post({
        title: 'I love coding',
        text: "Ya. It's hard as shit but rewarding."
      });

      const comment = new Comment({ text: '' });
      comment._parent = postOne;

      await Promise.all([postOne.save(), postTwo.save()]);

      const route = `/posts/${postTwo._id}/comments`;

      const res = await chai
        .request(server)
        .post(route)
        .send(comment);

      expect(res).to.have.status(code.USER_ERROR);
      expect(res.body).to.be.a('object');
      expect(res.body.error).to.equal(
        'Sorry, you can\'t leave a blank comment.'
      );
    });
  });
});
