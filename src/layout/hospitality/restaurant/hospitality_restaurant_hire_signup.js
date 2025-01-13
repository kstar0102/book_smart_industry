import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  FlatList
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';
import MHeader from '../../../components/Mheader';
import MFooter from '../../../components/Mfooter';
import AnimatedHeader from '../../AnimatedHeader';
import constStyles from '../../../assets/styles';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const { width, height } = Dimensions.get('window');

export default function HospitalityRestaurantHireSignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const titles = ['Front Desk', 'Housekeeping'];

  const validateInputs = () => {
    if (!firstName || !lastName) {
      Alert.alert('Validation Error', 'First and Last Name are required.');
      return false;
    }
    if (!email) {
      Alert.alert('Validation Error', 'Email is required.');
      return false;
    }
    if (!password || password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      console.log('Sign Up successful'); // Replace with API logic
      Alert.alert('Success', 'You have successfully registered!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MHeader navigation={navigation} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <AnimatedHeader title="REGISTER HERE!" />
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: RFValue(20) }}>
            <Text style={[constStyles.signUpText, { flexDirection: 'row' }]}>
              NOTE: Your Registration will be in <Text style={[constStyles.signUpText, { color: '#0000ff' }]}>
                "PENDING"
              </Text>{' '}
              Status until your information is verified. Once
              <Text style={[constStyles.signUpText, { color: '#008000' }]}> "APPROVED" </Text>you will be notified by email.
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={constStyles.signUpSubtitle}> Name <Text style={{ color: 'red' }}>*</Text> </Text>
          <View style={{ flexDirection: 'row', width: '100%', gap: 10 }}>
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              placeholder="First"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.textInput, { flex: 1 }]}
              placeholder="Last"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <Text style={styles.label}>Select Title:</Text>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.textInput}
          >
            <Text style={[styles.textPlaceholder, title && { color: '#000' }]}>
              {title || 'Select your title'}
            </Text>
          </TouchableOpacity>

          <Modal
            transparent={true}
            visible={isModalVisible}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  data={titles}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setTitle(item);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Confirm your password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.button}
          accessible
          accessibilityLabel="Submit Registration"
        >
          <LinearGradient colors={['#A1E9F1', '#B980EC']} style={styles.gradientButton}>
            <Text style={styles.buttonText}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
      <MFooter navigation={navigation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    marginTop: height * 0.15,
    marginBottom: height * 0.09,
    width: '100%',
    paddingHorizontal: RFValue(16),
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  textInput: {
    width: '100%',
    height: RFValue(40),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginBottom: 10,
    fontSize: RFValue(14),
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  textPlaceholder: {
    color: '#999',
    fontSize: RFValue(14),
  },
  button: {
    width: '40%',
    marginBottom: 10,
    alignSelf: 'flex-start',
    left: RFValue(20),
  },
  gradientButton: {
    height: RFValue(35),
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: RFValue(16),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  intro: {
    marginBottom: RFValue(20),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalItem: {
    padding: 15,
    width: '100%',
  },
  modalText: {
    fontSize: RFValue(16),
    color: '#333',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#f00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
});
