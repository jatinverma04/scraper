const Story = require('../models/Story');
const User = require('../models/User');

const getAllStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Story.countDocuments();
    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      stories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const user = await User.findById(req.user._id);
    const isBookmarked = user.bookmarks.some(
      (id) => id.toString() === story._id.toString()
    );

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== story._id.toString()
      );
    } else {
      user.bookmarks.push(story._id);
    }

    await user.save();

    res.json({
      bookmarked: !isBookmarked,
      message: isBookmarked ? 'Bookmark removed' : 'Story bookmarked',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getAllStories, getStoryById, toggleBookmark, getBookmarks };
