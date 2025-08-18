// src/components/success-stories/StoryList.tsx
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { useState } from 'react';
import { IconHeart } from '@/components/ui/Icons';

type Story = {
  id: string;
  name: string;
  batch: string;
  title: string;
  content: string;
  imageUrl: string | null;
  likeCount: number;
  likes: string[];
};

export const StoryList = ({ stories }: { stories: Story[] }) => {
    const { user } = useAuth();
    const [optimisticStories, setOptimisticStories] = useState(stories);

    const handleLike = async (storyId: string) => {
        if (!user) {
            alert("Please log in to like a story.");
            return;
        }

        // Optimistic UI update
        setOptimisticStories(currentStories =>
            currentStories.map(story => {
                if (story.id === storyId) {
                    const alreadyLiked = story.likes.includes(user.uid);
                    return {
                        ...story,
                        likes: alreadyLiked ? story.likes.filter(id => id !== user.uid) : [...story.likes, user.uid],
                        likeCount: alreadyLiked ? story.likeCount - 1 : story.likeCount + 1,
                    };
                }
                return story;
            })
        );

        // Call the API route
        await fetch('/api/stories/like', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storyId, userId: user.uid }),
        });
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">Inspiring Journeys</h2>
            <div className="space-y-8">
                {optimisticStories.length > 0 ? (
                    optimisticStories.map(story => {
                        const isLikedByCurrentUser = user ? story.likes.includes(user.uid) : false;
                        return (
                            <div key={story.id} className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                                <div className="flex flex-col sm:flex-row gap-6">
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
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                                    <Link href={`/success-stories/${story.id}`} className="text-indigo-600 font-semibold hover:text-indigo-800">
                                        Read More &rarr;
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleLike(story.id)}
                                            disabled={!user}
                                            className={`p-2 rounded-full transition-colors disabled:cursor-not-allowed ${isLikedByCurrentUser ? 'text-red-500' : 'text-slate-400 hover:text-red-500 hover:bg-red-100'}`}
                                        >
                                            <IconHeart filled={isLikedByCurrentUser} />
                                        </button>
                                        <span className="text-sm font-medium text-slate-600">{story.likeCount}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-slate-500">No success stories have been shared yet. Be the first!</p>
                )}
            </div>
        </div>
    );
};