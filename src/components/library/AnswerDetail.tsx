import {Box, CircularProgress, IconButton} from '@mui/material';
import TextareaAutosize from 'react-textarea-autosize';
import {useEffect, useState} from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import CheckIcon from '@mui/icons-material/Check';
import {useMutation} from '@apollo/client';
import {UPDATE_ANSWER} from '../../graphql/queries';
import type { AppState } from '../../types';
import type { ChangeEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

type AnswerDetailProps = {
  currentState: AppState;
  variant?: 'library' | 'dialog';
};

export const AnswerDetail = ({ currentState, variant = 'library' }: AnswerDetailProps) => {
  const [answerText, setAnswerText] = useState('');
  const [updateAnswer] = useMutation(UPDATE_ANSWER);
  const [isChanged, setIsChanged] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const styles = {
    container: {
      library: {
        minHeight: '30%',
        height: '30%',
      },
      dialog: {
        minHeight: '50%',
        height: '100%',
      }
    },
    textarea: {
      library: {
        minRows: 30,
      },
      dialog: {
        minRows: 100,
      }
    }
  };

  useEffect(() => {
    if (currentState.answer) {
      setAnswerText(currentState.answer.answerText);
      setIsChanged(false);
    } else {
      setAnswerText('');
    }
  }, [currentState.answer]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value);
    setIsChanged(event.target.value !== currentState.answer!.answerText);
  };

  const handleSave = async () => {
    console.log('Answer saved:', answerText);
    try {
      let response = await updateAnswer({ variables: { answerId: currentState.answer!.id, answerText: answerText } });
      currentState.answer = response.data.updateAnswer;
      console.log(currentState);
      setIsChanged(false);
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const handleCancel = () => {
    setAnswerText(currentState.answer!.answerText);
    setIsChanged(false);
  };

  const isDisabled = !currentState.answer || !isChanged;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '6px',
        margin: '6px',
        backgroundColor: '#f9f9f9',
        overflow: 'auto',
        ...styles.container[variant]
      }}
    >
      {currentState.loadingAnswer ? (
        <CircularProgress />
      ) : (
        <>
          {editMode ? (
            <TextareaAutosize
              minRows={styles.textarea[variant].minRows}
              value={answerText}
              onChange={handleInputChange}
              style={{
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '6px 0px',
                resize: 'none'
              }}
            />
          ) : (
            <div className="markdown-body" style={{ width: '99%' }}>
              <ReactMarkdown>
                {answerText}
              </ReactMarkdown>
            </div>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '99%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={editMode}
                  onChange={(_, checked) => setEditMode(checked)}
                  color="primary"
                />
              }
              label="Edit mode"
              sx={{ marginRight: 2, alignItems: "center"}}
            />
            <Box>
              <IconButton onClick={handleCancel} color="primary" disabled={isDisabled}>
                <UndoIcon />
              </IconButton>
              <IconButton onClick={handleSave} color="primary" disabled={isDisabled}>
                <CheckIcon />
              </IconButton>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}; 