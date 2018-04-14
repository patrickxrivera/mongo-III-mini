const mongoose = require('mongoose');

const to = require('../utils/to');
const code = require('../utils/statusCodes');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

/* Fill in each of the below controller methods */
const createPost = async (req, res) => {
  const [err, newPost] = await to(Post.create(req.body));

  if (!err) {
    res.status(code.CREATED).send(newPost);
    return;
  }

  res
    .status(code.USER_ERROR)
    .send({ error: 'You must include both a title and text.' });
};

const listPosts = (req, res) => {
  res.send({ hi: 'there' });
};

const findPost = (req, res) => {};

const addComment = (req, res) => {};

// In this function, we need to delete the comment document
// We also need to delete the comment's parent post's reference
// to the comment we just deleted
const deleteComment = (req, res) => {};

// Similarly, in this function we need to delete the post document,
// along with any comments that are the children of this post
// We don't want any orphaned children in our database
const deletePost = (req, res) => {};

module.exports = {
  createPost,
  listPosts,
  findPost,
  addComment,
  deleteComment,
  deletePost
};
