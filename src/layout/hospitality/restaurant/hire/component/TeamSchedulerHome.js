import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from "react-native";
import DatePicker from 'react-native-date-picker';
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import AddNewShiftModal from './AddNewShiftModal';
import AddWeeklyShiftsModal from './AddWeeklyShiftsModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getStaffShiftInfo,
  getShiftTypes
 } from '../../../../../utils/useApi';
import { transformStaffListToMockEvents } from './transformStaffListToMockEvents'; // adjust path
const HomeTab = ({
  navigation,
  month,
  year,
  months,
  years,
  handlePrevMonth,
  handleNextMonth,
  handleSelectMonth,
  setShowMonthPicker,
  viewMode,
  setViewMode,
  showViewDropdown,
  setShowViewDropdown,
  calendarDays,
  mockEvents,
}) => {
  const [weekStartDate, setWeekStartDate] = useState(new Date());
  const [dayDate, setDayDate] = useState(new Date());
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [showAddWeekModal, setShowAddWeekModal] = useState(false);
  const [ShiftData, setShiftData] = useState({});

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [shiftTypes, setShiftTypes] = useState([]);
  
  useEffect(() => {
    fetchStaffInfo();
    fetchShiftTypes();
  }, []); 

  const fetchStaffInfo = async () => {
    try {
      const aic = await AsyncStorage.getItem('aic');
      const data = await getStaffShiftInfo('restau_manager', aic);
      setStaffList(data);
      const transformed = transformStaffListToMockEvents(data);
      setShiftData(transformed);
    } catch (err) {
      console.error('Error fetching staff list:', err);
      setStaffList([]);
      setShiftData({});
    }
  };

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
  
  // useEffect(() => {
  //   console.log('✅ ShiftData updated:', ShiftData);
  // }, [ShiftData]);

  const handlePrev = () => {
    if (viewMode === "Month") {
      handlePrevMonth();
    } else if (viewMode === "Week") {
      setWeekStartDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() - 7);
        return newDate;
      });
    } else if (viewMode === "Day") {
      setDayDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() - 1);
        return newDate;
      });
    }
  };

  const handleNext = () => {
    if (viewMode === "Month") {
      handleNextMonth();
    } else if (viewMode === "Week") {
      setWeekStartDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 7);
        return newDate;
      });
    } else if (viewMode === "Day") {
      setDayDate((prev) => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
      });
    }
  };

  const handleEditShift = async () => {
    const selectedShiftObj = shiftTypes.find(s => s.id === selectedShift);
    if (!selectedEmployee || !selectedShiftObj || !selectedDate) {
      alert('Please complete all fields');
      return;
    }
  
    const result = await editShiftFromStaff(
      'restau_manager',
      selectedEvent.aic,       // managerAic
      selectedEmployee,        // staffId
      selectedEvent.shiftId,   // shiftId
      selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      `${selectedShiftObj.start} ➔ ${selectedShiftObj.end}`
    );
  
    if (result.success) {
      alert('Shift updated!');
      await fetchStaffInfo(); // refresh data on HomeTab
      setShowEventModal(false);
    } else {
      alert(`Update failed: ${result.message}`);
    }
  };
  

  return (
    <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>
      <View style={styles.topRightControls}>
        <View style={styles.shiftButtonGroup}>
          <TouchableOpacity style={styles.shiftButtonPrimary} onPress={() => setShowAddShiftModal(true)}>
            <Text style={styles.shiftButtonText}>Create Single Shift</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shiftButtonSecondary} onPress={() => setShowAddWeekModal(true)}>
            <Text style={styles.shiftButtonText}>Create Next Week's Shifts</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrev} style={styles.navButton}>
          <Text style={styles.navText}>◀</Text>
        </TouchableOpacity>

        <Text style={styles.monthYearText}>
          {viewMode === "Month"
            ? `${months[month]} ${year}`
            : viewMode === "Week"
            ? weekStartDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : dayDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
        </Text>

        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
          <Text style={styles.navText}>▶</Text>
        </TouchableOpacity>

        <View style={styles.viewModeWrapper}>
          <TouchableOpacity
            style={styles.viewModeButton}
            onPress={() => setShowViewDropdown((prev) => !prev)}
          >
            <Text style={styles.viewModeButtonText}>{viewMode}</Text>
          </TouchableOpacity>

          {showViewDropdown && (
            <View style={styles.dropdown}>
              {["Month", "Week", "Day"].map((mode) => (
                <TouchableOpacity
                  key={mode}
                  onPress={() => {
                    setViewMode(mode);
                    setShowViewDropdown(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    viewMode === mode && styles.dropdownSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      viewMode === mode && styles.dropdownSelectedText,
                    ]}
                  >
                    {mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {viewMode === "Month" && (
        <MonthView
          calendarDays={calendarDays}
          mockEvents={ShiftData}
          setSelectedEvent={setSelectedEvent}
          setShowEventModal={setShowEventModal}
        />
      )}
      

      {viewMode === "Week" && (
        <WeekView
          startDate={weekStartDate}
          mockEvents={mockEvents}
          setSelectedEvent={setSelectedEvent}
          setShowEventModal={setShowEventModal}
        />
      )}

      {viewMode === "Day" && (
        <DayView
          date={dayDate}
          setDate={setDayDate}
          mockEvents={mockEvents}
          setSelectedEvent={setSelectedEvent}
          setShowEventModal={setShowEventModal}
        />
      )}

      <AddNewShiftModal
        visible={showAddShiftModal}
        onClose={() => setShowAddShiftModal(false)}
        staffList={staffList}
        refreshShiftData={fetchStaffInfo}
      />

      <AddWeeklyShiftsModal
        visible={showAddWeekModal}
        onClose={() => setShowAddWeekModal(false)}
        staffList={staffList}
        refreshShiftData={fetchStaffInfo}
      />

      <Modal visible={showEventModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.eventModal}>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Day</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                mode="outlined"
                value={selectedDate.toLocaleDateString()}
                editable={false}
                style={styles.input}
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

            <Text style={styles.label}>Employee</Text>
            <TextInput
              mode="outlined"
              value={selectedEvent?.label || ''}
              style={styles.input}
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

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.submitButton} onPress={handleEditShift}>
                <Text style={styles.submitText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowEventModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  topRightControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
    gap: 10,
  },
  shiftButtonGroup: {
    flexDirection: "row",
    gap: 10,
  },
  shiftButtonPrimary: {
    backgroundColor: "#7A8A91",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
  },
  shiftButtonSecondary: {
    backgroundColor: "#7A8A91",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    height: 40,
    justifyContent: "center",
  },
  shiftButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  navButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#eee",
    borderRadius: 6,
  },
  navText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  viewModeWrapper: {
    position: "relative",
    zIndex: 999,
  },
  viewModeButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 40,
    justifyContent: "center",
    borderColor: "#ccc",
    borderWidth: 1,
  },
  viewModeButtonText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 999,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownText: {
    color: "#000",
    fontWeight: "bold",
  },
  dropdownSelected: {
    backgroundColor: "#e8f0fe",
  },
  dropdownSelectedText: {
    color: "#1a73e8",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    elevation: 5,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    color : 'black'
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f9f9f9',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#290135',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelText: {
    color: '#333',
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    borderWidth : 2,
    borderColor : "black"
  },
  deleteButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default HomeTab;
