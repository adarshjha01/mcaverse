// src/components/success-stories/StoryList.tsx
import Image from 'next/image';
import Link from 'next/link';

type Story = {
  id: string;
  name: string;
  batch: string;
  title: string;
  content: string;
  imageUrl: string | null;
};

export const StoryList = ({ stories }: { stories: Story[] }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">Inspiring Journeys</h2>
            <div className="space-y-8">
                {stories.length > 0 ? (
                    stories.map(story => (
                        <div key={story.id} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col sm:flex-row gap-6">
                            <div className="flex-shrink-0 mx-auto sm:mx-0">
                                <Image 
                                    src={story.imageUrl || `https://placehold.co/80x80/E2E8F0/475569?text=${story.name.charAt(0)}`} 
                                    alt={story.name} 
                                    width={80} 
                                    height={80} 
                                    className="rounded-full" 
                                />
                            </div>
                            <div className="flex-grow text-center sm:text-left">
                                <h3 className="text-xl font-bold">{story.title}</h3>
                                <p className="text-sm text-slate-500 mb-3">By {story.name} - Batch of {story.batch}</p>
                                <p className="text-slate-600 leading-relaxed">{story.content}</p>
                                <Link href={`/success-stories/${story.id}`} className="text-indigo-600 font-semibold hover:text-indigo-800 mt-4 inline-block">
                                    Read More &rarr;
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-500">No success stories have been shared yet. Be the first!</p>
                )}
            </div>
        </div>
    );
};
