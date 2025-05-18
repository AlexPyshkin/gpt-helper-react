import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DIALOG_CATEGORY, GET_QUESTIONS_BY_CATEGORY } from '../../graphql/queries';
import type { Answer, AppState, Question } from '../../types';
import { QuestionDetail } from '../library/QuestionDetail';
import { GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables } from '../../graphql/types';
import { QuestionsList } from '../library/QuestionsList';
import { AnswerDetail } from '../library/AnswerDetail';

export const Dialog = () => {
  const [state, setState] = useState<AppState>({
    category: null,
    question: null,
    answer: null,
    loadingAnswer: false,
  });

  const { loading, error, data } = useQuery(GET_DIALOG_CATEGORY);

  useEffect(() => {
    console.log(data);
    if (data?.category) {
      setState(prevState => ({
        ...prevState,
        category: data.category
      }));
    }
  }, [data]);

  const { refetch: updateQuestions } = useQuery<GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables>(
    GET_QUESTIONS_BY_CATEGORY,
    {
      variables: { categoryId: state.category?.id },
      fetchPolicy: 'network-only',
    }
  );

  const setLoadingAnswer = (isLoading: boolean) => {
    setState({ ...state, loadingAnswer: isLoading });
  };
  
  const refetchQuestionsAndSetSelected = async (newState: AppState) => {
    await updateQuestions();
    setState((prevState) => ({ ...prevState, question: newState.question, answer: newState.answer }));
  };

  const handleQuestionSelect = (question: Question) => {
    setState({ ...state, question, loadingAnswer: true });
  };

  const handleAnswerUpdate = (answer: Answer | null) => {
    setState({ ...state, answer, loadingAnswer: false });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;
  
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
          width: '10%',
          minWidth: '230px',
          height: '100%',
        }}
      >
        <Typography variant="h6" sx={{ p: 1, borderBottom: '1px solid #ccc', display: 'none' }}>
          {state.category?.name || 'Категория не найдена'}
        </Typography>
        <QuestionsList 
          currentState={state} 
          onSelectQuestion={handleQuestionSelect} 
          setAnswerForQuestion={handleAnswerUpdate}
          variant="dialog"
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '90%',
          height: '100%',
        }}
      >
        <AnswerDetail 
          currentState={state} 
          variant="dialog"
        />
        <QuestionDetail 
          currentState={state} 
          refetchQuestions={refetchQuestionsAndSetSelected} 
          setAnswerLoadingState={setLoadingAnswer}
          variant="dialog"
        />
      </Box>
    </Box>
  );
};
