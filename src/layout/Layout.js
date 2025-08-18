/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import Dashboard from './Dashboard';
import MHeader from '../components/Mheader';
import MFooter from '../components/Mfooter';
import ClientSignIn from './client/ClientSignin';
import ClientSignUp from './client/ClientSignup';
import MyHome from './client/MyHome';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MyProfile from './client/MyProfile';
import ShiftListing from './client/ShiftListing';
import Shift from './client/Shift';
import Reporting from './client/Reporting';
import EditProfile from './client/EditProfile';
import AccountSettings from './client/AccountSettings';
import AdminLogin from './admin/AdminLogin';
import FacilityLogin from './facilities/FacilityLogin';
import FacilitySignUp from './facilities/FacilitySignUp';
import FacilityForgotPwd from './facilities/FacilityForgotPwd';
import FacilityPwdPending from './facilities/FacilityPwdPending';
import ClientForgotPwd from './client/ClientForgotPwd';
import ClientPending from './client/ClientPending';
import ClientFinishSignup from './client/ClientFinishSignUp';
import FacilityFinishSignup from './facilities/FacilityFinishSignUp';
import FacilityPermission from './facilities/FacilityPermission';
import FacilityProfile from './facilities/FacilityProfile';
import FacilityEditProfile from './facilities/FacilityEditProfile';
import AddJobShift from './facilities/AddJobShift';
import CompanyShift from './facilities/CompanyShift';
import AdminHome from './admin/AdminHome';
import AdminDashboard from './admin/AdminDashboard';
import AllJobShiftListing from './admin/AllJobShiftListing.js';
import AdminJobShift from './admin/AdminJobShift.js';
import AdminCompany from './admin/AdminCompany.js';
import AdminEditProfile from './admin/AdminEditProfile.js';
import AllCaregivers from './admin/AllCaregivers.js';
import AdminAllUser from './admin/AdminAllUser.js';
import AdminFacilities from './admin/AdminFacilities.js';
import CaregiverTimeSheet from './admin/CaregiverTimeSheet.js';
import Invoice from './facilities/invoice.js';
import ClientPassVerify from './client/ClientPassVerify.js';
import ClientResetPassword from './client/ClientResetPass.js';
import FacilityPassVerify from './facilities/FacilityPassVerify.js';
import FacilityResetPassword from './facilities/FacilityResetPass.js';
import AdminPassVerify from './admin/AdminPassVerify.js';
import AdminPending from './admin/AdminPending.js';
import AdminForgotPwd from './admin/AdminForgotPwd.js';
import AdminResetPassword from './admin/AdminResetPass.js';
import ClientPhone from './client/ClientPhone.js';
import ClientPhoneVerify from './client/ClientPhoneVerify.js';
import ClientProfile from './facilities/ClientProfile.js';
import ClientPermission from './client/ClientPermission.js';
import FileViewer from './FileViewer.js';
import AddNewFacility from './admin/AddNewFacility.js';
import CaregiverProfile from './admin/CaregiverProfile.js';
import UserFileViewer from './UserFileViewer.js';
import UploadTimesheet from './client/UploadTimesheet.js';
import VerifyCation from './admin/Verifycation.js';
import TimesheetForm from './client/TimesheetForm.js';
import AdminFileViewer from './AdminFileViewer.js';
import BookShiftsNow from './client/BookShiftsNow.js';
import Mainboard from './Mainboard.js';
import HospitalityHomePage from './hospitality/hospitality_homepage.js'
import HospitalityRestaurantDashboard from './hospitality/restaurant/hospitality_restaurant_dashboard.js'
import HospitalityHotelDashboard from './hospitality/hotel/hospitality_hotel_dashboard.js'
import HospitalityRestaurantHireLogin from './hospitality/restaurant/hire/hospitality_restaurant_hire_login.js';
import HospitalityRestaurantHireSignUp from './hospitality/restaurant/hire/hospitality_restaurant_hire_signup.js';
import HospitalityRestaurantWorkLogin from './hospitality/restaurant/work/hospitality_restaurant_work_login.js';
import HospitalityRestaurantWorkSignup from './hospitality/restaurant/work/hospitality_restaurant_work_signup.js';
import HospitalityRestaurantWorkForgot from './hospitality/restaurant/work/hospitality_restaurant_work_forgot.js';
import HospitalityRestaurantWorkHome from './hospitality/restaurant/work/hospitality_restaurant_work_home.js';
import HospitalityRestaurantWorkEditProfile from './hospitality/restaurant/work/hospitality_restaurant_work_editprofile.js';
import HospitalityRestaurantWorkTimesheetForm from './hospitality/restaurant/work/hospitality_restaurant_work_TimesheetForm.js';
import HospitalityRestaurantWorkMyShift from './hospitality/restaurant/work/hospitality_restaurant_work_myshifts.js';
import HospitalityRestaurantWorkUploadTimesheet from './hospitality/restaurant/work/hospitality_restaurant_work_uploadtimesheet.js';
import HospitalityRestaurantWorkReporting from './hospitality/restaurant/work/hospitality_restaurant_work_reporting.js';
import HospitalityRestaurantWorkBookShift from './hospitality/restaurant/work/hospitality_restaurant_work_bookshift.js';
import HospitalityRestaurantWorkApplyShift from './hospitality/restaurant/work/hospitality_restaurant_work_applyshift.js';
import HospitalityRestaurantWorkAssignedShift from './hospitality/restaurant/work/hospitality_restaurant_work_assignedShift.js';

