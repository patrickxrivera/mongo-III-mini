const mongoose = require('mongoose');
const R = require('ramda');

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

const listPosts = async (req, res) => {
  const [err, posts] = await to(Post.find({}));

  if (!err) {
    res.send(posts);
    return;
  }

  res.status(code.SERVER_ERROR).send({
    error:
      'There was an error when retrieving posts from the database. Please try again'
  });
};

const findPost = async ({ params }, res) => {
  const post = await Post.findById(params.id);

  if (post) {
    res.send(post);
    return;
  }

  res
    .status(code.USER_ERROR)
    .send({ error: 'ID is invalid. Please search for another blog post' });
};

const addComment = async (req, res) => {
  const [err, comment] = await to(Comment.create(req.body));

  if (err) {
    res
      .status(code.USER_ERROR)
      .send({ error: "Sorry, you can't leave a blank comment." });
    return;
  }

  const result = await Comment.findById(comment._id).populate('_parent');

  // Add comment to parent
  const postId = result._parent._id;
  const post = await Post.findById(postId);
  post.comments = [...post.comments, comment];

  await post.save();

  res.status(code.CREATED).send(result);
};

// In this function, we need to delete the comment document
// We also need to delete the comment's parent post's reference
// to the comment we just deleted
const removeComment = R.curry(({ _id }, c) => !_id.equals(c));

const deleteComment = async ({ params: { commentId, id } }, res) => {
  const comment = await Comment.findByIdAndRemove(commentId);

  const post = await Post.findById(id);
  post.comments = R.filter(removeComment(comment), post.comments);

  await post.save();

  res.status(code.ACCEPTED).send({ success: true });
};

// Similarly, in this function we need to delete the post document,
// along with any comments that are the children of this post
// We don't want any orphaned children in our database
const purgeComment = (commentId) => Comment.remove({ _id: commentId });

const deletePost = async ({ params: { id } }, res) => {
  const post = await Post.findById(id);

  await Promise.all(R.map(purgeComment, post.comments));
  const test = await Comment.find({});

  await Post.remove({ _id: id });

  res.status(code.ACCEPTED).send({ success: true });
};

module.exports = {
  createPost,
  listPosts,
  findPost,
  addComment,
  deleteComment,
  deletePost
};
