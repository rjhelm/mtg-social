const express = require('express');
const { auth } = require('../utils/middleware');
const {
    getSections,
    getSectionPosts,
    getTopSections,
    createNewSection,
    editDescription,
    subscribeToSection,
} = require('../controllers/section');

const router = express.Router();

router.get('/', getSections);
router.get('/r/:subredditName', getSectionPosts);
router.get('/top10', getTopSections);
router.post('/', auth, createNewSection);
router.patch('/:id', auth, editDescription);
router.post('/:id/subscribe', auth, subscribeToSection);

module.exports = router;