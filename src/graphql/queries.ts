import { gql } from "@apollo/client";

export const GET_LIBRARY_CATEGORIES = gql`
  query GetLibraryCategories {
    categories: libraryCategories {
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
  mutation CreateQuestion($questionText: String!, $categoryId: ID!) {
    createQuestion(questionText: $questionText, categoryId: $categoryId) {
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
