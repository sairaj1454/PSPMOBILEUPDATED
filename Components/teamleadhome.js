import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView, 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Card } from 'react-native-paper'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from './profile';
import ImageSliderWithText from './imageslider';
import Challenges from './challenges';
import TopBar from './topbar';
import SuggestionsPage from './suggestions';
import Createsurvey from './createsurvey';
import Adminpannel from './adminpannel';
import TeamLeadPannel from './Teamleadpannel';
const Tab = createBottomTabNavigator();

export default function TeamLeadHome() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'maroon',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 14,
        },
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: 'lightgray',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="account" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="createsurvey"
        component={ChallengesScreen}
        options={{
          tabBarLabel: 'Take Surveys',
          tabBarIcon: ({ color, size }) => {
            return       <Icon name="file-plus" size={size} color={color} />; 
            ;
          },
        }}
      />
      <Tab.Screen
        name="StatisticsTab"
        component={StatisticsScreen}
        options={{
          tabBarLabel: 'Lead Pannel',
          tabBarIcon: ({ color, size }) => {
            return<Icon name="shield-account" size={size} color={color} />;
            ;
          },
        }}
      />
    </Tab.Navigator>
  );
}

function HomeScreen() {
    const navigation = useNavigation();
 

  

    const handleCreatesurveyButtonPress = () => {
      navigation.navigate('createsurvey');
    }; 
    const handleCreatesurveyButtonPresss = () => {
      navigation.navigate('StatisticsTab');
    }; 
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView style={styles.safeArea}>
            <TopBar />
            <Text style={styles.h}>PSP Team Lead  Portal</Text>
    <ImageSliderWithText></ImageSliderWithText>
           
            <View>
              <Card style={styles.containerBox}>
                <Card.Content>
                  <Text style={styles.containerBoxText}>
                  Welcome to the Survey section. Are you ready to take on the Survey?
                  </Text>
                  <TouchableWithoutFeedback onPress={handleCreatesurveyButtonPress} >
                    <View style={styles.customButton}>
                      <Text style={styles.customButtonText}>Take Surveys</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </Card.Content>
              </Card>
            </View>
    
            <View>
              <Card style={styles.containerBox}>
                <Card.Content>
                  <Text style={styles.containerBoxText}>
                    View employee submissions and responses here.
                  </Text>
                  <TouchableWithoutFeedback onPress={handleCreatesurveyButtonPresss}>
                    <View style={styles.customButton}>
                      <Text style={styles.customButtonText}>View Submissions</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </Card.Content>
              </Card>
            </View>
          </SafeAreaView>
        </ScrollView>
      );
    }



function ProfileScreen() {
  return (
    <Profile />
  );
}

function ChallengesScreen() {
  return (
    <Challenges></Challenges>
   );
 }


function StatisticsScreen() {
  return (
   <TeamLeadPannel></TeamLeadPannel>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading:{
fontSize:20,
fontWeight: 'bold',
margin:5,
elevation:20,
color:'gray',
textAlign:'center',
  },
  
  
  h:{
margin:10,

marginTop:15,
textAlign:'center',
fontSize:25,
fontWeight:'bold',
color:'gray',
  },
  
  containerBox: {
    backgroundColor: 'white',
    margin: 10,
    marginTop:30,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },

  containerBoxText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },

  customButton: {
    backgroundColor: 'maroon',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },

  customButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  additionalContent: {
    marginTop: 20,
  },
  additionalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'gray',
  },
  additionalText: {
    fontSize: 16,
    color:'gray',
  },
  additionalContentCard: {
    margin: 10,
    marginTop: 20,
    borderRadius: 10,
    elevation: 20,
    backgroundColor:'white',
    
  },
});
