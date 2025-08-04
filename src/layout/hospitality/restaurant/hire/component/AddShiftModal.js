import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function AddShiftModal({ visible, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = () => {
    if (!name || !start || !end) return;
    onSubmit({ name, start, end });
    setName('');
    setStart('');
    setEnd('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>Add item</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="e.g. 8AM"
            placeholderTextColor="#888"
            value={start}
            onChangeText={setStart}
            style={styles.input}
          />
          <TextInput
            placeholder="e.g. 4PM"
            placeholderTextColor="#888"
            value={end}
            onChangeText={setEnd}
            style={styles.input}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submit,
                {
                  backgroundColor:
                    name && start && end ? '#290135' : '#ccc',
                },
              ]}
              onPress={handleSubmit}
              disabled={!name || !start || !end}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  close: {
    color: '#888',
    fontSize: 20,
  },
  input: {
    backgroundColor: '#f2f2f2',
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
  },
  submit: {
    flex: 1,
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: '500',
  },
});
