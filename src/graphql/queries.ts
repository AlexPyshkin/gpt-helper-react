import { gql } from "@apollo/client";

export const GET_LIBRARY_CATEGORIES = gql`
  query GetLibraryCategories($userId: ID!) {
    categories: libraryCategories(userId: $userId) {
      id
      name
      parentId
    }
  }
`;

export const GET_TAGS = gql`
  query GetTags {
    tags: getTags {
      id
      name
    }
  }
`;

export const GET_TEXT_CONTEXT = gql`
  query GetTextContext($inputText: String!, $questionType: String) {
    queryToModel(inputText: $inputText, questionType: $questionType)
  }
`;

export const GET_DIALOG_CATEGORY = gql`
  query GetDialogCategories($userId: ID!) {
    category: dialogCategory(userId: $userId) {
      id
      name
    }
  }
`;

export const GET_QUESTIONS_BY_CATEGORY = gql`
  query GetQuestionsByCategory($categoryId: ID!, $tagFilter: String) {
    questions(categoryId: $categoryId, tagFilter: $tagFilter) {
      id
      questionText
      tags {
        id
        name
      }
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
  mutation CreateQuestion($questionText: String!, $categoryId: ID!, $questionType: String) {
    createQuestion(questionText: $questionText, categoryId: $categoryId, questionType: $questionType) {
      category {
        id
        name
      }
      question {
        id
        questionText
        tags {
          id
          name
        }
      }
      answer {
        id
        answerText
      }
    }
  }
`;

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($categoryText: String!, $userId: ID!, $parentId: ID) {
    createCategory(categoryText: $categoryText, userId: $userId, parentId: $parentId) {
        id
        name
        parentId
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion($id: ID!, $questionText: String!, $questionType: String) {
    updateQuestion(id: $id, questionText: $questionText, questionType: $questionType) {
      category {
        id
        name
      }
      question {
        id
        questionText
        tags {
          id
          name
        }
      }
      answer {
        id
        answerText
      }
    }
  }
`;

export const UPDATE_QUESTION_TAGS = gql`
  mutation UpdateQuestionTags($questionId: ID!, $tags: [TagInput!]!) {
    newState: updateQuestionTags(questionId: $questionId, tags: $tags) {
      category {
        id
        name
      }
      question {
        id
        questionText
        tags {
          id
          name
        }
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

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      name
    }
  }
`;

export const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle($credential: String!) {
    loginWithGoogle(credential: $credential) {
      user {
        id
        email
        name
      }
      token
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        email
        name
      }
      token
    }
  }
`;

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $name: String!) {
    register(email: $email, password: $password, name: $name) {
      user {
        id
        email
        name
      }
      token
    }
  }
`;
