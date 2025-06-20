import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from "@react-navigation/native"; // Import navigation

const eyeColors = [
    { color: 'Blue', code: '#0000FF' },
    { color: 'Green', code: '#008000' },
    { color: 'Brown', code: '#8B4513' },
    { color: 'Hazel', code: '#9E7D3B' },
    { color: 'Gray', code: '#808080' },
    { color: 'Black', code: '#000000' },
];
const skin_colors = [
    { color: 'Fair', code: '#FFE0BD' },
    { color: 'Medium', code: '#D2A679' },
    { color: 'Tan', code: '#A5694F' },
    { color: 'Dark', code: '#603A2B' },
];
const favorite_colors = [
    { color: 'Red', code: '#FF0000' },
    { color: 'Blue', code: '#0000FF' },
    { color: 'Green', code: '#008000' },
    { color: 'Yellow', code: '#FFFF00' },
    { color: 'Purple', code: '#800080' },
    { color: 'Orange', code: '#FFA500' },
    { color: 'Pink', code: '#FFC0CB' },
    { color: 'Black', code: '#000000' },
    { color: 'White', code: '#FFFFFF' },
    { color: 'Gray', code: '#808080' },
    { color: 'Brown', code: '#8B4513' },
    { color: 'Teal', code: '#008080' }
];
const occupations = ['Artist', 'Engineer', 'Doctor', 'Teacher', 'Student'];
const hairTypes = ['Straight', 'Curly', 'Wavy', 'Kinky'];
const lookTypes = ['Natural', 'Trendy', 'Professional'];
const occasions = ['Casual', 'Formal', 'Party', 'Sport'];
const multiTonal = ['Yes', 'No'];

