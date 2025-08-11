import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";

const ROW_HEIGHT = 40; // px per hour
const HOURS = Array.from({ length: 24 }, (_, h) => h);

// "August 16, 2025" keys
const dateKey = (y, m, d) =>
  new Date(y, m, d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const pad = (n) => n.toString().padStart(2, "0");

// Build a Sun→Sat (or whatever weekstart) from startDate
const generateWeekDates = (startDate) => {
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i);
    week.push({
      day: d.getDate(),
      month: d.getMonth(),
      year: d.getFullYear(),
      label: d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" }),
      date: d,
    });
  }
  return week;
};

// ── Helpers to parse "10:04 AM ➔ 5:04 PM" robustly ─────────────────────────────
const normalizeSpaces = (s = "") =>
  s.replace(/\u202F/g, " ").replace(/\s+/g, " ").trim();

const parseTimeToHourFloat = (t = "") => {
  const s = normalizeSpaces(t);
  const m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*([AP]M)$/i);
  if (!m) return null;
  let hour = parseInt(m[1], 10) % 12;
  const mins = m[2] ? parseInt(m[2], 10) : 0;
  const ap = m[3].toUpperCase();
  if (ap === "PM") hour += 12;
  return hour + mins / 60;
};

const splitTimeRange = (range = "") => {
  const clean = normalizeSpaces(range);
  // supports ➔, →, ->, –, —
  const parts = clean.split(/\s*(?:➔|→|->|—|–|>)\s*/);
  if (parts.length < 2) return [null, null];
  return [parts[0], parts[1]];
};

