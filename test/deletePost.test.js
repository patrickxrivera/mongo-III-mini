const chai = require('chai');
const chaiHttp = require('chai-http');

const code = require('../api/utils/statusCodes');
const Post = require('../api/models/post');
const Comment = require('../api/models/comment');
const server = require('../server');

chai.use(chaiHttp);
const expect = chai.expect;

describe('ROUTES', () => {
  describe('DELETE /posts/:id/comments/:commentId', () => {
    it('should delete the comment with the given ID and the associated post', async () => {
      const postOne = new Post({ title: 'Ayo wassssup', text: 'This is fun.' });
      let postTwo = new Post({
        title: 'I love coding',
        text: "Ya. It's hard as shit but rewarding."
      });

      const commentOne = new Comment({ text: 'Hey there buddy' });
      const commentTwo = new Comment({ text: 'How you doing' });

      commentOne._parent = postTwo;
      commentTwo._parent = postTwo;

      await Promise.all([postOne.save(), postTwo.save()]);

      const commentRoute = `/posts/${postTwo._id}/comments`;
      const route = `/posts/${postTwo._id}/comments/${commentTwo._id}`;

      // post commentOne
      await chai
        .request(server)
        .post(commentRoute)
        .send(commentOne);

      // post commentTwo
      await chai
        .request(server)
        .post(commentRoute)
        .send(commentTwo);

      const res = await chai.request(server).delete(route);

      postTwo = await Post.findById(postTwo._id);

      const deletedComment = await Comment.findById(commentTwo._id);

      expect(res).to.have.status(code.ACCEPTED);
      expect(res.body).to.be.a('object');
      expect(deletedComment).to.be.null;
      expect(postTwo.comments.indexOf(commentTwo._id)).to.equal(-1);
      expect(res.body.success).to.be.true;
    });
  });
});
