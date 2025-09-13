// src/db/dpp-data.ts
import { DppPageData } from '@/types/dpp';

export const dppData: DppPageData = {
  subjects: [
    {
      name: "Mathematics",
      topics: [
        {
          name: "Probability",
          dpps: [
            { title: "DPP 1: Basics of Probability", completed: true },
            { title: "DPP 2: Conditional Probability", completed: false },
            { title: "DPP 3: Bayes' Theorem", completed: false },
            { title: "DPP 4: Random Variables", completed: true },
          ],
        },
        {
          name: "Trigonometry",
          dpps: [
            { title: "DPP 1: Trigonometric Functions", completed: false },
            { title: "DPP 2: Identities & Equations", completed: false },
          ],
        },
      ],
    },
    {
      name: "Logical Reasoning",
      topics: [
        {
          name: "Puzzles",
          dpps: [
            { title: "DPP 1: Seating Arrangement", completed: true },
            { title: "DPP 2: Blood Relations", completed: true },
          ],
        },
        { name: "Series", dpps: [] },
      ],
    },
    {
      name: "Computer Awareness",
      topics: [
        { name: "Operating Systems", dpps: [] },
        { name: "Networking", dpps: [] },
      ],
    },
    {
      name: "General English",
      topics: [
        { name: "Grammar", dpps: [] },
        { name: "Vocabulary", dpps: [] },
      ],
    },
  ],
};
