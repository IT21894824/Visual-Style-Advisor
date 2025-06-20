import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native"; // Import navigation
export default function HairCut({ route }: any) {
    const { extractedData } = route.params || {};
    const [userData, setUserData] = useState<any>(null);
    const [recommendedHaircut, setRecommendedHaircut] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const navigation = useNavigation<any>();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`http://172.20.10.2:5000/user_services/get_user/${extractedData?.userId}`);
                setUserData(userResponse.data);
                const payload = {
                    Gender: userResponse.data.gender,
                    "Hair Type": userResponse.data.hair_type,
                    "Face Shape": extractedData?.faceShape,
                    "Look Type": userResponse.data.look_type,
                    "Occasion": userResponse.data.occasion,
                    "image": extractedData?.image
                };

                // Now, send the payload to get haircut recommendations
                const response = await axios.post('http://172.20.10.2:5000/ai_services/haircut_recommendation', payload);
                setRecommendedHaircut(response.data); // Set recommended haircut data
                setLoading(false); // Stop loading after data is received
            } catch (error) {
                console.error('Error fetching user or recommendation data:', error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [extractedData?.userId]);

    const decodeBase64Image = (base64String: string) => {
        // Debugging the base64 string
        return `data:image/png;base64,${base64String}`;
    };
const imageBase64 = recommendedHaircut
    ? userData?.gender === 'Female'
        ? recommendedHaircut["Image for Female"]
        : recommendedHaircut["Image for Male"]
    : null;

const haircutUri = imageBase64 ? decodeBase64Image(imageBase64) : null;
    return (
        <View style={styles.container}>
            {loading ? (
                // Show loading screen
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Please wait, we are looking for the best haircut for you...</Text>
                </View>
            ) : (
                <View style={styles.content}>

                    <Text style={styles.header}>Here is the best for you!</Text>
                    {recommendedHaircut && (
                        <View>

                           {haircutUri ? (
    <Image
        source={{ uri: haircutUri }}
        style={styles.haircutImage}
    />
) : (
    <Text style={styles.errorText}>
        Unable to load image. Please try capturing again.
    </Text>
)}
                        </View>
                    )}
                    <Text style={styles.haircutName}>{recommendedHaircut["Haircut Name"]}</Text>
                    <Text style={styles.description}>{recommendedHaircut.Description}</Text>

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
    haircutName: {
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
    haircutImage: {
        width: 250,
        height: 350,
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
    },
    errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
}

});
