import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MFooter from '../../../../../components/Mfooter';
import MHeader from '../../../../../components/Mheader';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

export default function StaffDetail({ route,  navigation}) {
  const { staff } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <MHeader back />

      <ScrollView
        style={{ width: '100%', marginTop: height * 0.15 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileContainer}>
            <View style={styles.editWrapper}>
                <TouchableOpacity style={styles.editButton}
                 onPress={() => navigation.navigate('StaffEdit', { staff })}
                >
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.editButton}
                 onPress={() => navigation.navigate('StaffEdit', { staff })}
                >
                    <Text style={styles.editText}>Delete</Text>
                </TouchableOpacity>
            </View>
            <Image source={staff.avatar} style={styles.profileImage} />
            <Text style={styles.profileName}>{staff.name}</Text>
        </View>


        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{staff.name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{staff.email}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Mobile</Text>
            <Text style={styles.value}>{staff.mobile}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Photo</Text>
            <Image source={staff.avatar} style={styles.smallAvatar} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>{staff.role}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Active</Text>
            <Text style={styles.value}>{staff.active ? '✔️' : '❌'}</Text>
          </View>
        </View>

        <Text style={styles.shiftHeader}>Scheduled Shifts</Text>
        {staff.shifts.map((item, index) => (
          <View key={index} style={styles.shiftBox}>
            <Text style={styles.shiftDate}>{item.date.toUpperCase()}</Text>
            <Text style={styles.shiftTime}>{item.time}</Text>
          </View>
        ))}
      </ScrollView>

      <MFooter />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      flex: 1,
      width: '100%',
    },

    editWrapper: {
        width: '100%',
        alignItems: 'flex-end',
        paddingRight: 10,
        position: 'absolute',
        top: 10,
        zIndex: 10,
    },
      
    content: {
      padding: 10,
      paddingBottom: 100,
    },
    profileContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    profileImage: {
      width: 90,
      height: 90,
      borderRadius: 45,
      marginBottom: 8,
    },
    profileName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#111',
    },
    editButton: {
      backgroundColor: '#290135',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 16,
      marginTop: 8,
      width: RFValue(60),
      justifyContent: 'center',
      alignItems: 'center', 
    },
    editText: {
      color: 'white',
      fontWeight: '500',
    },
    section: {
      backgroundColor: '#f8f9fb',
      borderRadius: 10,
      padding: 16,
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 8,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingBottom: 10,
    },
    label: {
      fontWeight: '600',
      color: '#555',
      fontSize: 16,
    },
    value: {
      fontSize: 16,
      color: '#111',
      fontWeight: '500',
    },
    smallAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    shiftHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#111',
    },
    shiftBox: {
        backgroundColor: '#f1f1f1',
        padding: 12,
        borderRadius: 10,
        marginBottom: 5,
        marginHorizontal : 5
      },
      shiftDate: {
        color: '#111',
        fontWeight: '700',
        fontSize: 13,
        marginBottom: 1,
      },
      shiftTime: {
        color: '#333',
        fontSize: 16,
      },
      
  });
  