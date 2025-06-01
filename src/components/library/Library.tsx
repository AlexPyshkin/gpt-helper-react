import { CategoriesList } from "./CategoriesList";
import { QuestionsList } from "./QuestionsList";
import { QuestionDetail } from "./QuestionDetail";
import { AnswerDetail } from "./AnswerDetail";
import { useQuery } from "@apollo/client";
import { GET_QUESTIONS_BY_CATEGORY } from "../../graphql/queries";
import type { Category, Question, Answer } from "../../types";
import type {
  GetQuestionsByCategoryQuery,
  GetQuestionsByCategoryQueryVariables,
} from "../../graphql/types";
import { Box } from "@mui/material";
import { TagList } from "../tags/TagList";
import { useAppContext } from "../../context/AppContext";

export const Library = () => {
  const { state, dispatch } = useAppContext();

  const { refetch: updateQuestions } = useQuery<
    GetQuestionsByCategoryQuery,
    GetQuestionsByCategoryQueryVariables
  >(GET_QUESTIONS_BY_CATEGORY, {
    variables: {
      categoryId: state.category?.id,
      tagFilter: state.filters.tagFilter,
    },
    fetchPolicy: "network-only",
    skip: !state.category?.id,
  });

  const handleCategorySelect = (category: Category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
  };

  const handleQuestionSelect = (question: Question) => {
    dispatch({ type: 'SET_QUESTION', payload: question });
  };

  const handleUpdateTags = (question: Question) => {
    dispatch({ type: 'SET_QUESTION', payload: question });
    dispatch({ type: 'SET_LOADING_ANSWER', payload: false });
  };

  const handleAnswerUpdate = (answer: Answer | null) => {
    dispatch({ type: 'SET_ANSWER', payload: answer });
  };

  const setLoadingAnswer = (isLoading: boolean) => {
    dispatch({ type: 'SET_LOADING_ANSWER', payload: isLoading });
  };

  const refetchQuestionsAndSetSelected = async (newState: { question: Question | null; answer: Answer | null }) => {
    await updateQuestions();
    dispatch({ type: 'SET_QUESTION', payload: newState.question });
    dispatch({ type: 'SET_ANSWER', payload: newState.answer });
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 96px)",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "30%",
            minWidth: "300px",
            height: "100%",
          }}
        >
          <CategoriesList
            onSelectCategory={handleCategorySelect}
            currentState={state}
          />
          <QuestionDetail
            currentState={state}
            refetchQuestions={refetchQuestionsAndSetSelected}
            setAnswerLoadingState={setLoadingAnswer}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "70%",
            height: "100%",
          }}
        >
          <QuestionsList
            currentState={state}
            onSelectQuestion={handleQuestionSelect}
            setAnswerForQuestion={handleAnswerUpdate}
          />
          <AnswerDetail currentState={state} />
        </Box>
        {state.question && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "20%",
              height: "100%",
            }}
          >
            <TagList
              currentState={state}
              onUpadeTagsQuestion={handleUpdateTags}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
