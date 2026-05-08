import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 10 });

  const fetchStories = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/stories?page=${page}&limit=10`);
      setStories(data.stories);
      setPagination(data.pagination);
    } catch {
      setError('Failed to load stories. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/stories/bookmarks');
      setBookmarkedIds(data.bookmarks.map((b) => b._id));
    } catch {
      // Silently fail
    }
  }, [user]);

  useEffect(() => { fetchStories(1); }, [fetchStories]);
  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await api.post('/scrape');
      await fetchStories(1);
    } catch {
      setError('Scrape failed. Try again.');
    } finally {
      setScraping(false);
    }
  };

  const handleBookmarkToggle = (storyId) => {
    setBookmarkedIds((prev) =>
      prev.includes(storyId) ? prev.filter((id) => id !== storyId) : [...prev, storyId]
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Top Stories</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            From Hacker News · {pagination.total} total
          </p>
        </div>
        <button
          onClick={handleScrape}
          disabled={scraping}
          id="scrape-btn"
          className="btn-primary flex items-center gap-2"
        >
          {scraping ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Scraping…
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {!user && (
        <div className="mb-5 px-4 py-3 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
          </svg>
          Sign in to bookmark stories and build your reading list.
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
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
      ) : stories.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm">No stories yet. Click Refresh to scrape HN.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stories.map((story, i) => (
            <StoryCard
              key={story._id}
              story={story}
              index={(pagination.page - 1) * pagination.limit + i}
              bookmarkedIds={bookmarkedIds}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}

      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => fetchStories(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => fetchStories(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
