// WeekView.js
import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  I18nManager,
  Dimensions,
  Modal,
  Pressable,
  TextInput,          // ← added
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

const HOUR_COL_WIDTH = 32;
const MIN_ROW_HEIGHT = 36;
const LANE_HEIGHT = 22;
const LANE_GAP = 4;
const V_PADDING = 6;

const START_MIN = 0;
const END_MIN = 24 * 60;
const SCREEN_H = Dimensions.get("window").height;
const MAX_VIEWPORT_HEIGHT = Math.max(280, Math.floor(SCREEN_H * 0.6));

const TIME_LABELS = [
  "12a",
  ...Array.from({ length: 11 }, (_, i) => `${i + 1}`),
  "12p",
  ...Array.from({ length: 11 }, (_, i) => `${i + 1}`),
];

const PILL_COLOR = "#5B61FF";

/* --- helpers --- */
const toDateKey = (date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const getStartOfWeekSun = (d) => {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
};

const range = (n) => Array.from({ length: n }, (_, i) => i);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const minutesToLabel = (m) => {
  m = clamp(Math.round(m / 5) * 5, 0, 24 * 60);
  let hh = Math.floor(m / 60);
  const mm = m % 60;
  const ampm = hh >= 12 ? "PM" : "AM";
  hh = hh % 12 || 12;
  const mm2 = String(mm).padStart(2, "0");
  return `${hh}:${mm2} ${ampm}`;
};

function parseTimeToMinutes(s) {
  if (!s) return null;
  const raw = s.replace(/\u202F/g, " ").replace(/\s+/g, " ").trim();

  let m = raw.match(/^(\d{1,2}):?(\d{2})$/);
  if (m) {
    const hh = parseInt(m[1], 10), mm = parseInt(m[2], 10);
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
  const parts = timeStr.split(/[➔➜→\-–—]/).map((x) => (x || "").trim());
  const start = parseTimeToMinutes(parts[0]);
  const end = parseTimeToMinutes(parts[1]);
  if (start == null || end == null) return null;
  return { start, end };
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

/* --- pretty pills on grid --- */
function StartDot({ leftPx, top, size, direction = "left" }) {
  const r = size / 2;
  return direction === "left" ? (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: leftPx - r, // flat edge on right at click x
        top,
        width: r,
        height: size,
        backgroundColor: PILL_COLOR,
        borderTopLeftRadius: r,
        borderBottomLeftRadius: r,
      }}
    />
  ) : (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: leftPx, // flat edge on left at click x
        top,
        width: r,
        height: size,
        backgroundColor: PILL_COLOR,
        borderTopRightRadius: r,
        borderBottomRightRadius: r,
      }}
    />
  );
}

function PillRangeOverlay({ leftPx, rightPx, top, height }) {
  const width = Math.max(rightPx - leftPx, height);
  const left = rightPx - leftPx < height ? (leftPx + rightPx) / 2 - width / 2 : leftPx;
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        backgroundColor: PILL_COLOR,
        borderRadius: height / 2,
      }}
    />
  );
}

