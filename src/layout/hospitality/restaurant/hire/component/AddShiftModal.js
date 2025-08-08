import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addShiftType } from '../../../../../utils/useApi'; // Create this function below

const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function AddShiftModal({ visible, onClose, onReload }) {
  const [name, setName] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);


  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Validation', 'Please enter a name.');
      return;
    }

    if (!startTime || !endTime) {
      setError('Start and end time must be selected');
      return;
    }
    if (endTime <= startTime) {
      setError('End time must be later than start time');
      return;
    }
    if (endTime <= startTime) {
      setError('End time must be later than start time');
      return;
    }

    const aic = await AsyncStorage.getItem('aic');
    const body = {
      aic: parseInt(aic, 10),
      name,
      start: formatTime(startTime),
      end: formatTime(endTime),
    };

    const response = await addShiftType(body, 'restau_manager');
    if (response.error) {
      setError("Failed to add shift.");
    } else {
      onClose();
      onReload(); 
      setName('');
      setError('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Shift Type</Text>

          <TextInput
            placeholder="Shift name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <TextInput
              placeholder="Start time (e.g. 8:00 AM)"
              style={[
                styles.input,
                { fontWeight: startTime ? 'bold' : 'normal', color: '#000' }
              ]}
              value={startTime ? formatTime(startTime) : ''}
              editable={false}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <TextInput
              placeholder="End time (e.g. 4:00 PM)"
              style={[
                styles.input,
                { fontWeight: endTime ? 'bold' : 'normal', color: '#000' }
              ]}
              value={endTime ? formatTime(endTime) : ''}
              editable={false}
            />
          </TouchableOpacity>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => {
                setName('');
                setStartTime(null);
                setEndTime(null);
                setError('');
                onClose();
              }}
              style={styles.cancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={styles.submit}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startTime || new Date()}  // ← fallback
              mode="time"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) setStartTime(selectedDate);
              }}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endTime || new Date()}  // ← fallback
              mode="time"
              display="spinner"
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setEndTime(selectedDate);
              }}
            />
          )}

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '85%',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ccc',
    borderRadius: 6,
  },
  cancelText: {
    fontWeight: 'bold',
  },
  submit: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#290135',
    borderRadius: 6,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
