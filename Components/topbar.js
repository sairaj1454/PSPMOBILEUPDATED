import React from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Avatar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

function TopBar() {
  const navigation = useNavigation();

  const handleProfilePress = () => {
    navigation.navigate('ProfileTab');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Corrected key to 'token'
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.topBar}>
      <TouchableWithoutFeedback onPress={handleProfilePress}>
        <View style={styles.profileBar}>
          <Avatar.Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} size={50} />
          <Text style={styles.profileName}>Sai Raj</Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.topBarIcons}>
        <Icon name="email" size={30} color="gray" style={styles.icon} />
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
