"use client";

import { useState } from "react";
import { StoryList } from "./StoryList";
import { ShareJourneyForm } from "./ShareJourneyForm";

type Story = {
    id: string;
    name: string;
    batch: string;
    title: string;
    content: string;
    imageUrl: string | null;
    likeCount: number;
    likes: string[];
    rating: number;
    userId: string;
};

export const SuccessStoriesClient = ({ initialStories }: { initialStories: Story[] }) => {
    const [stories, setStories] = useState<Story[]>(initialStories);

    const handleStoryAdded = (newStory: Story) => {
        // Prepend the new story to the top of the list instantly
        setStories(prev => [newStory, ...prev]);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* On mobile: Form shows FIRST so users don't have to scroll past all stories */}
            <div className="lg:col-span-1 lg:order-2 lg:sticky lg:top-24">
                <ShareJourneyForm onStoryAdded={handleStoryAdded} />
            </div>
            <div className="lg:col-span-2 lg:order-1">
                <StoryList stories={stories} />
            </div>
        </div>
    );
};
