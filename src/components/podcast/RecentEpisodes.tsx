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

const YouTubeIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

/* Skeleton loader for loading state / graceful empty */
const EpisodeSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 animate-pulse">
    <div className="flex-shrink-0 w-full sm:w-44 md:w-48 aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl" />
    <div className="flex-grow space-y-3 py-1">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-full" />
      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-lg w-2/3" />
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg w-36 mt-4" />
    </div>
  </div>
);

export const RecentEpisodes = async () => {
  const episodes = await getYouTubePlaylistItems();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">Recent Episodes</h2>
          {episodes.length > 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{episodes.length} episodes available</p>
          )}
        </div>
        <a
          href={MCAVERSE_SPOTIFY}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#1DB954] text-white font-bold px-4 py-2.5 rounded-xl hover:bg-[#1aa34a] active:scale-[0.97] transition-all text-xs sm:text-sm shadow-sm w-fit"
        >
          <SpotifyIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          Listen on Spotify
        </a>
      </div>

      {/* Empty State */}
      {episodes.length === 0 ? (
        <div className="space-y-5">
          <EpisodeSkeleton />
          <EpisodeSkeleton />
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Episodes are being loaded...</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Check back shortly or listen on Spotify.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 hover:border-violet-300 dark:hover:border-violet-800/50 hover:shadow-md transition-all duration-200"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-full sm:w-44 md:w-48 relative">
                <a href={`https://www.youtube.com/watch?v=${episode.id}`} target="_blank" rel="noopener noreferrer" className="block relative">
                  <Image
                    src={episode.thumbnailUrl}
                    alt={`Thumbnail for ${episode.title}`}
                    width={480}
                    height={360}
                    className="rounded-xl w-full h-auto object-cover aspect-video group-hover:brightness-95 transition-all duration-200"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>

              {/* Info */}
              <div className="flex-grow flex flex-col min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 mb-1.5 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {episode.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3">
                  {episode.description}
                </p>

                {/* Action button */}
                <div className="mt-auto">
                  <a
                    href={`https://www.youtube.com/watch?v=${episode.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold text-xs sm:text-sm transition-colors"
                  >
                    <YouTubeIcon className="w-4 h-4" />
                    Watch on YouTube
                    <svg className="w-3.5 h-3.5 -translate-x-0.5 group-hover:translate-x-0 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
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