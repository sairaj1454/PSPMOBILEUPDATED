import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet,Alert } from 'react-native';
import { Button, Card, Title} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

const AdminLeavesManagementPage = () => {
  const [totalLeaves, setTotalLeaves] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleUpdateTotalLeaves = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/update-total-leaves`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ totalLeaves }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Total leaves updated successfully for all users');
      } else {
        Alert.alert('Error', 'Failed to update total leaves');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Internal server error');
    }
  };

  const handleUploadDefaultLeaves = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://10.113.34.148:3000/admin/upload-default-leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({ startDate, endDate, reason }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Default leaves uploaded successfully');
      } else {
        Alert.alert('Error', 'Failed to upload default leaves');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Internal server error');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Update Total Leaves</Title>
          <TextInput
            placeholder="New total leaves"
            value={totalLeaves}
            onChangeText={setTotalLeaves}
            keyboardType="numeric"
          />
          <Button mode="contained" onPress={handleUpdateTotalLeaves} style={styles.button}>
            Update Total Leaves
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Upload Default Leaves</Title>
          <TextInput
            placeholder="Start Date (YYYY-MM-DD)"
            value={startDate}
            onChangeText={setStartDate}
          />
          <TextInput
            placeholder="End Date (YYYY-MM-DD)"
            value={endDate}
            onChangeText={setEndDate}
          />
          <TextInput
            placeholder="Reason"
            value={reason}
            onChangeText={setReason}
          />
          <Button mode="contained" onPress={handleUploadDefaultLeaves} style={styles.button}>
            Upload Default Leaves
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '90%',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#800000', 
  },
});

export default AdminLeavesManagementPage;
