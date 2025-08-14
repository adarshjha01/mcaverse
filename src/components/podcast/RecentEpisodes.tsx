// src/components/podcast/RecentEpisodes.tsx
import Image from 'next/image';

type Episode = {
  id: string;
  title: string;
  thumbnailUrl: string;
  description: string;
};

async function getYouTubePlaylistItems(): Promise<Episode[]> {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;
  const URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&key=${API_KEY}&maxResults=10`;

  try {
    const res = await fetch(URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch YouTube playlist');
    const data = await res.json();
    const episodes: Episode[] = data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      description: item.snippet.description.substring(0, 150) + '...',
    }));
    return episodes.reverse();
  } catch (error) {
    console.error("YouTube API Error:", error);
    return [];
  }
}

export const RecentEpisodes = async () => {
  const episodes = await getYouTubePlaylistItems();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Recent Episodes</h2>
      {episodes.length === 0 ? (
        <p className="text-slate-600">Could not load episodes. Please check back later.</p>
      ) : (
        <div className="space-y-8">
          {episodes.map((episode) => (
            <div key={episode.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6 border border-slate-200">
              <div className="flex-shrink-0 w-full md:w-48">
                <a href={`https://www.youtube.com/watch?v=${episode.id}`} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={episode.thumbnailUrl}
                    alt={`Thumbnail for ${episode.title}`}
                    width={480}
                    height={360}
                    className="rounded-md w-full h-auto object-cover aspect-video cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </a>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2">{episode.title}</h3>
                <p className="text-slate-600 mb-4 text-sm">{episode.description}</p>
                <a href={`https://www.youtube.com/watch?v=${episode.id}`} target="_blank" rel="noopener noreferrer" className="inline-block bg-red-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Watch on YouTube
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
