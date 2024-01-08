import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './config';

const SurveyPage = ({ route }) => {
  const { survey } = route.params;
  const [selectedOptions, setSelectedOptions] = useState({});
  const navigation = useNavigation(); // Initialize navigation

  const handleOptionSelect = (questionIndex, option) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionIndex]: option,
    }));
  };

  const handleTextAnswer = (questionIndex, text) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [questionIndex]: text,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Retrieve userId from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');

      if (!userId) {
        // Handle the case where userId is not available
        Alert.alert('Error', 'User ID not found. Please login again.');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/surveyresponse`, {
        userId: userId,
        surveyTitle: survey.title,
        responses: Object.entries(selectedOptions).map(([questionIndex, answer]) => ({
          question: survey.questions[questionIndex].question,
          answer: answer,
        })),
      });

      console.log(response.data.message);

      // Show Alert and navigate back to Home page after user clicks "OK"
      Alert.alert(
        'Submission',
        'Survey submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('HomeTab'), // Navigate to Home page on "OK"
          },
        ]
      );

    } catch (error) {
      console.error('Error submitting survey:', error.message);
      Alert.alert('Error', 'Error submitting survey response');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{survey.title}</Text>
      <Text style={styles.heading}>Questions:</Text>
      {survey.questions.map((question, questionIndex) => (
        <View style={styles.questionContainer} key={questionIndex}>
          <Text style={styles.questionText}>{question.question}</Text>
          {question.type === 'mcq' ? (
            question.options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.optionButton,
                  selectedOptions[questionIndex] === option && styles.selectedOption,
                ]}
                onPress={() => handleOptionSelect(questionIndex, option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <TextInput
              style={styles.textInput}
              placeholder="Type your answer here"
              value={selectedOptions[questionIndex] || ''}
              onChangeText={(text) => handleTextAnswer(questionIndex, text)}
            />
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  textInput: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'gray',
    textAlign: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  questionContainer: {
    backgroundColor: '#f7faf7',
    elevation: 5,
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  selectedOption: {
    backgroundColor: 'green',
  },
  optionText: {
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: 'maroon',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SurveyPage;
