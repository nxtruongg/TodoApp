import {Config} from '@/theme';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

const TodoList = () => {
  return <SafeAreaView style={styles.container}></SafeAreaView>;
};

export default TodoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.backgrounds,
  },
});
