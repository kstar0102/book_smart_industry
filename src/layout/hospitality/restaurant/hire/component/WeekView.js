// WeekView.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  I18nManager,
  Dimensions,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const HOUR_COL_WIDTH = 54;
const MIN_ROW_HEIGHT = 44;
const LANE_HEIGHT = 22;
const LANE_GAP = 4;
const V_PADDING = 6;

const START_MIN = 0;
const END_MIN = 24 * 60;

// viewport height for internal vertical scrolling
const SCREEN_H = Dimensions.get("window").height;
// Give WeekView its own vertical scrollable area (~60% screen height, min 280)
const MAX_VIEWPORT_HEIGHT = Math.max(280, Math.floor(SCREEN_H * 0.6));

// 12a, 1..11, 12p, 1..11
const TIME_LABELS = [
  "12a",
  ...Array.from({ length: 11 }, (_, i) => `${i + 1}`),
  "12p",
  ...Array.from({ length: 11 }, (_, i) => `${i + 1}`),
];

const ARROW_SPLIT = /[➔➜→\-–—]/;

const toDateKey = (date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getStartOfWeekSun = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
};

const range = (n) => Array.from({ length: n }, (_, i) => i);

function parseTimeToMinutes(s) {
  if (!s) return null;
  const raw = s.replace(/\u202F/g, " ").replace(/\s+/g, " ").trim();

  let m = raw.match(/^(\d{1,2}):?(\d{2})$/);
  if (m) {
    const hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    if (hh >= 0 && hh < 24 && mm >= 0 && mm < 60) return hh * 60 + mm;
  }

  m = raw.match(/^(\d{1,2}):?(\d{2})\s*([AaPp][Mm])$/);
  if (m) {
    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const ampm = m[3].toUpperCase();
    if (hh === 12) hh = 0;
    if (ampm === "PM") hh += 12;
    return hh * 60 + mm;
  }

  m = raw.match(/^(\d{1,2})\s*([AaPp][Mm])$/);
  if (m) {
    let hh = parseInt(m[1], 10);
    const ampm = m[2].toUpperCase();
    if (hh === 12) hh = 0;
    if (ampm === "PM") hh += 12;
    return hh * 60;
  }

  m = raw.match(/^(\d{1,2})$/);
  if (m) {
    const hh = parseInt(m[1], 10);
    if (hh >= 0 && hh < 24) return hh * 60;
  }
  return null;
}

function parseEventTimeRange(timeStr) {
  if (!timeStr) return null;
  const [startRaw, endRaw] = timeStr.split(ARROW_SPLIT).map((x) => (x || "").trim());
  const start = parseTimeToMinutes(startRaw);
  const end = parseTimeToMinutes(endRaw);
  if (start == null || end == null) return null;
  return { start, end };
}

function monthAbbrevWithDot(d) {
  const m = d.toLocaleString("en-US", { month: "short" });
  return `${m}.`;
}

function layoutLanes(events) {
  const items = events
    .map((e, i) => ({ e, i, r: parseEventTimeRange(e.time) }))
    .filter((x) => x.r)
    .sort((a, b) => a.r.start - b.r.start);

  const lanes = [];
  const placed = [];

  for (const item of items) {
    const { r } = item;
    let laneIndex = 0;
    for (; laneIndex < lanes.length; laneIndex++) {
      if (r.start >= lanes[laneIndex]) break;
    }
    if (laneIndex === lanes.length) lanes.push(r.end);
    else lanes[laneIndex] = r.end;

    placed.push({ ...item, lane: laneIndex });
  }

  return { placed, laneCount: Math.max(1, lanes.length) };
}

