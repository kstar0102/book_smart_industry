import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Dimensions,
  navigation,
  TouchableOpacity
} from 'react-native';
import MFooter from '../../../../components/Mfooter';
import MHeader from '../../../../components/Mheader';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');
const FOOTER_HEIGHT = RFValue(130);

const MOCK_SHIFTS = [
  { location: 'Central Kitchen', date: '2025-08-10', time: '08:00 — 16:00', status: 'PENDING' },
  { location: 'Riverside Bistro', date: '2025-08-11', time: '12:00 — 20:00', status: 'PENDING' },
  { location: 'Grand Hotel – Banquet', date: '2025-08-12', time: '18:00 — 23:00', status: 'APPROVED' },
  { location: 'Airport Lounge T2', date: '2025-08-13', time: '07:00 — 15:00', status: 'PENDING' },
  { location: 'Old Town Café', date: '2025-08-14', time: '09:00 — 17:00', status: 'REJECTED' },
];

const statusStyle = (status) => {
  switch (status) {
    case 'PENDING': return { bg: '#FEF9C3', fg: '#A16207' };
    case 'APPROVED': return { bg: '#DCFCE7', fg: '#166534' };
    case 'REJECTED': return { bg: '#FEE2E2', fg: '#991B1B' };
    default: return { bg: '#EEE', fg: '#000' };
  }
};

export default function HospitalityHotelWorkAssignedShift() {
  const renderItem = ({ item }) => {
    const chip = statusStyle(item.status);
    return (
      <View style={styles.card}>
        <View style={[styles.statusChip, { backgroundColor: chip.bg }]}>
          <Text style={[styles.statusText, { color: chip.fg }]}>{item.status}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Location :</Text>
          <Text 
            style={styles.value} 
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.location}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date :</Text>
          <Text 
            style={styles.value}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.date}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Time :</Text>
          <Text style={styles.value}>{item.time}</Text>
        </View>

        

        {/* Actions */}
        {item.status === 'PENDING' ? (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.acceptBtn]} onPress={() => {}}>
              <Text style={styles.actionText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.rejectBtn]} onPress={() => {}}>
              <Text style={styles.actionText}>Reject</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionCRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => {}}>
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const ListHeader = (
    <View style={styles.headerWrap}>
      <View style={styles.topView}>
      <AnimatedHeader title="RESTAURANT ASSIGNED SHIFTS" />
        <View style={styles.bottomBar} />
      </View>

      <Text style={styles.subtitle}>
        All shifts are assigned directly to you by manager. Please 
        <Text style = {{fontWeight : "bold"}}>{' '}approve</Text> or 
        <Text style = {{fontWeight : "bold"}}>{' '}cancel</Text> them.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent"/>
      <MHeader navigation={navigation} back={true}/>
        <FlatList
          data={MOCK_SHIFTS}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={[
            styles.listContent,
            { marginTop: height * 0.15,
              paddingBottom: FOOTER_HEIGHT + RFValue(34),
            }
          ]}
          showsVerticalScrollIndicator={false}
        />
      <MFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    width: '100%', 
    backgroundColor: '#fff' 
  },

  listContent: {
    paddingHorizontal: RFValue(16),
    paddingBottom: RFValue(40),
  },

  headerWrap: {
    alignItems: 'center',
    paddingTop: RFValue(1),
  },

  topView: { 
    marginTop: RFValue(4), 
    width: '100%', 
    alignItems: 'center' 
  },

  title: { 
    fontSize: RFValue(18), 
    fontWeight: 'bold', 
    color: '#000' 
  },
  bottomBar: {
    marginTop: RFValue(30),
    height: RFValue(5),
    backgroundColor: '#4f70ee1c',
    width: '80%',
    borderRadius: RFValue(6),
  },
  subtitle: {
    fontSize: RFValue(14),
    color: '#000',
    textAlign: 'center',
    marginTop: RFValue(16),
    paddingHorizontal: RFValue(12),
    marginBottom : RFValue(15)
  },
  card: {
    backgroundColor: '#dcd6fa',
    borderRadius: RFValue(14),
    padding: RFValue(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: RFValue(10),
  },
  row: { 
    flexDirection: 'row', 
    marginBottom: RFValue(6) 
  },
  label: { 
    color : 'black',
    fontWeight: 'bold',
    fontSize: RFValue(15),
    lineHeight: RFValue(20),
    width: '30%'
  },
  value: { 
    width: '70%', 
    color: 'black', 
    fontSize: RFValue(13.5),
    overflow: 'hidden', 
    minWidth: 0,  },
  statusChip: {
    alignSelf: 'flex-end',
    paddingVertical: RFValue(4),
    paddingHorizontal: RFValue(10),
    borderRadius: RFValue(999),
    marginTop: RFValue(2),
    marginBottom : RFValue(10)
  },
  statusText: { fontWeight: '700', fontSize: RFValue(12) },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: RFValue(8),
    marginTop: RFValue(5),
  },
  actionCRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: RFValue(8),
    marginTop: RFValue(5),
  },
  actionBtn: {
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(14),
    borderRadius: RFValue(8),
    width: 130,
    alignItems: 'center',      
    justifyContent: 'center',
  },
  acceptBtn: { backgroundColor: '#A020F0' },
  rejectBtn: { backgroundColor: '#991B1B' },
  cancelBtn: { backgroundColor: '#6B7280' },
  actionText: { color: '#fff', fontWeight: '700', fontSize: RFValue(12)},
});
