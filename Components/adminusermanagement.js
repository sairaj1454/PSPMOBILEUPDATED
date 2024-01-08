import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert ,TouchableOpacity} from 'react-native';
import { TextInput as PaperTextInput, Button as PaperButton, Card as PaperCard } from 'react-native-paper';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { AirbnbRating } from 'react-native-ratings';
import TopBar from './topbar';

const UserDetailsScreen = ({ route }) => {
  const { userDetails } = route.params;
  const [surveyData, setSurveyData] = useState([]);
  const [selectedTeamLead, setSelectedTeamLead] = useState('');
  const [availableTeamLeads, setAvailableTeamLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [assignedTeamLead, setAssignedTeamLead] = useState('');
  const [isEditingTeamLead, setIsEditingTeamLead] = useState(false);

  useEffect(() => {
    fetchSurveyData();
    fetchAssignedTeamLeadDetails();
  }, []);

  const fetchAssignedTeamLeadDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/userdetails/${userDetails.username}/assignedteamlead`);
      setAssignedTeamLead(response.data);
    } catch (error) {
      console.error('Error fetching assigned team lead details:', error);
    }
  };

  const fetchSurveyData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/userdetails/${userDetails.username}`);
      setSurveyData(response.data.surveyResponses);
    } catch (error) {
      console.error('Error fetching survey data:', error);
    }
  };

  const handleDeleteSurveyResponse = async (surveyTitle) => {
    try {
      Alert.alert(
        'Confirm Delete',
        `Are you sure you want to delete the survey response for "${surveyTitle}"?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              await axios.delete(`${API_BASE_URL}/deletesurveyresponse`, {
                data: {
                  username: userDetails.username,
                  surveyTitle: surveyTitle,
                },
              });

              fetchSurveyData();
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error deleting survey response:', error);
    }
  };

  const handleSearchTeamLeads = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teamleads?search=${searchQuery}`);
      setAvailableTeamLeads(response.data);
    } catch (error) {
      console.error('Error fetching team leads:', error);
    }
  };
  
  const handleAssignTeamLead = async () => {
    try {
      await axios.post(`${API_BASE_URL}/assignteamlead`, {
        username: userDetails.username,
        teamLeadUsername: selectedTeamLead,
      });

      fetchSurveyData();
      setAvailableTeamLeads([]);
      setAssignedTeamLead(selectedTeamLead);
      setIsEditingTeamLead(false);
      Alert.alert('Success', 'Team Lead assigned successfully');
    } catch (error) {
      console.error('Error assigning team lead:', error);
      Alert.alert('Error', 'Failed to assign Team Lead. Please try again.');
    }
  };

  const renderSurveyItem = ({ item }) => (
    <PaperCard style={styles.surveyCard}>
      <PaperCard.Content>
        <Text>Survey Response</Text>
        <Text style={styles.surveyTitle}>{item.surveyTitle}</Text>
        {item.responses.map((response, index) => (
          <View key={index}>
            <Text>{`Question: ${response.question}`}</Text>
            <Text>{`Answer: ${response.answer}`}</Text>
          </View>
        ))}
        {item.reviews && item.reviews.length > 0 && (
          <View>
            <Text style={styles.reviewTitle}>Reviews:</Text>
            {item.reviews.map((review, index) => (
              <View key={index}>
                <Text style={styles.reviewText}>{`Review ${index + 1}: ${review.reviewText}`}</Text>
                <AirbnbRating showRating={false} defaultRating={review.rating} size={20} />
              </View>
            ))}
          </View>
        )}
      </PaperCard.Content>
      <PaperCard.Actions>
        <PaperButton onPress={() => handleDeleteSurveyResponse(item.surveyTitle)} mode="contained" style={styles.button}>
          Delete Survey Response
        </PaperButton>
      </PaperCard.Actions>
    </PaperCard>
  );

  const renderUserDetailsContainer = () => (
    <FlatList
   
      data={[userDetails]}
      keyExtractor={(item) => item.username}
      renderItem={({ item }) => (
        <PaperCard style={styles.userDetailsCard}>
          <PaperCard.Content>
            <Text style={styles.headerText}>User Details</Text>
            <View style={styles.tableRow}>
              <Text style={styles.labelText}>Username:</Text>
              <Text style={styles.detailText}>{item.username}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.labelText}>Employee ID:</Text>
              <Text style={styles.detailText}>{item.employeeId}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.labelText}>Email:</Text>
              <Text style={styles.detailText}>{item.email}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.labelText}>Assigned Team Lead:</Text>
              <Text style={styles.detailText}>{assignedTeamLead.teamLeadUsername}</Text>
              {!isEditingTeamLead && (
                <PaperButton onPress={() => setIsEditingTeamLead(true)} mode="contained" style={styles.editButton}>
                  Edit
                </PaperButton>
              )}
            </View>
            {isEditingTeamLead && (
              <>
                <PaperTextInput
                  style={styles.searchBar}
                  placeholder="Search for Team Lead"
                  value={searchQuery}
                  onChangeText={(text) => setSearchQuery(text)}
                />
                <PaperButton mode="contained" onPress={handleSearchTeamLeads} style={styles.button}>
                  Search Team Leads
                </PaperButton>

                <FlatList
    data={availableTeamLeads}
    keyExtractor={(item) => item._id}
    renderItem={({ item }) => (
      <PaperCard key={item.username} style={styles.teamLeadCard}>
        <TouchableOpacity
          onPress={() => setSelectedTeamLead(item.username)}
          style={[
            styles.teamLeadContainer,
            selectedTeamLead === item.username ? styles.selectedTeamLead : null,
          ]}
        >
          <Text style={[
            styles.teamLeadText,
            selectedTeamLead === item.username ? styles.selectedTeamLeadText : null,
          ]}>
            {item.username}
          </Text>
        </TouchableOpacity>
      </PaperCard>
    )}
  />

                <PaperButton onPress={handleAssignTeamLead} mode="contained" style={styles.button}>
                  Assign Team Lead
                </PaperButton>
              </>
            )}
          </PaperCard.Content>
        </PaperCard>
      )}
    />
  );

  const renderSurveyResponsesContainer = () => (
    <FlatList
      data={surveyData}
      renderItem={renderSurveyItem}
      keyExtractor={(item) => item.surveyTitle}
    />
  );

  return (
    <FlatList
      data={['userDetailsContainer', 'surveyResponsesContainer']}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <View style={styles.container}>
          {item === 'userDetailsContainer' && renderUserDetailsContainer()}
          {item === 'surveyResponsesContainer' && renderSurveyResponsesContainer()}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
    marginTop:20,
  },
  userDetailsCard: {
    marginVertical: 10,
    paddingVertical: 10,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  labelText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  detailText: {
    flex: 1,
  },
  searchBar: {
    marginVertical: 10,
    paddingVertical: 0,
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  button: {
    marginVertical: 5,
    backgroundColor: 'maroon',
  },
  surveyContainer: {
    marginVertical: 10,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  editTeamLeadContainer: {
    // Add styles for the container when editing team lead if needed
  },
  surveyCard: {
    marginVertical: 10,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewTitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  reviewText: {
    marginLeft: 10,
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: 'maroon',
    color: 'black',
    marginLeft: 10,
  }, teamLeadCard: {
    marginVertical: 10,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  teamLeadContainer: {
    padding: 10,
    borderRadius: 5,
  },
  teamLeadText: {
    color: 'black',
    textAlign:'center',
    // Default text color
  },
  selectedTeamLead: {
    backgroundColor: 'green', // Background color for the selected lead
  },
  selectedTeamLeadText: {
    color: 'white', // Text color for the selected lead
  },
});
export default UserDetailsScreen;
 