import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './config';
import TopBar from './topbar';
import LUserDetail from './leaduserdetail';

const TeamLeadPannel = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchAssignedUsers();
  }, []);

  const fetchAssignedUsers = async () => {
    try {
      const teamLeadId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`${API_BASE_URL}/teamleads/${teamLeadId}`);
      const usersWithSelection = response.data.map((user) => ({ ...user, isSelected: false }));
      setAssignedUsers(usersWithSelection);
    } catch (error) {
      console.error('Error fetching assigned users:', error);
    }
  };

  const handleManageUser = (userDetails) => {
    navigation.navigate('LUserDetail', { username: userDetails.username });
  };

  const handleChatWithUser = (username) => {
    navigation.navigate('ChatScreen', { username });
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.cardContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.usernameText}>{item.username}</Title>
          <Paragraph>Additional user details or description can go here.</Paragraph>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <IconButton
            icon="chat" // You can use the appropriate chat icon
            color="blue"
            size={24}
            onPress={() => handleChatWithUser(item.username)}
          />
          <Button
            style={styles.manageButton}
            onPress={() => handleManageUser(item)}
            mode="contained"
          >
            Manage
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );

  return (
    <>
      <TopBar />
      <View style={styles.container}>
        <Text style={styles.heading}>Team Lead Panel</Text>
        <FlatList
          data={assignedUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderUserItem}
        />
      </View>
    </>
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
    marginVertical: 10,
  },
  card: {
    marginVertical: 10,
    flexDirection: 'row', // Make sure it's row-oriented
    justifyContent: 'space-between',
    alignItems: 'center',
  },cardContainer: {
    marginVertical: 10,
    flexDirection: 'row', // Make sure it's row-oriented
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usernameText: {
    fontSize: 18,
    marginBottom: 5,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  manageButton: {
    backgroundColor: 'maroon',
  },
});

export default TeamLeadPannel;
