import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getAllUsersInRestau,
  addStaffToManager,
  getStaffShiftInfo
} from '../../../../../utils/useApi';

export default function AddStaffModal({ visible, onClose, onSubmit  }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchUsers();
    }
  }, [visible]);

  // const fetchUsers = async () => {
  //   setLoading(true);
  //   try {
  //     const aic = await AsyncStorage.getItem('aic');
  
  //     const [allUsers, assignedUsers] = await Promise.all([
  //       getAllUsersInRestau('restau_manager'),
  //       getStaffShiftInfo('restau_manager', aic),
  //     ]);
  
  //     const assignedAics = new Set(assignedUsers.map(user => user.aic));
  //     const filteredUsers = allUsers.filter(user => !assignedAics.has(user.aic));
  
  //     setUsers(filteredUsers);
  //     setSelectedUsers([]);
  //   } catch (err) {
  //     console.error('Failed to fetch staff data:', err);
  //     alert('An error occurred while loading staff list.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Read required values in parallel
      const [aicRaw, roleRaw] = await Promise.all([
        AsyncStorage.getItem('aic'),
        AsyncStorage.getItem('HireRole'),
      ]);
  
      const managerAic = (aicRaw || '').trim();
      const role = (roleRaw || '').trim();
  
      const roleToEndpoint = {
        restaurantManager: 'restau_manager',
        hotelManager: 'hotel_manager',
      };
  
      const endpoint = roleToEndpoint[role];
      if (!endpoint || !managerAic) {
        console.warn('fetchUsers: missing endpoint or managerAic', { role, endpoint, managerAic });
        alert('Missing manager info. Please re-login and try again.');
        return;
      }
  
      // Fetch both lists in parallel
      const [allUsersRes, assignedUsersRes] = await Promise.all([
        getAllUsersInRestau(endpoint),
        getStaffShiftInfo(endpoint, managerAic),
      ]);
  
      const allUsers = Array.isArray(allUsersRes) ? allUsersRes : [];
      const assignedUsers = Array.isArray(assignedUsersRes) ? assignedUsersRes : [];
  
      // Build a set of assigned AICs (as strings to be safe)
      const assignedAics = new Set(
        assignedUsers
          .map(u => (u?.aic != null ? String(u.aic) : null))
          .filter(Boolean)
      );
  
      // Filter out already assigned users
      const filtered = allUsers.filter(u => !assignedAics.has(String(u?.aic)));
  
      setUsers(filtered);
      setSelectedUsers([]); // reset selection
    } catch (err) {
      console.error('Failed to fetch staff data:', err);
      alert('An error occurred while loading staff list.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const toggleSelect = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.find((u) => u.aic === user.aic);
      const updated = exists
        ? prev.filter((u) => u.aic !== user.aic)
        : [...prev, user];
      return updated;
    });
  };

  const renderUser = ({ item }) => {
    const isSelected = selectedUsers.some((u) => u.aic === item.aic);
    return (
      <Pressable
        onPress={() => toggleSelect(item)}
        style={[styles.userItem, isSelected && styles.selected]}
      >
        <View style={styles.checkbox}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.userText}>
          {item.firstName} {item.lastName} - {item.email}
        </Text>
      </Pressable>
    );
  };

  const handleSubmit = async () => {
    const [aicRaw, roleRaw] = await Promise.all([
      AsyncStorage.getItem('aic'),
      AsyncStorage.getItem('HireRole'),
    ]);

    const aic = (aicRaw || '').trim();
    const role = (roleRaw || '').trim();

    // Map role -> API endpoint
    const endpointMap = {
      restaurantManager: 'restau_manager',
      hotelManager: 'hotel_manager',
    };
    const endpoint = endpointMap[role];

    if (!endpoint || !aic) {
      console.warn('loadShifts: missing endpoint or aic', { role, endpoint, aic });
      setStaffList([]);
      return;
    }

    const result = await addStaffToManager(endpoint, aic, selectedUsers);
    if (!result.error) {
      onSubmit(); // ✅ Reload staff list
    } else {
      alert('Failed to assign staff');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <Text style={styles.headerText}>Select Staff</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <FlatList
              data={users}
              keyExtractor={(item) => item.aic.toString()}
              renderItem={renderUser}
              style={{ marginVertical: 10 }}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: selectedUsers.length > 0 ? '#290135' : '#ccc',
                },
              ]}
              disabled={selectedUsers.length === 0}
              onPress={handleSubmit}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    maxHeight: '90%',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#000',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selected: {
    backgroundColor: '#f0e7f5',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#290135',
    borderRadius: 3,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#290135',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userText: {
    color: '#000',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelText: {
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
