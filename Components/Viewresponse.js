// ViewResponses.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title } from 'react-native-paper';
import axios from 'axios';
import { API_BASE_URL } from './config';
import { PieChart } from 'react-native-chart-kit';
import * as Animatable from 'react-native-animatable';

const ViewResponses = ({ route }) => {
  const { surveyId } = route.params;
  const [surveyTitle, setSurveyTitle] = useState('');
  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    fetchResponses();
  }, [surveyId]);

  const fetchResponses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/surveys/${surveyId}/responses`);
      const { surveyTitle, percentages } = response.data;
      setSurveyTitle(surveyTitle);
      setPercentages(percentages);
    } catch (error) {
      console.error('Error fetching survey responses:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Responses for {surveyTitle}</Text>
        {percentages.map((question, index) => {
          const data = Object.keys(question.percentages).map((option) => ({
            name: option,
            percentage: question.percentages[option],
            color: '#' + ((Math.random() * 0xffffff) << 0).toString(16), // Generate random color
          }));

          return (
            <Animatable.View key={question.question} animation="fadeInUp" delay={index * 100}>
              <Card style={styles.card}>
                <Card.Content>
                  <Title style={styles.questionText}>{question.question}</Title>
                  <PieChart
                    data={data}
                    width={300}
                    height={200}
                    chartConfig={{
                      backgroundColor: '#1cc910',
                      decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    }}
                    accessor="percentage"
                    backgroundColor="transparent"
                    paddingLeft="15"
                  />
                </Card.Content>
              </Card>
            </Animatable.View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ViewResponses;
