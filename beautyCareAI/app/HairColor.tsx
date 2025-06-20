import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native"; // Import navigation

export default function HairColor({ route }: any) {
    const { extractedData } = route.params || {};
    const [userData, setUserData] = useState<any>(null);
    const [recommendedHairColor, setRecommendedHairColor] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const navigation = useNavigation<any>();
    let Gender;
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`http://172.20.10.2:5000/user_services/get_user/${extractedData?.userId}`);
                setUserData(userResponse.data);
                Gender = userResponse.data.gender;
                // Prepare payload with necessary data
                const payload = {
                    "eye_color": extractedData?.eyeColor,
                    gender: userResponse.data.gender,
                    "hair_type": userResponse.data.hair_type,
                    occasion: userResponse.data.occasion,
                    "skin_color": extractedData?.skinColor,
                    "image": extractedData?.image
                };
                // Send the request for hair color recommendation
                const response = await axios.post('http://172.20.10.2:5000/ai_services/haircolor_recommendation', payload);
                setRecommendedHairColor(response.data); // Set recommended hair color data
                setLoading(false); // Stop loading after data is received

            } catch (error) {
                console.error('Error fetching user or recommendation data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [extractedData?.userId]);

    const decodeBase64Image = (base64String: string) => {
        return `data:image/png;base64,${base64String}`;
    };

    return (
        <View style={styles.container}>
            {loading ? (
                // Show loading screen
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Please wait, we are looking for the best hair color for you...</Text>
                </View>
            ) : (
                <View style={styles.content}>
                    <Text style={styles.header}>Here is the best for you!</Text>
                    {recommendedHairColor && (
                        <View>


                            {/* Conditionally show the image */}
                            <Image
                                source={{
                                    uri: decodeBase64Image(recommendedHairColor["Image"]) 
                                }}
                                style={styles.hairColorImage}
                            />
                        </View>
                    )}
                    <Text style={styles.hairColorName}>{recommendedHairColor["Predicted Hair Color"]}</Text>
                    <Text style={styles.description}>{recommendedHairColor.Description}</Text>
                </View>
            )}

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        marginTop: 20,
    },
    content: {
        alignItems: 'center',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 50,
    },
    hairColorName: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        color: '#666',
    },
    hairColorImage: {
        width: 250,
        height: 300,
        borderRadius: 10,
    },
    backButton: {
        width: 120, // Make each button take 48% of the width
        height: 50,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 80,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
    }
});
