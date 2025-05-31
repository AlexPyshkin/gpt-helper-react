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

export interface AppState {
    category: Category | null;
    question: Question | null;
    answer: Answer | null;
    loadingAnswer: boolean;
    filters: {
        editMode: boolean;
    };
}