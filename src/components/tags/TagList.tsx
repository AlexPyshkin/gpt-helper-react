import { Box, Typography, Chip, Stack, TextField, CircularProgress, Button, IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_DIALOG_CATEGORY, GET_QUESTIONS_BY_CATEGORY, GET_TAGS, UPDATE_QUESTION_TAGS } from '../../graphql/queries';
import type { Answer, AppState, Question } from '../../types';
import { QuestionDetail } from '../library/QuestionDetail';
import { GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables, Tag } from '../../graphql/types';
import { QuestionsList } from '../library/QuestionsList';
import { AnswerDetail } from '../library/AnswerDetail';
import { VoiceContextTracker } from '../library/VoiceContextTracker';
import { Save } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

interface TagListProps {
  currentState: AppState;
}

const ALL_JAVA_TAGS: Tag[] = [
  { id: '1', name: 'Spring Framework' },
  { id: '2', name: 'Hibernate' },
  { id: '3', name: 'JUnit' },
  { id: '4', name: 'Maven' },
  { id: '5', name: 'Gradle' },
  { id: '6', name: 'Java Streams' },
  { id: '7', name: 'Lambda Expressions' },
  { id: '8', name: 'Collections' },
  { id: '9', name: 'Multithreading' },
  { id: '10', name: 'JPA' },
  { id: '11', name: 'REST API' },
  { id: '12', name: 'Microservices' },
  { id: '13', name: 'Design Patterns' },
  { id: '14', name: 'Spring Boot' },
  { id: '15', name: 'Dependency Injection' }
];

type TagList = {
  currentState: AppState;
  onSelectQuestion: (newState: Question) => void;
  setAnswerForQuestion: (answer: Answer | null) => void;
  variant?: 'library' | 'dialog';
};

export const TagList = ({ currentState }: TagListProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(currentState.question?.tags ?? []);
  const [searchQuery, setSearchQuery] = useState('');
  const {loading, error, data} = useQuery(GET_TAGS);
  const [updateTags] = useMutation(UPDATE_QUESTION_TAGS);
  const [filteredTags, setFilteredTags] = useState<Tag[]>(data?.tags ?? []);
  const { enqueueSnackbar } = useSnackbar();
  
  const handleTagClick = (tag: Tag) => {
    setSelectedTags(prevTags => {
      const isSelected = prevTags.some(t => t.id === tag.id);
      if (isSelected) {
        return prevTags.filter(t => t.id !== tag.id);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const handleUpdateTags = async () => {
    try {
      const cleanTags = selectedTags.map(tag => ({ id: tag.id, name: tag.name }));
      let response = await updateTags({ variables: { questionId: currentState.question!.id, tags: cleanTags } });
      currentState.question = response.data.updateAnswer;
      enqueueSnackbar('Теги успешно обновлены!', { variant: 'success' });
    } catch (error) {
      console.error("Error saving tags:", error);
      enqueueSnackbar('Ошибка при обновлении тегов', { variant: 'error' });
    }
  }

  useEffect(() => {
    const filtered = data?.tags?.filter((tag: Tag) => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? [];
    setFilteredTags(filtered);
  }, [searchQuery, data]);

  useEffect(() => {
    setSelectedTags(currentState.question?.tags ?? []);
  }, [currentState]);

  const displayTags = [
    ...selectedTags,
    ...filteredTags.filter(tag => !selectedTags.some(selected => selected.id === tag.id))
  ];

  if (loading) return <CircularProgress/>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Теги
      </Typography>
      <TextField
        label="Поиск по тегам"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2 }}
      />
      <IconButton onClick={handleUpdateTags} color="primary"
        // disabled={isCommitDisabled}
        >
        <Save />
      </IconButton>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {displayTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            onClick={() => handleTagClick(tag)}
            color={selectedTags.some(t => t.id === tag.id) ? "primary" : "default"}
            sx={{ m: 0.5 }}
          />
        ))}
      </Stack>
    </Box>
  );
};
