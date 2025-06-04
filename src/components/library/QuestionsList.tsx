// src/components/QuestionsList.tsx
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_QUESTIONS_BY_CATEGORY } from '../../graphql/queries';
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Box,
  ListItemButton,
  TextField,
} from '@mui/material';
import { Answer, AppState, Question } from '../../types';
import type { GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables } from '../../graphql/types';
import { useTranslation } from 'react-i18next';

type QuestionsListProps = {
  currentState: AppState;
  onSelectQuestion: (newState: Question) => void;
  setAnswerForQuestion: (answer: Answer | null) => void;
  variant?: 'library' | 'dialog';
};

export const QuestionsList = ({ 
  currentState, 
  onSelectQuestion, 
  setAnswerForQuestion,
  variant = 'library'
}: QuestionsListProps) => {
  const [filter, setFilter] = useState('');
  const { t } = useTranslation();

  const { loading, error, data } = useQuery<GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables>(
    GET_QUESTIONS_BY_CATEGORY,
    {
      variables: { categoryId: currentState.category?.id, tagFilter: currentState.filters.tagFilter },
      fetchPolicy: 'network-only',
    }
  );

  const handleQuestionClick = async (question: Question) => {
    onSelectQuestion(question);

    const response = await fetch(`/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetAnswerByQuestion($questionId: ID!) {
          answer(questionId: $questionId) {
            id
            answerText
          }
        }`,
        variables: { questionId: question.id },
      }),
    });

    if (!response.ok) {
      console.error(t('library.errorFetchingAnswer'), response.statusText);
      return;
    }

    const result = await response.json();
    if (result.data?.answer) {
      setAnswerForQuestion(result.data.answer);
    } else {
      setAnswerForQuestion(null);
      console.error(t('library.answerNotFound'), result);
    }
  };

  const styles = {
    container: {
      library: {
        p: 2,
        height: '70%',
      },
      dialog: {
        p: 1,
        height: '100%',
      }
    },
    typography: {
      library: {
        variant: 'body1' as const,
        fontSize: '1rem',
        lineHeight: 1.5,
        padding: '0px'
      },
      dialog: {
        variant: 'body2' as const,
        fontSize: '0.7rem',
        lineHeight: 1.2,
        padding: '0px'
      }
    }
  };

  if (!currentState.category) {
    return (
      <Box sx={{ 
        ...styles.container[variant],
        border: '1px solid #ccc',
        borderRadius: '8px',
        margin: '6px',
        backgroundColor: 'background.paper',
        overflow: 'auto'
      }}>
        <Typography variant="h6" align="center">
          {t('library.selectCategory')}
        </Typography>
      </Box>
    );
  }

  if (loading) return <CircularProgress />;
  if (error) {
    console.error(t('library.errorLoadingQuestions'), error.message);
    return <Typography color="error">{t('common.error')}: {error.message}</Typography>;
  }
  
  const filteredQuestions = data!.questions
    .filter((q) => q.questionText.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => a.id.localeCompare(b.id));

  return (
    <Box sx={{ 
      ...styles.container[variant],
      border: '1px solid #ccc',
      borderRadius: '8px',
      margin: '6px',
      backgroundColor: 'background.paper',
      overflowY: 'auto'
    }}>
      <TextField
        label={t('library.search')}
        variant="outlined"
        size="small"
        fullWidth
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        sx={{ mb: 2 }}
      />
      <List>
        {filteredQuestions.map((question) => (
          <ListItem disablePadding key={question.id}>
            <ListItemButton
              onClick={() => handleQuestionClick(question)}
              selected={currentState.question?.id === question.id}
              sx={{
                py: 0,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(144, 202, 249, 0.2)',
                }
              }}
            >
              <ListItemText 
                primary={question.questionText} 
                sx={{
                  '& .MuiListItemText-primary': {
                    variant: styles.typography[variant].variant,
                    fontSize: styles.typography[variant].fontSize,
                    lineHeight: styles.typography[variant].lineHeight,
                    padding: styles.typography[variant].padding
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
