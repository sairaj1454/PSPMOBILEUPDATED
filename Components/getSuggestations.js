import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import TopBar from './topbar';
import { API_BASE_URL } from './config';

const SPage = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-suggestions`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        console.error('Error fetching suggestions');
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const renderSuggestionItem = ({ item }) => (
    <TouchableOpacity style={styles.suggestionItem}>
      <Text style={styles.suggestionText}>{item.content}</Text>
      <FontAwesome name="thumbs-up" size={20} color="#4CAF50" style={styles.likeIcon} />
    </TouchableOpacity>
  );

  return (
    <>
      <TopBar />
      <View style={styles.container}>
        <Text style={styles.header}>Employee Suggestions</Text>
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item._id}
          renderItem={renderSuggestionItem}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  suggestionItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionText: {
    flex: 1,
    marginRight: 10,
  },
  likeIcon: {
    marginLeft: 10,
  },
});

export default SPage;
