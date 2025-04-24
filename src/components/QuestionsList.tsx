import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_QUESTIONS_BY_CATEGORY } from '../graphql/queries'; // Предполагается, что у вас есть этот запрос
import { List, ListItem, ListItemText, CircularProgress, Typography, Box } from '@mui/material';

export const QuestionsList = ({ currentState, onSelectQuestion, setAnswerForQuestion }) => {
  // If category is null, return a message or nothing
  if (!currentState.category) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          margin: '16px',
          backgroundColor: '#f9f9f9',
          height: '80%',
          overflow: 'auto',
        }}
      >
        <Typography variant="h6" align="center">Пожалуйста, выберите категорию для отображения вопросов.</Typography>
      </Box>
    );
  }

  const { loading, error, data } = useQuery(GET_QUESTIONS_BY_CATEGORY, {
    variables: { categoryId: currentState.category.id },
    fetchPolicy: 'network-only', // Disable caching
  });

  const handleQuestionClick = async (question) => {
    currentState.question = question;
    onSelectQuestion(question);

    // Fetch the answer for the selected question
    const response = await fetch(`/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `query GetAnswerByQuestion($questionId: ID!) {
          answer(questionId: $questionId) {
            id
            answerText
          }
        }`,
        variables: { questionId: currentState.question.id },
      }),
    });

    if (!response.ok) {
      console.error("Ошибка при получении ответа:", response.statusText);
      return;
    }

    const result = await response.json();
    if (result.data && result.data.answer) {
      setAnswerForQuestion(result.data.answer);
    } else {
      setAnswerForQuestion('');
      console.error("Ответ не найден в результате:", result);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }
  if (error) {
    console.error("Error loading questions:", error.message);
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '0px 16px',
        margin: '0px 16px',
        backgroundColor: '#f9f9f9',
        height: 'calc(100% - 32px)',
        overflowY: 'auto',
      }}
    >
      <List sx={{ overflowY: 'auto', maxHeight: '100%' }}>
        {data.questions.map((question) => (
          <ListItem
            button
            key={question.id}
            onClick={() => handleQuestionClick(question)}
            selected={currentState.question && currentState.question.id === question.id}
            sx={{
              backgroundColor: currentState.question && currentState.question.id === question.id ? 'lightblue' : 'inherit',
            }}
          >
            <ListItemText primary={question.questionText} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}; 