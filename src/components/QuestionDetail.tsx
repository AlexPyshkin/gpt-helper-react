import { Box, IconButton } from "@mui/material";
import TextareaAutosize from "react-textarea-autosize";
import { useState, useEffect, ChangeEvent } from "react";
import { GraphQLClient } from "graphql-request";
import { CREATE_QUESTION, UPDATE_QUESTION } from "../graphql/queries";
import AddIcon from "@mui/icons-material/Add";
import UndoIcon from "@mui/icons-material/Undo";
import CheckIcon from "@mui/icons-material/Check";
import { AppState } from "../types";
import type {
  UpdateQuestionMutation,
  UpdateQuestionMutationVariables,
  CreateQuestionMutation,
  CreateQuestionMutationVariables,
} from "../graphql/types";

const client = new GraphQLClient("http://localhost:9094/graphql"); // Replace with your backend URL

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
  const [questionText, setQuestionText] = useState("");

  useEffect(() => {
    if (currentState.question) {
      setQuestionText(currentState.question.questionText); // Fill the question text when selected
    } else {
      setQuestionText(""); // Clear text if no question is selected
    }
  }, [currentState.question]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionText(event.target.value); // Update state on text change
  };

  const handleCommitQuestion = async () => {
    try {
      setAnswerLoadingState(true);
      let response; // Variable to store response
      let result;
      if (currentState.question) {
        // Update existing question
        const variables = {
          id: currentState.question.id,
          questionText: questionText,
        };
        response = await client.request<
          UpdateQuestionMutation,
          UpdateQuestionMutationVariables
        >(UPDATE_QUESTION, variables);
        result = response.updateQuestion;
      } else {
        // Create new question
        const variables = {
          questionText: questionText,
          categoryId: currentState.category!.id,
        };
        response = await client.request<
          CreateQuestionMutation,
          CreateQuestionMutationVariables
        >(CREATE_QUESTION, variables);
        result = response.createQuestion;
      }
      // Refetch questions after creating/updating
      console.log(response);
      console.log(result);

      setAnswerLoadingState(false);
      await refetchQuestions({
        ...result,
        loadingAnswer: false
      });
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  // New function to clear the question and reset state
  const handleNewQuestion = () => {
    setQuestionText(""); // Clear the question text
    currentState.question = null; // Reset selected question
    currentState.answer = null; // Reset answer
    refetchQuestions(currentState); // Optionally refetch questions if needed
  };

  // New function to revert changes to the original question text
  const handleRevertChanges = () => {
    setQuestionText(currentState.question!.questionText); // Reset question text to original
  };

  // Determine if buttons should be disabled
  const isCommitDisabled =
    questionText.trim() === "" ||
    questionText === currentState.question?.questionText; // Disable if question text is empty or unchanged
  const isNewDisabled = !currentState.question; // Disable if no question is selected

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px",
        backgroundColor: "#f9f9f9",
        height: "80vh", // Set height to 80% of viewport height
        overflow: "auto",
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
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: "4px",
          padding: "8px",
          marginBottom: "16px",
          resize: "none", // Prevent manual resizing
        }}
      />
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            // variant="outlined"
            onClick={handleNewQuestion}
            sx={{ marginTop: "16px" }}
            color="secondary"
            disabled={isNewDisabled} // Disable if no question is selected
          >
            <AddIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", gap: "16px" }}>
          <IconButton
            // variant="outlined"
            onClick={handleRevertChanges}
            sx={{ marginTop: "16px" }}
            color="default"
            disabled={
              !currentState?.question ||
              questionText === currentState.question.questionText
            } // Disable if the text is already the original
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            // variant="contained"
            onClick={handleCommitQuestion}
            sx={{ marginTop: "16px" }}
            color="primary"
            disabled={isCommitDisabled} // Disable if question text is empty or unchanged
          >
            <CheckIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
