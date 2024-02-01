import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-modern-datepicker';

const LeaveManagementScreen = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reason, setReason] = useState('');
  const { colors } = useTheme();

  const handleApplyLeave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const username = await AsyncStorage.getItem('username');

      const response = await fetch('http://10.113.34.128:3000/leave', {
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

      const responseData = await response.json();
      console.log(responseData.message);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Start Date:</Text>
        <DatePicker
          mode="single"
          selected={startDate}
          onDateChange={date => setStartDate(date)}
          minDate={new Date()}
          maxDate={endDate ? new Date(endDate) : null}
          colorPrimary={colors.primary}
        />

        <Text style={[styles.label, { color: colors.text }]}>End Date:</Text>
        <DatePicker
          mode="single"
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
        style={[styles.button, { backgroundColor: '#800000' }]} // Maroon color
        labelStyle={{ color: colors.background }}
      >
        Apply Leave
      </Button>
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
    borderColor: 'transparent', // Make the border transparent
  },
  button: {
    width: '100%',
    marginTop: 10,
  },
});

export default LeaveManagementScreen;
