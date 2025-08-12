import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
  Pressable
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
  getShiftTypes,
  editShiftFromStaff,
  deleteShiftFromStaff
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

  const [eventDate, setEventDate] = useState(null);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchStaffInfo();
    fetchShiftTypes();
  }, []); 

  const fetchStaffInfo = async () => {
    try {
      // Read both keys in parallel for speed
      const [aicRaw, roleRaw] = await Promise.all([
        AsyncStorage.getItem('aic'),
        AsyncStorage.getItem('HireRole'),
      ]);
  
      const aic = aicRaw?.trim();
      const role = roleRaw?.trim();
  
      // Map app role to API endpoint
      const endpointMap = {
        restaurantManager: 'restau_manager',
        hotelManager: 'hotel_manager',
      };
  
      const endpoint = endpointMap[role];
  
      if (!aic || !endpoint) {
        console.warn('Missing AIC or unsupported role:', { aic, role });
        setStaffList([]);
        setShiftData({});
        return;
      }
  
      const data = await getStaffShiftInfo(endpoint, aic);
  
      // Be defensive about the API response
      const list = Array.isArray(data) ? data : [];
      setStaffList(list);
      setShiftData(transformStaffListToMockEvents(list));
    } catch (err) {
      console.error('Error fetching staff list:', err);
      setStaffList([]);
      setShiftData({});
    }
  };

  const fetchShiftTypes = async () => {
    try {
      const [aicRaw, roleRaw] = await Promise.all([
        AsyncStorage.getItem("aic"),
        AsyncStorage.getItem("HireRole"),
      ]);
  
      const aic = Number.parseInt((aicRaw || "").trim(), 10);
      const role = (roleRaw || "").trim();
  
      const endpointMap = {
        restaurantManager: "restau_manager",
        hotelManager: "hotel_manager",
      };
      const endpoint = endpointMap[role];
  
      if (!Number.isFinite(aic) || !endpoint) {
        setShiftTypes([]); // just empty if invalid
        return;
      }
  
      const res = await getShiftTypes({ aic }, endpoint);
      const types = Array.isArray(res?.shiftType) ? res.shiftType : [];
  
      // ✅ No warning — just set the array (empty or not)
      setShiftTypes(types);
  
    } catch (err) {
      console.error("Failed to fetch shift types:", err);
      setShiftTypes([]);
    }
  };
    
  // useEffect(() => {
  //   console.log('✅ shiftTypes :', shiftTypes);
  // }, [shiftTypes]);

  const ensurePrereqs = async () => {
    let needShiftTypes = !Array.isArray(shiftTypes) || shiftTypes.length === 0;
    let needStaff      = !Array.isArray(staffList)  || staffList.length === 0;
    if (needShiftTypes) {
      await fetchShiftTypes();
      needShiftTypes = !Array.isArray(shiftTypes) || shiftTypes.length === 0;
    }
    if (needStaff) {
      await fetchStaffInfo();
      needStaff = !Array.isArray(staffList) || staffList.length === 0;
    }
    return { needShiftTypes, needStaff };
  };

  const openCreateSingleShift = async () => {
    const { needShiftTypes, needStaff } = await ensurePrereqs();
    if (needShiftTypes || needStaff) {
      Alert.alert(
        "Missing data",
        `${[
          needShiftTypes ? "Shift types" : null,
          needStaff ? "Staff list" : null,
        ].filter(Boolean).join(" and ")} not selected yet. Please make it first.`
      );
      return;
    }
    setShowAddShiftModal(true);
  };

  const openCreateNextWeek = async () => {
    const { needShiftTypes, needStaff } = await ensurePrereqs();
    if (needShiftTypes || needStaff) {
      Alert.alert(
        "Missing data",
        `${[
          needShiftTypes ? "Shift types" : null,
          needStaff ? "Staff list" : null,
        ].filter(Boolean).join(" and ")} not selected yet. Please make it first.`
      );
      return;
    }
    setShowAddWeekModal(true);
  };

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

  const handleConfirmDelete = async () => {
    try {
      // Guards
      if (!selectedEvent?.id || !selectedEvent?.shiftId) {
        Alert.alert('No event selected to delete.');
        return;
      }
  
      setDeleting(true);
  
      // Read AIC + Role in parallel
      const [aicRaw, roleRaw] = await Promise.all([
        AsyncStorage.getItem('aic'),
        AsyncStorage.getItem('HireRole'),
      ]);
  
      const aic = Number.parseInt((aicRaw || '').trim(), 10);
      const role = (roleRaw || '').trim();
  
      // Map role -> endpoint
      const endpointMap = {
        restaurantManager: 'restau_manager',
        hotelManager: 'hotel_manager',
      };
      const endpoint = endpointMap[role];
  
      if (!Number.isFinite(aic) || !endpoint) {
        console.warn('Missing/invalid AIC or unsupported role:', { aicRaw, role });
        Alert.alert('Unable to delete shift: account/role not set.');
        return;
      }
  
      // Call API
      const result = await deleteShiftFromStaff(
        endpoint,
        aic,                    // or String(aic) if your API expects string
        selectedEvent.id,       // staffId
        selectedEvent.shiftId   // shiftId
      );
  
      // Handle response
      if (result?.success) {
        await fetchStaffInfo();          // refresh grid
        setShowConfirmDelete(false);
        setShowEventModal(false);
        setSelectedEvent(null);
        alert('Shift deleted.');
      } else {
        Alert.alert(`Delete failed: ${result?.message || 'Unknown error'}`);
        await fetchStaffInfo();          // ensure UI not stale
        setShowConfirmDelete(false);
      }
    } catch (e) {
      console.error('Delete error:', e);
      alert('Delete failed. Please try again.');
      await fetchStaffInfo();
      setShowConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleEditShift = async () => {
    try {
      // 1) Basic guards
      if (!selectedEvent?.id || !selectedEvent?.shiftId) {
        alert('No event selected.');
        return;
      }
      if (!selectedDate) {
        alert('Pick a date first.');
        return;
      }
      const selectedShiftObj = shiftTypes.find(s => String(s.id) === String(selectedShift));
      if (!selectedShiftObj) {
        alert('Pick a shift time.');
        return;
      }
  
      // 2) Read AIC + Role in parallel
      const [aicRaw, roleRaw] = await Promise.all([
        AsyncStorage.getItem('aic'),
        AsyncStorage.getItem('HireRole'),
      ]);
  
      const aic = Number.parseInt((aicRaw || '').trim(), 10);
      const role = (roleRaw || '').trim();
  
      // 3) Map role -> endpoint
      const endpointMap = {
        restaurantManager: 'restau_manager',
        hotelManager: 'hotel_manager',
      };
      const endpoint = endpointMap[role];
  
      if (!Number.isFinite(aic) || !endpoint) {
        console.warn('Missing/invalid AIC or unsupported role:', { aicRaw, role });
        alert('Unable to update shift: account/role not set.');
        return;
      }
  
      // 4) Format payload
      const formattedDate = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const formattedTime = `${selectedShiftObj.start} ➜ ${selectedShiftObj.end}`;
  
      // 5) Call API
      const result = await editShiftFromStaff(
        endpoint,          // role-aware endpoint
        aic,               // managerAic
        selectedEvent.id,  // staffId
        selectedEvent.shiftId,
        formattedDate,
        formattedTime
      );
  
      // 6) Handle response
      if (result?.success) {
        await fetchStaffInfo();        // refresh
        setShowEventModal(false);      // close
        alert('Shift updated!');
      } else {
        alert(`Update failed: ${result?.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Edit shift failed:', err);
      alert('Network error while updating shift. Please try again.');
    }
  };
  

  const normalizeTime = (s = "") =>
    s
      .replace(/\u202F/g, " ")         // narrow no-break space -> space
      .replace(/\s+/g, " ")            // collapse whitespace
      .replace(/[^\dAPMapm: ]/g, "")   // strip arrows/extra chars
      .trim()
      .toUpperCase();

  const handleMonthEventPress = (event, cellDate) => {
    setSelectedEvent(event);
    setEventDate(cellDate);
    setShowEventModal(true);
  
    // Preselect shift by comparing times
    if (event?.time && Array.isArray(shiftTypes) && shiftTypes.length) {
      const [startRaw, endRaw] = event.time.split("➔").map(t => (t || "").trim());
  
      const startN = normalizeTime(startRaw);
      const endN   = normalizeTime(endRaw);
  
      const matched = shiftTypes.find(s =>
        normalizeTime(s.start) === startN && normalizeTime(s.end) === endN
      );
  
      setSelectedShift(matched ? matched.id : null);
    } else {
      setSelectedShift(null);
    }
  };
  

  return (
    <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={false}>
      <View style={styles.topRightControls}>
        <View style={styles.shiftButtonGroup}>
          <TouchableOpacity 
            style={styles.shiftButtonPrimary} 
            onPress={openCreateSingleShift}>
            <Text style={styles.shiftButtonText}>Create Single Shift</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.shiftButtonSecondary} 
            onPress={openCreateNextWeek}>
            <Text style={styles.shiftButtonText}>Create Next Week's Shifts</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerContainer}>
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
              <View style={styles.dropdownOverCalendar}>
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
      </View>
      

      {viewMode === "Month" && (
        <MonthView
          calendarDays={calendarDays}
          mockEvents={ShiftData}
          setSelectedEvent={setSelectedEvent}
          setShowEventModal={setShowEventModal}
          setEventDate={setEventDate} 
          onEventPress={handleMonthEventPress}
        />
      )}
      

      {viewMode === 'Week' && (
        <WeekView
          startDate={weekStartDate}
          mockEvents={ShiftData}               
          onEventPress={handleMonthEventPress} 
          setSelectedEvent={setSelectedEvent}  
          setShowEventModal={setShowEventModal}
        />
      )}


      {viewMode === "Day" && (
        <DayView
          date={dayDate}
          setDate={setDayDate}
          mockEvents={ShiftData}
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

          <Pressable 
            style={styles.deleteButton} 
            onPress={() => {
              Alert.alert(
                "Delete this shift?",  // Title of the alert
                "This action cannot be undone.",  // Message to show in the alert
                [
                  {
                    text: "No",
                    onPress: () => setShowConfirmDelete(false), // Close the modal on "No"
                    style: "cancel"
                  },
                  {
                    text: "Yes, delete",
                    onPress: handleConfirmDelete, // Call the delete function on "Yes"
                    style: "destructive"  // Optional: Make the button red
                  }
                ],
                { cancelable: false }  // Disable dismissing the alert by tapping outside
              );
            }}
          >
            <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
          </Pressable>



            <Text style={styles.label}>Day</Text>
           
            <View style={{ position: 'relative' }}>
              <TextInput
                mode="outlined"
                value={eventDate ? new Date(eventDate).toLocaleDateString('en-US', {
                  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                }) : ''}
                editable={false}
                style={styles.input}
              />
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={[StyleSheet.absoluteFill, { zIndex: 1 }]}
              />
            </View>

            <DatePicker
              modal
              open={showDatePicker}
              date={eventDate || new Date()} // Use eventDate as initial value
              mode="date"
              onConfirm={(date) => {
                setShowDatePicker(false);
                setSelectedDate(date);
                setEventDate(date); // 👈 This line updates the visible input!
              }}
              onCancel={() => setShowDatePicker(false)}
            />


            <Text style={styles.label}>Staff</Text>
            <TextInput
              mode="outlined"
              value={selectedEvent?.label || ''}
              editable={false}
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
  headerContainer: {
    position: 'relative', 
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  
  viewModeWrapper: {
    position: "relative",
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
  dropdownOverCalendar: {
    position: "absolute",
    top: 42,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 4,
    width: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 9999,
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
  confirmModal: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    elevation: 5,
  },
  confirmTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  confirmSubtitle: {
    color: '#555',
    marginBottom: 16,
  },
  confirmRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  confirmCancel: {
    borderColor: '#333',
    backgroundColor: 'transparent',
  },
  confirmCancelText: {
    color: '#333',
    fontWeight: '700',
  },
  confirmDelete: {
    borderColor: '#d00',
    backgroundColor: '#d00',
  },
  confirmDeleteText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default HomeTab;
