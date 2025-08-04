import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AddShiftModal from './AddShiftModal';
import { useNavigation } from '@react-navigation/native';

const initialShifts = [
  { id: '1', name: 'EARLY', start: '6:00 PM', end: '2:00 AM' },
  { id: '2', name: 'LATE', start: '2:00 AM', end: '9:00 AM' },
  { id: '3', name: 'MID', start: '10:00 PM', end: '6:00 AM' },
  { id: '4', name: 'MORNING', start: '9:00 AM', end: '5:00 PM' },
];

export default function ShiftTab() {
  const navigation = useNavigation();
  const [shifts, setShifts] = useState(initialShifts);
  const [modalVisible, setModalVisible] = useState(false);

  const addShift = (newShift) => {
    setShifts((prev) => [
      ...prev,
      { ...newShift, id: String(prev.length + 1) },
    ]);
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ShiftDetailScreen', { shift: item })}>
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.time}>{item.start} → {item.end}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Shifts</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={shifts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <AddShiftModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addShift}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#290135',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '600',
  },
  time: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
});
