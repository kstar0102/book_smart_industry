import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AddShiftModal from './AddShiftModal';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getShiftTypes } from '../../../../../utils/useApi';

export default function ShiftTab() {
  const navigation = useNavigation();
  const [shifts, setShifts] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchShiftTypes();
    }, [])
  );
  
  const fetchShiftTypes = async () => {
    const aicValue = await AsyncStorage.getItem('aic');
    const userData = { aic: parseInt(aicValue, 10) };
    const response = await getShiftTypes(userData, 'restau_manager');
  
    if (response.error) {
      console.warn("Failed to fetch shift types", response.error);
    } else {
      console.log("Fetched shift types:", response);
      setShifts(response.shiftType); 
    }
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
        onReload={fetchShiftTypes} // 🔁 fetch updated list
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
