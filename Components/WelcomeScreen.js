import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  useEffect(() => {
   
    const timeout = setTimeout(() => {
      navigation.navigate('Login');
    }, 5000); 

    return () => clearTimeout(timeout); 
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://mms.businesswire.com/media/20200617005355/en/775481/22/Perficient_Logo.jpg' }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay}>
        <Animatable.Text animation="fadeInDown" style={styles.title}>
          Welcome to the PSP App
        </Animatable.Text>
        <Animatable.Text animation="fadeInUp" style={styles.subtitle}>
          Perficient Survey Portal
        </Animatable.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
  },
});

export default WelcomeScreen;
