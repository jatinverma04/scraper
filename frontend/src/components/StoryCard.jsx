import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StoryCard = ({ story, index, bookmarkedIds, onBookmarkToggle }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isBookmarked = bookmarkedIds.includes(story._id);

  const handleBookmark = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await api.post(`/stories/${story._id}/bookmark`);
      onBookmarkToggle(story._id);
    } catch (err) {
      console.error('Bookmark error:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const domain = story.url
    ? (() => {
        try {
          return new URL(story.url).hostname.replace('www.', '');
        } catch {
          return null;
        }
      })()
    : null;

  return (
    <article
      className="card p-5 hover:-translate-y-0.5 transition-transform duration-200 animate-slide-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start gap-4">
        <span className="text-xs font-mono text-gray-300 pt-0.5 w-5 shrink-0 text-right">
          {index + 1}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <a
                href={story.url || `https://news.ycombinator.com/item?id=${story.hnId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 hover:text-amber-600 transition-colors duration-150 leading-snug line-clamp-2"
              >
                {story.title}
              </a>
              {domain && (
                <span className="text-xs text-gray-400 mt-0.5 block">{domain}</span>
              )}
            </div>

            {user && (
              <button
                onClick={handleBookmark}
                disabled={isLoading}
                id={`bookmark-${story._id}`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
                  ${isBookmarked
                    ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                    : 'bg-gray-50 text-gray-300 hover:bg-gray-100 hover:text-gray-500'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-amber-500">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">{story.points}</span> points
            </span>

            <span className="text-gray-200">·</span>

            <span className="text-xs text-gray-500">
              by{' '}
              <a
                href={`https://news.ycombinator.com/user?id=${story.author}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-700 hover:text-amber-600 transition-colors"
              >
                {story.author}
              </a>
            </span>

            {story.postedAt && (
              <>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-400">{story.postedAt}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default StoryCard;
