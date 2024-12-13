export enum EPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}
export interface Todo {
  id: string;
  title: string;
  date_created: Date;
  date_updated: Date;
  due_date: Date;
  priority: EPriority;
}
export interface TodoState {
  todos: Todo[];
}
