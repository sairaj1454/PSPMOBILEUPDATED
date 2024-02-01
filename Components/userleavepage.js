import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LeaveCalendarScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    // Fetch leave status from backend and update markedDates state
    fetchLeaveStatus();
  }, []);

  const fetchLeaveStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      // Fetch leave status from backend API
      const response = await fetch('http://10.113.34.128:3000/leave/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch leave status');
      }
      const leaveStatus = await response.json();
      // Transform leave status into marked dates format
      const markedDates = transformLeaveStatusToMarkedDates(leaveStatus);
      setMarkedDates(markedDates);
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const transformLeaveStatusToMarkedDates = (leaveStatus) => {
    const formattedDates = {};
    leaveStatus.forEach(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      let currentDate = new Date(start);

      while (currentDate <= end) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
        formattedDates[formattedDate] = { customStyles: { container: { backgroundColor: leave.status === 'approved' ? 'green' : 'red', borderRadius: 20 } } };
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
    });
    return formattedDates;
  };

  const handleApplyLeave = () => {
    navigation.navigate('leave');
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType={'custom'} // Use markingType 'custom' to provide custom marking styles
        theme={{
          todayTextColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          selectedDayBackgroundColor: '#00adf5',
          dotColor: '#00adf5',
          arrowColor: '#00adf5',
        }}
      />
      <Button mode="contained" onPress={handleApplyLeave} style={[styles.applyButton, { backgroundColor: '#800000' }]}>
        Apply Leave
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  applyButton: {
    marginTop: 20,
  },
});

export default LeaveCalendarScreen;
