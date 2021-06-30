const paginateResults = (page, limit, docCount) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};

  if (endIndex < docCount) {
    results.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit,
    };
  }

  return {
    startIndex,
    endIndex,
    results,
  };
};

const upvoteIt = (postReply, user) => {
  if (postReply.upvotedBy.includes(user._id.toString())) {
    postReply.upvotedBy = postReply.upvotedBy.filter(
      (u) => u.toString() !== user._id.toString()
    );
  } else {
    postReply.upvotedBy.push(user._id);
    postReply.downvotedBy = postReply.downvotedBy.filter(
      (d) => d.toString() !== user._id.toString()
    );
  }

  postReply.points = postReply.upvotedBy.length - postReply.downvotedBy.length;
  return postReply;
};

const downvoteIt = (postReply, user) => {
  if (postReply.downvotedBy.includes(user._id.toString())) {
    postReply.downvotedBy = postReply.downvotedBy.filter(
      (d) => d.toString() !== user._id.toString()
    );
  } else {
    postReply.downvotedBy.push(user._id);
    postReply.upvotedBy = postReply.upvotedBy.filter(
      (u) => u.toString() !== user._id.toString()
    );
  }

  postReply.points = postReply.upvotedBy.length - postReply.downvotedBy.length;
  return postReply;
};

const postRep = (post, author) => {
  const calculatedRep =
    post.upvotedBy.length * 10 - post.downvotedBy.length * 2;

  author.posts = author.posts.map((q) =>
    q.postId.equals(post._id) ? { postId: q.postId, rep: calculatedRep } : q
  );

  return author;
};

const replyRep = (reply, author) => {
  const calculatedRep =
    reply.upvotedBy.length * 10 - reply.downvotedBy.length * 2;

  author.replies = author.replies.map((a) =>
    a.replyId.equals(reply._id) ? { replyId: a.replyId, rep: calculatedRep } : a
  );

  return author;
};

module.exports = { paginateResults, upvoteIt, downvoteIt, postRep, replyRep };
