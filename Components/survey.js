import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { API_BASE_URL } from './config';
import Icon from 'react-native-vector-icons/FontAwesome';

const SurveyPage = ({ route }) => {
  const { survey } = route.params;
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // Load previously saved answers on component mount
  useEffect(() => {
    const loadSavedAnswers = async () => {
      try {
        const savedAnswersString = await AsyncStorage.getItem('savedAnswers');
        if (savedAnswersString) {
          const savedAnswers = JSON.parse(savedAnswersString);
          setSelectedOptions(savedAnswers);
        }
      } catch (error) {
        console.error('Error loading saved answers:', error.message);
      }
    };

    loadSavedAnswers();
  }, []);

  // Save answers whenever the selectedOptions change
  useEffect(() => {
    const saveAnswers = async () => {
      try {
        await AsyncStorage.setItem('savedAnswers', JSON.stringify(selectedOptions));
      } catch (error) {
        console.error('Error saving answers:', error.message);
      }
    };

    saveAnswers();
  }, [selectedOptions]);

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
      // Check if all questions are answered
      const unansweredQuestions = survey.questions.filter((question, index) => {
        return (
          question.type === 'mcq' &&
          !selectedOptions.hasOwnProperty(index) &&
          !question.options.some((option) => selectedOptions[index] === option)
        ) || (question.type !== 'mcq' && !selectedOptions.hasOwnProperty(index));
      });
  
      if (unansweredQuestions.length > 0) {
        Alert.alert('Error', 'Please answer all questions before submitting the survey.');
        return;
      }
  
      const userId = await AsyncStorage.getItem('userId');
  
      if (!userId) {
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
  
      setModalVisible(true);

      // Clear saved answers upon successful submission
      await AsyncStorage.removeItem('savedAnswers');
  
    } catch (error) {
      console.error('Error submitting survey:', error.message);
      Alert.alert('Error', 'Error submitting survey response');
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigation.navigate('HomeTab');
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
                {selectedOptions[questionIndex] === option && (
                  <Icon name="check" size={20} color="green" style={styles.checkIcon} />
                )}
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

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Thanks for submitting your survey!</Text>
          <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#e0e0e0',
  },
  checkIcon: {
    marginRight: 10,
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

  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: 'maroon',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SurveyPage;
