// src/graphql/types.ts

// Re‐usable maybe‐null helper
export type Maybe<T> = T | null;

// Domain objects
export interface Category {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  questionText: string;
}

export interface Answer {
  id: string;
  answerText: string;
}

// GET_CATEGORIES
export interface GetCategoriesQuery {
  categories: Category[];
}
export interface GetCategoriesQueryVariables {}

// GET_QUESTIONS_BY_CATEGORY
export interface GetQuestionsByCategoryQuery {
  questions: Question[];
}
export interface GetQuestionsByCategoryQueryVariables {
  categoryId: string | undefined;
}

// GET_ANSWER_BY_QUESTION
export interface GetAnswerByQuestionQuery {
  answer: Maybe<Answer>;
}
export interface GetAnswerByQuestionQueryVariables {
  questionId: string;
}

// CREATE_QUESTION
export interface CreateQuestionMutation {
  createQuestion: {
    category: Category;
    question: Question;
    answer: Answer;
  };
}
export interface CreateQuestionMutationVariables {
  questionText: string;
  categoryId: string;
}

// UPDATE_QUESTION
export interface UpdateQuestionMutation {
  updateQuestion: {
    category: Category;
    question: Question;
    answer: Answer;
  };
}
export interface UpdateQuestionMutationVariables {
  id: string;
  questionText: string;
}

// UPDATE_ANSWER
export interface UpdateAnswerMutation {
  updateAnswer: Answer;
}
export interface UpdateAnswerMutationVariables {
  answerId: string;
  answerText: string;
}


// User and auth

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}