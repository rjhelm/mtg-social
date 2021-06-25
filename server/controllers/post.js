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

