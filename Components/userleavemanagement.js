import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-modern-datepicker';
import { Alert } from 'react-native';
import { API_BASE_URL } from './config';

const LeaveManagementScreen = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();

  const handleApplyLeave = async () => {
    try {
      if (!reason) {
        throw new Error('Please enter a reason for leave');
      }

      if (endDate && startDate && endDate < startDate) {
        throw new Error('End date cannot be earlier than start date');
      }
  
      const token = await AsyncStorage.getItem('token');
      const username = await AsyncStorage.getItem('username');
  
      const response = await fetch('http://10.113.34.148:3000/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ startDate, endDate, reason, username }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit leave request');
      }
  
      setModalVisible(true);
      setReason('');
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Start Date:</Text>
        <DatePicker
          mode="datepicker"
          selected={startDate}
          onDateChange={date => setStartDate(date)}
          minDate={new Date()}
          maxDate={endDate ? new Date(endDate) : null}
          colorPrimary={colors.primary}
        />

        <Text style={[styles.label, { color: colors.text }]}>End Date:</Text>
        <DatePicker
          mode="datepicker"
          selected={endDate}
          onDateChange={date => setEndDate(date)}
          minDate={startDate ? new Date(startDate) : new Date()}
          colorPrimary={colors.primary}
        />

        <Text style={[styles.label, { color: colors.text }]}>Reason:</Text>
        <TextInput
          style={[styles.reasonInput, { backgroundColor: colors.surface, color: colors.text }]}
          onChangeText={text => setReason(text)}
          value={reason}
          multiline
          underlineColor={colors.primary}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleApplyLeave}
        style={[styles.button, { backgroundColor: '#800000' }]} 
        labelStyle={{ color: colors.background }}
      >
        Apply Leave
      </Button>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Leave successfully submitted!</Text>
            <Button onPress={() => setModalVisible(false)} title="Close" color="black" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  reasonInput: {
    height: 80,
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent', 
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color:'black',
  },
});

export default LeaveManagementScreen;
