// src/types.ts
export interface Tag {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
    parentId?: string;
    children?: Category[];
}

export interface Question {
    id: string;
    questionText: string;
    tags: Tag[];
}

export interface Answer {
    id: string;
    answerText: string;
}

export interface Filters {
    editMode: boolean;
    tagFilter: string;
  }
  
export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AppState {
    user: User | null;
    filters: Filters;
    category: Category | null;
    question: Question | null;
    answer: Answer | null;
    loadingAnswer: boolean;
}