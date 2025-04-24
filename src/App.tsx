import { useState } from 'react';
import { CategoriesList } from './components/CategoriesList';
import { QuestionsList } from './components/QuestionsList';
import { QuestionDetail } from './components/QuestionDetail';
import { AnswerDetail } from './components/AnswerDetail';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import './App.css'; // Importing a new CSS file for layout styles
import { useQuery } from '@apollo/client';
import { GET_QUESTIONS_BY_CATEGORY } from './graphql/queries';

export const App = () => {
  const [state, setState] = useState({
    category: null,
    question: null,
    answer: null,
    loadingAnswer: false,
  });

  const { refetch: updateQuestions } = useQuery(GET_QUESTIONS_BY_CATEGORY, {
    variables: { categoryId: state.category ? state.category.id : null },
    fetchPolicy: 'network-only', // Disable caching
  });

  const handleCategorySelect = (category) => {
    setState({ ...state, category, question: null, answer: null });
  };

  const handleQuestionSelect = (question) => {
    setState({ ...state, question: question, loadingAnswer: true });
  };

  const handleAnswerUpdate = (answer) => {
    setState({ ...state, answer, loadingAnswer: false });
  };

  const setLoadingAnswer = (isLoading) => {
    setState({...state, loadingAnswer: isLoading});
  }
  const refetchQuestionsAndSetSelected = async (newState) => {
    await updateQuestions();
    setState((prevState) => ({ ...prevState, question: newState.question, answer: newState.answer })); // Reset selected question after refetch
  };

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div className="content" style={{ display: 'flex', flex: 1 }}>
        <div className="left" style={{ width: '20%', padding: '16px' }}>
          <CategoriesList 
            onSelectCategory={handleCategorySelect} 
            currentState={state}
          />
          <QuestionDetail 
            currentState={state}
            refetchQuestions={refetchQuestionsAndSetSelected}
            setAnswerLoadingState={setLoadingAnswer}
          />
        </div>
        <div className="right" style={{ width: '80%', padding: '16px' }}>
          <QuestionsList 
            currentState={state} 
            onSelectQuestion={handleQuestionSelect}
            setAnswerForQuestion={handleAnswerUpdate}
          />
          <AnswerDetail currentState={state} />
        </div>
      </div>
      <Footer className="footer" />
    </div>
  );
};
