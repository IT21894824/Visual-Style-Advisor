import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
},
innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',  // Align content to the left
    padding: 20,
},
title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'left', // Align title to left
    width: '100%',
},
inputContainer: {
    width: '100%',
    marginBottom: 15,
},
label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
    textAlign: 'left', // Align labels to left
},
input: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30, // Full rounded corners
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
},
picker: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 30, // Full rounded corners
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
},
hairTypePicker: {
    height: 70, // Increased height for Hair Type field
},
eyeColorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginBottom: 20,
},
eyeColorCircle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
},
eyeColorText: {
    color: '#fff',
    fontSize: 18,
},
buttonContainer: {
    flexDirection: 'row', // Align buttons horizontally
    justifyContent: 'space-between', // Ensure they are spaced apart
    width: '100%', // Full width to occupy the space
    marginTop: 20, // Space between input and buttons
},

nextButton: {
    width: '48%', // Make each button take 48% of the width
    height: 50,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
},

backButton: {
    width: '48%', // Make each button take 48% of the width
    height: 50,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
},
buttonText: {
    fontSize: 18,
    color: '#fff',
},
message: {
    fontSize: 18,
    color: '#777',
    marginTop: 20,
    textAlign: 'left', // Align message to left
},
});
export default styles;
