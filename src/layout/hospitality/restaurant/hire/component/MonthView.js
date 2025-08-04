// MonthView.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MonthView({ calendarDays, mockEvents, setSelectedEvent, setShowEventModal }) {
    const pad = (n) => n.toString().padStart(2, '0'); 
    return (
    <View style={styles.calendarGrid}>
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
        <Text key={d} style={styles.dayHeader}>{d}</Text>
      ))}

      {calendarDays.map((dayObj, index) => {
        const { day, month, year, isFaded } = dayObj;
        const key = `${year}-${pad(month + 1)}-${pad(day)}`; 
        const dayEvents = mockEvents[key] || [];

        return (
          <View key={index} style={styles.dayCell}>
            <Text style={[styles.dayNumber, isFaded && { color: "#bbb" }]}>{day}</Text>
            {dayEvents.slice(0, 2).map((event, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.eventDot, { backgroundColor: event.color }]}
                onPress={() => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                }}
              >
                <Text numberOfLines={1} style={styles.eventText}>{event.label}</Text>
              </TouchableOpacity>
            ))}
            {dayEvents.length > 2 && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedEvent({ day, all: dayEvents });
                  setShowEventModal(true);
                }}
              >
                <Text style={styles.moreText}>+{dayEvents.length - 2}</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 10,
    zIndex : -1
  },
  dayHeader: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    paddingVertical: 6,
    fontWeight: 'bold',
    color: '#555',
    backgroundColor: '#f8f8f8',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dayCell: {
    width: `${100 / 7}%`,
    height: 80,
    padding: 4,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  dayNumber: {
    color: '#000',
    fontWeight: '600',
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
    color: '#fff',
  },
  moreText: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
    textAlign: 'center',
  },
});
