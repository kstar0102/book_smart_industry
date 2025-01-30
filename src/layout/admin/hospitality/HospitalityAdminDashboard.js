import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import MFooter from '../../../components/Mfooter';
import AHeader from '../../../components/Aheader';
import SubNavbar from '../../../components/SubNavbar';
import { Table, Row, Rows } from 'react-native-table-component';
import { GetDashboardData } from '../../../utils/useApi';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedHeader from '../../AnimatedHeader';
import Loader from '../../Loader';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

export default function HospitalityAdminDashboard ({ navigation }) {
  const [restauJobInfo, setRestauJobInfo] = useState([
    {title: 'TOT. - JOBS / SHIFTS', content: 0},
    {title: 'TOT. - AVAILABLE', content: 0},
    {title: 'TOT. - AWARDED', content: 0},
    {title: 'TOT. - COMPLETED', content: 0},
    {title: 'TOT. - CANCELED', content: 0},
  ]);

  const [hotelJobInfo, setHotelJobInfo] = useState([
    {title: 'TOT. - JOBS / SHIFTS', content: 0},
    {title: 'TOT. - AVAILABLE', content: 0},
    {title: 'TOT. - AWARDED', content: 0},
    {title: 'TOT. - COMPLETED', content: 0},
    {title: 'TOT. - CANCELED', content: 0},
  ]);

  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [tableData3, setTableData3] = useState([]);
  const [tableData4, setTableData4] = useState([]);
  const [sum1,setSum1] = useState(0);
  const [sum2, setSum2] = useState(0);
  const [sum3,setSum3] = useState(0);
  const [sum4,setSum4] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const getData = async () => {
    setLoading(true);
    let data = await GetDashboardData('hospitality', 'Admin');
    if(data) {
      const newTableData1 = data.restauJob.map(item => [item._id, item.count]);
      setTableData1(newTableData1);
      const newTableData2 = data.hotelJob.map(item => [item._id, item.count]);
      setTableData2(newTableData2);
      const newTableData3 = data.restauResult.map(item => [item._id, item.count]);
      setTableData3(newTableData3);
      const newTableData4 = data.hotelResult.map(item => [item._id, item.count]);
      setTableData4(newTableData4);

      let totalRestauJobCount = 0;
      let restauSum = 0;
      let totalHotelJobCount = 0;
      let hotelSum = 0;

      data.restauJob.map((item, index) => {
        totalRestauJobCount += item.count;
      });

      data.restauResult.map((item, index) => {
        restauSum += item.count;
      });

      data.hotelJob.map((item, index) => {
        totalHotelJobCount += item.count;
      });

      data.hotelResult.map((item, index) => {
        hotelSum += item.count;
      });

      let totalAvailableRestauJobCnt = 0;
      let totalAwardedRestauJobCnt = 0;
      let totalCompletedRestauJobCnt = 0;
      let totalCancelledRestauJobCnt = 0;

      let totalAvailableHotelJobCnt = 0;
      let totalAwardedHotelJobCnt = 0;
      let totalCompletedHotelJobCnt = 0;
      let totalCancelledHotelJobCnt = 0;

      if (newTableData1.length > 0) {
        newTableData1.forEach((item) => {
          if (item[0] == 'Available') {
            totalAvailableRestauJobCnt = item[1];
          } else if (item[0] == 'Awarded') {
            totalAwardedRestauJobCnt = item[1]
          } else if (item[0] == 'Paid') {
            totalCompletedRestauJobCnt = item[1];
          } else if (item[0] == 'Cancelled') {
            totalCancelledRestauJobCnt = item[1];
          }
        });
      }

      if (newTableData2.length > 0) {
        newTableData2.forEach((item) => {
          if (item[0] == 'Available') {
            totalAvailableHotelJobCnt = item[1];
          } else if (item[0] == 'Awarded') {
            totalAwardedHotelJobCnt = item[1]
          } else if (item[0] == 'Paid') {
            totalCompletedHotelJobCnt = item[1];
          } else if (item[0] == 'Cancelled') {
            totalCancelledHotelJobCnt = item[1];
          }
        });
      }

      setRestauJobInfo([
        {title: 'TOT. - JOBS / SHIFTS', content: totalRestauJobCount},
        {title: 'TOT. - AVAILABLE', content: totalAvailableRestauJobCnt},
        {title: 'TOT. - AWARDED', content: totalAwardedRestauJobCnt},
        {title: 'TOT. - COMPLETED', content: totalCompletedRestauJobCnt},
        {title: 'TOT. - CANCELED', content: totalCancelledRestauJobCnt},
      ]);

      setHotelJobInfo([
        {title: 'TOT. - JOBS / SHIFTS', content: totalRestauJobCount},
        {title: 'TOT. - AVAILABLE', content: totalAvailableHotelJobCnt},
        {title: 'TOT. - AWARDED', content: totalAwardedHotelJobCnt},
        {title: 'TOT. - COMPLETED', content: totalCompletedHotelJobCnt},
        {title: 'TOT. - CANCELED', content: totalCancelledHotelJobCnt},
      ]);

      setSum1(totalRestauJobCount)
      setSum2(restauSum)
      setSum3(totalHotelJobCount);
      setSum4(hotelSum);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const restauTableDatas = [
    {
      title: 'JOBS / SHIFTS BY STATUS',
      header: [
        'Job Status',
        'Count',
      ],
      data: tableData1,
      final: ['Sum', sum1],
    },
    {
      title: 'JOBS / SHIFTS BY MONTH',
      header: [
        'Month',
        'Count',
      ],
      data: tableData3,
      final: ['Sum', sum2],
    }
  ];

  const hotelTableDatas = [
    {
      title: 'JOBS / SHIFTS BY STATUS',
      header: [
        'Job Status',
        'Count',
      ],
      data: tableData2,
      final: ['Sum', sum3],
    },
    {
      title: 'JOBS / SHIFTS BY MONTH',
      header: [
        'Month',
        'Count',
      ],
      data: tableData4,
      final: ['Sum', sum4],
    }
  ];

  return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        <AHeader navigation={navigation} currentPage={0} />
        <SubNavbar navigation={navigation} name={"AdminLogin"}/>
        <ScrollView style={{width: '100%', marginTop: height * 0.22}} showsVerticalScrollIndicator={false} >
          <View style={styles.topView}>
            <AnimatedHeader title="HOSPITALITY ADMIN DASHBOARD" />
            <View style={styles.bottomBar}/>
          </View>
          <View style={{ width: '80%', marginLeft: '10%', marginTop: 10 }}>
            <Text style={{ fontSize: RFValue(20), fontWeight: 'bold' }}>Restaurant</Text>
          </View>
          <View style={{paddingVertical: 40, backgroundColor: '#c6c5c5', marginTop: 20, width: '80%', marginLeft: '10%', borderRadius: 10}}>
            {
              restauJobInfo.map((item, index) => 
                <View key={index} style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text style={styles.titles}>{item.title}</Text>
                  <Text style={styles.content}>
                    {item.content}
                  </Text>
                </View>
              )
            }
          </View>
          {restauTableDatas.map((item, index)=> 
            <View key={index} style={{paddingVertical: 40, backgroundColor: '#c6c5c5', marginTop: 20, width: '80%', marginLeft: '10%', borderRadius: 10, display: 'flex', alignItems:'center'}}>
              <View style={styles.profileTitleBg}>
                <Text style={styles.profileTitle}>{item.title}</Text>
              </View>
              <Text style={styles.Italic}>"Click On Any Value To View Details"</Text>
              <View>
                <Table borderStyle={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.08)', width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Row
                    data={item.header}
                    style={styles.head}
                    widthArr={[200,80]}
                    textStyle={styles.tableText}
                  />
                  <Rows
                    data={item.data}
                    widthArr={[200,80]}
                    style = {{backgroundColor: '#E2E2E2', color: 'black'}}
                    textStyle = {styles.tableText}
                  />
                  <Row
                    data={item.final}
                    style={styles.head}
                    widthArr={[200,80]}
                    textStyle={styles.tableText}
                  />
                </Table>
              </View>
            </View>
          )}
          <View style = {{height: 50}}/>
          <View style={{ width: '80%', marginLeft: '10%', marginTop: 10 }}>
            <Text style={{ fontSize: RFValue(20), fontWeight: 'bold' }}>Hotel</Text>
          </View>
          <View style={{paddingVertical: 40, backgroundColor: '#c6c5c5', marginTop: 20, width: '80%', marginLeft: '10%', borderRadius: 10}}>
            {
              hotelJobInfo.map((item, index) => 
                <View key={index} style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text style={styles.titles}>{item.title}</Text>
                  <Text style={styles.content}>
                    {item.content}
                  </Text>
                </View>
              )
            }
          </View>
          {hotelTableDatas.map((item, index)=> 
            <View key={index} style={{paddingVertical: 40, backgroundColor: '#c6c5c5', marginTop: 20, width: '80%', marginLeft: '10%', borderRadius: 10, display: 'flex', alignItems:'center'}}>
              <View style={styles.profileTitleBg}>
                <Text style={styles.profileTitle}>{item.title}</Text>
              </View>
              <Text style={styles.Italic}>"Click On Any Value To View Details"</Text>
              <View>
                <Table borderStyle={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.08)', width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Row
                    data={item.header}
                    style={styles.head}
                    widthArr={[200,80]}
                    textStyle={styles.tableText}
                  />
                  <Rows
                    data={item.data}
                    widthArr={[200,80]}
                    style = {{backgroundColor: '#E2E2E2', color: 'black'}}
                    textStyle = {styles.tableText}
                  />
                  <Row
                    data={item.final}
                    style={styles.head}
                    widthArr={[200,80]}
                    textStyle={styles.tableText}
                  />
                </Table>
              </View>
            </View>
          )}
          <View style = {{height: 100}}/>
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
    marginTop: 10,
    marginLeft: '10%',
    width: '80%',
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'center'
  },
  backTitle: {
    backgroundColor: 'black',
    width: '90%',
    height: '55',
    marginLeft: '5%',
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
  titles: {
    fontWeight: 'bold',
    fontSize: RFValue(14),
    lineHeight: 30,
    textAlign: 'center',
    color: 'white',
    padding: 5,
    width: '70%',
    backgroundColor: "#2243f3", 
    borderRadius: 10
  },
  content: {
    fontSize: RFValue(16),
    lineHeight: 40,
  },
  profileTitleBg: {
    backgroundColor: '#BC222F',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    // marginLeft: '10%',
    marginBottom: 20
  },
  profileTitle: {
    fontSize: RFValue(12),
    fontWeight: 'bold',
    color: 'white',
  },
  Italic: {
    fontStyle: 'italic',
    color: '#0000ff',
    fontSize: RFValue(12),
    marginBottom: 20, 
  },
  head: {
    backgroundColor: '#7be6ff4f',
    // width: 2000,
    height: 40,
  },
  tableText: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    width: '100%',
    color: 'black',
    textAlign: 'center'
  }
});
  