export default function ProfilePage({ route }: any) {
    const { userID } = route.params || {};
    const [step, setStep] = useState(1); // To track the current step
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [occupation, setOccupation] = useState('');
    const [hairType, setHairType] = useState(hairTypes[0]);
    const [eyeColor, setEyeColor] = useState('');
    const [skinColor, setSkinColor] = useState('');
    const [lookType, setLookType] = useState(lookTypes[0]); // Default to 'Natural'
    const [multiTon, setMultiTon] = useState(multiTonal[0]); // Default to 'Yes'
    const [occasion, setOccasion] = useState(occasions[0]); // Default to 'Casual'
    const [password, setPassword] = useState('');
    const [favColors, setFavColors] = useState(''); // Using an array to store favorite colors
    const navigation = useNavigation<any>();

    useEffect(() => {
        const fetchUserData = async () => {
            try {

                const response = await fetch(`http://172.20.10.2:5000/user_services/get_user/${userID}`); // Replace with your API endpoint
                const data = await response.json();

                if (response.ok) {
                    // Initialize the state with the user's data
                    setEmail(data.email);
                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    setGender(data.gender);
                    setOccupation(data.occupation);
                    setHairType(data.hair_type);
                    setEyeColor(data.eye_color);
                    setSkinColor(data.skin_color);
                    setLookType(data.look_type);
                    setMultiTon(data.multi_tonal);
                    setOccasion(data.occasion);
                    setFavColors(data.colors); // Assuming this is an array
                } else {
                    Alert.alert('Error', data.error || 'Unable to fetch user data.');
                }
            } catch (error) {
                Alert.alert('Error', 'Unable to reach the server. Please try again later.');
                console.error('Fetch user data error:', error);
            }
        };

        fetchUserData();
    }, []);
    const handleUpdate = async () => {

        // Construct the payload to send to the backend
        const payload: any = {}; // Initialize an empty object

        // Add fields conditionally
        if (favColors.length > 0) payload.colors = favColors;
        if (email) payload.email = email;
        if (eyeColor) payload.eye_color = eyeColor;
        if (skinColor) payload.skin_color = skinColor;
        if (firstName) payload.first_name = firstName;
        if (gender) payload.gender = gender;
        if (hairType) payload.hair_type = hairType;
        if (lastName) payload.last_name = lastName;
        if (lookType) payload.look_type = lookType;
        if (multiTon) payload.multi_tonal = multiTon;
        if (occasion) payload.occasion = occasion;
        if (occupation) payload.occupation = occupation;
        if (password) payload.password = password;

        // Add default values for the fields that are always included
        payload.factors = 'None';
        payload.restrictions = 'None';
        try {
            const response = await fetch(`http://172.20.10.2:5000/user_services/update/${userID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Update-up successful');
                navigation.navigate('Profile',{ userID: userID});
            } else {
                Alert.alert('Error', data.error || 'Something went wrong.');
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to reach server. Please try again later.');
            console.error('Update-up error:', error);
        }
    };



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Update User Details</Text>

                {step === 1 && (
                    <>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>First Name</Text>
                            <TextInput
                                label="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Last Name</Text>
                            <TextInput
                                label="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                style={styles.input}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                                <Text style={styles.buttonText}>Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setStep(2)} style={styles.nextButton}>
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Text style={styles.label}>Gender</Text>
                        <RadioButton.Group onValueChange={setGender} value={gender}>
                            <RadioButton.Item label="Male" value="Male" />
                            <RadioButton.Item label="Female" value="Female" />
                        </RadioButton.Group>

                        <Text style={styles.label}>Occupation</Text>
                        <Picker selectedValue={occupation} onValueChange={setOccupation} style={styles.picker}>
                            {occupations.map((occupation) => (
                                <Picker.Item key={occupation} label={occupation} value={occupation} />
                            ))}
                        </Picker>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backButton}>
                                <Text style={styles.buttonText}>Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setStep(step + 1)} style={styles.nextButton}>
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                        </View>

                    </>
                )}

                {step === 3 && (
                    <>
                        <Text style={styles.label}>Hair Type</Text>
                        <Picker selectedValue={hairType} onValueChange={setHairType} style={[styles.picker, styles.hairTypePicker]}>
                            {hairTypes.map((hairType) => (
                                <Picker.Item key={hairType} label={hairType} value={hairType} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Eye Color</Text>
                        <View style={styles.eyeColorContainer}>
                            {eyeColors.map((color) => (
                                <TouchableOpacity
                                    key={color.color}
                                    style={[styles.eyeColorCircle, { backgroundColor: color.code }]}
                                    onPress={() => setEyeColor(color.color)}
                                >
                                    {eyeColor === color.color && (
                                        <Text style={styles.eyeColorText}>✔</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Skin Color</Text>
                        <View style={styles.eyeColorContainer}>
                            {skin_colors.map((color) => (
                                <TouchableOpacity
                                    key={color.color}
                                    style={[styles.eyeColorCircle, { backgroundColor: color.code }]}
                                    onPress={() => setSkinColor(color.color)}
                                >
                                    {skinColor === color.color && (
                                        <Text style={styles.eyeColorText}>✔</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Favourite Color</Text>
                        <View style={styles.eyeColorContainer}>
                            {favorite_colors.map((color) => (
                                <TouchableOpacity
                                    key={color.color}
                                    style={[styles.eyeColorCircle, { backgroundColor: color.code }]}
                                    onPress={() => setFavColors(color.color)}
                                >
                                    {favColors.includes(color.color) && (
                                        <Text style={styles.eyeColorText}>✔</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backButton}>
                                <Text style={styles.buttonText}>Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setStep(step + 1)} style={styles.nextButton}>
                                <Text style={styles.buttonText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {step === 4 && (
                    <>
                        <Text style={styles.label}>Look Type</Text>
                        <Picker selectedValue={lookType} onValueChange={setLookType} style={styles.picker}>
                            {lookTypes.map((lookType) => (
                                <Picker.Item key={lookType} label={lookType} value={lookType} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Multi-Tonal</Text>
                        <Picker selectedValue={multiTon} onValueChange={setMultiTon} style={styles.picker}>
                            {multiTonal.map((multiTon) => (
                                <Picker.Item key={multiTon} label={multiTon} value={multiTon} />
                            ))}
                        </Picker>

                        <Text style={styles.label}>Occasion</Text>
                        <Picker selectedValue={occasion} onValueChange={setOccasion} style={styles.picker}>
                            {occasions.map((occasion) => (
                                <Picker.Item key={occasion} label={occasion} value={occasion} />
                            ))}
                        </Picker>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backButton}>
                                <Text style={styles.buttonText}>Back</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleUpdate} style={styles.nextButton}>
                                <Text style={styles.buttonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    );
}

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
