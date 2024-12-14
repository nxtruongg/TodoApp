import {Config} from '@/theme';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

interface CheckboxProps {
  checked?: boolean;
  onToggle?: (checked: boolean) => void;
}

const Checkbox = ({checked = false, onToggle}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const toggleCheckbox = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onToggle) {
      onToggle(newCheckedState);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, isChecked && styles.checkedContainer]}
      onPress={toggleCheckbox}
      activeOpacity={0.8}>
      {isChecked && <View style={styles.checkMark} />}
    </TouchableOpacity>
  );
};

export default Checkbox;

const styles = StyleSheet.create({
  container: {
    width: 22,
    height: 22,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Config.lightGray,
  },
  checkedContainer: {},
  checkMark: {
    width: 10,
    height: 10,
    backgroundColor: Config.green,
    borderRadius: 2,
  },
});