/* --- lightweight dropdown for Staff only --- */
function SimpleSelect({ label, items, getKey, getLabel, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={[styles.selectBox, open && { borderColor: "#5B61FF" }]}
      >
        <Text style={{ color: value == null ? "#999" : "#000", fontWeight: "600" }}>
          {value == null ? "Select Staff…" : getLabel(items.find((it) => getKey(it) === value))}
        </Text>
      </Pressable>

      {open && (
        <View style={styles.dropdownMenu}>
          <ScrollView style={{ maxHeight: 180 }}>
            {items.map((it) => {
              const k = getKey(it);
              return (
                <Pressable
                  key={String(k)}
                  onPress={() => {
                    onChange(k);
                    setOpen(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Text style={{ color: "#000" }}>{getLabel(it)}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

/* --- main --- */
export default function WeekView({
  startDate,
  mockEvents = {},
  onEventPress,
  setSelectedEvent,
  setShowEventModal,
  onTimeRangeSelected,

  // from HomeTab
  staffList = [],
  // shiftTypes can still be passed, but we won't use it here since shift is text input
  shiftTypes = [],
}) {
  const [sel, setSel] = useState(null);          // { key, dateObj, startMin }
  const [confirm, setConfirm] = useState(null);  // { key, dateObj, startMin, endMin }
  const [showModal, setShowModal] = useState(false);

  // selections
  const [staffId, setStaffId] = useState(null);
  const [shiftText, setShiftText] = useState("");  // ← text input for shift

  useEffect(() => {
    // when modal opens with a range, prefill shift text with the range
    if (showModal && confirm) {
      const start = minutesToLabel(confirm.startMin);
      const end = minutesToLabel(confirm.endMin);
      setShiftText(`${start} ➜ ${end}`);
    }
  }, [showModal, confirm]);

  const weekDays = useMemo(() => {
    const sunday = getStartOfWeekSun(startDate || new Date());
    return range(7).map((i) => {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      return d;
    });
  }, [startDate]);

  const timelineWidth = 24 * HOUR_COL_WIDTH;
  const todayKey = toDateKey(new Date());

  const handleEventPressInternal = (ev, date) => {
    if (onEventPress) onEventPress(ev, date);
    else {
      setSelectedEvent?.(ev);
      setShowEventModal?.(true);
    }
  };

  const handleGridTap = (dateObj, hourIndex, locX) => {
    const key = toDateKey(dateObj);
    const minute = clamp(hourIndex * 60 + (locX / HOUR_COL_WIDTH) * 60, 0, 24 * 60);

    // first click: start
    if (!sel || sel.key !== key || (confirm && confirm.key === key)) {
      setSel({ key, dateObj, startMin: minute });
      setConfirm(null);
      return;
    }
    // second click: end → modal
    const startMin = Math.min(sel.startMin, minute);
    const endMin = Math.max(sel.startMin, minute);
    setSel(null);
    setConfirm({ key, dateObj, startMin, endMin });
    setShowModal(true);
    setStaffId(null);
    setShiftText(""); // will be filled in useEffect above
  };

  const pxFromMin = (m) =>
    ((clamp(m, 0, 1440) - START_MIN) / (END_MIN - START_MIN)) * timelineWidth;

  const handleCancelModal = () => {
    setShowModal(false);
    setConfirm(null);
    setSel(null);         // clear visuals
    setStaffId(null);
    setShiftText("");
  };

  const canConfirm = staffId != null && shiftText.trim().length > 0;

  const handleConfirmModal = () => {
    if (!confirm || !canConfirm) return;
    const { dateObj, startMin, endMin } = confirm;

    onTimeRangeSelected?.({
      date: dateObj,
      startLabel: minutesToLabel(startMin),
      endLabel: minutesToLabel(endMin),
      startMin,
      endMin,
      staffId,
      shiftText, // ← send the free-text shift value
    });

    setShowModal(false);
    setConfirm(null);
    setSel(null);
    setStaffId(null);
    setShiftText("");
  };

  return (
    <View style={{ width: "100%" }}>
      <ScrollView
        style={{ maxHeight: MAX_VIEWPORT_HEIGHT }}
        nestedScrollEnabled
        showsVerticalScrollIndicator
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator nestedScrollEnabled>
          <View style={{ minWidth: timelineWidth + 120 }}>
            {/* Header */}
            <View style={styles.headerRow}>
              <View style={styles.dayLabelHeaderCell} />
              <View style={[styles.timeHeaderRow, { width: timelineWidth }]}>
                {TIME_LABELS.map((label, i) => (
                  <View key={`time-${i}`} style={[styles.timeHeaderCell, { width: HOUR_COL_WIDTH }]}>
                    <Text style={styles.timeHeaderText}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {weekDays.map((dateObj) => {
              const key = toDateKey(dateObj);
              const events = Array.isArray(mockEvents[key]) ? mockEvents[key] : [];
              const { placed, laneCount } = layoutLanes(events);
              const hasEvents = placed.length > 0;
              const baseLaneCount = hasEvents ? laneCount : 0;
              const lanesWithExtra = baseLaneCount + 1;

              const contentHeight =
                V_PADDING * 2 +
                lanesWithExtra * LANE_HEIGHT +
                (lanesWithExtra - 1) * LANE_GAP;

              const rowHeight = Math.max(MIN_ROW_HEIGHT, contentHeight);
              const isToday = key === todayKey;

              const extraTop = V_PADDING + baseLaneCount * (LANE_HEIGHT + LANE_GAP);
              const extraHeight = rowHeight - extraTop - V_PADDING;
              const pillH = Math.min(20, Math.max(14, extraHeight - 4));

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
                      style={[styles.dayLabelTop, { fontWeight: isToday ? "900" : "700" }]}
                    >
                      {dateObj.toLocaleDateString("en-US", { weekday: "short" })}
                    </Text>
                  </View>

                  {/* Timeline row */}
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
                    {/* alternating hour backgrounds */}
                    <View style={[styles.gridColumns, { backgroundColor: isToday ? "#EFE9FF" : "#fff" }]}>
                      {range(24).map((i) => (
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

                    {/* hour & half-hour guides */}
                    <View style={[StyleSheet.absoluteFill, { flexDirection: "row" }]}>
                      {range(25).map((i) => (
                        <View
                          key={`vline-${i}`}
                          style={[
                            styles.vLine,
                            { left: i * HOUR_COL_WIDTH - (I18nManager.isRTL ? 1 : 0) },
                          ]}
                        />
                      ))}
                      {range(24).map((i) => (
                        <View
                          key={`half-${i}`}
                          style={[styles.vLineHalf, { left: i * HOUR_COL_WIDTH + HOUR_COL_WIDTH / 2 }]}
                        />
                      ))}
                    </View>

                    {/* existing events */}
                    <View style={StyleSheet.absoluteFill}>
                      {placed.map(({ e: ev, r, lane }, idx) => {
                        const start = Math.max(r.start, START_MIN);
                        const end = Math.min(r.end, END_MIN);
                        if (end <= START_MIN || start >= END_MIN) return null;

                        const offsetMin = start - START_MIN;
                        const durationMin = Math.max(end - start, 10);

                        const leftPx = (offsetMin / (END_MIN - START_MIN)) * timelineWidth;
                        const widthPx = (durationMin / (END_MIN - START_MIN)) * timelineWidth;

                        const top = V_PADDING + lane * (LANE_HEIGHT + LANE_GAP);
                        const height = LANE_HEIGHT;

                        return (
                          <TouchableOpacity
                            key={`${ev.id || "ev"}-${ev.shiftId || idx}-${key}`}
                            activeOpacity={0.9}
                            onPress={() => handleEventPressInternal(ev, dateObj)}
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

                    {/* extra lane (click capture) */}
                    <View
                      style={{
                        position: "absolute",
                        left: 0,
                        top: extraTop,
                        width: timelineWidth,
                        height: extraHeight,
                      }}
                    >
                      {range(24).map((h) => (
                        <Pressable
                          key={`tap-${h}`}
                          style={{
                            position: "absolute",
                            left: h * HOUR_COL_WIDTH,
                            top: 0,
                            width: HOUR_COL_WIDTH,
                            height: "100%",
                          }}
                          onPress={(e) => handleGridTap(dateObj, h, e.nativeEvent.locationX)}
                        />
                      ))}
                    </View>

                    {/* visuals */}
                    {sel && sel.key === key && (
                      <StartDot
                        leftPx={pxFromMin(sel.startMin)}
                        top={extraTop + (extraHeight - pillH) / 2}
                        size={pillH}
                        direction="left"
                      />
                    )}
                    {confirm && confirm.key === key && (
                      <PillRangeOverlay
                        leftPx={pxFromMin(confirm.startMin)}
                        rightPx={pxFromMin(confirm.endMin)}
                        top={extraTop + (extraHeight - pillH) / 2}
                        height={pillH}
                      />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Modal */}
      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={handleCancelModal}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCancelModal}>
          <Pressable style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>Create Shift</Text>

            {!!confirm && (
              <>
                <Text style={styles.confirmInfo}>
                  {confirm.dateObj.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
                <Text style={styles.confirmInfo}>
                  {minutesToLabel(confirm.startMin)} ➜ {minutesToLabel(confirm.endMin)}
                </Text>

                {/* Staff dropdown */}
                <SimpleSelect
                  label="Staff"
                  items={staffList}
                  getKey={(s) => String(s.id ?? s._id ?? s.aic)}
                  getLabel={(s) =>
                    [s.firstName, s.lastName].filter(Boolean).join(" ") ||
                    s.email ||
                    "Unknown"
                  }
                  value={staffId}
                  onChange={setStaffId}
                />

                {/* Shift text input */}
                <Text style={styles.inputLabel}>Shift</Text>
                <TextInput
                  // value={shiftText}
                  onChangeText={setShiftText}
                  placeholder="Please enter shift name"
                  placeholderTextColor="#999"
                  style={styles.textInput}
                />
              </>
            )}

            <View style={styles.confirmRow}>
              <TouchableOpacity
                style={[
                  styles.btn,
                  styles.btnPrimary,
                  !canConfirm && { opacity: 0.5 },
                ]}
                disabled={!canConfirm}
                onPress={handleConfirmModal}
              >
                <Text style={styles.btnPrimaryText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={handleCancelModal}>
                <Text style={styles.btnGhostText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/* --- styles --- */
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginHorizontal: 10,
    marginTop: 6,
  },
  dayLabelHeaderCell: {
    width: 40,
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
    width: 40,
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
  timelineRow: {
    borderRightWidth: 1,
    borderBottomWidth: 2,
    overflow: "hidden",
  },
  gridColumns: { flexDirection: "row", ...StyleSheet.absoluteFillObject },
  gridCol: { height: "100%", backgroundColor: "#fff" },
  vLine: { position: "absolute", top: 0, bottom: 0, width: StyleSheet.hairlineWidth, backgroundColor: "#ddd" },
  vLineHalf: { position: "absolute", top: 0, bottom: 0, width: StyleSheet.hairlineWidth, backgroundColor: "#eee" },
  eventBlock: { position: "absolute", borderRadius: 6, paddingHorizontal: 6, justifyContent: "center" },
  eventText: { color: "#fff", fontSize: 10, fontWeight: "700" },

  // modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" },
  confirmCard: { width: "88%", backgroundColor: "#fff", borderRadius: 12, padding: 18 },
  confirmTitle: { fontSize: 16, fontWeight: "800", color: "#000", marginBottom: 6 },
  confirmInfo: { color: "#333", marginVertical: 2, fontWeight: "600" },

  inputLabel: { marginTop: 12, marginBottom: 6, color: "#222", fontWeight: "700" },
  textInput: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 10, color: "#000", backgroundColor: "#fff",
  },

  // dropdown
  selectBox: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: "#fff" },
  dropdownMenu: {
    marginTop: 6, borderWidth: 1, borderColor: "#ddd", borderRadius: 10, backgroundColor: "#fff",
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  dropdownItem: { paddingVertical: 10, paddingHorizontal: 12 },

  confirmRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 16 },
  btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  btnPrimary: { backgroundColor: PILL_COLOR },
  btnPrimaryText: { color: "#fff", fontWeight: "800" },
  btnGhost: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#444" },
  btnGhostText: { color: "#333", fontWeight: "800" },
});
