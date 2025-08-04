import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AddStaffModal from './AddStaffModal';
import { useNavigation } from '@react-navigation/native';

const mockStaff = [
    {
      id: '1',
      name: 'Ron Mansolo',
      mobile: '123-456-7890',
      email: 'ron@email.com',
      active: true,
      role: 'Admin',
      avatar: require('../../../../../assets/images/nurse.png'),
      shifts: [
        { date: 'March 5, 2024', time: '2:00 AM - 9:00 AM' },
        { date: 'March 4, 2024', time: '2:00 AM - 9:00 AM' },
        { date: 'March 3, 2024', time: '2:00 AM - 9:00 AM' },
        { date: 'March 2, 2024', time: '2:00 AM - 9:00 AM' },
        { date: 'March 1, 2024', time: '2:00 AM - 9:00 AM' },
      ],
    },
    {
      id: '2',
      name: 'Mike Grey',
      mobile: '456-789-1234',
      email: 'mg@email.com',
      active: true,
      role: 'Employee',
      avatar: require('../../../../../assets/images/nurse.png'),
      shifts: [
        { date: 'February 29, 2024', time: '2:00 AM - 9:00 AM' },
      ],
    },
    // Add others similarly...
  ];
  

export default function StaffTab() {
    const navigation = useNavigation();
    
    const [modalVisible, setModalVisible] = useState(false);
    
    const [menuVisibleId, setMenuVisibleId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const dotRefs = useRef({});

    const renderItem = ({ item }) => {
        return (
          <View>
            <View style={styles.row}>
              <TouchableOpacity
                style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
                onPress={() => navigation.navigate('StaffDetail', { staff: item })}
              >
                <Image
                  source={item.avatar || require('../../../../../assets/images/woman.png')}
                  style={styles.avatar}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.role}>{item.role}</Text>
                </View>
              </TouchableOpacity>
{/*       
              <TouchableOpacity
                ref={(ref) => {
                  if (ref) dotRefs.current[item.id] = ref;
                }}
                onPress={() => {
                  const ref = dotRefs.current[item.id];
                  if (ref && ref.measureInWindow) {
                    ref.measureInWindow((x, y, width, height) => {
                      setMenuVisibleId(item.id);
                      setMenuPosition({ x, y: y + height + 4 });
                      console.log("x:", x, "y:", y, "height:", height);
                      console.log("Rendering modal for ID:", menuVisibleId);

                    });
                  }
                }}
              >
                <Text style={styles.dots}>⋯</Text>
              </TouchableOpacity> */}
            </View>
      
            {/* MODAL MENU */}
            {/* {menuVisibleId === item.id && (
              <View
                style={[
                  styles.menu,
                  {
                    top: menuPosition.y,
                    left: menuPosition.x - 220,
                    position: 'absolute',
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisibleId(null);
                    navigation.navigate('StaffEdit', { staff: item });
                  }}
                >
                  <Text style={styles.menuItem}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setMenuVisibleId(null);
                    console.log('Delete', item.name);
                  }}
                >
                  <Text style={styles.menuItem}>Delete</Text>
                </TouchableOpacity>
              </View>
            )} */}
          </View>
        );
      };
      
      
      

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Search"
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockStaff}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />

     <AddStaffModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(newStaff) => {
            // handle staff addition logic
            setModalVisible(false);
            console.log(newStaff);
        }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // light background
    paddingTop: 10,
    position: 'relative',
  },
  dots: {
    fontSize: 24,
    color: '#000',
    paddingHorizontal: 8,
  },
  
  menu: {
    position: 'absolute',
    backgroundColor: 'red', // ⬅ light mode
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 8,
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  
  
  header: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    color: '#000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  role: {
    color: '#555',
    fontSize: 12,
  },
});
