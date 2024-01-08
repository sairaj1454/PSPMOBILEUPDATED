import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from './topbar';
import { API_BASE_URL } from './config';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    // Get the user's token from AsyncStorage
    

    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');
    console.log(userId);
    
    axios.put(
      `${API_BASE_URL}/auth/updatepassword`,
      {
        currentPassword: currentPassword,
        newPassword: newPassword,
        userId: userId, // Make sure to include userId in the request body
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    // ...
    

      .then((response) => {
        if (response.status === 200) {
          Alert.alert('Success', 'Password changed successfully.');
          // Handle navigation or any other action upon successful password change
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to change password. Please try again.');
      });
  };

  return (
    <>
    <TopBar></TopBar>
    <View style={styles.container}>
      <Text style={styles.heading}>Change Password</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Current Password"
          placeholderTextColor="maroon"
          secureTextEntry
          onChangeText={(text) => setCurrentPassword(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="New Password"
          placeholderTextColor="maroon"
          secureTextEntry
          onChangeText={(text) => setNewPassword(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Confirm New Password"
          placeholderTextColor="maroon"
          secureTextEntry
          onChangeText={(text) => setConfirmNewPassword(text)}
        />
      </View>
      <Pressable style={styles.changePasswordBtn} onPress={handleChangePassword}>
        <Text style={styles.changePasswordText}>CHANGE PASSWORD</Text>
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
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
    marginBottom: 20,
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
  changePasswordBtn: {
    width: '80%',
    backgroundColor: 'maroon',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 10,
  },
  changePasswordText: {
    color: 'white',
  },
});

export default ChangePassword ;
