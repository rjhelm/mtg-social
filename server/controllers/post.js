const Post = require('../models/post');
const Section = require('../models/section');
const User = require('../models/user');
const postTypeValidator = require('../utils/postTypeValidator');
const { cloudinary, UPLOAD_PRESET } = require('../utils/config');
const paginateResults = require('../utils/paginateResults');
const { search } = require('../routes/auth');

const getPosts = async (req, res) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const sortBy = req.query.sortby;

    let sortQuery;
    switch (sortBy) {
        case 'new':
            sortQuery = { createdAt: -1 };
            break;
        case 'most discussed':
            sortQuery = { pointsCount: -1 };
            break;
        case 'best':
            sortQuery = { voteRatio: -1 };
            break;
        case 'hot':
            sortQuery = { hotAlgo: -1 };
            break;
        case 'old':
            sortQuery = { createdAt: 1 };
            break;
            default:
                sortQuery ={}; 
    }
    const postCount = await Post.countDocuments();
    const paginated = paginateResults(page, limit, postsCount);
    const allPosts = await Post.find({})
        .sort(sortQuery)
        .select('-comments')
        .limit(limit)
        .skip(paginated.startIndex)
        .populate('author', 'username')
        .populate('section', 'sectionName');

        const paginatedPosts = {
            previous: paginated.results.previous,
            results: allPosts,
            next: paginated.results.next,
        };
        res.status(200).json(paginatedPosts);
};

const getSubscribedPosts = async (req, res) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const user = await User.findById(req.user);
    if (!user) {
        return res.status(400).send({ message: 'User does not exist in database' });
    }
    const subscribedSec = await Section.find({
        _id: { $in: user.subscribedSec },
    });

    const postsCount = subscribedSec
    .map((s) => s.posts.length)
    .reduce((sum, s) => s + sum, 0);

    const paginated = paginatedResults(page, limit, postsCount);
    const subscibedPosts = await Post.find({
        section: { $in: user.subscibedSec}
    })
    .sort({ hotAlgo: -1 })
    .select('-comments')
    .limit(limit)
    .skip(paginated.startIndex)
    .populate('author', 'username')
    .populate('section', 'sectionName');

    const paginatedPosts = {
        previous: paginated.results.previous,
        results: subscribedPosts,
        next: paginated.results.next,
    };
    res.status(200).json(paginatedPosts);
};

const getSearchedPosts = async (req, res) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const query = req.query.query;

    const findQuery = {
        $or: [
            {
                title: {
                    $regex: query,
                    $options: 'i',
                },
            },
            {
                textSubmission: {
                    $regex: query,
                    $options: 'i',
                },
            },
        ],
    };
    const postsCount = await Post.find(findQuery).countDocuments();
    const paginated = paginatedResults(page, limit, postsCount);
    const searchedPosts = await Post.find(findQuery)
        .sort({ hotAlgo: -1 })
        .select('-comments')
        .limit(limit)
        .skip(paginated.startIndex)
        .populate('author', 'username')
        .populate('section', 'sectionName');

        const paginatedPosts = {
            previous: paginated.results.previous,
            results: searchedPosts,
            next: paginated.results.next,
        };
        res.status(200).json(paginatedPosts);
};

const getPostAndComments = async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
        return res.status(404).send({ message: `Post with ID: '${id}' does not exist in database` });
    }

    const populatedPost = await post
        .populate('author', 'username')
        .populate('section', 'sectionName')
        .populate('comments.commentedBy', 'username')
        .populate('comments.replies.repliedBy', 'username')
        .execPopulate();
        res.status(200).json(populatedPost);
};

const createNewPost = async (req, res) => {
    const {
        title,
        section,
        postType,
        textSubmission,
        linkSubmission,
        imageSubmission,
    } = req.body;

    const validatedFields = postTypeValidator(
        postType,
        textSubmission,
        linkSubmission,
        imageSubmission,
    );
    const author = await User.findById(req.user);
    const targetSection = await Section.findById(section);

    if (!author) {
        return res.status(404).send({ message: 'User does not exist in database '});
    }
    if (!targetSection) {
        return res.status(404).send({ message: `Section with ID: '${section}' does not exist in database` });
    }
    const newPost = new Post({
        title,
        section,
        author: author._id,
        upvotedBy: [author._id],
        pointsCount: 1,
        ...validatedFields
    });
    if (postType === 'Image') {
        const uploadedImage = await cloudinary.uploader.upload(
            imageSubmission,
            {
                upload_preset: UPLOAD_PRESET,
            },
            (error) => {
                if (error) return res.status(401).send({ message: error.message });
            }
        );
        newPost.imageSubmission = {
            imageLink: uploadedImage.url,
            imageId: uploadedImage.public_id,
        };
    }
    const savedPost = await newPost.save();

    targetSection.posts = targetSection.posts.concat(savedPost._id);
    await targetSection.save();
    author.posts = author.posts.concat(savedPost._id);
    author.karmaPoints.postKarma++;
    await author.save();

    const populatedPost = await savedPost
        .populate('author', 'username')
        .populate('section', 'sectionName')
        .execPopulate();
        res.status(201).json(populatedPost);
};

