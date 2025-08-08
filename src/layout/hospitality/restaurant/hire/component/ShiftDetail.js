import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import MFooter from '../../../../../components/Mfooter';
import MHeader from '../../../../../components/Mheader';
import { RFValue } from 'react-native-responsive-fontsize';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateShiftType, deleteShiftType } from '../../../../../utils/useApi';

const { height } = Dimensions.get('window');

const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const parseTime = (timeString) => {
  const date = new Date();
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  date.setHours(hours, minutes, 0, 0);
  return date;
};

export default function ShiftDetailScreen({ route, navigation }) {
  const { shift } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(shift.name);
  const [start, setStart] = useState(parseTime(shift.start));
  const [end, setEnd] = useState(parseTime(shift.end));
  const [currentShift, setCurrentShift] = useState(route.params.shift);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const isChanged =
    name !== shift.name ||
    formatTime(start) !== shift.start ||
    formatTime(end) !== shift.end;

  const saveChanges = async () => {
    const aic = await AsyncStorage.getItem('aic');

    const body = {
      aic: parseInt(aic, 10),
      shiftId: shift.id,
      updatedShift: {
        name,
        start: formatTime(start),
        end: formatTime(end),
      },
    };

    const res = await updateShiftType(body, 'restau_manager');
    if (!res.error) {
      setCurrentShift({ id: shift.id, name, start: formatTime(start), end: formatTime(end) });
      setModalVisible(false);
    } else {
      console.warn('Update failed:', res.error);
    }
  };

  const deleteShift = () => {
    Alert.alert('Delete Shift', 'Are you sure you want to delete this shift?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const aic = await AsyncStorage.getItem('aic');
          const body = {
            aic: parseInt(aic, 10),
            shiftId: shift.id,
          };

          const res = await deleteShiftType(body, 'restau_manager');

          if (!res.error) {
            navigation.navigate('HospitalityRestaurantHireSchedulerScreen', { screen: 'ShiftTab' });
          } else {
            console.warn('Delete failed:', res.error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <MHeader back />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={deleteShift}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.nameSection}>
        <Text style={styles.label}>
          Label: <Text style={styles.value}>{currentShift.name}</Text>
        </Text>
        <Text style={styles.label}>
          Time: <Text style={styles.value}>{currentShift.start} → {currentShift.end}</Text>
        </Text>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Shift</Text>

            <TextInput
              placeholder="Name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
              style={styles.modalInput}
            />

            <View style={{ width: '100%' }}>
              <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.fullWidthTouchable}>
                <TextInput
                  value={formatTime(start)}
                  style={[styles.modalInput, styles.fullWidthInput]}
                  editable={false}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.fullWidthTouchable}>
                <TextInput
                  value={formatTime(end)}
                  style={[styles.modalInput, styles.fullWidthInput]}
                  editable={false}
                />
              </TouchableOpacity>
            </View>


            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { opacity: isChanged ? 1 : 0.5 }]}
                onPress={saveChanges}
                disabled={!isChanged}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={start}
            mode="time"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStart(selectedDate);
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={end}
            mode="time"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) setEnd(selectedDate);
            }}
          />
        )}
      </Modal>

      <MFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: RFValue(16),
    marginTop: height * 0.18,
  },
  editBtn: {
    flexDirection: 'row',
    backgroundColor: '#CBD5E1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginEnd: 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  editText: { color: '#000', fontWeight: '600' },
  deleteBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  deleteText: { color: '#fff', fontWeight: '600' },
  nameSection: { paddingHorizontal: 16, marginTop: 20 },
  label: { fontSize: 15, color: '#666', marginBottom: 4 },
  value: { fontSize: 16, color: '#000', fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000077',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  modalInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    padding: 12,
    color: '#000',
    width: '100%',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginRight: 6,
    alignItems: 'center',
  },
  cancelText: { color: '#000', fontWeight: '500' },
  saveBtn: {
    flex: 1,
    backgroundColor: '#290135',
    padding: 12,
    borderRadius: 6,
    marginLeft: 6,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold' },
});
