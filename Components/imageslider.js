import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons (you can use a different icon library)

const ImageSliderWithText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNextPress = () => {
    if (currentIndex < imageData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevPress = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1 });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderDot = (index) => {
    return (
      <View
        style={[
          styles.dot,
          { backgroundColor: index === currentIndex ? 'maroon' : 'gray' },
        ]}
        key={index}
      />
    );
  };

  const imageData = [
    {
      image: 'https://techstl.com/wp-content/uploads/Perficient-1.png',
      text: 'Perficient',
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTStR0d80gjJQtqM6p2Kb9eVKFgDfVcYFr233A5yRbtFj2cILkZM0Q-fOmqQseErNAdUhY&usqp=CAU',
      text: 'Perficient',
    },
    {
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCUuPQjaXgJkMvIKFEl_ycT10dRqYGe52Hig&usqp=CAU',
      text: 'perficient',
    },
    // Add more online image URLs and text as needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.textAboveSlider}>Let's Make Survey Easy</Text>
      <FlatList
        ref={flatListRef}
        data={imageData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => `${item.image}-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <ImageBackground
              source={{ uri: item.image }} // Use the 'uri' attribute for online images
              style={styles.image}
            >
              <Text style={styles.imageText}>{item.text}</Text>
            </ImageBackground>
          </View>
        )}
      />
      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={handlePrevPress}>
          <Ionicons name="arrow-back" size={24} color="gray" />
        </TouchableOpacity>
        {imageData.map((_, index) => renderDot(index))}
        <TouchableOpacity onPress={handleNextPress}>
          <Ionicons name="arrow-forward" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop:20,
  },
  textAboveSlider: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
    margin: 10,
    color:'gray',
  },
  slide: {
    width: 300,
    height: 200,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
   
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'gray',
    margin: 5,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  imageText: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: 16,
    padding: 10,
  },
});

export default ImageSliderWithText;
