import {Config} from '@/theme';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

const Checkbox = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <></>
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: Config.lightGray,
  },
});
