import { useState } from "react";
import { CategoriesList } from "./CategoriesList";
import { QuestionsList } from "./QuestionsList";
import { QuestionDetail } from "./QuestionDetail";
import { AnswerDetail } from "./AnswerDetail";
import { useQuery } from "@apollo/client";
import { GET_QUESTIONS_BY_CATEGORY } from "../../graphql/queries";
import type { AppState, Category, Question, Answer } from "../../types";
import type {
  GetQuestionsByCategoryQuery,
  GetQuestionsByCategoryQueryVariables,
} from "../../graphql/types";
import {
  Box,
  Drawer,
  IconButton,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
} from "@mui/material";
import { TagList } from "../tags/TagList";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";

export const Library = () => {
  const [state, setState] = useState<AppState>({
    category: null,
    question: null,
    answer: null,
    loadingAnswer: false,
    editMode: false,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  const { refetch: updateQuestions } = useQuery<
    GetQuestionsByCategoryQuery,
    GetQuestionsByCategoryQueryVariables
  >(GET_QUESTIONS_BY_CATEGORY, {
    variables: { categoryId: state.category?.id },
    fetchPolicy: "network-only",
    skip: !state.category?.id,
  });

  const handleCategorySelect = (category: Category) => {
    setState({ ...state, category, question: null, answer: null });
  };

  const handleQuestionSelect = (question: Question) => {
    setState({ ...state, question, loadingAnswer: true });
  };

  const handleUpdateTags = (question: Question) => {
    setState({ ...state, question, loadingAnswer: false });
  };

  const handleAnswerUpdate = (answer: Answer | null) => {
    setState({ ...state, answer, loadingAnswer: false });
  };

  const setLoadingAnswer = (isLoading: boolean) => {
    setState({ ...state, loadingAnswer: isLoading });
  };

  const handleEditModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, editMode: event.target.checked });
  };

  const refetchQuestionsAndSetSelected = async (newState: AppState) => {
    await updateQuestions();
    setState((prevState) => ({
      ...prevState,
      question: newState.question,
      answer: newState.answer,
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 96px)", // 64px for header + 64px for footer
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerOpen ? 240 : 48,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? 240 : 48,
            boxSizing: 'border-box',
            transition: 'width 0.2s ease-in-out',
            overflowX: 'hidden',
            top: '48px', // высота хедера
            height: 'calc(100% - 48px)', // вычитаем высоту хедера
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: drawerOpen ? 'space-between' : 'center',
          p: 1,
          minHeight: '48px'
        }}>
          {drawerOpen && (
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              Настройки
            </Typography>
          )}
          <IconButton 
            onClick={() => setDrawerOpen(!drawerOpen)}
            size="small"
            sx={{ p: 0.5 }}
          >
            {drawerOpen ? <MenuIcon fontSize="small" /> : <SettingsIcon fontSize="small" />}
          </IconButton>
        </Box>
        <Divider />
        {drawerOpen && (
          <Box sx={{ p: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={state.editMode}
                  onChange={handleEditModeChange}
                  color="primary"
                  size="small"
                />
              }
              label="Edit mode"
              sx={{
                m: 0,
                "& .MuiFormControlLabel-label": {
                  fontSize: "0.875rem",
                },
              }}
            />
            {/* Здесь будут дополнительные фильтры */}
          </Box>
        )}
      </Drawer>
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
