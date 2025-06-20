import { View, Text, StyleSheet } from 'react-native';

export default function FashionDesign({ route }: any) {
    const { extractedData } = route.params || {};

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Fashion Design Recommendations</Text>
            <Text style={styles.text}>Eye Color: {extractedData?.eyeColor}</Text>
            <Text style={styles.text}>Eyebrow Shape: {extractedData?.eyebrowShape}</Text>
            <Text style={styles.text}>Face Shape: {extractedData?.faceShape}</Text>
            <Text style={styles.text}>Lip Shape: {extractedData?.lipShape}</Text>
            {/* Add your fashion design recommendations here based on the extracted data */}
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        marginVertical: 5,
    },
});
