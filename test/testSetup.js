const mongoose = require('mongoose');

const initTestSetup = () => {
  mongoose.connect('mongodb://localhost/post-db_test', {
    useMongoClient: true
  });
  mongoose.connection.on('error', err => console.warn(`Warning: ${err}`));

  beforeEach((done) => {
    const { posts, comments } = mongoose.connection.collections;

    posts.drop(() => {
      comments.drop(() => {
        done();
      });
    });
  });
};

module.exports = initTestSetup;
