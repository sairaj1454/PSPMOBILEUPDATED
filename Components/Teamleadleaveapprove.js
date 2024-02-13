import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { Card, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL } from './config';
import Dialog from "react-native-dialog";

const LeaveApproveScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const [leaves, setLeaves] = useState([]);
  const [reason, setReason] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);

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

      const sortedLeaves = response.data.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return 0;
      });

      setLeaves(sortedLeaves);
    } catch (error) {
      console.error('Error fetching leave details:', error);
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/leave/update/${leaveId}`,
        { status: 'approved' },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchLeaveDetails();
      setShowSuccessDialog(true); 
    } catch (error) {
      console.error('Error approving leave:', error);
    }
  };

  const handleRejectLeave = async (leaveId) => {
    setSelectedLeaveId(leaveId);
    setShowDialog(true);
  };

  const submitRejectLeave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `${API_BASE_URL}/leave/update/${selectedLeaveId}`,
        { status: 'rejected', reason },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      fetchLeaveDetails();
      setShowDialog(false);
      setReason('');
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
        {item.status === 'pending' && (
          <>
            <Button onPress={() => handleApproveLeave(item._id)} color="green">
              {item.status === 'pending' ? 'Approve' : 'Approved'}
            </Button>
            <Button onPress={() => handleRejectLeave(item._id)} color="red">
              Reject
            </Button>
          </>
        )}
        {item.status === 'approved' && (
          <Text style={{ color: 'green', fontWeight: 'bold' }}>Approved</Text>
        )}
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
      <FlatList data={leaves} keyExtractor={(item) => item._id} renderItem={renderLeaveItem} />
      <Dialog.Container visible={showDialog}>
        <Dialog.Title>Reason for rejection</Dialog.Title>
        <Dialog.Input
          placeholder="Enter reason"
          value={reason}
          onChangeText={(text) => setReason(text)}
        />
        <Dialog.Button label="Cancel" onPress={() => setShowDialog(false)} />
        <Dialog.Button label="Submit" onPress={submitRejectLeave} />
      </Dialog.Container>
      <Dialog.Container visible={showSuccessDialog}>
        <Dialog.Title>Success</Dialog.Title>
        <Dialog.Description>The leave has been successfully approved.</Dialog.Description>
        <Dialog.Button label="OK" onPress={() => setShowSuccessDialog(false)} />
      </Dialog.Container>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default LeaveApproveScreen;
