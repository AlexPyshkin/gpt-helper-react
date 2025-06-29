import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { GET_DIALOG_CATEGORY, GET_QUESTIONS_BY_CATEGORY } from '../../graphql/queries';
import type { Answer, AppState, Question } from '../../types';
import { QuestionDetail } from '../library/QuestionDetail';
import { GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables } from '../../graphql/types';
import { QuestionsList } from '../library/QuestionsList';
import { AnswerDetail } from '../library/AnswerDetail';
import { VoiceContextTracker } from '../library/VoiceContextTracker';
import { useAuth } from '../../contexts/AuthContext';

export const Dialog = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [state, setState] = useState<AppState>({
    category: null,
    question: null,
    answer: null,
    loadingAnswer: false,
    filters: {
      editMode: false,
      tagFilter: ''
    },
    user: user
  });

  const { loading, error, data } = useQuery(GET_DIALOG_CATEGORY, {
    variables: { userId: user?.id || null }
  });

  useEffect(() => {
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
      variables: {
        categoryId: state.category?.id,
        tagFilter: state.filters.tagFilter,
      },
      fetchPolicy: 'network-only',
      skip: !state.category?.id,
    }
  );

  const setLoadingAnswer = (isLoading: boolean) => {
    setState({ ...state, loadingAnswer: isLoading });
  };
  
  const refetchQuestionsAndSetSelected = async (newState: AppState) => {
    await updateQuestions();
    if (newState.question) {
      newState.question.questionText = "";
    }
    setState((prevState) => ({ ...prevState, question: newState.question, answer: newState.answer }));
  };

  const handleQuestionSelect = (question: Question) => {
    setState({ ...state, question, loadingAnswer: true });
  };

  const handleAnswerUpdate = (answer: Answer | null) => {
    setState({ ...state, answer, loadingAnswer: false });
  };

  if (loading) return <Typography>{t('common.loading')}</Typography>;
  if (error) return <Typography>{t('common.error')}: {error.message}</Typography>;
  
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
          {state.category?.name || t('dialog.categoryNotFound')}
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
          questionTypeParam='SHORT_DIALOG'
          updateMode={false}
          variant="dialog"
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '20%',
          height: '100%',
        }}
      >
      <VoiceContextTracker
          currentState={state}
          variant="library" >
        
      </VoiceContextTracker>
      </Box>
    </Box>
  );
};
