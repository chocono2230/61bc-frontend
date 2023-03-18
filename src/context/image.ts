import React, { useReducer, createContext, ReactNode } from 'react';
import { Base64Image } from '../api/types/image';

const initialState = new Map<string, Base64Image>();

const Base64ImageContext = createContext<Map<string, Base64Image>>(initialState);
const Base64ImageDispatchContext = React.Dispatch<React.SetStateAction<Map<string, Base64Image> | null>>(null);
type Props = {
  children: ReactNode;
};

export const TasksProvider = (props: Props) => {
  const { children } = props;
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>{children}</TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
};
