import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DayView({ date = new Date(), setDate, mockEvents, setSelectedEvent, setShowEventModal }) {
  const pad = (n) => n.toString().padStart(2, '0');
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const events = mockEvents[dateStr] || [];

  const calculateOverlappingLayout = () => {
    return events.map((event, i) => {
      const overlapping = events.filter(
        (e, j) => j !== i && !(event.endHour <= e.startHour || event.startHour >= e.endHour)
      );
      const totalOverlap = overlapping.length + 1;
      const widthPercent = 100 / totalOverlap;
      const leftIndex = overlapping.filter((e, j) => j < i && e.startHour < event.endHour).length;

      return {
        ...event,
        top: event.startHour * 40,
        height: (event.endHour - event.startHour) * 40,
        widthPercent,
        leftPercent: leftIndex * widthPercent,
      };
    });
  };

  const layoutEvents = calculateOverlappingLayout();

  return (
    <View style={{ flex: 1, zIndex: -1 }}>
      <View style={styles.dayContainer}>
        <View style={styles.timeColumn}>
          {Array.from({ length: 24 }, (_, hour) => (
            <Text key={hour} style={styles.timeLabel}>
              {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
            </Text>
          ))}
        </View>

        <View style={styles.eventColumn}>
          {Array.from({ length: 24 }, (_, i) => (
            <View key={i} style={styles.timeSlot} />
          ))}

          {layoutEvents.map((event, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.eventBox,
                {
                  top: event.top,
                  height: event.height,
                  backgroundColor: event.color,
                  width: `${event.widthPercent}%`,
                  left: `${event.leftPercent}%`,
                },
              ]}
              onPress={() => {
                setSelectedEvent(event);
                setShowEventModal(true);
              }}
            >
              <Text numberOfLines={2} style={styles.eventText}>
                {event.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 40,
    backgroundColor: '#f5f5f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  navButton: {
    padding: 4,
  },
  navText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  dayContainer: {
    flexDirection: "row",
    width: "100%",
    minHeight: 960,
    zIndex : -2
  },
  timeColumn: {
    width: 50,
    backgroundColor: "#f9f9f9",
    borderRightWidth: 1,
    borderColor: "#ddd",
    zIndex: -1
  },
  timeLabel: {
    height: 40,
    fontSize: 10,
    textAlign: "right",
    paddingRight: 6,
    color: "#555",
  },
  eventColumn: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff",
    zIndex: -1
  },
  timeSlot: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },
  eventBox: {
    position: "absolute",
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 4,
    overflow: "hidden",
    zIndex: 1,
  },
  eventText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
    lineHeight: 14,
  },
});
