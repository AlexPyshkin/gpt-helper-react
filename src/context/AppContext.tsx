import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Tag } from '../graphql/types';

// Types
export interface Filters {
  editMode: boolean;
  tagFilter: string;
}

interface AppState {
  user: User | null;
  filters: Filters;
  category: Category | null;
  question: Question | null;
  answer: Answer | null;
  loadingAnswer: boolean;
}

interface Category {
  id: string;
  name: string;
  // Add other category properties as needed
}

interface Question {
  id: string;
  title: string;
  // Add other question properties as needed
}

interface Answer {
  id: string;
  content: string;
  // Add other answer properties as needed
}

// Action types
type Action =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_FILTERS'; payload: Partial<Filters> }
  | { type: 'APPLY_FILTERS'; payload: { tagFilter: string } }
  | { type: 'SET_CATEGORY'; payload: Category | null }
  | { type: 'SET_QUESTION'; payload: Question | null }
  | { type: 'SET_ANSWER'; payload: Answer | null }
  | { type: 'SET_LOADING_ANSWER'; payload: boolean };

// Initial state
const initialState: AppState = {
  user: null,
  filters: {
    editMode: false,
    tagFilter: '',
  },
  category: null,
  question: null,
  answer: null,
  loadingAnswer: false,
};

// Reducer
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'APPLY_FILTERS':
      return { ...state, filters: { ...state.filters, tagFilter: action.payload.tagFilter } };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload, question: null, answer: null };
    case 'SET_QUESTION':
      return { ...state, question: action.payload, loadingAnswer: true };
    case 'SET_ANSWER':
      return { ...state, answer: action.payload, loadingAnswer: false };
    case 'SET_LOADING_ANSWER':
      return { ...state, loadingAnswer: action.payload };
    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 