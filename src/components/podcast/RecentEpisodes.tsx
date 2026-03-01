// src/components/podcast/RecentEpisodes.tsx
import Image from 'next/image';

const MCAVERSE_SPOTIFY = 'https://open.spotify.com/show/4xlytFQ9Rcspndg01619rM';

type Episode = {
  id: string;
  title: string;
  thumbnailUrl: string;
  description: string;
};

type YouTubeApiItem = {
  snippet: {
    resourceId: { videoId: string };
    title: string;
    description: string;
    thumbnails: {
      high?: { url: string };
      default: { url: string };
    };
  };
};

async function getYouTubePlaylistItems(): Promise<Episode[]> {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;
  const URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=10`;

  try {
    const res = await fetch(URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch YouTube playlist');
    const data = await res.json();

    const episodes: Episode[] = data.items.map((item: YouTubeApiItem) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      description: item.snippet.description.substring(0, 150) + '...',
    }));
    return episodes.reverse();
  } catch (error) {
    console.error('YouTube API Error:', error);
    return [];
  }
}

const SpotifyIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

export const RecentEpisodes = async () => {
  const episodes = await getYouTubePlaylistItems();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">Recent Episodes</h2>
        <a
          href={MCAVERSE_SPOTIFY}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1DB954] text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#1aa34a] transition-colors text-xs sm:text-sm shadow-md hover:shadow-lg w-fit"
        >
          <SpotifyIcon className="w-5 h-5" />
          Listen on Spotify
        </a>
      </div>

      {episodes.length === 0 ? (
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">Could not load episodes. Please check back later.</p>
      ) : (
        <div className="space-y-5 sm:space-y-8">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-md flex flex-col sm:flex-row gap-4 sm:gap-6 border border-slate-200 dark:border-slate-700 transition-colors duration-300 hover:shadow-lg"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-full sm:w-44 md:w-48">
                <a href={`https://www.youtube.com/watch?v=${episode.id}`} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={episode.thumbnailUrl}
                    alt={`Thumbnail for ${episode.title}`}
                    width={480}
                    height={360}
                    className="rounded-lg w-full h-auto object-cover aspect-video cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>

              {/* Info */}
              <div className="flex-grow flex flex-col">
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 text-slate-900 dark:text-slate-100 line-clamp-2">{episode.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed line-clamp-3">{episode.description}</p>

                {/* Action Button */}
                <div className="mt-auto">
                  <a
                    href={`https://www.youtube.com/watch?v=${episode.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 sm:gap-2 bg-red-600 text-white font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-xs sm:text-sm"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};