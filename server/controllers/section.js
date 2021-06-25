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

const getTopSections = async (_req, res) => {
    const topSections = await Section.find({})
        .sort({ subsciberCount: -1 })
        .limit(15)
        .select('-description -posts -admin');

        res.status(200).json(topSections);
}

const createNewSection = async (req, res) => {
    const { sectionName, description } = req.body;

    const admin = await User.findById(req.user);
    if (!admin) {
        return res.status(404).send({ message: 'User does not exist in database' });
    }
    const existingSection = await Section.findOne({
        sectionName: { $regex: new RegExp('^' + sectionName + '$', 'i') },
    });
    if (existingSection) {
        return res.status(403).send({ message: `Section exists with the name '${sectionName}'. Try another` });
    }
    const newSection = new Section({
        sectionName,
        description,
        admin: admin._id,
        subsciberCount: 1,
    });
    const savedSection = await newSection.save();
    admin.subscribedSec = admin.subscribedSec.concat(savedSection._id);
    await admin.save();

    res.status(200).json(savedSection);
};

const editDescription = async (req, res) => {
    const { description } = req.body;
    const { id } = req.params;

    if (!description) {
        return res.status(400).send({ message: 'Description body cant be empty' });
    }

    const admin = await User.findById(req.user);
    const section = await Section.findById(id);

    if (!admin) {
        return res.status(404).send({ message: 'User does not exist in database.' });
    }
    if (!section) {
        return res.status(404).send({ message: `Section with ID: ${id} does not exist in database.`, });
    }

    if (section.admin.toString() !== admin._id.toString()) {
        return res.status(401).send({ message: 'Access is denied.' });
    }

    section.description = description;
    await section.save();
    res.status(200).end();
};

const subscribeToSection = async (req, res) => {
    const { id } = req.params;

    const section = await Section.findById(id);
    const user = await User.findById(req.user);

    if (section.subscibedBy.includes(user.id.toString())) {
        section.subscibedBy = section.subscibedBy.filter(
            (s) => s.toString() !== section._id.toString()
        );
    } else {
        section.subscibedBy = section.subscibedBy.concat(user._id);
        user.subscribedSec = user.subscribedSec.concat(section._id);
    }
    section.subscriberCount = section.subscibedBy.length;
    await section.save();
    await user.save();
    res.status(200).end();
}

module.exports = {
    getSections,
    getSectionPosts,
    getTopSections,
    createNewSection,
    editDescription,
    subscribeToSection,
};