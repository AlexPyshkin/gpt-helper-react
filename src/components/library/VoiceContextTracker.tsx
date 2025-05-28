import { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Typography,
  Box,
  ListItemButton,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { AppState } from '../../types';
import { StopRounded, VoiceChat } from '@mui/icons-material';
import { useLazyQuery } from '@apollo/client';
import { GET_TEXT_CONTEXT } from '../../graphql/queries';
import { config } from '../../config';
import { useTranslation } from 'react-i18next';

type VoiceContextTrackerProps = {
  currentState: AppState;
  variant?: 'library' | 'dialog';
};

export const VoiceContextTracker = ({ 
  currentState, 
  variant = 'library'
}: VoiceContextTrackerProps) => {
  const [currentVoiceText, setCurrentVoiceText] = useState('');
  const [speachContext, setSpeachContext] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [getTextContext, { data, loading }] = useLazyQuery(GET_TEXT_CONTEXT);

  const { t } = useTranslation();

  useEffect(() => {
    if (currentVoiceText) {
      getTextContext({
        variables: {
          inputText: currentVoiceText,
          questionType: 'CATCH_CONTEXT'
        }
      });
    }
  }, [currentVoiceText, getTextContext]);

  useEffect(() => {
    if (data?.queryToModel) {
      setSpeachContext(prevContext => [...prevContext, ...data.queryToModel]);
    }
  }, [data]);

  const recordVoice = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = async (e) => {
          chunks.push(e.data);
          
          // Process the accumulated chunks every 10 seconds
          const audioBlob = new Blob(chunks, { type: 'audio/ogg' });
          const formData = new FormData();
          formData.append('uploaded_file', audioBlob, 'recording.ogg');
        
          try {
            setIsProcessing(true);
            const { lang, temperature, beam_size } = config.transcribe.defaultParams;
            const response = await fetch(
              `${config.api.transcribe}?lang=${lang}&temperature=${temperature}&beam_size=${beam_size}`,
              {
                method: 'POST',
                body: formData,
                // mode: 'no-cors',
                credentials: 'include'
              }
            );
        
            const result = await response.json();
            console.log('Response voice text:', result);
            setCurrentVoiceText(result.responseBodyBatch[0]);
          } catch (err) {
            console.error('Error uploading audio:', err);
            if (err instanceof TypeError) {
              console.error('Network error details:', {
                message: err.message,
                name: err.name,
                stack: err.stack
              });
            }
          } finally {
            setIsProcessing(false);
          }
        };

        recorder.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
        };

        // Start recording with 10-second intervals
        recorder.start(10000);
        setMediaRecorder(recorder);
        setIsRecording(true);

      } catch (err) {
        console.error('Microphone access denied:', err);
      }

    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
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
        bgcolor: '#f9f9f9',
        overflow: 'auto'
      }}>
        <Typography variant="h6" align="center">
          {t('library.selectCategoryPrompt')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      ...styles.container[variant],
      border: '1px solid #ccc',
      borderRadius: '8px',
      margin: '6px',
      bgcolor: '#f9f9f9',
      overflowY: 'auto'
    }}>
    <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={recordVoice} color="primary">
          {isRecording ? <StopRounded /> : <VoiceChat />}
        </IconButton>
        {isRecording && <LinearProgress sx={{ width: 100 }} />}
      </Box>
    </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {(isProcessing || loading) && <CircularProgress size={24} />}
      </Box>
      {speachContext.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ p: 2 }}>
          {t('library.noRecordedMessages')}
        </Typography>
      ) : (
        <List>
          {speachContext.map((item, index) => (
            <ListItem disablePadding key={`voice-message-${index}`}>
              <ListItemButton
                sx={{
                  py: 0,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(144, 202, 249, 0.2)',
                  }
                }}
              >
                <ListItemText 
                  primary={item} 
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
      )}
    </Box>
  );
};
