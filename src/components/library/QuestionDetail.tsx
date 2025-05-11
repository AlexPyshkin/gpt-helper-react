import { Box, IconButton } from "@mui/material";
import TextareaAutosize from "react-textarea-autosize";
import { useState, useEffect, ChangeEvent } from "react";
import { useMutation } from '@apollo/client';
import { CREATE_QUESTION, UPDATE_QUESTION } from "../../graphql/queries";
import AddIcon from "@mui/icons-material/Add";
import UndoIcon from "@mui/icons-material/Undo";
import CheckIcon from "@mui/icons-material/Check";
import { AppState } from "../../types";
import { StopRounded, VoiceChat } from "@mui/icons-material";

type CategoriesListProps = {
  currentState: AppState;
  refetchQuestions: (newState: AppState) => Promise<void>;
  setAnswerLoadingState: (isLoading: boolean) => void;
};

export const QuestionDetail = ({
  currentState,
  refetchQuestions,
  setAnswerLoadingState,
}: CategoriesListProps) => {
  const [createQuestion] = useMutation(CREATE_QUESTION);
  const [updateQuestion] = useMutation(UPDATE_QUESTION);
  const [questionText, setQuestionText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

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

  const handleCommitQuestion = async () => {
    try {
      setAnswerLoadingState(true);
      let response;
      let result;
      if (currentState.question) {
        response = await updateQuestion({
          variables: {
            id: currentState.question.id,
            questionText: questionText,
          }
        });
        result = response.data.updateQuestion;
      } else {
        response = await createQuestion({
          variables: {
            questionText: questionText,
            categoryId: currentState.category!.id,
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
    currentState.question = null;
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
          const audioBlob = new Blob(chunks, { type: 'audio/ogg' }); // можно webm, но для совместимости возьмем ogg
        
          const formData = new FormData();
          formData.append('uploaded_file', audioBlob, 'recording.ogg');
        
          try {
            const response = await fetch('http://localhost:9099/transcribe?lang=ru&temperature=0.2&beam_size=5', {
              method: 'POST',
              body: formData,
            });
        
            const result = await response.json();
            console.log('Response:', result);
            setQuestionText(result.responseBodyBatch[0])
          } catch (err) {
            console.error('Error uploading audio:', err);
          }
        
          setAudioChunks([]);
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setAudioChunks(chunks);
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
        backgroundColor: '#f9f9f9',
        minHeight: '20%',
        height: '30%',
        overflow: 'auto',
      }}
    >
      <TextareaAutosize
        minRows={30}
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleNewQuestion} sx={{ marginTop: "16px" }} color="secondary" disabled={isNewDisabled}>
            <AddIcon />
          </IconButton>
        </Box>
        <IconButton onClick={recordVoice} sx={{ marginTop: "16px" }} color="primary">
          {isRecording ? <StopRounded /> : <VoiceChat />}
        </IconButton>
        <Box sx={{ display: "flex", gap: "16px" }}>
          <IconButton onClick={handleRevertChanges} sx={{ marginTop: "16px" }} color="default"
            disabled={!currentState?.question || questionText === currentState.question.questionText}>
            <UndoIcon />
          </IconButton>
          <IconButton onClick={handleCommitQuestion} sx={{ marginTop: "16px" }} color="primary"
            disabled={isCommitDisabled}>
            <CheckIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
