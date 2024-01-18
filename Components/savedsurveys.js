import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from './config';
import TopBar from './topbar';

const SavedSurveysPage = ({ navigation }) => {
  const [savedSurveys, setSavedSurveys] = useState([]);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    fetchSavedSurveys();
  }, []);

  const fetchSavedSurveys = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/savedsurveys`);
      setSavedSurveys(response.data);
    } catch (error) {
      console.error('Error fetching saved surveys:', error.message);
    }
  };

  const handleAssignSurvey = (surveyId, surveyTitle, questions) => {
    navigation.navigate('SelectUsers', { surveyId, surveyTitle, questions });
  };

  const [visibleQuestions, setVisibleQuestions] = useState({});

  const toggleQuestionsVisibility = (surveyId) => {
    setVisibleQuestions((prevState) => ({
      ...prevState,
      [surveyId]: !prevState[surveyId],
    }));
  };

  return (
    <>
      <TopBar />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Saved Surveys</Text>
        {savedSurveys.map((item, index) => (
          <View key={index} style={styles.surveyItem}>
            <View style={styles.leftContainer}>
              <Text style={styles.surveyTitle}>{item.title}</Text>
              {visibleQuestions[item._id] &&
                item.questions &&
                item.questions.map((question, qIndex) => (
                  <View key={qIndex} style={styles.questionContainer}>
                    <Text style={styles.questionText}>{question.question}</Text>
                    {question.options &&
                      question.options.map((option, oIndex) => (
                        <Text key={oIndex} style={styles.optionText}>
                          {option}
                        </Text>
                      ))}
                  </View>
                ))}
              {/* Add a button to toggle questions visibility */}
              <TouchableOpacity
                style={styles.viewQuestionsButton}
                onPress={() => toggleQuestionsVisibility(item._id)}>
                <Text style={styles.viewQuestionsButtonText}>
                  {visibleQuestions[item._id] ? 'Hide Questions' : 'View Questions'}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Add the "Select" button here */}
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handleAssignSurvey(item._id, item.title, item.questions)}>
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  selectButton: {
    backgroundColor: 'maroon',
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  surveyItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  viewQuestionsButton: {
    backgroundColor: 'gray',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    width:'50%',
  },
  viewQuestionsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  questionContainer: {
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: 14,
    marginLeft: 16,
  }, leftContainer: {
    flex: 1,
    marginRight: 16,
  },
  selectButton: {
    backgroundColor: 'maroon',
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});

export default SavedSurveysPage;
