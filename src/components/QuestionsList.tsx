// src/components/QuestionsList.tsx
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_QUESTIONS_BY_CATEGORY } from '../graphql/queries';
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
import { Answer, AppState, Question } from '../types';
import type { GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables } from '../graphql/types';

type QuestionsListProps = {
  currentState: AppState;
  onSelectQuestion: (newState: Question) => void;
  setAnswerForQuestion: (answer: Answer | null) => void;
};

export const QuestionsList = ({ currentState, onSelectQuestion, setAnswerForQuestion }: QuestionsListProps) => {


  const [filter, setFilter] = useState('');

  const { loading, error, data } = useQuery<GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables>(
    GET_QUESTIONS_BY_CATEGORY,
    {
      variables: { categoryId: currentState.category?.id },
      fetchPolicy: 'network-only',
    }
  );

  const handleQuestionClick = async (question: Question) => {
    currentState.question = question;
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
      console.error("Ошибка при получении ответа:", response.statusText);
      return;
    }

    const result = await response.json();
    if (result.data?.answer) {
      setAnswerForQuestion(result.data.answer);
    } else {
      setAnswerForQuestion(null);
      console.error("Ответ не найден в результате:", result);
    }
  };

  if (!currentState.category) {
    return (
      <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', bgcolor: '#f9f9f9', height: '80%', overflow: 'auto' }}>
        <Typography variant="h6" align="center">
          Пожалуйста, выберите категорию для отображения вопросов.
        </Typography>
      </Box>
    );
  }

  if (loading) return <CircularProgress />;
  if (error) {
    console.error("Error loading questions:", error.message);
    return <Typography color="error">Error: {error.message}</Typography>;
  }
  
  const filteredQuestions = data!.questions
  .filter((q) =>
    q.questionText.toLowerCase().includes(filter.toLowerCase())
  )
  .sort((a, b) => a.questionText.localeCompare(b.questionText));


  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', bgcolor: '#f9f9f9', height: 'calc(100% - 32px)', overflowY: 'auto' }}>
      <TextField
        label="Поиск вопросов"
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
                backgroundColor: currentState.question?.id === question.id ? 'lightblue' : 'inherit',
              }}
            >
              <ListItemText primary={question.questionText} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
