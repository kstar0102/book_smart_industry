import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, Text, TouchableOpacity, Modal, Image, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { useAtom } from 'jotai';
import { firstNameAtom, lastNameAtom,  } from '../context/AdminAuthProvider';
import { RFValue } from 'react-native-responsive-fontsize';
import images from '../assets/images';

const { width, height } = Dimensions.get('window');

export default function AHeader({currentPage, navigation}) {
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [modal, setModal] = useState(false);
  const [curTab, setCurTab] = useState('');
  const toggleModal = () => {
    setModal(!modal);
  };

  const handlePageNavigate = (navUrl) => {
    toggleModal();
    navigation.navigate(navUrl);
  };

  return (
    <Card style={styles.shadow}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: height * 0.143,}}>
        <TouchableOpacity style={{width: 40, height: 70, flexDirection: 'column', justifyContent:'space-between', paddingTop: 50, paddingLeft: 20, zIndex: 0}} onPress={toggleModal}>
          <View style={{width: '100%', height: 4, backgroundColor: 'white', borderRadius: 2}}></View>
          <View style={{width: '100%', height: 4, backgroundColor: 'white', borderRadius: 2}}></View>
          <View style={{width: '100%', height: 4, backgroundColor: 'white', borderRadius: 2}}></View>
        </TouchableOpacity>
        <Text style={styles.text}>BookSmart™</Text>
        <View style={{width: 50, height: 20}} />
      </View>
      <View style={styles.bottomStyle}></View>
      <Modal
        visible={modal}
        transparent= {true}
        animationType="fade"
        onRequestClose={toggleModal}
      >
        <StatusBar hidden={true}/>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer} >
            <TouchableWithoutFeedback>
              <View style={styles.calendarContainer}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>{firstName + ' ' + lastName}</Text>
                </View>
                <View style={styles.body}>
                  {curTab === '' && (
                    <View style={styles.modalBody}>
                      <View style={{ width: 'auto', height: 30, marginVertical: 10 }}>
                        <TouchableOpacity
                          style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
                          onPress={() => setCurTab('Healthcare')}
                        >
                          <Image
                            source={images.healthcare}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                          />
                          <Text style={styles.title}>Healthcare</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: 'auto', height: 30, marginVertical: 10 }}>
                        <TouchableOpacity
                          style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
                          onPress={() => setCurTab('Hospitality')}
                        >
                          <Image
                            source={images.hospital}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                          />
                          <Text style={styles.title}>Hospitality</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: 'auto', height: 30, marginVertical: 10 }}>
                        <TouchableOpacity
                          style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
                          onPress={() => setCurTab('Construction')}
                        >
                          <Image
                            source={images.construction}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                          />
                          <Text style={styles.title}>Construction</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                  {curTab === 'Healthcare' && (
                    <View style={styles.modalBody}>
                      <View style={{ width: 'auto', height: 30, marginBottom: 20 }}>
                        <TouchableOpacity
                          style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
                          onPress={() => {}}
                        >
                          <Image
                            source={images.healthcare}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                          />
                          <Text style={styles.title}>HEALTHCARE</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.subTitle, currentPage === 0 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminDashboard')}>📊 Admin Dashboard</Text>
                      <Text style={[styles.subTitle, currentPage === 1 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AllJobShiftListing')}>📋 All Job  / Shift Listings</Text>
                      <Text style={[styles.subTitle, currentPage === 2 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminCompany')}>💼 Admin / Company Profile</Text>
                      <Text style={[styles.subTitle, currentPage === 3 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminHome')}>🏚️ Admin Home</Text>
                      <Text style={[styles.subTitle, currentPage === 4 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AllCaregivers')}>👩‍⚕️ All Caregivers</Text>
                      <Text style={[styles.subTitle, currentPage === 5 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminAllUser')}>🎯 Admin - All Users </Text>
                      <Text style={[styles.subTitle, currentPage === 6 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminFacilities')}>🏢 All Facilities</Text>
                      <Text style={[styles.subTitle, currentPage === 7 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('CaregiverTimeSheet')}>Caregiver Timesheet</Text>
                      {/* <Text style={[styles.subTitle, currentPage === 9 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminMessage')}>Message</Text> */}
                      <Text style={[styles.subTitle1, currentPage === 8 && {backgroundColor: 'grey'}]} onPress={() => setCurTab('')}>Back</Text>
                    </View>
                  )}
                  {curTab === 'Hospitality' && (
                    <View style={styles.modalBody}>
                      <View style={{ width: 'auto', height: 30, marginBottom: 20 }}>
                        <TouchableOpacity
                          style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
                          onPress={() => {}}
                        >
                          <Image
                            source={images.hospital}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                          />
                          <Text style={styles.title}>Hospitality</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.subTitle, currentPage === 0 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('HospitalityAdminDashboard')}>📊 Admin Dashboard</Text>
                      <Text style={[styles.subTitle, currentPage === 1 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('HospitalityAllJobShiftList')}>📋 All Job  / Shift Listings</Text>
                      <Text style={[styles.subTitle, currentPage === 2 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminCompany')}>💼 Admin / Company Profile</Text>
                      <Text style={[styles.subTitle, currentPage === 3 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminHome')}>🏚️ Admin Home</Text>
                      <Text style={[styles.subTitle, currentPage === 4 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('HospitalityAllContactors')}>👩‍⚕️ All Independent Contractors</Text>
                      <Text style={[styles.subTitle, currentPage === 5 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('HospitalityAdminAllUsers')}>🎯 Admin - All Users </Text>
                      <Text style={[styles.subTitle, currentPage === 6 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('HospitalityAdminAllHotelRestaurant')}>🏢 All Hotels & Restaurants</Text>
                      <Text style={[styles.subTitle, currentPage === 7 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('HospitalityAdminCaregiverTimeSheet')}>Contractor Timesheet</Text>
                      <Text style={[styles.subTitle1, currentPage === 8 && {backgroundColor: 'grey'}]} onPress={() => setCurTab('')}>Back</Text>
                    </View>
                  )}
                  {curTab === 'Construction' && (
                    <View style={styles.modalBody}>
                      <View style={{ width: 'auto', height: 30, marginBottom: 20 }}>
                        <TouchableOpacity
                          style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}
                          onPress={() => {}}
                        >
                          <Image
                            source={images.construction}
                            style={{ width: 40, height: 40 }}
                            resizeMode="contain"
                          />
                          <Text style={styles.title}>Construction</Text>
                        </TouchableOpacity>
                      </View>
                      <Text style={[styles.subTitle, currentPage === 0 && {backgroundColor: 'grey'}]} onPress={() => {}}>📊 Admin Dashboard</Text>
                      <Text style={[styles.subTitle, currentPage === 1 && {backgroundColor: 'grey'}]} onPress={() => {}}>📋 All Job  / Shift Listings</Text>
                      <Text style={[styles.subTitle, currentPage === 2 && {backgroundColor: 'grey'}]} onPress={() => {}}>💼 Admin / Company Profile</Text>
                      <Text style={[styles.subTitle, currentPage === 3 && {backgroundColor: 'grey'}]} onPress={() => {}}>🏚️ Admin Home</Text>
                      <Text style={[styles.subTitle, currentPage === 4 && {backgroundColor: 'grey'}]} onPress={() => {}}>👩‍⚕️ All Caregivers</Text>
                      <Text style={[styles.subTitle, currentPage === 5 && {backgroundColor: 'grey'}]} onPress={() => {}}>🎯 Admin - All Users </Text>
                      <Text style={[styles.subTitle, currentPage === 6 && {backgroundColor: 'grey'}]} onPress={() => {}}>🏢 All Facilities</Text>
                      <Text style={[styles.subTitle, currentPage === 7 && {backgroundColor: 'grey'}]} onPress={() => {}}>Caregiver Timesheet</Text>
                      <Text style={[styles.subTitle1, currentPage === 8 && {backgroundColor: 'grey'}]} onPress={() => setCurTab('')}>Back</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Card>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 0,
    backgroundColor: '#13032f',
    width: '100%',
    minHeight: height * 0.15,
    top: 0,
    position:'absolute',
  },
  text: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingRight: 20,
    paddingTop: 50,
    paddingVertical: 10,
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  headerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },
  bottomStyle: {
    width: '100%',
    height: height * 0.007,
    backgroundColor: "#BC222F"
  },
  modalContainer: {
    display: 'block',
    height: '100%',
    zIndex: 10
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: '#f2f2f2',
    elevation: 5,
    width: '70%',
    borderColor: '#7bf4f4',
    height: '100%'
  },
  modalBody: {
    // backgroundColor: 'rgba(79, 44, 73, 0.19)',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 10,
    width: '100%'
  },
  header: {
    height: 60,
    paddingLeft: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  subTitle: {
    paddingVertical: 10,
    marginLeft: 10,
    color: 'blue',
    fontSize: 18,
    width: '100%'
  },
  subTitle1: {
    paddingVertical: 10,
    marginLeft: 10,
    color: 'black',
    fontSize: 18,
    width: '100%',
    fontWeight: 'bold'
  },
  title: {
    color: 'black',
    fontSize: RFValue(18),
    width: '100%',
    fontWeight: 'bold'
  }
});
