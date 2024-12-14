import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import {Config} from '@/theme';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';

type InputCustomProps = {
  title?: string;
  value?: string;
  placeholder?: string;
  type?: 'text' | 'select';
  isBottomSheet?: boolean;
  onPress?: () => void;
  onChange?: (value: string) => void;
  onLayout?: (event: any) => void;
} & TextInputProps;

const InputCustom = ({
  title,
  value,
  placeholder,
  type = 'text',
  isBottomSheet,
  onPress,
  onChange,
  onLayout,
  ...textInputProps
}: InputCustomProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const renderTextInput = (
    <TextInput
      selectionColor={Config.green}
      style={styles.textInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onLayout={onLayout}
      {...textInputProps}
    />
  );

  const renderBottomSheetTextInput = (
    <BottomSheetTextInput
      selectionColor={Config.green}
      style={styles.textInput}
      placeholder={placeholder}
      value={value}
      onChangeText={onChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onLayout={onLayout}
      {...textInputProps}
    />
  );

  if (isBottomSheet) {
    return (
      <View style={[styles.container, isFocused && styles.focusedContainer]}>
        {renderBottomSheetTextInput}
      </View>
    );
  }

  return (
    <View style={[styles.container, isFocused && styles.focusedContainer]}>
      {type === 'text' ? (
        renderTextInput
      ) : (
        <TouchableOpacity style={styles.selectInput} onPress={onPress}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{value}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: Config.lightGray,
    marginBottom: 15,
    minHeight: 44,
  },
  focusedContainer: {
    borderBottomColor: 'black',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    fontSize: 14,
    fontWeight: '400',
  },
  textInput: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 19.2,
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
});

export default InputCustom;
