import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
} from 'react-native';
import MFooter from '../../../../../components/Mfooter';
import MHeader from '../../../../../components/Mheader';
import { RFValue } from 'react-native-responsive-fontsize';

const { height } = Dimensions.get('window');

export default function ShiftDetailScreen({ route, navigation }) {
  const { shift } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState(shift.name);
  const [start, setStart] = useState(shift.start);
  const [end, setEnd] = useState(shift.end);
  const [currentShift, setCurrentShift] = useState(route.params.shift);


  const saveChanges = () => {
    setCurrentShift({ ...currentShift, name, start, end });
    setModalVisible(false);
  };
  

  const deleteShift = () => {
    // handle delete logic here
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <MHeader back />

      {/* Buttons Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={deleteShift}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Shift Name Below Buttons */}
      <View style={styles.nameSection}>
        <Text style={styles.title}>{currentShift.name}</Text>
        <Text style={styles.label}>Label</Text>
        <Text style={styles.time}>{currentShift.start} → {currentShift.end}</Text>
     </View>

      {/* Modal */}
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
            <TextInput
              placeholder="Start"
              placeholderTextColor="#888"
              value={start}
              onChangeText={setStart}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="End"
              placeholderTextColor="#888"
              value={end}
              onChangeText={setEnd}
              style={styles.modalInput}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <MFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light mode
  },
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
    marginEnd : 10,
    borderRadius: 16,
    alignItems: 'center',
  },
  editIcon: {
    marginRight: 4,
    color: '#000',
    fontSize: 16,
  },
  editText: {
    color: '#000',
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
  nameSection: {
    paddingHorizontal: RFValue(16),
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },

  // Modal styles
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
  cancelText: {
    color: '#000',
    fontWeight: '500',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#290135',
    padding: 12,
    borderRadius: 6,
    marginLeft: 6,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
