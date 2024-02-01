import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';
import { API_BASE_URL } from './config';
import TopBar from './topbar';

const SavedSurveysPage = ({ navigation }) => {
  const [savedSurveys, setSavedSurveys] = useState([]);
  const { width } = Dimensions.get('window');

  const [visibleQuestions, setVisibleQuestions] = useState({});
  const [editedSurveyTitle, setEditedSurveyTitle] = useState('');
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedOptions, setEditedOptions] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);
  const [isTitleModalVisible, setIsTitleModalVisible] = useState(false);
  const [isQuestionModalVisible, setIsQuestionModalVisible] = useState(false);

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

  const toggleQuestionsVisibility = (surveyId) => {
    setVisibleQuestions((prevState) => ({
      ...prevState,
      [surveyId]: !prevState[surveyId],
    }));
  };

  const handleEditSurveyTitle = (surveyId, currentTitle) => {
    setSelectedSurveyId(surveyId);
    setEditedSurveyTitle(currentTitle);
    setIsTitleModalVisible(true);
  };

  const handleSaveEditedTitle = async (surveyId) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/savedsurveys/${surveyId}`, {
        title: editedSurveyTitle,
      });

      setSavedSurveys((prevSurveys) =>
        prevSurveys.map((survey) =>
          survey._id === surveyId ? { ...survey, title: editedSurveyTitle } : survey
        )
      );

      setIsTitleModalVisible(false);
    } catch (error) {
      console.error('Error updating survey title:', error.message);
    }
  };

  const handleEditQuestion = (surveyId, questionIndex) => {
    const survey = savedSurveys.find((survey) => survey._id === surveyId);
    const question = survey.questions[questionIndex];

    setSelectedSurveyId(surveyId);
    setSelectedQuestionIndex(questionIndex);
    setEditedQuestion(question.question);
    setEditedOptions(question.options);
    setIsQuestionModalVisible(true);
  };

  const handleSaveEditedQuestion = async () => {
    try {
      const updatedQuestions = savedSurveys
        .find((survey) => survey._id === selectedSurveyId)
        .questions.map((question, index) =>
          index === selectedQuestionIndex
            ? { ...question, question: editedQuestion, options: editedOptions }
            : question
        );

      await axios.put(`${API_BASE_URL}/admin/savedsurveys/${selectedSurveyId}`, {
        questions: updatedQuestions,
      });

      setSavedSurveys((prevSurveys) =>
        prevSurveys.map((survey) =>
          survey._id === selectedSurveyId
            ? { ...survey, questions: updatedQuestions }
            : survey
        )
      );

      setIsQuestionModalVisible(false);
    } catch (error) {
      console.error('Error updating question:', error.message);
    }
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
                    <TouchableOpacity
                      style={styles.editQuestionButton}
                      onPress={() => handleEditQuestion(item._id, qIndex)}>
                      <Text style={styles.editQuestionButtonText}>Edit Question</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              <TouchableOpacity
                style={styles.viewQuestionsButton}
                onPress={() => toggleQuestionsVisibility(item._id)}>
                <Text style={styles.viewQuestionsButtonText}>
                  {visibleQuestions[item._id] ? 'Hide Questions' : 'View Questions'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editTitleButton}
                onPress={() => handleEditSurveyTitle(item._id, item.title)}>
                <Text style={styles.editTitleButtonText}>Edit Title</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => handleAssignSurvey(item._id, item.title, item.questions)}>
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal isVisible={isTitleModalVisible} onBackdropPress={() => setIsTitleModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Survey Title</Text>
          <TextInput
            style={styles.modalInput}
            value={editedSurveyTitle}
            onChangeText={(text) => setEditedSurveyTitle(text)}
          />
          <TouchableOpacity
            style={styles.saveTitleButton}
            onPress={() => handleSaveEditedTitle(selectedSurveyId)}>
            <Text style={styles.saveTitleButtonText}>Save Title</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        isVisible={isQuestionModalVisible}
        onBackdropPress={() => setIsQuestionModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Question</Text>
          <TextInput
            style={styles.modalInput}
            value={editedQuestion}
            onChangeText={(text) => setEditedQuestion(text)}
          />
          {/* Assuming editedOptions is an array of option strings */}
          {editedOptions.map((option, index) => (
            <TextInput
              key={index}
              style={styles.modalInput}
              value={option}
              onChangeText={(text) => {
                const updatedOptions = [...editedOptions];
                updatedOptions[index] = text;
                setEditedOptions(updatedOptions);
              }}
            />
          ))}
          <TouchableOpacity
            style={styles.saveTitleButton}
            onPress={handleSaveEditedQuestion}>
            <Text style={styles.saveTitleButtonText}>Save Question</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },  editTitleButton: {
    backgroundColor: 'gray',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    width:"50%",
  },editQuestionButton: {
    backgroundColor: 'gray',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  editQuestionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  saveTitleButton: {
    backgroundColor: 'maroon',
    padding: 10,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  saveTitleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editTitleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveTitleButton: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  saveTitleButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  }, modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});

export default SavedSurveysPage;
