import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from './config';
import TopBar from './topbar';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleInputChange = (field, value) => {
    switch (field) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'employeeId':
        setEmployeeId(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSignup = () => {
    // Validate input fields
    if (!username || !email || !employeeId || !password) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    // Validate username to contain only alphabets
    if (!/^[a-zA-Z]+$/.test(username)) {
      Alert.alert('Error', 'Username should only contain alphabets.');
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
      .post(`${API_BASE_URL}/auth/signup`, { username, email, employeeId, password })
      .then((response) => {
        Alert.alert('Success', response.data.message, [
          {
            text: 'OK',
            onPress: () => {
              // Reset the input fields
              handleInputChange('username', '');
              handleInputChange('email', '');
              handleInputChange('employeeId', '');
              handleInputChange('password', '');
            },
          },
        ]);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'There was an error creating the user. Please try again.');
      });
  };

  const handleTeamleadSignups = () => {
    navigation.navigate('adminsignup');
  };

  const isValidEmail = (email) => {
    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <TopBar />
      <View style={styles.container}>
        <Text style={styles.logo}>Create Employee</Text>
        <View key="username" style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Username"
            placeholderTextColor="maroon"
            onChangeText={(text) => handleInputChange('username', text)}
            value={username}
          />
        </View>
        <View key="email" style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            placeholderTextColor="maroon"
            onChangeText={(text) => handleInputChange('email', text)}
            value={email}
          />
        </View>
        <View key="employeeId" style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Employee ID"
            placeholderTextColor="maroon"
            onChangeText={(text) => handleInputChange('employeeId', text)}
            value={employeeId}
          />
        </View>
        <View key="password" style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Password"
            placeholderTextColor="maroon"
            secureTextEntry
            onChangeText={(text) => handleInputChange('password', text)}
            value={password}
          />
        </View>
        <Pressable style={styles.signupBtn} onPress={handleSignup}>
          {({ pressed }) => (
            <Text style={[styles.signupText, { opacity: pressed ? 0.6 : 1 }]}>Create</Text>
          )}
        </Pressable>
        <Text style={styles.link} onPress={handleTeamleadSignups}>
          Create Admin?
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    marginTop:100,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'maroon',
    marginBottom: 20,
    elevation: 10,
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
    fontSize: 20,
  },
  link: {
    margin: 5,
    padding: 5,
    fontSize: 15,
    color: 'maroon',
    fontWeight: 'bold',
  },
});

export default SignupScreen;
