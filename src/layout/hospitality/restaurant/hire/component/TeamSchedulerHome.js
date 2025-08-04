import React, {useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Modal,
    FlatList
} from "react-native";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";

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
    setSelectedEvent,
    setShowEventModal,
}) => {
  const [weekStartDate, setWeekStartDate] = useState(new Date()); // start from today
  const [dayDate, setDayDate] = useState(new Date());
  const [dayViewDate, setDayViewDate] = useState(new Date()); // today by default
  
  const handlePrev = () => {
    if (viewMode === "Month") {
      handlePrevMonth();
    } else if (viewMode === "Week") {
      setWeekStartDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() - 7);
        return newDate;
      });
    } else if (viewMode === "Day") {
      setDayDate(prev => {
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
      setWeekStartDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 7);
        return newDate;
      });
    } else if (viewMode === "Day") {
      setDayDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
      });
    }
  };
  
  return (
    <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
        <View style={styles.topRightControls}>
            <View style={styles.shiftButtonGroup}>
                <TouchableOpacity style={styles.shiftButtonPrimary}>
                    <Text style={styles.shiftButtonText}>Create Single Shift</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shiftButtonSecondary}>
                    <Text style={styles.shiftButtonText}>Create Next Week's Shifts</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.header}>
        <TouchableOpacity onPress={handlePrev} style={styles.navButton}>
          <Text style={styles.navText}>◀</Text>
        </TouchableOpacity>

        {viewMode === "Month" ? (
          <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
            <Text style={styles.monthYearText}>
              {months[month]} {year}
            </Text>
          </TouchableOpacity>
        ) : viewMode === "Week" ? (
          <Text style={styles.monthYearText}>
            {weekStartDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        ) : (
          <Text style={styles.monthYearText}>
            {dayDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        )}

        <TouchableOpacity onPress={handleNext} style={styles.navButton}>
          <Text style={styles.navText}>▶</Text>
        </TouchableOpacity>

            <View style={styles.viewModeContainer}>
                <TouchableOpacity
                    style={styles.viewModeButton}
                    onPress={() => setShowViewDropdown(prev => !prev)}
                >
                    <Text style={styles.viewModeButtonText}>{viewMode}</Text>
                </TouchableOpacity>

                {showViewDropdown && (
                    <View style={styles.dropdown}>
                        {['Month', 'Week', 'Day'].map(mode => (
                            <TouchableOpacity
                                key={mode}
                                onPress={() => {
                                    setViewMode(mode);
                                    setShowViewDropdown(false);
                                 }}
                                style={[styles.dropdownItem, viewMode === mode && styles.dropdownSelected]}
                            >
                                <Text style={[styles.dropdownText, viewMode === mode && styles.dropdownSelectedText]}>
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
            mockEvents={mockEvents}
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
            setDate={setDayViewDate}
            mockEvents={mockEvents}
            setSelectedEvent={setSelectedEvent}
            setShowEventModal={setShowEventModal}
          />

        )}
        
    </ScrollView>
    
  );
};

const styles = StyleSheet.create({
    weekContainer: {
        flex: 1,
        width: "100%",
        backgroundColor: "#fff",
    },
      
    weekGrid: {
        flexDirection: "row",
        flex: 1,
    },

    timeColumn: {
        width: 50,
        backgroundColor: "#f9f9f9",
        borderRightWidth: 1,
        borderColor: "#ddd",
    },
      
    timeLabel: {
        height: 40,
        fontSize: 10,
        textAlign: "right",
        paddingRight: 6,
        color: "#555",
    },
      
      dayColumn: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: "#eee",
        position: "relative",
      },
      
      dayHeaderBox: {
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f0f0f0",
      },
      
      dayHeaderText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
      },
      
      timeSlot: {
        height: 40,
        borderBottomWidth: 1,
        borderColor: "#f1f1f1",
      },
      
      shiftEvent: {
        position: "absolute",
        borderRadius: 6,
        justifyContent: "center",
        paddingHorizontal: 4,
        overflow: "hidden",
        zIndex: 5,
      },
      
      shiftText: {
        fontSize: 10,
        color: "#fff",
        fontWeight: "bold",
        lineHeight: 14,
      },
      
      
      dayColumn: {
        flex: 1,
        borderRightWidth: 1,
        borderColor: "#eee",
        position: "relative",
        backgroundColor: "#fff", // light mode background
      },
      
      
      
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
        backgroundColor: "#333",
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
      
      
      viewModeContainer: {
        position: "relative",
        height: 40,
        zIndex: 10,
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
        backgroundColor: "#fff",
        position: "absolute",
        top: 40,
        right: 0,
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
      
      
      toggleBtn: {
        backgroundColor: "#f0f0f0",
        padding: 10,
        marginVertical: 5,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        width: "50%",
      },
      toggleBtnActive: {
        backgroundColor: "#cde9ff",
        borderColor: "#5aaeff",
      },
      toggleText: {
        color: "#000",
        fontSize: 14,
        fontWeight: "500",
        textAlign: "center",
      },
    
      container: {
        flex: 1,
        width : "100%",
        backgroundColor: "#fff",
      },
      header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        marginTop : 10,
        paddingHorizontal : 10
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
      calendarGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        overflow: "hidden",
        marginHorizontal : 10
      },
      dayHeader: {
        width: `${100 / 7}%`,
        textAlign: "center",
        paddingVertical: 6,
        fontWeight: "bold",
        color: "#555",
        backgroundColor: "#f8f8f8",
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#ccc",
      },
      dayCell: {
        width: `${100 / 7}%`,
        height: 80,
        padding: 4,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#fff",
      },
      dayNumber: {
        color: "#000",
        fontWeight: "600",
        marginBottom: 2,
      },
      eventDot: {
        marginTop: 2,
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 4,
      },
      eventText: {
        fontSize: 10,
        color: "#fff",
      },
      moreText: {
        fontSize: 11,
        color: "#888",
        marginTop: 2,
        textAlign: "center",
      },
})

export default HomeTab;
