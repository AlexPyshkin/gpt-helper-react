import { Box, IconButton, CircularProgress, LinearProgress, Select, MenuItem, FormControl } from "@mui/material";
import { useState, useEffect, ChangeEvent } from "react";
import { useMutation } from '@apollo/client';
import { CREATE_QUESTION, UPDATE_QUESTION } from "../../graphql/queries";
import AddIcon from "@mui/icons-material/Add";
import UndoIcon from "@mui/icons-material/Undo";
import CheckIcon from "@mui/icons-material/Check";
import { AppState } from "../../types";
import { StopRounded, VoiceChat } from "@mui/icons-material";
import { config } from "../../config";
import { StyledTextareaAutosize } from "../../styles/TextareaAutosize.styles";

type CategoriesListProps = {
  currentState: AppState;
  refetchQuestions: (newState: AppState) => Promise<void>;
  setAnswerLoadingState: (isLoading: boolean) => void;
  questionTypeParam?: QuestionType,
  updateMode?: boolean,
  variant?: 'library' | 'dialog';
};

type QuestionType = 'QUESTION_WITH_TOPIC' | 'SHORT_DIALOG' | 'ALGORITHM_TASK';

export const QuestionDetail = ({
  currentState,
  refetchQuestions,
  setAnswerLoadingState,
  questionTypeParam = 'QUESTION_WITH_TOPIC',
  updateMode = true,
  variant = 'library'
}: CategoriesListProps) => {
  const [createQuestion] = useMutation(CREATE_QUESTION);
  const [updateQuestion] = useMutation(UPDATE_QUESTION);
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState<QuestionType>(questionTypeParam);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const styles = {
    container: {
      library: {
        minHeight: '20%',
        height: '30%',
      },
      dialog: {
        minHeight: '15%',
        height: '18%',
      }
    },
    textarea: {
      library: {
        minRows: 30,
      },
      dialog: {
        minRows: 20,
      }
    }
  };

  useEffect(() => {
    if (currentState.question) {
      setQuestionText(currentState.question.questionText);
    } else {
      setQuestionText("");
    }
  }, [currentState.question]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionText(event.target.value);
  };

  const handleQuestionTypeChange = (event: any) => {
    setQuestionType(event.target.value);
  };

  const handleCommitQuestion = async () => {
    try {
      setAnswerLoadingState(true);
      let response;
      let result;
      if (currentState.question && updateMode) {
        response = await updateQuestion({
          variables: {
            id: currentState.question.id,
            questionText: questionText,
            questionType: questionType,
          }
        });
        result = response.data.updateQuestion;
      } else {
        response = await createQuestion({
          variables: {
            questionText: questionText,
            categoryId: currentState.category!.id,
            questionType: questionType,
          }
        });
        result = response.data.createQuestion;
      }

      setAnswerLoadingState(false);
      await refetchQuestions({
        ...result,
        loadingAnswer: false
      });
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  const handleNewQuestion = () => {
    setQuestionText("");
    if (currentState.question) {
      currentState.question.questionText = "";
    }
    currentState.answer = null;
    refetchQuestions(currentState);
  };

  const handleRevertChanges = () => {
    setQuestionText(currentState.question!.questionText);
  };

  const recordVoice = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        recorder.onstop = async () => {
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
              }
            );
        
            const result = await response.json();
            setQuestionText(result.responseBodyBatch[0])
          } catch (err) {
            console.error('Error uploading audio:', err);
          } finally {
            setIsProcessing(false);
          }
        
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
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

  const isCommitDisabled =
    questionText.trim() === "" ||
    questionText === currentState.question?.questionText;
  const isNewDisabled = !currentState.question;

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
        backgroundColor: 'background.paper',
        overflow: 'auto',
        ...styles.container[variant]
      }}
    >
      <StyledTextareaAutosize
        minRows={styles.textarea[variant].minRows}
        placeholder={
          isNewDisabled
            ? "Задайте новый вопрос категории " + currentState.category?.name
            : "Отредактируйте вопрос"
        }
        value={questionText}
        onChange={handleInputChange}
        style={{
          width: "96%",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "6px",
          resize: "none",
        }}
      />
      <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={handleNewQuestion} color="secondary" disabled={isNewDisabled}>
            <AddIcon />
          </IconButton>
          <FormControl size="small" sx={{ 
            minWidth: 100,
            '& .MuiSelect-select': {
              py: 0.5,
              fontSize: '0.875rem'
            }
          }}>
            <Select
              value={questionType}
              onChange={handleQuestionTypeChange}
              displayEmpty
              size="small"
            >
              <MenuItem value="QUESTION_WITH_TOPIC">Шпаргалка</MenuItem>
              <MenuItem value="SHORT_DIALOG">Свободный вопрос</MenuItem>
              <MenuItem value="ALGORITHM_TASK">Задача</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={recordVoice} color="primary">
            {isRecording ? <StopRounded /> : <VoiceChat />}
          </IconButton>
          {isProcessing && <CircularProgress size={24} />}
          {isRecording && <LinearProgress sx={{ width: 100 }} />}
        </Box>
        <Box sx={{ display: "flex", gap: "16px" }}>
          <IconButton onClick={handleRevertChanges} color="default"
            disabled={!currentState?.question || questionText === currentState.question.questionText}>
            <UndoIcon />
          </IconButton>
          <IconButton onClick={handleCommitQuestion} color="primary"
            disabled={isCommitDisabled}>
            <CheckIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
