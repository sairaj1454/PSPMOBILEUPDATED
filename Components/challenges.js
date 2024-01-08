import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';
import TopBar from './topbar';

export default function Challenges() {
  const navigation = useNavigation();
  const [surveys, setSurveys] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // Function to fetch user ID
  const fetchUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('Fetched user ID:', userId);
      setLoggedInUserId(userId);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  // Fetch user ID on component mount
  useEffect(() => {
    fetchUserId();
  }, []);

  // Fetch surveys when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (!loggedInUserId) {
        console.log('User not logged in');
        return;
      }

      console.log('Fetching surveys for user ID:', loggedInUserId);
      axios.get(`${API_BASE_URL}/surveys`)
        .then(response => {
          console.log('Surveys fetched successfully:', response.data);

          const userSurveys = response.data.filter(survey =>
            survey.accessibleUsers.includes(loggedInUserId)
          );

          console.log('User Surveys:', userSurveys);
          setSurveys(userSurveys);
        })
        .catch(error => {
          console.error('Error fetching surveys:', error);
        });
    }, [loggedInUserId])
  );

  const handleSurveyClick = (survey) => {
    console.log('Survey clicked:', survey);
    navigation.navigate('SurveyPage', { survey });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView>
        <TopBar />
        <Text style={styles.heading}>Surveys</Text>
        {surveys.length === 0 ? (
          <View style={styles.noSurveysContainer}>
            <Text style={styles.noSurveysText}>No surveys available</Text>
          </View>
        ) : (
          <View style={styles.surveysContainer}>
            {surveys.map((survey, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.surveyCard,
                  { width: surveys.length === 1 ? '100%' : '45%' }
                ]}
                onPress={() => handleSurveyClick(survey)}
              >
                <Text style={styles.surveyTitle}>{survey.title}</Text>
                <View style={styles.customButtonContainer}>
                  <Text style={styles.customButtonText}>Fill Survey</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    color: 'gray',
    textAlign: 'center',
  },
  surveysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  surveyCard: {
    backgroundColor: 'white',
    elevation: 3,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  customButtonContainer: {
    backgroundColor: 'maroon',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  customButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  noSurveysContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSurveysText: {
    fontSize: 16,
    color: 'gray',
  },
});
