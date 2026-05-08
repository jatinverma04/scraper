import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookmarks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/stories/bookmarks');
      setBookmarks(data.bookmarks);
      setBookmarkedIds(data.bookmarks.map((b) => b._id));
    } catch {
      setError('Failed to load bookmarks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  const handleBookmarkToggle = (storyId) => {
    setBookmarkedIds((prev) =>
      prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]
    );
    setBookmarks((prev) => prev.filter((b) => b._id !== storyId));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your saved stories</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-5 h-3 bg-gray-100 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium text-sm">No bookmarks yet</p>
          <p className="text-gray-400 text-xs mt-1">
            Go to{' '}
            <a href="/" className="text-amber-600 hover:underline">
              Stories
            </a>{' '}
            and bookmark your favourites.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((story, i) => (
            <StoryCard
              key={story._id}
              story={story}
              index={i}
              bookmarkedIds={bookmarkedIds}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
