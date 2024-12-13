import {useSelector} from 'react-redux';
import {RootState} from '..';

const useTodosSelector = () =>
  useSelector((state: RootState) => state.todos.todos);

export {useTodosSelector};
