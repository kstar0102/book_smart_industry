import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Image,
  Icon
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function AddStaffModal({ visible, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [active, setActive] = useState(false);
  const [photo, setPhoto] = useState(null); // for image picker integration

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Add item</Text>
          </View>

          {/* Input Fields */}
          <Text style={styles.label}>Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />

          <Text style={styles.label}>Mobile</Text>
          <TextInput value={mobile} onChangeText={setMobile} style={styles.input} keyboardType="phone-pad" />

          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />

          <Text style={styles.label}>Photo</Text>
          <TouchableOpacity style={styles.imagePicker}>
            <Ionicons name="image-outline" size={20} color="#888" />
            <Text style={styles.imageText}>Choose an image...</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Role</Text>
          <TextInput value={role} onChangeText={setRole} style={styles.input} />

          <View style={styles.switchRow}>
            <Text style={styles.label}>Active</Text>
            <Switch value={active} onValueChange={setActive} />
          </View>

          {/* Footer Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: name ? '#290135' : '#ccc' }]}
              disabled={!name}
              onPress={() => {
                onSubmit({ name, mobile, email, role, active });
                onClose();
              }}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000',
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
    color: '#000',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageText: {
    marginLeft: 8,
    color: '#666',
  },
  switchRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
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
