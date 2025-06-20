import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import { Stack } from "expo-router";
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

export default function RootLayout() {
  useEffect(() => {
    // Explicitly set the status bar style to dark for both platforms
    RNStatusBar.setBarStyle('dark-content'); // This works on both iOS and Android
  }, []);

  return (
    <>
      {/* Set the status bar style using ExpoStatusBar */}
      <ExpoStatusBar style="dark" />

      {/* Root container to set background color for the entire screen */}
      <View style={styles.container}>
        {/* Your stack navigation */}
        <Stack
          screenOptions={{
            headerShown: false, // Hide the header
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDEE9', // Set the background color for the entire body
  },
});
