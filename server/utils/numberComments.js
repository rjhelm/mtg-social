const numberComments = (commentsArray) => {
    const numberReplies = commentsArray
    .map((c) => c.replies.length)
    .reduce((sum, c) => sum + c, 0);
    return commentsArray.length + numberReplies;
};

module.exports = numberComments;