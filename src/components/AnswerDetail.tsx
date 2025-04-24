import {Box, CircularProgress, IconButton} from '@mui/material';
import TextareaAutosize from 'react-textarea-autosize';
import {useEffect, useState} from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import CheckIcon from '@mui/icons-material/Check';
import {useMutation} from '@apollo/client';
import {UPDATE_ANSWER} from '../graphql/queries';

export const AnswerDetail = ({ currentState }) => {
  const [answerText, setAnswerText] = useState('');
  const [updateAnswer] = useMutation(UPDATE_ANSWER);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (currentState.answer) {
      setAnswerText(currentState.answer.answerText);
      setIsChanged(false);
    } else {
      setAnswerText('');
    }
  }, [currentState.answer]);

  const handleInputChange = (event) => {
    setAnswerText(event.target.value);
    setIsChanged(event.target.value !== currentState.answer.answerText);
  };

  const handleSave = async () => {
    console.log('Answer saved:', answerText);
    try {
      let response = await updateAnswer({ variables: { answerId: currentState.answer.id, answerText: answerText } });
      currentState.answer = response.data.updateAnswer;
      console.log(currentState);
      setIsChanged(false);
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const handleCancel = () => {
    setAnswerText(currentState.answer.answerText);
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
        padding: '16px',
        margin: '16px',
        backgroundColor: '#f9f9f9',
        height: '80%',
        overflow: 'auto',
      }}
    >
      {currentState.loadingAnswer ? (
        <CircularProgress />
      ) : (
        <>
          <TextareaAutosize 
            minRows={30}
            value={answerText} 
            onChange={handleInputChange} 
            style={{ 
              width: '100%', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              padding: '8px', 
              marginBottom: '16px',
              resize: 'none'
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <IconButton onClick={handleCancel} color="primary" disabled={isDisabled}>
              <UndoIcon />
            </IconButton>
            <IconButton onClick={handleSave} color="primary" disabled={isDisabled}>
              <CheckIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
}; 