import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, ActivityIndicator as PaperActivityIndicator } from 'react-native-paper';

import { API_BASE_URL } from './config';
import TopBar from './topbar';

const TeamD = () => {
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

          // Fetch team members based on assigned team lead
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

  return (
    <>
    <TopBar></TopBar>
    <View style={styles.container}>
    
      <View style={styles.centeredContent}>
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
                </Card.Content>
              </Card>
            ) : (
              <Paragraph>No assigned team lead found.</Paragraph>
            )}

            {teamMembers.length > 0 && (
              <View style={styles.teamMembersContainer}>
                <Paragraph style={styles.subtitle}>Team Members:</Paragraph>
                {teamMembers.map((member) => (
                  <Card key={member._id} style={styles.memberCard}>
                    <Card.Content>
                      <Paragraph>{member.username}</Paragraph>
                    </Card.Content>
                  </Card>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContent: {
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  mainCard: {
    width: '100%',
    padding: 16,
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
  },
  teamMembersContainer: {
    width: '100%',
  },
  memberCard: {
    marginBottom: 8,
    width: '100%',
  },
});

export default TeamD;
