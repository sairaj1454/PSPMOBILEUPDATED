import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import SurveyPage from './Components/survey';
import Login from './Components/login';
import Home from './Components/Home'
import SignupScreen from './Components/Signup';
import WelcomeScreen from './Components/WelcomeScreen';
import AdminSignupScreen from './Components/adminsignup';
import Adminhome from './Components/adminhome';
import TeamLeadSignupScreen from './Components/teamleadsignup';
import TeamLeadHome from './Components/teamleadhome';
import UserDetailsScreen from './Components/adminusermanagement';
import LUserDetail from './Components/leaduserdetail';
import ViewSurveys from './Components/ViewSurveys';
import ViewResponses from './Components/Viewresponse';
import SelectUsersPage from './Components/userselection';
import SavedSurveysPage from './Components/savedsurveys';
import ChangePassword from './Components/changepassword';
import SPage from './Components/getSuggestations';
import TeamD from './Components/Teamdetails';
import ChatScreen from './Components/chat';
import LeaveManagementScreen from './Components/userleavemanagement';
import LeaveCalendarScreen from './Components/userleavepage';
import LeaveApproveScreen from './Components/Teamleadleaveapprove';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      
      <Stack.Navigator initialRouteName="Welcome"  >
      <Stack.Screen name="SurveyPage" component={SurveyPage} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{
    header: () => null, 
  }}/>
       <Stack.Screen
  name="Home"
  component={Home}
  options={{
    header: () => null, // This will hide the entire header component
  }}
/>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="leave" component={LeaveManagementScreen} />
        <Stack.Screen name="applyleave" component={LeaveCalendarScreen} />
        
        <Stack.Screen name="LeadSignup" component={TeamLeadSignupScreen} />
        <Stack.Screen name="LeaveApproveScreen" component={LeaveApproveScreen} />

        <Stack.Screen name="adminsignup" component={AdminSignupScreen} />
        <Stack.Screen name="Adminhome" component={Adminhome}  options={{
    header: () => null, 
  }} />
   <Stack.Screen name="TeamLeadHome" component={TeamLeadHome}   options={{
    header: () => null, 
  }}/>
          <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
          <Stack.Screen name="LUserDetail" component={LUserDetail} />
<Stack.Screen name='ViewSurvey' component={ViewSurveys}/>

<Stack.Screen name="ViewResponses" component={ViewResponses} />
<Stack.Screen name="SelectUsers" component={SelectUsersPage} options={{
    header: () => null,}}/>
<Stack.Screen name="Se" component={SavedSurveysPage} options={{
    header: () => null,}} />
    <Stack.Screen name="password" component={ChangePassword} options={{
    header: () => null,}} />
<Stack.Screen name='Submissions' component={SPage}  options={{
    header: () => null,}}/>

<Stack.Screen name='TeamDetails' component={TeamD}  options={{
    header: () => null,}}/>
        <Stack.Screen name="ChatScreen" component={ChatScreen}  options={{
    header: () => null,}}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
