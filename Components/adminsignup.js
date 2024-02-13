import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_BASE_URL } from './config';

const AdminSignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleAdminSignup = () => {
    if (!email || !password) {
    
      alert('Please enter both email and password.');
      return;
    }

    axios
      .post(`${API_BASE_URL}/auth/adminsignup`, { username: email, password })
      .then((response) => {
        console.log(response.data.message);
       
        navigation.navigate('Login'); 
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleTeamleadSignups=()=>{
    navigation.navigate('LeadSignup')
  }
 

  return (
    <>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{
            uri: 'https://indiawfm.perficient.com/images/logo-md.png',
          }}
        />

        <Text style={styles.logo}>Admin Sign Up</Text>
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
            placeholder="Password"
            placeholderTextColor="maroon"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <Pressable style={styles.signupBtn} onPress={handleAdminSignup}>
          {({ pressed }) => (
            <Text style={[styles.signupText, { opacity: pressed ? 0.6 : 1 }]}>
              ADMIN SIGN UP
            </Text>

          )}
        </Pressable>
       
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 220,
    height: 200,
    margin: 20,
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

export default AdminSignupScreen;
