import { useState } from 'react';
import { CategoriesList } from './CategoriesList';
import { QuestionsList } from './QuestionsList';
import { QuestionDetail } from './QuestionDetail';
import { AnswerDetail } from './AnswerDetail';
import { useQuery } from '@apollo/client';
import { GET_QUESTIONS_BY_CATEGORY } from '../../graphql/queries';
import type { AppState, Category, Question, Answer } from '../../types';
import type { GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables } from '../../graphql/types';
import { Box } from '@mui/material';

export const Library = () => {
  const [state, setState] = useState<AppState>({
    category: null,
    question: null,
    answer: null,
    loadingAnswer: false,
  });

  const { refetch: updateQuestions } = useQuery<GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables>(
    GET_QUESTIONS_BY_CATEGORY,
    {
      variables: { categoryId: state.category?.id },
      fetchPolicy: 'network-only',
    }
  );

  const handleCategorySelect = (category: Category) => {
    setState({ ...state, category, question: null, answer: null });
  };

  const handleQuestionSelect = (question: Question) => {
    setState({ ...state, question, loadingAnswer: true });
  };

  const handleAnswerUpdate = (answer: Answer | null) => {
    setState({ ...state, answer, loadingAnswer: false });
  };

  const setLoadingAnswer = (isLoading: boolean) => {
    setState({ ...state, loadingAnswer: isLoading });
  };

  const refetchQuestionsAndSetSelected = async (newState: AppState) => {
    await updateQuestions();
    setState((prevState) => ({ ...prevState, question: newState.question, answer: newState.answer }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: 'calc(100vh - 96px)', // 64px for header + 64px for footer
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '30%',
          minWidth: '300px',
          height: '100%',
        }}
      >
        <CategoriesList onSelectCategory={handleCategorySelect} currentState={state} />
        <QuestionDetail currentState={state} refetchQuestions={refetchQuestionsAndSetSelected} setAnswerLoadingState={setLoadingAnswer} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '70%',
          height: '100%',
        }}
      >
        <QuestionsList currentState={state} onSelectQuestion={handleQuestionSelect} setAnswerForQuestion={handleAnswerUpdate} />
        <AnswerDetail currentState={state} />
      </Box>
    </Box>
  );
};
