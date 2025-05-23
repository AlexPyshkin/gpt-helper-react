import { Box, Typography, Chip, Stack, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_DIALOG_CATEGORY, GET_QUESTIONS_BY_CATEGORY } from '../../graphql/queries';
import type { Answer, AppState, Question } from '../../types';
import { QuestionDetail } from '../library/QuestionDetail';
import { GetQuestionsByCategoryQuery, GetQuestionsByCategoryQueryVariables } from '../../graphql/types';
import { QuestionsList } from '../library/QuestionsList';
import { AnswerDetail } from '../library/AnswerDetail';
import { VoiceContextTracker } from '../library/VoiceContextTracker';

interface Tag {
  id: string;
  name: string;
}

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

export const TagList = ({ currentState }: TagListProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTags, setFilteredTags] = useState<Tag[]>(ALL_JAVA_TAGS);

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

  useEffect(() => {
    const filtered = ALL_JAVA_TAGS.filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTags(filtered);
  }, [searchQuery]);

  const displayTags = [
    ...selectedTags,
    ...filteredTags.filter(tag => !selectedTags.some(selected => selected.id === tag.id))
  ];

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
