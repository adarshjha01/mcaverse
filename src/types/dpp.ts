// src/types/dpp.ts

export interface Dpp {
  title: string;
  completed: boolean;
}

export interface Topic {
  name: string;
  dpps: Dpp[];
}

export interface Subject {
  name: string;
  topics: Topic[];
}

export interface DppPageData {
  subjects: Subject[];
}
