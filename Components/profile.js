

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ActivityIndicator, Card, Paragraph, Text, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';

import axios from 'axios';
import { API_BASE_URL } from './config';
import TopBar from './topbar';
import { useNavigation } from '@react-navigation/native';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const goToPasswordPage = () => {
    navigation.navigate('password');
  };

  const fetchProfileData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        setProfileData(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} color="maroon" />
      </View>
    );
  }

  if (!profileData) {
    
    return (
      <View style={styles.container}>
        <Text>Error fetching profile data</Text>
      </View>
    );
  }

  return (
    <>
      <TopBar />
      <View style={styles.container}>
        {/* Profile Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv4qNp55mfP_MT7WILhS1jIBMy_FuMVz_N1w&usqp=CAU' }} style={styles.avatar} />
        </View>

        {/* Profile Details Card */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>User Profile</Text>

            {/* Username Text Input */}
            <TextInput
              label="Username"
              value={profileData.username}
              mode="outlined"
              editable={false}
              style={styles.textInput}
            />

            {/* Employee ID Text Input */}
            <TextInput
              label="Employee ID"
              value={profileData.employeeId}
              mode="outlined"
              editable={false}
              style={styles.textInput}
            />

            {/* Email Text Input */}
            <TextInput
              label="Email"
              value={profileData.email}
              mode="outlined"
              editable={false}
              style={styles.textInput}
            />

            {/* Role Text Input */}
            <TextInput
  label="Role"
  value={profileData.role === 'user' ? 'Employee' : profileData.role}
  mode="outlined"
  editable={false}
  style={styles.textInput}
/>


           
          </Card.Content>
        </Card>

     
        <TouchableOpacity onPress={goToPasswordPage} style={styles.button}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '80%',
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin:10,
  },
  textInput: {
    marginTop: 8,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 20,
    backgroundColor: 'maroon',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ProfilePage;
