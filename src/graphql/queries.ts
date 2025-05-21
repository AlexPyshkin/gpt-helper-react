import { gql } from "@apollo/client";

export const GET_LIBRARY_CATEGORIES = gql`
  query GetLibraryCategories {
    categories: libraryCategories {
      id
      name
    }
  }
`;

export const GET_TEXT_CONTEXT = gql`
  query GetTextContext($inputText: String!, $isFirstQuery: Boolean!) {
    queryToModel(inputText: $inputText, isFirstQuery: $isFirstQuery)
  }
`;

export const GET_DIALOG_CATEGORY = gql`
  query GetDialogCategories {
    category: dialogCategory {
      id
      name
    }
  }
`;

export const GET_QUESTIONS_BY_CATEGORY = gql`
  query GetQuestionsByCategory($categoryId: ID!) {
    questions(categoryId: $categoryId) {
      id
      questionText
    }
  }
`;

export const GET_ANSWER_BY_QUESTION = gql`
  query GetAnswerByQuestion($questionId: ID!) {
    answer(questionId: $questionId) {
      id
      answerText
    }
  }
`;

export const CREATE_QUESTION = gql`
  mutation CreateQuestion($questionText: String!, $categoryId: ID!) {
    createQuestion(questionText: $questionText, categoryId: $categoryId) {
      category {
        id
        name
      }
      question {
        id
        questionText
      }
      answer {
        id
        answerText
      }
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($id: ID!, $questionText: String!) {
    updateQuestion(id: $id, questionText: $questionText) {
      category {
        id
        name
      }
      question {
        id
        questionText
      }
      answer {
        id
        answerText
      }
    }
  }
`;

export const UPDATE_ANSWER = gql`
  mutation UpdateAnswer($answerId: ID!, $answerText: String!) {
    updateAnswer(answerId: $answerId, answerText: $answerText) {
      id
      answerText
    }
  }
`;

export const TRANSCRIBE_AUDIO = gql`
  mutation TranscribeAudio($audioData: Upload!, $params: TranscriptionParamsInput!) {
    transcribeAudio(audioData: $audioData, params: $params)
  }
`;
