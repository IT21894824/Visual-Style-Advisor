import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./Login";
import WelcomeScreen from "./Welcome";
import SignUpScreen from "./SignUp";
import MenuScreen from "./Menu";
import HairCut from './HairCut';
import HairColor from './HairColor';
import Makeup from './Makeup';
import FashionDesign from './FashionDesign';
import LookAll from './LookAll';
import ProfilePage from './ProfilePage';
import Profile from './Profile';

import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function Index() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Menu" component={MenuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HairCut" component={HairCut} options={{ headerShown: false }} />
        <Stack.Screen name="HairColor" component={HairColor} options={{ headerShown: false }} />
        <Stack.Screen name="Makeup" component={Makeup} options={{ headerShown: false }} />
        <Stack.Screen name="FashionDesign" component={FashionDesign} options={{ headerShown: false }} />
        <Stack.Screen name="LookAll" component={LookAll} options={{ headerShown: false }} />
        <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
