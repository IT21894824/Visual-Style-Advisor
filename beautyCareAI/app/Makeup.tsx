import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native"; // Import navigation

// Config for API Endpoints (in a separate file or environment variable)
const API_BASE_URL = 'http://172.20.10.2:5000';

export default function MakeUp({ route }: any) {
    const { extractedData } = route.params || {};
    const [userData, setUserData] = useState<any>(null);
    const [recommendedMakeup, setRecommendedMakeup] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const navigation = useNavigation<any>();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`${API_BASE_URL}/user_services/get_user/${extractedData?.userId}`);
                setUserData(userResponse.data);

                // Prepare payload with necessary data
                const payload = {
                    eye_color: extractedData?.eyeColor, // from extracted data
                    gender: 'Female', // Gender is always Female
                    hair_type: userResponse.data.hair_type,
                    look_type: userResponse.data.look_type,
                    multi_tonal: userResponse.data.multi_tonal,
                    occasion: userResponse.data.occasion,
                    eyebrow_shape: extractedData?.eyebrowShape,
                    face_shape: extractedData?.faceShape,
                    lip_shape: extractedData?.lipShape,
                    skin_color: userResponse.data.skin_color,
                };

                // Send the request for makeup recommendation
                const response = await axios.post(`${API_BASE_URL}/ai_services/makeup_recommendation`, payload);
                setRecommendedMakeup(response.data); // Set recommended makeup data
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
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                // Show loading screen
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Please wait, we are looking for the best makeup for you...</Text>
                </View>
            ) : (
                <View style={styles.content}>
                    {recommendedMakeup && (
                        <View style={styles.makeupContent}>
                            <Text style={styles.styleName}>{recommendedMakeup["Makeup Recommendation"]}</Text>
                            <Text style={styles.description}>{recommendedMakeup["Makeup Details"]?.description}</Text>

                            {/* Conditionally show the image */}
                            <Image
                                source={{
                                    uri: decodeBase64Image(recommendedMakeup["Makeup Details"]?.image),
                                }}
                                style={styles.makeupImage}
                            />
                            
                            {/* Display makeup details */}
                            <Text style={styles.detailsHeader}>Makeup Details</Text>
                            <Text style={styles.detailsText}>Cheekbone Makeup: {recommendedMakeup["Makeup Details"]?.cheekbone_makeup}</Text>
                            <Text style={styles.detailsText}>Eyeliner: {recommendedMakeup["Makeup Details"]?.eyeliner}</Text>
                            <Text style={styles.detailsText}>Eyeshadow: {recommendedMakeup["Makeup Details"]?.eyeshadow}</Text>
                            <Text style={styles.detailsText}>Foundation: {recommendedMakeup["Makeup Details"]?.foundation}</Text>
                            <Text style={styles.detailsText}>Lips: {recommendedMakeup["Makeup Details"]?.lips}</Text>
                            <Text style={styles.detailsText}>Nose Makeup: {recommendedMakeup["Makeup Details"]?.nose_makeup}</Text>
                        </View>
                    )}
                </View>
            )}

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // Makes sure the content grows to fill the available space
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
        width: '100%',
    },
    makeupContent: {
        alignItems: 'center',
        width: '100%',
        paddingBottom: 20,
    },
    styleName: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        color: '#666',
        textAlign: 'center',
    },
    makeupImage: {
        width: 350,
        height: 300,
        borderRadius: 10,
        marginLeft: 10,
        marginTop: 20,
    },
    detailsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    detailsText: {
        fontSize: 12,
        color: '#666',
        marginTop: 10,
        textAlign: 'center',
    },
    backButton: {
        width: 120, // Make each button take 48% of the width
        height: 50,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
    }
});
