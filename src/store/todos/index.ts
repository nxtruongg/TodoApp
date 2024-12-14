import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {EPriority, Todo, TodoState} from './interface';

const priorityOrder: Record<EPriority, number> = {
  [EPriority.High]: 1,
  [EPriority.Medium]: 2,
  [EPriority.Low]: 3,
};

const sortTodos = (todos: Todo[]): Todo[] => {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    if (!a.completed && !b.completed) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (a.completed && b.completed) {
      return (
        new Date(b.date_updated).getTime() - new Date(a.date_updated).getTime()
      );
    }
    return 0;
  });
};

const initialState: TodoState = {
  todos: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
      state.todos = sortTodos(state.todos);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(
        todo => todo.id === action.payload.id,
      );
      if (index !== -1) {
        state.todos[index] = action.payload;
        state.todos = sortTodos(state.todos);
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
  },
});

export const {addTodo, updateTodo, deleteTodo} = todoSlice.actions;

export default todoSlice.reducer;
