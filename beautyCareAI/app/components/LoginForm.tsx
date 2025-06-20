import React from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { LoginStyles } from '../styles/LoginStyles';

interface LoginFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleLogin: () => void;
  loading: boolean;
  navigation: any;
}

const LoginForm: React.FC<LoginFormProps> = ({ email, setEmail, password, setPassword, handleLogin, loading, navigation }) => {
  return (
    <LinearGradient colors={["#f5f5f5", "#B5FFFC"]} style={LoginStyles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
        <View style={LoginStyles.innerContainer}>
          <Text style={LoginStyles.title}>Beauti Care Ai!</Text>

          <TextInput
            style={LoginStyles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={LoginStyles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={LoginStyles.loginButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={LoginStyles.loginText}>Login</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={LoginStyles.signupText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default LoginForm;
