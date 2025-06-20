import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ImageBackground, Dimensions, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

// Save the endpoint URL in a variable
const API_URL = 'http://172.20.10.2:5000/user_services';
const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ route }: any) {
  const { userId } = route.params || {};
  const navigation = useNavigation<any>();
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [gender, setGender] = useState<string | null>(null);
  const [occasion, setOccasion] = useState("Casual");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/get_user/${userId}`);
        const data = await response.json();
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setGender(data.gender);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleNext = async () => {
    const payload = { occasion };
    try {
      await fetch(`${API_URL}/update/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Error updating occasion:", error);
    }
    navigation.navigate("Menu", { userId, gender });
  };

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return "U";
  };

  // Get screen dimensions
  const { width, height } = Dimensions.get('window');

  return (
    <ImageBackground
      source={require('../assets/images/bg-light.png')}
      style={[styles.container, { width, height }]}  // Dynamically adjust container
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#1e1e1e" />
        ) : (
          <>
            {/* Profile Circle */}
            <View style={[styles.profileContainer, { top: height * 0.05 }]}>
              <View style={styles.profileCircle}>
                <TouchableOpacity onPress={() => navigation.navigate("Profile", { userID: userId })}>
                  <Text style={styles.profileInitials}>{getInitials()}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Welcome Message */}
            <Text style={[styles.title, { fontSize: width * 0.07 }]}>Welcome to</Text>
            <Text style={[styles.appName, { fontSize: width * 0.1 }]}>BeautiCare AI!</Text>

            {/* User's Name Greeting */}
            <Text style={[styles.text, { fontSize: width * 0.05 }]}>
              Hello, {firstName} {lastName}!
            </Text>

            <Text style={styles.textb}>Please Select the occasion and find your uniques!</Text>

            {/* Occasion Dropdown */}
            <Picker
              selectedValue={occasion}
              style={[styles.picker, { width: width * 0.8, height: height * 0.07, paddingVertical: 10 }]}  // Adjust height dynamically
              onValueChange={(itemValue) => setOccasion(itemValue)}
            >
              <Picker.Item label="Casual" value="Casual" />
              <Picker.Item label="Formal" value="Formal" />
              <Picker.Item label="Party" value="Party" />
              <Picker.Item label="Sport" value="Sport" />
            </Picker>

            {/* Circular Button */}
            <TouchableOpacity style={[styles.nextButton, { marginTop: height * 0.05 }]} onPress={handleNext}>
              <Ionicons name="arrow-forward" size={28} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  profileContainer: {
    position: "absolute",
    left: 20,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1e1e1e",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
    marginTop: 50,
  },
  appName: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  text: {
    color: "#fff",
    marginBottom: 10,
  },
  textb: {
    fontSize: width * 0.04,  // Font size will be 4% of the screen width
    color: "#333",
    marginBottom: 20,
  },
  nextButton: {
    width: 60,
    height: 60,
    backgroundColor: "#1e1e1e",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    elevation: 5,
  },
  picker: {
    backgroundColor: "#fff",
    marginBottom: 20,
  }
});
