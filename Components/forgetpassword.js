import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from './config';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('email'); 

  const handleForgotPassword = async () => {
    try {
    
      const response = await axios.post('http://10.113.34.148:3000/auth/forgot-password', { email });
      if (response.status === 200) {
        setStep('otp');
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    try {
     
      const response = await axios.post('http://10.113.34.148:3000/auth/verify-otp', { email, otp });
      if (response.status === 200) {
        setStep('reset');
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    }
  };

  const handleResetPassword = async () => {
    try {
    
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match. Please try again.');
        return;
      }

      const response = await axios.post('http://10.113.34.120:3000/auth/reset-password', { email, newPassword });
      if (response.status === 200) {
        Alert.alert('Success', 'Password reset successfully.');
        navigation.navigate('Login'); 
      } else {
        Alert.alert('Error', 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {step === 'email' && (
        <>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
          />
          <Pressable style={styles.button} onPress={handleForgotPassword}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </Pressable>
        </>
      )}
      {step === 'otp' && (
        <>
          <Text style={styles.title}>Verify OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="OTP"
            onChangeText={setOtp}
            value={otp}
          />
          <Pressable style={styles.button} onPress={handleVerifyOTP}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </Pressable>
        </>
      )}
      {step === 'reset' && (
        <>
          <Text style={styles.title}>Reset Password</Text>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry
          />
          <Pressable style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: 'maroon',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
