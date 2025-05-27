import {
  Box,
  Typography,
  Chip,
  Stack,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_TAGS,
  UPDATE_QUESTION_TAGS,
} from "../../graphql/queries";
import type { AppState, Question } from "../../types";
import {
  Tag,
} from "../../graphql/types";
import { Save } from "@mui/icons-material";
import { useSnackbar } from "notistack";

interface TagListProps {
  currentState: AppState;
  onUpadeTagsQuestion: (newState: Question) => void;
  // variant?: "library" | "dialog";
}

export const TagList = ({
  currentState,
  onUpadeTagsQuestion,
}: TagListProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(
    currentState.question?.tags ?? []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { loading, error, data } = useQuery(GET_TAGS);
  const [updateTags] = useMutation(UPDATE_QUESTION_TAGS);
  const [filteredTags, setFilteredTags] = useState<Tag[]>(data?.tags ?? []);
  const { enqueueSnackbar } = useSnackbar();
  const [hasChanges, setHasChanges] = useState(false);

  const handleTagClick = (tag: Tag) => {
    setSelectedTags((prevTags) => {
      const isSelected = prevTags.some((t) => t.id === tag.id);
      if (isSelected) {
        return prevTags.filter((t) => t.id !== tag.id);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const handleUpdateTags = async () => {
    try {
      const cleanTags = selectedTags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      }));
      let response = await updateTags({
        variables: { questionId: currentState.question!.id, tags: cleanTags },
      });
      onUpadeTagsQuestion(response.data.newState.question)
      enqueueSnackbar("Теги успешно обновлены!", { variant: "success" });
    } catch (error) {
      console.error("Error saving tags:", error);
      enqueueSnackbar("Ошибка при обновлении тегов", { variant: "error" });
    }
  };

  useEffect(() => {
    const filtered =
      data?.tags?.filter((tag: Tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ?? [];
    setFilteredTags(filtered);
  }, [searchQuery, data]);

  useEffect(() => {
    setSelectedTags(currentState.question?.tags ?? []);
  }, [currentState]);

  useEffect(() => {
    const originalTags = currentState.question?.tags ?? [];
    const hasTagsChanged = 
      selectedTags.length !== originalTags.length ||
      selectedTags.some(tag => !originalTags.some(origTag => origTag.id === tag.id));
    setHasChanges(hasTagsChanged);
  }, [selectedTags, currentState.question?.tags]);

  const displayTags = [
    ...selectedTags,
    ...filteredTags.filter(
      (tag) => !selectedTags.some((selected) => selected.id === tag.id)
    ),
  ];

  if (loading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Error: {error.message}</Typography>;
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Теги
      </Typography>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <TextField
          label="Поиск по тегам"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          onClick={handleUpdateTags}
          color="primary"
          disabled={!hasChanges}
        >
          <Save />
        </IconButton>
      </Stack>
      <Stack direction="row" flexWrap="wrap" useFlexGap>
        {displayTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            onClick={() => handleTagClick(tag)}
            color={
              selectedTags.some((t) => t.id === tag.id) ? "primary" : "default"
            }
            sx={{ m: 0.2 }}
          />
        ))}
      </Stack>
    </Box>
  );
};
