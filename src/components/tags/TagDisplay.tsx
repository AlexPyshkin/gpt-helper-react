import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_TAGS } from "../../graphql/queries";
import type { AppState } from "../../types";
import { Tag } from "../../graphql/types";

interface TagDisplayProps {
  currentState: AppState;
}

export const TagDisplay = ({ currentState }: TagDisplayProps) => {
  const [similarTags, setSimilarTags] = useState<Tag[]>([]);
  const { loading, error, data } = useQuery(GET_TAGS);
  const selectedTags = currentState.question?.tags ?? [];

  useEffect(() => {
    if (data?.tags) {
      // Find tags that are not in selectedTags but might be related
      const otherTags = data.tags.filter(
        (tag: Tag) => !selectedTags.some((selected) => selected.id === tag.id)
      );
      setSimilarTags(otherTags);
    }
  }, [data, selectedTags]);

  if (loading) return null;
  if (error) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Теги вопроса
      </Typography>
      
      {/* Selected Tags Section */}
      <Stack direction="row" flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
        {selectedTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.name}
            color="primary"
            sx={{ m: 0.2 }}
          />
        ))}
      </Stack>

      {/* Similar Tags Section */}
      {similarTags.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Похожие теги
          </Typography>
          <Stack direction="row" flexWrap="wrap" useFlexGap>
            {similarTags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                variant="outlined"
                sx={{ m: 0.2 }}
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}; 