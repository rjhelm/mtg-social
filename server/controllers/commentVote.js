const User = require('../models/user');
const Post = require('../models/post');

const upvoteComment = async (req, res) => {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
    const user = await User.findById(req.user);

    if (!post) {
        return res.status(404).send({ message: `Post with ID: ${id} does not exist in database.`, });
    }
    if (!user) {
        return res.status(404).send({ message: 'User does not exist in database.' });
    }

    const targetComment = post.comments.find(
        (c) => c._id.toString() === commentId
    );

    if (!targetComment) {
        return res.status(404).send({ message: `Comment with ID: '${commentId}'  does not exist in database.`, });
    }

    const commentAuthor = await User.findById(targetComment.commentedBy);
    if (!commentAuthor) {
        return res.status(404).send({ message: 'Comment author does not exist in database.' });
    }

    if (targetComment.upvotedBy.includes(user._id.toString())) {
        targetComment.upvotedBy = targetComment.upvotedBy.filter(
            (u) => u.toString() !== user._id.toString()
        );
        commentAuthor.karmaPoints.commentKarma++;
    } else {
        targetComment.upvotedBy = targetComment.upvotedBy.concat(user._id);
        targetComment.downvotedBy = targetComment.downvotedBy.filter(
            (d) => d.toString() !== user._id.toString()
        );
        commentAuthor.karmaPoints.commentKarma++;
    }

    targetComment.pointsCount = targetComment.upvotedBy.length - targetComment.downvotedBy.length;
    post.comments = post.comments.map((c) => 
        c._id.toString() !== commentId ? c : targetComment
    );

    await post.save();
    await commentAuthor.save();
    res.status(200).end();

}

