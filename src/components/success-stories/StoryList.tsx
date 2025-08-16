// src/components/success-stories/StoryList.tsx
import Image from 'next/image';
import Link from 'next/link';

// Mock data for success stories
const stories = [
    {
        id: 1,
        name: "Priya Sharma",
        batch: "2022",
        title: "From MCAverse to a Dream Job at Google",
        content: "MCAverse was instrumental in my journey. The mock tests were exactly what I needed to crack the NIMCET, and the community support kept me motivated. The AI assistant helped me identify my weak areas in data structures, which was a game-changer...",
        imageUrl: "https://placehold.co/80x80/E2E8F0/475569?text=PS"
    },
    {
        id: 2,
        name: "Rohan Kumar",
        batch: "2021",
        title: "How I Landed a Product Manager Role at Microsoft",
        content: "The career hub section was a goldmine. The interview preparation guides and alumni insights gave me the confidence to face the toughest interviews. I can't thank the MCAverse team enough for their comprehensive resources...",
        imageUrl: "https://placehold.co/80x80/E2E8F0/475569?text=RK"
    }
];

export const StoryList = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">Inspiring Journeys</h2>
            <div className="space-y-8">
                {stories.map(story => (
                    <div key={story.id} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex gap-6">
                        <div className="flex-shrink-0">
                            <Image src={story.imageUrl} alt={story.name} width={80} height={80} className="rounded-full" />
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold">{story.title}</h3>
                            <p className="text-sm text-slate-500 mb-3">By {story.name} - Batch of {story.batch}</p>
                            <p className="text-slate-600 leading-relaxed">{story.content}</p>
                            <Link href="#" className="text-indigo-600 font-semibold hover:text-indigo-800 mt-4 inline-block">
                                Read More &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
