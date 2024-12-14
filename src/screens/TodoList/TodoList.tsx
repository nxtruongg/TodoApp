import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Animated, {LinearTransition} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';

import {AddIcon} from '@/assets/svg';
import {InputCustom} from '@/components/atoms';
import {TodoItem} from '@/components/modules';
import {addTodo} from '@/store/todos';
import {EPriority, Todo} from '@/store/todos/interface';
import {useTodosSelector} from '@/store/todos/selectors';
import {Config} from '@/theme';
import {formatDate} from '@/utils';

const WINDOW_WIDTH = Dimensions.get('screen').width;

enum ETab {
  FORM = 'FORM',
  PRIORITY = 'PRIORITY',
}

const ListEmptyComponent = () => {
  return (
    <View style={styles.emptyContainer}>
      <Text>Bạn chưa có nhiệm vụ nào.</Text>
    </View>
  );
};

const TodoList = () => {
  const todos = useTodosSelector();
  const dispatch = useDispatch();

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const tabFlatListRef = useRef<FlatList>(null);

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState(EPriority.High);
  const [name, setName] = useState<string>('');

  const priorityValues = Object.values(EPriority);

  const reset = useCallback(() => {
    setDate(new Date());
    setPriority(EPriority.High);
    setName('');
  }, []);

  const submit = useCallback(() => {
    try {
      const now = new Date();
      const todo: Todo = {
        id: now.toString(),
        title: name,
        date_created: now.toISOString(),
        date_updated: now.toISOString(),
        due_date: date.toISOString(),
        priority,
      };
      dispatch(addTodo(todo));
      reset();
    } catch (error) {
      Alert.alert('Error');
    } finally {
      bottomSheetRef.current?.close();
    }
  }, [name, date, priority, dispatch, reset]);

  // priority
  const handlePriority = (pri: EPriority) => {
    setPriority(pri);
    handleBack();
  };

  const handleBack = () => {
    tabFlatListRef.current?.scrollToIndex({index: 0});
  };

  // Backdrop
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        disappearsOnIndex={-1}
        opacity={0.8}
        appearsOnIndex={0}
        {...props}
      />
    ),
    [],
  );

  // Tab
  const tabs = [
    {
      key: ETab.FORM,
      content: (
        <>
          <InputCustom
            placeholder="Nhập tên task"
            isBottomSheet
            value={name}
            autoFocus
            onChange={setName}
          />
          <InputCustom
            type="select"
            title="Thời hạn"
            value={formatDate(date)}
            onPress={() => setShowDateTimePicker(true)}
          />
          <InputCustom
            type="select"
            title="Mức độ ưu tiên"
            value={priority}
            onPress={() => tabFlatListRef.current?.scrollToIndex({index: 1})}
          />
          <TouchableOpacity
            disabled={!name}
            style={[styles.submitButton, !name && styles.disable]}
            onPress={submit}>
            <Text style={styles.submitText}>Xong</Text>
          </TouchableOpacity>
        </>
      ),
    },
    {
      key: ETab.PRIORITY,
      content: (
        <>
          {priorityValues.map(priorityValue => (
            <TouchableOpacity
              key={priorityValue}
              onPress={() => handlePriority(priorityValue)}
              style={styles.priority}>
              <Text>{priorityValue}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.submitButton} onPress={handleBack}>
            <Text>Quay lại</Text>
          </TouchableOpacity>
        </>
      ),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        layout={LinearTransition}
        //itemLayoutAnimation={LinearTransition.duration(1)}
        data={todos}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TodoItem {...item} />}
        style={styles.flatList}
        initialNumToRender={16}
        maxToRenderPerBatch={8}
        windowSize={24}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => bottomSheetRef.current?.present()}>
        <Text style={styles.text}>Tạo Task mới</Text>
        <AddIcon />
      </TouchableOpacity>

      <DatePicker
        mode="date"
        modal
        open={showDateTimePicker}
        date={date}
        onConfirm={setDate}
        onCancel={() => setShowDateTimePicker(false)}
      />

      <BottomSheetModal ref={bottomSheetRef} backdropComponent={renderBackdrop}>
        <BottomSheetView style={styles.bottomSheetContainer}>
          <FlatList
            ref={tabFlatListRef}
            data={tabs}
            keyExtractor={item => item.key}
            horizontal
            scrollEnabled={false}
            renderItem={({item}) => (
              <View style={styles.tab}>{item.content}</View>
            )}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default TodoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Config.backgrounds,
    paddingTop: StatusBar.currentHeight,
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    gap: 12,
    // height: WINDOW_HEIGHT,
  },
  addButton: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 22,
    height: 44,
    flexDirection: 'row',
    gap: 4,
    backgroundColor: Config.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Config.white,
  },
  bottomSheetContainer: {
    paddingVertical: 44,
  },
  submitButton: {
    backgroundColor: Config.green,
    borderRadius: 22,
    marginHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  submitText: {
    color: Config.white,
  },
  tab: {
    width: WINDOW_WIDTH,
    paddingHorizontal: 24,
  },
  priority: {
    width: '100%',
    paddingVertical: 12,
  },
  disable: {
    backgroundColor: Config.disable,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50%',
  },
});
