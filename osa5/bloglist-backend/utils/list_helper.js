const _ = require("lodash");

const dummy = (_blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, item) => sum + item.likes, 0);

const favoriteBlog = (blogs) =>
  blogs.reduce(
    (fav, current) => (fav.likes > current.likes ? fav : current),
    {}
  );

const mostBlogs = (blogs) => {
  const blogCounts = Object.entries(_.countBy(blogs, (blog) => blog.author));
  const author = _.maxBy(blogCounts, ([, value]) => value)[0];
  return { author, blogs: blogCounts[author] };
};

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, (blog) => blog.author);

  const likesPerAuthor = _.map(groupedByAuthor, (posts, author) => ({
    author,
    likes: _.sumBy(posts, (post) => post.likes),
  }));

  return _.maxBy(likesPerAuthor, (author) => author.likes);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
