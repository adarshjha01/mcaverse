// src/db/video-data.ts

export type TopicData = {
  name: string;
  playlistId?: string;
};

export type SubjectData = {
  subject: string;
  topics: TopicData[];
};

export const subjectsData: SubjectData[] = [
  {
    subject: "Mathematics",
    topics: [
      { 
        name: "Set Theory and logic", 
        playlistId: "PLtfv-kFOzux2cNDEu_Fv0fCYTffiDA7WA"
      },
      {
        name: "Algebra",
        playlistId: "YOUR_PLAYLIST_ID_HERE"
      },
      {
        name: "Coordinate Geometry",
        playlistId: "YOUR_PLAYLIST_ID_HERE"
      },
      {
        name: "Trigonometry",
        playlistId: "YOUR_PLAYLIST_ID_HERE"
      },
      {
        name: "Calculus",
        playlistId: "YOUR_PLAYLIST_ID_HERE"
      },
      {
        name: "Probability and statistics",
        playlistId: "YOUR_PLAYLIST_ID_HERE"
      },
    ]
  },
  {
    subject: "Analytical Ability & Logical Reasoning",
    topics: [
        { name: "Verbal Reasoning", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Non-Verbal Reasoning", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Deductive Reasoning", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Inductive Reasoning", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Problem Solving", playlistId: "YOUR_PLAYLIST_ID_HERE" },
    ]
  },
  {
    subject: "Computer Awareness",
    topics: [
        { name: "Computer Basics", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Data Representation", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Computer Hardware", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Computer Software", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Internet and Email", playlistId: "YOUR_PLAYLIST_ID_HERE" },
    ]
  },
   {
    subject: "English",
    topics: [
        { name: "Comprehension", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Usage of Words", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Grammatical Patterns", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Phrases", playlistId: "YOUR_PLAYLIST_ID_HERE" },
        { name: "Technical Writing", playlistId: "YOUR_PLAYLIST_ID_HERE" },
    ]
  }
];