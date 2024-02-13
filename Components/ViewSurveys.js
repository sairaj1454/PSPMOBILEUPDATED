
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './config';
import { Searchbar } from 'react-native-paper'; 
import ViewResponses from './Viewresponse';

const ViewSurveys = () => {
  const [surveys, setSurveys] = useState([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchSurveys();
  }, [search]);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/surveys`);
      const filteredSurveys = response.data.filter(survey =>
        survey.title.toLowerCase().includes(search.toLowerCase())
      );
      setSurveys(filteredSurveys);
    } catch (error) {
      console.error('Error fetching surveys:', error.message);
    }
  };

  const handleDeleteSurvey = async (surveyId) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/surveys/${surveyId}`);
      fetchSurveys(); 
    } catch (error) {
      console.error('Error deleting survey:', error.message);
    }
  };

  const navigateToViewResponses = (surveyId) => {
    navigation.navigate('ViewResponses', { surveyId });
  };

  const renderSurveyItem = ({ item }) => (
    <View style={styles.surveyItemContainer}>
      <Text style={styles.surveyTitle}>{item.title}</Text>
      <TouchableOpacity
        style={styles.viewResponsesButton}
        onPress={() => navigateToViewResponses(item._id)}
      >
        <Text style={styles.viewResponsesButtonText}>View Responses</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this survey?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', onPress: () => handleDeleteSurvey(item._id) },
            ],
            { cancelable: true }
          )
        }
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>View Surveys</Text>
      <Searchbar
        placeholder="Search surveys..."
        onChangeText={(text) => setSearch(text)}
        value={search}
        style={styles.searchBar} 
      />
      {surveys.length === 0 ? (
        <Text>No surveys available</Text>
      ) : (
        <FlatList
          data={surveys}
          keyExtractor={(item) => item._id}
          renderItem={renderSurveyItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },searchBar: {
    marginVertical: 10,
  },
  viewResponsesButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  viewResponsesButtonText: {
    color: 'white',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  surveyItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  surveyTitle: {
    flex: 1,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginBottom: 10,
  },
});

export default ViewSurveys;
