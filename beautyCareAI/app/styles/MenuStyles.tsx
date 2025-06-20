import { StyleSheet } from 'react-native';

const MenuStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  captureButtonContainer: {
    marginBottom: 50,
  },
  captureButton: {
    backgroundColor: '#1e1e1e',
    borderRadius: 50,
    padding: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  capturedImage: {
    width: 300,
    height: 400,
    borderRadius: 15,
    marginBottom: 30,
  },
  optionsContainer: {
    width: '80%',
    padding: 20,
  },
  optionButton: {
    backgroundColor: '#1e1e1e',
    borderRadius: 25,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
});
export default MenuStyles;