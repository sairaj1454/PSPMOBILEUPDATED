import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView, // Import ScrollView component
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Card } from 'react-native-paper'; // Import Card component from react-native-paper
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Profile from './profile';
import ImageSliderWithText from './imageslider';
import Challenges from './challenges';
import TopBar from './topbar';
import SuggestionsPage from './suggestions';
import Createsurvey from './createsurvey';
import Adminpannel from './adminpannel';
import SignupScreen from './Signup';
const Tab = createBottomTabNavigator();

export default function Adminhomeome() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'maroon',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 15,
        },
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: 'lightgray',
        },
      }}
    >
      <Tab.Screen
        name="HomeTabo"
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
          tabBarLabel: 'User M',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="account" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="createsurvey"
        component={ChallengesScreen}
        options={{
          tabBarLabel: 'Create Surveys',
          tabBarIcon: ({ color, size }) => {
            return       <Icon name="file-plus" size={size} color={color} />; {/* Use "clipboard-text" for a survey icon */}
            ;
          },
        }}
      />
      <Tab.Screen
        name="StatisticsTab"
        component={StatisticsScreen}
        options={{
          tabBarLabel: 'Admin Pannel',
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
    const SP = () => {
      navigation.navigate('Submissions');
    }; 
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <SafeAreaView style={styles.safeArea}>
            <TopBar />
            <Text style={styles.h}>PSP Admin Portal</Text>
    <ImageSliderWithText></ImageSliderWithText>
           
            <View>
              <Card style={styles.containerBox}>
                <Card.Content>
                  <Text style={styles.containerBoxText}>
                    Welcome to the admin portal. You can create and manage surveys here.
                  </Text>
                  <TouchableWithoutFeedback onPress={handleCreatesurveyButtonPress} >
                    <View style={styles.customButton}>
                      <Text style={styles.customButtonText}>Create Surveys</Text>
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
                  <TouchableWithoutFeedback  onPress={SP}>
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
    <SignupScreen></SignupScreen>
  );
}

function ChallengesScreen() {
  return (
   <Createsurvey></Createsurvey>
  );
}

function StatisticsScreen() {
  return (
    <Adminpannel></Adminpannel>
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
    marginTop: 20, // Adjust the margin as needed
    borderRadius: 10,
    elevation: 20,
    backgroundColor:'white',
     // Reduce the elevation if needed
  },
});
