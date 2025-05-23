// src/types.ts
export interface Category {
    id: string;
    name: string;
    parentId?: string;
    children?: Category[];
}

export interface Question {
    id: string;
    questionText: string;
    // …other fields
}

export interface Answer {
    id: string;
    // content: string;
    answerText: string;
    // …other fields
}

export interface AppState {
    category: Category | null;
    question: Question | null;
    answer: Answer | null;
    loadingAnswer: boolean;
}