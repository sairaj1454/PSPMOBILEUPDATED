import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet ,FlatList} from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from './config';

const LeaveApproveScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaveDetails();
  }, []);

  const fetchLeaveDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/leave/all/${username}`, {
        headers: {
          Authorization: token,
        },
      });
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leave details:', error);
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/leave/update/${leaveId}`, { status: 'approved' }, {
        headers: {
          Authorization: token,
        },
      });
      // Refresh leave details after approval
      fetchLeaveDetails();
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/leave/update/${leaveId}`, { status: 'rejected' }, {
        headers: {
          Authorization: token,
        },
      });
      // Refresh leave details after rejection
      fetchLeaveDetails();
    } catch (error) {
      console.error('Error rejecting leave:', error);
    }
  };

  const renderLeaveItem = ({ item }) => (
    <Card style={styles.leaveCard}>
      <Card.Content>
        <Text>Start Date: {formatDate(item.startDate)}</Text>
        <Text>End Date: {formatDate(item.endDate)}</Text>
        <Text>Number of Days: {item.numberOfDays}</Text>
        <Text>Reason: {item.reason}</Text>
      </Card.Content>
      <Card.Actions style={styles.buttonContainer}>
        <Button onPress={() => handleApproveLeave(item._id)} color="green">Approve</Button>
        <Button onPress={() => handleRejectLeave(item._id)} color="red">Reject</Button>
      </Card.Actions>
    </Card>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Leave Approval</Text>
      <FlatList
        data={leaves}
        keyExtractor={(item) => item._id}
        renderItem={renderLeaveItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  leaveCard: {
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default LeaveApproveScreen;
