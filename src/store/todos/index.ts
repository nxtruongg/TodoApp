import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Todo, TodoState} from './interface';

const initialState: TodoState = {
  todos: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
      state.todos.sort((a, b) => b.priority.localeCompare(a.priority));
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.findIndex(
        todo => todo.id === action.payload.id,
      );
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
  },
});

export const {addTodo, updateTodo, deleteTodo} = todoSlice.actions;

export default todoSlice.reducer;
