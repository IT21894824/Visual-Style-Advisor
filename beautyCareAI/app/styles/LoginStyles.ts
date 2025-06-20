import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.05,  // Dynamic padding based on width
  },
  title: {
    fontSize: width * 0.1,  // Relative font size based on screen width
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.1,  // Adjust margin bottom dynamically
  },
  input: {
    width: "90%",  // Make the input field wider (90% of the screen width)
    height: 50,
    backgroundColor: "#333",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "white",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    elevation: 5,
    

  },
  loginButton: {
    width: "50%",  // Adjust width dynamically to fit different screen sizes
    height: 50,
    backgroundColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: 20,
    marginLeft: width * 0.25,  // Adjust margin left dynamically
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    marginTop: height * 0.05,  // Adjust margin top dynamically based on height
    fontSize: 16,
    color: "#555",
  },
});
