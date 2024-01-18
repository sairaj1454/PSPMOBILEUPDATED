import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TopBar from './topbar';
import { API_BASE_URL } from './config';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const showSuccessDialog = (message, callback) => {
    Alert.alert('Success', message, [
      {
        text: 'OK',
        onPress: callback,
      },
    ]);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    const userId = await AsyncStorage.getItem('userId');

    axios.put(
      `${API_BASE_URL}/auth/updatepassword`,
      {
        currentPassword: currentPassword,
        newPassword: newPassword,
        userId: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.status === 200) {
          showSuccessDialog('Password changed successfully.', () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            navigation.navigate('ProfileTab');
          });
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to change password. Please try again.');
      });
  };

  return (
    <>
      <TopBar />
      <View style={styles.container}>
        <Text style={styles.heading}>Change Password</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Current Password"
            placeholderTextColor="maroon"
            secureTextEntry
            onChangeText={(text) => setCurrentPassword(text)}
            value={currentPassword}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="New Password"
            placeholderTextColor="maroon"
            secureTextEntry
            onChangeText={(text) => setNewPassword(text)}
            value={newPassword}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Confirm New Password"
            placeholderTextColor="maroon"
            secureTextEntry
            onChangeText={(text) => setConfirmNewPassword(text)}
            value={confirmNewPassword}
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

export default ChangePassword;
