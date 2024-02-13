import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, ActivityIndicator as PaperActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 

import { API_BASE_URL } from './config';
import TopBar from './topbar';

const TeamD = ({ navigation }) => {
  const [assignedTeamLead, setAssignedTeamLead] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/profile`, {
          method: 'GET',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userProfile = await response.json();
          setAssignedTeamLead(userProfile.assignedTeamLead);

        
          if (userProfile.assignedTeamLead && userProfile.assignedTeamLead.teamLeadId) {
            const teamLeadId = userProfile.assignedTeamLead.teamLeadId;
            const teamMembersResponse = await fetch(`${API_BASE_URL}/teamleads/${teamLeadId}`);
            if (teamMembersResponse.ok) {
              const teamMembersData = await teamMembersResponse.json();
              setTeamMembers(teamMembersData);
            } else {
              console.error('Error fetching team members:', teamMembersResponse.status);
            }
          }
        } else {
          console.error('Error fetching user profile:', response.status);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUserClick = (username) => {
    navigation.navigate('ChatScreen', { username });
  };

  const handleChatWithTeamLead = () => {
    if (assignedTeamLead) {
      navigation.navigate('ChatScreen', { username: assignedTeamLead.username });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar />
      <View style={styles.m}>
      <View style={styles.centeredContent}>
        <ImageBackground
          source={{ uri: 'https://www.vhv.rs/file/max/27/272099_background-png-images-download.jpg' }} 
          style={styles.backgroundImage}
        />
        <Card style={styles.mainCard}>
          <Card.Content>
            <Title style={styles.title}>Team Details</Title>
            {loading ? (
              <PaperActivityIndicator animating={true} size="large" color="#0000ff" />
            ) : assignedTeamLead ? (
              <Card style={styles.leadCard}>
                <Card.Content>
                  <Paragraph style={styles.subtitle}>Assigned Team Lead:</Paragraph>
                  <Paragraph>Username: {assignedTeamLead.username}</Paragraph>
                  <TouchableOpacity
                    style={styles.chatButton}
                    onPress={handleChatWithTeamLead}
                  >
                    <FontAwesome name="comment" size={24} color="black" />
                    <Text style={styles.buttonText}>Chat with Team Lead</Text>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            ) : (
              <Paragraph>No assigned team lead found.</Paragraph>
            )}

            {teamMembers.length > 0 && (
              <Card style={styles.subcard}>
                <Paragraph style={styles.subtitle}>Team Members:</Paragraph>
                {teamMembers.map((member) => (
                  <TouchableOpacity
                    key={member._id}
                    style={styles.memberCard}
                    onPress={() => handleUserClick(member.username)}
                  >
                    <FontAwesome name="comment" size={24} color="black" />
                    <Text style={styles.buttonText}>{member.username}</Text>
                  </TouchableOpacity>
                ))}
              </Card>
            )}
          </Card.Content>
        </Card>
      </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    
  },
  m:{
margin:10,
marginTop:20,
marginBottom:12,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
  },
  centeredContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  mainCard: {
    width: '100%',
    padding: 16,
    elevation: 20,
    backgroundColor: 'white',
  },
  subcard: {
    width: '100%',
    padding: 16,
    elevation: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  leadCard: {
    marginBottom: 16,
    width: '100%',
    elevation: 20,
    backgroundColor: 'white',
  },
  teamMembersContainer: {
    width: '100%',
    elevation: 30,
  },
  chatButton: {
    marginTop: 8,
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  memberCard: {
    marginBottom: 8,
    width: '100%',
    backgroundColor: 'white',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 10,
  },
});

export default TeamD;