import HospitalityRestaurantHireHome from './hospitality/restaurant/hire/hospitality_restaurant_hire_home.js';
import HospitalityRestaurantHirePostShift from './hospitality/restaurant/hire/hospitality_restaurant_hire_postshift.js';
import HospitalityRestaurantHireSchedulerScreen from './hospitality/restaurant/hire/hospitality_restaurant_hire_schedulerCalender.js';
import HospitalityRestaurantHireEditShift from './hospitality/restaurant/hire/hospitality_restaurant_hire_editshift.js';
import HospitalityRestaurantHireEditProfile from './hospitality/restaurant/hire/hospitality_restaurant_hire_editprofile.js';
import HospitalityRestaurantHireForgot from './hospitality/restaurant/hire/hospitality_restaurant_hire_forgot.js';
import HospitalityRestaurantHireTerms from './hospitality/restaurant/hire/hospitality_restaurant_hire_terms.js';
import HospitalityRestaurantHireTimescheduling from './hospitality/restaurant/hire/hospitality_restaurant_hire_teamScheduling.js';
import HospitalityRestaurantHireTimeSchduler from './hospitality/restaurant/hire/hospitality_restaurant_hire_teamScheduler.js';

import StaffDetail from './hospitality/restaurant/hire/component/StaffDetail.js';
import StaffEdit from './hospitality/restaurant/hire/component/StaffEdit.js';
import StaffTab from './hospitality/restaurant/hire/component/TeamStaffTap.js';
import ShiftTab from './hospitality/restaurant/hire/component/shiftTap.js';
import ShiftDetailScreen from './hospitality/restaurant/hire/component/ShiftDetail.js';

import HospitalityHotelWorkSignIn from './hospitality/hotel/work/hospitality_hotel_work_signin.js';
import HospitalityHotelWorkSignUp from './hospitality/hotel/work/hospitality_hotel_work_signup.js';
import HospitalityHotelWorkHome from './hospitality/hotel/work/hospitality_hotel_work_home.js';
import HospitalityHotelWorkProfile from './hospitality/hotel/work/hospitality_hotel_work_profile.js';
import HospitalityHotelWorkMyShift from './hospitality/hotel/work/hospitality_hotel_work_myshift.js';
import HospitalityHotelWorkReporting from './hospitality/hotel/work/hospitality_hotel_work_reporting.js';
import HospitalityHotelWorkBookShift from './hospitality/hotel/work/hospitality_hotel_work_bookshift.js';
import HospitalityHotelWorkApplyShift from './hospitality/hotel/work/hospitality_hotel_work_applyshift.js';
import HospitalityHotelWorkUploadTimesheet from './hospitality/hotel/work/hospitality_hotel_work_uploadtimesheet.js';
import HospitalityHotelWorkTerms from './hospitality/hotel/work/hospitality_hotel_work_terms.js';
import HospitalityHotelWorkAssignedShift from './hospitality/hotel/work/hospitality_hotel_work_assignedShift.js';

