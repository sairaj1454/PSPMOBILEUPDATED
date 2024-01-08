import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import TopBar from './topbar';
import { API_BASE_URL } from './config';

const SuggestionsPage = () => {
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSuggestionChange = (text) => {
    setSuggestion(text);
  };

  const handleSubmitSuggestion = async () => {
    try {
      setSubmitting(true);
  
      // Make a POST request to the backend with the suggestion content
      const response = await fetch(`${API_BASE_URL}/submit-suggestion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: suggestion }),
      });
  
      if (response.ok) {
        // Suggestion submitted successfully, clear the text input
        setSuggestion('');
        // Show an alert indicating successful submission
        alert('Suggestion submitted successfully');
      } else {
        console.error('Error submitting suggestion');
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  
  return (
    <>
      <TopBar />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>Submit Your Suggestion</Text>
          <TextInput
            style={styles.input}
            placeholder="Your suggestion..."
            onChangeText={handleSuggestionChange}
            multiline={true}
          />
          <TouchableOpacity
            style={[styles.customButton, submitting && styles.disabledButton]}
            onPress={handleSubmitSuggestion}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Submitting...' : 'Submit Suggestion'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.suggestionText}>
          We value your suggestions. Please feel free to share your thoughts with us.
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    width:'100%',
    borderRadius: 10,
    elevation: 3, // Add elevation for a raised effect
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    marginBottom: 20,
  },
  customButton: {
    backgroundColor: 'maroon',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'gray', // Change the button color when disabled
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SuggestionsPage;
