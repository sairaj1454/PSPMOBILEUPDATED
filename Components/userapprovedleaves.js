import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { List, Card } from 'react-native-paper';
import axios from 'axios';
import { API_BASE_URL } from './config';

const LeavesDetailsScreen = ({ route }) => {
  const { username } = route.params;
  const [approvedLeaves, setApprovedLeaves] = useState([]);
  const [remainingLeaves, setRemainingLeaves] = useState(0);

  useEffect(() => {
    fetchLeavesData();
  }, []);

  const fetchLeavesData = async () => {
    try {
      const [approvedResponse, remainingResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/leave/all/approved/${username}`),
        axios.get(`${API_BASE_URL}/leave/remaining/${username}`),
      ]);
      setApprovedLeaves(approvedResponse.data);
      setRemainingLeaves(remainingResponse.data.remainingLeaves);
    } catch (error) {
      console.error('Error fetching leaves data:', error);
    }
  };

  const renderLeaveItem = ({ item }) => (
    <List.Item
      title={`Start Date: ${new Date(item.startDate).toDateString()}`} 
      description={`End Date: ${new Date(item.endDate).toDateString()}`} 
      style={styles.leaveItem}
      titleStyle={styles.leaveItemTitle}
      descriptionStyle={styles.leaveItemDescription}
    />
  );

  return (
    <View style={styles.container}>
          <Text style={styles.header}>Approved Leaves for {username}</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.remainingLeavesText}>Remaining Leaves: {remainingLeaves}</Text>
        </Card.Content>
      </Card>
    
      <FlatList
        data={approvedLeaves}
        renderItem={renderLeaveItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
  },
  remainingLeavesText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveItem: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 3,
  },
  leaveItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaveItemDescription: {
    fontSize: 14,
  },
});

export default LeavesDetailsScreen;
