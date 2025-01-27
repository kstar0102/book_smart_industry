import React, { useState, useEffect } from 'react';
import { TouchableOpacity, TextInput, View, StyleSheet, Image, ScrollView, Dimensions, StatusBar, Modal } from 'react-native';
import { Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import MFooter from '../../../components/Mfooter';
import SubNavbar from '../../../components/SubNavbar';
import { Table } from 'react-native-table-component';
import { getCaregiverTimesheets } from '../../../utils/useApi';
import { Dropdown } from 'react-native-element-dropdown';
import AHeader from '../../../components/Aheader';
import AnimatedHeader from '../../AnimatedHeader';
import Loader from '../../Loader';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

export default function HospitalityAdminCaregiverTimeSheet({ navigation }) {
  const [restauData, setRestauData] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [rSearch, setRestauSearch] = useState('');
  const [hSearch, setHotelSearch] = useState('');
  const [rCurPage, setRestauCurPage] = useState(1);
  const [hCurPage, setHotelCurPage] = useState(1);
  const [restauPageList, setRestauPageList] = useState([
    {label: 'Page 1', value: 1}
  ]);
  const [hotelPageList, setHotelPageList] = useState([
    {label: 'Page 1', value: 1}
  ]);
  const [isRestauFocus, setRestauFocus] = useState(false);
  const [isHotelFocus, setHotelFocus] = useState(false);
  const [loading, setLoading] = useState(false);

  const tableHead = [
    'Job-ID',
    'Nurse',
    'Job Shift & Time',
    'Job Status',
    'Caregiver Hours Worked',
    'Pre Time',
    'Lunch',
    'Lunch Equation',
    'Final Hours Equatioin'
  ];
  const widths = [100, 150, 300, 250, 250, 100, 100, 150, 200];

  const getData = async (requestData = { restauSearch: rSearch, hotelSearch: hSearch, restauPage: rCurPage, hotelPage: hCurPage } ) => {
    setLoading(true);
    let result = await getCaregiverTimesheets(requestData, 'hospitality');
  
    if (!result.error) {
      setRestauData(result.restauData);
      setHotelData(result.hotelData);

      let restauPageContent = [];
      for (let i = 1; i <= result.totalRestauPageCnt; i++) {
        restauPageContent.push({ label: 'Page ' + i, value: i });
      }
      setRestauPageList(restauPageContent);

      let hotelPageContent = [];
      for (let i = 1; i <= result.totalHotelPageCnt; i++) {
        hotelPageContent.push({ label: 'Page ' + i, value: i });
      }
      setHotelPageList(hotelPageContent);
    } else {
      setRestauData([]);
      setHotelData([]);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  useEffect(() => {
    getData();
  }, [rCurPage, hCurPage]);

  const handleRestauSearchReset = (event) => {
    event.persist();
  
    setRestauSearch(''); 
    getData({ restauSearch: '' });
  };

  const handleHotelSearchReset = (event) => {
    event.persist();
  
    setHotelSearch(''); 
    getData({ hotelSearch: '' });
  };
  
  const handleSearch = (event) => {
    event.persist();
    getData();
  };
  
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent"/>
      <AHeader navigation={navigation}  currentPage={7} />
      <SubNavbar navigation={navigation} name={"AdminLogin"}/>
      <ScrollView style={{ width: '100%', marginTop: height * 0.22 }} showsVerticalScrollIndicator={false}>
        <View style={styles.topView}>
          <AnimatedHeader title="HOSPITALITY TIMESHEET" />
          <View style={styles.bottomBar} />
        </View>
        <View style={{ marginTop: 30, flexDirection: 'row', width: '90%', marginLeft: '5%', gap: 10 }}></View>
        <View>
          <View style={styles.body}>
            <View style={styles.modalBody}>
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: RFValue(20), fontWeight: 'bold' }}>Restaurant</Text>
              </View>
              <View style={styles.searchBar}>
                <TextInput
                  style={styles.searchText}
                  placeholder=""
                  onChangeText={e => setRestauSearch(e)}
                  value={rSearch}
                />
                <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                  <Text>Search</Text>
                </TouchableOpacity>
                {rSearch && <TouchableOpacity style={styles.searchBtn} onPress={handleRestauSearchReset}>
                  <Text>Reset</Text>
                </TouchableOpacity>}
              </View>
              <Dropdown
                style={[styles.dropdown, isRestauFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.itemTextStyle}
                iconStyle={styles.iconStyle}
                data={restauPageList}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Page 1'}
                value={rCurPage ? rCurPage : 1}
                onFocus={() => setRestauFocus(true)}
                onBlur={() => setRestauFocus(false)}
                onChange={item => {
                  setRestauCurPage(item.value);
                  setRestauFocus(false);
                }}
                renderLeftIcon={() => (
                  <View
                    style={styles.icon}
                    color={isRestauFocus ? 'blue' : 'black'}
                    name="Safety"
                    size={20}
                  />
                )}
              />
              <ScrollView horizontal={true} style={{ width: '95%', borderWidth: 1, marginBottom: 30, borderColor: 'rgba(0, 0, 0, 0.08)' }}>
                <Table >
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccffff' }}>
                    {tableHead.map((item, index) => (
                      <Text
                        key={index}
                        style={[styles.tableText, { width: widths[index], textAlign: 'center' }]}
                      >
                        {item}
                      </Text>
                    ))}
                  </View>
                  {restauData && restauData.length > 0 ? (
                    restauData.map((rowData, rowIndex) => (
                      rowData && rowData.length > 0 ? (
                        <View key={rowIndex} style={{ flexDirection: 'row' }}>
                          {rowData.map((cellData, cellIndex) => (
                            <View key={cellIndex} style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.08)', padding: 10, backgroundColor: '#E2E2E2', width: widths[cellIndex] }}>
                              <Text style={[styles.tableText, { borderWidth: 0 }]}>{cellData}</Text>
                            </View>
                          ))}
                        </View>
                      ) : null
                    ))
                  ) : (
                    <View style={{ padding: 20 }}>
                      <Text>No data available</Text>
                    </View>
                  )}
                </Table>
              </ScrollView>
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: RFValue(20), fontWeight: 'bold' }}>Hotel</Text>
              </View>
              <View style={styles.searchBar}>
                <TextInput
                  style={styles.searchText}
                  placeholder=""
                  onChangeText={e => setHotelSearch(e)}
                  value={hSearch}
                />
                <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
                  <Text>Search</Text>
                </TouchableOpacity>
                {hSearch && <TouchableOpacity style={styles.searchBtn} onPress={handleHotelSearchReset}>
                  <Text>Reset</Text>
                </TouchableOpacity>}
              </View>
              <Dropdown
                style={[styles.dropdown, isRestauFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.itemTextStyle}
                iconStyle={styles.iconStyle}
                data={hotelPageList}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'Page 1'}
                value={hCurPage ? hCurPage : 1}
                onFocus={() => setHotelFocus(true)}
                onBlur={() => setHotelFocus(false)}
                onChange={item => {
                  setHotelCurPage(item.value);
                  setHotelFocus(false);
                }}
                renderLeftIcon={() => (
                  <View
                    style={styles.icon}
                    color={isHotelFocus ? 'blue' : 'black'}
                    name="Safety"
                    size={20}
                  />
                )}
              />
              <ScrollView horizontal={true} style={{ width: '95%', borderWidth: 1, marginBottom: 30, borderColor: 'rgba(0, 0, 0, 0.08)' }}>
                <Table >
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccffff' }}>
                    {tableHead.map((item, index) => (
                      <Text
                        key={index}
                        style={[styles.tableText, { width: widths[index], textAlign: 'center' }]}
                      >
                        {item}
                      </Text>
                    ))}
                  </View>
                  {hotelData && hotelData.length > 0 ? (
                    hotelData.map((rowData, rowIndex) => (
                      rowData && rowData.length > 0 ? (
                        <View key={rowIndex} style={{ flexDirection: 'row' }}>
                          {rowData.map((cellData, cellIndex) => (
                            <View key={cellIndex} style={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.08)', padding: 10, backgroundColor: '#E2E2E2', width: widths[cellIndex] }}>
                              <Text style={[styles.tableText, { borderWidth: 0 }]}>{cellData}</Text>
                            </View>
                          ))}
                        </View>
                      ) : null
                    ))
                  ) : (
                    <View style={{ padding: 20 }}>
                      <Text>No data available</Text>
                    </View>
                  )}
                </Table>
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
      <Loader visible={loading} />
      <MFooter />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    width: '100%'
  },
  topView: {
    marginLeft: '10%',
    width: '80%',
    position: 'relative'
  },
  filterRow: {
    width: '100%',
    marginBottom: 30
  },
  removeButton: {
    color: 'white',
    textAlign: 'center'
  },
  backTitle: {
    backgroundColor: 'black',
    width: '100%',
    height: '55',
    marginTop: 10,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 500,
    color: 'black',
    top: 10
  },
  title: {
    fontSize: RFValue(18),
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    paddingVertical: 10
  },
  bottomBar: {
    marginTop: 30,
    height: 5,
    backgroundColor: '#4f70ee1c',
    width: '100%'
  },
  text: {
    fontSize: RFValue(14),
    color: 'black',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 30,
    width: '90%',
    marginLeft: '5%'
  },
  imageButton: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  profile: {
    marginTop: 20,
    width: '84%',
    marginLeft: '7%',
    padding: 20,
    backgroundColor: '#c2c3c42e',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#b0b0b0',
    // elevation: 1,
    // // shadowColor: 'rgba(0, 0, 0, 0.4)',
    // // shadowOffset: { width: 1, height: 1 },
    // shadowRadius: 0,
  },
  profileTitleBg: {
    backgroundColor: '#BC222F',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginLeft: '10%',
    marginBottom: 20
  },
  profileTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: RFValue(14),
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#22138e',
    fontWeight: 'bold',
  },
  row: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'hsl(0, 0%, 86%)',
    // height: 40,
    position: 'relative',
    backgroundColor: 'white',
    width: '100%',
  },
  evenRow: {
    backgroundColor: '#7be6ff4f', // Set the background color for even rows
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    height: '20%,',
    padding: 20,
    borderBottomColor: '#c4c4c4',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  closeButton: {
    color: 'red',
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginBottom: 100
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    elevation: 5,
    width: '80%',
    marginLeft: '20',
    flexDirection: 'flex-start',
    borderWidth: 3,
    borderColor: '#7bf4f4',
  },
  modalBody: {
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '60%',
    borderRadius: 10,
    marginBottom: 10
  },
  searchText: {
    width: 150,
    backgroundColor: 'white',
    paddingVertical: 5,
    color: 'black',
    height: 30,
  },
  searchBtn: {
    width: 80,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    color: '#2a53c1',
    marginLeft: 5
  },
  filterItem: {
    paddingHorizontal: 10,
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    color: '#2a53c1',
    marginRight: 5,
    marginBottom: 3,
    borderRadius: 50,
  },
  filterItemTxt: {
    color: 'blue',
    textDecorationLine: 'underline'
  },
  filter: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  filterBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    gap: 5
  },
  filterText: {
    color: '#2a53c1',
  },
  subBtn: {
    backgroundColor: '#194f69',
    borderColor: '#ffaa22',
    borderWidth: 2,
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    gap: 10,
    flexDirection: 'row'
  },
  head: {
    backgroundColor: '#7be6ff4f',
    // width: 2000,
    height: 40,
  },
  tableText: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    borderWidth: 1, 
    borderColor: 'rgba(0, 0, 0, 0.08)',
    height: 40,
    textAlignVertical: 'center'
  },
  dropdown: {
    height: 30,
    width: '50%',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: RFValue(14),
  },
  placeholderStyle: {
    color: 'black',
    fontSize: RFValue(16),
  },
  selectedTextStyle: {
    color: 'black',
    fontSize: RFValue(16),
  },
  itemTextStyle: {
    color: 'black',
    fontSize: RFValue(16),
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: RFValue(16),
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginTop: 30,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',            // Text color
    fontSize: RFValue(16),              // Text size
  },
  input: {
    backgroundColor: 'white', 
    height: 30,
    color: 'black',
    paddingVertical: 5,
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: 'hsl(0, 0%, 86%)',
  },
});
