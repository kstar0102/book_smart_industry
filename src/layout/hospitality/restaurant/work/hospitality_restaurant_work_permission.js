import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, Alert, Dimensions, Button } from 'react-native';
import MFooter from '../../../../components/Mfooter';
import MHeader from '../../../../components/Mheader';
import SubNavbar from '../../../../components/SubNavbar';
import { useAtom } from 'jotai';
import Hyperlink from 'react-native-hyperlink';
import { Dropdown } from 'react-native-element-dropdown';
import SignatureCapture from 'react-native-signature-capture';
import images from '../../../../assets/images';
import HButton from '../../../../components/Hbutton';
import { AcknowledgeTerm } from '../../../../context/RestaurantWorkProvider';
import { Update } from '../../../../utils/useApi';
import { RFValue } from 'react-native-responsive-fontsize';
const { width, height } = Dimensions.get('window');

export default function HospitalityRestaurantWorkPemission ({ navigation }) {
  const [acknowledgement, setAcknowledgement] = useAtom(AcknowledgeTerm);
  const items = [
    {label: 'Yes', value: 1},
    {label: 'No', value: 2},
  ];
  const [checked, setChecked] = React.useState('first');
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [credentials, setCredentials] = useState({
    signature: '',
    AcknowledgeTerm: acknowledgement,
  });
  let signatureRef = useRef(null);

  const onSaveEvent = (result) => {
    setCredentials(prevCredentials => ({
      ...prevCredentials, 
      signature: result.encoded
    }));
    setIsSigned(true);
  };

  const handlePreSubmit = () => {
    if (value != 1) {
      return;
    }
    if (!isSigned) {
      Alert.alert('Please sign and click Save button');
      return;
    }
    handleUploadSubmit();
  };

  const handleReset = () => {
    signatureRef.current.resetImage();
    setIsSigned(false);
  }

  const handleUploadSubmit = async () => {
    if (value != 1) {
      return;
    }
    if (!isSigned) {
      Alert.alert('Please sign and click save button');
      return;
    }
    try {
      const response = await Update(credentials, 'restau_user');
      if (!response?.error) {
        Alert.alert(
          'Success!',
          "You're in",
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK pressed')
              },
            },
          ],
          { cancelable: false }
        );
        setAcknowledgement(response.user.AcknowledgeTerm);
        navigation.navigate("HospitalityRestaurantWorkHome");
      } else {
        Alert.alert(
          'Failed!',
          "Network Error",
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK pressed')
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      Alert.alert(
        'Failed!',
        "Network Error",
        [
          {
            text: 'OK',
            onPress: () => {
              console.log('OK pressed')
            },
          },
        ],
        { cancelable: false }
      );
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <MHeader navigation={navigation} back={true} />
      <SubNavbar navigation={navigation} name={"HospitalityRestaurantWorkLogin"} />
      <ScrollView style={{width: '100%', marginTop: height * 0.22}} showsVerticalScrollIndicator={false}>
        <Hyperlink linkDefault={true}>
          <View style={styles.permission}>
            <View style={styles.titleBar}>
              <Text style={styles.title}>BOOKSMART™ TERMS OF USE</Text>
              <Text style={styles.text}>These Terms of Use (“Terms” or “Agreement”) established by BookSmart 
                Technologies LLC, a New York Limited Liability Company, (hereinafter BOOKSMART™) are set forth 
                below and agreed to by You, assignees, and third party beneficiaries (collectively “You”), 
                and govern Your access to use of BOOKSMART’s provisions of services (described below), 
                effective and agreed to by You as of the date You click “Accept,” first access or use BOOKSMART™, 
                or otherwise indicate Your assent to the Terms (“Effective Date”). 
                By clicking “Accept” or otherwise using BOOKSMART™, 
                You agree to bound to the Terms set forth below.</Text>
            </View>

            <View style={styles.titleBar}>
              <Text style={styles.subTitle}>1. Definitions.</Text>
              <Text style={styles.text}><Text style={{fontWeight: 'bold'}}>(a) Independent Contractor (I/C) Services. </Text>For purposes of this Agreement, I/Cs are independent third-party providers who are willing to provide services on a short-term basis with Clients who are independent third-party businesses that seek to engage I/Cs to provide Services. After Client posts a Service Request, I/C may view the posting and choose to indicate their availability to provide the services requested by the Client for the Service Request. The Client may then review responses from I/Cs indicating availability and determine which I/C it wishes to engage based on information supplied by the I/Cs to Clients through the Service.</Text>
              <Text style={[styles.text, {marginTop: 0}]}><Text style={{fontWeight: 'bold'}}>(b) You, Your, or Users. </Text>As used herein, “You,” “Your,” or “Users” alternatively refers to Independent Contractors (I/Cs) using BOOKSMART™.</Text>
              <Text style={[styles.text, {marginTop: 0}]}><Text style={{fontWeight: 'bold'}}>(c) Service Requests. </Text>Clients may post requests for services (“Service Requests” or “Request for Services”) for one or more I/Cs. The Service Request will contain the nature and type of I/C Services required, including a description of the services requested and where and when the Services may be performed.</Text>
              <Text style={[styles.text, {marginTop: 0}]}><Text style={{fontWeight: 'bold'}}>(d) Completed Service. </Text>Clients, through BOOKSMART™, can review the responses to Service Requests (“Service Applications”) for posted Service Requests. I/Cs may decide, at their sole discretion, which Service Applications, if any, they wish to accept for any Service Request. Each Service Application that an I/C has accepted and for which the I/C or I/Cs have fully performed the applicable Services to the satisfaction of the Client is hereinafter referred to as a “Completed Service or Shift.”</Text>
            </View>

            <View style={styles.titleBar}>
              <Text style={styles.subTitle}>2. No Control.</Text>
              <Text style={styles.text}><Text style={{fontWeight: 'bold'}}>(a) Use of This Service. </Text>I/Cs retain total and absolute discretion as to when they choose to use BOOKSMART™, submit Service Applications, or otherwise respond to Service Requests. There are no set times or days during which I/Cs are required to use BOOKSMART™ or provide services of any kind to any entity. All Service Requests by Clients are posted through BOOKSMART™ by the Clients, not BOOKSMART™.</Text>
              <Text style={[styles.text, {marginTop: 0}]}><Text style={{fontWeight: 'bold'}}>(b) Providing Services. </Text>Regarding I/C, BOOKSMART™ will never direct or control Your interaction(s) with any Clients or Facilities; take any active role in Your provision of Requested Services to any Clients or Facilities; direct Your acts or omissions in connection with any Clients or Facilities; direct You to wear BOOKSMART™ branded clothing or identification badges in connection with performing Requested Services; direct You to report to a Client or Facility at a given time, for a given shift, or for a set period of time. BOOKSMART™ simply makes Service Requests visible to You, and You retain total and complete control as to when, if ever, to accept a shift or otherwise use BOOKSMART™. You and BOOKSMART™ acknowledge and agree that You retain total and complete autonomy to provide other services or otherwise engage in any other business activities, including using software similar to the goods or services provided by competitors of BOOKSMART™. You and BOOKSMART™ further acknowledge and agree You may provide services to Users without use of BOOKSMART™ and therefore agree that such services are outside the scope of this Agreement.</Text>
              <Text style={[styles.text, {marginTop: 0}]}><Text style={{fontWeight: 'bold'}}>(c) Service Requests Not Guaranteed. </Text>BOOKSMART™ does not guarantee that any Clients will post Service Requests or that any Client will engage I/Cs to perform any work for any Facility. BOOKSMART™ does not guarantee that a Service Request will not be canceled by the Client.</Text>
              <Text style={[styles.text, {marginTop: 0}]}><Text style={{fontWeight: 'bold'}}>(d) Cancellation Policy. </Text>If You cancel a shift, You will not be able to apply to any shift that overlaps with the shift You canceled.</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginHorizontal: 10, marginTop: 10 }} />
                <Text style={{ textAlign: 'left', fontSize: RFValue(14), fontWeight: 'normal', color: 'black', }}>If you cancel a shift within 12 hours, You will be bumped to next week’s pay but expected to work Your shifts that are already confirmed.</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginHorizontal: 10, marginTop: 20 }} />
                <Text style={styles.sub1text}>If You cancel a second shift with a start time that is less than 12 hours away in any given 30-day period, You will be removed from the app.</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginHorizontal: 10, marginTop: 20 }} />
                <Text style={styles.sub1text}>If You No Call/No Show a shift You will be suspended for one week but expected to work shifts that are already confirmed. You will also lose SmartPay for that week.</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginHorizontal: 10, marginTop: 20 }} />
                <Text style={styles.sub1text}>If You No Call/No Show a second time, You will be automatically removed from the BOOKSMART™ app.</Text>
              </View>
              <Text style={{ textAlign: 'left', fontSize: RFValue(14), fontWeight: 'normal', color: 'black', marginTop: 20 }}>*Note: BOOKSMART™ is committed to helping our I/Cs work through any challenges they may face with regards to canceling a shift. If You feel Your situation was unavoidable and You can provide written documentation such as a legible doctor’s note or police report to support this cancellation, we will consider lifting Your suspension on a case-by-case basis.</Text>
              
              <Text style={[styles.text, {marginTop: 10}]}><Text style={{fontWeight: 'bold'}}>(e) No Authorization. </Text>Users of BOOKSMART™ Services acknowledge and agree that they are not the agent or representative of BOOKSMART™ and are not authorized to make any representation, contract or commitment on behalf of BOOKSMART™.</Text>
              <Text style={[styles.text, {marginTop: 0}]}><Text style={{fontWeight: 'bold'}}>(f) Qualifications. </Text>I/Cs represent that they are able (as applicable) and have the experience, qualifications, and ability to perform each Request each I/C accepts.</Text>
              <Text style={[styles.text, {marginTop: 0}]}><Text style={{fontWeight: 'bold'}}>(g) No Employment Relationship. </Text>
                In addition to the Terms set forth above, You expressly
                acknowledge and agree that there is no employment, part-time employment, consulting,
                partnership, or joint venture relationship between You and BOOKSMART™. You further
                understand and acknowledge that BOOKSMART™ is not an employment service or agency
                and does not secure employment for anyone. You acknowledge and agree that You are not
                entitled to any of the benefits that BOOKSMART™ makes available to its employees and/or
                officers and/or directors and/or agents, and users hereby waive and disclaim any rights to
                receive any such benefits. Users also acknowledge and agree that BOOKSMART™ does not
                pay any unemployment compensation taxes with respect to any provision of any work for
                any Client. Moreover, You acknowledge and agree that You are not entitled to any
                unemployment compensation benefits chargeable to or claimed from BOOKSMART™
                during any period of time that You may claim to be partially or fully unemployed. You further
                acknowledge and agree that You are not entitled to receive Paid Time Off (PTO), Overtime
                Compensation, Group Health, Short-term Disability Insurance, or Retirement Benefits
                provided through BOOKSMART™.
              </Text>
              <Text style={[styles.text, {marginTop: 0}]}><Text style={{fontWeight: 'bold'}}>(h) Consent to Text Messages, Notifications, Phone Calls, and Emails. </Text>
                You consent to
                receiving text messages, notifications, phone calls, and emails from BOOKSMART™ or our
                Clients at the phone number or email address provided in Your registration information for
                the purpose of communicating information regarding Service Requests. You are solely
                responsible for any costs You incur when receiving text messages, including any carrier
                charges that apply for receiving such text messages.
              </Text>
            </View>

            <View style={styles.titleBar}>
              <Text style={styles.subTitle}>3. Registration Information.</Text>
              <Text style={styles.text}><Text style={{fontWeight: 'bold'}}>(a) Maintaining Accuracy. </Text>
                You represent and warrant that: any license numbers (“Licenses”) You provide BOOKSMART™ is Your Registration Information or otherwise are valid; such License(s) will remain in full force for the duration of time in which You submit Service Applications for Service Requests requiring any such License(s); and You will notify BOOKSMART™ and all Clients that You have agreed to perform future Services for if You: (i) become suspended or barred from working in any jurisdiction, (ii) lose any of Your License(s), (iii) are facing disciplinary actions, including suspension, or (iv) make any changes to Your Registration Information.
              </Text>
              <Text style={[styles.text, {marginTop: 0}]}>
                <Text style={{fontWeight: 'bold'}}>(b) Verification. </Text>
                  BOOKSMART™ will make reasonable efforts to independently verify Your
                  Registration Information and any other information You submit to BOOKSMART™ for the
                  purpose of verifying the accuracy of such information (“Verification Purposes”). You hereby
                  authorize BOOKSMART™, either directly or indirectly through third-party vendors or service
                  providers, to verify such information, via means that may include, without limitation,
                  conducting checks related to Your registration and/or license, checks related to Your
                  background, and checks with available public records for other lawful verification
                  purposes. You hereby consent to any collection/use, including disclosure in order to
                  complete such verification and agree to provide any documentation or information at the
                  request of BOOKSMART™ to facilitate such processes. For information about the use of
                  Your personal information, please see the BOOKSMART™ Privacy Policy available
                  at: <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>https://www.whybookdumb.com/privacy-policy</Text>
                </Text>
              <Text style={[styles.text, {marginTop: 0}]}>
                <Text style={{fontWeight: 'bold'}}>(c) Background Information. </Text>
                  Your ability to provide Requested Services is subject to
                  successfully passing a background check and drug screen (if required by client/facility and
                  as allowed or mandated by law), which will be conducted by a third party to provide
                  background checks/drug screens and will include identity verification, a global watch list
                  registry check, sex offender registry checks, and both national and county criminal records
                  checks, as permissible under applicable law. BOOKSMART™ or its third-party contractor
                  will provide You with appropriate notice and authorization forms regarding any background
                  checks. Additional background checks may be required periodically to maintain eligibility
                  to provide Requested Services.
                </Text>
            </View>

            <View style={styles.titleBar}>
              <Text style={styles.subTitle}>4. Payment and Insurance Terms.</Text>
                <Text style={styles.text}><Text style={{fontWeight: 'bold'}}>(a) Payment of Fees. </Text>
                  For each Completed Shift that You perform, You will receive payment
                  from BOOKSMART™ no later than the following Friday, and in some cases, within 24-hours
                  of Client’s approval of hours worked (SmartPay). To receive payment, You must provide
                  BOOKSMART™ with current bank account information. You understand and agree that the
                  BOOKSMART™ third-party payment processors and BOOKSMART™ may transfer payment to
                  the account identified by you. You, not BOOKSMART™, are solely responsible for the
                  accuracy of all bank account information, including the bank account number and bank
                  routing information necessary to complete such transfer. BOOKSMART™ disclaims all
                  liability related to errors in fund deposits due to inaccurate or incomplete bank account
                  information and reserves the right to withhold additional payments requested by You until
                  any error in fund deposits is corrected.
                </Text>
              <Text style={[styles.text, {marginTop: 0}]}><Text style={{fontWeight: 'bold'}}>(b) Taxes. </Text>
                You are solely responsible for all tax returns and payments required to be filed
                with or made to any federal, state, or local tax authority in connection with performance of
                Requested Services. Users of BOOKSMART™ are exclusively liable for complying with all
                applicable federal, state, and local laws, including social security laws governing selfemployed individuals. Furthermore, users are exclusively liable for complying with all laws
                related to payment of taxes, social security, disability, and other contributions based on
                fees paid to You by BOOKSMART™ in connection with a Completed Service or otherwise
                received by You through the Service. BOOKSMART™ will not withhold or make payments for
                taxes, social security, unemployment insurance or disability insurance contributions.
                BOOKSMART™ will not obtain workers’ compensation insurance (except as described
                below) on I/Cs behalf. Users hereby agree to indemnify and defend BOOKSMART™ against
                any and all such allegations or actions related to taxes or contributions, including
                penalties, interest, attorneys’ fees and expenses. BOOKSMART™ does not offer tax advice
                to any Users, including, without limitation, You.
              </Text>
              <Text style={[styles.text, {marginTop: 0}]}>
                <Text style={{fontWeight: 'bold'}}>(c) Fee Bonus. </Text>
                I/Cs will receive a 50% Fee Bonus for all hours worked in excess of 40 hours 
                <Text style={{fontWeight: 'bold'}}>at one facility</Text> in any given week. 
                <Text style={{fontWeight: 'bold'}}>
                  Time accumulated for the purpose of determining a Fee Bonus may not be split across multiple facilities.
                </Text>
              </Text>
              <Text style={[styles.text, { marginTop: 0}]}>
                <Text style={{fontWeight: 'bold'}}>(d) Holiday Bonus. </Text>
                  Subject to 4(e), below, I/Cs will receive a 50% pay rate increase for all
                  hours worked on the following days: New Years Day, Easter Sunday, Memorial Day,
                  Independence Day, Labor Day, Thanksgiving Day, and Christmas.
              </Text>
              <Text style={[styles.text, { marginTop: 0}]}>
                <Text style={{fontWeight: 'bold'}}>(e) Bonus Exclusivity. </Text>
                  Under no circumstances shall the Fee Bonus and Holiday Bonus be
                  cumulative for the same hours worked. In instances where hours may qualify for both, only
                  one bonus shall be applied.
              </Text>
              <Text style={[styles.text, { marginTop: 0}]}>
                <Text style={{fontWeight: 'bold'}}>(f) Insurance. </Text>
                  I/Cs using BOOKSMART™ are required to carry Workplace Safety Insurance
                  and Liability Insurance coverage in order to perform Services for any Client. BOOKSMART™
                  has Workplace Safety Insurance in place through accredited insurance carriers as well as
                  Independent Contractor Liability Insurance (Collectively “Insurance”) for You to enroll in
                  and take advantage of. Applicants must enroll themselves with this Insurance coverage
                  from the applicable BOOKSMART™ insurance carrier(s) prior to commencing any shifts.{' '}
                  <Text style={{fontWeight: 'bold'}}>
                    BOOKSMART™ may facilitate access to optional insurance programs for I/Cs, which
                    currently include Liability and Workplace Safety Insurance. By enrolling, You agree to
                    contribute $2/hour to cover the associated premiums, which BOOKSMART™ may
                    collect from Your payout.
                  </Text>
              </Text>
            </View> 

            <View style={styles.titleBar}>
              <Text style={[styles.text, {marginTop: 0}]}>
                <Text style={styles.subTitle}>5. Safety & Work-Related Injury Policy. </Text>
                  Safety is a top priority. Each I/C is expected to
                  obey general safety rules and exercise caution and common sense in all work activities.
                </Text>
              <Text style={[styles.text, {marginTop: 0}]}>By using the BOOKSMART™ platform, You agree to the following:</Text>

              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginHorizontal: 10, marginTop: 10 }} />
                <Text style={{ textAlign: 'left', fontSize: RFValue(14), fontWeight: 'normal', color: 'black', }}>
                  Familiarize Yourself with and follow all established departmental safety procedures;
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginHorizontal: 10, marginTop: 10 }} />
                <Text style={{ textAlign: 'left', fontSize: RFValue(14), fontWeight: 'normal', color: 'black', }}>
                  Familiarize Yourself with and follow all work site specific safety rules and policies;
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginHorizontal: 10, marginTop: 10 }} />
                <Text style={{ textAlign: 'left', fontSize: RFValue(14), fontWeight: 'normal', color: 'black', }}>
                  Use all site-specific safety equipment provided by any Client;
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginHorizontal: 10, marginTop: 10 }} />
                <Text style={{ textAlign: 'left', fontSize: RFValue(14), fontWeight: 'normal', color: 'black', }}>
                  Report to Your supervisor at the Client any work-related accident or injury to
                  themselves or others as soon as it occurs;
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginHorizontal: 10, marginTop: 10 }} />
                <Text style={{ textAlign: 'left', fontSize: RFValue(14), fontWeight: 'normal', color: 'black', }}>
                  If You need medical treatment, You will immediately notify the Client and
                  BOOKSMART™ and obtain any “back to work” paperwork from Your physician or
                  other medical provider prior to applying for additional shifts;
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginHorizontal: 10, marginTop: 10 }} />
                <Text style={{ textAlign: 'left', fontSize: RFValue(14), fontWeight: 'normal', color: 'black', }}>
                  In the event of a workplace accident or injury involving You, You agree to participate
                  in any required drug testing as permitted by law
                </Text>
              </View>
              <Text style={[styles.text, {marginTop: 20}]}>
                Failure to follow the above procedures may result in the suspension of Your ability to
                access the BookSmart platform.
              </Text>
              

              <Text style={[styles.text, {marginTop: 0}]}>
                <Text style={styles.subTitle}>6. Third-Party Beneficiaries. </Text>
                Users agree that the Terms of this Agreement shall apply only to You and are not for the benefit of any third-party beneficiaries.</Text>

              <Text style={[styles.text, {marginVertical: 0, padding: 0}]}><
                Text style={styles.subTitle}>7. Attorney’s Fees. </Text>
                In the event a court of competent jurisdiction determines that any User has materially breached the Terms under this Agreement, BOOKSMART™ shall be entitled to an award of any costs and reasonable attorney’s fees incurred by BOOKSMART™ because of such breach.</Text>

              <Text style={[styles.text, {marginVertical: 0, marginTop : 10}]}>
                <Text style={styles.subTitle}>8. Governing Law. </Text>
                The Terms under this Agreement be construed in accordance with and governed by the laws of the State of New York, without regard to conflicts of laws principles. You agree that the exclusive venue for resolving any dispute arising under this Agreement shall be in the state and federal courts located in the County Erie, State of New York, and You consent to the jurisdiction of the federal and state courts located in Erie County, New York. You hereby waive any objection to Erie County, New York as venue for the hearing of any dispute between You and BOOKSMART™ that is not compelled to arbitration for any reason, including but not limited to any objection based on convenience.</Text>

              <Text style={[styles.text, {marginVertical: 0, marginTop : 10}]}>
                <Text style={styles.subTitle}>9. Indemnification. </Text>
                BOOKSMART™ will have no liability and You will indemnify, defend and hold BOOKSMART™ harmless against any loss, damage, cost, and expense (including reasonable attorneys’ fees and expenses) arising from any action or claim resulting from: (i) Your Content/Data; (ii) Your violation of the TERMS under this Agreement, any law or regulation, or any rights (including Intellectual Property) of another party; (iii) Your access to or use of BOOKSMART™; and/or (iv) the classification of an independent contractor by BOOKSMART™ or by any Client.</Text>

              <Text style={[styles.text, {marginVertical: 0, marginTop : 10}]}>
                <Text style={styles.subTitle}>10. Disclaimer of Warranties. </Text>
                You are solely responsible for Your interactions and transactions with other Users. 
                You agree to look solely to such other Users for any claim, damage or liability associated with any communication or transaction via BOOKSMART™. 
                YOU EXPRESSLY WAIVE AND RELEASE BOOKSMART™ FROM ANY AND ALL legal responsibilities, claims, rights of action, causes of action, suits, debts, judgments, demands, DAMAGES AND LIABILITIES ARISING OUT OF ANY ACT OR OMISSION OF ANY OTHER USER OR THIRD PARTY, INCLUDING DAMAGES RELATING TO MONETARY CLAIMS, PERSONAL INJURY OR DESTRUCTION OF PROPERTY, mental anguish, interest, costs, attorneys’ fees, and expenses. YOUR SOLE REMEDIES WITH RESPECT THERETO SHALL BE BETWEEN YOU AND THE APPLICABLE USER OR OTHER THIRD-PARTY. BOOKSMART™ RESERVES THE RIGHT, BUT HAS NO OBLIGATION, TO MONITOR DISPUTES BETWEEN USERS. BOOKSMART™ IS A MARKETPLACE SERVICE FOR USERS TO CONNECT ONLINE. EACH USER IS SOLELY RESPONSIBLE FOR INTERACTING WITH AND SELECTING ANOTHER USER, CONDUCTING ALL NECESSARY DUE DILIGENCE, AND COMPLYING WITH ALL APPLICABLE LAWS.</Text>
              
              <Text style={[styles.text, {marginVertical: 0, marginTop : 10}]}>
                <Text style={styles.subTitle}>11. Limited Platform License. </Text>
                  BOOKSMART™ grants You a limited, non-exclusive,
                  revocable, non-transferable license to access and use the platform solely for the purposes
                  outlined in this Agreement. BOOKSMART™ may suspend or revoke this license at any time,
                  in its sole discretion, including due to violation of these Terms.</Text>

            </View>

            <View style={styles.titleBar}>
              <Text style={[styles.text, {fontWeight: 'bold', marginTop: 10}]}>IMPORTANT! BE SURE YOU HAVE SCROLLED THROUGH AND CAREFULLY READ ALL of the above Terms and Conditions of the Agreement before electronically signing and/or clicking “Agree” or similar button and/or USING THE SITE (“acceptance”). This Agreement is legally binding between you and BOOKSMART™. By electronically signing and/or clicking “Agree” or similar button and/or using the SITE, you AFFIRM THAT YOU ARE OF LEGAL AGE AND HAVE THE LEGAL CAPACITY TO ENTER INTO THE SERVICE AGREEMENT, AND YOU agree to abide by ALL of the Terms and Conditions stated or referenced herein. If you do not agree to abide by these Terms and Conditions, do NOT electronically sign and/or click an “Agree” or similar button and do not use the SITE. You must accept and abide by these Terms and Conditions in the Agreement as presented to you.</Text>
            </View>
            <View style={styles.titleBar}>
              <Text style={[styles.text, {fontWeight: 'bold', marginTop: 0}]}>Acknowledge Terms? Yes/No</Text>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                itemTextStyle={styles.itemTextStyle}
                iconStyle={styles.iconStyle}
                data={items}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={''}
                value={value ? value : items[1].value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setValue(item.value);
                  setIsFocus(false);
                  if (item.value == 1) {
                    setCredentials({...credentials, ["AcknowledgeTerm"] : true, ["selectedoption"]: checked})
                  } else 
                    setCredentials({...credentials, ["AcknowledgeTerm"] : false, ["selectedoption"]: checked})
                }}
                renderLeftIcon={() => (
                  <View
                    style={styles.icon}
                    color={isFocus ? 'blue' : 'black'}
                    name="Safety"
                    size={20}
                  />
                )}
              />
            </View>
            <View style={styles.titleBar}>
              <Text style={[styles.text, {fontSize: RFValue(12), fontWeight: 'bold', marginTop: 0}]}>Acknowledge Terms Signature <Text style={{color: '#f00'}}>*</Text></Text>
            
              {value == 1 && <View style={styles.titleBar}>
                <Text style={[styles.text, {fontWeight: 'bold', marginBottom: 5}]}>Signature <Text style={{color: '#f00'}}>*</Text></Text>
                <SignatureCapture
                    style={styles.signature}
                    ref={signatureRef}
                    onSaveEvent={(result) => onSaveEvent(result)}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                />
                  <View style={styles.buttonContainer}>
                    <Button title="Save" onPress={() => signatureRef.current.saveImage()} />
                    <Button title="Reset" onPress={handleReset} />
                  </View>
                </View>}
            </View>
            <View style={[styles.btn, {marginTop: 20, width: '90%'}]}>
              <HButton style={styles.subBtn} onPress={ handlePreSubmit }>
                Submit
              </HButton>
            </View>
            <Image
              source={images.hospitality_icon}
              resizeMode="contain"
              style={styles.homepage}
            />
          </View>
        </Hyperlink>
      </ScrollView>
      <MFooter />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative'
  },
  permission: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 10
  },
  titleBar: {
    width: '90%'
  },
  dropdown: {
    height: 30,
    width: '25%',
    color: 'black',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
    color: 'black'
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
    fontSize: 14,
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
    fontSize: 16,
  },
  title: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#2a53c1',
    textDecorationLine: 'underline'
  },
  subTitle: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
    color: 'black'
  },
  text: {
    fontSize: RFValue(14),
    color: 'black',
    fontWeight: 'normal',
    marginVertical: RFValue(20),
  },
  sub1text: {
    textAlign: 'left', 
    fontSize: RFValue(14), 
    fontWeight: 'normal', 
    color: 'black', 
    marginTop: 10
  },
  signature: {
    flex: 1,
    width: '100%',
    height: 150,
  },
  homepage: {
    width: 250,
    height: 200,
    marginTop: 30,
    marginBottom: 100
  },
  btn: {flexDirection: 'column',
    gap: 20,
    marginBottom: 30,
  },
  subBtn: {
    marginTop: 0,
    padding: 10,
    backgroundColor: '#A020F0',
    color: 'white',
    fontSize: RFValue(17),
  },
  checkboxWrapper: {
    transform: [{ scale: 0.8}],
    marginTop: -5
  },
  buttonContainer: {
    flexDirection: 'row', // Buttons side by side
    justifyContent: 'space-around', // Add spacing between buttons
    alignItems: 'center', // Align buttons vertically
    marginVertical: 10,
  },
});
  