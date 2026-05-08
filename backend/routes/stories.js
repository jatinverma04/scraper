const express = require('express');
const router = express.Router();
const {
  getAllStories,
  getStoryById,
  toggleBookmark,
  getBookmarks,
} = require('../controllers/storyController');
const { protect } = require('../middleware/auth');

router.get('/', getAllStories);
router.get('/bookmarks', protect, getBookmarks);
router.get('/:id', getStoryById);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
