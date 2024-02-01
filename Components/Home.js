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
import SurveyList from './challenges';
const Tab = createBottomTabNavigator();

export default function Home() {
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
        name="ChallengesTab"
        component={ChallengesScreen}
        options={{
          tabBarLabel: 'Surveys',
          tabBarIcon: ({ color, size }) => {
            return       <Icon name="clipboard-text" size={size} color={color} />; {/* Use "clipboard-text" for a survey icon */}
            ;
          },
        }}
      />
      <Tab.Screen
        name="StatisticsTab"
        component={StatisticsScreen}
        options={{
          tabBarLabel: 'Drop Box',
          tabBarIcon: ({ color, size }) => {
            return<Icon name="briefcase" size={size} color={color} />;
            ;
          },
        }}
      />
    </Tab.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
 

  

  const handleChallengesButtonPress = () => {
    navigation.navigate('ChallengesTab');
  };

  const  handleViewTeamDetailsPress = () => {
    navigation.navigate('TeamDetails');
  };
  const  handleApplyLeave = () => {
    navigation.navigate('applyleave');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <SafeAreaView style={styles.safeArea}>
      <TopBar  ></TopBar>
      <View>
        <ImageSliderWithText />
      </View>
      <View style={styles.containerBox}>
        <Text style={styles.containerBoxText}>
          Welcome to the Survey section. Are you ready to take on the Survey?
        </Text>
        <TouchableWithoutFeedback onPress={handleChallengesButtonPress}>
          <View style={styles.customButton}>
            <Text style={styles.customButtonText}>Fill Surveys</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Card style={styles.additionalContentCard}>
          <Card.Content>
            <Text style={styles.additionalHeaderText}>Team Details:</Text>
            <Text style={styles.additionalText}>
              - Explore details about your team members.
            </Text>
            <TouchableWithoutFeedback onPress={handleViewTeamDetailsPress}>
              <View style={styles.customButton}>
                <Text style={styles.customButtonText}>View Team Details</Text>
              </View>
            </TouchableWithoutFeedback>
          </Card.Content>
        </Card>
        <Card style={styles.additionalContentCard}>
          <Card.Content>
            <Text style={styles.additionalHeaderText}>Absense Management:</Text>
            <Text style={styles.additionalText}>
              - Explore details about your Leaves.
            </Text>
            <TouchableWithoutFeedback onPress={handleApplyLeave}>
              <View style={styles.customButton}>
                <Text style={styles.customButtonText}>Apply Leave</Text>
              </View>
            </TouchableWithoutFeedback>
          </Card.Content>
        </Card>
      {/* Wrap the additional content in a Card */}
      <Card style={styles.additionalContentCard}>
        <Card.Content>
          <Text style={styles.additionalHeaderText}>Additional Information:</Text>
          <Text style={styles.additionalText}>
            - Surveys should be completed within the specified deadlines.
          </Text>
          <Text style={styles.additionalText}>
            - Your feedback is important to us. It helps us improve our services.
          </Text>
          <Text style={styles.additionalText}>
            - If you have any questions or issues, please contact the HR department.
          </Text>
        </Card.Content>
      </Card>

      
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
    <SuggestionsPage></SuggestionsPage>
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
