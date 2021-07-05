const { UserInputError } = require('apollo-server');
const Post = require('../../models/post');
const errorHandler = require('../../utils/errorHandler');

module.exports = {
  Query: {
    getAllTags: async () => {
      try {
        const tagsFromPost = await Post.find({}).select('tags');
        const tagsArray = tagsFromPost.map((t) => t.tags).flat();

        let result = [];
        tagsArray.forEach((tag) => {
          const found = result.find((r) => r.tagName === tag);

          if (!found) {
            result.push({ tagName: tag, count: 1 });
          } else {
            result[result.indexOf(found)].count++;
          }
        });

        return result.sort((a, b) => b.count - a.count);
      } catch (err) {
        throw new UserInputError(errorHandler(err));
      }
    },
  },
};
