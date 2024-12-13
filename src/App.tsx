import 'react-native-gesture-handler';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import {TodoList} from '@/screens';
import {Provider} from 'react-redux';
import {store} from './store';

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <StatusBar barStyle={'light-content'} />
        <TodoList />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;
