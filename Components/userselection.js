// SelectUsersPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { CheckBox, SearchBar } from 'react-native-elements';
import TopBar from './topbar';
import axios from 'axios';
import { Alert } from 'react-native';
import { API_BASE_URL } from './config';
import { Modal, ActivityIndicator } from 'react-native';

const SelectUsersPage = ({ route, navigation }) => {
  const { surveyTitle, questions } = route.params;
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const usersPerPage = 5;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUploadSuccess, setUploadSuccess] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/users`)
      .then(response => setAllUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const toggleUserSelection = (user) => {
    const isSelected = selectedUsers.some((selectedUser) => selectedUser._id === user._id);

    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((selectedUser) => selectedUser._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const toggleSelectAll = () => {
    const usersToSelect = allUsers.filter((user) => user.passwordChangeCount > 0);
    
    setSelectAll(!selectAll);
    setSelectedUsers(selectAll ? [] : usersToSelect);
  };
  const handleUploadSurvey = async () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Error', 'Please select at least one user to upload the survey.');
      return;
    }
  
    try {
      const surveyData = {
        title: surveyTitle,
        questions,
        accessibleUsers: selectedUsers.map((user) => user._id),
      };
  
      setModalVisible(true);

      const response = await axios.post(`${API_BASE_URL}/surveys`, surveyData);
  
      setModalVisible(false);

      console.log(response.data.message);
  
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
        navigation.navigate('createsurvey');
      }, 3000);
  
    } catch (error) {
      console.error('Error uploading survey:', error.message);
      setModalVisible(false);
    }
  };

  const renderUserItem = (user) => {
    const isSelected = selectedUsers.some((selectedUser) => selectedUser._id === user._id);
    const textColor = user.passwordChangeCount === 0 ? 'red' : 'green';

    const passwordChangedRecently = Date.now() - new Date(user.passwordChangedAt) < 7 * 24 * 60 * 60 * 1000;

    const handleUserSelection = () => {
      if (user.passwordChangeCount === 0) {
        Alert.alert('Error', 'Cannot assign survey to a user who has not changed the password.');
      } else {
        toggleUserSelection(user);
      }
    };

    return (
      <CheckBox
        key={user._id}
        title={user.username}
        checked={isSelected}
        onPress={handleUserSelection}
        textStyle={{ color: textColor }}
      />
    );
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <TopBar />
      <ScrollView style={styles.container}>
        <SearchBar
          placeholder="Search users..."
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          inputContainerStyle={styles.searchInputContainer}
          inputStyle={styles.searchInput}
          containerStyle={styles.searchBarContainer}
        />
        <CheckBox
          title="Select All"
          checked={selectAll}
          onPress={toggleSelectAll}
          containerStyle={styles.selectAllCheckbox}
        />
        <Text style={styles.titleText}>Selected Users:</Text>
        {selectedUsers.map((user) => (
          <Text key={user._id} style={styles.selectedUserText}>
            {user.username}
          </Text>
        ))}
        <TouchableOpacity
          style={styles.customUploadButton}
          onPress={handleUploadSurvey}
        >
          <Text style={styles.customButtonText}>Upload Survey</Text>
        </TouchableOpacity>
        <Text style={styles.titleText}>Select Users:</Text>
        {currentUsers.map(renderUserItem)}
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('createsurvey')}
        >
          <Text style={styles.backButtonText}>Back to Create Survey</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {isUploadSuccess ? (
              <>
                <Text style={styles.modalText}>Survey Uploaded Successfully!</Text>
                <ActivityIndicator size="large" color="maroon" />
              </>
            ) : (
              <Text style={styles.modalText}>Uploading Survey...</Text>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  selectedUserText: {
    marginTop: 5,
    color: 'green',
  },
  customUploadButton: {
    backgroundColor: 'maroon',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  customButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
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
    backgroundColor: 'gray',
  },
  paginationButtonText: {
    color: 'maroon',
    fontWeight: 'bold',
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    paddingHorizontal: 0,
  },
  searchInputContainer: {
    backgroundColor: 'lightgray',
    borderRadius: 10,
  },
  searchInput: {
    color: 'black',
  },
  backButton: {
    backgroundColor: 'maroon',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  selectAllCheckbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    margin: 0,
    padding: 0,
  },
});

export default SelectUsersPage;