// ── Small inline modal listing all events for a given day ───────────────────────
function DayEventsModal({ visible, onClose, date, events, onPick }) {
  const title =
    date &&
    date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dayModal}>
          <Text style={styles.dayModalTitle}>{title}</Text>
          <ScrollView style={{ maxHeight: 360 }}>
            {events.map((ev, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.dayModalItem}
                onPress={() => onPick(ev)}
              >
                <View style={[styles.colorDot, { backgroundColor: ev.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.dayModalItemText}>{ev.label}</Text>
                  {!!ev.time && (
                    <Text style={styles.dayModalItemSub}>{normalizeSpaces(ev.time)}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.dayModalClose} onPress={onClose}>
            <Text style={styles.dayModalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ── Main WeekView ──────────────────────────────────────────────────────────────
export default function WeekView({
  startDate,
  mockEvents,               // ShiftData keyed like "August 16, 2025": [{...}]
  onEventPress,             // (event, date) => void
  setSelectedEvent,         // fallback if onEventPress not provided
  setShowEventModal,        // fallback if onEventPress not provided
}) {
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [dayModalDate, setDayModalDate] = useState(null);
  const [dayModalEvents, setDayModalEvents] = useState([]);

  const currentWeekDates = generateWeekDates(startDate);

  const openDayModal = (events, date) => {
    setDayModalEvents(events);
    setDayModalDate(date);
    setDayModalOpen(true);
  };

  const closeDayModal = () => {
    setDayModalOpen(false);
    setDayModalEvents([]);
    setDayModalDate(null);
  };

  const goEvent = (event, date) => {
    if (onEventPress) onEventPress(event, date);
    else {
      setSelectedEvent?.(event);
      setShowEventModal?.(true);
    }
  };

  return (
    <View style={styles.weekContainer}>
      <View style={styles.weekGrid}>
        {/* Time labels */}
        <View style={styles.timeColumn}>
          {HOURS.map((h) => (
            <Text key={h} style={styles.timeLabel}>
              {h === 0 ? "12 AM" : h < 12 ? `${h} AM` : h === 12 ? "12 PM" : `${h - 12} PM`}
            </Text>
          ))}
        </View>

        {/* 7 day columns */}
        {currentWeekDates.map((dateObj, index) => {
          const { day, month, year, label, date } = dateObj;
          const key = dateKey(year, month, day);
          const events = Array.isArray(mockEvents?.[key]) ? mockEvents[key] : [];

          // Always show just the first event visually in the grid
          const firstEvent = events[0] || null;
          const restCount = events.length > 1 ? events.length - 1 : 0;

          // Position first event by its start time (so timeline still makes sense)
          let top = 0;
          let height = ROW_HEIGHT;
          if (firstEvent?.time) {
            const [s, e] = splitTimeRange(firstEvent.time);
            const sF = parseTimeToHourFloat(s ?? "") ?? 0;
            const eF = parseTimeToHourFloat(e ?? "") ?? Math.max(sF + 1, 1);
            top = sF * ROW_HEIGHT;
            height = Math.max((eF - sF) * ROW_HEIGHT, ROW_HEIGHT / 2);
          }

          return (
            <View key={index} style={styles.dayColumn}>
              <View style={styles.dayHeaderBox}>
                <Text style={styles.dayHeaderText}>{label}</Text>
              </View>

              {/* hour grid */}
              {HOURS.map((h) => (
                <View key={h} style={styles.timeSlot} />
              ))}

              {firstEvent && (
                <View
                  style={{
                    position: "absolute",
                    top,             
                    left: 0,
                    right: 0,
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    // onPress={() => goEvent(firstEvent, date)}
                    onPress={() => openDayModal(events, date)}
                    style={[
                      styles.shiftEvent,
                      {
                        height,
                        backgroundColor: firstEvent.color,
                        width: "100%",
                        justifyContent: "center", 
                        alignItems: "center",     
                      },
                    ]}
                  >
                    <Text style={styles.shiftTextCentered} numberOfLines={2}>
                      {firstEvent.label}
                    </Text>
                  </TouchableOpacity>

                  {/* +n chip just below the bar */}
                  {restCount > 0 && (
                    <TouchableOpacity
                      style={styles.moreChipBelow}
                      onPress={() => openDayModal(events, date)}
                    >
                      <Text style={styles.moreChipText}>+{restCount}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}


            </View>
          );
        })}
      </View>

      {/* Day modal listing all events for a day */}
      <DayEventsModal
        visible={dayModalOpen}
        onClose={closeDayModal}
        date={dayModalDate}
        events={dayModalEvents}
        onPick={(ev) => {
          const date = dayModalDate || new Date();
          closeDayModal();
          goEvent(ev, date);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  weekContainer: { flex: 1, width: "100%", backgroundColor: "#fff" },
  weekGrid: { flexDirection: "row", flex: 1 },

  timeColumn: {
    width: 50,
    backgroundColor: "#f9f9f9",
    borderRightWidth: 1,
    borderColor: "#ddd",
  },
  timeLabel: {
    height: ROW_HEIGHT,
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
    backgroundColor: "#fff",
  },
  dayHeaderBox: {
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  dayHeaderText: { fontSize: 12, fontWeight: "600", color: "#333" },

  timeSlot: { height: ROW_HEIGHT, borderBottomWidth: 1, borderColor: "#f1f1f1" },
  
  // the colored bar (we center its text inline via justify/align in the component)
  shiftEvent: {
    position: "absolute",
    borderRadius: 6,
    paddingHorizontal: 6,
    overflow: "hidden",
    zIndex: 5,
  },

  // centered text inside the bar
  shiftTextCentered: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
    lineHeight: 14,
    textAlign: "center",
  },

  // (legacy) if you use non-centered bar labels elsewhere
  shiftText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "bold",
    lineHeight: 14,
  },

  // +n chip directly under the bar, centered horizontally
  moreChipBelow: {
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    zIndex: 10
  },
  moreChipText: { fontSize: 11, color: "#333", fontWeight: "600" },

  // if you still need a side chip somewhere else
  moreChipBeside: {
    backgroundColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  // Day modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  dayModal: {
    backgroundColor: "#fff",
    width: "88%",
    borderRadius: 12,
    padding: 16,
  },
  dayModalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },
  dayModalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#eee",
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  dayModalItemText: { color: "#111", fontWeight: "600" },
  dayModalItemSub: { color: "#666", fontSize: 12, marginTop: 2 },

  dayModalClose: {
    alignSelf: "flex-end",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  dayModalCloseText: { color: "#333", fontWeight: "700" },
});
