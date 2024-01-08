import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Image, StyleSheet, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

const LoginScreen = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      navigation.navigate('Home');
    }
  };

  const handleLogin = async () => {
    if (!identifier || !password) {
      setSnackbarVisible(true);
    } else {
      setLoading(true);

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          username: identifier,
          employeeId: identifier,
          password,
        });

        if (response.status === 200) {
          const { role, username, userId, token } = response.data;

          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('userId', userId);
          await AsyncStorage.setItem('role', role);
          await AsyncStorage.setItem('username', username);

          console.log(`Logged in as ${username} with ID ${userId} and role ${role}`);

          if (role === 'admin') {
            navigation.navigate('Adminhome');
          } else if (role === 'user') {
            navigation.navigate('Home');
          } else if (role === 'teamlead') {
            navigation.navigate('TeamLeadHome');
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Invalid credentials. Please enter valid details.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSignup = () => {
    navigation.navigate('adminsignup');
  };

  const onDismissSnackbar = () => {
    setSnackbarVisible(false);
  };

  return (
    
   
      <View style={styles.container}>
        <Image
          style={styles.imagee}
          source={{
            uri: 'https://blogs.perficient.com/files/graham-PoP-blog-1-276x204.png',
          }}
        />

        <Text style={styles.logo}>Login</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Username/Employee ID"
            placeholderTextColor="maroon"
            onChangeText={(text) => setIdentifier(text)}
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
        <Pressable
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </Pressable>

        <Text style={styles.link} onPress={handleSignup}>
          Don't have an account? Sign up here
        </Text>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={onDismissSnackbar}
          duration={3000}
          action={{
            label: 'OK',
            onPress: onDismissSnackbar,
          }}
        >
          Please enter both email/employee ID and password.
        </Snackbar>
      </View>
  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    margin: 5,
    padding: 5,
    fontSize: 15,
    color: 'maroon',
    fontWeight: 'bold',
  },
  imagee: {
    width: 220,
    height: 200,
    margin: 20,
    borderRadius: 100,
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'black',
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
  loginBtn: {
    width: '80%',
    backgroundColor: 'maroon',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 10,
  },
  loginText: {
    color: 'white',
  },
  
});

export default LoginScreen;