import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";

// API Endpoint configuration
const API_BASE_URL = 'http://172.20.10.2:5000';

export default function LookAll({ route }: any) {
    const { extractedData } = route.params || {};
    const [userData, setUserData] = useState<any>(null);
    const [haircutData, setHaircutData] = useState<any>(null);
    const [haircolorData, setHaircolorData] = useState<any>(null);
    const [haircutNcolor, setHaircutNcolorData] = useState<any>(null);
    const [makeupData, setMakeupData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigation = useNavigation<any>();

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userResponse = await axios.get(`${API_BASE_URL}/user_services/get_user/${extractedData?.userId}`);
                setUserData(userResponse.data);

                const payloadHairCut = {
                    Gender: userResponse.data.gender,
                    "Hair Type": userResponse.data.hair_type,
                    "Face Shape": extractedData?.faceShape,
                    "Look Type": userResponse?.data.look_type,
                    "Occasion": userResponse?.data.occasion,
                    "image": extractedData?.image
                };
                const payloadHairColor = {
                    "eye_color": extractedData?.eyeColor,
                    gender: userResponse?.data.gender,
                    "hair_type": userResponse?.data.hair_type,
                    occasion: userResponse?.data.occasion,
                    "skin_color": extractedData?.skinColor,
                    "image": extractedData?.image
                };

                const haircutResponse = await axios.post(`${API_BASE_URL}/ai_services/haircut_recommendation`, payloadHairCut);
                setHaircutData(haircutResponse.data);

                const haircolorResponse = await axios.post(`${API_BASE_URL}/ai_services/haircolor_recommendation`, payloadHairColor);
                setHaircolorData(haircolorResponse.data);

                if (haircutResponse.data && haircolorResponse.data) {
                    const payloadHairCutNColor = {
                        "Predicted Hair Color": haircolorResponse.data["Predicted Hair Color"],
                        "Image": haircutResponse.data['Image for Female'] === 'null' ? haircutResponse.data['Image for Male'] : haircutResponse.data['Image for Female']
                    };
                    const haircutNcolorResponse = await axios.post(`${API_BASE_URL}/ai_services/get_haircolor`, payloadHairCutNColor);
                    setHaircutNcolorData(haircutNcolorResponse.data);
                }

                if (userResponse.data.gender === 'Female') {
                    const payloadMakeUp = {
                        eye_color: extractedData?.eyeColor,
                        gender: 'Female',
                        hair_type: userResponse.data.hair_type,
                        look_type: userResponse.data.look_type,
                        multi_tonal: userResponse.data.multi_tonal,
                        occasion: userResponse.data.occasion,
                        eyebrow_shape: extractedData?.eyebrowShape,
                        face_shape: extractedData?.faceShape,
                        lip_shape: extractedData?.lipShape,
                        skin_color: userResponse.data.skin_color,
                    };
                    const makeupResponse = await axios.post(`${API_BASE_URL}/ai_services/makeup_recommendation`, payloadMakeUp);
                    setMakeupData(makeupResponse.data);
                }

                setLoading(false);
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
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={styles.loadingText}>Please wait, we are gathering all your details...</Text>
                    </View>
                ) : (
                    <View style={styles.content}>
                        <Text style={styles.header}>Recommended Hair Cut & Color</Text>
                        {haircutData && haircolorData && (
                            <View style={styles.section}>
                                <Text style={styles.haircutName}>{haircutData["Haircut Name"]} & {haircolorData["Predicted Hair Color"]}</Text>
                                <Image
                                    source={{ uri: decodeBase64Image(haircutNcolor["image"]) }}
                                    style={[styles.haircutImage, { height: screenHeight * 0.5 }]}
                                />
                            </View>
                        )}

                        {userData?.gender === 'Female' && (
                            <>
                                <Text style={styles.header}>Recommended MakeUp</Text>
                                {makeupData && (
                                    <View style={styles.section}>
                                        <Text style={styles.styleName}>{makeupData["Makeup Recommendation"]}</Text>
                                        <Text style={styles.description}>{makeupData["Makeup Details"]?.description}</Text>
                                        <Image
                                            source={{ uri: decodeBase64Image(makeupData["Makeup Details"]?.image) }}
                                            style={[styles.makeupImage, { height: screenHeight * 0.5 }]}
                                        />
                                        <Text style={styles.detailsHeader}>Makeup Details</Text>
                                        <Text style={styles.detailsText}>Cheekbone Makeup: {makeupData["Makeup Details"]?.cheekbone_makeup}</Text>
                                        <Text style={styles.detailsText}>Eyeliner: {makeupData["Makeup Details"]?.eyeliner}</Text>
                                        <Text style={styles.detailsText}>Eyeshadow: {makeupData["Makeup Details"]?.eyeshadow}</Text>
                                        <Text style={styles.detailsText}>Foundation: {makeupData["Makeup Details"]?.foundation}</Text>
                                        <Text style={styles.detailsText}>Lips: {makeupData["Makeup Details"]?.lips}</Text>
                                        <Text style={styles.detailsText}>Nose Makeup: {makeupData["Makeup Details"]?.nose_makeup}</Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Back Button outside of ScrollView */}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 20,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 400,
    },
    loadingText: {
        fontSize: 18,
        marginTop: 100,
        marginBottom: 250,
    },
    content: {
        alignItems: 'center',
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    styleName: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
        color: '#666',
    },
    haircutName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    section: {
        width: '100%',
        marginBottom: 30,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    haircutImage: {
        borderRadius: 10,
        marginTop: 10,
    },
    makeupImage: {
        borderRadius: 10,
        marginTop: 10,
    },
    detailsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
    },
    detailsText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    },
    backButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    backButton: {
        width: '40%',
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
});
