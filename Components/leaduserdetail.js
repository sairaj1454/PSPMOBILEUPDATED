// ... (existing imports)
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView,Alert } from 'react-native';
import { Button, Card, Title, Paragraph, IconButton } from 'react-native-paper'; // Importing React Native Paper components
import axios from 'axios';
import { API_BASE_URL } from './config';
import { Rating } from 'react-native-ratings'; 

const LUserDetail = ({ route }) => {
  const { username } = route.params;
  const [userDetails, setUserDetails] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5); // Default rating

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/userdetails/${username}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [username]);

  const hasUserSubmittedReview = (surveyTitle) => {
    return userDetails.surveyResponses.some(
      (response) => response.surveyTitle === surveyTitle && response.reviews.length > 0
    );
  };

  const submitReview = async (surveyTitle, reviewText, rating) => {
    try {
      if (hasUserSubmittedReview(surveyTitle)) {
        console.error('User has already submitted a review for this survey.');
        return;
      }
  
      await axios.post(`${API_BASE_URL}/submitreview`, {
        username: userDetails.username,
        surveyTitle,
        review: {
          reviewText,
          rating,
        },
      });
  
      fetchUserDetails();
      setReviewText('');
      setRating(5); // Set default rating for the next review
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const deleteReview = async (surveyTitle) => {
    try {
      Alert.alert(
        'Delete Review',
        'Are you sure you want to delete this review?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              await axios.post(`${API_BASE_URL}/deletereview`, {
                username: userDetails.username,
                surveyTitle,
              });
  
              fetchUserDetails();
            },
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };
  if (!userDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.heading}>User Details</Text>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>{userDetails.username}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Employee ID:</Text>
            <Text style={styles.value}>{userDetails.employeeId}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{userDetails.email}</Text>
          </View>
        </Card.Content>
      </Card>
  
      <Text style={styles.heading}>Survey Responses:</Text>
  
      {userDetails.surveyResponses.length === 0 ? (
        <Text style={styles.noSurveyResponseText}>No survey responses available ⚠️.</Text>
      ) : (
        userDetails.surveyResponses.map((response, index) => (
          <Card key={index} style={styles.responseContainer}>
            <Card.Content>
              <Title>{response.surveyTitle}</Title>
  
              {/* Displaying question and answer without DataTable */}
              {response.responses.map((answer, answerIndex) => (
                <View key={answerIndex} style={styles.questionAnswerContainer}>
                  <Text style={styles.questionText}>{answer.question}</Text>
                  <Text style={styles.answerText}>{answer.answer}</Text>
                </View>
              ))}
  
              <Title>Reviews:</Title>
              {response.reviews.map((review, reviewIndex) => (
                <View key={reviewIndex} style={styles.reviewContainer}>
                  <Paragraph>
                    Review: {review.reviewText} {'\n'} 
                    Rating: {review.rating}
                  </Paragraph>
                  <Rating
                    type="star"
                    ratingCount={5}
                    imageSize={20}
                    startingValue={review.rating}
                    readonly
                  />
                  <IconButton
                    icon="delete"
                    color="red"
                    size={20}
                    onPress={() => deleteReview(response.surveyTitle)}
                  />
                </View>
              ))}
  
              {!hasUserSubmittedReview(response.surveyTitle) && (
                <>
                  <TextInput
                    placeholder="Enter your review"
                    value={reviewText}
                    onChangeText={(text) => setReviewText(text)}
                  />
                <Rating
  type="star"
  ratingCount={5}
  imageSize={30}
  startingValue={rating}
  onFinishRating={(selectedRating) => setRating(selectedRating)}
  style={{
    paddingVertical: 10,
    backgroundColor: 'lightgray', // Change background color
    borderRadius: 10, // Add border radius
  }}
  ratingColor="gold" // Change color of selected stars
  ratingBackgroundColor="white" // Change color of unselected stars
  tintColor="lightgray" // Change color of the entire component
/>

                  <Button
                    mode="contained"
                    onPress={() => submitReview(response.surveyTitle, reviewText, rating)}
                    style={styles.maroonButton}
                  >
                    Submit Review
                  </Button>
                </>
              )}
            </Card.Content>
          </Card>
        ))
      )}
    </ScrollView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  noSurveyResponseText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontWeight:'bold',
    color:'red',
  },
  card: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    marginLeft: 10,
  },
  responseContainer: {
    marginVertical: 10,
  },
  reviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  maroonButton: {
    marginTop: 10,
    backgroundColor: 'maroon', // Specify maroon color here
  },
  questionAnswerContainer: {
    marginBottom: 10,
  },
  questionText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answerText: {
    marginLeft: 10,
  },
});

export default LUserDetail;
