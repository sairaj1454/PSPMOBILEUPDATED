import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TopBar() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  useEffect(() => {
    
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsername();
  }, []);

  const handleProfilePress = () => {
    navigation.navigate('ProfileTab');
  };

  const handleChatWithAdmin = () => {
    
    navigation.navigate('ChatScreen', { username: 'admin@g.com' });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              navigation.navigate('Login');
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  


  return (
    <View style={styles.topBar}>
      <TouchableWithoutFeedback onPress={handleProfilePress}>
        <View style={styles.profileBar}>
          <Avatar.Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} size={50} />
          <Text style={styles.profileName}>{username}</Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.topBarIcons}>
       
        <TouchableWithoutFeedback onPress={handleChatWithAdmin}>
          <Icon name="email" size={30} color="gray" style={styles.icon} />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={handleLogout}>
          <Icon name="logout" size={30} color="gray" style={styles.icon} />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    elevation: 20,
    marginTop: 40,
  },
  profileBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    color: 'gray',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  topBarIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
    color: 'gray',
  },
});

export default TopBar;
