import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Card, Icon, Button } from 'react-native-elements';
import TopBar from './topbar';
import { useNavigation } from '@react-navigation/native';

const CreateSurveyPage = () => {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const navigation = useNavigation();

  const handleAnswerChange = (text, questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answer = text;
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = (questionType) => {
    if (questionType === 'overallRating') {
      setQuestions([
        ...questions,
        {
          question: 'Overall Rating:',
          type: 'mcq',
          options: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
          answer: '',
        },
      ]);
    } else {
      setQuestions([
        ...questions,
        {
          question: '',
          type: questionType === 'mcq' ? 'mcq' : 'text',
          options: questionType === 'mcq' ? ['', ''] : [],
          answer: '',
        },
      ]);
    }
  };

  const handleDeleteQuestion = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(questionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const renderQuestionInputs = () => {
    return questions.map((question, questionIndex) => (
      <Card key={questionIndex} containerStyle={styles.cardContainer}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionText}>Question {questionIndex + 1}:</Text>
          <Icon
            name="delete"
            type="material"
            size={24}
            color="red"
            onPress={() => handleDeleteQuestion(questionIndex)}
          />
        </View>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter question"
          value={question.question}
          onChangeText={(text) => handleQuestionChange(text, questionIndex)}
        />
        {question.type === 'mcq' && (
          <View>
            {question.options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={styles.optionContainer}
                onPress={() => handleAnswerChange(option, questionIndex)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Card>
    ));
  };

  const handleQuestionChange = (text, questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].question = text;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (text, questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = text;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].type === 'mcq') {
      updatedQuestions[questionIndex].options.push('');
      setQuestions(updatedQuestions);
    }
  };

  const handleNextPress = () => {
    if (!surveyTitle.trim()) {
      Alert.alert('Error', 'Please enter a survey title.');
    } else if (questions.length === 0 || !questions.some(q => q.question.trim())) {
      Alert.alert('Error', 'Please add at least one question.');
    } else {
      navigation.navigate('SelectUsers', { surveyTitle, questions });
    }
  };

  return (
    <>
      <TopBar />
      <ScrollView style={styles.container}>
        <Text style={styles.titleText}>Survey Title:</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Enter survey title"
          value={surveyTitle}
          onChangeText={(text) => setSurveyTitle(text)}
        />
        {renderQuestionInputs()}
        <Button
          icon={<Icon name="add" size={24} color="white" />}
          title="Add Text Question"
          onPress={() => handleAddQuestion('text')}
          containerStyle={styles.addButtonContainer}
          buttonStyle={styles.addButton}
          titleStyle={styles.addButtonTitle}
        />
        <Button
          icon={<Icon name="add" size={24} color="white" />}
          title="Add MCQ Question"
          onPress={() => handleAddQuestion('mcq')}
          containerStyle={styles.addButtonContainer}
          buttonStyle={styles.addButton}
          titleStyle={styles.addButtonTitle}
        />
        <Button
          icon={<Icon name="add" size={24} color="white" />}
          title="Add Overall Rating Question"
          onPress={() => handleAddQuestion('overallRating')}
          containerStyle={styles.addButtonContainer}
          buttonStyle={styles.addButton}
          titleStyle={styles.addButtonTitle}
        />
        <TouchableOpacity
          style={styles.customNextButton}
          onPress={handleNextPress}
        >
          <Text style={styles.customButtonText}>Next: Select Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customNextButton}
          onPress={() => navigation.navigate('SavedSurveys')}
        >
          <Text style={styles.customButtonText}>Saved Surveys</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  addButtonContainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  addButton: {
    backgroundColor: 'maroon',
    borderRadius: 5,
  },
  addButtonTitle: {
    marginLeft: 5,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContainer: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 2,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  titleInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  questionText: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  customNextButton: {
    backgroundColor: 'maroon',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  customButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CreateSurveyPage;
