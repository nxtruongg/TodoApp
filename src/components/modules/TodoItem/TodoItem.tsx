import {DeleteIcon, PenIcon} from '@/assets/svg';
import {Checkbox} from '@/components/atoms';
import InputCustom from '@/components/atoms/InputCustom/InputCustom';
import {deleteTodo, updateTodo} from '@/store/todos';
import {EPriority, Todo} from '@/store/todos/interface';
import {Config} from '@/theme';
import {formatDate, getRelativeDate} from '@/utils';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useDispatch} from 'react-redux';

const VIEW_ITEM_HEIGHT = 114;
const EDIT_ITEM_HEIGHT = 299;

const PriorityColors: Record<EPriority, string> = {
  [EPriority.High]: '#FF4D4F',
  [EPriority.Medium]: '#FAAD14',
  [EPriority.Low]: '#52C41A',
};

const PriorityPicker = React.memo(
  ({
    onSelect,
    selected,
  }: {
    onSelect: (value: EPriority) => void;
    selected: EPriority;
  }) => (
    <BottomSheetView style={styles.bottomSheet}>
      {Object.values(EPriority).map(priorityValue => (
        <TouchableOpacity
          key={priorityValue}
          style={[
            styles.priority,
            selected === priorityValue && styles.selectedPriority,
          ]}
          onPress={() => onSelect(priorityValue)}>
          <Text>{priorityValue}</Text>
        </TouchableOpacity>
      ))}
    </BottomSheetView>
  ),
);

const TodoItem = ({
  id,
  title: name,
  due_date: dueDate,
  priority: level,
  completed: checked,
}: Todo) => {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(name);
  const [due_date, setDueDate] = useState(new Date(dueDate));
  const [priority, setPriority] = useState(level);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const height = useSharedValue(VIEW_ITEM_HEIGHT);
  const viewOpacity = useSharedValue(1);
  const editOpacity = useSharedValue(0);

  const handleEdit = () => {
    const editingState = !isEditing;
    height.value = withTiming(
      editingState ? EDIT_ITEM_HEIGHT : VIEW_ITEM_HEIGHT,
      {duration: 400, easing: Easing.ease},
    );
    viewOpacity.value = withTiming(editingState ? 0 : 1, {duration: 600});
    editOpacity.value = withTiming(editingState ? 1 : 0, {duration: 600});
    setIsEditing(editingState);
  };

  const save = () => {
    dispatch(
      updateTodo({id, title, due_date: due_date.toISOString(), priority}),
    );
    handleEdit();
  };

  const handleCheck = todoChecked => {
    dispatch(
      updateTodo({
        id,
        completed: todoChecked,
        title,
        priority,
        due_date: due_date.toISOString(),
      }),
    );
  };

  const handleDelete = () => dispatch(deleteTodo(id));

  const containerStyle = useAnimatedStyle(() => ({height: height.value}));
  const viewStyle = useAnimatedStyle(() => ({opacity: viewOpacity.value}));
  const editStyle = useAnimatedStyle(() => ({opacity: editOpacity.value}));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* View */}
      <Animated.View
        style={[styles.viewContainer, viewStyle]}
        pointerEvents={isEditing ? 'none' : 'auto'}>
        <View style={styles.checkboxContainer}>
          <Checkbox checked={checked} onToggle={handleCheck} />
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Text numberOfLines={2} style={styles.name}>
              {name}
            </Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <PenIcon />
            </TouchableOpacity>
          </View>
          <View style={styles.detail}>
            <Text
              style={[styles.priorityText, {color: PriorityColors[priority]}]}>
              Ưu tiên {priority}
            </Text>
            <Text style={styles.date}>{getRelativeDate(due_date)}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Edit  */}
      <Animated.View
        style={[styles.editContainer, editStyle]}
        pointerEvents={isEditing ? 'auto' : 'none'}>
        <TouchableOpacity style={styles.delete} onPress={handleDelete}>
          <DeleteIcon />
          <Text>Xoá</Text>
        </TouchableOpacity>
        <InputCustom value={title} onChange={setTitle} autoFocus />
        <InputCustom
          type="select"
          title="Thời hạn"
          value={formatDate(due_date)}
          onPress={() => setShowDateTimePicker(true)}
        />
        <InputCustom
          type="select"
          title="Mức độ ưu tiên"
          value={priority}
          onPress={() => bottomSheetRef.current?.present()}
        />
        <TouchableOpacity style={styles.button} onPress={save}>
          <Text style={styles.textButton}>Xong</Text>
        </TouchableOpacity>
      </Animated.View>

      <DatePicker
        modal
        open={showDateTimePicker}
        date={due_date}
        onConfirm={date => {
          setDueDate(date);
          setShowDateTimePicker(false);
        }}
        onCancel={() => setShowDateTimePicker(false)}
      />

      <BottomSheetModal
        ref={bottomSheetRef}
        backdropComponent={props => <BottomSheetBackdrop {...props} />}>
        <PriorityPicker
          selected={priority}
          onSelect={value => {
            setPriority(value);
            bottomSheetRef.current?.close();
          }}
        />
      </BottomSheetModal>
    </Animated.View>
  );
};

export default React.memo(TodoItem);

const styles = StyleSheet.create({
  container: {
    width: 327,
    alignSelf: 'center',
    backgroundColor: Config.white,
    borderRadius: 15,
    overflow: 'hidden',
  },
  viewContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 32,
    zIndex: 1,
  },
  editContainer: {
    position: 'absolute',
    padding: 20,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  checkboxContainer: {
    marginLeft: 18,
  },
  detailsContainer: {
    flex: 1,
    marginHorizontal: 16,
    gap: 12,
  },
  detail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    width: '80%',
  },
  priorityText: {
    fontSize: 12,
  },
  date: {
    fontSize: 10,
  },
  delete: {
    flexDirection: 'row',
    gap: 4,
    alignSelf: 'flex-end',
  },
  button: {
    backgroundColor: Config.green,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  textButton: {
    color: Config.white,
  },
  bottomSheet: {
    padding: 16,
    paddingBottom: 44,
  },
  priority: {
    padding: 12,
  },
  selectedPriority: {
    backgroundColor: '#e6f7ff',
  },
  editButton: {
    padding: 8,
    paddingTop: 0,
  },
});
