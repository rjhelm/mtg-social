const Section = require('../models/section');
const User = require('../models/user');
const Post = require('../models/post');

const paginateResults = require('../utils/paginateResults');

const getSections = async (_req, res) => {
    const allSections = await Section.find({}).select('id sectionName');
    res.status(200).json(allSections);
}

const getSectionPosts = async (req, res) => {
    const { sectionName } = req.params;
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const sortBy = req.query.sortby;
    
    let sortQuery;
    switch(sortBy) {
        case 'new':
            sortQuery = { createdAt: -1 };
            break;
        case 'top':
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
            sortQuery = {};
    }
    const section = await Section.findOne({
        sectionName: { $regex: new RegExp('^' + sectionName + '$', 'i') },
    }).populate('admin', 'username');

    if (!section) {
        return res.status(404).send({ message: `Section '${sectionName}' does not exist on server` });
    }
    const postsCount = await Post.find({
        section: section.id,
    }).countDocuments();

    const paginated = paginateResults(page, limit, postsCount);
    const sectionPosts = await Post.find({ section: section.id })
        .sort(sortQuery)
        .select('-comments')
        .limit(limit)
        .skip(paginated.startIndex)
        .populate('author', 'username')
        .populate('section', 'sectionName');

        const paginatedPosts = {
            previous: paginated.results.previous,
            results: sectionPosts,
            next: paginated.results.next,
        };

        res.status(200).json({ secDetails: section, posts: paginatedPosts });
};