import HospitalityHotelHireSignIn from './hospitality/hotel/hire/hospitality_hotel_hire_signin.js';
import HospitalityHotelHireSignUp from './hospitality/hotel/hire/hospitality_hotel_hire_signup.js';
import HospitalityHotelHireHome from './hospitality/hotel/hire/hospitality_hotel_hire_home.js';
import HospitalityHotelHireProfile from './hospitality/hotel/hire/hospitality_hotel_hire_profile.js';
import HospitalityHotelHireEditShift from './hospitality/hotel/hire/hospitality_hotel_hire_ediftshift.js';
import HospitalityHotelHirePostShift from './hospitality/hotel/hire/hospitality_hotel_hire_postshift.js';
import HospitalityHotelHireTimescheduling from './hospitality/hotel/hire/hospitality_hotel_hire_teamscheduling.js';
import HospitalityRestaurantWorkPemission from './hospitality/restaurant/work/hospitality_restaurant_work_permission.js';
import HospitalityHotelHireTerms from './hospitality/hotel/hire/hospitality_hotel_hire_terms.js';
import HospitalityRestaurantWorkPhone from './hospitality/restaurant/work/hospitality_restaurant_work_phone.js';
import HospitalityRestaurantWorkPhoneVerify from './hospitality/restaurant/work/hospitality_restaurant_work_phoneverify.js';
import HospitalityHotelWorkPhone from './hospitality/hotel/work/hospitality_hotel_work_phone.js';
import HospitalityHotelWorkPhoneVerify from './hospitality/hotel/work/hospitality_hotel_work_phoneverify.js';

import HospitalityAdminDashboard from './admin/hospitality/HospitalityAdminDashboard.js';
import HospitalityAllJobShiftList from './admin/hospitality/HospitalityAllJobShiftList.js';
import HospitalityAdminAddHotelJob from './admin/hospitality/HospitalityAdminAddHotelJob.js';
import HospitalityAdminAddRestaurantJob from './admin/hospitality/HospitalityAdminAddRestaurantJob.js';
import HospitalityAllContactors from './admin/hospitality/HospitalityAllContactors.js';
import HospitalityAdminAllUsers from './admin/hospitality/HospitalityAdminAllUsers.js';
import HospitalityAdminAllHotelRestaurant from './admin/hospitality/HospitalityAdminAllHotelRestaurant.js';
import HospitalityAdminCaregiverTimeSheet from './admin/hospitality/HospitalityAdminCaregiverTimeSheet.js';
import HospitalityAddNewHotel from './admin/hospitality/HospitalityAddNewHotel.js';
import HospitalityVerifyCation from './admin/hospitality/HospitalityVerifycation.js';
import HospitalityAddNewRestaurant from './admin/hospitality/HospitalityAddNewRestaurant.js';
import HospitalityCaregiverProfile from './admin/hospitality/HospitalityCaregiverProfile.js';
import HospitalityAdminTeamScheduler from './admin/hospitality/HospitalityAdminTeamScheduler.js';
import HospitalityHotelWorkTimesheetForm from './hospitality/hotel/work/hospitality_hotel_work_timesheetForm.js';
import AdminMessage from './admin/AdminMessage.js';

const Stack = createNativeStackNavigator();

