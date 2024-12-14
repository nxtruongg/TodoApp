export enum EPriority {
  High = 'Cao',
  Medium = 'Trung bình',
  Low = 'Thấp',
}

export interface Todo {
  id: string;
  title: string;
  date_created?: any;
  date_updated?: any;
  due_date: any;
  priority: EPriority;
  completed?: boolean;
}
export interface TodoState {
  todos: Todo[];
}
