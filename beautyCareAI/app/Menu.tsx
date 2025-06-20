import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from "@react-navigation/native"; // Import navigation

import Icon from 'react-native-vector-icons/FontAwesome';

// Base API URL, dynamically configurable
const API_BASE_URL = 'http://172.20.10.2:5000/extraction_services/image_extract';

export default function App({ route }: any) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(true); // State to control camera visibility
    const [extractedData, setExtractedData] = useState<any>(null); // To store extracted data
    const cameraRef = useRef<CameraView>(null); // Reference to CameraView
    const navigation = useNavigation<any>();

    const { userId, gender } = route.params || {}; // Access gender from route params

    const { width, height } = Dimensions.get('window'); // Get window dimensions

    // Check if permission is granted
    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    const captureImage = async () => {
        if (cameraRef.current) {
            try {
                setLoading(true);
                const photo = await cameraRef.current.takePictureAsync({
                    base64: true,
                });

                if (photo && photo.base64) {
                    setCapturedImage(photo.base64); // Save the base64 string
                    setCameraVisible(false); // Hide camera after capturing
                    processImage(photo.base64); // Process image data
                } else {
                    console.error('No base64 image data returned');
                }
            } catch (error) {
                console.error('Error capturing image:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const processImage = async (base64: string) => {
        if(base64 !== null){
            console.log('base64 revcvd');
        }
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64 }),
            });
            const data = await response.json();

            setExtractedData(data);
        } catch (error) {
            console.error('Error processing image:', error);
        }
    };

    const handleButtonPress = (buttonType: string) => {
        if (!extractedData) return;

        const dataToPass = {
            userId: userId,
            eyeColor: extractedData.haircolor.eye_color,
            skinColor: extractedData.haircolor.skin_color,
            eyebrowShape: extractedData.makeup.eyebrow_shape,
            faceShape: extractedData.haircut.face_shape,
            lipShape: extractedData.makeup.lip_shape,
            image: capturedImage,
        };

        switch (buttonType) {
            case 'Look Haircut':
                navigation.navigate('HairCut', { extractedData: dataToPass });
                break;
            case 'Look Hair Color':
                navigation.navigate('HairColor', { extractedData: dataToPass });
                break;
            case 'Look Makeup':
                navigation.navigate('Makeup', { extractedData: dataToPass });
                break;
            case 'Look Fashion Design':
                navigation.navigate('FashionDesign', { extractedData: dataToPass });
                break;
            case 'Look All':
                navigation.navigate('LookAll', { extractedData: dataToPass });
                break;
            default:
                console.warn('Unknown button type');
                break;
        }
    };

    return (
        <View style={styles.container}>
            {cameraVisible ? (
                <CameraView style={[styles.camera, { width, height: height * 0.5 }]} facing={facing} ref={cameraRef}>
                    <View style={[styles.cameraControls, { width }]}>
                        {/* Capture Button */}
                        <TouchableOpacity style={[styles.buttonc, { width: width * 0.4 }]} onPress={captureImage}>
                            <Text style={styles.textc}>Capture</Text>
                        </TouchableOpacity>

                        {/* Flip Camera Button */}
                        <TouchableOpacity style={[styles.buttonc, { width: width * 0.4 }]} onPress={toggleCameraFacing}>
                            <Text style={styles.textc}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            ) : (
                <View style={[styles.resultContainer, { width, height: height * 0.45 }]}>
                    {capturedImage && (
                        <Image source={{ uri: `data:image/png;base64,${capturedImage}` }} style={[styles.image, { width: width * 0.9, height: height * 0.3 }]} />
                    )}
                    {extractedData && (
                        <View style={styles.dataContainer}>
                            <Text style={styles.text}>Extracted Data:</Text>
                            <Text style={styles.dataText}>Eye Color: {extractedData.haircolor.eye_color}</Text>
                            <Text style={styles.dataText}>Eyebrow Shape: {extractedData.makeup.eyebrow_shape}</Text>
                            <Text style={styles.dataText}>Face Shape: {extractedData.haircut.face_shape}</Text>
                            <Text style={styles.dataText}>Lip Shape: {extractedData.makeup.lip_shape}</Text>
                        </View>
                    )}
                </View>
            )}

            {loading && <ActivityIndicator size="large" color="#1e1e1e" />}

            {extractedData && (
                <View style={styles.buttonSection}>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.roundedBox} onPress={() => handleButtonPress('Look Haircut')}>
                            <Icon name="cut" size={30} color="white" />
                            <Text style={styles.buttonText}>Hair Cut</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundedBox} onPress={() => handleButtonPress('Look Hair Color')}>
                            <Icon name="user" size={30} color="white" />
                            <Text style={styles.buttonText}>Hair Color</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.roundedBox, gender !== 'Female' && styles.disabledButton]}
                            onPress={() => gender === 'Female' ? handleButtonPress('Look Makeup') : null}
                            disabled={gender !== 'Female'}
                        >
                            <Icon name="venus" size={30} color="white" />
                            <Text style={styles.buttonText}>Makeup</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.roundedBox} onPress={() => handleButtonPress('Look Fashion Design')}>
                            <Icon name="user-circle" size={30} color="white" />
                            <Text style={styles.buttonText}>Fashion Design</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.lookAllContainer}>
                        <TouchableOpacity style={styles.lookAllButton} onPress={() => handleButtonPress('Look All')}>
                            <Text style={styles.buttonText}>Look All</Text>
                            <Icon name="arrow-right" size={20} color="white" style={styles.arrowIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {!cameraVisible && (
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.buttonText1}>Back</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        justifyContent: 'space-between',
        paddingTop: 40, // Ensure space for the status bar
    },
    camera: {
        flex: 1, // Flexible height
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cameraControls: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    buttonc: {
        backgroundColor: '#000',
        paddingVertical: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textc: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultContainer: {
        flex: 1, // Flexible height
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 'auto',
        borderRadius: 15,
        marginBottom: 20,
    },
    dataContainer: {
        width: '90%',
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        marginBottom: 20,
    },
    dataText: {
        fontSize: 16,
        color: 'white',
    },
    buttonSection: {
        paddingBottom: 20,
        alignItems: 'center',
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    roundedBox: {
        width: '40%',
        height: 100,
        borderRadius: 15,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        padding: 10,
    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    lookAllContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    lookAllButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 30,
    },
    arrowIcon: {
        marginLeft: 10,
    },
    backButton: {
        width: 80,
        height: 50,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        position: 'absolute',
        bottom: 10,
        left: 10,
    },
    buttonText1: {
        fontSize: 18,
        color: '#fff',
    },
    disabledButton: {
        opacity: 0.5,
        backgroundColor: '#d3d3d3',
    },
});
