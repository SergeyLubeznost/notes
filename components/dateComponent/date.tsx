import React, { useState } from 'react';
import { View, Button, Text, Platform } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
  AndroidNativeProps,
  IOSNativeProps
} from '@react-native-community/datetimepicker';

type PickerMode = 'date' | 'time';

interface DateTimePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const DateTimePickerExample: React.FC<DateTimePickerProps> = ({ date, onDateChange }) => {
  const [mode, setMode] = useState<PickerMode>('date');
  const [show, setShow] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    onDateChange(currentDate);
  };

  const showMode = (currentMode: PickerMode) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <View style={{ padding: 10 }}>
      <Text>Выбрано: {date.toLocaleString()}</Text>
      
      <View style={{ flexDirection: 'row' }}>
        <Button title="Дата" onPress={() => showMode('date')} />
        <Button title="Время" onPress={() => showMode('time')} />
      </View>

      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          locale="ru_RU"
        />
      )}
    </View>
  );
};

export default DateTimePickerExample;