import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

const LeaveCalendarScreen = ({ navigation }) => {
  const [markedDates, setMarkedDates] = useState({});
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [remainingLeaves, setRemainingLeaves] = useState(0);

  useEffect(() => {
    
    fetchLeaveStatus();
   
    fetchLeavesInfo();
  }, []);

  const fetchLeaveStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
     
      const response = await fetch('http://10.113.34.148:3000/leave/status', {
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

     
      const defaultLeaveResponse = await fetch('http://10.113.34.148:3000/leave/default-leaves', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      if (!defaultLeaveResponse.ok) {
        throw new Error('Failed to fetch default leaves');
      }
      const defaultLeaves = await defaultLeaveResponse.json();

      
      const markedDates = transformLeaveStatusToMarkedDates(leaveStatus);
      const markedDefaultLeaves = transformDefaultLeavesToMarkedDates(defaultLeaves);
      setMarkedDates({ ...markedDates, ...markedDefaultLeaves });
    } catch (error) {
      console.error(error);
      
    }
  };

  const transformLeaveStatusToMarkedDates = (leaveStatus) => {
    const formattedDates = {};
    leaveStatus.forEach((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      let currentDate = new Date(start);

      while (currentDate <= end) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${
          day < 10 ? '0' + day : day
        }`;
        formattedDates[formattedDate] = {
          customStyles: {
            container: {
              backgroundColor:
                leave.status === 'approved'
                  ? 'green'
                  : leave.status === 'rejected'
                  ? null
                  : 'red',
              borderRadius: 20,
            },
          },
        };
        currentDate.setDate(currentDate.getDate() + 1); 
      }
    });
    return formattedDates;
  };

  const transformDefaultLeavesToMarkedDates = (defaultLeaves) => {
    const formattedDates = {};
    defaultLeaves.forEach((leave) => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      let currentDate = new Date(start);

      while (currentDate <= end) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${
          day < 10 ? '0' + day : day
        }`;
        formattedDates[formattedDate] = {
          customStyles: {
            container: {
              backgroundColor: 'gray',
              borderRadius: 20,
            },
          },
        };
        currentDate.setDate(currentDate.getDate() + 1); 
      }
    });
    return formattedDates;
  };

  const fetchLeavesInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://10.113.34.148:3000/leave/leaves-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch leaves info');
      }
      const leavesInfo = await response.json();
   
      setTotalLeaves(leavesInfo.totalLeaves);
      setRemainingLeaves(leavesInfo.remainingLeaves);
    } catch (error) {
      console.error(error);
     
    }
  };

  const handleApplyLeave = () => {
    navigation.navigate('leave');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.leavesInfo}>Total Leaves: {totalLeaves}</Text>
          <Text style={styles.leavesInfo}>Remaining Leaves: {remainingLeaves}</Text>
        </Card.Content>
      </Card>
      <Calendar
        markedDates={markedDates}
        markingType={'custom'} 
        theme={{
          todayTextColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          selectedDayBackgroundColor: '#00adf5',
          dotColor: '#00adf5',
          arrowColor: '#00adf5',
        }}
      />
      <Button
        mode="contained"
        onPress={handleApplyLeave}
        style={[styles.applyButton, { backgroundColor: remainingLeaves <= 0 ? 'grey' : '#800000' }]}
        disabled={remainingLeaves <= 0}
      >
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
  card: {
    marginBottom: 20,
    backgroundColor:'white',
  },
  leavesInfo: {
    margin:5,
    padding:10,
    textAlign: 'center',
    borderWidth:1,
    fontWeight:'bold',
  },
  applyButton: {
    marginTop: 20,
  },
});

export default LeaveCalendarScreen;
