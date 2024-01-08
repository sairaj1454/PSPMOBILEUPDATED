// TeamLeadSignupScreen.js

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from './config';

const TeamLeadSignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLeadSignup = () => {
    // Validate input fields
    if (!username || !email || !employeeId || !password) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    // Validate employee ID to contain only numbers
    if (!/^[0-9]+$/.test(employeeId)) {
      Alert.alert('Error', 'Employee ID should only contain numbers.');
      return;
    }

    axios
      .post(`${API_BASE_URL}/auth/teamleadsignup`, { username, email, employeeId, password })
      .then((response) => {
        console.log(response.data.message);
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Username"
          placeholderTextColor="maroon"
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          placeholderTextColor="maroon"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Employee ID"
          placeholderTextColor="maroon"
          onChangeText={(text) => setEmployeeId(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Password"
          placeholderTextColor="maroon"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Pressable style={styles.signupBtn} onPress={handleLeadSignup}>
        {({ pressed }) => (
          <Text style={[styles.signupText, { opacity: pressed ? 0.6 : 1 }]}>SIGN UP</Text>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    elevation: 10,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'blue',
  },
  signupBtn: {
    width: '80%',
    backgroundColor: 'maroon',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 10,
  },
  signupText: {
    color: 'white',
  },
});

export default TeamLeadSignupScreen;
