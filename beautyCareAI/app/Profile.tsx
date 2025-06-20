import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native"; // Import navigation

const screenWidth = Dimensions.get('window').width; // Get screen width for responsive design
const screenHeight = Dimensions.get('window').height; // Get screen height for responsive design

const API_ENDPOINT = 'http://172.20.10.2:5000/user_services'; // Store API endpoint in a variable

const Profile = ({ route }: any) => {
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });
    const navigation = useNavigation<any>();
    const { userID } = route.params || {};

    // Fetch user profile data
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}/get_user/${userID}`);
                const data = await response.json();

                if (response.ok) {
                    setUserData(data);
                } else {
                    Alert.alert('Error', 'Failed to fetch user data');
                }
            } catch (error) {
                Alert.alert('Error', 'Unable to reach server');
            }
        };

        fetchUserProfile();
    }, [userID]);

    const handleLogout = () => {
        // Perform logout functionality, like clearing session or token
        navigation.navigate('Login');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>User Profile</Text>
            </View>

            <View style={styles.profileContainer}>
                <View style={styles.infoContainer}>
                    <Text style={styles.label}>First Name:</Text>
                    <Text style={styles.value}>{userData.first_name}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Last Name:</Text>
                    <Text style={styles.value}>{userData.last_name}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{userData.email}</Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => navigation.navigate("ProfilePage", { userID: userID })}
                style={styles.editButton}
            >
                <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleLogout}
                style={[styles.logoutButton, styles.button]}
            >
                <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>

            {/* Make sure the back button is placed dynamically */}
            <TouchableOpacity
                onPress={() => navigation.navigate("Welcome", { userId: userID })}
                style={[styles.backButton, { left: screenWidth * 0.05, bottom: screenHeight * 0.15 }]} // Dynamically placed
            >
                <Text style={styles.buttonText1}>Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 150,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1e1e1e',
    },
    profileContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 40,
    },
    infoContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
    },
    value: {
        fontSize: 18,
        color: '#333',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#FF6347',
    },
    button: {
        padding: 15,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '600',
    },
    backButton: {
        width: screenWidth * 0.2,  // Make back button width responsive
        height: 50,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        position: 'absolute', // Positioning the button absolutely
    },
    buttonText1: {
        fontSize: 18,
        color: '#fff',
    }
});

export default Profile;
