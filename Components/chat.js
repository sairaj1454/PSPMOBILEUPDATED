import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { API_BASE_URL } from './config';

const ChatScreen = ({ route }) => {
  const { username } = route.params;
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat/${username}`, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const chatMessages = await response.json();
        setMessages(
          chatMessages.map((message) => ({
            _id: message._id,
            text: message.message,
            createdAt: new Date(message.createdAt),
            user: {
              _id: message.sender === username ? 1 : 2,
              name: message.sender,
            },
          })).reverse()
        );
      } else {
        console.error('Error fetching chat messages:', response.status);
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error.message);
    }
  };

  const onSend = async (newMessages = []) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverUsername: username,
          message: newMessages[0].text,
        }),
      });

      if (response.ok) {
        fetchMessages();
      } else {
        console.error('Error sending chat message:', response.status);
      }
    } catch (error) {
      console.error('Error sending chat message:', error.message);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  const renderBubble = (props) => {
    const { currentMessage } = props;
    const isSender = currentMessage.user._id === 1;
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: { backgroundColor: 'blue', borderRadius: 10 },
          right: { backgroundColor: 'lightblue', borderRadius: 10 },
        }}
        textStyle={{
          left: { color: 'white' },
          right: { color: 'black' },
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Display the back icon and username in a bar at the top */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>{username}</Text>
      </View>

      {/* Rest of your component */}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  backIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
});

export default ChatScreen;
