import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getShiftTypes, addShiftToStaff } from '../../../../../utils/useApi';
import { TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';

export default function AddNewShiftModal({ visible, onClose, staffList, refreshShiftData  }) {
  const [shiftTypes, setShiftTypes] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);

  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible && staffList.length > 0) {
      const formatted = staffList.map((emp) => ({
        label: `${emp.firstName} ${emp.lastName}`,
        value: emp.id.toString(),
      }));
      setEmployeeList(formatted);
    }
    fetchShiftTypes();
  }, [visible, staffList]);

  const fetchShiftTypes = async () => {
    try {
      const aicValue = await AsyncStorage.getItem('aic');
      const userData = { aic: parseInt(aicValue, 10) };
      const response = await getShiftTypes(userData, 'restau_manager');

      if (Array.isArray(response?.shiftType)) {
        setShiftTypes(response.shiftType);
      } else {
        setShiftTypes([]);
        console.warn('ShiftTypes API did not return an array:', response);
      }
    } catch (err) {
      console.error('Failed to fetch shift types:', err);
      setShiftTypes([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || !selectedShift || !selectedDate) {
      alert("Please select all fields");
      return;
    }
  
    const selectedShiftObj = shiftTypes.find(s => s.id === selectedShift);
    if (!selectedShiftObj) {
      alert("Invalid shift selected");
      return;
    }
  
    try {
      const managerAic = await AsyncStorage.getItem('aic');
  
      const shift = {
        date: selectedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        time: `${selectedShiftObj.start} ➔ ${selectedShiftObj.end}`,
      };
  
      const result = await addShiftToStaff(
        parseInt(managerAic, 10),
        selectedEmployee,
        [shift] // wrap in array for single shift
      );
  
      console.log('Shift added successfully:', result);
      await refreshShiftData();
      onClose(); // close modal
    } catch (err) {
      console.error('Error submitting shift:', err);
      alert('Failed to submit shift.');
    }
  };
  

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Shift</Text>

          <Text style={styles.label}>Employee</Text>
          <Dropdown
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownSelectedText}
            itemTextStyle={styles.dropdownItemText}
            data={employeeList}
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder="Select Employee"
            value={selectedEmployee}
            onChange={item => setSelectedEmployee(item.value)}
          />


          <Text style={styles.label}>Day</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
                mode="outlined"
                placeholder="mm/dd/yyyy"
                value={selectedDate.toLocaleDateString()}
                editable={false}
                pointerEvents="none"
                style={styles.inputBox}
            />
            </TouchableOpacity>

            <DatePicker
            modal
            open={showDatePicker}
            date={selectedDate}
            mode="date"
            onConfirm={(date) => {
                setShowDatePicker(false);
                setSelectedDate(date);
            }}
            onCancel={() => setShowDatePicker(false)}
            />

          <Text style={styles.label}>Shift</Text>
          <View style={styles.shiftOptions}>
            {shiftTypes.map((shift) => (
              <TouchableOpacity
                key={shift.id}
                style={[
                  styles.shiftButton,
                  selectedShift === shift.id && styles.shiftButtonSelected,
                ]}
                onPress={() => setSelectedShift(shift.id)}
              >
                <Text
                  style={[
                    styles.shiftText,
                    selectedShift === shift.id && styles.shiftTextSelected,
                  ]}
                >
                  {shift.start} ➔ {shift.end}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitText} onPress={handleSubmit} >Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#333',
    marginBottom: 4,
    fontWeight: '600',
  },
  shiftOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  shiftButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginTop: 8,
    backgroundColor: '#f9f9f9',
  },
  shiftButtonSelected: {
    backgroundColor: '#290135',
    borderColor: '#290135',
  },
  shiftText: {
    color: '#333',
  },
  shiftTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#290135',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelText: {
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
  },
  
  dropdownContainer: {
    borderRadius: 4,
    borderColor: '#C4C4C4',
  },
  
  dropdownPlaceholder: {
    color: '#999',
    fontSize: 16,
  },
  
  dropdownSelectedText: {
    color: '#000',
    fontSize: 16,
  },
  
  dropdownItemText: {
    fontSize: 16,
    color: '#000',
  },

  inputBox: {
    height: 45,
    borderWidth: 1,
    borderColor: '#C4C4C4',
    borderRadius: 4,
    paddingVertical: 0,
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  
});
