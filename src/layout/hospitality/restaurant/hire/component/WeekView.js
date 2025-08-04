import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const generateWeekDates = (startDate) => {
  const week = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    week.push({
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      label: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      date,
    });
  }
  return week;
};

const WeekView = ({ startDate, mockEvents, setSelectedEvent, setShowEventModal }) => {
  const currentWeekDates = generateWeekDates(startDate);
  const pad = (n) => n.toString().padStart(2, '0');
  return (
    <View style={styles.weekContainer}>
      <View style={styles.weekGrid}>
        {/* Time labels */}
        <View style={styles.timeColumn}>
          {Array.from({ length: 24 }, (_, hour) => (
            <Text key={hour} style={styles.timeLabel}>
              {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
            </Text>
          ))}
        </View>

        {/* Each day */}
        {currentWeekDates.map((dateObj, index) => {
          const { day, month, year, label } = dateObj;
          const key = `${year}-${pad(month + 1)}-${pad(day)}`;
          const events = mockEvents[key] || [];

          return (
            <View key={index} style={styles.dayColumn}>
              <View style={styles.dayHeaderBox}>
                <Text style={styles.dayHeaderText}>{label}</Text>
              </View>

              {Array.from({ length: 24 }, (_, hour) => (
                <View key={hour} style={styles.timeSlot} />
              ))}

              {events.map((event, i) => {
                const eventTop = event.startHour * 40;
                const eventHeight = (event.endHour - event.startHour) * 40;

                const overlapping = events.filter(
                  (e, j) => j !== i && !(event.endHour <= e.startHour || event.startHour >= e.endHour)
                );

                const totalOverlap = overlapping.length + 1;
                const widthPercent = 100 / totalOverlap;

                const leftIndex = overlapping
                  .filter((e, j) => j < i && e.startHour < event.endHour)
                  .length;

                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setSelectedEvent({ all: events });
                      setShowEventModal(true);
                    }}
                    style={[
                      styles.shiftEvent,
                      {
                        top: eventTop,
                        height: eventHeight,
                        backgroundColor: event.color,
                        width: `${widthPercent}%`,
                        left: `${leftIndex * widthPercent}%`,
                      },
                    ]}
                  >
                    <Text style={styles.shiftText} numberOfLines={2}>
                      {event.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weekContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
  },
  weekGrid: {
    flexDirection: 'row',
    flex: 1,
  },
  timeColumn: {
    width: 50,
    backgroundColor: '#f9f9f9',
    borderRightWidth: 1,
    borderColor: '#ddd',
  },
  timeLabel: {
    height: 40,
    fontSize: 10,
    textAlign: 'right',
    paddingRight: 6,
    color: '#555',
  },
  dayColumn: {
    flex: 1,
    borderRightWidth: 1,
    borderColor: '#eee',
    position: 'relative',
    backgroundColor: '#fff',
  },
  dayHeaderBox: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  timeSlot: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
  },
  shiftEvent: {
    position: 'absolute',
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
    zIndex: 5,
  },
  shiftText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    lineHeight: 14,
  },
});

export default WeekView;
