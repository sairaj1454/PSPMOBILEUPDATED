import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Appbar, TextInput, Button, DataTable, Searchbar, IconButton, Card } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import TopBar from './topbar';
import { API_BASE_URL } from './config';

const AdminPanel = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Set the number of users to display per page
  const navigation = useNavigation();
  const Viewsurvey=()=>{
    navigation.navigate('ViewSurvey')
  }
 
  useEffect(() => {
    fetchUsers();
  }, [currentPage]); // Reload users when the page changes

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/usersadmin`);
      const usersWithSelection = response.data.map((user) => ({ ...user, isSelected: false }));
      setAllUsers(usersWithSelection);
      setFilteredUsers(usersWithSelection);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleManageUser = (userDetails) => {
    navigation.navigate('UserDetails', { userDetails });
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    const filtered = allUsers.filter((user) =>
      user.username.toLowerCase().includes(text.toLowerCase())
    );
    console.log('Filtered users:', filtered);
    setFilteredUsers(filtered);
  };
  
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItemContainer}
      onPress={() => handleManageUser(item)}
    >
      <Card style={styles.userCard}>
        <Card.Content>
          <View style={styles.userCardContent}>
            <Text style={styles.usernameText}>{item.username}</Text>
            {/* Add more user details if needed */}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );


  const renderUserDetails = () => {
    return null; // No need for user details in the current implementation
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Calculate the index range of the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Function to handle pagination button click
  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <TopBar />
      <Text style={styles.heading}>Admin Panel</Text>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Searchbar
            style={styles.searchBar}
            placeholder="Search users"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>

        
          <FlatList
            data={currentUsers}
            keyExtractor={(item) => item._id}
            renderItem={renderUserItem}
          />
        
        {renderUserDetails()}

        {/* Pagination buttons */}
        <View style={styles.paginationContainer}>
          {Array.from({ length: totalPages }).map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationButton,
                currentPage === index + 1 && styles.activePaginationButton,
              ]}
              onPress={() => handlePagination(index + 1)}
            >
              <Text style={styles.paginationButtonText}>{index + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Updated ViewSurvey as a custom button */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardText}>
              Explore the survey data and insights on the ViewSurvey page.
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
            onPress={Viewsurvey}
              mode="contained"
              style={styles.customViewSurveyButton}
              labelStyle={styles.customViewSurveyButtonText}
            >
              ViewSurvey
            </Button>
          </Card.Actions>
        </Card>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  t:{
backgroundColor:'lightgray',


  },userCard: {
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 2,
    width:'99%',
    marginLeft:2,
  },
  customViewSurveyButton: {
    marginTop: 20,
    backgroundColor: 'maroon', // Set your desired background color
    borderRadius: 10,
  },
  customViewSurveyButtonText: {
    color: 'white', // Set your desired text color
    fontWeight: 'bold',
  },
  customUploadButton: {
    backgroundColor: 'maroon',
    marginTop: 20,
    borderRadius: 10,
  },card: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor:'white',
  },
  cardText: {
    fontSize: 16,
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  userDetailsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    position: 'relative', // Make the container relative for absolute positioning of the close icon
  },
  link:{
marginTop:50,

justifyContent:'center',

textAlign:'center',
  },
  userDetailsHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItemContainer: {
    marginVertical: 5,
  },
  userItemBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
  },
  checkIcon: {
    alignSelf: 'flex-end',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },// ... (previous styles)

  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  paginationButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'maroon',
  },
  activePaginationButton: {
    backgroundColor: 'lightgray',
  },
  paginationButtonText: {
    color: 'maroon',
    fontWeight: 'bold',
  },
});

export default AdminPanel;