function Layout() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <MHeader />,
        footer: () => <MFooter />,
      }}
    >
      {/* <Stack.Screen 
        name= 'Main'
        component = {Mainboard}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen 
        name= 'HospitalityHomePage'
        component = {HospitalityHomePage}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'Home'
        component = {Dashboard}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAdminTeamScheduler'
        component = {HospitalityAdminTeamScheduler}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHireTimeSchduler'
        component = {HospitalityRestaurantHireTimeSchduler}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAddNewHotel'
        component = {HospitalityAddNewHotel}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAdminCaregiverTimeSheet'
        component = {HospitalityAdminCaregiverTimeSheet}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="StaffTab"
        component={StaffTab}  // import this at the top!
        options={{ headerShown: false }}
      />

      <Stack.Screen 
        name= 'StaffDetail'
        component = {StaffDetail}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'StaffEdit'
        component = {StaffEdit}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'ShiftTab'
        component = {ShiftTab}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'ShiftDetailScreen'
        component = {ShiftDetailScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkAssignedShift'
        component = {HospitalityRestaurantWorkAssignedShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkAssignedShift'
        component = {HospitalityHotelWorkAssignedShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHireSchedulerScreen'
        component = {HospitalityRestaurantHireSchedulerScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAdminAllHotelRestaurant'
        component = {HospitalityAdminAllHotelRestaurant}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHireTimescheduling'
        component = {HospitalityRestaurantHireTimescheduling}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelHireTimescheduling'
        component = {HospitalityHotelHireTimescheduling}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAdminAllUsers'
        component = {HospitalityAdminAllUsers}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityCaregiverProfile'
        component = {HospitalityCaregiverProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAddNewRestaurant'
        component = {HospitalityAddNewRestaurant}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAdminAddRestaurantJob'
        component = {HospitalityAdminAddRestaurantJob}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAdminAddHotelJob'
        component = {HospitalityAdminAddHotelJob}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAllContactors'
        component = {HospitalityAllContactors}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAllJobShiftList'
        component = {HospitalityAllJobShiftList}
        options={{headerShown: false}}
      />
      
      <Stack.Screen 
        name= 'HospitalityHotelHireEditShift'
        component = {HospitalityHotelHireEditShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityAdminDashboard'
        component = {HospitalityAdminDashboard}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelHireTerms'
        component = {HospitalityHotelHireTerms}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkTerms'
        component = {HospitalityHotelWorkTerms}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHireTerms'
        component = {HospitalityRestaurantHireTerms}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelHirePostShift'
        component = {HospitalityHotelHirePostShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelHireProfile'
        component = {HospitalityHotelHireProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityVerifycation'
        component = {HospitalityVerifyCation}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelHireHome'
        component = {HospitalityHotelHireHome}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelHireSignUp'
        component = {HospitalityHotelHireSignUp}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelHireSignIn'
        component = {HospitalityHotelHireSignIn}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkUploadTimesheet'
        component = {HospitalityHotelWorkUploadTimesheet}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkApplyShift'
        component = {HospitalityHotelWorkApplyShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkBookShift'
        component = {HospitalityHotelWorkBookShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkReporting'
        component = {HospitalityHotelWorkReporting}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkProfile'
        component = {HospitalityHotelWorkProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkMyShift'
        component = {HospitalityHotelWorkMyShift}
        options={{headerShown: false}}
      />
      
      <Stack.Screen 
        name= 'HospitalityHotelWorkPhone'
        component = {HospitalityHotelWorkPhone}
        options={{headerShown: false}}
      />
      
      <Stack.Screen 
        name= 'HospitalityHotelWorkPhoneVerify'
        component = {HospitalityHotelWorkPhoneVerify}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkHome'
        component = {HospitalityHotelWorkHome}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkSignUp'
        component = {HospitalityHotelWorkSignUp}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkSignIn'
        component = {HospitalityHotelWorkSignIn}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkPemission'
        component = {HospitalityRestaurantWorkPemission}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkApplyShift'
        component = {HospitalityRestaurantWorkApplyShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkBookShift'
        component = {HospitalityRestaurantWorkBookShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkPhone'
        component = {HospitalityRestaurantWorkPhone}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkPhoneVerify'
        component = {HospitalityRestaurantWorkPhoneVerify}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkReporting'
        component = {HospitalityRestaurantWorkReporting}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkUploadTimesheet'
        component = {HospitalityRestaurantWorkUploadTimesheet}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkMyShift'
        component = {HospitalityRestaurantWorkMyShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantDashboard'
        component = {HospitalityRestaurantDashboard}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHireLogin'
        component = {HospitalityRestaurantHireLogin}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHireHome'
        component = {HospitalityRestaurantHireHome}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHirePostShift'
        component = {HospitalityRestaurantHirePostShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHireEditShift'
        component = {HospitalityRestaurantHireEditShift}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHireEditProfile'
        component = {HospitalityRestaurantHireEditProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHireForgot'
        component = {HospitalityRestaurantHireForgot}
        options={{headerShown: false}}
      />
      
      <Stack.Screen 
        name= 'HospitalityRestaurantWorkLogin'
        component = {HospitalityRestaurantWorkLogin}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkSignup'
        component = {HospitalityRestaurantWorkSignup}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkForgot'
        component = {HospitalityRestaurantWorkForgot}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkHome'
        component = {HospitalityRestaurantWorkHome}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkEditProfile'
        component = {HospitalityRestaurantWorkEditProfile}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantWorkTimesheetForm'
        component = {HospitalityRestaurantWorkTimesheetForm}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelWorkTimesheetForm'
        component = {HospitalityHotelWorkTimesheetForm}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityRestaurantHireSignUp'
        component = {HospitalityRestaurantHireSignUp}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'HospitalityHotelDashboard'
        component = {HospitalityHotelDashboard}
        options={{headerShown: false}}
      />

      <Stack.Screen 
        name= 'ClientSignIn'
        component = {ClientSignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientSignUp'
        component = {ClientSignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'UploadTimesheet'
        component = {UploadTimesheet}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'MyHome'
        component = {MyHome}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'UserFileViewer'
        component = {UserFileViewer}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'TimesheetForm'
        component = {TimesheetForm}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'Verifycation'
        component = {VerifyCation}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'MyProfile'
        component = {MyProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'CaregiverProfile'
        component = {CaregiverProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AddNewFacility'
        component = {AddNewFacility}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ShiftListing'
        component = {ShiftListing}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'Shift'
        component = {Shift}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'Reporting'
        component = {Reporting}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'EditProfile'
        component = {EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FileViewer'
        component = {FileViewer}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AccountSettings'
        component = {AccountSettings}        
        initialParams={{ userRole: 'clinical' }}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminLogin'
        component = {AdminLogin}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityLogin'
        component = {FacilityLogin}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilitySignUp'
        component = {FacilitySignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityForgotPwd'
        component = {FacilityForgotPwd}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityPwdPending'
        component = {FacilityPwdPending}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientPending'
        component = {ClientPending}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientForgotPwd'
        component = {ClientForgotPwd}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientFinishSignup'
        component = {ClientFinishSignup}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityFinishSignup'
        component = {FacilityFinishSignup}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityPermission'
        component = {FacilityPermission}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientPermission'
        component = {ClientPermission}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityProfile'
        component = {FacilityProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityEditProfile'
        component = {FacilityEditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AddJobShift'
        component = {AddJobShift}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'CompanyShift'
        component = {CompanyShift}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientProfile'
        component = {ClientProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminHome'
        component = {AdminHome}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminDashboard'
        component = {AdminDashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AllJobShiftListing'
        component = {AllJobShiftListing}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminJobShift'
        component = {AdminJobShift}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminCompany'
        component = {AdminCompany}
        options={{headerShown: false}}
      />
      <Stack.Screen 
d        name= 'AdminMessage'
        component = {AdminMessage}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminEditProfile'
        component = {AdminEditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AllCaregivers'
        component = {AllCaregivers}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminAllUser'
        component = {AdminAllUser}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminFacilities'
        component = {AdminFacilities}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'BookShiftsNow'
        component = {BookShiftsNow}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'CaregiverTimeSheet'
        component = {CaregiverTimeSheet}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminFileViewer'
        component = {AdminFileViewer}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'Invoice'
        component = {Invoice}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientPassVerify'
        component = {ClientPassVerify}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientResetPassword'
        component = {ClientResetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityPassVerify'
        component = {FacilityPassVerify}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityResetPassword'
        component = {FacilityResetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminPassVerify'
        component = {AdminPassVerify}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminResetPassword'
        component = {AdminResetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminPending'
        component = {AdminPending}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminForgotPwd'
        component = {AdminForgotPwd}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientPhone'
        component = {ClientPhone}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientPhoneVerify'
        component = {ClientPhoneVerify}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default Layout;