export default function WeekView({
  startDate,
  mockEvents = {},
  onEventPress,
  setSelectedEvent,
  setShowEventModal,
}) {
  const weekDays = useMemo(() => {
    const sunday = getStartOfWeekSun(startDate || new Date());
    return range(7).map((i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return d;
    });
  }, [startDate]);

  const weekRangeLabel = useMemo(() => {
    const sunday = getStartOfWeekSun(startDate || new Date());
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    const left = `${monthAbbrevWithDot(sunday)}${sunday.getDate()}`;
    const right = `${saturday.getDate()}`;
    return `${left}–${right}`;
  }, [startDate]);

  const totalMinutes = END_MIN - START_MIN;
  const totalHours = 24;
  const timelineWidth = totalHours * HOUR_COL_WIDTH;

  const todayKey = toDateKey(new Date());

  const handleEventPress = (ev, date) => {
    if (onEventPress) onEventPress(ev, date);
    else {
      setSelectedEvent?.(ev);
      setShowEventModal?.(true);
    }
  };

  return (
    <View style={{ width: "100%" }}>
      {/* Outer vertical scroll so tall content is scrollable even inside HomeTab's ScrollView */}
      <ScrollView
        style={{ maxHeight: MAX_VIEWPORT_HEIGHT }}
        nestedScrollEnabled
        showsVerticalScrollIndicator
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {/* Inner horizontal scroll for the time axis */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          nestedScrollEnabled
          contentContainerStyle={{ paddingBottom: 4 }}
        >
          <View style={{ minWidth: timelineWidth + 120 }}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.dayLabelHeaderCell}>
                <Text style={styles.weekRangeText}>{weekRangeLabel}</Text>
              </View>

              <View style={[styles.timeHeaderRow, { width: timelineWidth }]}>
                {TIME_LABELS.map((label, i) => (
                  <View
                    key={`time-${i}`}
                    style={[styles.timeHeaderCell, { width: HOUR_COL_WIDTH }]}
                  >
                    <Text style={styles.timeHeaderText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Rows: Sunday -> Saturday */}
            {weekDays.map((dateObj) => {
              const key = toDateKey(dateObj);
              const events = Array.isArray(mockEvents[key]) ? mockEvents[key] : [];

              const { placed, laneCount } = layoutLanes(events);
              const contentHeight =
                V_PADDING * 2 + laneCount * LANE_HEIGHT + (laneCount - 1) * LANE_GAP;
              const rowHeight = Math.max(MIN_ROW_HEIGHT, contentHeight);

              const isToday = key === todayKey;

              return (
                <View key={key} style={styles.row}>
                  {/* Day label */}
                  <View
                    style={[
                      styles.dayLabelCell,
                      {
                        height: rowHeight,
                        backgroundColor: isToday ? "#EFE9FF" : "#fff",
                        borderColor: isToday ? "#EFE9FF" : "#ccc",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayLabelBottom,
                        { color: "black" },
                      ]}
                    >
                      {dateObj.getDate()}{" "}
                      {dateObj.toLocaleDateString("en-US", { month: "short" })}
                    </Text>

                    <Text
                      style={[
                        styles.dayLabelTop,
                        { fontWeight: isToday ? "900" : "700" },
                      ]}
                    >
                      {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
                    </Text>
                  </View>

                  {/* Timeline row (today tinted + stripes adjusted) */}
                  <View
                    style={[
                      styles.timelineRow,
                      {
                        width: timelineWidth,
                        height: rowHeight,
                        backgroundColor: isToday ? "#EFE9FF" : "#fff",
                        borderColor: isToday ? "#EFE9FF" : "#ccc",
                      },
                    ]}
                  >
                    {/* Hour bands (apply today tint here so background actually shows) */}
                    <View
                      style={[
                        styles.gridColumns,
                        { backgroundColor: isToday ? "#EFE9FF" : "#fff" },
                      ]}
                    >
                      {range(totalHours).map((i) => (
                        <View
                          key={`col-${i}`}
                          style={[
                            styles.gridCol,
                            {
                              width: HOUR_COL_WIDTH,
                              backgroundColor: isToday
                                ? (i % 2 === 1 ? "#EFE9FF" : "#EFE9FF")
                                : (i % 2 === 1 ? "#fafafa" : "#fff"),
                            },
                          ]}
                        />
                      ))}
                    </View>

                    {/* Hour & half-hour guides */}
                    <View style={[StyleSheet.absoluteFill, { flexDirection: "row" }]}>
                      {range(totalHours + 1).map((i) => (
                        <View
                          key={`vline-${i}`}
                          style={[
                            styles.vLine,
                            { left: i * HOUR_COL_WIDTH - (I18nManager.isRTL ? 1 : 0) },
                          ]}
                        />
                      ))}
                      {range(totalHours).map((i) => (
                        <View
                          key={`half-${i}`}
                          style={[
                            styles.vLineHalf,
                            { left: i * HOUR_COL_WIDTH + HOUR_COL_WIDTH / 2 },
                          ]}
                        />
                      ))}
                    </View>

                    {/* Events (lanes, no overlap) */}
                    <View style={StyleSheet.absoluteFill}>
                      {placed.map(({ e: ev, r, lane }, idx) => {
                        const start = Math.max(r.start, START_MIN);
                        const end = Math.min(r.end, END_MIN);
                        if (end <= START_MIN || start >= END_MIN) return null;

                        const offsetMin = start - START_MIN;
                        const durationMin = Math.max(end - start, 10);

                        const leftPx = (offsetMin / totalMinutes) * timelineWidth;
                        const widthPx = (durationMin / totalMinutes) * timelineWidth;

                        const top = V_PADDING + lane * (LANE_HEIGHT + LANE_GAP);
                        const height = LANE_HEIGHT;

                        return (
                          <TouchableOpacity
                            key={`${ev.id || "ev"}-${ev.shiftId || idx}-${key}`}
                            activeOpacity={0.9}
                            onPress={() => handleEventPress(ev, dateObj)}
                            style={[
                              styles.eventBlock,
                              {
                                left: leftPx,
                                width: Math.max(widthPx, 18),
                                top,
                                height,
                                backgroundColor: ev.color || "#290135",
                              },
                            ]}
                          >
                            <Text numberOfLines={1} style={styles.eventText}>
                              {ev.label} {ev.time}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginHorizontal: 10,
    marginTop: 6,
  },
  dayLabelHeaderCell: {
    width: 80,
    height: 30,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderTopLeftRadius: 6,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  weekRangeText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 12,
  },
  timeHeaderRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f8f8f8",
    borderTopRightRadius: 6,
  },
  timeHeaderCell: {
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderLeftWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 1,
  },
  timeHeaderText: {
    fontSize: 11,
    color: "#555",
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
    marginHorizontal: 10,
  },
  dayLabelCell: {
    width: 80,
    paddingVertical: 4,
    paddingHorizontal: 3,
    borderLeftWidth: 1,
    borderRightWidth: 0.5,
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  dayLabelTop: {
    fontSize: RFValue(10),
    color: "black",
    fontWeight: "300",
  },
  dayLabelBottom: {
    fontSize: RFValue(9.5),
    marginTop: 1,
    fontWeight: "400",
  },
  timelineRow: {
    borderRightWidth: 1,
    borderBottomWidth: 2,
    overflow: "hidden",
  },
  gridColumns: {
    flexDirection: "row",
    ...StyleSheet.absoluteFillObject,
  },
  gridCol: {
    height: "100%",
    backgroundColor: "#fff",
  },
  gridColAlt: {
    backgroundColor: "#fafafa",
  },
  vLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#ddd",
  },
  vLineHalf: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: "#eee",
  },
  eventBlock: {
    position: "absolute",
    borderRadius: 6,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  eventText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
